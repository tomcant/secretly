import { copyToClipboard } from "#/lib/clipboard";
import { setClipboardApi } from "../utils/clipboard";

describe("clipboard", () => {
  it("copies to the clipboard when the Clipboard API is available", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboardApi(writeText);

    await copyToClipboard("Text");

    expect(writeText).toHaveBeenCalledWith("Text");
  });

  it("throws when the Clipboard API is not available", async () => {
    setClipboardApi(undefined);

    await expect(copyToClipboard("Text")).rejects.toThrow(
      "Clipboard API is not available",
    );
  });
});
