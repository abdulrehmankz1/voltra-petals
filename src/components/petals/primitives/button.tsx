import type { ReactNode } from "react";
import type { Href } from "@/content/types";
import { cx } from "@/lib/cx";
import { Icon } from "./icon";

export type ButtonVariant = "light" | "ghost" | "volt";

type ButtonLinkProps = {
  href: Href;
  variant: ButtonVariant;
  // The compact nav size or the full-width plan button.
  size?: "sm" | "block";
  className?: string;
  // The trailing arrow: always, from small screens up only (.no-xs) or none.
  arrow?: "always" | "wide" | "none";
  // Motion hooks: the magnetic pull (data-magnetic) or, in the menu, closing it when followed (data-menu-link).
  magnetic?: boolean;
  menuLink?: boolean;
  children: ReactNode;
};

// The .btn call to action: a link styled as a button, its label and the arrow that slides on hover.
export function ButtonLink({
  href,
  variant,
  size,
  className,
  arrow = "always",
  magnetic,
  menuLink,
  children,
}: ButtonLinkProps) {
  return (
    <a
      className={cx("btn", `btn--${variant}`, size && `btn--${size}`, className)}
      href={href}
      data-magnetic={magnetic ? "" : undefined}
      data-menu-link={menuLink ? "" : undefined}
    >
      <span className="btn__in">
        <span>{children}</span>
        {arrow !== "none" && <Icon name="arrow" className={arrow === "wide" ? "no-xs" : undefined} aria-hidden="true" />}
      </span>
    </a>
  );
}

// The quiet text link with an arrow (.link).
export function TextLink({ href, className, children }: { href: Href; className?: string; children: ReactNode }) {
  return (
    <a className={cx("link", className)} href={href}>
      {children} <Icon name="arrow" aria-hidden="true" />
    </a>
  );
}
