"use client";

import { type Accessor, type JSX, createContext, createEffect, createSignal, useContext } from "solid-js";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Accessor<Theme>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider(props: {
  children: JSX.Element;
}) {
  const [theme, setTheme] = createSignal<Theme>("dark");
  const [isInitialized, setIsInitialized] = createSignal(false);

  createEffect(() => {
    // This code will only run on the client side
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = savedTheme || getInitialTheme(); // Default to light theme

    setTheme(initialTheme);
    setIsInitialized(true);
  });

  createEffect(() => {
    if (isInitialized()) {
      localStorage.setItem("theme", theme());
      if (theme() === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{props.children}</ThemeContext.Provider>;
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
