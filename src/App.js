import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import Markdown from "react-markdown";
import "./App.css";

const App = () => {
  const [llmResponse, setLlmResponse] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false);

  return (
    <div className="container mt-4 m-4">
      <h4 className="display-4 text-center mb-4">
        <img src="https://cdn.prod.website-files.com/6645c0129428882861d078b8/66603a39bd44aeb85269ceea_655df7e9805dd2bd768367ef_llamaindex-removebg-preview.png" />{" "}
        SkillSync - Tailor your CV or resume!
      </h4>
      {llmResponse == null && !showSpinner ? (
        <FileUpload
          setLlmResponse={setLlmResponse}
          setShowSpinner={setShowSpinner}
        />
      ) : null}
      {showSpinner ? (
        <div
          className="d-flex justify-content-center mt-6"
          style={{ marginTop: "2.25rem" }}
        >
          <div
            className="spinner-border"
            style={{ height: "100px", width: "100px" }}
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
      {llmResponse != null ? (
        <Markdown className="mt-6 m-4">{llmResponse}</Markdown>
      ) : null}
    </div>
  );
};

export default App;
