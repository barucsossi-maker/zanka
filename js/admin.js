function adminAuthCheck() {
  if (localStorage.getItem('zanka_admin_token') !== 'authenticated') {
    window.location.href = 'login.html';
  }
}

function adminLogin(email, password) {
  if (typeof window.auth === 'undefined' || !window.auth) {
    return Promise.resolve({ success: false, message: 'Firebase Auth indisponible. Vérifiez votre connexion.' });
  }
  return window.auth.signInWithEmailAndPassword(email, password)
    .then(function(userCred) {
      return userCred.user.getIdTokenResult().then(function(idTokenResult) {
        if (idTokenResult.claims.admin === true) {
          localStorage.setItem('zanka_admin_token', 'authenticated');
          localStorage.setItem('zanka_admin_user', JSON.stringify({
            email: email,
            name: userCred.user.displayName || email.split('@')[0]
          }));
          return { success: true };
        }
        window.auth.signOut();
        localStorage.removeItem('zanka_admin_token');
        return { success: false, message: 'Accès refusé : vous n\'êtes pas administrateur.' };
      });
    })
    .catch(function(err) {
      return { success: false, message: err.message };
    });
}

function adminLogout() {
  if (typeof window.auth !== 'undefined' && window.auth) {
    window.auth.signOut().catch(function() {});
  }
  localStorage.removeItem('zanka_admin_token');
  localStorage.removeItem('zanka_admin_user');
  window.location.href = 'login.html';
}

function getAdminUser() {
  try {
    return JSON.parse(localStorage.getItem('zanka_admin_user'));
  } catch(e) { return null; }
}

function formatPrix(v) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateShort(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function showToast(message, type) {
  var existing = document.querySelector('.admin-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'admin-toast' + (type ? ' ' + type : '');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(function() {
    toast.classList.add('show');
  });
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

function statusLabel(s) {
  var map = {
    'pending': 'En attente', 'confirmed': 'Confirmée', 'preparing': 'Préparation',
    'shipped': 'Expédiée', 'delivered': 'Livrée', 'cancelled': 'Annulée', 'refunded': 'Remboursée'
  };
  return map[s] || s;
}

function statusColor(s) {
  var map = {
    'pending': '#C9A96E', 'confirmed': '#2e7d32', 'preparing': '#1565c0',
    'shipped': '#1565c0', 'delivered': '#2e7d32', 'cancelled': '#c62828', 'refunded': '#7f8c8d'
  };
  return map[s] || '#999';
}

function statusBadge(s) {
  var c = statusColor(s);
  return '<span class="status-badge" style="background:' + c + '18;color:' + c + ';">' +
    '<span class="status-dot" style="background:' + c + ';"></span>' +
    statusLabel(s) +
  '</span>';
}

function initAdminLayout() {
  var user = getAdminUser();
  if (user) {
    var el = document.getElementById('admin-user-name');
    if (el) el.textContent = user.name || user.email;
  }
  var burger = document.querySelector('.admin-hamburger');
  var sidebar = document.querySelector('.admin-sidebar');
  if (burger && sidebar) {
    burger.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
  var navLinks = document.querySelectorAll('.admin-nav-item');
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === currentPath || (currentPath === 'order-detail.html' && href === 'orders.html')) {
      a.classList.add('active');
    }
  });
}

if (document.getElementById('admin-logout-btn')) {
  document.getElementById('admin-logout-btn').addEventListener('click', function(e) {
    e.preventDefault();
    adminLogout();
  });
}
