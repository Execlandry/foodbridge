// Button.tsx
import React from "react";

interface ButtonProps {
  text: string;
  color?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  text,
  color = "bg-blue-400",
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`${color} text-white p-2 rounded-md w-fit mx-auto`} // w-fit and mx-auto to control button width and center it
  >
    {text}
  </button>
);

export default Button;
