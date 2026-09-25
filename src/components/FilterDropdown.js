import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const FilterDropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="filter-dropdown">
      <button className="filter-button" onClick={() => setIsOpen(!isOpen)}>
        <Icon size={16} />
        <span>{value || label}</span>
        <ChevronDown size={16} className={isOpen ? "rotated" : ""} />
      </button>

      {isOpen && (
        <div className="filter-options">
          <div
            className="filter-option"
            onClick={() => {
              onChange("");
              setIsOpen(false);
            }}
          >
            All {label}
          </div>
          {options.map((option, index) => (
            <div
              key={index}
              className="filter-option"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
