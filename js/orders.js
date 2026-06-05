/* =============================================================
 * ORDERS.JS — Gestion des commandes ZANKA
 * =============================================================
 * Fonctions pour l'historique et le suivi des commandes.
 * Utilise des données démo en attendant Firestore.
 * ============================================================= */

/* ─── Données démo ──────────────────────────────────────────── */
var COMMANDES_DEMO = [
  {
    orderId: "ZANKA-2026-0001",
    userId: "demo@zanka.fr",
    items: [
      { id: "zephyr", name: "Sac à Dos Zephyr", price: 850, quantite: 1, image: "https://images.unsplash.com/photo-1601924994987-69e26d50e8bf?w=200&q=80" },
      { id: "berlinois", name: "Sacoche Berlinois", price: 450, quantite: 2, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&q=80" }
    ],
    subtotal: 1750,
    discount: 0,
    shipping: 0,
    tax: 350,
    total: 2100,
    status: "delivered",
    trackingNumber: "FA123456789FR",
    carrier: "Colissimo",
    shippingAddress: { line1: "12 Rue de la Paix", city: "Paris", postalCode: "75002", country: "France" },
    timeline: [
      { status: "pending", timestamp: "2026-05-10T09:00:00Z", description: "Commande reçue" },
      { status: "confirmed", timestamp: "2026-05-10T09:15:00Z", description: "Paiement confirmé" },
      { status: "shipped", timestamp: "2026-05-11T14:00:00Z", description: "Colis expédié depuis notre atelier" },
      { status: "delivered", timestamp: "2026-05-14T10:30:00Z", description: "Livré à votre adresse" }
    ],
    createdAt: "2026-05-10T09:00:00Z",
    updatedAt: "2026-05-14T10:30:00Z",
    estimatedDelivery: "2026-05-15"
  },
  {
    orderId: "ZANKA-2026-0002",
    userId: "demo@zanka.fr",
    items: [
      { id: "aria", name: "Sac Cabas Aria", price: 1450, quantite: 1, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80" }
    ],
    subtotal: 1450,
    discount: 145,
    shipping: 5.90,
    tax: 262.18,
    total: 1573.08,
    status: "shipped",
    trackingNumber: "FA987654321FR",
    carrier: "Chronopost",
    shippingAddress: { line1: "12 Rue de la Paix", city: "Paris", postalCode: "75002", country: "France" },
    timeline: [
      { status: "pending", timestamp: "2026-05-28T11:00:00Z", description: "Commande reçue" },
      { status: "confirmed", timestamp: "2026-05-28T11:10:00Z", description: "Paiement confirmé" },
      { status: "shipped", timestamp: "2026-05-29T08:00:00Z", description: "Colis expédié en Chronopost" }
    ],
    createdAt: "2026-05-28T11:00:00Z",
    updatedAt: "2026-05-29T08:00:00Z",
    estimatedDelivery: "2026-05-31"
  },
  {
    orderId: "ZANKA-2026-0003",
    userId: "demo@zanka.fr",
    items: [
      { id: "lune", name: "Sac à Main Lune", price: 1280, quantite: 1, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&q=80" }
    ],
    subtotal: 1280,
    discount: 0,
    shipping: 5.90,
    tax: 257.18,
    total: 1543.08,
    status: "pending",
    trackingNumber: "",
    carrier: "",
    shippingAddress: { line1: "12 Rue de la Paix", city: "Paris", postalCode: "75002", country: "France" },
    timeline: [
      { status: "pending", timestamp: "2026-06-03T15:00:00Z", description: "Commande reçue" }
    ],
    createdAt: "2026-06-03T15:00:00Z",
    updatedAt: "2026-06-03T15:00:00Z",
    estimatedDelivery: "2026-06-07"
  }
];

/* ─── Statuts et leurs couleurs ─────────────────────────────── */
var STATUTS = {
  'pending':    { label: 'En traitement',    couleur: '#C9A96E' },
  'confirmed':  { label: 'Confirmée',        couleur: '#2e7d32' },
  'shipped':    { label: 'Expédiée',         couleur: '#1565c0' },
  'delivered':  { label: 'Livrée',           couleur: '#2e7d32' },
  'cancelled':  { label: 'Annulée',          couleur: '#c62828' }
};

var STATUTS_ORDRE = ['pending', 'confirmed', 'shipped', 'delivered'];

/* ─── Charger les commandes ─────────────────────────────────── */
function chargerCommandes(filtres, callback) {
  var resultats = COMMANDES_DEMO.slice();

  if (filtres.statut) {
    resultats = resultats.filter(function(c) { return c.status === filtres.statut; });
  }
  if (filtres.recherche) {
    var q = filtres.recherche.toLowerCase();
    resultats = resultats.filter(function(c) {
      return c.orderId.toLowerCase().indexOf(q) > -1;
    });
  }

  // Tri par date décroissante
  resultats.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

  callback(resultats);
}

/* ─── Charger une commande par ID ───────────────────────────── */
function chargerCommande(id, callback) {
  for (var i = 0; i < COMMANDES_DEMO.length; i++) {
    if (COMMANDES_DEMO[i].orderId === id) {
      callback(COMMANDES_DEMO[i]);
      return;
    }
  }
  callback(null);
}

/* ─── Rendu statut avec badge coloré ────────────────────────── */
function renderStatut(status) {
  var s = STATUTS[status] || { label: status, couleur: '#999' };
  return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:var(--texte-xs);padding:4px 10px;border-radius:20px;background:' + s.couleur + '20;color:' + s.couleur + ';font-weight:var(--medium);">' +
    '<span style="width:6px;height:6px;border-radius:50%;background:' + s.couleur + ';"></span>' +
    s.label +
    '</span>';
}

/* ─── Formatage date ────────────────────────────────────────── */
function formaterDate(iso) {
  var d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formaterDateCourt(iso) {
  var d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}
