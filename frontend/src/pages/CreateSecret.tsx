import { useState } from "react";
import { Link } from "react-router";
import { createSecret } from "#/api/client";
import { copyToClipboard } from "#/lib/clipboard";
import {
  encryptSecret,
  exportKeyToBase64,
  uint8ArrayToBase64,
} from "#/lib/crypto";

const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

export default function CreateSecret() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { encrypted, iv, key } = await encryptSecret(secret);
      const ciphertextBase64 = uint8ArrayToBase64(encrypted);
      const ivBase64 = uint8ArrayToBase64(iv);
      const keyBase64 = await exportKeyToBase64(key);

      const response = await createSecret({
        ciphertext: ciphertextBase64,
        iv: ivBase64,
      });

      setShareableUrl(`${FRONTEND_URL}/s/${response.id}#${keyBase64}`);
      setSecret("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareableUrl) return;
    try {
      await copyToClipboard(shareableUrl);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="max-w-3xl w-full animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 animate-slide-in">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 sm:mb-6 card-shadow-lg">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Secretly
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl font-medium px-2">
          Share secrets securely with end-to-end encryption
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-effect rounded-3xl p-4 sm:p-6 md:p-10 card-shadow-lg backdrop-blur-xl border-2 border-indigo-400/25 animate-fade-in">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="secret" className="sr-only">
              Enter your secret
            </label>
            <textarea
              id="secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl text-white placeholder-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none text-base sm:text-lg font-mono"
              rows={2}
              placeholder="Enter your secret..."
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-500/30 backdrop-blur-sm border-2 border-red-400/50 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-start gap-3 animate-fade-in">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-sm sm:text-base">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !secret.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl cursor-pointer hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed transition-all transform enabled:hover:scale-[1.02] enabled:active:scale-[0.98] card-shadow-lg flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Encrypting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Create Shareable Link</span>
              </>
            )}
          </button>
        </form>

        {shareableUrl && (
          <div className="mt-6 sm:mt-8 bg-gradient-to-r from-emerald-600/25 to-teal-600/25 backdrop-blur-sm border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-6 md:p-7 animate-fade-in card-shadow">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm sm:text-base font-bold text-white">
                Shareable Link Created
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={shareableUrl}
                readOnly
                className="flex-1 px-3 sm:px-5 py-3 sm:py-4 bg-indigo-950/50 backdrop-blur-sm border-2 border-indigo-500/30 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-mono break-all"
              />
              <button
                onClick={handleCopy}
                className={`font-bold px-5 sm:px-7 py-3 sm:py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 card-shadow ${
                  copied
                    ? "bg-emerald-600 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                }`}
              >
                {copied ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 sm:mt-10 space-y-4 text-white text-sm sm:text-base font-medium px-2">
        <div className="inline-flex items-center gap-2 bg-indigo-950/40 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-indigo-500/30">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs sm:text-sm">
            Your secrets are encrypted locally and never seen by our servers
          </span>
        </div>
        <div>
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-indigo-300 hover:text-indigo-200 transition-colors underline underline-offset-4 hover:underline-offset-2 text-xs sm:text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span>How does this work?</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
