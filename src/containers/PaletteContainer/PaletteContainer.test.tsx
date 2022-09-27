import { ArgsContext } from "../../contexts/argsContext";
import { AppRoot } from "../../layouts/AppRoot";
import { PaletteContainer } from "./PaletteContainer";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { CLIFlags } from "common/cliFlags";
import { LauncherOption } from "common/launcher";
import { anOption } from "common/tests/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({ children }: any) => children({ height: 600, width: 600 }),
}));

vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: () => Promise.resolve(),
  },
}));

const defaultOptions = [
  anOption({ id: "1", name: "first" }),
  anOption({ id: "2", name: "second" }),
  anOption({ id: "3", name: "third" }),
];

describe("Palette container", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a palette from piped arguments", async () => {
    const component = mountComponent(defaultOptions);

    waitFor(() => expect(component.asFragment()).toMatchSnapshot());
  });

  it("filters entries based on entered text", async () => {
    const component = mountComponent(defaultOptions);

    const input = (await component.findAllByTestId("filter-input")).at(0);
    if (input) {
      fireEvent.change(input, { target: { value: "fir" } });
    }

    waitFor(() => expect(component.getByText("first")).toBeTruthy());
    waitFor(() => expect(component.getByText("second")).toBeNull());

    component.unmount();
  });

  it("selects the first item by default", async () => {
    const component = mountComponent(defaultOptions);

    const firstItem = nthItem(component, "1");
    expect(firstItem).toHaveAttribute("data-selected", "true");
  });

  it("down arrow selects the next item", async () => {
    const component = mountComponent([
      ...defaultOptions,
      anOption({ id: "4", name: "fourth" }),
    ]);
    goDown(component);

    const secondItem = nthItem(component, "2");
    expect(secondItem).toHaveAttribute("data-selected", "true");
  });

  it("up arrow selects the previous item", async () => {
    const component = mountComponent([
      ...defaultOptions,
      anOption({ id: "4", name: "fourth" }),
    ]);

    goDown(component);
    const secondItem = nthItem(component, "2");
    expect(secondItem).toHaveAttribute("data-selected", "true");

    goUp(component);
    const firstItem = nthItem(component, "1");
    expect(firstItem).toHaveAttribute("data-selected", "true");
  });

  it("can use the wikipedia bang", async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        query: {
          pages: {
            "123": {
              title: "Wikipedia",
              extract:
                "Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.",
              pageprops: {
                "wikibase-shortdesc": "free online encyclopedia",
              },
            },
          },
        },
      })
    );
    const component = mountComponent(defaultOptions);

    const input = (await component.findAllByTestId("filter-input")).at(0);
    if (input) {
      fireEvent.change(input, { target: { value: "!w wikipedia" } });
    }

    expect(await component.findByText("Wikipedia")).toBeInTheDocument();
    expect(
      await component.findByText("free online encyclopedia")
    ).toBeInTheDocument();

    component.unmount();
  });

  it("shows that nothing was found when using the wikipedia bang", async () => {
    fetchMock.mockOnce(
      JSON.stringify({
        query: {
          pages: {
            "123": {},
          },
        },
      })
    );
    const component = mountComponent(defaultOptions);

    const input = (await component.findAllByTestId("filter-input")).at(0);
    if (input) {
      fireEvent.change(input, { target: { value: "!w wikipedia" } });
    }

    expect(await component.findByText("Nothing found")).toBeInTheDocument();

    component.unmount();
  });

  const mountComponent = (
    options: LauncherOption[] = [],
    flags: CLIFlags = {}
  ) => {
    return render(
      <ArgsContext.Provider value={{ flags, options, isLoading: true }}>
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
