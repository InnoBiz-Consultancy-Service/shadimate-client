import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-sm">
        <p className="font-syne text-brand text-6xl font-extrabold mb-4">404</p>
        <h2 className="font-syne text-white text-xl font-extrabold mb-2">
          Page Not Found
        </h2>
        <p className="font-outfit text-slate-400 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="font-outfit inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-on-brand bg-linear-to-r from-brand to-accent no-underline hover:scale-[1.02] transition-all duration-200"
        >
          <Home size={14} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
