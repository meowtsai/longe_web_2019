import React from "react";

const Alert = ({ msg, type = "danger" }) => {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {msg}
    </div>
  );
};

export default Alert;
