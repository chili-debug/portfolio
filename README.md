# Portfolio — Lily-Mei Fournier

Site statique. Aucune installation, aucune compilation, aucune dépendance.

---

## Voir le site

Double-cliquer `index.html` fonctionne. Pour être plus proche des conditions
réelles, lancer un petit serveur depuis ce dossier :

```bash
python -m http.server 8765
```

puis ouvrir <http://localhost:8765>.

---

## Où se trouve quoi

| Dossier | Contenu |
|---|---|
| `data/` | **Tout le contenu du site.** C'est le seul dossier à modifier au quotidien. |
| `assets/css/style.css` | Toute la mise en forme. |
| `assets/js/app.js` | Les interactions et le remplissage des pages. |
| `images/` | Les images, rangées par projet. |
| `*.html` | Les gabarits. Ils sont volontairement presque vides. |

Les pages `projet.html` et `extra.html` sont des **gabarits uniques** : elles
affichent n'importe quel projet selon l'adresse (`projet.html?p=gemaux`).
Il n'y a donc jamais de page à créer à la main.

---

## Ajouter un projet

1. Créer le dossier `images/projets/mon-projet/` et y déposer les images.
2. Ouvrir `data/projects.js`, copier un bloc `{ ... }` existant, le coller
   et remplir les champs.
3. C'est tout. Le projet apparaît dans l'index, et sa page existe déjà.

Seuls `slug`, `no`, `titre`, `annee`, `cadre` et `lieu` sont obligatoires.
Les champs laissés vides ne s'affichent tout simplement pas.

Le bloc d'informations d'une page projet se compose de quatre lignes, dans
cet ordre :

Au-dessus du filet : le `titre`, et en dessous un `sousTitre` facultatif
(14 px medium). Laissé vide, il ne s'affiche pas.

Sous le filet, quatre lignes :

| Ligne | Contenu | Champs |
|---|---|---|
| 1 | type, lieu, date | `type`, `lieu`, `date` |
| 2 | cours, supervision | `cadre`, `superviseur` |
| 3 | collaboration | `collaborateurs` |
| 4 | contribution personnelle | `contribution` |

Les lignes 3 et 4 ne concernent que les **projets d'équipe** : sur un projet
solo, laisser les deux champs vides et elles disparaissent.

### Écrire un texte à plusieurs paragraphes

Un texte entre guillemets `" "` doit tenir sur **une seule ligne**. Coller un
texte qui en fait plusieurs casse le fichier, et la page reste blanche — le
navigateur ne sait plus lire les données du tout.

Pour un texte à plusieurs paragraphes, utiliser des **accents graves** :

```js
description: `Premier paragraphe.
Deuxième paragraphe.
Troisième paragraphe.`
```

Chaque retour à la ligne commence un nouveau paragraphe. Aucune balise à
écrire, aucun `\n`. L'accent grave s'obtient avec `Alt Gr + 7` sur un clavier
français, ou la touche à gauche du `1` sur un clavier canadien-multilingue.

Une liste fonctionne aussi, si tu préfères :

```js
description: ["Premier paragraphe.", "Deuxième paragraphe."]
```

### Disposer les images d'un projet

Les images ne sont pas alignées en grille : chacune déclare sa largeur et sa
place, ce qui donne un rythme libre.

```js
{ src: "images/projets/mon-projet/03.jpg",
  legende: "Coupe longitudinale",
  w: 2000, h: 1333,
  taille: "petite", position: "droite", decalage: 90 }
```

| Champ | Valeurs | Défaut |
|---|---|---|
| `taille` | `pleine` · `grande` · `moyenne` · `petite` · `mini` | `grande` |
| `position` | `gauche` · `centre` · `droite` | `centre` |
| `decalage` | pixels vers le bas | `0` |

Deux images `petite` qui se suivent se placent côte à côte. Donner un
`decalage` à la seconde les désaligne — c'est ce qui évite l'effet de
planche-contact. Sur mobile, tout reprend la pleine largeur automatiquement.

L'ancienne écriture `demi: true` continue de fonctionner.

Le `slug` sert d'adresse : minuscules, sans accent, tirets à la place des
espaces.

**Réordonner l'index** : déplacer les blocs dans `data/projects.js`.

**Choisir les projets de l'accueil** : modifier la liste `accueil` dans
`data/site.js`. L'ordre des lignes = l'ordre d'affichage.

---

## Modifier les autres pages

| Pour changer… | Fichier |
|---|---|
| Formation, expérience, logiciels, distinctions, bio, portrait | `data/info.js` |
| Projets personnels de la page Extras | `data/extras.js` |
| Courriel, Instagram, LinkedIn, téléphone | `data/site.js` → `contact` |
| Nom affiché, entrées du menu | `data/site.js` |

Dans `data/info.js`, chaque section est une liste de lignes, et chaque ligne
une liste de cellules affichées de gauche à droite. Ajouter une ligne =
ajouter un tableau. `""` laisse une cellule vide.

