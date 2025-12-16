import { type ReactNode } from "react";
import { Link } from "react-router";

type BackLinkProps = {
  children: ReactNode;
};

export default function BackLink({ children }: BackLinkProps) {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] card-shadow-lg text-base sm:text-lg"
    >
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
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>{children}</span>
    </Link>
  );
}
