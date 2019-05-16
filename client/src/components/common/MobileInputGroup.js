import React from "react";
import classnames from "classnames";
import PropTypes from "prop-types";
const MobileInputGroup = ({
  name,
  placeholder,
  value,
  locale_value,
  error,
  type,
  onChange,
  info,
  localeOptions
}) => {
  const selectOptions = localeOptions.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));

  return (
    <div className="form-row">
      <div className="col-sm-4 my-1">
        <label className="sr-only" htmlFor="inlineFormInputLocale">
          locale
        </label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fas fa-globe-asia" />
            </span>
          </div>
          <select
            className="form-control form-control-md"
            name="mobile_locale"
            value={locale_value}
            onChange={onChange}
          >
            {selectOptions}
          </select>
        </div>
      </div>
      <div class="col-sm-8 my-1">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <i className="fas fa-mobile-alt" />
            </span>
          </div>

          <input
            type={type}
            className={classnames("form-control form-control-md", {
              "is-invalid": error
            })}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
          />
        </div>
      </div>
      {info && <small className="form-text text-muted">{info}</small>}
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

MobileInputGroup.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

MobileInputGroup.defaultProps = {
  type: "tel"
};

export default MobileInputGroup;
