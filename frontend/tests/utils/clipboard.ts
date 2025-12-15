export const setClipboardApi = (
  writeText: (() => Promise<unknown>) | undefined,
) => {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
};
