import { loginConGoogle } from "./firebase";
import { logout } from "./firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TweetWritingArea = ({
  user,
  tweet,
  handleInputChange,
  sendTweet,
  disabled,
}) => {
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
    <div className="tweet-writing-area">
      {console.log("user is " + user)}
      {user ? (
        <>
          <div className="user-profile">
            <img
              className="user-profile-pic"
              src={user.photoURL}
              alt="User profile pic"
              referrerPolicy="no-referrer" // Lo añado para que se muestre la img
            />
          </div>
          <p className="greeting">¡Hi, {user.displayName}!</p>
        </>
      ) : (
        <div className="user-profile">
          <button className="btn btn-log" onClick={loginConGoogle}>
            Login con Google
          </button>
        </div>
      )}

      <form>
        <textarea
          name="tweet" // mismo nombre que la propiedad del objeto
          className="textarea"
          type="text"
          placeholder="What's happening?"
          value={tweet.tweet}
          onChange={handleInputChange}
        />
        <div className="tweet-length-counter">
          <span>{tweet.tweet.length}</span>
          <span>200 Max.</span>
        </div>
        {tweet.tweet.length > 0 && (
          <div className="under-textarea">
            <input
              className="btn btn-send"
              type="button"
              value="Post"
              onClick={sendTweet}
              disabled={disabled}
            />
          </div>
        )}
      </form>
    </div>
  );
};

export default TweetWritingArea;
