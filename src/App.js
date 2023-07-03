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
  const [isChromium] = useState(
    navigator.userAgentData?.brands?.some((b) => b.brand === "Chromium")
  );

  useEffect(() => {
    if (!isChromium) {
      alert(
        "This demo is only supported on a Chromium browser on a laptop or desktop. Demos on other browsers and platforms are coming soon!"
      );
    }

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
  }, [isLoggedIn, isChromium]);

  const register = async () => {
    await magic.webauthn.registerNewUser({ username });
    setIsLoggedIn(true);
  };

  const login = async () => {
    await magic.webauthn.login({ username });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
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
              <button disabled={!isChromium} onClick={register}>
                Sign up
              </button>
              <button
                className="login-button"
                disabled={!isChromium}
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
