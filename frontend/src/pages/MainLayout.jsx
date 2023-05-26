import { Link, Outlet } from "react-router-dom";
import { useUser } from "../components/Auth";
import LogoutButton from "../components/LogoutButton";
import { Button } from 'antd';

/**
 * Contains the "App bar" for the main authenticated app pages, including displaying the username,
 * the ability to logout, and links to all app sections.
 */
export default function MainLayout() {
  const { username } = useUser();

  return (
    <div>
      <h1>Pokemon Trader App</h1>
      <p>
        Hi {username}! View your <Link to="/">Pokemon</Link>, or check out everyone's favourites
        (not yet implemented)!
      </p>
      <LogoutButton />
      <hr />
      <Link to="/" style={{ alignSelf: 'flex-end' }}>
        <Button type="primary" 
         style={{width:"6rem"}} ghost danger>HomePage</Button>
      </Link>
      <Link to="/favourites" style={{ alignSelf: 'flex-end' }}>   
        <Button type="primary"  
        style={{width:"6rem", color:"green",borderColor:"green"}} ghost>Favourites</Button>
      </Link>
      <Outlet />
    </div>
  );
}
