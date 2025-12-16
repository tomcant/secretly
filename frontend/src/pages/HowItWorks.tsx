import BackLink from "./components/BackLink";

export default function HowItWorks() {
  return (
    <div className="max-w-4xl w-full animate-fade-in">
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          How It Works
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl font-medium px-2">
          Understanding the security behind Secretly
        </p>
      </div>

      {/* Main Content Card */}
      <div className="glass-effect rounded-3xl p-4 sm:p-6 md:p-10 card-shadow-lg backdrop-blur-xl border-2 border-indigo-400/25 animate-fade-in space-y-6 sm:space-y-8">
        {/* Introduction */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Zero-Knowledge Architecture
          </h2>
          <p className="text-white text-base sm:text-lg leading-relaxed">
            Secretly uses <strong>end-to-end encryption</strong> to ensure your
            secrets remain private. All encryption happens in your browser
            before any data is sent to our servers. We never see your plaintext
            secrets—only encrypted data that we cannot decrypt.
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            The Process
          </h2>

          {/* Step 1 */}
          <div className="bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg sm:text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Encryption in Your Browser
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-3">
                  When you create a secret, your browser:
                </p>
                <ul className="list-disc list-outside text-white text-sm sm:text-base space-y-2 pl-5">
                  <li>Generates a random 256-bit AES-GCM encryption key</li>
                  <li>Encrypts your secret using the Web Crypto API</li>
                  <li>
                    Creates a random initialization vector (IV) for security
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg sm:text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Key Stored in URL Fragment
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-3">
                  The encryption key is embedded in the shareable URL fragment
                  (the part after{" "}
                  <code className="bg-indigo-900/60 px-1.5 py-0.5 rounded text-indigo-200 font-mono text-xs">
                    #
                  </code>
                  ):
                </p>
                <div className="bg-indigo-950/60 border border-indigo-600/50 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-indigo-200 break-all">
                  /secret/abc123#your-encryption-key
                </div>
                <p className="text-white text-sm sm:text-base leading-relaxed mt-3">
                  URL fragments are never sent to the server so the key stays in
                  your browser and is only used locally for encryption and
                  decryption.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg sm:text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Encrypted Data Sent to Server
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Only the encrypted ciphertext and IV are sent to our servers.
                  Since the encryption key remains in your browser, we have no
                  way to decrypt this data.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg sm:text-xl">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Decryption in Recipient's Browser
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed mb-3">
                  When someone opens the shareable link, their browser:
                </p>
                <ul className="list-disc list-outside text-white text-sm sm:text-base space-y-2 pl-5">
                  <li>Extracts the key from the URL fragment</li>
                  <li>Fetches the encrypted data from our server</li>
                  <li>Decrypts the secret locally using the key</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-indigo-950/40 backdrop-blur-sm border-2 border-indigo-500/30 rounded-2xl p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg sm:text-xl">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  One-Time View Protection
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Once the secret has been viewed, it becomes permanently
                  inaccessible. The encrypted data cannot be retrieved again,
                  ensuring your secret can only be viewed once.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-4 pt-4 border-t border-indigo-500/30">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Security Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-600/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-emerald-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-lg font-bold text-white">
                  AES-GCM 256-bit
                </h3>
              </div>
              <p className="text-white text-sm">
                Industry-standard encryption algorithm
              </p>
            </div>

            <div className="bg-emerald-600/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-emerald-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-lg font-bold text-white">Web Crypto API</h3>
              </div>
              <p className="text-white text-sm">
                Native browser encryption—no third-party libraries
              </p>
            </div>

            <div className="bg-emerald-600/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-emerald-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-lg font-bold text-white">Zero-Knowledge</h3>
              </div>
              <p className="text-white text-sm">
                We couldn't decrypt your secrets even if we wanted to
              </p>
            </div>

            <div className="bg-emerald-600/20 backdrop-blur-sm border-2 border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <svg
                  className="w-6 h-6 text-emerald-300 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-lg font-bold text-white">
                  One-Time Access
                </h3>
              </div>
              <p className="text-white text-sm">
                Secrets self-destruct after being viewed once
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-purple-500/15 backdrop-blur-sm border-2 border-purple-400/25 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-purple-200 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                Important Notes
              </h3>
              <ul className="list-disc list-outside text-white text-sm sm:text-base space-y-2 pl-5">
                <li>
                  The encryption key is in the URL, so be careful when sharing
                  links. Anyone with the complete URL can decrypt the secret.
                </li>
                <li>
                  Make sure to share the entire URL including the fragment (
                  <code className="bg-purple-900/50 px-1 py-0.5 rounded text-purple-100 font-mono text-xs">
                    #key
                  </code>
                  ). Without it, decryption is impossible.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6 sm:mt-8 text-center">
        <BackLink>Back Home</BackLink>
      </div>
    </div>
  );
}
