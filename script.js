import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import { expfirebaseConfig } from "./config.js";

const firebaseConfig = expfirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

const signUp = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userName = prompt("Enter your name:");
    const userDob = prompt("Enter your date of birth:");

    await setDoc(doc(db, "users", user.uid), {
      name: userName,
      dob: userDob,
      email: email,
      decks: [],
    });

    alert("User created successfully");
  } catch (error) {
    console.error("Error signing up:", error.message);
    alert(error.message);
  }
};

const login = async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      console.error("No such user in Firestore!");
    } else {
      console.log("User logged in:", userDoc.data());
      alert("Login successful");
    }
  } catch (error) {
    console.error("Error logging in:", error.message);
    alert(error.message);
  }
};

signupBtn.addEventListener("click", signUp);
loginBtn.addEventListener("click", login);
