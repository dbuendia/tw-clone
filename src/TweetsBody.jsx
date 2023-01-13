import bin from "./svg/bin.svg";
import whiteHeart from "./svg/white-heart.svg";
import redHeart from "./svg/red-heart.svg";
import loadingIcon from "./svg/oval-loader.svg";

const TweetsBody = ({ tweets, likeTweet, user, deleteTweet, loading }) => {
  // Ordenamos los tweets por fecha
  tweets.sort(function (a, b) {
    return b.fecha - a.fecha;
  });

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <div className="tweets-body">
      {loading ? (
        <img src={loadingIcon}></img>
      ) : (
        <ul className="tw-container">
          {/* Si tweets no está vacío, lo recorremos para mostrarlo por UI */}
          {tweets
            ? tweets.map((elem) => {
                return (
                  <>
                    <div className="photo-tw-container" key={elem.id}>
                      <img
                        className="user-profile-pic"
                        src={elem.photoURL}
                        referrerPolicy="no-referrer" // Lo añado para que se muestre la img
                      />
                      <li className="tw">
                        <p className="autor">@{elem.autor}</p>
                        <p className="tweet">{elem.tweet}</p>

                        <div className="tw-actions-container">
                          {/* TODO: Add dates */}
                          <span className="date">
                            {new Date(elem.fecha).toLocaleString(
                              "es-ES",
                              options
                            )}
                          </span>
                          <div className="action-container">
                            {/* Si el UID del autor está dentro del array de likes, mostrar rojo */}
                            {Boolean(
                              elem?.likes.find((uid) => uid === user?.uid)
                            ) ? (
                              <img
                                className="heart"
                                src={redHeart}
                                onClick={() => likeTweet(elem)}
                              />
                            ) : (
                              <img
                                className="heart"
                                src={whiteHeart}
                                onClick={() => likeTweet(elem)}
                              />
                            )}
                            <span className="like-counter">
                              {elem?.likes ? elem.likes.length : 0}
                            </span>
                          </div>

                          {/* Si el tweet uid coincide con el user uid, mostrar borrar, o else no */}
                          {elem.uid === user?.uid && (
                            <>
                              <div className="action-container">
                                <img
                                  className="bin"
                                  src={bin}
                                  onClick={() => deleteTweet(elem.id)}
                                />
                              </div>
                            </>
                          )}
                        </div>
                      </li>
                    </div>
                  </>
                );
              })
            : null}
        </ul>
      )}
    </div>
  );
};
export default TweetsBody;
