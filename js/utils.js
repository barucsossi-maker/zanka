/* =============================================================
 * UTILS.JS — Fonctions utilitaires partagées ZANKA
 * =============================================================
 * Centralise toutes les petites fonctions réutilisées
 * dans tout le site. Évite la duplication et facilite
 * la maintenance.
 * ============================================================= */

/* ═══════════════════════════════════════════════════════════════
 * 1. FORMATAGE DE PRIX
 * ═══════════════════════════════════════════════════════════════
 * Transforme un nombre en prix français lisible.
 * Exemple : 850.5 → "850,50 €"
 * ============================================================= */
function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(montant);
}

/* ═══════════════════════════════════════════════════════════════
 * 2. DEBOUNCE — Limite les appels répétés
 * ═══════════════════════════════════════════════════════════════
 * Utilisé pour : recherche en direct, redimensionnement,
 * scroll events. Sans debounce, chaque keystroke déclencherait
 * une requête Firebase → facturation inutile.
 * ============================================================= */
function debounce(func, attente) {
  let timeout;
  return function exec(...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, attente);
  };
}

/* ═══════════════════════════════════════════════════════════════
 * 3. OBSERVATEUR D'INTERSECTION (reveal au scroll)
 * ═══════════════════════════════════════════════════════════════
 * Détecte quand un élément entre dans le viewport et lui
 * ajoute la classe "visible" (animations CSS).
 * Pourquoi pas GSAP ScrollTrigger ici ?
 * → Parce que c'est plus léger pour les animations simples.
 * ============================================================= */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      // Déclenche quand 15% de l'élément est visible
      threshold: 0.15,
      // Marge supplémentaire : commence 50px avant
      rootMargin: '0px 0px -50px 0px'
    }
  );

  document.querySelectorAll('.reveal, .reveal-gauche, .reveal-droite')
    .forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
 * 4. GESTION DES ERREURS FIRESTORE
 * ═══════════════════════════════════════════════════════════════
 * Traduit les erreurs Firebase en messages utilisateur.
 * Pourquoi ? Les erreurs techniques brutes sont
 * incompréhensibles pour un client.
 * ============================================================= */
function traduireErreurFirebase(code) {
  const erreurs = {
    'permission-denied':
      'Accès refusé. Vérifie tes droits.',
    'not-found':
      'Élément introuvable.',
    'already-exists':
      'Cet élément existe déjà.',
    'unauthenticated':
      'Tu dois être connecté pour cette action.',
    'resource-exhausted':
      'Trop de requêtes. Réessaie dans quelques instants.',
    'failed-precondition':
      'Opération impossible dans l\'état actuel.',
    'aborted':
      'Opération annulée.',
    'out-of-range':
      'Valeurs invalides.',
    'unimplemented':
      'Cette fonctionnalité n\'est pas encore disponible.',
    'internal':
      'Erreur serveur. L\'équipe technique est informée.',
    'unavailable':
      'Service temporairement indisponible. Réessaie.'
  };

  return erreurs[code] || 'Une erreur est survenue. Réessaie.';
}

/* ═══════════════════════════════════════════════════════════════
 * 5. GÉNÉRATION DE SLUG
 * ═══════════════════════════════════════════════════════════════
 * Convertit "Sac à dos Zephyr" en "sac-a-dos-zephyr"
 * Utilisé pour les URLs des pages produits.
 * ============================================================= */
function genererSlug(texte) {
  return texte
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Supprime les accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')             // Espaces → tirets
    .replace(/[^\w-]+/g, '')          // Supprime spéciaux
    .replace(/--+/g, '-');            // Évite doubles tirets
}

/* ═══════════════════════════════════════════════════════════════
 * 6. COOKIE CONSENT (RGPD)
 * ═══════════════════════════════════════════════════════════════
 * Pourquoi obligatoire ? Le RGPD exige le consentement
 * utilisateur avant tout dépôt de cookie non essentiel.
 * ============================================================= */
function verifierConsentementCookies() {
  return localStorage.getItem('zanka-cookies-acceptes') === 'true';
}

function accepterCookies() {
  localStorage.setItem('zanka-cookies-acceptes', 'true');
  const banniere = document.querySelector('.cookies-banniere');
  if (banniere) banniere.remove();
}

/* ═══════════════════════════════════════════════════════════════
 * 7. FORMATAGE DE DATE
 * ═══════════════════════════════════════════════════════════════
 * Affiche une date en français lisible.
 * Exemple : Timestamp → "12 mars 2026"
 * ============================================================= */
function formaterDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/* ═══════════════════════════════════════════════════════════════
 * 8. TRONCATURE DE TEXTE
 * ═══════════════════════════════════════════════════════════════
 * Coupe un texte à N caractères sans couper un mot.
 * Utilisé pour les descriptions dans les cartes.
 * ============================================================= */
function tronquerTexte(texte, maxLength = 120) {
  if (texte.length <= maxLength) return texte;
  const coupe = texte.substring(0, maxLength);
  const dernierEspace = coupe.lastIndexOf(' ');
  return coupe.substring(0, dernierEspace) + '…';
}

/* ═══════════════════════════════════════════════════════════════
 * 9. ANIMATION COMPTEUR — chiffres qui défilent
 * ═══════════════════════════════════════════════════════════════
 * Effet visuel pour les statistiques (ex: "500+ clients")
 * ============================================================= */
function animerCompteur(element, cible, duree = 2000) {
  const demarrer = performance.now();
  const valeurDepart = 0;

  function miseAJour(tempsActuel) {
    const ecoule = tempsActuel - demarrer;
    const progression = Math.min(ecoule / duree, 1);
    // Easing cubique pour une accélération naturelle
    const ease = 1 - Math.pow(1 - progression, 3);
    const valeurCourante = Math.floor(valeurDepart + (cible - valeurDepart) * ease);

    element.textContent = valeurCourante.toLocaleString('fr-FR');

    if (progression < 1) {
      requestAnimationFrame(miseAJour);
    } else {
      element.textContent = cible.toLocaleString('fr-FR');
    }
  }

  requestAnimationFrame(miseAJour);
}

/* ═══════════════════════════════════════════════════════════════
 * 10. EXPORT GLOBAL
 * ═══════════════════════════════════════════════════════════════
 * Rend toutes les fonctions disponibles dans window
 * pour qu'elles soient accessibles dans tous les scripts.
 * ============================================================= */
window.formaterPrix = formaterPrix;
window.debounce = debounce;
window.initReveal = initReveal;
window.traduireErreurFirebase = traduireErreurFirebase;
window.genererSlug = genererSlug;
window.verifierConsentementCookies = verifierConsentementCookies;
window.accepterCookies = accepterCookies;
window.formaterDate = formaterDate;
window.tronquerTexte = tronquerTexte;
window.animerCompteur = animerCompteur;
