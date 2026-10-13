/* ==========================================================================
   projects.js — tous les projets d'architecture
   --------------------------------------------------------------------------
   AJOUTER UN PROJET : copier un bloc { ... } et le coller dans la liste.
   SUPPRIMER : effacer le bloc. RÉORDONNER : déplacer le bloc.
   L'index de la page « projets » suit l'ordre de cette liste.

   Champs obligatoires : slug, no, titre, annee, cadre, lieu
   Tous les autres sont facultatifs — s'ils sont vides, la section
   correspondante ne s'affiche simplement pas sur la page du projet.

   slug  = identifiant dans l'adresse (projet.html?p=gemaux)
           minuscules, sans accent, tirets à la place des espaces.
   court = étiquette courte utilisée sous les images de l'accueil (ex. « H25 »)

   TEXTES SUR PLUSIEURS PARAGRAPHES
   Un texte entre guillemets " " doit tenir sur UNE seule ligne : sinon le
   fichier ne se lit plus et la page reste blanche. Pour un texte à
   plusieurs paragraphes, utiliser des accents graves ` ` :

       description: `Premier paragraphe.
       Deuxième paragraphe.`

   Chaque retour à la ligne commence un nouveau paragraphe.

   PROJETS D'ÉQUIPE
   « collaborateurs » et « contribution » ne s'affichent que s'ils sont
   remplis. Sur un projet solo, les laisser vides : les deux lignes
   disparaissent d'elles-mêmes du bloc d'informations.
   ========================================================================== */

