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
  const MAX_TWITTER_LENGTH = 200;

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
        <div className="flex-container">
          <textarea
            name="tweet" // mismo nombre que la propiedad del objeto
            className="textarea"
            type="text"
            placeholder="What's happening?"
            value={tweet.tweet}
            onChange={handleInputChange}
          />
          <input
            className="btn btn-send"
            type="button"
            value="Post"
            onClick={sendTweet}
            disabled={disabled}
          />
        </div>
        <div className="tweet-length-counter">
          {/* Si faltan 50 chars, avisamos al user */}
          {MAX_TWITTER_LENGTH - tweet.tweet.length <= 50 && (
            <span>{MAX_TWITTER_LENGTH - tweet.tweet.length}</span>
          )}
          {MAX_TWITTER_LENGTH - tweet.tweet.length <= 0 && (
            <span>200 chars exceeded!</span>
          )}
        </div>
        {tweet.tweet.length > 0 && (
          <div className="under-textarea">
            {/* <input
              className="btn btn-send"
              type="button"
              value="Post"
              onClick={sendTweet}
              disabled={disabled}
            /> */}
          </div>
        )}
      </form>
    </div>
  );
};

export default TweetWritingArea;
