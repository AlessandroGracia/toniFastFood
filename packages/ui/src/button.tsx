import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cx } from "./utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "danger";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <button ref={ref} className={cx("tonios-button", `tonios-button--${variant}`, className)} {...props} />
  )
);

Button.displayName = "Button";
