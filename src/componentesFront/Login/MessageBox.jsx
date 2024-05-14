import React, { useEffect, useState } from "react";

const MessageBox = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;

    if (message) {
      setIsVisible(true);
      console.log("primer if positivo");
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } else {
      console.log("primer if negativo");

      setIsVisible(false);
    }

    return () => {
      if (timer) {
        console.log(" if timer positivo ");

        clearTimeout(timer);
      }
    };
  }, [message]);

  const getColor = () => {
    if (type === "error") {
      return "red";
    } else if (type === "success") {
      return "green";
    } else {
      return "black";
    }
  };

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        backgroundColor: getColor(),
        padding: "10px",
        borderRadius: "5px",
        margin: "10px 0",
        color: "white",
        textAlign: "center",
      }}
    >
      {message}
    </div>
  );
};

export default MessageBox;
