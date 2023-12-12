import "./styles.css";
import React, { useState, useEffect } from "react";
import { magic } from "./libs/magic";
import { useError } from "./hooks/useError";
import Metadata from "./components/Metadata";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, handleError] = useError();
  const [showError, setShowError] = useState(false);
  const [timer, setTimer] = useState();

  useEffect(() => {
    setMetadata({ loading: true });

    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const metadata = await magic.webauthn.getMetadata();
        setUsername(metadata.username);
        setMetadata(metadata);
      } else {
        setMetadata(null);
      }
    });
  }, [isLoggedIn]);

  function setError(err) {
    // clears existing timer
    timer && clearTimeout(timer);

    try {
      if (err && err.message) {
        const targetString = "Error message: ";
        const messageIndex = err.message.search(targetString);
        if (messageIndex > -1) {
          err.truncatedErrorMessage = err.message.slice(messageIndex);
        }
      }
      handleError({ value: err?.truncatedErrorMessage || err.message });
      setShowError(true);

      const timeout = setTimeout(() => {
        setShowError(false);
      }, 5000);

      // sets a new timer
      setTimer(timeout);
    } catch (err) {
      console.log("Error setting error message:", err);
    }
  }

  const handleRegisterNewUser = async () => {
    setIsDisabled(true);

    try {
      const didToken = await magic.webauthn.registerNewUser({ username });
      console.log("DID Token:", didToken);

      setIsLoggedIn(true);
      setIsDisabled(false);
    } catch (err) {
      setError(err);
      setIsDisabled(false);
    }
  };

  const handleLogin = async () => {
    setIsDisabled(true);

    try {
      await magic.webauthn.login({ username });

      setIsLoggedIn(true);
      setIsDisabled(false);
    } catch (err) {
      console.log("Error logging in user:", err);
      setError(err);
      setIsDisabled(false);
    }
  };

  const handleLogout = async () => {
    try {
      const logoutSuccessful = await magic.user.logout();
      console.log("User logged out:", logoutSuccessful);

      setIsLoggedIn(false);
    } catch (err) {
      console.log("Error logging out user:", err);
    }
  };

  return (
    <>
      <Header />

      <main>
        {metadata?.loading ? (
          <Loading />
        ) : !isLoggedIn ? (
          <div className="container">
            <p>Please sign up or log in</p>
            <input
              name="username"
              required="required"
              placeholder="Enter your username"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <div className="buttons-wrapper">
              <button disabled={isDisabled} onClick={handleRegisterNewUser}>
                Sign up
              </button>
              <button
                className="login-button"
                disabled={isDisabled}
                onClick={handleLogin}
              >
                Log in
              </button>
            </div>
            {showError && error && (
              <span className="error-message">{error}</span>
            )}
          </div>
        ) : (
          <>
            <div className="container">
              <p>
                Current user: <strong>{username}</strong>
              </p>
              <button onClick={handleLogout}>Log out</button>
            </div>
            <Metadata metadata={metadata} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
