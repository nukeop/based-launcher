import { ArgsContext } from "../../App";
import { PaletteContainer } from "../../containers/PaletteContainer";
import { AppRoot } from "../../layouts/AppRoot";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("Palette", () => {
  it("renders a palette from piped arguments", () => {
    const component = mountComponent(["first", "second", "third"]);

    expect(component.asFragment()).toMatchSnapshot();
  });

  it("filters entries based on entered text", async () => {
    const component = mountComponent(["first", "second", "third"]);

    const input = await (await component.findAllByTestId("filter-input")).at(0);
    if (input) {
      fireEvent.change(input, { target: { value: "fir" } });
    }

    waitFor(() => expect(component.getByText("first")).toBeTruthy());
    waitFor(() => expect(component.getByText("second")).toBeNull());
  });

  it("selects the first item by default", async () => {
    const component = mountComponent(["first", "second", "third"]);

    component.debug();
    const firstItem = await component.findByTestId("palette-item-first");
    expect(firstItem.getAttribute("data-selected")).toBe("true");
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
