import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import ControlsSection from "../components/ControlSection";
import SeriesContainer from "../components/SeriesContainer";
import NoResults from "../components/NoResults";
import PageHeader from "../components/PageHeader";

// Use a separate environment variable for series CSV URL
const SERIES_CSV_URL =
  process.env.REACT_APP_SERIES_CSV_URL || process.env.REACT_APP_SHEET_CSV_URL;

const TVShows = ({ globalSearchQuery = "", user }) => {
  const [series, setSeries] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortBy, setSortBy] = useState("Title (A-Z)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    console.log("Series CSV URL:", SERIES_CSV_URL); // Debug log

    if (!SERIES_CSV_URL || SERIES_CSV_URL === "your_csv_url_here") {
      console.warn(
        "Series CSV URL not configured. Please set REACT_APP_SERIES_CSV_URL or REACT_APP_SHEET_CSV_URL in your .env file"
      );
      setSeries([]);
      setIsLoading(false);
      return;
    }

    Papa.parse(SERIES_CSV_URL, {
      download: true,
      header: true,
      complete: (results) => {
        console.log("CSV Parse Complete!"); // Debug log
        console.log("Raw CSV data:", results.data); // Debug log
        console.log("CSV has", results.data.length, "rows"); // Debug log

        // Group series data by series name
        const seriesMap = new Map();

        results.data.forEach((row, index) => {
          console.log(`Row ${index}:`, row); // Debug log

          const seriesName = row["Series"];
          const season = row["Season"];
          const episode = row["Episode"]; // Pretty episode format (E01, E02, etc.)
          const fileName = row["File Name"];
          const fileURL = row["File URL"];
          const posterURL = row["Poster URL"]; // New TMDB poster!
          const fileSize = row["File Size"];
          const dateAdded = row["Date Added"];
          const seasonNumber = row["Season Number"];
          const episodeNumber = row["Episode Number"];
          const previewURL = row["Preview URL"]; // For advanced version

          // Additional CSV columns for episode data
          const episodeThumbnail = row["Episode Thumbnail"];
          const episodeDescription = row["Episode Description"];
          const episodeName = row["Episode Name"];
          const airDate = row["Air Date"];
          const runtimeMin = row["Runtime (min)"];
          const tmdbRating = row["TMDB Rating"];

          if (!seriesName || !season || !episode) {
            console.log(`Skipping row ${index}: missing required data`);
            return;
          }

          if (!seriesMap.has(seriesName)) {
            seriesMap.set(seriesName, {
              title: seriesName,
              poster: posterURL || null, // Use TMDB poster!
              seasonsData: new Map(),
              totalSeasons: 0,
              totalEpisodes: 0,
              latestSeason: 0,
              episodes: [],
              dateAdded: dateAdded, // Track when series was added
            });
          }

          const seriesData = seriesMap.get(seriesName);

          // Use the season/episode numbers from your script if available, otherwise parse
          let seasonNum = seasonNumber ? parseInt(seasonNumber) : 1;
          let episodeNum = episodeNumber ? parseInt(episodeNumber) : 1;

          // Fallback parsing if numbers aren't provided
          if (!seasonNumber) {
            const seasonMatch = season.match(/(\d+)/);
            if (seasonMatch) seasonNum = parseInt(seasonMatch[1]);
          }

          if (!episodeNumber) {
            // Extract from episode string or filename
            const episodePatterns = [
              /[eE](\d+)/, // E01, e01
              /[sS]\d+[eE](\d+)/, // S01E01
              /[eE]pisode[.\s]*(\d+)/i, // Episode 01
              /(\d+)/, // Any number
            ];

            for (const pattern of episodePatterns) {
              const match = (episode || fileName).match(pattern);
              if (match) {
                episodeNum = parseInt(match[1]);
                break;
              }
            }
          }

          console.log(
            `Parsed - Series: ${seriesName}, Season: ${seasonNum}, Episode: ${episodeNum}, Poster: ${
              posterURL ? "Yes" : "No"
            }`
          );

          // Track seasons
          if (!seriesData.seasonsData.has(seasonNum)) {
            seriesData.seasonsData.set(seasonNum, {
              season: seasonNum,
              episodes: [],
            });
            seriesData.totalSeasons++;
          }

          // Add episode to season with enhanced data
          const episodeData = {
            season: seasonNum,
            episode: episodeNum,
            title: episode, // Pretty episode format (E01)
            fileName: fileName,
            download: fileURL,
            preview: previewURL || fileURL, // Use preview URL if available, fallback to file URL
            fileSize: fileSize,
            dateAdded: dateAdded,
            // Include all CSV column data
            "Episode Thumbnail": episodeThumbnail,
            "Episode Description": episodeDescription,
            "Episode Name": episodeName,
            "Air Date": airDate,
            "Runtime (min)": runtimeMin,
            "TMDB Rating": tmdbRating,
          };

          seriesData.seasonsData.get(seasonNum).episodes.push(episodeData);
          seriesData.totalEpisodes++;
          seriesData.latestSeason = Math.max(
            seriesData.latestSeason,
            seasonNum
          );
          seriesData.episodes.push(episodeData);
        });

        // Convert to array and sort seasons/episodes
        const seriesList = Array.from(seriesMap.values()).map((series) => {
          // Convert seasons map to sorted array
          series.seasonsData = Array.from(series.seasonsData.values()).sort(
            (a, b) => a.season - b.season
          );

          // Sort episodes within each season
          series.seasonsData.forEach((season) => {
            season.episodes.sort((a, b) => a.episode - b.episode);
          });

          // Sort all episodes
          series.episodes.sort((a, b) => {
            if (a.season === b.season) {
              return a.episode - b.episode;
            }
            return a.season - b.season;
          });

          return series;
        });

        console.log("Processed series data:", seriesList); // Debug log
        console.log("Setting", seriesList.length, "series"); // Debug log
        setSeries(seriesList);
        setIsLoading(false);
      },
      error: (error) => {
        console.error("Error parsing Series CSV:", error);
        console.error("CSV URL:", SERIES_CSV_URL);
        setSeries([]);
        setIsLoading(false);
      },
    });
  }, []);

  // Clear filters when search is active
  useEffect(() => {
    if (globalSearchQuery) {
      setSelectedGenre("");
    }
  }, [globalSearchQuery]);

  // Unique genres - for now using series names as categories
  const genres = [...new Set(series.map((show) => show.title).filter(Boolean))];

  // Filter series with same logic as Movies page
  let filteredSeries = series.filter((show) => {
    const matchesSearch = globalSearchQuery
      ? show.title?.toLowerCase().includes(globalSearchQuery.toLowerCase())
      : true;
    const matchesGenre =
      !selectedGenre ||
      show.title?.toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  // Debug logging
  console.log("TV Shows Debug:");
  console.log("globalSearchQuery:", globalSearchQuery);
  console.log("Total series:", series.length);
  console.log("Series titles:", series.map((s) => s.title).slice(0, 5));
  console.log("Filtered series:", filteredSeries.length);
  console.log(
    "Filtered titles:",
    filteredSeries.map((s) => s.title).slice(0, 5)
  );

  // Sort series
  if (sortBy === "Title (A-Z)") {
    filteredSeries.sort((a, b) => a.title?.localeCompare(b.title) || 0);
  } else if (sortBy === "Title (Z-A)") {
    filteredSeries.sort((a, b) => b.title?.localeCompare(a.title) || 0);
  } else if (sortBy === "Most Episodes") {
    filteredSeries.sort((a, b) => b.totalEpisodes - a.totalEpisodes);
  } else if (sortBy === "Most Seasons") {
    filteredSeries.sort((a, b) => b.totalSeasons - a.totalSeasons);
  }

  const getPageTitle = () => {
    if (globalSearchQuery) return "TV Show Search Results";
    return "TV Shows";
  };

  const getPageSubtitle = () => {
    if (globalSearchQuery) return `Results for "${globalSearchQuery}"`;
    return "Binge-watch your favorite series";
  };

  return (
    <>
      {!globalSearchQuery && (
        <PageHeader
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          itemCount={series.length}
        />
      )}

      <ControlsSection
        query={globalSearchQuery}
        filteredMoviesCount={filteredSeries.length}
        genres={genres}
        years={[]} // not available in CSV
        languages={[]} // not available in CSV
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedYear={""}
        setSelectedYear={() => {}}
        selectedLanguage={""}
        setSelectedLanguage={() => {}}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        pageType="tv-shows"
        hideSearch={true}
        isSearchActive={!!globalSearchQuery}
      />

      <SeriesContainer
        series={filteredSeries}
        viewMode={viewMode}
        isLoading={isLoading}
        user={user}
      />

      {filteredSeries.length === 0 && !isLoading && (
        <div
          style={{
            padding: "2rem 4%",
            textAlign: "center",
            minHeight: "50vh",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "3rem",
              borderRadius: "12px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
              {globalSearchQuery
                ? `No TV shows found for "${globalSearchQuery}"`
                : "No TV shows available"}
            </h2>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#ccc",
                marginBottom: "1.5rem",
              }}
            >
              {globalSearchQuery
                ? "Try adjusting your search or filters"
                : "TV shows will appear here when they're added to your collection."}
            </p>
          </div>
        </div>
      )}

      {filteredSeries.length === 0 && globalSearchQuery && (
        <NoResults query={globalSearchQuery} />
      )}
    </>
  );
};

export default TVShows;
