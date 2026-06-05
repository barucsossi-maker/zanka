/* =============================================================
 * TRACKING.JS — Suivi commande temps réel ZANKA
 * =============================================================
 * Timeline visuelle et mise à jour en temps réel.
 * Utilise Firestore onSnapshot si disponible, sinon données démo.
 * ============================================================= */

/* ─── Initialiser le tracking depuis une commande ────────── */
function initialiserTracking(commande) {
  if (!commande) return;

  document.getElementById('tracking-numero').textContent = commande.orderId;
  document.getElementById('tracking-date').textContent = formaterDate(commande.createdAt);
  document.getElementById('tracking-statut').innerHTML = renderStatut(commande.status);

  // Adresse
  var addr = commande.shippingAddress;
  document.getElementById('tracking-adresse').innerHTML =
    addr.line1 + '<br>' +
    addr.postalCode + ' ' + addr.city + '<br>' +
    addr.country;

  // Date estimée
  document.getElementById('tracking-estimee').textContent = formaterDate(commande.estimatedDelivery);

  // Transporteur
  if (commande.trackingNumber) {
    document.getElementById('tracking-transporteur').style.display = 'block';
    document.getElementById('tracking-carrier').textContent = commande.carrier;
    document.getElementById('tracking-numero-suivi').textContent = commande.trackingNumber;
    document.getElementById('tracking-lien').href = '#';
  } else {
    document.getElementById('tracking-transporteur').style.display = 'none';
  }

  // Timeline
  renderTimeline(commande.timeline, commande.status);

  // Articles
  var articlesContainer = document.getElementById('tracking-articles');
  articlesContainer.innerHTML = commande.items.map(function(item) {
    return '<div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-xs) 0;">' +
      '<img src="' + item.image + '" alt="' + item.name + '" style="width:48px;height:48px;object-fit:cover;">' +
      '<div>' +
        '<div style="font-size:var(--texte-sm);font-weight:var(--medium);">' + item.name + '</div>' +
        '<div style="font-size:var(--texte-xs);color:var(--brun-chaud);">Qté: ' + item.quantite + ' × ' + formaterPrix(item.price) + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Si Firestore est disponible, écouter les changements temps réel
  if (typeof window.db !== 'undefined' && window.db) {
    ecouterTempsReel(commande.orderId);
  }
}

/* ─── Timeline visuelle ─────────────────────────────────────── */
function renderTimeline(timeline, statutActuel) {
  var container = document.getElementById('tracking-timeline');
  var indexActuel = STATUTS_ORDRE.indexOf(statutActuel);

  container.innerHTML = STATUTS_ORDRE.map(function(statut, idx) {
    var etape = null;
    for (var i = 0; i < timeline.length; i++) {
      if (timeline[i].status === statut) {
        etape = timeline[i];
        break;
      }
    }

    var estFaite = idx <= indexActuel && statutActuel !== 'cancelled';
    var estActuelle = idx === indexActuel && statutActuel !== 'cancelled' && statutActuel !== 'delivered';
    var estAnnulee = statutActuel === 'cancelled';

    var cercleClass = 'tracking-cercle';
    if (estAnnulee && idx === 0) cercleClass += ' annule';
    else if (estActuelle) cercleClass += ' active';
    else if (estFaite) cercleClass += ' faite';

    var libelle = STATUTS[statut] ? STATUTS[statut].label : statut;
    var description = etape ? etape.description : '';
    var date = etape ? formaterDateCourt(etape.timestamp) : '';

    return '<div class="tracking-etape' + (estFaite ? ' faite' : '') + (estActuelle ? ' active' : '') + '">' +
      '<div class="tracking-point">' +
        '<div class="' + cercleClass + '">' +
          (estFaite && !estActuelle
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" width="12" height="12"><polyline points="20 6 9 17 4 12"/></svg>'
            : '')
        '</div>' +
        (idx < STATUTS_ORDRE.length - 1 ? '<div class="tracking-ligne' + (estFaite ? ' faite' : '') + '"></div>' : '') +
      '</div>' +
      '<div class="tracking-contenu">' +
        '<div class="tracking-libelle">' + libelle + '</div>' +
        (description ? '<div class="tracking-desc">' + description + '</div>' : '') +
        (date ? '<div class="tracking-date">' + date + '</div>' : '') +
      '</div>' +
    '</div>';
  }).join('');
}

/* ─── Écouter Firestore en temps réel ───────────────────────── */
function ecouterTempsReel(orderId) {
  if (typeof window.db === 'undefined') return;

  window.db.collection('orders').doc(orderId).onSnapshot(function(doc) {
    if (doc.exists) {
      var data = doc.data();
      renderTimeline(data.timeline || [], data.status);
      document.getElementById('tracking-statut').innerHTML = renderStatut(data.status);
    }
  }, function(err) {
    console.warn('Erreur tracking temps réel:', err);
  });
}

/* ─── Rendu des statuts (copié depuis orders.js pour autonomie) ── */
var STATUTS_ORDRE = ['pending', 'confirmed', 'shipped', 'delivered'];

var STATUTS = {
  'pending':    { label: 'En traitement',    couleur: '#C9A96E' },
  'confirmed':  { label: 'Confirmée',        couleur: '#2e7d32' },
  'shipped':    { label: 'Expédiée',         couleur: '#1565c0' },
  'delivered':  { label: 'Livrée',           couleur: '#2e7d32' },
  'cancelled':  { label: 'Annulée',          couleur: '#c62828' }
};

function renderStatut(status) {
  var s = STATUTS[status] || { label: status, couleur: '#999' };
  return '<span style="display:inline-flex;align-items:center;gap:6px;font-size:var(--texte-xs);padding:4px 10px;border-radius:20px;background:' + s.couleur + '20;color:' + s.couleur + ';">' +
    '<span style="width:6px;height:6px;border-radius:50%;background:' + s.couleur + ';"></span>' +
    s.label +
    '</span>';
}

function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(montant);
}

function formaterDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formaterDateCourt(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
