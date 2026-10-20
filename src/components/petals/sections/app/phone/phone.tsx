import type { ReactNode } from "react";
import { StatusBar } from "./status-bar";

type PhoneProps = {
  // Which phone (data-phone); the motion layer opens each from the horizon on its own path.
  id: "a" | "b" | "c";
  // The screen's style variant (.scr--an / --ai / --home).
  screen: "an" | "ai" | "home";
  children: ReactNode;
};

// A phone on the stage: its slot (.phone-pos), the body, the screen between the status bar and the home bar, and
// the dynamic island.
export function Phone({ id, screen, children }: PhoneProps) {
  return (
    <div className={`phone-pos phone-pos--${id}`}>
      <div className={`phone phone--${id}`} data-phone={id}>
        <div className="phone__body">
          <div className={`scr scr--${screen}`}>
            <StatusBar /> {children} <div className="homebar" />
          </div>{" "}
          <div className="island" />
        </div>
      </div>
    </div>
  );
}
