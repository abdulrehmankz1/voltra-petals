import type { ReactNode } from "react";
import type { Lines as LinesContent, SectionIntro as Intro } from "@/content/types";
import { spaced } from "@/lib/spaced";

// Section eyebrow; data-reveal is its scroll reveal.
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow" data-reveal="">
      {children}
    </p>
  );
}

// A display heading's lines, each in its own mask so the motion layer can lift it (data-lines on the heading).
export function Lines({ lines }: { lines: LinesContent }) {
  return spaced(
    lines,
    (line) => line,
    (line) => (
      <span className="line">
        <span>{line}</span>
      </span>
    ),
  );
}

// Section h2 in the display face, revealed line by line.
export function DisplayHeading({ id, lines }: { id: string; lines: LinesContent }) {
  return (
    <h2 className="display h2" id={id} data-lines="">
      <Lines lines={lines} />
    </h2>
  );
}

type SectionIntroProps = {
  className: string;
  id: string;
  intro: Intro;
  // Whatever follows in the same column (the custody note, the FAQ lens).
  children?: ReactNode;
};

// Section head: eyebrow, heading and the optional lede, then any extras.
export function SectionIntro({ className, id, intro, children }: SectionIntroProps) {
  return (
    <div className={className}>
      <Eyebrow>{intro.eyebrow}</Eyebrow> <DisplayHeading id={id} lines={intro.title} />
      {intro.lede && (
        <>
          {" "}
          <p className="body-l" data-reveal="">
            {intro.lede}
          </p>
        </>
      )}
      {children && <> {children}</>}
    </div>
  );
}