**Formation et Expérience partagent la même grille** (`grille: "formation"`),
ce qui fait tomber les dates sous les dates et les lieux sous les lieux d'une
section à l'autre. Les cinq colonnes sont :

```
type · institution/employeur · domaine/type d'emploi · date · lieu
```

Une expérience n'a pas de « type » : on laisse simplement la première
cellule vide (`""`) et l'alignement se fait tout seul.

---

## Changer les couleurs ou la typographie

Tout est regroupé en haut de `assets/css/style.css`, dans le bloc `:root`.

```css
--fond:   #ffffff;   /* blanc pur */
--texte:  #1c1c1c;   /* presque noir */
--accent: #173eeb;   /* actif, survol, page courante */
```

Le fond est **blanc pur** et non le `#f7f7f7` du mockup : beaucoup de plans
ont eux-mêmes un fond blanc, et un gris les ferait apparaître comme des
vignettes encadrées. Remettre `#f7f7f7` ici suffit à revenir en arrière —
la visionneuse et le voile de la mosaïque suivent automatiquement.

Changer `--accent` une seule fois suffit : la couleur se propage partout
(menu actif, survol de l'index, flèche de tri, légendes, liens de contact).

**Police : Geist.** Grotesque géométrique, même neutralité qu'un SF Pro
sans être l'Inter que tout le monde emploie. Axe variable 300–600 et vraie
italique, donc les légendes ne sont pas penchées artificiellement.

Pour en changer, deux endroits : la variable `--police` dans le CSS, **et**
le lien Google Fonts en tête des sept fichiers HTML.

Les tailles reprennent la planche du mockup : menu 24 px, titre 20 px,
index 18 px, données 14 px, légende 10 px. Seuls les paragraphes suivis
passent à 15 px (`--t-prose`) : 14 px en justifié est trop serré à l'écran.

Une quatrième couleur (`#90cf36`) figure sur la planche mais n'est utilisée
nulle part. Elle est laissée en commentaire dans le fichier.

---

## Largeur du site

Le mockup est dessiné sur 1920 px avec 36 px de marge. Sur le web, une page
qui s'étire sans limite finit par avoir des lignes de texte illisibles et un
centre vide. La colonne de contenu est donc plafonnée :

```css
--contenu-max: 1600px;               /* au-delà, le contenu se centre */
--marge: clamp(20px, 3vw, 48px);     /* la marge respire avec la fenêtre */
--bande-hauteur: min(52vh, 560px);   /* hauteur de la galerie d'accueil */
```

La bande d'accueil est liée à la hauteur de fenêtre plutôt que figée à
584 px : elle tient à l'écran aussi bien sur un portable que sur un 27 pouces.

---

## Images

### Nomenclature

**Aucune n'est imposée par le code** : chaque chemin est écrit en toutes
lettres dans les données, donc un fichier peut s'appeler n'importe comment
du moment que le chemin correspond. Mais trois règles évitent des ennuis
réels une fois le site en ligne :

1. **Tout en minuscules.** Windows ne distingue pas `Cover.JPG` de
   `cover.jpg` ; un serveur web, si. Une image qui marche chez toi peut
   donc disparaître une fois publiée.
2. **Ni accent ni espace** dans les noms de fichiers et de dossiers.
   `plan-rez-de-chaussee.jpg`, pas `plan rez-de-chaussée.jpg`.
3. **Un dossier par projet**, nommé comme le `slug` :
   `images/projets/<slug>/`.

La convention utilisée ici, à suivre par confort plus que par obligation :

```
images/projets/gemaux/cover.jpg   ← l'image de couverture
images/projets/gemaux/01.jpg      ← les autres, numérotées
images/projets/gemaux/02.jpg
```

Numéroter sur deux chiffres (`01`, `02` … `10`) garde le classement correct
dans l'explorateur au-delà de neuf images.

### Dimensions

**Les proportions sont libres et peuvent toutes être différentes.** Les
images de projet s'affichent toujours en entier, à leur format naturel :
rien n'est recadré ni déformé.

Deux exceptions, où le recadrage est voulu : les vignettes de l'accueil et
celles de la mosaïque Extras. Là, le champ `ratio` impose la proportion de
la vignette (`"3/2"`, `"1/1"`, `"7/12"`) et l'image est recadrée au centre.

⚠️ **Ne jamais mettre de `ratio` sur une image de projet.** Ce champ force
une proportion ; si elle ne correspond pas au fichier, l'image est écrasée.

En pratique :

- **Format** : JPEG ou WebP. WebP pèse environ 30 % de moins à qualité égale.
- **Largeur** : 2000 px suffisent largement. Au-delà, ce sont des pixels
  téléchargés pour rien.
- **Poids** : viser moins de 500 Ko par image.
- `demi: true` sur deux images consécutives les place côte à côte.
- `w` et `h` sont **facultatifs**. Renseignés avec les dimensions réelles du
  fichier, ils suppriment le léger sursaut de mise en page au chargement.

### Plans en PDF

**Ne pas les convertir en JPEG.** Un plan est un dessin au trait ; le JPEG
est fait pour la photo et laisse un halo autour des lignes fines. Mesuré sur
un détail vectoriel exporté à 2000 px :

| Format | Poids | Pixels altérés |
|---|---|---|
| **WebP sans perte** | **159 Ko** | **aucun** |
| JPEG qualité 85 | 253 Ko | 0,31 % |
| PNG | 420 Ko | aucun |

Le WebP sans perte est à la fois le plus léger et le seul exact avec le PNG.
Sur une planche dense et colorée, l'écart se creuse : le JPEG y salit
jusqu'à 12 % des pixels.

Le SVG serait tentant puisque les plans sont vectoriels, mais un export
AutoCAD contient des dizaines de milliers de tracés : le SVG pesait 7,4 Mo
contre 1,2 Mo en raster, et le navigateur peinerait à l'afficher.

```bash
python outils/convertir-plans.py "chemin/vers/plan.pdf" -o images/projets/murmures
```

Le script accepte aussi un dossier entier, gère les PDF multipages, nettoie
les noms de fichiers (minuscules, sans accent) et affiche le poids obtenu.
Options : `--largeur 2400`, `--qualite 90` (avec perte, si un fichier dépasse
800 Ko).

Prérequis, une seule fois :

```bash
python -m pip install pymupdf pillow
```

⚠️ Un plan affiché à 836 px de large reste un plan **illisible dans le
détail** : les annotations font quelques pixels de haut. Pour les plans très
annotés, prévoir un lien vers le PDF d'origine en pleine résolution.

### Alléger ses images

```bash
python outils/optimiser-images.py images/projets/mon-projet
```

Par défaut, **simple rapport : rien n'est modifié**. Le script indique ce que
chaque image pourrait peser une fois ramenée à 2000 px et réencodée en WebP.
Ajouter `--appliquer` pour écrire les `.webp` — les originaux sont conservés,
il reste ensuite à changer les chemins dans `data/`.

Mesuré sur Canopée urbaine : **3,63 Mo → 1,39 Mo**, soit 62 % de moins, les
deux rendus en 3840 px passant de 1,3 Mo à 200 Ko chacun.

### Vérifier ses images

```bash
python outils/verifier-images.py
```

Le script ne modifie rien. Il signale les fichiers manquants, les noms
problématiques, les images trop lourdes ou trop grandes, celles qui ne
servent plus, et affiche les `w` et `h` réels prêts à coller.

Les images grises encore en place sont des **substituts**, à remplacer.

---

## Comportements

**Accueil** — les images occupent une bande continue, à parts égales. Au
survol, l'image visée s'étend jusqu'au carré (584 px, la hauteur de la
bande) et les autres se partagent la largeur restante. Les légendes
n'apparaissent que sur les vignettes assez larges pour les porter, sans
JavaScript. Sur mobile, la bande devient une pile verticale.

