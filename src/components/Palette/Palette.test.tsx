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

    const input = await component.findByTestId("filter-input");
    fireEvent.change(input, { target: { value: "fir" } });

    waitFor(() => expect(component.getByText("first")).toBeTruthy());
    waitFor(() => expect(component.getByText("second")).toBeNull());
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
