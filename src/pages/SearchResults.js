import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import PageHeader from "../components/PageHeader";
import ControlsSection from "../components/ControlSection";
import MoviesContainer from "../components/MoviesContainer";
import NoResults from "../components/NoResults";

const SHEET_CSV_URL = process.env.REACT_APP_SHEET_CSV_URL;

const SearchResults = ({ searchQuery, onClearSearch, user }) => {
  const [allContent, setAllContent] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("Year (Newest)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    if (!SHEET_CSV_URL || SHEET_CSV_URL === "your_csv_url_here") {
      console.warn(
        "CSV URL not configured. Please set REACT_APP_SHEET_CSV_URL in your .env file"
      );
      setAllContent([]);
      setIsLoading(false);
      return;
    }

    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        const contentList = results.data.map((row) => ({
          title: row["Clean Title"],
          poster: row["Poster"],
          preview: row["Preview Link"],
          download: row["Download Link"],
          year: row["Year"] || row["Release Year"],
          rating: row["Rating"] || row["IMDb Rating"],
          genre: row["Genre"] || row["Genres"],
          language: row["Language"] || row["Languages"],
          duration: row["Duration"] || row["Runtime"],
          type: row["Type"] || "movie",
          description:
            row["Description"] ||
            row["Plot"] ||
            row["Synopsis"] ||
            row["Overview"] ||
            "An exciting movie experience awaits you with captivating storytelling and memorable characters.",
        }));
        setAllContent(contentList);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        setAllContent([]);
        setIsLoading(false);
      },
    });
  }, []);

  // Get unique values for filters
  const genres = [
    ...new Set(
      allContent
        .flatMap((item) => (item.genre ? item.genre.split(",") : []))
        .map((genre) => genre.trim())
        .filter(Boolean)
    ),
  ];

  const years = [
    ...new Set(allContent.map((item) => item.year).filter(Boolean)),
  ].sort((a, b) => b - a);

  const languages = [
    ...new Set(
      allContent
        .flatMap((item) => (item.language ? item.language.split(",") : []))
        .map((language) => language.trim())
        .filter(Boolean)
    ),
  ];

  // Filter and sort content
  let filteredContent = allContent.filter((item) => {
    const matchesSearch = searchQuery
      ? item.title?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesGenre =
      !selectedGenre ||
      item.genre?.toLowerCase().includes(selectedGenre.toLowerCase());
    const matchesYear = !selectedYear || item.year === selectedYear;
    const matchesLanguage =
      !selectedLanguage ||
      item.language?.toLowerCase().includes(selectedLanguage.toLowerCase());

    return matchesSearch && matchesGenre && matchesYear && matchesLanguage;
  });

  // Sort content
  if (sortBy === "Title (A-Z)") {
    filteredContent.sort((a, b) => a.title?.localeCompare(b.title) || 0);
  } else if (sortBy === "Rating (High → Low)") {
    filteredContent.sort(
      (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)
    );
  } else if (sortBy === "Year (Newest)") {
    filteredContent.sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (sortBy === "Recently Uploaded") {
    filteredContent = [...filteredContent];
  }

  return (
    <>
      <PageHeader
        title="Search Results"
        subtitle={
          searchQuery
            ? `Results for "${searchQuery}"`
            : "Search our entire catalog"
        }
        itemCount={filteredContent.length}
      />

      <ControlsSection
        query={searchQuery}
        filteredMoviesCount={filteredContent.length}
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
        pageType="search"
        hideSearch={true}
      />

      <MoviesContainer
        movies={filteredContent}
        viewMode={viewMode}
        isLoading={isLoading}
        user={user}
      />

      {filteredContent.length === 0 && searchQuery && (
        <NoResults query={searchQuery} />
      )}
    </>
  );
};

export default SearchResults;
