import logo from "./svg/logo.svg";
import googleBtn from "./svg/google-btn.svg";
import { loginConGoogle } from "./firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const goToTwitter = () => navigate("/tw");
    const goToLogin = () => navigate("/");

    if (user) {
      goToTwitter();
    } else {
      goToLogin();
    }
  }, [user]);

  return (
    <div className="login-page">
      <img src={logo}></img>
      <div>
        <h1 className="login-header">The Ultimate Tw Clone</h1>
        <p>
          Join a community of Lorem Ipsums just like
          <span className="beta"> you</span>.
        </p>

        <img
          className="login-google"
          onClick={loginConGoogle}
          src={googleBtn}
          alt="Log in with Google"
        />
        <footer className="login-footer">
          <small className="copyright">
            &copy; 2023 Devs_United - <span className="beta">BETA</span>
          </small>
        </footer>
      </div>
    </div>
  );
};

export default Login;
