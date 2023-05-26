import React, { useContext } from "react";
import jwtDecode from "jwt-decode";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Navigate } from "react-router-dom";

// Context for storing auth info. Not "public" as we want to control access to this (through the below components / hooks).
const AuthContext = React.createContext(null);

/**
 * A hook that can return some useful info about whether we're authenticated.
 * Can also be used to update the auth token, through setToken.
 */
export function useAuth() {
  const { token, setToken } = useContext(AuthContext);

  let isExpired, user;
  try {
    const decodedToken = jwtDecode(token);
    isExpired = isTokenExpired(decodedToken);
    user = {
      _id: decodedToken._id,
      username: decodedToken.username,
    };
    if (isExpired) setToken(null);
  } catch (err) {
    // console.log(err);
    isExpired = true;
    user = null;
  }

  const isAuthenticated = !isExpired && user != null;

  return { token, setToken, user, isExpired, isAuthenticated };
}

/**
 * Hides most of the useAuth() functionality, just returning the user (which will be null if not authenticated).
 * Use when you don't need all the extra functionality.
 */
export function useUser() {
  const { user } = useAuth();
  return user;
}

/**
 * Wrap your app in this provider to enable auth functionality.
 */
export function AuthContextProvider({ children }) {
  const [token, setToken] = useLocalStorage("authToken", null);

  return <AuthContext.Provider value={{ token, setToken }}>{children}</AuthContext.Provider>;
}

/**
 * A component which can wrap other components, which will be rendered if we're authenticated.
 * If we're not authenticated, we'll navigate to another path - /login by default but can be configured.
 */
export function RequiresAuth({ navigatePathWhenNotAuth, children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return children;
  return <Navigate to={navigatePathWhenNotAuth || "/login"} />;
}

/**
 * A component which can wrap other components, which will be rendered if we're NOT authenticated.
 * If we ARE authenticated, we'll navigate to another path - / by default but can be configured.
 */
export function RequiresNonAuth({ navigatePathWhenAuth, children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return children;
  return <Navigate to={navigatePathWhenAuth || "/"} />;
}

// Returns true if the token is expired, false otherwise. If invalid token, returns null.
function isTokenExpired(decodedToken) {
  const dateNow = new Date();
  return new Date(decodedToken.exp * 1000) < dateNow;
}
