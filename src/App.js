import "./App.css";
import React, { useState, useEffect } from "react";
import { firestore } from "./firebase";

function App() {
  const [tweets, setTweets] = useState([]);

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

        // Seteamos nuestro estado (array de tweets)
        setTweets(tweets);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <ul className="tw-container">
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
      </header>
    </div>
  );
}

export default App;
