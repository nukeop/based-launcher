import App, { ArgsContext } from "../../App";
import { AppRoot } from "../../layouts/AppRoot";
import { Palette } from "./Palette";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Palette", () => {
  it("renders a palette from piped arguments", () => {
    const component = mountComponent(["first", "second", "third"]);

    expect(component).toMatchSnapshot();
  });

  const mountComponent = (stdinArgs: string[] = []) => {
    return render(
      <ArgsContext.Provider value={{ stdinArgs }}>
        <AppRoot>
          <Palette />
        </AppRoot>
      </ArgsContext.Provider>
    );
  };
});
