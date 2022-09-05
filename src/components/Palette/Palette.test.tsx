import { ArgsContext } from "../../App";
import { PaletteContainer } from "../../containers/PaletteContainer";
import { AppRoot } from "../../layouts/AppRoot";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
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

    component.unmount();
  });

  it("selects the first item by default", async () => {
    const component = mountComponent(["first", "second", "third"]);

    const firstItem = await nthItem(component, "first");
    expect(firstItem.getAttribute("data-selected")).toBe("true");
  });

  it("right arrow selects the next item", async () => {
    const component = mountComponent(["first", "second", "third"]);
    goRight(component);

    const secondItem = await nthItem(component, "second");
    expect(secondItem.getAttribute("data-selected")).toBe("true");
  });

  it("right arrow wraparound", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);
    goRight(component);
    goRight(component);
    goRight(component);

    const fourthItem = await nthItem(component, "fourth");
    expect(fourthItem.getAttribute("data-selected")).toBe("true");
  });

  it("right arrow wraparound in the last row", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);
    goRight(component);
    goRight(component);
    goRight(component);
    goRight(component);

    const firstItem = await nthItem(component, "first");
    expect(firstItem.getAttribute("data-selected")).toBe("true");
  });

  it("left arrow selects the previous item", async () => {
    const component = mountComponent(["first", "second", "third"]);
    goRight(component);

    const secondItem = await nthItem(component, "second");
    expect(secondItem.getAttribute("data-selected")).toBe("true");

    goLeft(component);
    const firstItem = await nthItem(component, "first");
    expect(firstItem.getAttribute("data-selected")).toBe("true");
  });

  it("down arrow selects the item in the next row", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);
    goDown(component);

    const fourthItem = await nthItem(component, "fourth");
    expect(fourthItem.getAttribute("data-selected")).toBe("true");
  });

  it("up arrow selects the item in the previous row", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);

    goDown(component);
    const fourthItem = await nthItem(component, "fourth");
    expect(fourthItem.getAttribute("data-selected")).toBe("true");

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

  const goRight = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowRight" });

  const goLeft = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowLeft" });

  const goUp = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowUp" });

  const goDown = (component: RenderResult) =>
    fireEvent.keyDown(component.getByTestId("palette"), { key: "ArrowDown" });

  const nthItem = (component: RenderResult, n: string) =>
    component.getByTestId(`palette-item-${n}`);
});
