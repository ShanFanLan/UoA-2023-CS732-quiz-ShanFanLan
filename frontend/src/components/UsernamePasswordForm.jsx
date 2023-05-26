import { useState } from "react";

/**
 * Allows the user to enter a username and password. When the "submit" button
 * is clicked, raises its onSubmit event, supplying the entered username and
 * password. Button text can be customized using the buttonText prop.
 */
export default function UsernamePasswordForm({ buttonText, onSubmit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(username, password);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="txtUsername">Username:</label>
      <input
        type="text"
        id="txtUsername"
        name="username"
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="txtPassword">Password:</label>
      <input
        type="password"
        id="txtPassword"
        name="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">{buttonText || "Submit"}</button>
    </form>
  );
}
