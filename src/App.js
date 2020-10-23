import React, { useState, useEffect } from "react";
import "./styles.css";
import { Magic } from "magic-sdk";
import { WebAuthnExtension } from "@magic-ext/webauthn";

const magic = new Magic("pk_test_196B83E1C870F939", {
  extensions: [new WebAuthnExtension()]
});

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [isChrome] = useState(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime));

  useEffect(() => {
    if (!isChrome) {
      alert("This demo is only supported on Google Chrome on a laptop or desktop. Demos on other browsers and platforms are coming soon!")
    }

    magic.user.isLoggedIn().then(async (magicIsLoggedIn) => {
      setIsLoggedIn(magicIsLoggedIn);
      if (magicIsLoggedIn) {
        const metadata = await magic.webauthn.getMetadata();
        setUsername(metadata.username);
        setMetadata(metadata);
      }
    });
  }, [isLoggedIn, isChrome]);

  const register = async () => {
    await magic.webauthn.registerNewUser({ username });
    setIsLoggedIn(true);
  };

  const login = async () => {
    await magic.webauthn.login({username});
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  const PrettyPrintJson = ({data}) => (data ? <div><pre>{JSON.stringify(data, null, 2) }</pre></div> : <div/>);

  return (
    <div className="App">
      <div className="title">
        <h1>WebAuthn Login with Magic </h1>
        <h4>Login with Yubikey or TouchID on your Chrome browser</h4>
      </div>
      {!isLoggedIn ? (
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
          <div>
              <button disabled={!isChrome} onClick={register}>Sign up</button>
              <button className="login-button" disabled={!isChrome} onClick={login}>Log in</button>
          </div>
        </div>
      ) : (
        <>
        <div>
          <div className="container">
            <p>Current user: {username}</p>
            <button onClick={logout}>Log out</button>
          </div>
        </div>
        <div>
          <PrettyPrintJson data={metadata}/>
        </div>
        </>
      )}
    </div>
  );
}
