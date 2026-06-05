/* =============================================================
 * 🔥 FIREBASE — Configuration ZANKA Luxury Bags
 * =============================================================
 * 
 * ── À FAIRE DANS LA CONSOLE FIREBASE (ÉTAPE PAR ÉTAPE) ──
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 1 : CRÉER LE PROJET
 * ═════════════════════════════════════════════════════════════
 * 1. Va sur https://console.firebase.google.com
 * 2. Clique "Créer un projet" (Add project)
 * 3. Entre le nom : "zanka-luxury-bags"
 *    → Important : Le nom est interne, tu pourras le changer plus tard
 * 4. Accepte ou non Google Analytics
 *    → RECOMMANDÉ : Activer Analytics pour les conversions e-commerce
 *    → Sélectionne un compte Analytics existant ou crée "ZANKA Analytics"
 * 5. Attends la création (~30 secondes)
 * 6. Clique "Continuer"
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 2 : ACTIVER FIRESTORE DATABASE
 * ═════════════════════════════════════════════════════════════
 * 1. Dans le panneau de gauche, clique "Firestore Database"
 * 2. Clique "Créer une base de données" (Create database)
 * 3. Choisis "Mode production" → c'est CRUCIAL pour la sécurité
 *    → En production, on interdit TOUT par défaut
 *    → On autorise ensuite ligne par ligne via les règles
 * 4. Choisis la région : "eur3" (Europe-west, Francfort)
 *    → Pourquoi ? RGPD + latence minimale pour clients européens
 * 5. Clique "Terminer"
 * 6. Va dans l'onglet "Règles" et remplace par le contenu plus bas
 *    → Les règles sont dans la section SECURITY RULES de ce fichier
 * 7. Clique "Publier" (Publish)
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 3 : ACTIVER FIREBASE AUTHENTICATION
 * ═════════════════════════════════════════════════════════════
 * 1. Panneau de gauche → "Authentication"
 * 2. Clique "Commencer" (Get started)
 * 3. Ouvre "Connecteurs par identité" (Sign-in providers)
 * 4. Active "E-mail/Mot de passe" :
 *    - Active le premier bouton (Enable)
 *    - Laisse "Création de compte" activé
 *    - Clique "Enregistrer"
 * 5. Active "Google" :
 *    - Active le bouton
 *    - Dans "Nom public du projet" : "ZANKA"
 *    - Choisis un e-mail d'assistance (le tien)
 *    - Clique "Enregistrer"
 *    → Note : Pour Google en production, tu devras configurer
 *      les IDs OAuth dans Google Cloud Console (lien fourni)
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 4 : ACTIVER FIREBASE STORAGE
 * ═════════════════════════════════════════════════════════════
 * 1. Panneau de gauche → "Storage"
 * 2. Clique "Commencer"
 * 3. Choisis "Mode production" (encore une fois, sécurité d'abord)
 * 4. Région : "eur3" (même que Firestore, cohérence obligatoire)
 * 5. Clique "Terminer"
 * 6. Remplace les règles de sécurité par celles plus bas
 * 7. Structure de dossiers à créer dans Storage :
 *    /products-images/backpacks/
 *    /products-images/sacs-a-main-hommes/
 *    /products-images/sacs-a-main-femmes/
 *    /hero-videos/
 *    /blog/
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 5 : RÉCUPÉRER LA CONFIGURATION
 * ═════════════════════════════════════════════════════════════
 * 1. Dans le panneau de gauche, clique sur l'icône ⚙️ (Engrenage)
 *    → "Paramètres du projet" (Project settings)
 * 2. Scrolle jusqu'à "Mes applis" (Your apps)
 * 3. Clique sur le bouton "</>" (Web) — icône chevrons
 * 4. Saisis le surnom de l'app : "zanka-web-app"
 * 5. Coche "Firebase Hosting" si tu veux déployer avec
 * 6. Clique "Enregistrer l'app" (Register app)
 * 7. UN CODE JS APPARAÎT — c'est ton firebaseConfig
 *    → ATTENTION : Ces clés sont "publiques" par conception
 *    → Elles sont sécurisées via les règles Firestore/Storage
 *    → Mais NE LES COMMITE JAMAIS dans un repo public
 *    → Utilise plutôt des variables d'environnement (plus bas)
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 6 : ACTIVER FIREBASE HOSTING (DÉPLOIEMENT)
 * ═════════════════════════════════════════════════════════════
 * 1. Panneau de gauche → "Hosting"
 * 2. Clique "Commencer" (Get started)
 * 3. Suis les instructions (ou note-les pour plus tard) :
 *    npm install -g firebase-tools
 *    firebase login
 *    firebase init hosting
 *    firebase deploy
 * 4. Choisis "zanka-luxury-bags" comme projet
 * 5. Pour le dossier public : "."
 *    → On mettra tout à la racine du projet
 * 6. Configure comme SPA : "Non"
 * 7. Ne pas écraser index.html : "Non"
 * 8. Note ton URL de déploiement (ex: zanka-luxury-bags.web.app)
 *
 * ═════════════════════════════════════════════════════════════
 * ÉTAPE 7 (FACULTATIF MAIS RECOMMANDÉ) : VARIABLES D'ENVIRONNEMENT
 * ═════════════════════════════════════════════════════════════
 * Pour ne JAMAIS exposer tes clés dans Git :
 * 1. Crée un fichier .env à la racine du projet :
 *    VITE_FIREBASE_API_KEY=AIzaSy...
 *    VITE_FIREBASE_AUTH_DOMAIN=zanka-luxury-bags.firebaseapp.com
 *    ... (toutes les clés)
 * 2. Ajoute .env à .gitignore
 * 3. Le fichier .env.example sert de template (sans les vraies valeurs)
 *
 * ═════════════════════════════════════════════════════════════
 * ERREURS COURANTES (À ÉVITER)
 * ═════════════════════════════════════════════════════════════
 * ❌ "Firebase: Error: auth/configuration-not-found"
 *    → Solution : Vérifie que l'authentification est activée dans la console
 *
 * ❌ "FirebaseError: Missing or insufficient permissions"
 *    → Solution : Publie les règles Firestore avant d'écrire
 *
 * ❌ "CORS error" sur Storage
 *    → Solution : Ajoute la config CORS via CLI (commande plus bas)
 *
 * ❌ "Cannot read property 'products' of undefined"
 *    → Solution : Firestore pas encore créé ou règles bloquent l'accès
 *
 * ❌ Firebase Hosting : "HTTP Error: 404, NOT FOUND" au déploiement
 *    → Solution : Vérifie que "public" dans firebase.json pointe au bon endroit
 *
 * ❌ "auth/operation-not-allowed" sur Google
 *    → Solution : Google Sign-In pas activé dans Authentication > Providers
 *
 * ============================================================= */

