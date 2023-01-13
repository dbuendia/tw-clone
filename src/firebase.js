import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABXvjIfF2X9Dk4t2vp9ppR2JhWdDN-PAs",
  authDomain: "test-4addb.firebaseapp.com",
  projectId: "test-4addb",
  storageBucket: "test-4addb.appspot.com",
  messagingSenderId: "41021212233",
  appId: "1:41021212233:web:7b1251743bc6f45073a198",
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Exporta la funcionalidad de la BD
export const firestore = firebase.firestore();

// El módulo de autenticación
export const auth = firebase.auth();
// El proveedor de autenticación
export const provider = new firebase.auth.GoogleAuthProvider();

// Obliga a seleccionar una cueta
provider.setCustomParameters({
  prompt: "select_account",
});

// La utilidad para hacer el login con el pop up
export const loginConGoogle = () => auth.signInWithPopup(provider);
// La utilidad para hacer logout
export const logout = () => auth.signOut();

// Exporta el paquete firebase para otros usos
export default firebase;
