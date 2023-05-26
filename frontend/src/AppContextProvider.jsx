import React from "react";

export const AppContext = React.createContext();

/**
 * A component which provides application-wide context info to children.
 *
 * NOTE: Currently unused, but you're welcome to use it in your solution if you like
 * (you don't have to).
 */
export default function AppContextProvider({ children }) {
  const context = {};

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
