import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router";
import { ViewSecret } from "#/pages";
import { uint8ArrayToBase64 } from "#/lib/crypto";
import { server } from "../mocks/node";
import { setClipboardApi } from "../utils/clipboard";
import { createEncryptedPayload } from "../utils/crypto";

const renderWithPath = (path: string) => {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/secret/:id" element={<ViewSecret />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("ViewSecret page", () => {
  it("decrypts the secret", async () => {
    const payload = await createEncryptedPayload("My secret");

    server.use(
      http.get("*/secrets/:id", () =>
        HttpResponse.json({
          ciphertext: payload.ciphertextBase64,
          iv: payload.ivBase64,
        }),
      ),
    );

    renderWithPath(`/secret/abc#${payload.keyBase64}`);

    expect(screen.getByText("Decrypting secret")).toBeInTheDocument();
    expect(await screen.findByText("My secret")).toBeInTheDocument();
  });

  it("copies the secret to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboardApi(writeText);

    const payload = await createEncryptedPayload("My secret");

    server.use(
      http.get("*/secrets/:id", () =>
        HttpResponse.json({
          ciphertext: payload.ciphertextBase64,
          iv: payload.ivBase64,
        }),
      ),
    );

    renderWithPath(`/secret/abc#${payload.keyBase64}`);

    // Allow time for the decrypted secret to be visible before copying
    expect(await screen.findByText("My secret")).toBeInTheDocument();

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith("My secret");

    await waitFor(() => {
      expect(copyButton).toHaveTextContent("Copied!");
    });

    await waitFor(
      () => {
        expect(copyButton).toHaveTextContent("Copy");
      },
      { timeout: 2500 },
    );
  });

  it("shows an error when the secret is not found", async () => {
    const payload = await createEncryptedPayload("My secret");

    server.use(
      http.get("*/secrets/:id", () =>
        HttpResponse.json({ detail: "Not found" }, { status: 404 }),
      ),
    );

    renderWithPath(`/secret/missing#${payload.keyBase64}`);

    expect(
      await screen.findByText("Secret not found or no longer available"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create a new secret/i }),
    ).toBeInTheDocument();
  });

  it("shows an error when the encryption key is missing", async () => {
    renderWithPath("/secret/abc");

    expect(
      await screen.findByText("Encryption key not found in URL"),
    ).toBeInTheDocument();
  });

  it("shows an error when decryption fails", async () => {
    const payload = await createEncryptedPayload("My secret");
    const badCiphertext = uint8ArrayToBase64(new Uint8Array([0, 1, 2, 3]));

    server.use(
      http.get("*/secrets/:id", () =>
        HttpResponse.json({
          ciphertext: badCiphertext,
          iv: payload.ivBase64,
        }),
      ),
    );

    renderWithPath(`/secret/abc#${payload.keyBase64}`);

    expect(
      await screen.findByText("Unable to decrypt the secret."),
    ).toBeInTheDocument();
  });
});
