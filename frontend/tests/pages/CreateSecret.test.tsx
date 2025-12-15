import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router";
import { CreateSecret } from "#/pages";
import { server } from "../mocks/node";
import { setClipboardApi } from "../utils/clipboard";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

const renderPage = () =>
  render(
    <MemoryRouter>
      <CreateSecret />
    </MemoryRouter>,
  );

describe("CreateSecret page", () => {
  it("disables submit until a secret is entered", () => {
    renderPage();

    const submit = screen.getByRole("button", {
      name: /create shareable link/i,
    });

    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    expect(submit).toBeEnabled();
  });

  it("creates a secret and shows a shareable link", async () => {
    server.use(
      http.post("*/secrets", async ({ request }) => {
        const body = await request.json();
        expect(body).toMatchObject({
          ciphertext: expect.any(String),
          iv: expect.any(String),
        });

        return HttpResponse.json({ id: "abc123" });
      }),
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create shareable link/i }),
    );

    const shareableLink = (await screen.findByDisplayValue((value) =>
      value.startsWith(`${FRONTEND_URL}/s/abc123#`),
    )) as HTMLInputElement;

    expect(shareableLink.value.length).toBeGreaterThan(
      `${FRONTEND_URL}/s/abc123#`.length,
    );
    expect(screen.getByPlaceholderText("Enter your secret...")).toHaveValue("");
  });

  it("shows a loading state when creating a secret", async () => {
    server.use(
      http.post("*/secrets", () => HttpResponse.json({ id: "abc123" })),
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    const submit = screen.getByRole("button", {
      name: /create shareable link/i,
    });
    fireEvent.click(submit);

    expect(submit).toBeDisabled();
    expect(await screen.findByText("Encrypting...")).toBeInTheDocument();
  });

  it("shows an error when creating a secret fails", async () => {
    server.use(
      http.post("*/secrets", () =>
        HttpResponse.json({ detail: "An error occurred" }, { status: 500 }),
      ),
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create shareable link/i }),
    );

    expect(
      await screen.findByText("Failed to create secret: Internal Server Error"),
    ).toBeInTheDocument();
  });

  it("copies the shareable link to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboardApi(writeText);

    server.use(
      http.post("*/secrets", () => HttpResponse.json({ id: "abc123" })),
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create shareable link/i }),
    );

    // Allow time for the shareable link to be visible before copying
    const shareableLink = (await screen.findByDisplayValue((value) =>
      value.startsWith(`${FRONTEND_URL}/s/abc123#`),
    )) as HTMLInputElement;

    const copyButton = screen.getByRole("button", { name: /copy/i });
    fireEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledWith(shareableLink.value);

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

  it("shows an error when copying fails", async () => {
    setClipboardApi(vi.fn().mockRejectedValue(new Error()));

    server.use(
      http.post("*/secrets", () => HttpResponse.json({ id: "abc123" })),
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your secret..."), {
      target: { value: "My secret" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /create shareable link/i }),
    );

    await screen.findByDisplayValue((value) =>
      value.startsWith(`${FRONTEND_URL}/s/abc123#`),
    );

    fireEvent.click(screen.getByRole("button", { name: /copy/i }));

    expect(
      await screen.findByText("Failed to copy to clipboard"),
    ).toBeInTheDocument();
  });
});
