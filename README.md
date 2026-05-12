# 📚 MediaVault - Webapp di Libreria Personale

## Descrizione del Progetto

**MediaVault** è una web application che permette agli utenti di gestire la propria libreria personale di media digitali, tracciare i progressi di visione/lettura, esplorare nuovi contenuti tramite API esterne e condividere la propria libreria con altri utenti.

Il sistema supporta cinque categorie di media:
- 🎬 **Film**
- 📺 **Serie TV**
- 🌸 **Anime**
- 📖 **Manga**
- 📕 **Libri**

Ogni utente ha un **profilo pubblico personalizzabile** in cui può mostrare i propri progressi dei media memorizzati. L'integrazione con API esterne (es. TMDB, Jikan, Google Books) consente di recuperare automaticamente le informazioni sui media e di reindirizzare l'utente verso piattaforme di streaming o di lettura, qualora non fossero disponibili.

---

## Funzionalità Principali

### 👤 Gestione Utente
- Profilo personalizzabile (avatar, bio, tema profilo, media preferiti)
- Impostazioni privacy (profilo pubblico/privato)

### 📂 Libreria Personale
- Aggiunta di media alla libreria tramite ricerca con API esterne
- Organizzazione per stato: `In corso`, `Completato`, `Pianificato`, `Abbandonato`
- Tracciamento del progresso (es. episodio X/Y, capitolo X/Y, pagina X/Y)
- Valutazione personale (voto, recensione testuale)
- Tag e categorie personalizzate
- Sezione **"Media Preferiti"** con ordinamento manuale

### 🔗 Integrazione Esterna
- Ricerca media tramite API di terze parti:
  - **TMDB** (Film e Serie TV)
  - **Jikan / AniList** (Anime e Manga)
  - **Google Books / OpenLibrary** (Libri)
- Reindirizzamento verso piattaforme esterne (Netflix, Crunchyroll, Kindle, ecc.)
- Sincronizzazione del progresso al ritorno dal sito esterno (manuale o via deep link)

### 🌐 Profilo Pubblico e Condivisione
- URL univoco del profilo (es. `/utente/nomeutente`)
- Visualizzazione della libreria pubblica con filtri per categoria e stato
- Sezione "Media Preferiti" personalizzabile
- Statistiche pubbliche (ore di visione stimate, media completati, ecc.)
- Possibilità di seguire altri utenti e vedere la loro attività

---

## Stack Tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | React + React Router |
| Styling | CSS + Bootstrap |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| API Esterne | TMDB, Jikan, Google Books |

---

## Schema ER (Relazioni Principali)

<img width="1133" height="703" alt="image" src="https://github.com/user-attachments/assets/4bbc4633-fad9-4f47-aa4e-a213c14cfa3a" />