**Projets** — l'index est trié **du plus récent au plus ancien** par défaut ;
la numérotation, elle, ne bouge jamais. Les en-têtes « No. » et « Année »
sont cliquables : une flèche apparaît au survol et se retourne pour
inverser l'ordre. La ligne entière est cliquable et passe en bleu au survol.
Sur petit écran, la colonne « Cadre » passe sous le titre.

**Images** — un clic ouvre l'image en grand par-dessus la page, sur fond
blanc. Fermeture au clic sur le fond, sur la croix, ou avec Échap ; flèches
gauche et droite pour passer d'une image à l'autre.

**Retour en haut** — une flèche apparaît en bas à droite après un peu de
défilement, alignée sur le bord de la colonne de contenu. Elle **reste
visible en bas de page**, où elle sert le plus, et remonte simplement
au-dessus du pied pour ne pas recouvrir la signature.

**Navigation** — elle fait partie du flux et défile avec la page. Aucun
bandeau opaque ne passe donc par-dessus les images. Le pied de page se colle
en bas de fenêtre quand la page est courte, ce qui reproduit la composition
du mockup sur l'accueil sans rien figer.

**Extras** — mosaïque à **défilement continu** : la liste se rejoue en boucle
au fur et à mesure du défilement. Les colonnes sont construites en
JavaScript, chaque vignette allant dans la colonne la plus courte ; une
colonne CSS se rééquilibrerait à chaque ajout et toute la mosaïque
sauterait. Au survol, un voile clair révèle le titre ; sur mobile le titre
reste visible en permanence, faute de survol.

Le défilement est plafonné à 240 vignettes. Une page réellement infinie
rendrait le pied de page inatteignable et finirait par peser sur la mémoire
du navigateur. Le plafond se règle dans `app.js` (`PLAFOND`).

---

## Notes

- Le site fonctionne sans étape de build : les fichiers de données sont de
  simples scripts, pas des modules. Ils s'ouvrent donc aussi en local.
- Dans `data/info.js`, les cellules acceptent du HTML simple (`<em>`) —
  pratique pour les titres d'œuvres. Ailleurs, le texte est échappé.
- Le mouvement est désactivé si le système demande une animation réduite.
