import React from "react";

const NoResults = ({ query }) => {
  return (
    <div className="no-results">
      <h3>No movies found for "{query}"</h3>
    </div>
  );
};

export default NoResults;
