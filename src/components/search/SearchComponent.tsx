import React, { useState, useMemo } from "react";
import { searchIcon } from "@/assets/images/searchIcon";
import { searchBar } from "@/assets/images/searchBar";
import styles from "@/components/search/SearchComponent.module.css";
import { Device } from "@/types/Types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { selectDevice } from "@/redux/slice/selectedDevice";
import { showPanel } from "@/redux/slice/isPanelOpen";
import { allDevicesSelector } from "@/redux/selectors/deviceSelector";
export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
   const [isSearchFocused, setIsSearchFocused] = useState(false);


  const dispatch = useDispatch<AppDispatch>();

  const fetchedDevices:Device[]|undefined = useSelector(allDevicesSelector);



  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const lowerCaseQuery = searchQuery.toLowerCase();
    return fetchedDevices
      .filter(device => 
        device.name.toLowerCase().includes(lowerCaseQuery) ||
        device.address.toLowerCase().includes(lowerCaseQuery)
      )
      .slice(0, 200);
  }, [searchQuery, fetchedDevices]);

  const handleResultClick = (device:Device) => {
    setSearchQuery(device.name);
    dispatch(showPanel(true));
    dispatch(selectDevice(device));
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <div className={styles.search}>
          {searchIcon}
          <input
            type="text"
            placeholder="Type address or device name..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
          />
          {searchBar}
        </div>
        
        {isSearchFocused && searchResults.length > 0 && (
          <div 
            className={`${styles.searchResultsDropdown} ${
              searchResults.length > 10 ? styles.scrollable : ''
            }`}
          >
            {searchResults.map((device) => (
              <div 
                key={device.id}
                className={styles.searchResult}
                onClick={() => handleResultClick(device)}
              >
                {device.name} - {device.address}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}