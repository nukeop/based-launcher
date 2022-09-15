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
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({ children }: any) => children({ height: 600, width: 600 }),
}));

vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: () => Promise.resolve(),
  },
}));

describe("Palette", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a palette from piped arguments", async () => {
    const component = mountComponent(["first", "second", "third"]);

    waitFor(() => expect(component.asFragment()).toMatchSnapshot());
  });

  it("filters entries based on entered text", async () => {
    const component = mountComponent(["first", "second", "third"]);

    const input = (await component.findAllByTestId("filter-input")).at(0);
    if (input) {
      fireEvent.change(input, { target: { value: "fir" } });
    }

    waitFor(() => expect(component.getByText("first")).toBeTruthy());
    waitFor(() => expect(component.getByText("second")).toBeNull());

    component.unmount();
  });

  it("selects the first item by default", async () => {
    const component = mountComponent(["first", "second", "third"]);

    const firstItem = nthItem(component, "first");
    expect(firstItem).toHaveAttribute("data-selected", "true");
  });

  it("down arrow selects the next item", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);
    goDown(component);

    const secondItem = nthItem(component, "second");
    expect(secondItem).toHaveAttribute("data-selected", "true");
  });

  it("up arrow selects the previous item", async () => {
    const component = mountComponent(["first", "second", "third", "fourth"]);

    goDown(component);
    const secondItem = nthItem(component, "second");
    expect(secondItem).toHaveAttribute("data-selected", "true");

    goUp(component);
    const firstItem = nthItem(component, "first");
    expect(firstItem).toHaveAttribute("data-selected", "true");
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
