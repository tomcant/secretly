import BackLink from "./components/BackLink";

export default function NotFound() {
  return (
    <div className="max-w-xl w-full animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 animate-slide-in">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl mb-4 sm:mb-6 card-shadow-lg">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
          Page Not Found
        </h1>
      </div>

      {/* Error Card */}
      <div className="glass-effect rounded-3xl p-4 sm:p-6 md:p-10 card-shadow-lg backdrop-blur-xl border-2 border-red-500/40">
        <p className="text-white text-base sm:text-lg mb-6 sm:mb-8 text-center">
          The page you're looking for doesn't exist.
        </p>
        <div className="text-center">
          <BackLink>Back Home</BackLink>
        </div>
      </div>
    </div>
  );
}
