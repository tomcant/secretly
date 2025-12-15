import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import App from "#/App";
import { server } from "./mocks/node";
import { createEncryptedPayload } from "./utils/crypto";

describe("App routing", () => {
  it("renders the create secret page", () => {
    render(<App />);

    expect(screen.getByText("Secretly")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create shareable link/i }),
    ).toBeInTheDocument();
  });

  it("renders the view secret page", async () => {
    const payload = await createEncryptedPayload("My secret");

    server.use(
      http.get("*/secrets/:id", () =>
        HttpResponse.json({
          ciphertext: payload.ciphertextBase64,
          iv: payload.ivBase64,
        }),
      ),
    );

    window.history.pushState(
      {},
      "View Secret",
      `/secret/abc#${payload.keyBase64}`,
    );

    render(<App />);

    expect(await screen.findByText("My secret")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders the how it works page", () => {
    window.history.pushState({}, "How It Works", "/how-it-works");

    render(<App />);

    expect(screen.getByText("How It Works")).toBeInTheDocument();
    expect(
      screen.getByText(/zero-knowledge architecture/i),
    ).toBeInTheDocument();
  });

  it("renders the not found page", () => {
    window.history.pushState({}, "Not Found", "/does-not-exist");

    render(<App />);

    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });
});
