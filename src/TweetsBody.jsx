import bin from "./svg/bin.svg";
import whiteHeart from "./svg/white-heart.svg";
import redHeart from "./svg/red-heart.svg";

const TweetsBody = ({ tweets, likeTweet, user, deleteTweet }) => {
  console.log(typeof deleteTweet);
  return (
    <div className="tweets-body">
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
                        {/* <span>date</span> */}
                        <div className="action-container">
                          {/* Si el UID del autor está dentro del array de likes, mostrar rojo */}
                          {/* {console.log(elem.likes)} */}
                          {/* {console.log(user.uid)} */}
                          {/* NO FUNCIONA SI NO SE ESTÁ LOGUEADO, INVESTIGAR POR Q */}
                          {elem?.likes == user?.uid ? (
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
                          {/* <p>{elem.likes}</p> */}
                          <span className="like-counter">
                            {elem.likes ? elem.likes.length : 0}
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
    </div>
  );
};
export default TweetsBody;
