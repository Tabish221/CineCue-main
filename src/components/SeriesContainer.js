import React, { useState } from "react";
import SeriesCard from "./SeriesCard";
import LoadingCard from "./LoadingCard";
import SeriesModal from "./SeriesModal";
import { useAuth } from "../context/AuthContext";

const SeriesContainer = ({
  series,
  viewMode,
  isLoading,
  onSeriesClick,
  user,
}) => {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;

  return (
    <div className={`series-container ${viewMode}`}>
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <LoadingCard key={index} />
          ))
        : series.map((seriesItem, index) => (
            <SeriesCard
              key={index}
              {...seriesItem}
              viewMode={viewMode}
              onClick={() =>
                onSeriesClick
                  ? onSeriesClick(seriesItem)
                  : setSelectedSeries(seriesItem)
              }
              user={currentUser}
            />
          ))}

      {selectedSeries && (
        <SeriesModal
          series={selectedSeries}
          isOpen={true}
          onClose={() => setSelectedSeries(null)}
          user={currentUser}
        />
      )}
    </div>
  );
};

export default SeriesContainer;
