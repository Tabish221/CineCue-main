import React from "react";
import { Filter, Calendar, Globe } from "lucide-react";
import FilterDropdown from "./FilterDropdown";

const ControlsSection = ({
  query,
  setQuery,
  filteredMoviesCount,
  genres,
  years,
  languages,
  selectedGenre,
  setSelectedGenre,
  selectedYear,
  setSelectedYear,
  selectedLanguage,
  setSelectedLanguage,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  pageType = "home",
}) => {
  const getSortOptions = () => {
    if (pageType === "tv-shows") {
      return ["Title (A-Z)", "Title (Z-A)", "Most Episodes", "Most Seasons"];
    }
    return [
      "Title (A-Z)",
      "Rating (High → Low)",
      "Year (Newest)",
      "Recently Uploaded",
    ];
  };

  const getSectionTitle = () => {
    if (query) return `Search Results for "${query}"`;
    if (pageType === "movies") return "All Movies";
    if (pageType === "tv-shows") return "All TV Shows";
    return "Latest Movies";
  };

  const getItemLabel = () => {
    if (pageType === "tv-shows") return "series";
    if (pageType === "movies") return "movies";
    return "items";
  };

  return (
    <div className="controls-section">
      <div className="controls-left">
        <h2 className="section-title">
          {getSectionTitle()}
          <span className="results-count">
            ({filteredMoviesCount} {getItemLabel()})
          </span>
        </h2>
      </div>

      <div className="controls-right">
        <div className="filters">
          <FilterDropdown
            label="Genre"
            options={genres}
            value={selectedGenre}
            onChange={setSelectedGenre}
            icon={Filter}
          />

          <FilterDropdown
            label="Year"
            options={years}
            value={selectedYear}
            onChange={setSelectedYear}
            icon={Calendar}
          />

          <FilterDropdown
            label="Language"
            options={languages}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            icon={Globe}
          />

          <FilterDropdown
            label="Sort By"
            options={getSortOptions()}
            value={sortBy}
            onChange={setSortBy}
            icon={Filter}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlsSection;
