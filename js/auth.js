/* =============================================================
 * AUTH.JS — Gestion de l'authentification ZANKA
 * =============================================================
 * Gère l'état connecté/déconnecté dans la navigation.
 * Met à jour l'icône compte et le texte du header.
 * 
 * Dépend de : firebase-config.js (doit être chargé avant)
 * ============================================================= */

/* ═══════════════════════════════════════════════════════════════
 * 1. ATTENDRE QUE FIREBASE SOIT PRÊT
 * ═══════════════════════════════════════════════════════════════
 * auth.onAuthStateChanged() est le point d'entrée standard.
 * Il se déclenche :
 * - Au chargement de la page (état initial)
 * - À chaque changement d'état (connexion/déconnexion)
 * - Au refresh du token
 * ============================================================= */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.auth === 'undefined') {
    console.warn('ℹ ZANKA — Auth non disponible : mode démo');
    return;
  }

  /* ─── Écoute les changements d'état ─────────────────────────
   * Firebase Auth gère automatiquement :
   * - La persistance de session (localStorage)
   * - Le refresh des tokens
   * - La détection de compte existant
   * ============================================================= */
  window.auth.onAuthStateChanged(function(utilisateur) {
    if (utilisateur) {
      // ─── Utilisateur connecté ─────────────────────────────
      // Met à jour l'icône compte avec la photo de profil
      // ou les initiales si pas de photo
      const iconeCompte = document.querySelector('.js-compte');
      if (iconeCompte) {
        if (utilisateur.photoURL) {
          // Affiche la photo de profil Google
          iconeCompte.innerHTML = '<img src="' + utilisateur.photoURL +
            '" alt="Photo de profil" class="avatar-mini">';
        } else {
          // Affiche les initiales (fallback élégant)
          const prenom = utilisateur.displayName
            ? utilisateur.displayName.charAt(0).toUpperCase()
            : utilisateur.email.charAt(0).toUpperCase();
          iconeCompte.innerHTML = '<span class="avatar-initiales">' +
            prenom + '</span>';
        }
      }

      // Met à jour le lien "Compte" vers le dashboard
      const lienCompte = document.querySelector('.js-compte-lien');
      if (lienCompte) {
        lienCompte.href = '/account/dashboard.html';
        lienCompte.textContent = 'Mon Compte';
      }

      console.log('✓ ZANKA — Connecté :', utilisateur.email);

    } else {
      // ─── Utilisateur déconnecté ───────────────────────────
      // Remet l'icône par défaut (SVG silhouette)
      const iconeCompte = document.querySelector('.js-compte');
      if (iconeCompte) {
        iconeCompte.innerHTML = '<svg viewBox="0 0 24 24" fill="none" ' +
          'stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 ' +
          '4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' +
          '</svg>';
      }

      const lienCompte = document.querySelector('.js-compte-lien');
      if (lienCompte) {
        lienCompte.href = '/account/login.html';
        lienCompte.textContent = 'Connexion';
      }

      console.log('ℹ ZANKA — Déconnecté');
    }
  });
});

/* ═══════════════════════════════════════════════════════════════
 * 2. STYLES POUR L'AVATAR (injectés dynamiquement)
 * ═══════════════════════════════════════════════════════════════
 * Pourquoi ici plutôt que dans CSS ?
 * → Parce que ces styles ne sont nécessaires que si
 *   l'utilisateur est connecté. Inutile de les charger
 *   pour tout le monde.
 * ============================================================= */
var stylesAvatar = document.createElement('style');
stylesAvatar.textContent = [
  '.avatar-mini {',
  '  width: 22px; height: 22px; border-radius: 50%;',
  '  object-fit: cover;',
  '}',
  '.avatar-initiales {',
  '  display: flex; align-items: center; justify-content: center;',
  '  width: 22px; height: 22px; border-radius: 50%;',
  '  background: var(--noir-doux); color: var(--blanc);',
  '  font-size: 11px; font-weight: 600;',
  '}'
].join('\n');
document.head.appendChild(stylesAvatar);
