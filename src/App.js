import React, { useState, useEffect } from "react";
import "./styles.css";
import { Magic } from "magic-sdk";
import { WebAuthnExtension } from "@magic-ext/webauthn";

const magic = new Magic("pk_test_8027A11635E49A34", {
  endpoint: "http://localhost:3014/",
  extensions: [new WebAuthnExtension()]
});

export default function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [metadata, setMetadata] = useState(null);
  const [isChrome] = useState(!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime));

  // const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  useEffect(() => {
    if (!isChrome) {
      alert("WebAuthn feature only support on Chrome now. Please use Chrome!")
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

  const login = async () => {
    await magic.webauthn.registerNewUser({ username });
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  const PrettyPrintJson = ({data}) => (data ? <div><pre>{JSON.stringify(data, null, 2) }</pre></div> : <div/>);

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="container">
          <h1>Please sign up or login</h1>
          <input
            name="username"
            required="required"
            placeholder="Enter your username"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button disabled={!isChrome} onClick={login}>Register</button>
        </div>
      ) : (
        <>
        <div>
          <div className="container">
            <h1>Current user: {username}</h1>
            <button onClick={logout}>Logout</button>
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
