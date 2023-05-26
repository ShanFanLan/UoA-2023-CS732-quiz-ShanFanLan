import { Link, useNavigate } from "react-router-dom";
import UsernamePasswordForm from "../components/UsernamePasswordForm";
import { createAccount } from "../api/api";
import { useAuth } from "../components/Auth";

/**
 * Displays a form allowing the user to create an account. If they do, will attempt to register via the API.
 * If successful, will redirect the user to the homepage. Otherwise, an error message will be displayed.
 * 
 * In addition, contains a link to the login page in case the user already has an account.
 */
export default function RegisterPage() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(username, password) {
    createAccount(username, password)
      .then((res) => {
        setToken(res.data.token);
        navigate("/", { replace: true });
      })
      .catch(() => alert("Error when creating account!"));
  }

  return (
    <div>
      <h1>Create an account</h1>
      <UsernamePasswordForm buttonText="Create account" onSubmit={handleSubmit} />
      <p>
        Already have an account? <Link to="/login">Click here to log in!</Link>
      </p>
    </div>
  );
}
