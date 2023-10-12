import "./styles.css";
import React, { useState, useEffect } from "react";
import { magic } from "./libs/magic";
import Metadata from "./components/Metadata";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loading from "./components/Loading";

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

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

  const register = async () => {
    setIsDisabled(true);

    try {
      await magic.webauthn.registerNewUser({ username });
      setIsLoggedIn(true);
    } catch (err) {
      console.log("Error registering device:", err);
      setIsDisabled(false);
    }
  };

  const login = async () => {
    setIsDisabled(true);

    try {
      await magic.webauthn.login({ username });

      setIsLoggedIn(true);
    } catch (err) {
      console.log("Error registering device:", err);
      setIsDisabled(false);
    }
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
    setIsDisabled(false);
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
              <button disabled={isDisabled} onClick={register}>
                Sign up
              </button>
              <button
                className="login-button"
                disabled={isDisabled}
                onClick={login}
              >
                Log in
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="container">
              <p>
                Current user: <strong>{username}</strong>
              </p>
              <button onClick={logout}>Log out</button>
            </div>
            <Metadata metadata={metadata} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
