import React from "react";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { className, ...buttonProps } = props;

    return (
      <button
        ref={ref}
        className={
          "focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none " +
          className
        }
        type="button"
        {...buttonProps}
      />
    );
  }
);

export default Button;
