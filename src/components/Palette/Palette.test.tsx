import { ArgsContext } from "../../App";
import { PaletteContainer } from "../../containers/PaletteContainer";
import { AppRoot } from "../../layouts/AppRoot";
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
          <PaletteContainer />
        </AppRoot>
      </ArgsContext.Provider>
    );
  };
});
