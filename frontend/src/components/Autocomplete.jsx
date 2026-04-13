import React, { useState, useRef, useEffect } from "react";

function Autocomplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debounceTimeout = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    setIsFocused(true);

    if (value.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/search?q=${encodeURIComponent(value)}`);
        const data = await res.json();

        const formatted = data.map((item, index) => ({
          id: index,
          fullAddress: `${item.village_name}, ${item.subdistrict_name}, ${item.district_name}, ${item.state_name}`,
          hierarchy: {
            village: item.village_name,
            subDistrict: item.subdistrict_name,
            district: item.district_name,
            state: item.state_name
          }
        }));

        setResults(formatted);
      } catch (err) {
        console.error("ERROR:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    }, 300);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery(item.fullAddress);
    setResults([]);
    setHasSearched(false);
    setIsFocused(false);
  };

  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <strong key={index} style={{ color: "#3b82f6", fontWeight: "700" }}>{part}</strong>
      ) : (
        part
      )
    );
  };

  const showDropdown = isFocused && (isLoading || hasSearched || results.length > 0);

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Embedded CSS for pseudo-classes and animations to keep the component portable */}
      <style>
        {`
          .autocomplete-input {
            width: 100%;
            padding: 14px 16px;
            font-size: 16px;
            color: #1e293b;
            background-color: #fff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            outline: none;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            box-sizing: border-box;
          }
          .autocomplete-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }
          .autocomplete-input::placeholder {
            color: #94a3b8;
          }
          .autocomplete-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            list-style: none;
            padding: 8px 0;
            margin: 0;
            max-height: 320px;
            overflow-y: auto;
            z-index: 50;
            animation: fadeIn 0.2s ease-out;
          }
          .autocomplete-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background-color 0.15s ease;
          }
          .autocomplete-item:hover {
            background-color: #f1f5f9;
          }
          .autocomplete-empty, .autocomplete-loading {
            padding: 16px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
          .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #e2e8f0;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          /* Custom Scrollbar for better UI */
          .autocomplete-dropdown::-webkit-scrollbar {
            width: 6px;
          }
          .autocomplete-dropdown::-webkit-scrollbar-track {
            background: transparent;
          }
          .autocomplete-dropdown::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 10px;
          }
        `}
      </style>

      <input
        type="text"
        className="autocomplete-input"
        placeholder="Search for a village..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />

      {showDropdown && query.trim().length >= 2 && (
        <ul className="autocomplete-dropdown">
          {isLoading && (
            <li className="autocomplete-loading">
              <span className="loading-spinner"></span>
              Searching...
            </li>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <li className="autocomplete-empty">
              No results found for "<strong>{query}</strong>"
            </li>
          )}

          {!isLoading && results.length > 0 && results.map((item) => (
            <li
              key={item.id}
              className="autocomplete-item"
              onClick={() => handleSelect(item)}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", color: "#1e293b" }}>
                  {highlightText(item.hierarchy.village, query)}
                </span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>
                  {highlightText(item.hierarchy.subDistrict, query)}, {" "}
                  {highlightText(item.hierarchy.district, query)}, {" "}
                  {item.hierarchy.state}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;