const PROJECTS = [

  {
    slug: "ouverture",
    no: "001",
    titre: "Ouverture",
    annee: "2024",
    court: "A24",
    cadre: "Atelier I",
    lieu: "",
    type: "Petite construction",
    sousTitre: "La capsule",
    date: "Automne 2024",
    superviseur: "Supervisé par David-Alexandre Côté",
    collaborateurs: "",
    concept: "",
    description: "",
    contribution: "",
    cover: "images/projets/ouverture/cover.webp",
    coverW: 2000, coverH: 1328,
    images: []
  },

  {
    slug: "poeme-symphonique",
    no: "002",
    titre: "Poème Symphonique",
    annee: "2024",
    court: "A24",
    cadre: "Atelier I",
    lieu: "Cap-Tourmente, Québec, QC",
    type: "Résidence d'artiste",
    sousTitre: "",
    date: "Automne 2024",
    superviseur: "Supervisé par David-Alexandre Côté",
    collaborateurs: "",
    concept: "",
    description: "",
    contribution: "",
    cover: "images/projets/poeme-symphonique/cover.webp",
    coverW: 2000, coverH: 959,
    images: []
  },

  {
    slug: "ombre-et-lumiere",
    no: "003",
    titre: "Ombre et lumière",
    annee: "2024",
    court: "A24",
    cadre: "Imagination et vision spatiale architectonique",
    lieu: "",
    type: "Dessins au fusain",
    sousTitre: "",
    date: "Automne 2024",
    superviseur: "",
    collaborateurs: "",
    concept: "",
    description: "Dessin réalisé au fusain en explorant le concept de l’ombre et de la lumière.",
    contribution: "",
    cover: "images/projets/ombre-et-lumiere/cover.webp",
    coverW: 1572, coverH: 2000,
    images: []
  },

  {
    slug: "evanescent",
    no: "004",
    titre: "Évanescent",
    annee: "2025",
    court: "H25",
    cadre: "Atelier II",
    lieu: "Parc de la Jaques Cartier, Québec, QC",
    type: "Petite habitation",
    sousTitre: "",
    date: "Hiver 2025",
    superviseur: "Supervisé par Louis St-Pierre",
    collaborateurs: "",
    concept: "",
    description: "",
    contribution: "",
    cover: "images/projets/evanescent/cover.webp",
    coverW: 2000, coverH: 2667,
    images: []
  },

  {
    slug: "canopee-urbaine",
    no: "005",
    titre: "Canopée urbaine",
    annee: "2025",
    court: "H25",
    cadre: "Géométrie, structure et tectonique",
    lieu: "Place d’Youville, Québec, QC",
    type: "Abri bus urbain",
    sousTitre: "",
    date: "Hiver 2025",
    superviseur: "",
    collaborateurs: "Kayanne Loudiyi",
    concept: "",
    description: `Canopée urbaine est un projet de renouvèlement de l’abribus du Terminus D’Youville. Le but est d’apporter la nature dans un centre-ville dominé par le bitume. Le projet se veut ouvert, accueillant et chaleureux.
En utilisant le bois comme matériau principal, le projet se démarque sur son site, qui est entouré de bâtiment en béton. Cela permet aussi d’évoquer la chaleur de la forêt qui ne se retrouve pas en ville.
Les poteaux en bois agissent comme éléments structurels et comme une métaphore à l’arbre. Deux poteaux sont placés sur chaque trottoir pour contreventer adéquatement la structure.
Des poutres, placées en angle, viennent imiter l’allure d’une branche d’arbre et permettent de soutenir le toit. D’autres poutres secondaires ajoutent du renfort structural, et une élégance.
Comme son nom l’indique, le toit fait allusion à la canopée d’une forêt. Le toit, qui est une dalle plissée, est composé de plusieurs triangles dont l’angle varie pour ajouter plus de dynamisme et rappeler les formes de l’abribus original. Certains sont aussi percés pour créer des puits de lumière et évoquer la lumière qui passe entre les feuilles dans une forêt.
Des bancs intégrés circulaires sont ajoutés autour des poteaux et des bancs triangulaires permettent aux usagers d’attendre leur transport dans un environnement ouvert. Il était aussi important pour nous d’ajouter des espaces verts. Les bancs triangulaires accueillent au centre des plantes, et quelques percements sur le trottoir permettent aussi à la nature de s’intégrer au projet.`,
    contribution: "Dessins d'assemblage, conception, rendus.",

    cover: "images/projets/canopee-urbaine/cover.webp",
    coverW: 2000, coverH: 1125,

    /* Séquence : rendu, dessin d'ensemble qui repère les assemblages,
       les quatre planches d'assemblage, puis les maquettes.

       « taille » et « position » donnent le rythme :
         taille   : pleine · grande · moyenne · petite · mini
         position : gauche · centre · droite
         decalage : nombre de pixels pour décaler une image vers le bas,
                    ce qui évite l'effet de deux vignettes alignées.
       Sans rien préciser, une image occupe une grande largeur, centrée. */
    images: [
      { src: "images/projets/canopee-urbaine/01.webp",
        legende: "Intention : de l’existant au projet",
        w: 2000, h: 1313, taille: "grande", position: "centre" },

      { src: "images/projets/canopee-urbaine/02.webp",
        legende: "Plan d’implantation",
        w: 2001, h: 1408, taille: "moyenne", position: "gauche" },

      /* Élévation très large et basse : elle prend toute la colonne,
         sinon le dessin devient illisible. */
      { src: "images/projets/canopee-urbaine/10.webp",
        legende: "Coupe",
        w: 2001, h: 454, taille: "pleine" },

      { src: "images/projets/canopee-urbaine/03.webp", legende: "",
        w: 2000, h: 1125, taille: "pleine" },

      { src: "images/projets/canopee-urbaine/04.webp",
        legende: "Vue d’ensemble et repérage des assemblages",
        w: 2000, h: 1313, taille: "grande", position: "centre" },

      { src: "images/projets/canopee-urbaine/05.webp",
        legende: "Assemblage du poteau",
        w: 2000, h: 1313, taille: "petite", position: "gauche" },
      { src: "images/projets/canopee-urbaine/06.webp",
        legende: "Assemblage des « branches »",
        w: 2000, h: 1313, taille: "petite", position: "droite", decalage: 90 },

      { src: "images/projets/canopee-urbaine/07.webp",
        legende: "Assemblage de la poutre",
        w: 2000, h: 1313, taille: "petite", position: "gauche" },
      { src: "images/projets/canopee-urbaine/08.webp",
        legende: "Assemblage de la fondation",
        w: 2000, h: 1313, taille: "petite", position: "droite", decalage: 90 },

      { src: "images/projets/canopee-urbaine/11.webp",
        legende: "Maquette d’ensemble",
        w: 2000, h: 1215, taille: "moyenne", position: "droite" },
      { src: "images/projets/canopee-urbaine/09.webp",
        legende: "Maquette, détail",
        w: 2000, h: 1222, taille: "mini", position: "gauche", decalage: 60 }
    ]
  },

  {
    /* --- Projet complet, sert de modèle pour remplir les autres --- */
    slug: "gemaux",
    no: "006",
    titre: "Gémaux",
    annee: "2025",
    court: "H25",
    cadre: "Atelier II",
    lieu: "Cap-Diamant, Québec, QC",

    type: "Multilogement",
    sousTitre: "",
    date: "Hiver 2025",
    superviseur: "Supervisé par Louis St-Pierre",
    collaborateurs: "Ariane Baillargeon et Lamia Zhouri",

    concept: "À deux, c’est mieux.",

    description:
      "Gémaux est un projet de multilogement qui cherche à créer un sentiment " +
      "de communauté dans le quartier. Les deux bâtiments sont disposés de " +
      "manière à créer une rue intérieure habitée qui offre également une " +
      "percée visuelle vers le fleuve.",

    /* Projet d'équipe : à toi d'écrire ce que tu as porté personnellement.
       Laissé vide, la ligne « Ma contribution » ne s'affiche pas. */
    contribution: "Conception, modélisation 3D, rendus.",

    cover: "images/projets/gemaux/cover.webp",

    coverW: 2000, coverH: 1332,
    /* Les trois images d'exemple (aplats gris) ont été retirées avant la
       mise en ligne. Ajoute ici les vraies, sur le modèle des autres projets. */
    images: []
  },

  {
    slug: "la-poesie-de-l-ordinaire",
    no: "007",
    titre: "La poésie de l’ordinaire",
    annee: "2025",
    court: "H25",
    cadre: "Théories de l’architecture, de 1945 à aujourd’hui",
    lieu: "",
    type: "Livre d'artiste",
    sousTitre: "",
    date: "Hiver 2025",
    superviseur: "",
    collaborateurs: "Florence Beauchamp et Kayanne Loudiyi",
    concept: "",
    description: `Le livre d’artiste La poésie de l’ordinaire est un court magazine qui présente la philosophie et les œuvres de l’Independent Group. Les principaux membres, tels qu’Eduardo Paloozi, Peter et Alison Smithson ainsi que Reiner Banham, y sont présentés plus en détail.
Outre les éléments graphiques épurés, des annotations provocantes et grunge, réalisées à la main, proposent une réinterprétation des idées abordées, comme si elles avaient été rédigées par le Groupe Indépendant lui-même.`,
    contribution: "Design graphique, illustration, édition.",

    /* Le livre complet, en téléchargement. « taille » est un texte libre :
       mets-la à jour si tu remplaces le fichier par une version différente. */
    telechargement: {
      href: "images/projets/la-poesie-de-l-ordinaire/la-poesie-de-l-ordinaire.pdf",
      label: "Télécharger le livre (PDF)",
      taille: "18 Mo"
    },

    cover: "images/projets/la-poesie-de-l-ordinaire/cover.webp",
    coverW: 2000, coverH: 1500,
    images: []
  },

  {
    slug: "confluence",
    no: "008",
    titre: "Confluence",
    annee: "2025",
    court: "A25",
    cadre: "Atelier III",
    lieu: "Trois-Rivières, Québec, QC",
    type: "Transformation d'un batiment patrimoinial",
    sousTitre: "",
    date: "Automne 2025",
    superviseur: "Supervisé par Paolo Carlotti",
    collaborateurs: "",
    concept: "",
    description: `Déposée comme une sculpture au cœur de la ville, Confluence aspire à donner un nouveau souffle au centre-ville de Trois-Rivières. Le projet réaménage un bâtiment patrimonial en pavillon du département des lettres de l’UQTR. Pour répondre aux exigences du programme, un agrandissement dichotomique s’y ajoute. Ce nouveau volume se déploie comme un bâtiment spécialisé, abritant un auditorium et une vaste bibliothèque. La place publique est également repensée afin de redéfinir sa polarité et d’affirmer son rôle comme espace civique majeur de la ville.
Par son réaménagement, elle contribue à révéler et à mettre en valeur le nouveau volume, renforçant le dialogue entre l’architecture et l’espace urbain. L’ensemble est pensé comme un lieu de destination, invitant non seulement à la visite, mais aussi à la permanence et à l’appropriation des espaces.`,
    contribution: "",
    cover: "images/projets/confluence/cover.webp",
    coverW: 2000, coverH: 1333,
    images: []
  },

  {
    slug: "exploration-du-bois",
    no: "009",
    titre: "Exploration du bois",
    annee: "2025",
    court: "A25",
    cadre: "Conceptualisation et interprétation spatiale architectonique",
    lieu: "",
    type: "Exploration de la matière",
    sousTitre: "",
    date: "Automne 2025",
    superviseur: "",
    collaborateurs: "",
    concept: "",
    description: "Une branche seule casse sous une main alors que les racines d’un même arbre résistent, ensemble, invisibles sous la terre. Entre ces deux vérités se loge un paradoxe : dans la nature, la force naît du lien, jamais de l’isolement. La tenségrité rend ce paradoxe visible, à travers des tiges rigides tenues par un fil de tension, un équilibre qui ne repose que sur la relation entre les parties.",
    contribution: "",
    /* Vidéo affichée en pleine largeur, tout en bas de la page (après les
       images). affiche/afficheW/afficheH sont facultatifs — sans eux, la
       vignette officielle de YouTube est utilisée directement. */
    video: {
      youtube: "zJ0OGuwhTxk",
      titre: "Processus",
      affiche: "images/projets/exploration-du-bois/video-affiche.webp",
      afficheW: 1280, afficheH: 720
    },

    cover: "images/projets/exploration-du-bois/cover.webp",
    coverW: 2000, coverH: 1333,
    images: [
      { src: "images/projets/exploration-du-bois/01.webp",
        legende: "Structure en tension et compression",
        w: 2000, h: 1333, taille: "grande", position: "centre" },

      { src: "images/projets/exploration-du-bois/03.webp",
        legende: "Détail",
        w: 2000, h: 3000, taille: "petite", position: "gauche" },
      { src: "images/projets/exploration-du-bois/02.webp",
        legende: "Référence : système racinaire",
        w: 2000, h: 3000, taille: "petite", position: "droite", decalage: 90 },

      { src: "images/projets/exploration-du-bois/04.webp",
        legende: "Ombres portées au sol",
        w: 2000, h: 1333, taille: "pleine" },

      { src: "images/projets/exploration-du-bois/05.webp",
        legende: "Assemblage par ligature",
        w: 2000, h: 1333, taille: "moyenne", position: "centre" }
    ]
  },

  {
    slug: "exploration-biosourcee",
    no: "010",
    titre: "Exploration biosourcée",
    annee: "2025",
    court: "A25",
    cadre: "Conceptualisation et interprétation spatiale architectonique",
    lieu: "",
    type: "Exploration de la matière",
    sousTitre: "Abysse",
    date: "Automne 2025",
    superviseur: "",
    collaborateurs: "Amy Tinoco Munoz et Gabrielle Pouliot",
    concept: "",
    description: `Chaque année, environ 11 millions de tonnes de plastique se retrouvent dans l’océan. Ce sont nos bouteilles d’eau, les emballages de nos produits alimentaires, nos pailles. L’accumulation de ces déchets menace la vie sous-marine, mettant en péril des dizaines d’espèces.
Le présent exercice nous invitait à explorer diverses matières biosourcées et ainsi, imaginer à l’aide de celles-ci, un territoire, une histoire. Il nous amenait également à repenser le cycle de vie d’un bâtiment. En considérant cette approche nous avons été amenés à travailler le bloc maritime et l’époxy. Cette dichotomie entre la matière biosourcée et le produit chimique met en lumière les questions essentielles liées à la vie marine et aux impacts des actions humaines.`,
    contribution: "Conception, journal de conception.",
    cover: "images/projets/exploration-biosourcee/cover.webp",
    coverW: 2000, coverH: 1506,
    images: []
  },

  {
    slug: "re-modelisation-espace-de-travail",
    no: "011",
    titre: "Ré-modélisation d’un espace de travail",
    annee: "2026",
    court: "H26",
    cadre: "Figuration et conceptualisation numériques",
    lieu: "",
    type: "Modélisation 3D",
    sousTitre: "",
    date: "Hiver 2026",
    superviseur: "",
    collaborateurs: "",
    concept: "",
    description: "Remodéliser son propre espace de travail avec la plus grande fidélité possible : voilà la consigne du projet. L’exercice sert de prise en main pour deux logiciels, Rhino 8 pour la modélisation 3D et D5 Render pour le rendu.",
    contribution: "",
    cover: "images/projets/re-modelisation-espace-de-travail/cover.webp",
    coverW: 2000, coverH: 1477,
    images: [
      { src: "images/projets/re-modelisation-espace-de-travail/03.webp",
        legende: "Vue d’ensemble",
        w: 2000, h: 1333, taille: "pleine" },

      { src: "images/projets/re-modelisation-espace-de-travail/02.webp",
        legende: "Plan de travail",
        w: 2000, h: 1334, taille: "moyenne", position: "gauche" },
      { src: "images/projets/re-modelisation-espace-de-travail/01.webp",
        legende: "Détail",
        w: 2000, h: 1334, taille: "mini", position: "droite", decalage: 70 }
    ]
  },

  {
    slug: "empreinte-de-la-ville",
    no: "012",
    titre: "Empreinte de la ville",
    annee: "2026",
    court: "H26",
    cadre: "Figuration et conceptualisation numériques",
    lieu: "Vieux-Québec, Québec, QC",
    type: "Installation urbaine",
    sousTitre: "Concours amical 'I've got no roof'",
    date: "Hiver 2026",
    superviseur: "",
    collaborateurs: "Amy Tinoco Munoz, Gabrielle Pouliot et Lilou Mercier",
    concept: "",
    description: `Empreinte de la ville est un projet de toiture pour une nouvelle scène du Festival d’été de Québec. Elle prend place au parc des Champs-de-Bataille, à proximité des autres scènes, pour rester accessible au plus grand nombre de festivaliers.
Le concept représente Québec par sa culture, mais aussi par sa géographie et sa topographie. Un script Grasshopper simule un drap qui tombe sur la ville et épouse son relief : cette simulation donne la forme initiale de la scène. Inversée et retravaillée, cette forme devient la toiture.
Un maillage voronoï transforme ensuite la surface en structure. Entre les triangles, des vitres de couleurs différentes captent la lumière et créent une ambiance singulière.
Grasshopper accompagne chaque étape du projet, de la conception jusqu’à la préparation de la maquette. Pour la fabrication, l’imprimante à résine reste l’outil principal.
Concours amical I’ve got no roof! – Prix impression résine, mention`,
    contribution: "Conception, modélisation 3D, rendus.",

    cover: "images/projets/empreinte-de-la-ville/cover.webp",
    coverW: 1489, coverH: 993,

    /* Séquence : le rendu, puis la simulation du drap qui donne la forme
       initiale, le diagramme Grasshopper, et enfin la capture d'écran du
       processus. Les deux .mp4 remplacent des GIF d'origine — même
       rendu visuel en boucle silencieuse, pour une fraction du poids. */
    images: [
      { src: "images/projets/empreinte-de-la-ville/02.webp",
        legende: "Vue de la toiture",
        w: 2000, h: 1500, taille: "pleine" },

      { src: "images/projets/empreinte-de-la-ville/04.mp4", video: true,
        legende: "Simulation du drap sur la topographie de Québec",
        w: 800, h: 476, taille: "grande", position: "centre" },

      { src: "images/projets/empreinte-de-la-ville/01.webp",
        legende: "Définition Grasshopper : de la simulation à la toiture",
        w: 1278, h: 684, taille: "moyenne", position: "gauche" },
      { src: "images/projets/empreinte-de-la-ville/03.mp4", video: true,
        legende: "Maillage voronoï en cours de génération",
        w: 1600, h: 896, taille: "moyenne", position: "droite", decalage: 70 }
    ]
  },

  {
    slug: "murmures",
    no: "013",
    titre: "Murmures",
    annee: "2026",
    court: "H26",
    cadre: "Atelier IV",
    lieu: "Île d’Orléans, Québec, QC",
    type: "Centre de déconnexion du numérique",
    sousTitre: "Habiter le son du vivant",
    date: "Hiver 2026",
    superviseur: "Supervisé par Anabelle Tougas",
    collaborateurs: "",
    concept: "",
    description: `Au nord de l’île sont les escaliers qui mènent vers les fonds, pleins de silence. Un silence […] sans hypocrisie […] pour retrouver ce qui était perdu. »
Dans la forêt, les échos du vivant sont amplifiés, le silence devient musique et la nature s’accorde au vent. Situé sur l’Île d’Orléans, Murmures offre une évasion pour le travailleur de la ville.
En harmonie avec la nature, l’architecture propose une expérience immersive qui amplifie le son naturel du lieu, qui révèle l’invisible. Le parcours guide le visiteur à travers une séquence d’espace, salles de thérapie sonore, atelier, volume méditatif, où l’écoute devient centrale. La finalité de celui-ci révèle la musique pure du lieu.
« [Elle] a habitué ses yeux au silence... » - Le Fou de l’Île - Félix Leclerc`,
    contribution: "",
    cover: "images/projets/murmures/cover.webp",
    coverW: 1529, coverH: 1029,
    images: []
  }

];
