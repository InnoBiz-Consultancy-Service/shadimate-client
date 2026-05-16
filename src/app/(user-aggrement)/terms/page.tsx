import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen font-outfit flex flex-col items-center justify-center px-6 py-20 bg-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-syne text-4xl font-black text-slate-900 mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-slate-500 text-lg mb-8">
          Our full terms &amp; conditions are being drafted. Check back soon.
        </p>
        <Link href="/" className="text-brand underline font-semibold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
