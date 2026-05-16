import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen font-outfit flex flex-col items-center justify-center px-6 py-20 bg-white">
      <div className="max-w-2xl w-full text-center">
        <h1 className="font-syne text-4xl font-black text-slate-900 mb-4">
          Contact Us
        </h1>
        <p className="text-slate-500 text-lg mb-8">
          Reach us at{" "}
          <a href="mailto:hello@primehalf.com" className="text-brand underline">
            hello@primehalf.com
          </a>
        </p>
        <Link href="/" className="text-brand underline font-semibold">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
