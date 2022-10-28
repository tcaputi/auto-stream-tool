import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = (props) => {
  const { children, className, ...buttonProps } = props;

  return (
    <button
      className={
        "focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none" +
        className
      }
      type="button"
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
