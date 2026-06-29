import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary hover:shadow-xl hover:shadow-primary/20",
  secondary:
    "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
  ghost: "bg-transparent text-primary hover:bg-surface-container-low",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`group relative overflow-hidden rounded-full px-8 py-4 font-body text-label-md tracking-wider transition-all duration-300 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {variant === "primary" ? (
        <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover:translate-y-0" />
      ) : null}
    </button>
  );
}
