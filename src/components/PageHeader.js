import React from "react";

const PageHeader = ({ title, subtitle, itemCount }) => {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
        {itemCount !== undefined && (
          <div className="page-stats">
            <span className="stat-number">{itemCount}</span>
            <span className="stat-label">
              {itemCount === 1 ? "Item" : "Items"} Available
            </span>
          </div>
        )}
      </div>
      <div className="page-header-gradient"></div>
    </div>
  );
};

export default PageHeader;
