/* =============================================================
 * CART.JS — Logique panier ZANKA
 * =============================================================
 * Gère :
 * - localStorage pour utilisateurs non connectés
 * - Fusion avec Firestore à la connexion
 * - Calcul TVA 20%
 * - Codes promo (collection promo_codes Firestore)
 * ============================================================= */

/* ─── Clé localStorage ──────────────────────────────────────── */
var CLE_PANIER = 'zanka_panier';
var CLE_PROMO = 'zanka_promo';

/* ─── Structure d'un item ─────────────────────────────────────
 * {
 *   id: string,
 *   name: string,
 *   price: number,
 *   image: string,
 *   couleur: string,
 *   taille: string,
 *   quantite: number,
 *   stock: number
 * }
 * ============================================================= */

/* ─── Lecture du panier ─────────────────────────────────────── */
function lirePanier() {
  try {
    var data = localStorage.getItem(CLE_PANIER);
    if (data) return JSON.parse(data);
  } catch (e) { /* ignore */ }
  return [];
}

/* ─── Écriture du panier ────────────────────────────────────── */
function ecrirePanier(items) {
  localStorage.setItem(CLE_PANIER, JSON.stringify(items));
  mettreAJourBadge();
  diffuserChangement();
}

/* ─── Diffusion d'événement ─────────────────────────────────── */
function diffuserChangement() {
  var evt = new CustomEvent('panier-change', { detail: lirePanier() });
  document.dispatchEvent(evt);
}

/* ─── Ajouter un article ────────────────────────────────────── */
function ajouterAuPanier(produit, couleur, taille, quantite) {
  var panier = lirePanier();
  var existant = null;

  for (var i = 0; i < panier.length; i++) {
    if (panier[i].id === produit.id && panier[i].couleur === couleur && panier[i].taille === (taille || '')) {
      existant = panier[i];
      break;
    }
  }

  if (existant) {
    existant.quantite += quantite || 1;
  } else {
    panier.push({
      id: produit.id,
      name: produit.name,
      price: produit.price,
      image: produit.images[0],
      couleur: couleur || '',
      taille: taille || '',
      quantite: quantite || 1,
      stock: produit.stock || 99
    });
  }

  ecrirePanier(panier);
  return panier;
}

/* ─── Modifier quantité ─────────────────────────────────────── */
function modifierQuantite(id, couleur, taille, delta) {
  var panier = lirePanier();
  for (var i = 0; i < panier.length; i++) {
    if (panier[i].id === id && panier[i].couleur === couleur && panier[i].taille === (taille || '')) {
      panier[i].quantite += delta;
      if (panier[i].quantite <= 0) {
        panier.splice(i, 1);
      }
      break;
    }
  }
  ecrirePanier(panier);
  return panier;
}

/* ─── Supprimer un article ──────────────────────────────────── */
function supprimerDuPanier(id, couleur, taille) {
  var panier = lirePanier();
  for (var i = 0; i < panier.length; i++) {
    if (panier[i].id === id && panier[i].couleur === couleur && panier[i].taille === (taille || '')) {
      panier.splice(i, 1);
      break;
    }
  }
  ecrirePanier(panier);
  return panier;
}

/* ─── Vider le panier ───────────────────────────────────────── */
function viderPanier() {
  ecrirePanier([]);
}

/* ─── Compter les articles ──────────────────────────────────── */
function compterArticles() {
  var panier = lirePanier();
  var total = 0;
  for (var i = 0; i < panier.length; i++) {
    total += panier[i].quantite;
  }
  return total;
}

/* ─── Calculer le sous-total ────────────────────────────────── */
function calculerSousTotal() {
  var panier = lirePanier();
  var total = 0;
  for (var i = 0; i < panier.length; i++) {
    total += panier[i].price * panier[i].quantite;
  }
  return total;
}

/* ─── Mettre à jour le badge ────────────────────────────────── */
function mettreAJourBadge() {
  var badges = document.querySelectorAll('.js-panier-compteur');
  var compte = compterArticles();
  badges.forEach(function(b) {
    b.textContent = compte;
    b.style.display = compte > 0 ? 'inline-flex' : 'none';
  });
}

