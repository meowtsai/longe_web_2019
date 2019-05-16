import React, { Fragment, useState } from "react";
import axios from "axios";
const FileUpload = () => {
  const [file, setFile] = useState();
  const [filename, setFilename] = useState("選擇檔案");
  const [uploadedFile, setUploadedFile] = useState({});
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/upload/test", formData, {
        headers: { "Content-type": "multipart/form-data" }
      });

      const { filename, filepath } = res.data;
      setUploadedFile({ filename, filepath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log("there was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md6">
          <Fragment>
            <form onSubmit={onSubmit}>
              <div className="custom-file mt-4">
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChange}
                />
                <label className="custom-file-label" htmlFor="customFile">
                  {filename}
                </label>
              </div>
              <input
                type="submit"
                value="Upload"
                className="btn btn-primary btn-block  mt-4"
              />
            </form>

            <h3 className="display-4 center-text">{uploadedFile.filename}</h3>
            <img src={uploadedFile.filepath} alt="" style={{ width: "100%" }} />
          </Fragment>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
