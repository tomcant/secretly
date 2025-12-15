export async function copyToClipboard(text: string) {
  if (!text) return;

  if (!navigator?.clipboard?.writeText) {
    throw new Error("Clipboard API is not available");
  }

  await navigator.clipboard.writeText(text);
}
