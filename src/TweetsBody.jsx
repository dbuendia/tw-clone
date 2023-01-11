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
                        {/* <span>date</span> */}
                        <div className="action-container">
                          <span
                            className="heart"
                            onClick={() => likeTweet(elem)}
                          >
                            ♡
                          </span>
                          <span className="like-counter">
                            {elem.likes ? elem.likes.length : 0}
                          </span>
                        </div>

                        {/* Si el tweet uid coincide con el user uid, mostrar borrar, o else no */}
                        {elem.uid === user?.uid && (
                          <>
                            <div className="action-container">
                              <span
                                className="delete"
                                onClick={() => deleteTweet(elem.id)}
                              >
                                X
                              </span>
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