// ═══════════════════════════════════════════════════════════════
//  SECTION 1 : CONFIGURATION FIREBASE
// ═══════════════════════════════════════════════════════════════
// IMPORTANT : Remplace les valeurs ci-dessous par celles de ta console
// ATTENTION : Ne JAMAIS commiter les vraies clés dans Git
//
// 👇 ÉTAPE : Copie les valeurs depuis Console Firebase > ⚙️ > Paramètres
//    du projet > Mes applis > zanka-web-app > Configuration > firebaseConfig
// =============================================================

const firebaseConfig = {
  // ─── Identifiant unique de ton projet Firebase ────────────────
  // Permet à Firebase de savoir à quel projet tu te connectes.
  // Format : "zanka-luxury-bags" ou "zanka-luxury-bags-12345"
  apiKey: "AIzaSyBceVrYt4x9o5jtwQQvgi6QKpv6pf6ey8w",

  // ─── Domaine d'authentification ───────────────────────────────
  // Généré automatiquement. Utilisé par Firebase Auth.
  // Format : "zanka-luxury-bags.firebaseapp.com"
  authDomain: "zanka-luxury-bag.firebaseapp.com",

  // ─── ID du projet ─────────────────────────────────────────────
  // Identique au nom du projet dans la console.
  // Utilisé par tous les services Firebase.
  projectId: "zanka-luxury-bag",

  // ─── Bucket de stockage ───────────────────────────────────────
  // Utilisé par Firebase Storage pour les images et vidéos.
  // Format : "zanka-luxury-bags.appspot.com"
  storageBucket: "zanka-luxury-bag.firebasestorage.app",

  // ─── ID de l'application (optionnel mais recommandé) ──────────
  // Utilisé par Firebase Analytics et Cloud Messaging.
  // Format : "1:123456789:web:abc123def456"
  messagingSenderId: "575949850035",

  // ─── ID de l'application Firebase ─────────────────────────────
  // Identifiant unique de cette app web spécifique.
  appId: "1:575949850035:web:fc4dd35bc7ae38922977c6",

  // ─── ID de mesure Analytics ───────────────────────────────────
  // Optionnel mais utile pour les conversions e-commerce.
  // Format : "G-XXXXXXXXXX"
  measurementId: "G-WEYZG50KBE"
};

