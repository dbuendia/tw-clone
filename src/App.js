import "./App.css";
import React, { useState, useEffect } from "react";
import { firestore, auth, loginConGoogle, logout } from "./firebase";

function App() {
  // Contenedor de todos los tweets que recibimos de firebase:
  const [tweets, setTweets] = useState([]);
  // Tweet para enviar a firebase desde el form:
  const [tweet, setTweet] = useState({
    tweet: "",
    autor: "",
    uid: "",
    mail: "",
  });
  const [user, setUser] = useState(null);

  // Get tweets
  useEffect(() => {
    // firestore
    //   .collection("tweets")
    //   .get()
    //   .then((snapshot) => {
    //     // Realmente nuestros tweets están en un array en:
    //     // console.log(
    //     //   snapshot.docs[0]._delegate._document.data.value.mapValue.fields
    //     // );
    //     // Pero también podemos hacer:
    //     // Un map sobre snapshot.docs (quien tiene los docs)
    //     // Para retornar un array de objetos por cada doc que exista
    //     const tweets = snapshot.docs.map((elem) => {
    //       return {
    //         // Y llamar a la función .data() que nos da los campos que necesitemos:
    //         tweet: elem.data().tweet,
    //         autor: elem.data().autor,
    //         id: elem.id,
    //       };
    //     });

    // En realidad, para abrir una comunicación fija con la BD
    // Y que se escuchen y actualicen los cambios automáticamente usaremos la función onSnapshot
    // En realidad el código lo vamos a encerrar en una constante que contendrá el return de esa función on snapshot, pero el código se ejecutará igualmente
    // The listener can be cancelled by calling the function that is returned when on snapshot is called
    const cancelarSuscripcion = firestore
      .collection("tweets")
      .onSnapshot((snapshot) => {
        const tweets = snapshot.docs.map((elem) => {
          return {
            tweet: elem.data().tweet,
            autor: elem.data().autor,
            likes: elem.data().likes,
            id: elem.id,
            email: elem.data().email,
            uid: elem.data().uid,
          };
        });

        // Seteamos nuestro estado (array de tweets que recibimos de firebase)
        // Sirve para cargar los tweets iniciales que hubiera en la db
        setTweets(tweets);
      });

    auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Función de cleanup que se ejecutará antes de que el componente se desmonte
    // La usaremos para cancelar la suscripción al snapshot
    return () => cancelarSuscripcion();
  }, []); // Se ejecuta cada vez que se monta el componente

  // Función genérica para ambos inputs
  const handleInputChange = (e) => {
    let nuevoTweet = {
      // ...tweet, // Copiamos el estado anterior del objeto tweet con el spread operator
      // [e.target.name]: e.target.value, // Si en los inputs existe la propiedad que se llame como el valor de name, sustitúyelo por los e.target.value de ese input
      tweet: e.target.value,
      uid: user.uid,
      email: user.email,
      autor: user.displayName,
    };
    // Es decir, vamos actualizando cambio a cambios en los inputs y metiéndolos en un estado para enviar a firebase
    setTweet(nuevoTweet);
  };

  const sendTweet = (e) => {
    // Prevenimos que la página se refresque por defecto al pulsar el botón
    e.preventDefault();
    // Enviamos al tweet a la colección deseada
    firestore.collection("tweets").add(tweet);
  };

  const deleteTweet = (id) => {
    firestore.doc(`tweets/${id}`).delete();
  };

  const likeTweet = (tweet) => {
    // Verificar que en la lista de likes no esté tu UID
    // Devuelve o undefined o el UID del usuario
    let newLikes = [];
    if (tweet.likes) {
      // vamos a verificar si el uid existe en el array de likes
      const userHasLiked = Boolean(
        tweet.likes.find((elem) => elem === user.uid)
      );
      if (userHasLiked) {
        newLikes = tweet.likes.filter((likeUid) => likeUid !== user.uid);
      } else {
        newLikes.push(user.uid);
      }
    } else {
      newLikes.push(user.uid);
    }

    // Da un like
    firestore.doc(`tweets/${tweet.id}`).update({ likes: newLikes });
  };

  return (
    <div className="App">
      {user ? (
        <>
          <div className="user-profile">
            <img
              className="user-profile-pic"
              src={user.photoURL}
              alt="User profile pic"
              referrerPolicy="no-referrer" // Lo añado para que se muestre la img
            />
            <p>¡Hola, {user.displayName}!</p>
            <button className="btn-log" onClick={logout}>
              Log out
            </button>
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
          placeholder="Escribe un tweet..."
          value={tweet.tweet}
          onChange={handleInputChange}
        />
        <div className="under-textarea">
          {/* <input
            name="autor" // mismo nombre que la key del objeto
            type="text"
            placeholder="Autor"
            value={tweet.autor}
            onChange={handleInputChange}
          /> */}
          <input type="button" value="Enviar" onClick={sendTweet} />
        </div>
      </form>
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
}

export default App;
