import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X, LogOut, Settings } from "lucide-react";
import logo from "../assets/cinecue-logo-transparent.png";
import { supabase } from "../supabaseClient";

const Navbar = ({ onSearch, searchQuery, onClearSearch, user }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null); // Add ref for input
  const location = useLocation();
  const navigate = useNavigate();

  // Sync local query with global search query
  useEffect(() => {
    setLocalQuery(searchQuery || "");
  }, [searchQuery]);

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery.trim());
      setIsFocused(false);

      // Navigate to search results page if we're not on a searchable page
      if (
        location.pathname !== "/" &&
        location.pathname !== "/movies" &&
        location.pathname !== "/tv-shows"
      ) {
        navigate("/search");
      }
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalQuery(value);

    // Real-time search on Home, Movies, and TV Shows pages
    if (
      location.pathname === "/" ||
      location.pathname === "/movies" ||
      location.pathname === "/tv-shows"
    ) {
      onSearch(value);
    }
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    onClearSearch();
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    } else if (e.key === "Escape") {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const getInitials = (user) => {
    if (!user?.email) return "U";
    return user.email
      .split("@")[0]
      .split(/[._-]/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isFocused ? "search-expanded" : ""}`}>
      <div className="navbar-left">
        <Link to="/" className="logo" onClick={onClearSearch}>
          <img src={logo} height={50} alt="CineCue Logo" />
        </Link>
        <ul className="nav-links">
          <li className={isActiveRoute("/") ? "active" : ""}>
            <Link to="/" onClick={onClearSearch}>
              Home
            </Link>
          </li>
          <li className={isActiveRoute("/movies") ? "active" : ""}>
            <Link to="/movies" onClick={onClearSearch}>
              Movies
            </Link>
          </li>
          <li className={isActiveRoute("/tv-shows") ? "active" : ""}>
            <Link to="/tv-shows" onClick={onClearSearch}>
              TV Shows
            </Link>
          </li>
          <li className={isActiveRoute("/my-list") ? "active" : ""}>
            <Link to="/my-list" onClick={onClearSearch}>
              My List
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div
            ref={searchContainerRef}
            className={`search-container ${isFocused ? "expanded" : ""}`}
          >
            <div
              className="search-icon"
              onClick={() => {
                setIsFocused(true);
                // Focus the input field after the state update
                setTimeout(() => {
                  if (searchInputRef.current) {
                    searchInputRef.current.focus();
                  }
                }, 100);
              }}
            >
              <Search size={20} strokeWidth={2.5} color="white" />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              className="search-input"
              placeholder="Search movies, TV shows..."
              value={localQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
            />

            {localQuery && isFocused && (
              <button
                type="button"
                className="search-clear"
                onClick={handleClearSearch}
              >
                <X size={16} color="white" />
              </button>
            )}
          </div>
        </form>

        <div className="navbar-auth">
          {user ? (
            <div
              className="user-profile"
              ref={dropdownRef}
              style={{ position: "relative" }}
            >
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  background: "#e50914",
                  width: "32px",
                  height: "32px",
                  borderRadius: "4px",
                  border: "none",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "16px",
                }}
              >
                {getInitials(user)}
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    background: "#141414",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "4px",
                    padding: "8px",
                    marginTop: "8px",
                    minWidth: "200px",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      padding: "8px 16px",
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ color: "#fff", fontSize: "14px" }}>
                      {user.email}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/my-list")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  >
                    <Settings size={16} />
                    My List
                  </button>

                  <button
                    onClick={handleSignOut}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "8px 16px",
                      background: "none",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                      textAlign: "left",
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
  
};

export default Navbar;
