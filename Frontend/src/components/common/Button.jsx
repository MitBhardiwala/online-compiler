import React from "react";

const Button = ({ styles, onClick, text }) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-4 px-6 font-poppins font-medium text-[18px] text-white button-col rounded-[10px] bg-black-gradient outline-none ${styles}`}
  >
    {text}
  </button>
);

export default Button;
