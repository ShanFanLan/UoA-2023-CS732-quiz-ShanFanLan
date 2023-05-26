import { Route, Routes } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import { RequiresAuth, RequiresNonAuth } from "./components/Auth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PokemonPage from "./pages/PokemonPage";
import FavouritesPage from "./pages/FavouritesPage";

/**
 * Main app component. Controls the frontend routing.
 *
 * /           --> Homepage (only when authenticated)
 * /favourites --> Favourites page (only when authenticated) *** TODO Implement this!
 * /login      --> Login page (only when not authenticated)
 * /register   --> Account creation page (only when not authenticated)
 */
export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequiresAuth>
            <MainLayout />
          </RequiresAuth>
        }
      >
        <Route index element={<PokemonPage />} />
        <Route path="favourites" element={<FavouritesPage />} />
      </Route>

      <Route
        path="/login"
        element={
          <RequiresNonAuth>
            <LoginPage />
          </RequiresNonAuth>
        }
      />

      <Route
        path="/register"
        element={
          <RequiresNonAuth>
            <RegisterPage />
          </RequiresNonAuth>
        }
      />
    </Routes>
  );
}
