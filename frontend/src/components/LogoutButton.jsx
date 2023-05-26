import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import { Button } from 'antd';



/**
 * A button which logs the user out when clicked.
 */
export default function LogoutButton() {
  const { setToken } = useAuth();
  const navigate = useNavigate();

  function handleClick() {
    setToken(null);
    navigate("/login");
  }

  return (
    <div>
    <Button type="primary" onClick={handleClick} 
    style={{width:"6rem"}} >Log out</Button>
    </div>
  )
}
