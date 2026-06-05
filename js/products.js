/* =============================================================
 * PRODUCTS.JS — Gestion catalogue ZANKA
 * =============================================================
 * Charge les produits depuis Firestore avec filtres et tri.
 * Fonctionne aussi en mode démo (Firestore non configuré).
 * ============================================================= */

var PRODUITS_DEMO = [
  {
    id: "zephyr", name: "Sac à Dos Zephyr", slug: "sac-a-dos-zephyr",
    category: "backpacks", price: 850, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1601924994987-69e26d50e8bf?w=600&q=80",
      "https://images.unsplash.com/photo-1601924994987-69e26d50e8bf?w=600&q=80"
    ],
    colors: ["Sable", "Noir", "Chocolat"],
    description: "Sac à dos en cuir pleine fleur. Compartiment rembourré pour ordinateur 15 pouces. Fermeture à lacet et rabat aimanté.",
    stock: 12, isNew: true, isBestseller: false,
    createdAt: Date.now()
  },
  {
    id: "aria", name: "Sac Cabas Aria", slug: "sac-cabas-aria",
    category: "femmes", price: 1450, comparePrice: 1800,
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"
    ],
    colors: ["Sable", "Écru", "Brun"],
    description: "Cabas en cuir grainé. Anses en cuir tressé, poche intérieure zippée.",
    stock: 5, isNew: false, isBestseller: true,
    createdAt: Date.now() - 86400000
  },
  {
    id: "berlinois", name: "Sacoche Berlinois", slug: "sacoche-berlinois",
    category: "hommes", price: 450, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80"
    ],
    colors: ["Noir", "Brun"],
    description: "Sacoche en cuir lisse. Bandoulière ajustable. Idéale pour le quotidien.",
    stock: 8, isNew: true, isBestseller: false,
    createdAt: Date.now() - 172800000
  },
  {
    id: "lune", name: "Sac à Main Lune", slug: "sac-a-main-lune",
    category: "femmes", price: 1280, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80"
    ],
    colors: ["Sable", "Noir"],
    description: "Sac à main en cuir souple. Forme demi-lune iconique. Bandoulière chaîne amovible.",
    stock: 3, isNew: false, isBestseller: true,
    createdAt: Date.now() - 259200000
  },
  {
    id: "voyageur", name: "Sac à Dos Voyageur", slug: "sac-a-dos-voyageur",
    category: "backpacks", price: 1200, comparePrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    ],
    colors: ["Chocolat", "Noir"],
    description: "Grand sac à dos voyage en cuir pleine fleur. Compartiment à chaussures. Port USB intégré.",
    stock: 6, isNew: false, isBestseller: false,
    createdAt: Date.now() - 345600000
  },
  {
    id: "nova", name: "Sac Bandoulière Nova", slug: "sac-bandouliere-nova",
    category: "femmes", price: 890, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80"
    ],
    colors: ["Écru", "Sable", "Noir"],
    description: "Sac bandoulière en cuir grainé. Fermeture à rabat magnétique. Plusieurs compartiments.",
    stock: 10, isNew: true, isBestseller: false,
    createdAt: Date.now() - 432000000
  },
  {
    id: "executive", name: "Porte-Documents Executive", slug: "porte-documents-executive",
    category: "hommes", price: 890, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600&q=80",
      "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600&q=80"
    ],
    colors: ["Noir", "Brun"],
    description: "Porte-documents en cuir pleine fleur. Compartiment 15 pouces. Serrure à combinaison.",
    stock: 4, isNew: false, isBestseller: false,
    createdAt: Date.now() - 518400000
  },
  {
    id: "soir", name: "Pochette du Soir", slug: "pochette-du-soir",
    category: "femmes", price: 650, comparePrice: null,
    images: [
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80"
    ],
    colors: ["Noir", "Sable"],
    description: "Pochette du soir en cuir laqué. Fermeture à rabat aimanté. Bandoulière chaîne fine.",
    stock: 2, isNew: true, isBestseller: false,
    createdAt: Date.now() - 604800000
  }
];