/* ─── TVA 20% ───────────────────────────────────────────────── */
function calculerTVA(montantHT) {
  return montantHT * 0.20;
}

function calculerTTC(montantHT) {
  return montantHT * 1.20;
}

/* ─── Promo ─────────────────────────────────────────────────── */
function appliquerPromo(code) {
  // Codes démo
  var codesValides = {
    'BIENVENUE10': { type: 'pourcentage', valeur: 10 },
    'ZANKA20': { type: 'pourcentage', valeur: 20 },
    'LIVRAISON': { type: 'livraison', valeur: 0 }
  };

  var promo = codesValides[code.toUpperCase()];
  if (!promo) return { succes: false, message: 'Code promo invalide.' };
  localStorage.setItem(CLE_PROMO, JSON.stringify({ code: code.toUpperCase(), data: promo }));
  return { succes: true, message: 'Code promo appliqué !', data: promo };
}

function supprimerPromo() {
  localStorage.removeItem(CLE_PROMO);
}

function lirePromo() {
  try {
    var data = localStorage.getItem(CLE_PROMO);
    if (data) return JSON.parse(data);
  } catch (e) { /* ignore */ }
  return null;
}

function calculerReduction(total) {
  var promo = lirePromo();
  if (!promo) return 0;
  if (promo.data.type === 'pourcentage') {
    return total * (promo.data.valeur / 100);
  }
  return 0;
}

/* ─── Calcul livraison ──────────────────────────────────────── */
function calculerLivraison(mode) {
  switch (mode) {
    case 'express': return 12.90;
    case 'click-collect': return 0;
    default: return total < 200 ? 5.90 : 0; // standard
  }
}

/* ─── Rendu du mini-panier (drawer) ─────────────────────────── */
function afficherMiniPanier() {
  var existant = document.querySelector('.mini-panier');
  if (existant) {
    existant.remove();
    return;
  }

  var panier = lirePanier();
  var overlay = document.createElement('div');
  overlay.className = 'mini-panier';
  overlay.innerHTML =
    '<div class="mini-panier-overlay js-mini-fermer"></div>' +
    '<div class="mini-panier-drawer">' +
      '<div class="mini-panier-header">' +
        '<span class="mini-panier-titre">Mon Panier (' + compterArticles() + ')</span>' +
        '<button class="mini-panier-fermer js-mini-fermer">&times;</button>' +
      '</div>' +
      '<div class="mini-panier-liste" id="mini-liste">' +
        (panier.length === 0
          ? '<p class="mini-panier-vide">Votre panier est vide.</p>'
          : panier.map(function(item) {
              return '<div class="mini-panier-item">' +
                '<img src="' + item.image + '" alt="' + item.name + '">' +
                '<div class="mini-panier-item-info">' +
                  '<div class="mini-panier-item-nom">' + item.name + '</div>' +
                  '<div class="mini-panier-item-prix">' + formaterPrix(item.price) + '</div>' +
                  '<div class="mini-panier-item-qte">Qté: ' + item.quantite + '</div>' +
                '</div>' +
              '</div>';
            }).join(''))
      '</div>' +
      '<div class="mini-panier-footer">' +
        '<div class="mini-panier-total">' +
          '<span>Total</span>' +
          '<span>' + formaterPrix(calculerSousTotal()) + '</span>' +
        '</div>' +
        '<a href="cart.html" class="btn btn-secondaire" style="width:100%;">Voir le panier</a>' +
        '<button class="btn btn-primaire" style="width:100%;margin-top:var(--space-xs);">Commander</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  // Animation d'entrée
  requestAnimationFrame(function() {
    overlay.classList.add('ouvert');
  });

  // Fermeture
  overlay.querySelectorAll('.js-mini-fermer').forEach(function(el) {
    el.addEventListener('click', function() {
      overlay.classList.remove('ouvert');
      setTimeout(function() { overlay.remove(); }, 300);
    });
  });
}

/* ─── Initialisation au chargement ──────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  mettreAJourBadge();
});
