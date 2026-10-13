/* ==========================================================================
   site.js — réglages généraux du site
   Tout ce qui touche à l'identité, la navigation et la page Contact.
   ========================================================================== */

const SITE = {

  /* Nom affiché en bas à droite sur toutes les pages. */
  nom: "Lily-Mei Fournier",

  /* ------------------------------------------------------------------
     NAVIGATION
     L'ordre ici = l'ordre affiché en haut à gauche.
     « bas: true » place l'entrée en bas à gauche (cas de « contact »).
     ------------------------------------------------------------------ */
  nav: [
    { label: "accueil", href: "index.html" },
    { label: "projets", href: "projets.html" },
    { label: "info",    href: "info.html" },
    { label: "extras",  href: "extras.html" },
    { label: "contact", href: "contact.html", bas: true }
  ],

  /* ------------------------------------------------------------------
     SÉLECTION DE L'ACCUEIL
     Liste des « slug » de projets montrés dans la galerie d'accueil,
     dans l'ordre d'affichage de gauche à droite.
     Pour réordonner : déplacer les lignes. Pour retirer : supprimer
     la ligne. Le slug doit exister dans data/projects.js.
     ------------------------------------------------------------------ */
  accueil: [
    "poeme-symphonique",
    "la-poesie-de-l-ordinaire",
    "canopee-urbaine",
    "evanescent",
    "gemaux",
    "empreinte-de-la-ville",
    "murmures"
  ],

  /* ------------------------------------------------------------------
     CONTACT
     Retirer une ligne la fait disparaître de la page.
     ------------------------------------------------------------------ */
  contact: {
    intro: "Pour toute question, collaboration ou opportunité de stage.",
    liens: [
      { label: "Courriel",  valeur: "lily-mei.fournier@outlook.com", href: "mailto:lily-mei.fournier@outlook.com" },
      /* Exemples à compléter avec tes vrais comptes, puis à décommenter
         (retirer les // en début de ligne). Le pseudo Instagram ci-dessous
         était inventé pour la maquette : remplace-le par le tien.
      { label: "Instagram", valeur: "@ton.pseudo",        href: "https://instagram.com/ton.pseudo" },
      { label: "LinkedIn",  valeur: "Lily-Mei Fournier",  href: "https://linkedin.com/in/ton-profil" },
      { label: "Téléphone", valeur: "+1 418 000 0000",    href: "tel:+14180000000" }
      */
    ]
  }
};
