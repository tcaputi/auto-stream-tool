import { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const TextInput: React.FC<TextInputProps> = (props) => {
  const { label, className, ...rawProps } = props;

  return (
    <div className={className}>
      <label className="mb-1 block text-gray-200" htmlFor="username">
        {label}
      </label>
      <input
        className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        id="username"
        type="text"
        {...rawProps}
      />
    </div>
  );
};

export default TextInput;
