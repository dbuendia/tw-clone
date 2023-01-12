import { loginConGoogle } from "./firebase";

const TweetWritingArea = ({
  user,
  tweet,
  handleInputChange,
  sendTweet,
  disabled,
}) => {
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
        <textarea
          name="tweet" // mismo nombre que la propiedad del objeto
          className="textarea"
          type="text"
          placeholder="What's happening?"
          value={tweet.tweet}
          onChange={handleInputChange}
          id="dani"
        />
        <div className="under-textarea">
          <input
            className="btn btn-send"
            type="button"
            value="Send"
            onClick={sendTweet}
            disabled={disabled}
          />
        </div>
      </form>
    </div>
  );
};

export default TweetWritingArea;
