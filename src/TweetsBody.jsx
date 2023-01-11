const TweetsBody = ({ tweets, likeTweet, user, deleteTweet }) => {
  console.log(typeof deleteTweet);
  return (
    <div className="tweets-body">
      <ul className="tw-container">
        <p>Tweets:</p>
        {/* Si tweets no está vacío, lo recorremos para mostrarlo por UI */}
        {tweets
          ? tweets.map((elem) => {
              return (
                <div key={elem.id}>
                  <li className="tw">
                    <p className="autor">Autor: @{elem.autor}</p>
                    <p className="tweet">{elem.tweet}</p>

                    <div className="tw-actions-container">
                      <div className="action-container">
                        <span className="heart" onClick={() => likeTweet(elem)}>
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
              );
            })
          : null}
      </ul>
    </div>
  );
};
export default TweetsBody;
