import { PaletteContainer } from "../../containers/PaletteContainer";
import { ArgsContext } from "../../contexts/argsContext";
import { AppRoot } from "../../layouts/AppRoot";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

describe("Palette", () => {
  afterEach(() => {
    cleanup();
  });

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

    component.unmount();
  });

  it("selects the first item by default", async () => {
    const component = mountComponent(["first", "second", "third"]);

    const firstItem = await nthItem(component, "first");
    expect(firstItem.getAttribute("data-selected")).toBe("true");
  });

  it("down arrow selects the next item", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);
    goDown(component);

    const secondItem = await nthItem(component, "second");
    expect(secondItem.getAttribute("data-selected")).toBe("true");
  });

  it("up arrow selects the previous item", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);

    goDown(component);
    const secondItem = await nthItem(component, "second");
    expect(secondItem.getAttribute("data-selected")).toBe("true");

    goUp(component);
    const firstItem = await nthItem(component, "first");
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

  const goUp = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowUp" });

  const goDown = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowDown" });

  const nthItem = (component: RenderResult, n: string) =>
    component.getByTestId(`palette-item-${n}`);
});
