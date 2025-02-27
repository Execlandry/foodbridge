// InputField.tsx
import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-2 w-full md:w-1/4">
    <label className="text-xs text-gray-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    />
  </div>
);

export default InputField;
