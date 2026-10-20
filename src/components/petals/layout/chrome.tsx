import { site } from "@/content/site";

export function SkipLink() {
  return (
    <a className="skip" href="#main" lang={site.lang}>
      {site.skipLabel}
    </a>
  );
}

// The fixed film grain over the whole page.
export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