/* ═══════════════════════════════════════════════════════════════
 * CHARGEMENT PRODUITS
 * ═══════════════════════════════════════════════════════════════
 * 1. Essaie de charger depuis Firestore
 * 2. Si Firebase pas configuré → utilise les données démo
 * ============================================================= */

function chargerProduits(filtres, tri, callback) {
  if (typeof window.db !== 'undefined' && window.db) {
    chargerDepuisFirestore(filtres, tri, callback);
  } else {
    chargerDepuisDemo(filtres, tri, callback);
  }
}

function chargerDepuisDemo(filtres, tri, callback) {
  var resultats = PRODUITS_DEMO.filter(function(p) {
    if (filtres.categorie && p.category !== filtres.categorie) return false;
    if (filtres.prixMin && p.price < filtres.prixMin) return false;
    if (filtres.prixMax && p.price > filtres.prixMax) return false;
    if (filtres.nouveau && !p.isNew) return false;
    if (filtres.stock && p.stock < 1) return false;
    return true;
  });

  var tris = {
    'prix-croissant': function(a, b) { return a.price - b.price; },
    'prix-decroissant': function(a, b) { return b.price - a.price; },
    'nouveautes': function(a, b) { return b.createdAt - a.createdAt; },
    'bestsellers': function(a, b) { return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0); },
    'pertinence': function(a, b) { return 0; }
  };

  var triFn = tris[tri] || tris['pertinence'];
  resultats.sort(triFn);

  callback(resultats, resultats.length);
}

function chargerDepuisFirestore(filtres, tri, callback) {
  var ref = window.db.collection('products');
  var requete = ref;

  if (filtres.categorie) {
    requete = requete.where('category', '==', filtres.categorie);
  }
  if (filtres.prixMin) {
    requete = requete.where('price', '>=', filtres.prixMin);
  }
  if (filtres.prixMax) {
    requete = requete.where('price', '<=', filtres.prixMax);
  }

  requete.get().then(function(snapshot) {
    var produits = [];
    snapshot.forEach(function(doc) {
      produits.push(doc.data());
    });
    callback(produits, produits.length);
  }).catch(function(err) {
    console.warn('Firestore erreur, fallback démo:', err);
    chargerDepuisDemo(filtres, tri, callback);
  });
}

/* ═══════════════════════════════════════════════════════════════
 * AFFICHAGE GRILLE PRODUITS
 * ═══════════════════════════════════════════════════════════════ */

function afficherProduits(produits, conteneurId) {
  var conteneur = document.getElementById(conteneurId);
  if (!conteneur) return;

  if (produits.length === 0) {
    conteneur.innerHTML = '<div class="shop-vide"><p>Aucun produit trouvé.</p></div>';
    return;
  }

  var html = '';
  produits.forEach(function(p) {
    var badge = '';
    if (p.isNew) badge = '<span class="carte-produit-badge">Nouveau</span>';
    else if (p.isBestseller) badge = '<span class="carte-produit-badge bestseller">Best-seller</span>';

    var prix = '<span class="carte-produit-prix">' + formaterPrix(p.price) + '</span>';
    if (p.comparePrice) {
      prix = '<span class="carte-produit-prix">' + formaterPrix(p.price) + '</span>' +
             '<span class="carte-produit-prix-ancien">' + formaterPrix(p.comparePrice) + '</span>';
    }

    html += '<article class="carte-produit" data-id="' + p.id + '">' +
      '<a href="product.html?id=' + p.id + '">' +
        '<div class="carte-produit-image">' +
          '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy">' +
          badge +
        '</div>' +
        '<h3 class="carte-produit-nom">' + p.name + '</h3>' +
        '<p class="carte-produit-categorie">' + p.category + '</p>' +
        '<div class="carte-produit-prix-wrapper">' + prix + '</div>' +
      '</a>' +
    '</article>';
  });

  conteneur.innerHTML = html;
  document.getElementById('resultats-compte').textContent = produits.length + ' produits';
}

/* ═══════════════════════════════════════════════════════════════
 * FORMATAGE PRIX (version locale si utils.js pas chargé)
 * ═══════════════════════════════════════════════════════════════ */

function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 2
  }).format(montant);
}
