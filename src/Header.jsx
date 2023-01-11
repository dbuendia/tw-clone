import logo from "./svg/logo.svg";
import { logout } from "./firebase";

const Header = () => {
  return (
    <div className="header">
      <img className="logo" src={logo} />
      <button className="btn-log" onClick={logout}>
        Log out
      </button>
    </div>
  );
};

export default Header;
