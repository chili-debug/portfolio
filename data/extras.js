/* ==========================================================================
   extras.js — projets personnels (photographie, vidéo, expérimentations)
   --------------------------------------------------------------------------
   L'ordre de la liste = l'ordre de remplissage de la mosaïque.

   La page Extras défile en continu : quand la liste est épuisée, elle
   recommence. Plus il y a d'entrées ici, plus la boucle est longue avant
   de se répéter — une quinzaine suffit à ce qu'elle ne se voie pas.

   ratio : proportion de la vignette dans la mosaïque.
           "3/2"  paysage   (comme le mockup, 308 × 201)
           "1/1"  carré     (308 × 313)
           "7/12" portrait  (308 × 530)
           N'importe quelle valeur CSS aspect-ratio fonctionne.

   brouillon: true   masque l'entrée partout sur le site (mosaïque et page
                     individuelle) sans la supprimer. Les entrées marquées
                     ainsi sont des exemples fictifs créés pour tester la
                     mise en page : remplace-les par tes vrais projets, puis
                     retire la mention.
   ========================================================================== */

const EXTRAS = [

  {
    slug: "postcards-from-gaspe", brouillon: true,
    titre: "Postcards from Gaspé",
    annee: "2025",
    ratio: "1/1",
    cover: "images/extras/postcards-from-gaspe/cover.jpg",
    description:
      "Une série photographique réalisée en Gaspésie, entre le retour à la " +
      "maison et le regard de quelqu’un qui n’y habite plus tout à fait.",
    images: [
      { src: "images/extras/postcards-from-gaspe/01.jpg", legende: "", ratio: "3/2" },
      { src: "images/extras/postcards-from-gaspe/02.jpg", legende: "", ratio: "3/2" }
    ]
  },

  { slug: "terrasses", brouillon: true,         titre: "Terrasses",          annee: "2025", ratio: "7/12",
    cover: "images/extras/terrasses/cover.jpg",         description: "", images: [] },

  { slug: "horizons", brouillon: true,          titre: "Horizons",           annee: "2025", ratio: "3/2",
    cover: "images/extras/horizons/cover.jpg",          description: "", images: [] },

  { slug: "depanneur", brouillon: true,         titre: "Dépanneur",          annee: "2025", ratio: "7/12",
    cover: "images/extras/depanneur/cover.jpg",         description: "", images: [] },

  {
    slug: "sur-la-colline-de-visocia",
    titre: "La colline de Visočica",
    annee: "2023",
    ratio: "7/12",
    cover: "images/extras/sur-la-colline-de-visocia/cover.webp",
    coverW: 1460, coverH: 2515,
    description: `Sur la colline de Visočica 

Je me laisse penser à toi 

Mon été de mars 

 

Je repense aux tableaux peints dans le ciel

Aux airs de violon joués sur l’eau

Aux jours que l’on a laissés faner dans le café assiégé 

Au temps où l'on s’endormait ensemble 

 

Je repense à quand ton regard s’est noyé 

Sous notre appartement

 

Une autre nuit

Sans toi

 

Je te retrouverai 

Là où les bombes sont tombées`,
    images: []
  },

  { slug: "velos", brouillon: true,             titre: "Vélos",              annee: "2024", ratio: "3/2",
    cover: "images/extras/velos/cover.jpg",             description: "", images: [] },

  { slug: "sommets", brouillon: true,           titre: "Sommets",            annee: "2024", ratio: "1/1",
    cover: "images/extras/sommets/cover.jpg",           description: "", images: [] },

  { slug: "terrasse-du-matin", brouillon: true, titre: "Terrasse du matin",  annee: "2024", ratio: "1/1",
    cover: "images/extras/terrasse-du-matin/cover.jpg", description: "", images: [] },

  { slug: "glace", brouillon: true,             titre: "Glace",              annee: "2024", ratio: "1/1",
    cover: "images/extras/glace/cover.jpg",             description: "", images: [] },

  { slug: "fenetres", brouillon: true,          titre: "Fenêtres",           annee: "2025", ratio: "7/12",
    cover: "images/extras/fenetres/cover.jpg",          description: "", images: [] },

  { slug: "quais", brouillon: true,             titre: "Quais",              annee: "2025", ratio: "3/2",
    cover: "images/extras/quais/cover.jpg",             description: "", images: [] },

  { slug: "neons", brouillon: true,             titre: "Néons",              annee: "2025", ratio: "1/1",
    cover: "images/extras/neons/cover.jpg",             description: "", images: [] },

  { slug: "escaliers", brouillon: true,         titre: "Escaliers",          annee: "2024", ratio: "7/12",
    cover: "images/extras/escaliers/cover.jpg",         description: "", images: [] },

  { slug: "brume", brouillon: true,             titre: "Brume",              annee: "2024", ratio: "3/2",
    cover: "images/extras/brume/cover.jpg",             description: "", images: [] },

  { slug: "maquettes", brouillon: true,         titre: "Maquettes",          annee: "2025", ratio: "1/1",
    cover: "images/extras/maquettes/cover.jpg",         description: "", images: [] },

  { slug: "carnets", brouillon: true,           titre: "Carnets",            annee: "2025", ratio: "3/2",
    cover: "images/extras/carnets/cover.jpg",           description: "", images: [] },

  { slug: "chantier", brouillon: true,          titre: "Chantier",           annee: "2026", ratio: "7/12",
    cover: "images/extras/chantier/cover.jpg",          description: "", images: [] },

  { slug: "nuit-blanche", brouillon: true,      titre: "Nuit blanche",       annee: "2026", ratio: "1/1",
    cover: "images/extras/nuit-blanche/cover.jpg",      description: "", images: [] }

];
