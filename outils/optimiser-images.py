#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Allege les images du portfolio.

    python outils/optimiser-images.py                        (tout images/)
    python outils/optimiser-images.py images/projets/gemaux  (un dossier)
    python outils/optimiser-images.py --appliquer            (ecrit vraiment)

Par defaut le script ne fait qu'un RAPPORT : il calcule ce que chaque image
pourrait peser, sans rien modifier. Ajouter --appliquer pour ecrire les
fichiers .webp a cote des originaux, qui sont conserves.

Ce qu'il fait
-------------
  - reduit a 2000 px de large au maximum (au-dela, ce sont des pixels
    telecharges pour rien : le site affiche environ 840 px) ;
  - reencode en WebP, en essayant avec et sans perte et en gardant le
    plus leger des deux ;
  - laisse tranquille ce qui est deja assez leger.

Apres --appliquer, remplacer les chemins dans data/*.js par les .webp,
puis relancer  python outils/verifier-images.py

Prerequis :  python -m pip install pillow
"""

import argparse
import io
import pathlib
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("Manque Pillow. Lancer :\n    python -m pip install pillow")

RACINE = pathlib.Path(__file__).resolve().parent.parent
EXTS = {".jpg", ".jpeg", ".png"}

LARGEUR_MAX = 2000     # le site n'affiche jamais plus large que ~840 px
SEUIL_KO = 250         # en dessous, on ne touche a rien
QUALITE = 82


def meilleure_version(img):
    """Retourne (octets, mode) de la variante WebP la plus legere."""
    essais = []

    b = io.BytesIO()
    img.save(b, format="WEBP", quality=QUALITE, method=6)
    essais.append((b.getvalue(), f"WebP q{QUALITE}"))

    # Le sans-perte ne gagne que sur du trait pur (export CAO, schema).
    b = io.BytesIO()
    img.save(b, format="WEBP", lossless=True, method=6)
    essais.append((b.getvalue(), "WebP sans perte"))

    return min(essais, key=lambda x: len(x[0]))


def main():
    ap = argparse.ArgumentParser(description="Allege les images du portfolio")
    ap.add_argument("dossier", nargs="?", default="images",
                    help="dossier a traiter (defaut : images)")
    ap.add_argument("--appliquer", action="store_true",
                    help="ecrit les fichiers ; sans cette option, simple rapport")
    ap.add_argument("--largeur", type=int, default=LARGEUR_MAX)
    a = ap.parse_args()

    base = pathlib.Path(a.dossier)
    if not base.is_absolute():
        base = RACINE / base
    if not base.exists():
        sys.exit(f"Introuvable : {base}")

    fichiers = sorted(p for p in base.rglob("*") if p.suffix.lower() in EXTS)
    if not fichiers:
        sys.exit("Aucune image trouvee.")

    avant = apres = 0
    lignes = []

    for p in fichiers:
        ko = p.stat().st_size / 1024
        img = Image.open(p).convert("RGB")
        # On borne le COTE LE PLUS LONG : une image en portrait bornee
        # seulement en largeur garderait toute sa hauteur (2560 px pour une
        # photo verticale de Gemaux, 1,8 Mo au lieu de quelques centaines).
        cote = max(img.width, img.height)
        trop_large = cote > a.largeur

        if ko < SEUIL_KO and not trop_large:
            avant += ko
            apres += ko
            continue

        if trop_large:
            f = a.largeur / cote
            img = img.resize((round(img.width * f), round(img.height * f)), Image.LANCZOS)

        data, mode = meilleure_version(img)
        neuf = len(data) / 1024

        if neuf >= ko:            # aucun gain : on laisse l'original
            avant += ko
            apres += ko
            continue

        dest = p.with_suffix(".webp")
        rel = str(p.relative_to(RACINE)).replace("\\", "/")
        lignes.append((rel, ko, neuf, mode, img.width))

        if a.appliquer:
            dest.write_bytes(data)

        avant += ko
        apres += neuf

    if not lignes:
        print("Rien a alleger : toutes les images sont deja correctes.")
        return

    largeur_nom = max(len(r[0]) for r in lignes)
    print(f"{'fichier'.ljust(largeur_nom)}   avant     apres    gain   format")
    print("-" * (largeur_nom + 40))
    for rel, ko, neuf, mode, l in lignes:
        gain = 100 - 100 * neuf / ko
        print(f"{rel.ljust(largeur_nom)} {ko:7.0f}Ko {neuf:7.0f}Ko  {gain:4.0f}%   {mode} {l}px")

    print("-" * (largeur_nom + 40))
    print(f"Total dossier : {avant/1024:.2f} Mo  ->  {apres/1024:.2f} Mo "
          f"({100-100*apres/avant:.0f} % de moins)")

    if a.appliquer:
        print("\nFichiers .webp ecrits. Les originaux sont conserves.")
        print("Mets a jour les chemins dans data/*.js, puis lance :")
        print("   python outils/verifier-images.py")
    else:
        print("\nRapport seulement — rien n'a ete modifie.")
        print("Pour ecrire les fichiers :  --appliquer")


if __name__ == "__main__":
    main()
