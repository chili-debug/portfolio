/* ==========================================================================
   info.js — page Info
   --------------------------------------------------------------------------
   Chaque section est un tableau de lignes ; chaque ligne est un tableau
   de cellules, affichées de gauche à droite.
   Laisser "" pour une cellule vide. Ajouter une ligne = ajouter un tableau.
   Ajouter une section = ajouter un bloc dans « sections ».
   ========================================================================== */

const INFO = {

  photo: {
    src: "images/info/portrait.webp",
    alt: "Portrait de Lily-Mei Fournier",
    w: 2000, h: 1780
  },

  /* Chaque chaîne = un paragraphe. */
  bio: [
    "Étudiante au baccalauréat en architecture à l’Université Laval, " +
    "originaire de la Gaspésie."

    /* Paragraphe proposé pendant la maquette, masqué avant la mise en
       ligne : ce n'est pas toi qui l'as écrit. Remplace-le par tes mots,
       ou retire les marques de commentaire s'il te convient tel quel
       (et remets une virgule après la phrase ci-dessus).
    "Mon travail s’intéresse à l’ordinaire : aux gestes construits sans " +
    "prétention, aux matériaux disponibles, et à ce que l’architecture " +
    "peut faire pour les lieux qui ne se pensent pas remarquables."
    */
  ],

  sections: [

    {
      titre: "Formation",
      grille: "formation",
      lignes: [
        ["DES",           "École Antoine-Roy",                "",                                 "2016-2021", "Gaspé, Québec"],
        ["DEC",           "Cégep de la Gaspésie et des Îles", "Arts, lettres et communications",  "2021-2023", "Gaspé, Québec"],
        ["Baccalauréat",  "Université Laval",                 "Architecture",                     "2024-",     "Québec, Québec"]
      ]
    },

    {
      titre: "Expérience",
      grille: "formation",
      lignes: [
        ["", "Parcs Canada", "Emploi étudiant", "Été 2022 et 2023", "Gaspé, QC"],
        ["", "Fonds d'emprunt", "Assistante-gérante d'une boutique", "Été 2025", "Québec, QC"],
        ["", "Ministère de la défense nationale", "Emploi étudiant en architecture", "Été 2026", "Valcartier, QC"]
      ]
    },

    {
      titre: "Logiciels",
      grille: "logiciels",
      lignes: [
        ["AutoCAD",    "Avancé",       "Rhino 8",   "Intermédiaire"],
        ["Photoshop",  "Avancé",       "SketchUp",  "Intermédiaire"],
        ["Illustrator","Avancé",       "D5 Render", "Intermédiaire"],
        ["InDesign",   "Intermédiaire", "",         ""]
      ]
    },

    {
      titre: "Distinctions",
      grille: "distinctions",
      lignes: [
        ["Première mention - Concours intercollégial de poésie, <em>Pour l'instant</em>", "2023"],
        ["Participation au concours Archmello, <em>Reboot Retreat</em>", "2026"]
      ]
    }

  ]
};
