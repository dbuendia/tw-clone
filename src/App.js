import "./App.css";
import React, { useState, useEffect } from "react";
import { firestore, auth } from "./firebase";
import Header from "./Header";
import TweetsBody from "./TweetsBody";
import TweetWritingArea from "./TweetWritingArea";

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
    // Para abrir una comunicación fija con la BD
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
      <Header />
      <TweetWritingArea
        tweet={tweet}
        user={user}
        handleInputChange={handleInputChange}
        sendTweet={sendTweet}
      />
      <TweetsBody
        tweets={tweets}
        user={user}
        likeTweet={likeTweet}
        deleteTweet={deleteTweet}
      />
    </div>
  );
}

export default App;
