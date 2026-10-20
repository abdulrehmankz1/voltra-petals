import { navCopy } from "@/content/site";
import { Icon } from "../primitives/icon";

// The round button that opens the menu from the nav (data-menu-open) or closes it from inside (data-menu-close).
// Behaviour lives in the motion layer; only the opener reports the menu's state.
export function MenuButton({ action }: { action: "open" | "close" }) {
  if (action === "open")
    return (
      <button
        className="nav__menu"
        type="button"
        aria-expanded="false"
        aria-controls="menu"
        aria-label={navCopy.openMenu}
        data-menu-open=""
      >
        <Icon name="menu" aria-hidden="true" />
      </button>
    );
  return (
    <button className="nav__menu nav__menu--close" type="button" aria-label={navCopy.closeMenu} data-menu-close="">
      <Icon name="close" aria-hidden="true" />
    </button>
  );
}
