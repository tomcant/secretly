import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { getSecret } from "#/api/client";
import { copyToClipboard } from "#/lib/clipboard";
import {
  base64ToUint8Array,
  decryptSecret,
  importKeyFromBase64,
} from "#/lib/crypto";

export default function ViewSecret() {
  const { id } = useParams<{ id: string }>();
  const { hash } = useLocation();
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (hasLoadedRef.current !== id) {
      setSecret(null);
      setLoading(true);
      setError(null);
    }

    if (hasLoadedRef.current === id) {
      return;
    }

    const loadSecret = async () => {
      if (!id) {
        setError("Invalid secret ID");
        setLoading(false);
        return;
      }

      hasLoadedRef.current = id;

      try {
        const hashValue = hash.slice(1);
        if (!hashValue) {
          throw new Error("Encryption key not found in URL");
        }

        // Import the key before making the API call so that if the key
        // is invalid then we don't effect the number of views remaining.
        const key = await importKeyFromBase64(hashValue);

        const response = await getSecret(id);
        const ciphertext = base64ToUint8Array(response.ciphertext);
        const iv = base64ToUint8Array(response.iv);
        const secret = await decryptSecret(ciphertext, iv, key);
        setSecret(secret);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to decrypt secret",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSecret();
  }, [id, hash]);

  const handleCopy = async () => {
    if (!secret) return;
    try {
      await copyToClipboard(secret);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  if (loading) {
    return (
      <div className="text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-6 sm:mb-8 card-shadow-lg">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-spin"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Decrypting secret
        </p>
        <p className="text-white text-base sm:text-lg">
          This may take a moment...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl w-full animate-fade-in">
        <div className="glass-effect rounded-3xl p-4 sm:p-6 md:p-10 card-shadow-lg backdrop-blur-xl border-2 border-red-500/40">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Error
            </h2>
            <p className="text-white text-base sm:text-lg px-2">{error}</p>
          </div>
          <a
            href="/"
            className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] card-shadow text-center text-sm sm:text-base"
          >
            ← Create a new secret
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 animate-slide-in">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl mb-4 sm:mb-6 card-shadow-lg">
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
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Secret Revealed
        </h1>
      </div>

      {/* Secret Card */}
      <div className="glass-effect rounded-3xl p-4 sm:p-6 md:p-10 card-shadow-lg backdrop-blur-xl mb-6 border-2 border-indigo-400/25">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
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
            <p className="text-sm sm:text-base font-bold text-white">
              Your Secret
            </p>
          </div>
          <button
            onClick={handleCopy}
            className={`font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 card-shadow text-sm sm:text-base ${
              copied
                ? "bg-emerald-600 text-white"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {copied ? (
              <>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
        <div className="bg-indigo-950/50 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6 md:p-8 break-words">
          <pre className="whitespace-pre-wrap font-mono text-white text-base sm:text-lg leading-relaxed">
            {secret}
          </pre>
        </div>
      </div>

      {/* One-Time View Warning Card */}
      <div className="bg-gradient-to-r from-purple-500/20 to-violet-500/20 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-4 sm:p-6 mb-6 card-shadow">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm sm:text-base font-bold text-white mb-2">
              One-Time View
            </p>
            <p className="text-xs sm:text-sm text-white">
              This secret has been viewed and is no longer accessible. Please
              save it if needed.
            </p>
          </div>
        </div>
      </div>

      <a
        href="/"
        className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] card-shadow-lg text-center flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
      >
        <span>← Create a new secret</span>
      </a>
    </div>
  );
}
