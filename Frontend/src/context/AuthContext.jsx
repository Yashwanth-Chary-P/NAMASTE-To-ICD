import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Register
  const registerUser = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const user = result.user;

    const userData = {
      name: user.displayName || "User",
      email: user.email,
      photo: user.photoURL || ""
    };

    localStorage.setItem("user", JSON.stringify(userData));

    return user;
  };

  // ✅ Login
  const loginUser = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);

    const user = result.user;

    const userData = {
      name: user.displayName || "User",
      email: user.email,
      photo: user.photoURL || ""
    };

    localStorage.setItem("user", JSON.stringify(userData));

    return user;
  };

  // ✅ Google Login (POPUP)
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const user = result.user;

    const userData = {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL
    };

    localStorage.setItem("user", JSON.stringify(userData));

    return user;
  };

  // ✅ Logout
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
  };

  // ✅ Track user (important)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const userData = {
          name: user.displayName || "User",
          email: user.email,
          photo: user.photoURL || ""
        };

        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        localStorage.removeItem("user");
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    registerUser,
    loginUser,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};