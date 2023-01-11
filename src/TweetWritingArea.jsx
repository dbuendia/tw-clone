import { loginConGoogle } from "./firebase";
import test from "./svg/test.svg";

const TweetWritingArea = ({ user, tweet, handleInputChange, sendTweet }) => {
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
        </>
      ) : (
        <div className="user-profile">
          <button className="btn-log" onClick={loginConGoogle}>
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
        <div className="under-textarea">
          <input
            className="btn-send"
            type="button"
            value="Send"
            onClick={sendTweet}
          />
          <img src={test}></img>
        </div>
      </form>
    </div>
  );
};

export default TweetWritingArea;
