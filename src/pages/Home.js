import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import HeroSection from "../components/HeroSection";
import ControlsSection from "../components/ControlSection";
import MoviesContainer from "../components/MoviesContainer";
import NoResults from "../components/NoResults";

import MovieModal from "../components/MovieModal";
import { supabase } from "../supabaseClient";

const SHEET_CSV_URL = process.env.REACT_APP_SHEET_CSV_URL;

const Home = ({ globalSearchQuery = "" }) => {
  const [movies, setMovies] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("Year (Newest)");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (!SHEET_CSV_URL || SHEET_CSV_URL === "your_csv_url_here") {
      console.warn(
        "CSV URL not configured. Please set REACT_APP_SHEET_CSV_URL in your .env file"
      );
      setMovies([]);
      setIsLoading(false);
      return;
    }

    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const movieList = results.data.map((row) => ({
          title: row["Clean Title"],
          poster: row["Poster"],
          preview: row["Preview Link"],
          download: row["Download Link"],
          year: row["Year"] || row["Release Year"],
          rating: row["Rating"] || row["IMDb Rating"],
          genre: row["Genre"] || row["Genres"],
          language: row["Language"] || row["Languages"],
          duration: row["Duration"] || row["Runtime"],
          trailer: row["Trailer"],
          description:
            row["Description"] ||
            row["Plot"] ||
            row["Synopsis"] ||
            row["Overview"] ||
            "An exciting movie experience awaits you with captivating storytelling and memorable characters.",
        }));
        setMovies(movieList);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setMovies([]);
        setIsLoading(false);
      },
    });
  }, []);

  // Clear filters when search is active
  useEffect(() => {
    if (globalSearchQuery) {
      setSelectedGenre("");
      setSelectedYear("");
      setSelectedLanguage("");
    }
  }, [globalSearchQuery]);

  // Get unique values for filters
  const genres = [
    ...new Set(
      movies
        .flatMap((movie) => (movie.genre ? movie.genre.split(",") : []))
        .map((genre) => genre.trim())
        .filter(Boolean)
    ),
  ];

  const years = [
    ...new Set(movies.map((movie) => movie.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  const languages = [
    ...new Set(
      movies
        .flatMap((movie) => (movie.language ? movie.language.split(",") : []))
        .map((language) => language.trim())
        .filter(Boolean)
    ),
  ];

  // Filter and sort movies
  let filteredMovies = movies.filter((movie) => {
    const matchesSearch = globalSearchQuery
      ? movie.title?.toLowerCase().includes(globalSearchQuery.toLowerCase())
      : true;
    const matchesGenre =
      !selectedGenre ||
      movie.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
    const matchesYear = !selectedYear || movie.year === selectedYear;
    const matchesLanguage =
      !selectedLanguage ||
      movie.language?.toLowerCase().includes(selectedLanguage.toLowerCase());

    return matchesSearch && matchesGenre && matchesYear && matchesLanguage;
  });

  // Sort movies
  if (sortBy === "Title (A-Z)") {
    filteredMovies.sort((a, b) => a.title?.localeCompare(b.title) || 0);
  } else if (sortBy === "Rating (High → Low)") {
    filteredMovies.sort(
      (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
    );
  } else if (sortBy === "Year (Newest)") {
    filteredMovies.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (sortBy === "Recently Uploaded") {
    filteredMovies = [...filteredMovies];
  }
  const handleOpenModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  return (
    <>
      {!globalSearchQuery && (
        <HeroSection movieCount={movies.length} genreCount={genres.length} />
      )}

      <ControlsSection
        query={globalSearchQuery}
        filteredMoviesCount={filteredMovies.length}
        genres={genres}
        years={years}
        languages={languages}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        hideSearch={true}
        isSearchActive={!!globalSearchQuery}
      />

      <MoviesContainer
        movies={filteredMovies}
        viewMode={viewMode}
        isLoading={isLoading}
        onMovieClick={handleOpenModal}
      />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={user}
        />
      )}

      {filteredMovies.length === 0 && globalSearchQuery && (
        <NoResults query={globalSearchQuery} />
      )}
    </>
  );
};

export default Home;
