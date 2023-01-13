import logo from "./svg/logo.svg";
const Login = () => {
  return (
    <div className="login-page">
      <img src={logo}></img>
      <div>
        <h1>The Ultimate Tw Clone</h1>
        <p>Be united</p>
        <button>Log in</button>
      </div>
    </div>
  );
};

export default Login;
