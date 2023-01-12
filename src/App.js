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
    likes: "",
    uid: "",
    mail: "",
    photoURL: "",
  });
  const [user, setUser] = useState(null);
  const [disabled, setDisabled] = useState("disabled");

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
            photoURL: elem.data().photoURL,
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
    setDisabled("");
    let nuevoTweet = {
      // ...tweet, // Copiamos el estado anterior del objeto tweet con el spread operator
      // [e.target.name]: e.target.value, // Si en los inputs existe la propiedad que se llame como el valor de name, sustitúyelo por los e.target.value de ese input
      tweet: e.target.value,
      uid: user.uid,
      email: user.email,
      autor: user.displayName,
      photoURL: user.photoURL,
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
    let newLikes = tweet.likes;
    // console.log("New likes: " + newLikes);
    // 1. Verificar que en la lista de likes no esté tu UID
    // Tweet.likes devolverá undefined o un array de UIDs del usuario
    // 2. Si hay likes...
    if (tweet.likes.length !== 0) {
      // ... Vamos a verificar si el uid del usuario existe en el array de likes
      const userHasLiked = Boolean(
        // Cast a booleano del string de UID si lo encuentra:
        tweet.likes.find((elem) => elem === user.uid)
      );
      if (userHasLiked) {
        // 3. Si el usuario ya hecho like en ese tweet...
        // Lo filtramos fuera en un array de nuevos likes
        // (Sólo incluimos los uid que no sean como el de nuestro usuario)
        newLikes = tweet.likes.filter((likeUid) => likeUid !== user.uid);
      } else {
        // Hay likes en el array pero nuestro usuario
        // no había hecho like en ese tweet...
        // 4. Incluímos su uid en el array de likes
        // console.log("El usuario no había dado like a este tw.");
        newLikes.push(user.uid);
      }
    } else {
      // Si no había likes en el tweet, directamente metemos el uid del usuario en el array de likes
      // console.log("No había likes en este tweet, añado el UID directamente");
      // He puesto el .length porque: Sólo llegabamos aquí la primera vez que se le da like a un tweet
      newLikes.push(user.uid);
    }

    // Da un like
    // Likes tiene que ser iguala lo que hubiera en likes
    //+ new likes
    // console.log("old" + tweet.likes);
    // console.log("new" + newLikes);
    // console.log(tweet.likes.concat(newLikes));
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
        disabled={disabled}
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
