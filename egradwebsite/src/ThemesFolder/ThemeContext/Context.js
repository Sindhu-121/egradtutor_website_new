import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
import BASE_URL from "../../../src/apiConfig.js";
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("");
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/themesSection/themeSelectedByAdmin`
        );
        if (!response.ok) {
          throw new Error(
            "Error occurred while getting the theme selected by admin"
          );
        }
        const data = await response.json(); // Parse the response as JSON
        setTheme(data);
      } catch (error) {
        console.error("Failed to fetch theme:", error);
      }
    };

    fetchTheme();
  }, []);

  return <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>;
};
