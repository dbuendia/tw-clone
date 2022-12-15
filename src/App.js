import "./App.css";
import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";

function App() {
  // Contenedor de todos los tweets que recibimos de firebase:
  const [tweets, setTweets] = useState([]);
  // Tweet para enviar a firebase desde el form:
  const [tweet, setTweet] = useState({ tweet: "", autor: "" });

  // Get tweets
  useEffect(() => {
    firestore
      .collection("tweets")
      .get()
      .then((snapshot) => {
        // Realmente nuestros tweets están en un array en:
        // console.log(
        //   snapshot.docs[0]._delegate._document.data.value.mapValue.fields
        // );
        // Pero también podemos hacer:
        // Un map sobre snapshot.docs (quien tiene los docs)
        // Para retornar un array de objetos por cada doc que exista
        const tweets = snapshot.docs.map((elem) => {
          return {
            // Y llamar a la función .data() que nos da los campos que necesitemos:
            tweet: elem.data().tweet,
            autor: elem.data().autor,
            id: elem.id,
          };
        });

        /*
          // Otra forma que vi de hacerlo:
          snapshot.forEach((doc) => {
          // Rellenar nuestro array de tweets
          tweets.push(doc.data());
        });
        */

        // Seteamos nuestro estado (array de tweets que recibimos de firebase)
        // Sirve para cargar los tweets iniciales que hubiera en la db
        setTweets(tweets);
      });
  }, []);

  // Función genérica para ambos inputs
  const handleInputChange = (e) => {
    let nuevoTweet = {
      ...tweet, // Copiamos el estado anterior del objeto tweet con el spread operator
      [e.target.name]: e.target.value, // Si en los inputs existe la propiedad que se llame como el valor de name, sustitúyelo por los e.target.value de ese input
    };
    // Es decir, vamos actualizando cambio a cambios en los inputs y metiéndolos en un estado para enviar a firebase
    setTweet(nuevoTweet);
  };

  const sendTweet = (e) => {
    // Prevenimos que la página se refresque por defecto al pulsar el botón
    e.preventDefault();
    // Enviamos al tweet a la colección deseada
    let enviarTweet = firestore.collection("tweets").add(tweet);
    // Ahora lo solicitamos para poder mostrarlo en la UI
    // El envío a la db devuelve una promesa:
    let solicitarDocumento = enviarTweet.then((docRef) => {
      // Rescatamos una referencia al documento, cuya información obtendremos con get
      return docRef.get();
    });
    // Ahora podemos rescatar la información del documento
    solicitarDocumento.then((doc) => {
      let nuevoTweet = {
        tweet: doc.data().tweet,
        autor: doc.data().autor,
        id: doc.id,
      };
      // Y añadir ese nuevo tweet al array de tweets, junto con el resto que hubiera con el spread operator
      setTweets([nuevoTweet, ...tweets]);
    });
  };

  return (
    <div className="App">
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
          <input
            name="autor" // mismo nombre que la key del objeto
            type="text"
            placeholder="Autor"
            value={tweet.autor}
            onChange={handleInputChange}
          />
          <input type="button" value="Enviar" onClick={sendTweet} />
        </div>
      </form>
      <ul className="tw-container">
        <p>Tweets:</p>
        {/* Si tweets no está vacío, lo recorremos para mostrarlo por UI */}
        {tweets
          ? tweets.map((elem) => {
              return (
                <li className="tw">
                  {elem.autor}: {elem.tweet}
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
}

export default App;
