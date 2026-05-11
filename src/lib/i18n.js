// src/lib/i18n.js
// -----------------------------------------------------------
// Simple translation system.
// Reads the browser language once on startup.
// Falls back to English for any unsupported language.
// Add more languages by adding a new key to `translations`.
// -----------------------------------------------------------

const translations = {
  en: {
    // Navigation
    home: "Home",
    search: "Search",
    myLibrary: "My Library",
    profile: "Profile",
    login: "Login",
    loginToSave: "Login to save",
    logout: "Logout",
    register: "Register",

    // Media types
    all: "All",
    anime: "Anime",
    manga: "Manga",
    movie: "Movie",
    tvSeries: "TV Series",
    book: "Book",
    kindOfMedia: "Media Type",

    // Statuses
    watching: "Watching",
    completed: "Completed",
    planned: "Plan to Watch",
    dropped: "Dropped",

    // Library actions
    addToLibrary: "Add to Library",
    editEntry: "Edit Entry",
    removeFromLibrary: "Remove",
    inLibrary: "In Library",
    markAsFavorite: "Favorite",
    removeFavorite: "Remove Favorite",

    // Progress
    progress: "Progress",
    episode: "Ep.",
    chapter: "Ch.",
    page: "Pg.",
    of: "of",

    // Detail page
    synopsis: "Synopsis",
    genres: "Genres",
    status: "Status",
    score: "Score",
    episodes: "Episodes",
    volumes: "Volumes",
    chapters: "Chapters",
    pages: "Pages",
    yourRating: "Your Rating",
    yourReview: "Your Review",
    externalLink: "External Link",
    studio: "Studio",
    author: "Author",
    director: "Director",
    year: "Year",
    runtime: "Runtime",
    seasons: "Seasons",

    // Profile
    followers: "Followers",
    following: "Following",
    follow: "Follow",
    unfollow: "Unfollow",
    publicProfile: "Public Profile",
    privateProfile: "Private Profile",
    memberSince: "Member since",
    stats: "Stats",

    // Home
    popularAnime: "Popular Anime",
    popularMovies: "Popular Movies",
    popularBooks: "Popular Books",
    currentSeason: "This Season",
    recentActivity: "Continue Watching",
    viewAll: "View All →",

    // Search
    searchPlaceholder: "Search anime, manga, movies, books...",
    noResults: "No results found.",
    searching: "Searching...",
    results: "Results",

    // Auth
    emailLabel: "Email",
    passwordLabel: "Password",
    usernameLabel: "Username",
    loginTitle: "Login to MediaVault",
    registerTitle: "Create an Account",
    loginBtn: "Login",
    registerBtn: "Create Account",
    alreadyHaveAccount: "Already have an account? Login",
    dontHaveAccount: "Don't have an account? Register",
    loginError: "Invalid email or password.",
    registerError:
      "Could not create account. Try a different username or email.",

    // Misc
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    loading: "Loading...",
    error: "Something went wrong.",
    notFound: "Not found.",
    noEntriesYet: "Your library is empty.",
    startAdding: "Search for media and add it to your library!",
    filters: "Filters",
    sortBy: "Sort by",
    lightMode: "☀ Light",
    darkMode: "☾ Dark",
    minutes: "min",
    readMore: "Read more",
    readLess: "Read less",
    myStats: "My Stats",
    total: "Total",
    favorites: "Favorites",
    addReview: "Write a review...",
    noSynopsis: "No synopsis available.",
  },

  it: {
    // Navigation
    home: "Home",
    search: "Cerca",
    myLibrary: "La Mia Libreria",
    profile: "Profilo",
    login: "Accedi",
    loginToSave: "Accedi per salvare",
    logout: "Esci",
    register: "Registrati",

    // Media types
    all: "Tutti",
    anime: "Anime",
    manga: "Manga",
    movie: "Film",
    tvSeries: "Serie TV",
    book: "Libro",
    kindOfMedia: "Tipo di Media",

    // Statuses
    watching: "In Corso",
    completed: "Completato",
    planned: "Pianificato",
    dropped: "Abbandonato",

    // Library actions
    addToLibrary: "Aggiungi alla Libreria",
    editEntry: "Modifica",
    removeFromLibrary: "Rimuovi",
    inLibrary: "In Libreria",
    markAsFavorite: "Preferito",
    removeFavorite: "Rimuovi dai Preferiti",

    // Progress
    progress: "Progresso",
    episode: "Ep.",
    chapter: "Cap.",
    page: "Pag.",
    of: "di",

    // Detail page
    synopsis: "Sinossi",
    genres: "Generi",
    status: "Stato",
    score: "Punteggio",
    episodes: "Episodi",
    volumes: "Volumi",
    chapters: "Capitoli",
    pages: "Pagine",
    yourRating: "Il Tuo Voto",
    yourReview: "La Tua Recensione",
    externalLink: "Link Esterno",
    studio: "Studio",
    author: "Autore",
    director: "Regista",
    year: "Anno",
    runtime: "Durata",
    seasons: "Stagioni",

    // Profile
    followers: "Follower",
    following: "Seguiti",
    follow: "Segui",
    unfollow: "Non Seguire",
    publicProfile: "Profilo Pubblico",
    privateProfile: "Profilo Privato",
    memberSince: "Membro dal",
    stats: "Statistiche",

    // Home
    popularAnime: "Anime Popolari",
    popularMovies: "Film Popolari",
    popularBooks: "Libri Popolari",
    currentSeason: "Questa Stagione",
    recentActivity: "Continua a Guardare",
    viewAll: "Vedi Tutti →",

    // Search
    searchPlaceholder: "Cerca anime, manga, film, libri...",
    noResults: "Nessun risultato trovato.",
    searching: "Ricerca in corso...",
    results: "Risultati",

    // Auth
    emailLabel: "Email",
    passwordLabel: "Password",
    usernameLabel: "Nome Utente",
    loginTitle: "Accedi a MediaVault",
    registerTitle: "Crea un Account",
    loginBtn: "Accedi",
    registerBtn: "Crea Account",
    alreadyHaveAccount: "Hai già un account? Accedi",
    dontHaveAccount: "Non hai un account? Registrati",
    loginError: "Email o password non validi.",
    registerError:
      "Impossibile creare l'account. Prova con un altro username o email.",

    // Misc
    save: "Salva",
    cancel: "Annulla",
    close: "Chiudi",
    loading: "Caricamento...",
    error: "Qualcosa è andato storto.",
    notFound: "Non trovato.",
    noEntriesYet: "La tua libreria è vuota.",
    startAdding: "Cerca dei media e aggiungili alla tua libreria!",
    filters: "Filtri",
    sortBy: "Ordina per",
    lightMode: "☀ Chiaro",
    darkMode: "☾ Scuro",
    minutes: "min",
    readMore: "Leggi di più",
    readLess: "Leggi meno",
    myStats: "Le Mie Statistiche",
    total: "Totale",
    favorites: "Preferiti",
    addReview: "Scrivi una recensione...",
    noSynopsis: "Nessuna sinossi disponibile.",
  },
};

// Detect browser language (e.g. "it-IT" → "it")
function detectLanguage() {
  const lang = navigator.language.split("-")[0];
  return translations[lang] ? lang : "en";
}

const lang = detectLanguage();

// `t` is the translations object for the detected language.
// Import it anywhere: import { t } from '../lib/i18n'
const t = translations[lang];

export { t, lang, translations };
