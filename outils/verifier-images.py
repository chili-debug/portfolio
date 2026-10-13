#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verifie les images du portfolio.

    python outils/verifier-images.py

Le script lit les chemins d'images cites dans data/*.js et, pour chacun :

  - signale les fichiers manquants (la cause numero un d'image cassee) ;
  - signale les majuscules, accents et espaces dans les noms, qui marchent
    sous Windows mais cassent une fois le site en ligne ;
  - signale les fichiers trop lourds ;
  - affiche les dimensions reelles, prêtes a coller dans les donnees si tu
    veux supprimer le petit sursaut de mise en page au chargement ;
  - signale les images orphelines, presentes sur le disque mais citees
    nulle part.

Aucune dependance : lecture directe des en-tetes JPEG / PNG / WebP / GIF.
Le script ne modifie jamais rien.
"""

import pathlib
import re
import struct
import sys
import unicodedata

RACINE = pathlib.Path(__file__).resolve().parent.parent
DONNEES = ["data/projects.js", "data/extras.js", "data/info.js"]

POIDS_MAX_MO = 1.0          # au-dela, l'image gagnerait a etre recompressee
LARGEUR_UTILE_MAX = 2400    # au-dela, les pixels sont perdus a l'affichage


# --------------------------------------------------------------- dimensions

def dimensions(chemin):
    """(largeur, hauteur) d'une image, ou None si le format est inconnu."""
    with open(chemin, "rb") as f:
        tete = f.read(32)

        # --- PNG ---
        if tete[:8] == b"\x89PNG\r\n\x1a\n":
            return struct.unpack(">II", tete[16:24])

        # --- GIF ---
        if tete[:6] in (b"GIF87a", b"GIF89a"):
            return struct.unpack("<HH", tete[6:10])

        # --- WebP ---
        if tete[:4] == b"RIFF" and tete[8:12] == b"WEBP":
            forme = tete[12:16]
            if forme == b"VP8 ":
                return struct.unpack("<HH", tete[26:30])
            if forme == b"VP8L":
                b = tete[21:25]
                n = int.from_bytes(b, "little")
                return ((n & 0x3FFF) + 1, ((n >> 14) & 0x3FFF) + 1)
            if forme == b"VP8X":
                f.seek(24)
                d = f.read(6)
                l = 1 + int.from_bytes(d[0:3], "little")
                h = 1 + int.from_bytes(d[3:6], "little")
                return (l, h)
            return None

        # --- JPEG : on parcourt les segments jusqu'au cadre SOF ---
        if tete[:2] == b"\xff\xd8":
            f.seek(2)
            while True:
                octet = f.read(1)
                if not octet:
                    return None
                if octet != b"\xff":
                    continue
                marqueur = f.read(1)
                while marqueur == b"\xff":       # octets de bourrage
                    marqueur = f.read(1)
                if not marqueur:
                    return None
                m = marqueur[0]
                # SOF0..SOF15, en excluant DHT(C4), JPG(C8) et DAC(CC)
                if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
                    f.read(3)                    # longueur + precision
                    h, l = struct.unpack(">HH", f.read(4))
                    return (l, h)
                longueur = struct.unpack(">H", f.read(2))[0]
                f.seek(longueur - 2, 1)

    return None


# ------------------------------------------------------------------- noms

def souci_de_nom(rel):
    """Retourne la liste des problemes de nommage d'un chemin."""
    soucis = []
    nom = rel.split("/")[-1]

    if rel != rel.lower():
        soucis.append("majuscules")
    if " " in rel:
        soucis.append("espaces")
    if any(unicodedata.combining(c) or ord(c) > 127
           for c in unicodedata.normalize("NFD", rel)):
        soucis.append("accents")
    if nom.count(".") > 1:
        soucis.append("plusieurs points")

    return soucis


# ------------------------------------------------------------------ marche

def main():
    cites = []
    for f in DONNEES:
        chemin = RACINE / f
        if not chemin.exists():
            continue
        texte = chemin.read_text(encoding="utf-8")
        for m in re.findall(r'"(images/[^"]+)"', texte):
            if m not in cites:
                cites.append(m)

    manquantes, nommage, lourdes, grandes, mesures = [], [], [], [], []

    for rel in cites:
        chemin = RACINE / rel

        soucis = souci_de_nom(rel)
        if soucis:
            nommage.append((rel, ", ".join(soucis)))

        if not chemin.exists():
            manquantes.append(rel)
            continue

        mo = chemin.stat().st_size / (1024 * 1024)
        if mo > POIDS_MAX_MO:
            lourdes.append((rel, mo))

        try:
            d = dimensions(chemin)
        except Exception:
            d = None

        if d:
            mesures.append((rel, d[0], d[1]))
            if d[0] > LARGEUR_UTILE_MAX:
                grandes.append((rel, d[0]))

    # images presentes sur le disque mais citees nulle part
    sur_disque = {
        str(p.relative_to(RACINE)).replace("\\", "/")
        for p in (RACINE / "images").rglob("*")
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}
    }
    orphelines = sorted(sur_disque - set(cites))

    # Fichiers utilises par le site mais exclus de GitHub par .gitignore :
    # ils s'affichent en local et seraient casses une fois en ligne.
    exclus = []
    if (RACINE / ".git").exists():
        import subprocess
        presents = [c for c in cites if (RACINE / c).exists()]
        if presents:
            r = subprocess.run(["git", "check-ignore", "--stdin"], cwd=RACINE,
                               input="\n".join(presents), capture_output=True, text=True)
            exclus = [l.strip() for l in r.stdout.splitlines() if l.strip()]

    # ------------------------------------------------------------ rapport
    def titre(t):
        print("\n" + t)
        print("-" * len(t))

    print("=" * 62)
    print(f"  {len(cites)} images citees dans les donnees")
    print("=" * 62)

    if manquantes:
        titre(f"FICHIERS MANQUANTS ({len(manquantes)})")
        for r in manquantes:
            print(f"  {r}")

    if exclus:
        titre(f"UTILISES PAR LE SITE MAIS EXCLUS DE GITHUB ({len(exclus)})")
        print("  Ils marchent en local mais seront casses en ligne.")
        print("  Retire leur ligne dans le fichier .gitignore.")
        for r in exclus:
            print(f"  {r}")

    if nommage:
        titre(f"NOMS A CORRIGER ({len(nommage)})")
        print("  Windows ne fait pas la difference, un serveur web si.")
        for r, s in nommage:
            print(f"  {r}\n      -> {s}")

    if lourdes:
        titre(f"FICHIERS LOURDS ({len(lourdes)})")
        for r, mo in sorted(lourdes, key=lambda x: -x[1]):
            print(f"  {mo:5.1f} Mo   {r}")

    if grandes:
        titre(f"IMAGES INUTILEMENT GRANDES ({len(grandes)})")
        for r, l in grandes:
            print(f"  {l} px de large   {r}")

    if orphelines:
        titre(f"IMAGES NON UTILISEES ({len(orphelines)})")
        for r in orphelines:
            print(f"  {r}")

    if mesures:
        titre("DIMENSIONS (a coller si tu veux supprimer le sursaut)")
        for r, l, h in mesures:
            print(f"  w: {l}, h: {h}    {r}")

    total = len(manquantes) + len(nommage) + len(exclus)
    print()
    if total == 0:
        print("Aucun probleme bloquant.")
    else:
        print(f"{total} probleme(s) a corriger.")
    return 1 if (manquantes or exclus) else 0


if __name__ == "__main__":
    sys.exit(main())
