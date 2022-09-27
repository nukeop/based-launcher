import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import { vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";

expect.extend(matchers);
const fetchMock = createFetchMock(vi);
fetchMock.enableMocks();
