#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convertit des plans PDF en images pretes pour le site.

    python outils/convertir-plans.py "chemin/vers/plan.pdf"
    python outils/convertir-plans.py "chemin/vers/dossier"  -o images/projets/murmures
    python outils/convertir-plans.py plan.pdf --largeur 2400
    python outils/convertir-plans.py plan.pdf --qualite 90     (avec perte, plus leger)

Pourquoi WebP sans perte et pas JPEG
------------------------------------
Un plan est un dessin au trait. Le JPEG est concu pour la photo : il
compresse par blocs et laisse un halo autour des lignes fines. Mesure faite
sur un detail vectoriel a 2000 px de large :

    WebP sans perte    159 Ko    aucun pixel altere
    JPEG qualite 85    253 Ko    0,31 % des pixels salis

Le WebP sans perte est donc a la fois plus leger et exact. Sur une planche
tres dense et coloree, si le fichier depasse ~800 Ko, essayer --qualite 90.

Prerequis :  python -m pip install pymupdf pillow
"""

import argparse
import io
import pathlib
import sys

try:
    import pymupdf
    from PIL import Image
except ImportError:
    sys.exit("Manque une librairie. Lancer :\n"
             "    python -m pip install pymupdf pillow")


def sortie_pour(pdf, page_no, total, dossier):
    base = pdf.stem.lower()
    for a, b in [(" ", "-"), ("_", "-"), ("é", "e"), ("è", "e"), ("ê", "e"),
                 ("à", "a"), ("â", "a"), ("î", "i"), ("ô", "o"), ("û", "u"),
                 ("ç", "c"), ("'", ""), ("’", "")]:
        base = base.replace(a, b)
    base = "-".join(filter(None, base.split("-")))
    if total > 1:
        base = f"{base}-{page_no:02d}"
    return dossier / f"{base}.webp"


def emprise(page, marge=0.02):
    """
    Rectangle reellement occupe par le dessin, avec une marge.

    Un plan exporte depuis AutoCAD occupe rarement toute sa feuille : une
    elevation peut ne couvrir que 18 % d'une page lettre. Convertie telle
    quelle, elle apparaitrait comme un filet perdu dans du blanc.
    """
    bb = None
    for d in page.get_drawings():
        bb = d["rect"] if bb is None else (bb | d["rect"])
    try:
        t = page.get_text("blocks")
        for b in t:
            r = pymupdf.Rect(b[:4])
            bb = r if bb is None else (bb | r)
    except Exception:
        pass

    if bb is None or bb.is_empty or bb.width < 5 or bb.height < 5:
        return page.rect

    # get_drawings() donne des coordonnees dans le repere NON tourne, alors
    # que get_pixmap(clip=...) attend le repere affiche. Sur une page pivotee
    # (frequent quand on redresse une coupe), sans cette conversion on
    # decoupe a cote et l'on obtient une image quasi vide.
    if page.rotation:
        bb = bb * page.rotation_matrix

    m = max(bb.width, bb.height) * marge
    bb = pymupdf.Rect(bb.x0 - m, bb.y0 - m, bb.x1 + m, bb.y1 + m)
    return bb & page.rect          # jamais au-dela de la page


def convertir(pdf, dossier, largeur, qualite, recadrer=True, pivot=0):
    doc = pymupdf.open(pdf)
    faits = []

    for i in range(doc.page_count):
        page = doc.load_page(i)
        zone = emprise(page) if recadrer else page.rect
        # On borne le COTE LE PLUS LONG, pas la largeur : une elevation
        # etroite et haute mise a 2000 px de large atteindrait sinon
        # plusieurs dizaines de millions de pixels, que certains
        # navigateurs mobiles refusent de decoder.
        zoom = largeur / max(zone.width, zone.height)
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom),
                              clip=zone, alpha=False)
        img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")

        # Un plan trace couche sur sa feuille (frequent quand on plotte une
        # coupe sur un format portrait) se redresse ici.
        if pivot:
            img = img.rotate(pivot, expand=True)

        i = i + 1

        dest = sortie_pour(pathlib.Path(pdf), i, doc.page_count, dossier)
        dest.parent.mkdir(parents=True, exist_ok=True)

        if qualite is None:
            # Sur du trait pur le sans-perte gagne, sur un plan colore c'est
            # l'inverse : on essaie les deux et on garde le plus leger.
            a = io.BytesIO(); img.save(a, format="WEBP", lossless=True, method=6)
            b = io.BytesIO(); img.save(b, format="WEBP", quality=88, method=6)
            if len(a.getvalue()) <= len(b.getvalue()):
                dest.write_bytes(a.getvalue()); mode = "sans perte"
            else:
                dest.write_bytes(b.getvalue()); mode = "qualite 88"
        else:
            img.save(dest, format="WEBP", quality=qualite, method=6)
            mode = f"qualite {qualite}"

        ko = dest.stat().st_size / 1024
        faits.append((dest, img.width, img.height, ko, mode))

    doc.close()
    return faits


def main():
    ap = argparse.ArgumentParser(description="PDF -> WebP pour le portfolio")
    ap.add_argument("source", help="un fichier PDF ou un dossier de PDF")
    ap.add_argument("-o", "--sortie", default="images/plans",
                    help="dossier de destination (defaut : images/plans)")
    ap.add_argument("--largeur", type=int, default=2000,
                    help="largeur en pixels (defaut : 2000)")
    ap.add_argument("--pivoter", type=int, default=0, choices=[0, 90, 180, 270],
                    help="redresse un dessin trace couche sur sa feuille")
    ap.add_argument("--qualite", type=int, default=None,
                    help="1-100 pour du WebP avec perte ; par defaut sans perte")
    a = ap.parse_args()

    src = pathlib.Path(a.source)
    if not src.exists():
        sys.exit(f"Introuvable : {src}")

    racine = pathlib.Path(__file__).resolve().parent.parent
    dossier = pathlib.Path(a.sortie)
    if not dossier.is_absolute():
        dossier = racine / dossier

    pdfs = sorted(src.rglob("*.pdf")) if src.is_dir() else [src]
    if not pdfs:
        sys.exit("Aucun PDF trouve.")

    total_ko = 0
    for pdf in pdfs:
        print(f"\n{pdf.name}")
        try:
            for dest, l, h, ko, mode in convertir(pdf, dossier, a.largeur, a.qualite,
                                                 pivot=a.pivoter):
                rel = dest.relative_to(racine) if racine in dest.parents else dest
                print(f"   {str(rel).replace(chr(92), '/'):<52} {l}x{h}  {ko:7.0f} Ko  ({mode})")
                total_ko += ko
        except Exception as e:
            print(f"   ECHEC : {e}")

    print(f"\nTotal : {total_ko/1024:.1f} Mo")
    print("Pense a copier les chemins dans data/projects.js,")
    print("puis lance : python outils/verifier-images.py")


if __name__ == "__main__":
    main()
