import React from "react";
import ReactJson from "react-json-view";

export default function Metadata({ metadata }) {
  const style = {
    borderRadius: "10px",
    padding: "1em",
    backgroundColor: "#eee",
    wordBreak: "break-all",
  };
  return (
    <div className="metadata">
      <h2>User Metadata</h2>
      {metadata && <ReactJson src={metadata} style={style} />}
    </div>
  );
}
