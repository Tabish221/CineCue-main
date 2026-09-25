import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import MyList from "./pages/MyList";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Donate from "./pages/Donate";
import SearchResults from "./pages/SearchResults";
import Auth from "./pages/Auth";
import SignUp from "./pages/SignUp";
import { supabase } from "./supabaseClient";
import { MovieListProvider } from "./context/MovieListContext";
import { SeriesProvider } from "./context/SeriesContext";
import { AuthProvider } from "./context/AuthContext";

// Wrapper component to use location
import SuggestMovieModal from "./components/SuggestMovieModal";
import { useAuth } from "./context/AuthContext";

// Wrapper component to use location
function AppContent() {
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const { user, showSuggestMovieModal, setShowSuggestMovieModal } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // No need to set user here as AuthProvider does it
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handler for search in Navbar
  const handleGlobalSearch = (query) => {
    setGlobalSearchQuery(query);
  };

  const clearSearch = () => {
    setGlobalSearchQuery("");
  };

  return (
    <>
      {showSuggestMovieModal && (
        <SuggestMovieModal onClose={() => setShowSuggestMovieModal(false)} />
      )}

      {/* Desktop Navbar - Hidden on mobile */}
      <div className="hidden md:block">
        <Navbar
          onSearch={handleGlobalSearch}
          searchQuery={globalSearchQuery}
          onClearSearch={clearSearch}
          user={user}
        />
      </div>

      {/* Mobile Navbar - Hidden on desktop */}
      <div className="block md:hidden">
        <MobileNavbar
          onSearch={handleGlobalSearch}
          searchQuery={globalSearchQuery}
          onClearSearch={clearSearch}
          user={user}
          onAuthClick={() => {}}
        />
      </div>

      <div className={`app ${globalSearchQuery ? "search-active" : ""}`}>
        <Routes>
          <Route
            path="/"
            element={<Home globalSearchQuery={globalSearchQuery} />}
          />
          <Route
            path="/movies"
            element={<Movies globalSearchQuery={globalSearchQuery} />}
          />
          <Route
            path="/tv-shows"
            element={
              <TVShows globalSearchQuery={globalSearchQuery} user={user} />
            }
          />
          <Route path="/my-list" element={<MyList />} />
          <Route
            path="/search"
            element={
              <SearchResults
                searchQuery={globalSearchQuery}
                onClearSearch={clearSearch}
                user={user}
              />
            }
          />
          <Route
            path="/auth"
            element={
              <div className="auth-wrapper">
                <Auth />
              </div>
            }
          />
          <Route
            path="/signup"
            element={
              <div className="auth-wrapper">
                <SignUp />
              </div>
            }
          />
          <Route path="/help" element={<Help />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/donate" element={<Donate />} />
        </Routes>
        {!location.pathname.includes("auth") &&
          !location.pathname.includes("signup") && <Footer />}
      </div>
    </>
  );
}

// Main App component with Router
function App() {
  return (
    <AuthProvider>
      <MovieListProvider>
        <SeriesProvider>
          <Router>
            <AppContent />
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: "#363636",
                  color: "#fff",
                },
                success: {
                  duration: 2000,
                  iconTheme: {
                    primary: "#e50914",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </Router>
        </SeriesProvider>
      </MovieListProvider>
    </AuthProvider>
  );
}

export default App;
