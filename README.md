# 🎬 CineCue

> A Netflix-inspired streaming platform built with React that dynamically loads movies and TV series from Google Sheets or CSV data sources.

## ✨ Features

### 🎯 Core Functionality

- **Dynamic Content Loading** - Seamlessly loads movie and TV series data from Google Sheets CSV exports
- **Netflix-Style Series Browsing** - Organize episodes by seasons with intuitive navigation
- **Advanced Search & Filtering** - Real-time search with smart filtering by genre, year, rating, and more
- **Multiple View Modes** - Switch between grid and list views for optimal browsing
- **User Authentication** - Powered by Supabase for secure user accounts and personal lists
- **Personal Lists** - Add movies and series to "My List" for easy access
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🎨 User Experience

- **Netflix-Inspired UI** - Modern, sleek interface with hover effects and smooth transitions
- **Series Episode Management** - Season-based navigation with episode details, file sizes, and dates
- **Interactive Media Cards** - Rich hover states with play buttons and quick actions
- **TMDB Integration** - Automatic poster fetching for professional-quality artwork
- **Google Drive Integration** - Direct streaming from Google Drive with preview support
- **Loading States** - Elegant loading animations and skeleton screens

### 📱 Interface Elements

- **Sticky Navigation** - Context-aware navigation with active page indicators
- **Expandable Search** - Global search across movies and TV shows
- **Hero Section** - Dynamic stats display with item counts
- **Season/Episode Navigation** - Tabbed interface for easy series browsing
- **Play Functionality** - Direct streaming with Google Drive preview links
- **File Metadata** - Display file sizes, upload dates, and quality information

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14.0 or higher)
- **npm** or **yarn** package manager
- **Google Sheets** with movie/series data
- **Supabase Account** (optional, for user authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JAISE04/CineCue.git
   cd CineCue
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```bash
   # Google Sheets CSV URLs
   REACT_APP_SHEET_CSV_URL=your_movies_google_sheets_csv_url
   REACT_APP_SERIES_CSV_URL=your_series_google_sheets_csv_url

   # Supabase Configuration (optional)
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Data Sources & Setup

### Google Sheets Setup

#### Movies Sheet Structure

| Column Name     | Description           | Required | Example                         |
| --------------- | --------------------- | -------- | ------------------------------- |
| `Clean Title`   | Movie title           | ✅       | "Guardians of the Galaxy Vol 3" |
| `Poster`        | Poster image URL      | ✅       | "https://image.tmdb.org/..."    |
| `Preview Link`  | Streaming/preview URL | ✅       | "https://drive.google.com/..."  |
| `Download Link` | Download URL          | ✅       | "https://drive.google.com/..."  |
| `Year`          | Release year          | ❌       | "2023"                          |
| `Rating`        | IMDb/Movie rating     | ❌       | "8.2"                           |
| `Genre`         | Movie genre(s)        | ❌       | "Action, Adventure"             |
| `Duration`      | Runtime               | ❌       | "150 min"                       |

#### TV Series Sheet Structure

| Column Name      | Description          | Required | Example                           |
| ---------------- | -------------------- | -------- | --------------------------------- |
| `Series`         | Series title         | ✅       | "BoJack Horseman"                 |
| `Season`         | Season name          | ✅       | "Season 1"                        |
| `Episode`        | Episode title/number | ✅       | "E01 - Pilot"                     |
| `File Name`      | Episode file name    | ✅       | "BoJack.Horseman.S01E01.720p.mkv" |
| `Preview URL`    | Streaming URL        | ✅       | "https://drive.google.com/..."    |
| `File URL`       | Download URL         | ✅       | "https://drive.google.com/..."    |
| `Poster URL`     | Series poster (TMDB) | ❌       | "https://image.tmdb.org/..."      |
| `File Size`      | Episode file size    | ❌       | "2.5 GB"                          |
| `Date Added`     | Upload date          | ❌       | "2023-11-23"                      |
| `Season Number`  | Season number        | ❌       | "1"                               |
| `Episode Number` | Episode number       | ❌       | "1"                               |

### TMDB Integration Setup

For automatic poster fetching, use this Google Apps Script:

```javascript
function generateSeriesData() {
  const API_KEY = "your_tmdb_api_key";

  // Your series data processing logic
  const seriesName = "BoJack Horseman";
  const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
    seriesName
  )}`;

  const response = UrlFetchApp.fetch(searchUrl);
  const data = JSON.parse(response.getContentText());

  if (data.results && data.results.length > 0) {
    const posterPath = data.results[0].poster_path;
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  }

  return null;
}
```

