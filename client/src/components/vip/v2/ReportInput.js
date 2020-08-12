import React from "react";
import moment from "moment";
import classnames from "classnames";
const ReportInput = ({
  name,
  label,
  register,
  error,
  symbol,
  placeholder,
  type = "text",
  options,
  defaultValue,
  readonly,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="col-form-label-sm">
        {label}
      </label>
      <div className="form-group input-group">
        <PrependEmoji label={label} symbol={symbol} />

        {type === "select" ? (
          <select
            name={name}
            ref={register}
            defaultValue={defaultValue}
            className={classnames("form-control form-control-md", {
              "is-invalid": error,
            })}
          >
            {" "}
            {options.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : type === "date" ? (
          <input
            type="date"
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            ref={register}
            max={moment().format("YYYY-MM-DD")}
            className={classnames("form-control form-control-md", {
              "is-invalid": error,
            })}
          />
        ) : type === "number" ? (
          <input
            type="number"
            name={name}
            placeholder={placeholder}
            ref={register}
            className={classnames("form-control form-control-md", {
              "is-invalid": error,
            })}
            readOnly={readonly}
          />
        ) : type === "datetime-local" ? (
          <input
            type="datetime-local"
            defaultValue={moment().format("YYYY-MM-DDTHH:mm")}
            name={name}
            ref={register}
            className={classnames("form-control form-control-md", {
              "is-invalid": error,
            })}
          />
        ) : (
          <input
            name={name}
            defaultValue={defaultValue}
            placeholder={placeholder}
            ref={register}
            className={classnames("form-control form-control-md", {
              "is-invalid": error,
            })}
            readOnly={readonly}
          />
        )}

        {error && <div className="invalid-feedback">{error.message}</div>}
      </div>
    </div>
  );
};

const PrependEmoji = ({ label, symbol }) => (
  <div className="input-group-prepend">
    {" "}
    <span
      className="input-group-text"
      role="img"
      aria-label={label ? label : ""}
      aria-hidden={label ? "false" : "true"}
    >
      {symbol}
    </span>
  </div>
);

export default ReportInput;
