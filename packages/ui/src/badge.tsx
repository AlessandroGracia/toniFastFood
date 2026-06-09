import type { HTMLAttributes } from "react";
import { cx } from "./utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "positive" | "warning" | "danger";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return <span className={cx("tonios-badge", `tonios-badge--${tone}`, className)} {...props} />;
}
