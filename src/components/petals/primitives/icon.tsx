import { iconId, type IconName } from "../brand/icon-artwork";
import { cx } from "@/lib/cx";

type IconProps = {
  name: IconName;
  className?: string;
  // Set where the icon sits beside its own text label; inside hidden or role="img" containers it is left off,
  // as in the original.
  "aria-hidden"?: "true";
};

// An icon from the sprite (.i). Size and colour come from the container's CSS.
export function Icon({ name, className, "aria-hidden": ariaHidden }: IconProps) {
  return (
    <svg className={cx("i", className)} aria-hidden={ariaHidden}>
      <use href={`#${iconId(name)}`} />
    </svg>
  );
}
