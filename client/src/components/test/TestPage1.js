import React, { useState } from "react";

const TestPage1 = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {String(showForm)}
      <button onClick={(e) => setShowForm(!showForm)}>
        {showForm === false ? "Display" : "Hide"}
      </button>

      {showForm === true && (
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeqivxG0fqAxfNFnGEySofqSntk1Yu0Gx9Vl86OII79wYbaMA/viewform"
          width="640"
          height="943"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
        >
          Loading…
        </iframe>
      )}
    </div>
  );
};

export default TestPage1;
