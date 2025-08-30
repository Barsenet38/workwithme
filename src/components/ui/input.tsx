import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      style={{
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
      }}
    />
  );
};
