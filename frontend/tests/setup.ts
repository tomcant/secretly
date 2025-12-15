import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "./mocks/node";

expect.extend(matchers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
  cleanup();
});

afterAll(() => {
  server.close();
});
