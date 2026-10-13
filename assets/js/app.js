/* ==========================================================================
   app.js — interactions et rendu des pages
   --------------------------------------------------------------------------
   Aucun contenu ici : tout vient de data/site.js, data/projects.js,
   data/extras.js et data/info.js.

   Ce fichier se contente de :
     1. dessiner la navigation commune
     2. remplir chaque page à partir des données
   ========================================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------------- outils */

  /** Neutralise le HTML dans une valeur venue des données. */
  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function $(sel) { return document.querySelector(sel); }

  /**
   * Transforme un texte en paragraphes.
   *
   * Chaque retour à la ligne commence un nouveau paragraphe. Dans les
   * données, écrire le texte entre accents graves ( ` ) plutôt qu'entre
   * guillemets : c'est la seule écriture qui accepte de vraies coupures
   * de ligne en JavaScript.
   *
   *   description: `Premier paragraphe.
   *   Deuxième paragraphe.`
   *
   * Une liste fonctionne aussi, si tu préfères :
   *
   *   description: ["Premier paragraphe.", "Deuxième paragraphe."]
   */
  function paragraphes(v) {
    if (!v) return "";

    var blocs = Array.isArray(v) ? v : String(v).split(/\n+/);

    return blocs
      .map(function (b) { return String(b).trim(); })
      .filter(Boolean)
      .map(function (b) { return "<p>" + esc(b) + "</p>"; })
      .join("");
  }

  /** Nom du fichier courant, « index.html » par défaut. */
  function pageCourante() {
    var f = window.location.pathname.split("/").pop();
    return f === "" ? "index.html" : f;
  }

  /** Valeur d'un paramètre d'adresse (projet.html?p=gemaux). */
  function param(nom) {
    return new URLSearchParams(window.location.search).get(nom);
  }

  function parSlug(liste, slug) {
    for (var i = 0; i < liste.length; i++) {
      if (liste[i].slug === slug) return liste[i];
    }
    return null;
  }

  /** « 3/2 » → 0.667 : hauteur relative pour une largeur de 1. */
  function facteurHauteur(ratio) {
    var m = String(ratio || "1/1").split("/");
    var l = parseFloat(m[0]), h = parseFloat(m[1]);
    return (l && h) ? h / l : 1;
  }

  /**
   * Balise image.
   *
   * Options :
   *   classe       classe CSS
   *   w, h         dimensions réelles du fichier, en pixels. Facultatives.
   *                Fournies, le navigateur réserve la place exacte avant le
   *                chargement : plus aucun sursaut de la page. Le rapport
   *                vient du fichier lui-même, donc aucune déformation
   *                possible même si les images n'ont pas toutes le même
   *                format.
   *   ratio        proportion imposée. À n'utiliser que sur une vignette
   *                recadrée (« object-fit: cover »), jamais sur une image
   *                affichée en entier : un ratio inexact l'écraserait.
   *   prioritaire  charge l'image tout de suite au lieu de la différer.
   */
  function img(src, alt, o) {
    o = o || {};
    var attrs = "";

    if (o.classe) attrs += ' class="' + o.classe + '"';

    if (o.w && o.h) attrs += ' width="' + esc(o.w) + '" height="' + esc(o.h) + '"';
    else if (o.ratio) attrs += ' style="aspect-ratio:' + esc(o.ratio) + '"';

    attrs += ' loading="' + (o.prioritaire ? "eager" : "lazy") + '" decoding="async"';

    return '<img src="' + esc(src) + '" alt="' + esc(alt) + '"' + attrs + ">";
  }


  /* ------------------------------------------------------- 1. NAVIGATION */

  /* Les pages gabarits doivent surligner leur section parente. */
  var PARENT = { "projet.html": "projets.html", "extra.html": "extras.html" };

  function dessinerChrome() {
    var ici = pageCourante();
    var actif = PARENT[ici] || ici;

    var haut = [], bas = [];

    SITE.nav.forEach(function (item) {
      var courant = item.href === actif ? ' aria-current="page"' : "";
      var lien = '<a href="' + esc(item.href) + '"' + courant + ">" +
                 esc(item.label) + "</a>";

      /* Les entrées « bas » sont écrites aux deux endroits : en bas à
         gauche sur grand écran, dans la barre du haut sur mobile où le
         pied de page serait hors d'atteinte. Le CSS n'en montre qu'une. */
      if (item.bas) {
        haut.push('<li class="chrome__mobile">' + lien + "</li>");
        bas.push("<li>" + lien + "</li>");
      } else {
        haut.push("<li>" + lien + "</li>");
      }
    });

    var nav = $(".chrome__nav");
    if (nav) nav.innerHTML = "<ul>" + haut.join("") + "</ul>";

    var pied = $(".chrome__bas");
    if (pied) pied.innerHTML = "<ul>" + bas.join("") + "</ul>";

    var sign = $(".chrome__signature");
    if (sign) sign.textContent = SITE.nom;
  }


  /* ------------------------------------------------------------ APPARITION
     Le contenu se pose en fondu au lieu d'apparaître d'un coup.

     Joué via l'API Web Animations plutôt qu'une transition CSS déclenchée
     par une classe. Une transition CSS se règle par la propriété
     raccourcie « transition » — si l'élément révélé a par ailleurs sa
     propre transition (couleur au survol, agrandissement au survol...),
     l'une des deux déclarations gagne entièrement sur l'autre selon la
     spécificité et l'ordre du CSS, pas les deux à la fois. C'est
     précisément ce qui rendait l'index des projets silencieux : ses
     lignes sont des <a class="index__ligne">, et le sélecteur
     "a.index__ligne" a une spécificité plus grande que ".reveler" — sa
     transition (couleur) l'emportait toujours, sans jamais laisser
     passer celle de l'apparition (opacité, position).
     L'API Web Animations n'a pas ce problème : elle anime l'élément
     directement, sans passer par une règle CSS avec laquelle une autre
     règle pourrait entrer en conflit.

     Trois précautions :
       - rien n'est masqué si le système demande de limiter les animations ;
       - rien n'est masqué si IntersectionObserver ou l'API manquent ;
       - un filet de sécurité révèle tout au bout de trois secondes, pour
         qu'aucune image ne puisse rester invisible en cas d'imprévu.
  ------------------------------------------------------------------------ */

  var MOUVEMENT_OK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
                     && "IntersectionObserver" in window
                     && "animate" in document.documentElement;

  var guetteur = null;

  function reveler(elements, decalageDepart) {
    if (!MOUVEMENT_OK) return;

    var liste = [].slice.call(elements);
    if (!liste.length) return;

    /* Les vignettes de l'accueil sont côte à côte : un déplacement
       vertical n'y a pas de sens, seul le fondu s'applique. */
    function decale(el) { return !el.closest(".galerie"); }

    /**
     * Attend que l'image portée par l'élément ait fini de charger.
     *
     * Sans cette attente, l'animation démarre à l'heure prévue même si la
     * photo n'est pas encore arrivée : elle joue sur une case vide, puis
     * l'image « saute » dedans dès que son téléchargement se termine —
     * deux horloges indépendantes qui se contredisent. En réseau rapide et
     * en local ça ne se voit pas (tout arrive en une poignée de
     * millisecondes), mais dès que les photos pèsent quelques centaines
     * de kilo-octets et mettent réellement du temps à arriver, l'écart
     * devient un décalage saccadé. Ici, l'apparition attend que la photo
     * soit prête avant de jouer, pour montrer une image déjà formée.
     */
    function attendreImage(el) {
      var im = el.tagName === "IMG" ? el : el.querySelector("img");
      if (!im || im.complete) return Promise.resolve();
      return new Promise(function (resolve) {
        var fini = function () {
          im.removeEventListener("load", fini);
          im.removeEventListener("error", fini);
          resolve();
        };
        im.addEventListener("load", fini);
        im.addEventListener("error", fini);   // une image cassée ne bloque pas
      });
    }

    function jouer(el) {
      var depart = decale(el)
        ? { opacity: 0, transform: "translateY(10px)" }
        : { opacity: 0 };
      var arrivee = decale(el)
        ? { opacity: 1, transform: "translateY(0)" }
        : { opacity: 1 };

      var anim = el.animate([depart, arrivee], {
        duration: 700,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)"
      });

      /* Une fois jouée, l'animation n'a plus besoin de laisser de trace :
         le style en ligne posé au départ est retiré, l'élément retombe
         sur son opacité et sa position naturelles — 1 et « aucune » —,
         qui sont déjà ce que l'animation vient d'atteindre. */
      var finir = function () { el.style.opacity = ""; el.style.transform = ""; };
      anim.finished.then(finir).catch(finir);
    }

    liste.forEach(function (el, i) {
      if (el.dataset.reveler) return;   // déjà pris en charge
      el.dataset.reveler = "1";

      /* Posé en style en ligne — jamais en classe — pour ne dépendre
         d'aucune règle CSS ni de sa spécificité. */
      el.style.opacity = "0";
      if (decale(el)) el.style.transform = "translateY(10px)";

      /* Léger décalage en cascade, plafonné : au-delà l'attente se voit. */
      el.dataset.revelerDelai = Math.min((decalageDepart || 0) + i * 55, 420);

      if (!guetteur) {
        guetteur = new IntersectionObserver(function (entrees, obs) {
          entrees.forEach(function (e) {
            if (!e.isIntersecting) return;
            var cible = e.target;
            var d = parseInt(cible.dataset.revelerDelai || 0, 10);
            attendreImage(cible).then(function () {
              setTimeout(function () { jouer(cible); }, d);
            });
            obs.unobserve(cible);
          });
        }, { rootMargin: "0px 0px -8% 0px" });
      }
      guetteur.observe(el);
    });

    /* Filet de sécurité : le style en ligne est retiré tout de suite,
       comme si l'élément n'était jamais passé par ce mécanisme. */
    setTimeout(function () {
      liste.forEach(function (el) { el.style.opacity = ""; el.style.transform = ""; });
    }, 3000);
  }


  /* ---------------------------------------------------------- VISIONNEUSE
     Clic sur une image : elle s'ouvre en grand par-dessus la page.
     Fermeture au clic sur le fond, sur la croix, ou avec Échap.
     Flèches gauche/droite pour passer d'une image à l'autre.
  ------------------------------------------------------------------------ */

  function visionneuse() {
    var boutons = [].slice.call(document.querySelectorAll(".zoom"));
    if (!boutons.length) return;

    var vues = boutons.map(function (b) {
      var i = b.querySelector("img");
      var f = b.closest("figure");
      var l = f && f.querySelector(".legende");
      return { src: i.getAttribute("src"), alt: i.getAttribute("alt"),
               legende: l ? l.textContent : "" };
    });

    var boite = document.createElement("div");
    boite.className = "loupe";
    boite.setAttribute("role", "dialog");
    boite.setAttribute("aria-modal", "true");
    boite.setAttribute("aria-label", "Image agrandie");
    boite.innerHTML =
      '<button type="button" class="loupe__fermer" aria-label="Fermer">✕</button>' +
      '<button type="button" class="loupe__prec"  aria-label="Image précédente">‹</button>' +
      '<button type="button" class="loupe__suiv"  aria-label="Image suivante">›</button>' +
      '<figure class="loupe__scene">' +
        '<img alt="">' +
        '<figcaption class="legende loupe__legende"></figcaption>' +
      "</figure>";
    document.body.appendChild(boite);

    var image  = boite.querySelector("img");
    var texte  = boite.querySelector(".loupe__legende");
    var seul   = vues.length < 2;
    var index  = 0;
    var origine = null;      // pour rendre le focus à l'image d'où l'on vient

    boite.querySelector(".loupe__prec").hidden = seul;
    boite.querySelector(".loupe__suiv").hidden = seul;

    function montrer(i) {
      index = (i + vues.length) % vues.length;
      var v = vues[index];
      image.src = v.src;
      image.alt = v.alt || "";
      texte.textContent = v.legende;
      texte.hidden = !v.legende;
    }

    function ouvrir(i, depuis) {
      origine = depuis || null;
      montrer(i);
      boite.dataset.ouvert = "true";
      document.body.style.overflow = "hidden";   // fige la page derrière
      boite.querySelector(".loupe__fermer").focus();
    }

    function fermer() {
      delete boite.dataset.ouvert;
      document.body.style.overflow = "";
      if (origine) origine.focus();
    }

    boutons.forEach(function (b, i) {
      b.addEventListener("click", function () { ouvrir(i, b); });
    });

    boite.querySelector(".loupe__fermer").addEventListener("click", fermer);
    boite.querySelector(".loupe__prec").addEventListener("click", function (e) {
      e.stopPropagation(); montrer(index - 1);
    });
    boite.querySelector(".loupe__suiv").addEventListener("click", function (e) {
      e.stopPropagation(); montrer(index + 1);
    });

    /* Clic sur le fond — mais pas sur l'image elle-même. */
    boite.addEventListener("click", function (e) {
      if (e.target === boite || e.target.classList.contains("loupe__scene")) fermer();
    });

    document.addEventListener("keydown", function (e) {
      if (!boite.dataset.ouvert) return;
      if (e.key === "Escape") fermer();
      else if (e.key === "ArrowLeft" && !seul) montrer(index - 1);
      else if (e.key === "ArrowRight" && !seul) montrer(index + 1);
    });
  }


  /* -------------------------------------------------------------- CURSEUR
     Remplace la flèche système par un point de la couleur d'accent.
     Seulement sur un appareil à pointeur précis — au doigt, rien ne
     remplace le doigt, et l'appareil n'a de toute façon pas de curseur
     à remplacer.
  ------------------------------------------------------------------------ */

  function curseurPersonnalise() {
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    var el = document.createElement("div");
    el.className = "curseur";
    el.innerHTML = '<span class="curseur__point"></span>';
    document.body.appendChild(el);

    /* Éléments dont le survol fait grossir le point — la même liste que
       ce que le site rend cliquable ailleurs. */
    var INTERACTIFS = "a, button, [role='button']";

    var visible = false;
    var survole = false;

    document.addEventListener("mousemove", function (e) {
      if (!visible) { el.classList.add("curseur--visible"); visible = true; }

      /* Position posée directement, sans transition : un curseur qui
         traînerait derrière la souris se sentirait cassé plutôt que
         stylé. Seul le grossissement au survol est adouci (voir CSS). */
      el.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0)";

      var survolePresent = !!(e.target.closest && e.target.closest(INTERACTIFS));
      if (survolePresent !== survole) {
        el.classList.toggle("curseur--survol", survolePresent);
        survole = survolePresent;
      }
    }, { passive: true });

    /* En sortant de la fenêtre — ou en entrant dans l'iframe d'une vidéo
       intégrée, où le suivi de la souris n'est plus possible — le point
       disparaît plutôt que de rester figé au dernier endroit connu. */
    document.addEventListener("mouseout", function (e) {
      if (!e.relatedTarget) {
        el.classList.remove("curseur--visible");
        visible = false;
      }
    });

    document.documentElement.classList.add("curseur-actif");
  }


  /* ------------------------------------------------------ RETOUR EN HAUT */

  function retourEnHaut() {
    var bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "haut";
    bouton.setAttribute("aria-label", "Revenir en haut de la page");
    bouton.innerHTML = '<span aria-hidden="true">↑</span>';
    document.body.appendChild(bouton);

    bouton.addEventListener("click", function () {
      /* « smooth » sauf si le système demande à limiter le mouvement. */
      var doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: doux ? "smooth" : "auto" });
    });

    /* C'est en bas de page que la flèche sert le plus : elle y reste donc
       visible. Pour ne pas recouvrir la signature, elle remonte juste
       au-dessus du pied dès que celui-ci entre à l'écran. */
    var pied = $(".chrome__pied");

    function rafraichir() {
      bouton.dataset.visible = window.scrollY > window.innerHeight * 0.6
        ? "true" : "false";

      var bas = 32;
      if (pied) {
        var haut = pied.getBoundingClientRect().top;
        if (haut < window.innerHeight - 62) bas = window.innerHeight - haut + 16;
      }
      bouton.style.bottom = bas + "px";
    }

    var attente = false;
    window.addEventListener("scroll", function () {
      if (attente) return;
      attente = true;
      requestAnimationFrame(function () { rafraichir(); attente = false; });
    }, { passive: true });

    rafraichir();
  }


  /* ---------------------------------------------------------- 2. ACCUEIL */

  function dessinerAccueil(hote) {
    hote.innerHTML = SITE.accueil.map(function (slug, i) {
      var p = parSlug(PROJECTS, slug);
      if (!p) return "";   // slug inconnu : on ignore silencieusement

      return '<a class="galerie__item" href="projet.html?p=' + esc(p.slug) + '">' +
               img(p.cover, p.titre, { classe: "galerie__image", prioritaire: i < 3 }) +
               '<span class="galerie__legende">' + esc(p.titre) +
                 '<span class="galerie__annee">' + esc(p.court || p.annee) + "</span>" +
               "</span>" +
             "</a>";
    }).join("");
  }


  /* ---------------------------------------------------------- 3. PROJETS */

  /* Ordre par défaut : du plus récent au plus ancien. La numérotation
     des projets ne change jamais, seul l'ordre d'affichage bouge. */
  var tri = { cle: "no", sens: "desc" };

  var COLONNES = [
    { cle: "no",     label: "No.",    triable: true,  classe: "" },
    { cle: "titre",  label: "Projet", triable: false, classe: "" },
    { cle: "annee",  label: "Année",  triable: true,  classe: "index__annee" },
    { cle: "cadre",  label: "Cadre",  triable: false, classe: "index__cadre" },
    { cle: "lieu",   label: "Lieu",   triable: false, classe: "index__lieu" }
  ];

  function projetsTries() {
    var liste = PROJECTS.slice();
    var signe = tri.sens === "asc" ? 1 : -1;

    liste.sort(function (a, b) {
      var va = parseFloat(a[tri.cle]), vb = parseFloat(b[tri.cle]);
      if (va !== vb) return (va - vb) * signe;
      /* À année égale, on retombe sur le numéro pour un ordre stable. */
      return (parseFloat(a.no) - parseFloat(b.no)) * signe;
    });
    return liste;
  }

  function dessinerIndex(hote) {

    function entete() {
      return '<div class="index__ligne index__entete">' +
        COLONNES.map(function (c) {
          var contenu = c.triable
            ? '<button type="button" class="index__tri" data-cle="' + c.cle + '"' +
              (tri.cle === c.cle ? ' data-actif="true" data-sens="' + tri.sens + '"' : "") +
              ">" + esc(c.label) +
              '<span class="index__fleche" aria-hidden="true">▼</span></button>'
            : esc(c.label);
          return '<span class="' + c.classe + '">' + contenu + "</span>";
        }).join("") +
      "</div>";
    }

    function corps() {
      return '<div class="index__corps">' +
        projetsTries().map(function (p) {
          return '<a class="index__ligne" href="projet.html?p=' + esc(p.slug) + '">' +
            COLONNES.map(function (c) {
              return '<span class="' + c.classe + '">' + esc(p[c.cle]) + "</span>";
            }).join("") +
          "</a>";
        }).join("") +
      "</div>";
    }

    function peindre() {
      hote.innerHTML = entete() + corps();

      hote.querySelectorAll(".index__tri").forEach(function (b) {
        b.addEventListener("click", function () {
          var cle = b.dataset.cle;
          /* Reclic sur la même colonne : on inverse. Nouvelle colonne :
             on repart du plus récent, l'ordre attendu par défaut. */
          tri = (tri.cle === cle)
            ? { cle: cle, sens: tri.sens === "desc" ? "asc" : "desc" }
            : { cle: cle, sens: "desc" };
          peindre();
          annonce.textContent = "Trié par " + cle +
            (tri.sens === "desc" ? ", ordre décroissant" : ", ordre croissant");
        });
      });
    }

    /* Le tri est une action sans effet visuel pour qui n'y voit pas :
       on l'annonce. */
    var annonce = document.createElement("p");
    annonce.className = "sr-only";
    annonce.setAttribute("role", "status");
    hote.parentNode.insertBefore(annonce, hote);

    peindre();
  }


  /* ------------------------------------------------------ 4. PAGE PROJET */

  function introuvable(hote, retour, href) {
    hote.innerHTML =
      '<h1 class="filet-titre">Introuvable</h1>' +
      '<p class="prose">Cette page n’existe pas ou plus. ' +
      '<a href="' + href + '">' + retour + "</a>.</p>";
  }

  /* Largeurs disponibles, exprimées en colonnes sur une grille de douze. */
  var TAILLES = { pleine: 12, grande: 10, moyenne: 8, petite: 6, mini: 5 };

  /**
   * Position d'une image dans la grille de douze colonnes.
   * Sans indication, une image occupe dix colonnes, centrée.
   */
  function placement(im) {
    if (im.demi && !im.taille) return "grid-column: span 6;";   // ancienne écriture

    var span = TAILLES[im.taille] || TAILLES.grande;
    var pos = im.position || "centre";
    var debut = pos === "gauche" ? 1
              : pos === "droite" ? 13 - span
              : Math.round((12 - span) / 2) + 1;

    var style = "grid-column:" + debut + "/span " + span + ";";
    if (im.decalage) style += "margin-top:" + parseInt(im.decalage, 10) + "px;";
    return style;
  }

  /**
   * Bloc vidéo YouTube, sur toute la largeur de la colonne d'images.
   *
   * Ne charge rien de YouTube tant qu'on n'a pas cliqué : au repos, ce
   * n'est qu'une image avec un bouton dessiné en CSS. Le site continue de
   * ne dépendre d'aucun service externe au premier chargement, et la page
   * reste légère même quand un projet a une vidéo.
   */
  function blocVideo(v) {
    if (!v || !v.youtube) return "";

    var affiche = v.affiche
      ? img(v.affiche, v.titre || "Vidéo du projet",
            { w: v.afficheW, h: v.afficheH })
      : img("https://i.ytimg.com/vi/" + esc(v.youtube) + "/maxresdefault.jpg",
            v.titre || "Vidéo du projet", { ratio: "16/9" });

    return (
      '<figure class="video" style="grid-column:1/-1">' +
        '<button type="button" class="video__declencheur" ' +
                'data-youtube="' + esc(v.youtube) + '" ' +
                'aria-label="Lire la vidéo' + (v.titre ? " — " + esc(v.titre) : "") + '">' +
          affiche +
          '<span class="video__bouton" aria-hidden="true"></span>' +
        "</button>" +
        (v.titre ? '<figcaption class="legende">' + esc(v.titre) + "</figcaption>" : "") +
      "</figure>"
    );
  }

  /** Remplace l'affiche par le lecteur intégré au premier clic. */
  function activerVideos(racine) {
    (racine || document).querySelectorAll(".video__declencheur").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.dataset.youtube;
        var cadre = document.createElement("iframe");
        cadre.className = "video__cadre";
        cadre.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1";
        cadre.title = b.getAttribute("aria-label") || "Vidéo";
        cadre.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        cadre.allowFullscreen = true;
        cadre.loading = "eager";
        b.replaceWith(cadre);
      }, { once: true });
    });
  }

  /**
   * Une image cliquable pour l'agrandir, ou — si `im.video` est vrai —
   * une courte boucle vidéo silencieuse, lue et rejouée automatiquement.
   * Sert à remplacer un GIF : même rendu visuel, un poids bien moindre.
   * Une boucle n'est pas cliquable : rien à agrandir dans une animation
   * qui joue déjà.
   */
  function figure(im, alt) {
    var media = im.video
      ? '<video class="video-boucle" src="' + esc(im.src) + '"' +
          (im.w && im.h ? ' width="' + esc(im.w) + '" height="' + esc(im.h) + '"' : "") +
          ' autoplay loop muted playsinline></video>'
      : '<button type="button" class="zoom" aria-label="Agrandir l’image">' +
          img(im.src, im.legende || alt, { w: im.w, h: im.h, prioritaire: im.prioritaire }) +
        "</button>";

    return '<figure style="' + placement(im) + '">' +
             media +
             (im.legende
               ? '<figcaption class="legende">' + esc(im.legende) + "</figcaption>"
               : "") +
           "</figure>";
  }

  function dessinerProjet(hote) {
    var p = parSlug(PROJECTS, param("p"));
    if (!p) return introuvable(hote, "Retour à l’index", "projets.html");

    document.title = p.titre + " — " + SITE.nom;

    /* --- colonne gauche : les visuels --- */
    var visuels = [];

    if (p.cover) {
      visuels.push(figure(
        { src: p.cover, w: p.coverW, h: p.coverH, taille: "pleine", prioritaire: true },
        p.titre
      ));
    }

    (p.images || []).forEach(function (im) {
      visuels.push(figure(im, p.titre));
    });

    if (p.video) visuels.push(blocVideo(p.video));

    /* --- colonne droite -------------------------------------------------
       Une seule grille pour toutes les lignes, donc alignement garanti.

         1. type, lieu, date
         2. cours, supervision
         3. collaboration      — projets d'équipe seulement
         4. contribution       — projets d'équipe seulement
    --------------------------------------------------------------------- */
    var meta = [
      '<span class="principale">' + esc(p.type) + "</span>",
      '<span class="principale">' + esc(p.lieu) + "</span>",
      '<span class="principale">' + esc(p.date || p.annee) + "</span>"
    ];

    if (p.cadre || p.superviseur) {
      meta.push("<span>" + esc(p.cadre) + "</span>");
      meta.push('<span class="large">' + esc(p.superviseur) + "</span>");
    }
    if (p.collaborateurs) {
      meta.push("<span>En collaboration avec</span>");
      meta.push('<span class="large">' + esc(p.collaborateurs) + "</span>");
    }
    if (p.contribution) {
      meta.push("<span>Ma contribution</span>");
      meta.push('<span class="phrase">' + esc(p.contribution) + "</span>");
    }

    var texte = [];
    if (p.concept)     texte.push('<p class="projet__concept">« ' + esc(p.concept) + " »</p>");
    if (p.description) texte.push(paragraphes(p.description));

    hote.innerHTML =
      '<div class="projet__visuels">' + visuels.join("") + "</div>" +
      "<div>" +
        '<div class="titre-bloc">' +
          "<h1>" + esc(p.titre) + "</h1>" +
          (p.sousTitre ? '<p class="sous-titre">' + esc(p.sousTitre) + "</p>" : "") +
        "</div>" +
        '<div class="projet__meta">' + meta.join("") + "</div>" +
        (texte.length ? '<div class="projet__texte prose">' + texte.join("") + "</div>" : "") +
        (p.telechargement ? telechargement(p.telechargement) : "") +
        '<a class="projet__retour" href="projets.html">← Tous les projets</a>' +
      "</div>";
  }

  /**
   * Ligne cliquable pour télécharger un fichier joint au projet (un PDF,
   * par exemple). `t.taille` est un texte libre et facultatif (ex.
   * « 107 Mo ») affiché à droite ; l'omettre n'affiche que le libellé.
   */
  function telechargement(t) {
    return '<a class="telechargement" href="' + esc(t.href) + '" download>' +
             '<span class="telechargement__label">' + esc(t.label || "Télécharger") + "</span>" +
             (t.taille ? '<span class="telechargement__taille">' + esc(t.taille) + "</span>" : "") +
           "</a>";
  }


  /* ------------------------------------------------------------- 5. INFO */

  function dessinerInfo(hote) {
    var gauche =
      "<figure>" +
        img(INFO.photo.src, INFO.photo.alt, {
          classe: "info__portrait", w: INFO.photo.w, h: INFO.photo.h, prioritaire: true
        }) +
      "</figure>" +
      '<div class="info__bio prose">' +
        paragraphes(INFO.bio) +
      "</div>";

    var droite = INFO.sections.map(function (s) {
      var lignes = s.lignes.map(function (cells) {
        return '<div class="info__ligne info__ligne--' + esc(s.grille) + '">' +
          cells.map(function (c) { return "<span>" + c + "</span>"; }).join("") +
          "</div>";
      }).join("");

      return '<section class="info__section">' +
               '<h2 class="filet-titre">' + esc(s.titre) + "</h2>" +
               '<div class="info__lignes">' + lignes + "</div>" +
             "</section>";
    }).join("");

    hote.innerHTML = "<div>" + gauche + "</div><div>" + droite + "</div>";
  }


  /* ----------------------------------------------------------- 6. EXTRAS
     Mosaïque à défilement continu.

     Les colonnes sont construites ici plutôt qu'avec « columns » en CSS :
     une colonne CSS se rééquilibre à chaque ajout et toute la mosaïque
     sauterait à chaque nouveau lot.

     Le défilement est sans fin en pratique, mais plafonné : une page
     réellement infinie rendrait le pied de page inatteignable, et la
     mémoire du navigateur finirait par souffrir.
  ------------------------------------------------------------------------ */

  var PLAFOND = 240;     // vignettes maximum sur la page

  /* En dessous de ce nombre de projets, la boucle se verrait : la même
     image reviendrait toutes les deux lignes. Chaque projet n'est alors
     montré qu'une fois. */
  var BOUCLE_MIN = 12;

  /** Les extras publiables : ceux marqués « brouillon: true » sont ignorés
      partout, mosaïque comme page individuelle. */
  function extrasPublics() {
    return EXTRAS.filter(function (e) { return !e.brouillon; });
  }

  function dessinerExtras(hote) {
    var liste = extrasPublics();
    if (!liste.length) return;
    var boucle = liste.length >= BOUCLE_MIN;
    var plafond = boucle ? PLAFOND : liste.length;

    var colonnes = [];     // éléments DOM
    var hauteurs = [];     // hauteur relative accumulée par colonne
    var poses = 0;         // vignettes déjà posées
    var nbCol = 0;
    var observateur = null;

    var sentinelle = document.createElement("div");
    sentinelle.className = "mosaique__sentinelle";

    var fin = document.createElement("p");
    fin.className = "mosaique__fin";
    fin.hidden = true;
    fin.textContent = "— fin de la collection —";

    hote.after(sentinelle, fin);

    function nbColonnes() {
      var l = window.innerWidth;
      if (l <= 700) return 2;
      if (l <= 1024) return 3;
      if (l <= 1400) return 4;
      return 5;
    }

    function construire(n) {
      nbCol = n;
      hote.innerHTML = "";
      hote.style.gridTemplateColumns = "repeat(" + n + ", minmax(0, 1fr))";
      colonnes = [];
      hauteurs = [];
      for (var i = 0; i < n; i++) {
        var c = document.createElement("div");
        c.className = "mosaique__col";
        hote.appendChild(c);
        colonnes.push(c);
        hauteurs.push(0);
      }
    }

    function plusCourte() {
      var k = 0;
      for (var i = 1; i < hauteurs.length; i++) {
        if (hauteurs[i] < hauteurs[k]) k = i;
      }
      return k;
    }

    /** Pose une vignette dans la colonne la plus courte. */
    function poser(index) {
      var e = liste[index % liste.length];
      var col = plusCourte();

      var a = document.createElement("a");
      a.className = "mosaique__item";
      a.href = "extra.html?e=" + encodeURIComponent(e.slug);
      a.innerHTML =
        '<span class="mosaique__cadre" style="aspect-ratio:' + esc(e.ratio) + '">' +
          img(e.cover, e.titre, { classe: "mosaique__image", prioritaire: index < 5 }) +
          '<span class="mosaique__voile">' + esc(e.titre) + "</span>" +
        "</span>";

      colonnes[col].appendChild(a);
      hauteurs[col] += facteurHauteur(e.ratio);
      return a;
    }

    function lot() {
      var n = nbCol * 3;
      var neufs = [];
      for (var i = 0; i < n && poses < plafond; i++) neufs.push(poser(poses++));
      reveler(neufs);

      if (poses >= plafond) {
        /* « Fin de la collection » n'a de sens qu'après une longue boucle ;
           une courte collection s'arrête simplement d'elle-même. */
        fin.hidden = !boucle;
        if (observateur) observateur.disconnect();
      }
    }

    /** Reconstruit tout en gardant le nombre de vignettes déjà atteint. */
    function refaire() {
      var total = poses;
      construire(nbColonnes());
      poses = 0;
      for (var i = 0; i < total; i++) poser(poses++);
    }

    construire(nbColonnes());
    lot();

    if ("IntersectionObserver" in window) {
      observateur = new IntersectionObserver(function (entrees) {
        if (entrees[0].isIntersecting) lot();
      }, { rootMargin: "600px" });
      observateur.observe(sentinelle);
    }

    /* Changement de largeur : on ne redistribue que si le nombre de
       colonnes change réellement, sinon on repeindrait pour rien. */
    var minuteur;
    window.addEventListener("resize", function () {
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        if (nbColonnes() !== nbCol) refaire();
      }, 180);
    });
  }

  function dessinerExtra(hote) {
    var e = parSlug(extrasPublics(), param("e"));
    if (!e) return introuvable(hote, "Retour aux extras", "extras.html");

    document.title = e.titre + " — " + SITE.nom;

    /* Pas de « ratio » ici : c'est la proportion de la vignette recadrée,
       l'imposer à l'image pleine taille l'écraserait. */
    var visuels = figure(
        { src: e.cover, w: e.coverW, h: e.coverH, taille: "pleine", prioritaire: true },
        e.titre
      ) +
      (e.images || []).map(function (im) { return figure(im, e.titre); }).join("");

    hote.innerHTML =
      '<div class="projet__visuels">' + visuels + "</div>" +
      "<div>" +
        '<h1 class="filet-titre">' + esc(e.titre) + "</h1>" +
        '<div class="projet__meta"><span class="principale"></span>' +
          '<span class="principale"></span>' +
          '<span class="principale">' + esc(e.annee) + "</span></div>" +
        (e.description
          ? '<div class="projet__texte prose">' + paragraphes(e.description) + "</div>"
          : "") +
        '<a class="projet__retour" href="extras.html">← Tous les extras</a>' +
      "</div>";
  }


  /* ---------------------------------------------------------- 7. CONTACT */

  function dessinerContact(hote) {
    var c = SITE.contact;

    var lignes = c.liens.map(function (l) {
      return '<div class="contact__ligne">' +
               "<dt>" + esc(l.label) + "</dt>" +
               '<dd><a href="' + esc(l.href) + '"' +
                 (/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : "") +
               ">" + esc(l.valeur) + "</a></dd>" +
             "</div>";
    }).join("");

    hote.innerHTML =
      '<h1 class="filet-titre">Contact</h1>' +
      (c.intro ? '<p class="contact__intro prose">' + esc(c.intro) + "</p>" : "") +
      '<dl class="contact__liste">' + lignes + "</dl>";
  }


  /**
   * Applique l'apparition au contenu de la page courante.
   *
   * La navigation en est volontairement exclue : elle doit être
   * disponible immédiatement, sans attendre le moindre fondu.
   * La mosaïque d'Extras est traitée à part, ses vignettes arrivant
   * au fil du défilement.
   */
  function animerContenu() {
    reveler(document.querySelectorAll(".galerie__item"));

    reveler(document.querySelectorAll(".index__entete"));
    reveler(document.querySelectorAll(".index__corps .index__ligne"));

    reveler(document.querySelectorAll(".projet__visuels figure"));
    reveler(document.querySelectorAll(
      ".titre-bloc, .projet__meta, .projet__texte, .telechargement, .projet__retour"));

    reveler(document.querySelectorAll(".info__portrait, .info__bio"));
    reveler(document.querySelectorAll(".info__section"));

    reveler(document.querySelectorAll(".extras__intro"));

    reveler(document.querySelectorAll(".contact__intro, .contact__liste"));

    reveler(document.querySelectorAll(".chrome__pied"));
  }


  /* -------------------------------------------------------- aiguillage */

  var PAGES = {
    "js-galerie": dessinerAccueil,
    "js-index":   dessinerIndex,
    "js-projet":  dessinerProjet,
    "js-info":    dessinerInfo,
    "js-extras":  dessinerExtras,
    "js-extra":   dessinerExtra,
    "js-contact": dessinerContact
  };

  document.addEventListener("DOMContentLoaded", function () {
    dessinerChrome();

    Object.keys(PAGES).forEach(function (id) {
      var hote = document.getElementById(id);
      if (hote) PAGES[id](hote);
    });

    animerContenu();
    visionneuse();
    activerVideos();
    retourEnHaut();
    curseurPersonnalise();
  });

})();
