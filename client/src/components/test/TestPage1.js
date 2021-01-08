import React, { useState } from "react";

const TestPage1 = () => {
  const [showForm, setShowForm] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const loaded = (e) => {
    setLoadCount(loadCount + 1);
    console.log("loadCount", loadCount);
    if (loadCount > 0) {
      document
        .getElementsByTagName("iframe")[0]
        .setAttribute("height", "200px");
      window.scrollTo(315, 0);
    }
  };

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
          onLoad={(e) => loaded(e)}
        >
          Loading…
        </iframe>
      )}
    </div>
  );
};

export default TestPage1;
