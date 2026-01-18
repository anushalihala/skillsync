import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "axios";

const taskTypes = {
  guided_cv: "Performant Guided CV",
  guided_cover_letter: "Performant Guided Cover Letter",
  guided_react_cv: "Detailed Guided CV",
  guided_react_cover_letter: "Detailed Guided Cover Letter",
  auto_cv: "Performant Autonomous CV",
  auto_cover_letter: "Performant Autonomous Cover Letter",
  auto_react_cv: "Detailed Autonomous CV",
  auto_react_cover_letter: "Detailed Autonomous Cover Letter",
};

const FileUpload = ({ setLlmResponse, setShowSpinner, setErrorMsg }) => {
  const [jobDesc, setJobDesc] = useState("");
  const [taskType, setTaskType] = useState("");
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState("Upload CV");
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file == null) {
      setMessage("Please upload CV");
      return;
    } else if (jobDesc.length < 1) {
      setMessage("Please provide job description");
      return;
    } else if (taskType.length < 1) {
      setMessage("Please choose output type.");
      return;
    }
    formData.append("file", file);
    formData.append("jobDesc", jobDesc);
    formData.append("taskType", taskType);

    try {
      const res = await axios.post("http://127.0.0.1:5000/submit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percent = parseInt(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          if (percent == 100) {
            setMessage("File uploaded");
            setShowSpinner(true);
          }
          setUploadPercentage(percent);
          setTimeout(() => setUploadPercentage(0), 10000);
        },
      });

      setShowSpinner(false);
      setLlmResponse(res.data);
    } catch (err) {
      console.log(err.response);
      setErrorMsg(`LLM error. ${err?.response?.data ?? ""}`);
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="mb-4" style={{ display: "flex" }}>
          <label className="mr-2" htmlFor="jobDesc">
            Job Description
          </label>
          <textarea
            id="jobDesc"
            style={{ width: "100%", height: "200px" }}
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            style={{ height: "0px !important" }}
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>
        <div className="custom-file mb-2">
          <label className="mr-2" htmlFor="taskType">
            Choose Output Type
          </label>
          <select id="taskType" onChange={(e) => setTaskType(e.target.value)}>
            <option value={""}></option>
            {Object.entries(taskTypes).map((task) => (
              <option value={task[0]} key={task[0]}>
                {task[1]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p>Guided vs Autonomous</p>
          <ul>
            <li>
              Guided means there are lower level step by step instructions
              provided by a human, for example 'what are the hard skills
              required by the job?', 'where does the user demonstrate experience
              with these hard skills?'. This method might be more reliable but
              slower than autonomous.
            </li>
            <li>
              Autonomous means that the AI handles data fetching and synthesis
              independently after being given a single prompt.
            </li>
          </ul>
        </div>
        <div>
          <p>Performant vs Detailed</p>
          <ul>
            <li>Performant means results will be fetched quicker.</li>
            <li>
              Detailed means result might take longer but is likely to be more
              detailed.
            </li>
          </ul>
        </div>
        <Progress percentage={uploadPercentage} />

        <input
          type="submit"
          value="Submit"
          className="btn btn-primary btn-block mt-4 mb-6"
        />
      </form>
    </Fragment>
  );
};

export default FileUpload;
