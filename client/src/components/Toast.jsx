import React from "react";

const Toast = ({ message }) => {
  return (
    <div>
      <div className="toast toast-top toast-end z-50">
        <div className="alert alert-success transition-all duration-500 ease-in-out transform animate-bounce">
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Toast;
