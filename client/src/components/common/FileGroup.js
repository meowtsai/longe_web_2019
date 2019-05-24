import React from "react";

import PropTypes from "prop-types";
const FileGroup = ({ name, filename, error, info, onChange }) => {
  return (
    <div className="custom-file mb-5">
      <input
        type="file"
        className="custom-file-input"
        id="customFile"
        onChange={onChange}
        name={name}
        accept="image/gif, image/jpeg,image/png"
        multiple
      />
      <label
        className="custom-file-label"
        htmlFor="customFile"
        data-browse="瀏覽"
      >
        {filename}
      </label>
      {info && (
        <small className="form-text text-muted">
          <ul style={{ paddingLeft: "15px" }}>
            {info.map(file => (
              <li style={{ listStyleType: "square" }} key={file}>
                {file}
              </li>
            ))}
          </ul>
        </small>
      )}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

FileGroup.propTypes = {
  name: PropTypes.string.isRequired,
  filename: PropTypes.string,
  info: PropTypes.array,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default FileGroup;