/* ═══════════════════════════════════════════════════════════════
 * ALTERNATIVE SÉCURISÉE : Variables d'environnement (production)
 * ═══════════════════════════════════════════════════════════════
 * 
 * Décommente ce bloc si tu préfères les variables d'environnement.
 * Configure un fichier .env à la racine avec :
 * 
 * # Fichier .env (NE PAS COMMITER)
 * VITE_FIREBASE_API_KEY=AIzaSy...
 * VITE_FIREBASE_AUTH_DOMAIN=zanka-luxury-bags.firebaseapp.com
 * ...
 *
 * Puis dans ce fichier :
 * 
 * const firebaseConfig = {
 *   apiKey: "VITE_FIREBASE_API_KEY",
 *   authDomain: "VITE_FIREBASE_AUTH_DOMAIN",
 *   projectId: "VITE_FIREBASE_PROJECT_ID",
 *   storageBucket: "VITE_FIREBASE_STORAGE_BUCKET",
 *   messagingSenderId: "VITE_FIREBASE_MESSAGING_SENDER_ID",
 *   appId: "VITE_FIREBASE_APP_ID",
 *   measurementId: "VITE_FIREBASE_MEASUREMENT_ID"
 * };
 *
 * ═══════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════
//  SECTION 2 : INITIALISATION FIREBASE
// ═══════════════════════════════════════════════════════════════
// On initialise Firebase UNE SEULE FOIS pour toute l'application.
// Le pattern try/catch permet de détecter les erreurs de config.
// Le double appel (apps.length === 0) évite les erreurs de
// réinitialisation en mode développement (hot reload).
// =============================================================

let app;        // L'application Firebase initialisée
let db;         // Firestore (base de données)
let auth;       // Authentication (connexion utilisateurs)
let storage;    // Storage (images produits)

try {
  // Vérifie si Firebase est déjà initialisé (évite doublon en dev)
  if (!firebase.apps.length) {
    // Initialisation unique de l'application Firebase
    // → firebase.initializeApp() configure tous les services
    //   à partir du firebaseConfig qu'on a défini plus haut
    // → Sans ça, rien ne fonctionne
    app = firebase.initializeApp(firebaseConfig);
    
    console.log('✓ ZANKA — Firebase initialisé avec succès');
    console.log('  → Projet :', firebaseConfig.projectId);
    console.log('  → Base de données : Firestore (eur3)');
    console.log('  → Auth : Email/Password + Google');
  } else {
    // Si déjà initialisé (cas du hot-reload en dev)
    // On récupère l'instance existante
    app = firebase.app();
    console.log('ℹ ZANKA — Firebase déjà initialisé, réutilisation');
  }

  // ─── Initialisation des services individuels ───────────────
  // Chaque service est initialisé indépendamment pour :
  // 1. Permettre la vérification individuelle
  // 2. Faciliter le debug (savoir quel service échoue)
  // 3. Permettre l'utilisation conditionnelle (ex: pas de Storage si non configuré)
  
  // Firestore : Base de données NoSQL temps réel
  // Stocke : produits, utilisateurs, commandes, paniers
  db = firebase.firestore();
  
  // Configuration supplémentaire Firestore
  // → enablePersistence() permet le mode hors-ligne
  //   (les données restent accessibles même sans connexion)
  // → Important pour l'expérience mobile : pas de perte de données
  db.enablePersistence()
    .catch(function(err) {
      // Erreur fréquente : plusieurs onglets ouverts
      // Firebase limite la persistence à un seul onglet
      if (err.code === 'failed-precondition') {
        console.warn('⚠ Persistence Firestore désactivée : plusieurs onglets ouverts');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠ Persistence Firestore désactivée : navigateur non supporté');
      }
    });
  
  // Authentication : Gère les connexions utilisateurs
  // Supporte : email/password, Google
  auth = firebase.auth();
  
  // Storage : Stockage d'images et vidéos
  // Utilisé pour : images produits, vidéos hero, avatars
  // Note : optionnel — désactivé si Storage pas encore activé dans la console
  if (typeof firebase.storage === 'function') {
    storage = firebase.storage();
  }

} catch (error) {
  // ─── Gestion d'erreur centralisée ─────────────────────────
  // Toute erreur d'initialisation Firebase est capturée ici
  // Cela évite que le site plante silencieusement
  // Affiche un message clair pour le développeur
  console.error('✕ ZANKA — ERREUR FATALE : Initialisation Firebase échouée');
  console.error('  → Vérifie firebase-config.js');
  console.error('  → Détail :', error.message);
  console.error('  → Code :', error.code);
  
  // ⚠️ EN DÉVELOPPEMENT SEULEMENT : Affiche l'erreur complète
  console.error('  → Stack complet :', error);

  // Note : En production, remplacer par une notification discrète
  // via un toast système plutôt qu'une alerte bloquante.
}


// ═══════════════════════════════════════════════════════════════
//  SECTION 3 : EXPORT DES INSTANCES
// ═══════════════════════════════════════════════════════════════
// On exporte les instances pour les utiliser dans les autres fichiers JS.
// Chaque fichier (auth.js, products.js, cart.js, etc.) importera
// uniquement les services dont il a besoin.
//
// Exemple d'import dans un autre fichier :
//   import { db, auth, storage } from './firebase-config.js';
//
// En Vanilla JS (sans module bundler), on utilise window :
//   <script src="js/firebase-config.js"></script>
//   <script src="js/auth.js"></script>
//   // Dans auth.js : window.db, window.auth, window.storage
// =============================================================

// Expose les instances dans window pour accès global
// → Permet d'utiliser db, auth, storage dans tous les scripts
// → Sans module bundler (Webpack/Vite), c'est la méthode standard
window.app = app;
window.db = db;
window.auth = auth;
window.storage = storage;

// ─── Vérification d'intégrité ─────────────────────────────────
// Un petit test pour s'assurer que tout est bien exporté
// Si window.db est undefined, quelque chose s'est mal passé
if (window.db && window.auth) {
  console.log('✓ ZANKA — Modules Firebase exportés avec succès');
  console.log('  → db (Firestore) :', typeof window.db);
  console.log('  → auth (Auth) :', typeof window.auth);
  console.log('  → storage (Storage) :', typeof window.storage);
} else {
  console.warn('⚠ ZANKA — Certains modules Firebase non exportés');
}


/* ═══════════════════════════════════════════════════════════════
 * 🔒 RÈGLES DE SÉCURITÉ — À COPIER DANS LA CONSOLE
 * ═══════════════════════════════════════════════════════════════
 *
 * ── FIRESTORE (Firestore Database > Règles) ──────────────────
 *
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *
 *     // Règle de base : refuser tout par défaut (sécurité maximale)
 *     match /{document=**} {
 *       allow read, write: if false;
 *     }
 *
 *     // 🔓 Produits : lecture autorisée pour TOUS (même non connectés)
 *     // Pourquoi ? Les produits doivent être visibles avant connexion
 *     // Écriture : réservée aux admins (via le claim admin)
 *     match /products/{productId} {
 *       allow read: if true;
 *       allow write: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔓 Catégories : lecture publique, écriture admin
 *     // Structure : /categories/{categoryId}
 *     //   { id: "backpacks", name: "Backpacks", description: "...", order: 1 }
 *     match /categories/{categoryId} {
 *       allow read: if true;
 *       allow write: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔓 Collections (sacs) : lecture publique
 *     // Utilisé pour les pages collection dynamiques
 *     match /collections/{collectionId} {
 *       allow read: if true;
 *       allow write: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔐 Utilisateurs : règles strictes
 *     // Un utilisateur ne peut lire/écrire que SON document
 *     // Le document doit être créé à l'inscription
 *     match /users/{userId} {
 *       allow read, write: if request.auth.uid == userId;
 *       // L'admin peut tout lire/écrire (gestion clientèle)
 *       allow read, write: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔐 Paniers : lecture/écriture par le propriétaire uniquement
 *     // Structure : /carts/{userId}
 *     //   { items: [...], total: 0, updatedAt: Timestamp }
 *     match /carts/{userId} {
 *       allow read, write: if request.auth.uid == userId;
 *       allow read, write: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔐 Commandes : le client voit SES commandes
 *     // Structure : /orders/{orderId}
 *     //   { userId, items: [...], total, status, createdAt }
 *     match /orders/{orderId} {
 *       allow read: if request.auth.uid == resource.data.userId;
 *       allow read: if request.auth.token.admin == true;
 *       allow write: if request.auth.token.admin == true;
 *       // Le client peut créer une commande (s'il est connecté)
 *       allow create: if request.auth.uid == request.resource.data.userId;
 *     }
 *
 *     // 🔐 Adresses : propriétaire uniquement
 *     match /addresses/{addressId} {
 *       allow read, write, delete: if request.auth.uid == resource.data.userId;
 *     }
 *
 *     // 🔓 Newsletter : inscription publique (limité)
 *     match /newsletter/{email} {
 *       allow create: if true;
 *       allow read: if request.auth.token.admin == true;
 *     }
 *
 *     // 🔐 Reviews : les clients connectés peuvent écrire
 *     // Un review par produit par utilisateur max
 *     match /reviews/{reviewId} {
 *       allow read: if true;
 *       allow create: if request.auth.uid != null
 *         && request.resource.data.userId == request.auth.uid;
 *       allow update, delete: if request.auth.uid == resource.data.userId
 *         || request.auth.token.admin == true;
 *     }
 *   }
 * }
 *
 *
 * ── STORAGE (Storage > Règles) ───────────────────────────────
 *
 * rules_version = '2';
 * service firebase.storage {
 *   match /b/{bucket}/o {
 *
 *     // Images produits : lecture publique, écriture admin uniquement
 *     match /products-images/{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth.token.admin == true;
 *     }
 *
 *     // Avatars utilisateurs : le propriétaire peut upload
 *     match /users/{userId}/avatar.jpg {
 *       allow read: if true;
 *       allow write: if request.auth.uid == userId;
 *     }
 *
 *     // Vidéos héros : lecture publique
 *     match /hero-videos/{allPaths=**} {
 *       allow read: if true;
 *       allow write: if request.auth.token.admin == true;
 *     }
 *   }
 * }
 *
 *
 * ── COMMANDES CLI UTILES ──────────────────────────────────────
 *
 * # Installer Firebase Tools
 * npm install -g firebase-tools
 *
 * # Connexion à Firebase
 * firebase login
 *
 * # Initialiser Hosting (à la racine du projet)
 * firebase init hosting
 *
 * # Déployer le site
 * firebase deploy
 *
 * # Configurer CORS pour Storage (évite les erreurs de chargement)
 * # Crée un fichier cors.json :
 * # [
 * #   {
 * #     "origin": ["https://zanka-luxury-bags.web.app", "http://localhost:5500"],
 * #     "method": ["GET", "HEAD", "OPTIONS"],
 * #     "maxAgeSeconds": 3600
 * #   }
 * # ]
 * # Puis exécute :
 * gsutil cors set cors.json gs://zanka-luxury-bags.appspot.com
 *
 * ═══════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════
 * 📦 STRUCTURE DE LA BASE DE DONNÉES (FIRESTORE)
 * ═══════════════════════════════════════════════════════════════
 *
 * ── Collection : products ────────────────────────────────────
 *   /products/{productId}
 *   {
 *     id: string,            // Identifiant unique
 *     name: string,          // "Sac à dos Zephyr"
 *     slug: string,          // "sac-a-dos-zephyr"
 *     description: string,   // Description longue (HTML supporté)
 *     shortDescription: string, // Accroche courte (SEO meta)
 *     category: string,      // "backpacks" | "sac-a-main-hommes" | "sac-a-main-femmes"
 *     collection: string,    // "ete-2026" | "classique" ...
 *     price: number,         // Prix en euros (ex: 450.00)
 *     compareAtPrice: number | null, // Prix barré (promotion)
 *     currency: string,      // "EUR"
 *     images: string[],      // URLs des images (1ère = principale)
 *     altText: string[],     // Textes alt pour SEO (même ordre)
 *     colors: string[],      // Couleurs disponibles ["Sable", "Noir", "Chocolat"]
 *     materials: string[],   // Matériaux ["Cuir pleine fleur", "Alcantara"]
 *     dimensions: {          // Dimensions en cm
 *       height: number,
 *       width: number,
 *       depth: number
 *     },
 *     weight: number,        // Poids en grammes
 *     features: string[],    // Caractéristiques ["Compartiment rembourré", ...]
 *     inStock: boolean,      // Disponibilité
 *     stockCount: number,    // Quantité en stock
 *     rating: number,        // Note moyenne (0-5)
 *     reviewCount: number,   // Nombre d'avis
 *     isNew: boolean,        // Nouveauté (badge sur la fiche)
 *     isBestseller: boolean, // Meilleure vente
 *     isOnSale: boolean,     // En promotion
 *     discountPercent: number | null, // % de réduction
 *     seo: {                 // Données SEO spécifiques
 *       title: string,       // Title personnalisé
 *       description: string, // Meta description
 *       ogImage: string      // Image Open Graph partageable
 *     },
 *     createdAt: Timestamp,  // Date de création
 *     updatedAt: Timestamp   // Dernière modification
 *   }
 *
 * ── Collection : categories ──────────────────────────────────
 *   /categories/{categoryId}
 *   {
 *     id: string,     // "backpacks"
 *     name: string,   // "Backpacks"
 *     slug: string,   // "backpacks"
 *     description: string, // Texte SEO de catégorie
 *     image: string,  // URL image de catégorie
 *     order: number,  // Ordre d'affichage (1, 2, 3)
 *     active: boolean // Visible ou non
 *   }
 *
 * ── Collection : users ───────────────────────────────────────
 *   /users/{userId}
 *   {
 *     id: string,           // UID Firebase Auth
 *     email: string,        // Email
 *     firstName: string,    // Prénom
 *     lastName: string,     // Nom
 *     phone: string | null, // Téléphone
 *     addresses: [{         // Tableau d'adresses
 *       id: string,
 *       label: string,      // "Domicile", "Bureau"
 *       firstName, lastName,
 *       line1, line2,
 *       city, postalCode,
 *       country,            // "FR"
 *       isDefault: boolean
 *     }],
 *     createdAt: Timestamp,
 *     lastLogin: Timestamp,
 *     orderCount: number,
 *     totalSpent: number,
 *     newsletter: boolean,
 *     preferences: {
 *       notifications: boolean,
 *       newsletterEmails: boolean
 *     }
 *   }
 *
 * ── Collection : orders ──────────────────────────────────────
 *   /orders/{orderId}
 *   {
 *     id: string,           // "CMD-2026-00042"
 *     userId: string,       // UID du client
 *     items: [{
 *       productId: string,
 *       name: string,
 *       quantity: number,
 *       price: number,       // Prix unitaire au moment de l'achat
 *       image: string,
 *       color: string,
 *       bundleName: string | null  // "Lot été" si issu d'un bundle
 *     }],
 *     subtotal: number,
 *     discount: number,      // Réduction totale
 *     shipping: number,      // Frais de port
 *     tax: number,           // TVA (20%)
 *     total: number,         // Total final
 *     currency: "EUR",
 *     status: string,        // "pending" | "confirmed" | "preparing"
 *                            // | "shipped" | "delivered" | "cancelled"
 *     tracking: {
 *       carrier: string | null,   // "Colissimo", "DHL"
 *       number: string | null,    // Numéro de suivi
 *       url: string | null,       // URL de suivi
 *       steps: [{                 // Étapes de livraison
 *         date: string,
 *         location: string,
 *         status: string
 *       }]
 *     },
 *     shippingAddress: { ... },
 *     billingAddress: { ... },
 *     paymentMethod: string,
 *     paymentStatus: string,  // "paid" | "pending" | "refunded"
 *     couponCode: string | null,
 *     notes: string | null,   // Instructions spéciales
 *     createdAt: Timestamp,
 *     updatedAt: Timestamp
 *   }
 *
 * ═══════════════════════════════════════════════════════════════ */