### Google Sheets CSV Export

1. **Create your Google Sheet** with the required columns
2. **Publish to web**: File → Share → Publish to web
3. **Select CSV format** and get the public URL
4. **Use in .env file** as `REACT_APP_SHEET_CSV_URL` and `REACT_APP_SERIES_CSV_URL`

## 🛠 Technology Stack

### Frontend

- **React 18+** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Lucide React** - Beautiful, customizable icons
- **React Hot Toast** - Elegant notification system

### Data & Storage

- **Papa Parse** - Powerful CSV parsing library
- **Supabase** - Backend-as-a-Service for authentication and data
- **Google Sheets** - Dynamic data source via CSV export

### Styling

- **CSS3** - Custom CSS with modern features
- **Flexbox & Grid** - Responsive layout systems
- **CSS Animations** - Netflix-style transitions and hover effects

## 🎨 Component Architecture

```
src/
├── components/
│   ├── Navbar.js              # Navigation with search
│   ├── MovieCard.js           # Individual movie cards
│   ├── SeriesCard.js          # TV series cards with season info
│   ├── SeriesModal.js         # Series detail modal with episodes
│   ├── ControlSection.js      # Filters and view controls
│   └── Footer.js              # App footer
├── pages/
│   ├── Home.js                # Landing page
│   ├── Movies.js              # Movies catalog
│   ├── TVShows.js             # TV series catalog
│   ├── MyList.js              # User's personal list
│   └── Auth.js                # Authentication
├── context/
│   ├── AuthContext.js         # User authentication state
│   ├── MovieListContext.js    # Movie list management
│   └── SeriesContext.js       # Series list management
└── utils/
    └── userList.js            # List utility functions
```

## 🔧 Advanced Features

### Series Management

- **Season-based Organization** - Automatic grouping by seasons
- **Episode Metadata** - File sizes, upload dates, quality info
- **Play Integration** - Direct Google Drive streaming
- **Progress Tracking** - Latest season indicators

### User Authentication

- **Supabase Integration** - Secure user accounts
- **Personal Lists** - Save favorite movies and series
- **Optimistic Updates** - Instant UI feedback

### Performance Optimizations

- **Lazy Loading** - Components load as needed
- **CSV Caching** - Efficient data parsing
- **Responsive Images** - Optimized poster loading

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
@media (max-width: 768px) /* Mobile */ @media (min-width: 769px) /* Tablet */ @media (min-width: 1024px) /* Desktop */ @media (min-width: 1440px); /* Large Desktop */
```

### Mobile Features

- **Touch-Optimized** - Large touch targets
- **Swipe Navigation** - Gesture support
- **Compressed Layouts** - Space-efficient design
- **Fast Loading** - Optimized for mobile networks

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Platforms

#### Netlify

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard

#### Vercel

1. Import your GitHub repository
2. Environment variables auto-detected from `.env`
3. Zero-configuration deployment

#### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔒 Security & Best Practices

### Environment Variables

- **Never commit .env files** - Add to .gitignore
- **Use REACT*APP* prefix** - Only for client-safe variables
- **Supabase RLS** - Row Level Security for data protection

### Data Validation

- **CSV Structure Validation** - Graceful error handling
- **URL Sanitization** - Safe external link handling
- **User Input Validation** - XSS prevention

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- **ESLint** - Follow React best practices
- **Prettier** - Consistent code formatting
- **Component Structure** - Functional components with hooks
- **CSS Organization** - Modular, reusable styles

## 📈 Future Roadmap

- [ ] **Video Streaming** - In-app video player
- [ ] **Offline Support** - Progressive Web App features
- [ ] **Recommendations** - AI-powered content suggestions
- [ ] **Social Features** - User reviews and ratings
- [ ] **Download Management** - Progress tracking
- [ ] **Multi-language Support** - Internationalization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Netflix** - UI/UX inspiration
- **TMDB** - Movie and TV show metadata
- **React Team** - Amazing framework
- **Supabase** - Backend infrastructure
- **Open Source Community** - Tools and inspiration

---

<div align="center">
  <strong>🎬 Built with ❤️ for streaming enthusiasts</strong>
  <br>
  <sub>CineCue - Your personal Netflix, powered by Google Sheets</sub>
</div>
