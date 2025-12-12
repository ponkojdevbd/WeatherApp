import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { searchCities, type City } from "../utils/api";

interface SearchBarProps {
  onCitySelect: (city: City) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    onCitySelect(city);
    setQuery(`${city.name}, ${city.country}`);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-50">
      <div className="relative flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30 transition-all focus-within:bg-white/30 focus-within:shadow-xl">
        <FaSearch className="text-white/80 mr-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="w-full bg-transparent border-none outline-none text-white placeholder-white/70 font-medium"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden max-h-60 overflow-y-auto">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSelect(city)}
              className="px-4 py-3 hover:bg-white/20 cursor-pointer flex items-center text-white transition-colors border-b border-white/10 last:border-none"
            >
              <FaMapMarkerAlt className="mr-3 text-white/70" />
              <div className="flex flex-col">
                <span className="font-semibold">{city.name}</span>
                <span className="text-xs text-white/70">
                  {city.admin1 ? `${city.admin1}, ` : ""}
                  {city.country}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
