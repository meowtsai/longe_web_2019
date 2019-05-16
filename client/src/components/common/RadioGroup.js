import React, { Component } from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
const RadioGroup = ({ name, value, error, info, onChange, options }) => {
  const radioOptions = options.map((option, index) => (
    <div key={option.value} className="form-check form-check-inline">
      <input
        className={classnames("form-check-input ", {
          "is-invalid": error
        })}
        type="radio"
        name={name}
        id={option.value}
        value={option.value}
        onChange={onChange}
        checked={value === option.value ? true : false}
      />

      {option.label}
    </div>
  ));

  return (
    <div className="form-group">
      {radioOptions}

      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
};

RadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default RadioGroup;
