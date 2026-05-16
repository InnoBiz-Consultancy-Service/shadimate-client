// "use client";

// import { registerAction, RegisterState } from "@/actions/auth/registration";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {
//   useState,
//   useEffect,
//   useActionState,
//   useCallback,
//   useTransition,
// } from "react";
// import { ArrowRight } from "lucide-react";
// import {
//   Logo,
//   Toast,
//   GlassCard,
//   Input,
//   PasswordInput,
//   GradientButton,
//   GenderSelector,
//   PageShell,
//   RateLimitBanner,
//   CountryPhoneInput,
// } from "@/components/ui";
// import { useCountdown } from "@/hooks/useCountdown";
// import { fetchCountries } from "@/actions/geo/geo";
// import type { Country } from "@/actions/geo/geo";

// // Bangladesh as default — most users are BD
// const DEFAULT_COUNTRY: Country = {
//   name: "Bangladesh",
//   code: "BD",
//   dialCode: "+880",
//   flag: "🇧🇩",
// };

// export default function RegisterPage() {
//   const router = useRouter();

//   // ── Form fields ──────────────────────────────────────────────────────────
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [gender, setGender] = useState<"male" | "female" | "">("");
//   const [selectedCountry, setSelectedCountry] =
//     useState<Country>(DEFAULT_COUNTRY);

//   // ── Countries ────────────────────────────────────────────────────────────
//   const [countries, setCountries] = useState<Country[]>([DEFAULT_COUNTRY]);
//   const [, startCountryLoad] = useTransition();

//   useEffect(() => {
//     startCountryLoad(async () => {
//       const list = await fetchCountries();
//       if (list.length > 0) setCountries(list);
//     });
//   }, []);

//   // ── Server action ────────────────────────────────────────────────────────
//   const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(
//     null,
//   );
//   const initialState: RegisterState = { success: false, message: "" };
//   const [state, formAction, isPending] = useActionState(
//     registerAction,
//     initialState,
//   );
//   const countdown = useCountdown(0);

//   useEffect(() => {
//     if (state.retryAfter && state.retryAfter > 0)
//       countdown.start(state.retryAfter);
//   }, [state.retryAfter, countdown]);

//   const toastData = (() => {
//     if (toastDismissedFor === state) return null;
//     if (state.success && state.phone)
//       return {
//         message: "Account created! Verifying your phone...",
//         type: "success" as const,
//       };
//     if (state.message && !state.success && !state.retryAfter)
//       return { message: state.message, type: "error" as const };
//     return null;
//   })();

//   const handleToastClose = useCallback(
//     () => setToastDismissedFor(state),
//     [state],
//   );

//   useEffect(() => {
//     if (!state.success || !state.phone) return;
//     const timer = setTimeout(() => {
//       router.push(`/verify-otp?phone=${encodeURIComponent(state.phone!)}`);
//     }, 800);
//     return () => clearTimeout(timer);
//   }, [state, router]);

//   return (
//     <>
//       {toastData && (
//         <Toast
//           message={toastData.message}
//           type={toastData.type}
//           onClose={handleToastClose}
//         />
//       )}

//       <PageShell>
//         <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-5 z-10">
//           <Logo />
//         </div>

//         <GlassCard className="relative z-10 w-full max-w-md px-8 py-6 md:px-10">
//           <div className="animate-[fadeUp_0.55s_ease_0.1s_both] mb-4">
//             <h1 className="font-syne text-white font-extrabold text-[24px] tracking-tight leading-tight mb-1">
//               Create your account
//             </h1>
//             <p className="text-slate-100 text-sm">
//               Start your journey to real connection
//             </p>
//           </div>

//           {countdown.isActive && (
//             <RateLimitBanner
//               message="You can register a limited number of times. Please wait before trying again."
//               formattedTime={countdown.formatted}
//               onDismiss={countdown.reset}
//             />
//           )}

//           <form action={formAction} className="flex flex-col gap-3">
//             {/* Hidden fields */}
//             <input type="hidden" name="gender" value={gender} />

//             <Input
//               label="Full Name"
//               name="name"
//               value={name}
//               onChange={setName}
//               placeholder="Your full name"
//               autoComplete="name"
//               error={state.errors?.name}
//             />

//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               value={email}
//               onChange={setEmail}
//               placeholder="you@example.com"
//               autoComplete="email"
//               error={state.errors?.email}
//             />

//             {/* Country + Phone — combined input */}
//             <CountryPhoneInput
//               phoneValue={phone}
//               onPhoneChange={setPhone}
//               selectedCountry={selectedCountry}
//               onCountryChange={setSelectedCountry}
//               countries={countries}
//               phoneInputName="phone"
//               countryInputName="country"
//               phoneError={state.errors?.phone}
//               countryError={state.errors?.country}
//             />

//             <PasswordInput
//               name="password"
//               value={password}
//               onChange={setPassword}
//               autoComplete="new-password"
//               placeholder="Min. 6 characters"
//               error={state.errors?.password}
//             />

//             <GenderSelector
//               value={gender}
//               onChange={(g) => setGender(g)}
//               error={state.errors?.gender}
//             />

//             <GradientButton
//               type="submit"
//               fullWidth
//               loading={isPending}
//               disabled={countdown.isActive}
//               loadingText="Creating account..."
//               className="mt-1"
//             >
//               {countdown.isActive ? (
//                 `Wait ${countdown.formatted}`
//               ) : (
//                 <>
//                   CREATE ACCOUNT <ArrowRight size={15} />
//                 </>
//               )}
//             </GradientButton>
//           </form>

//           <p className="text-center text-slate-500 text-sm mt-4">
//             Already have an account?{" "}
//             <Link
//               href="/login"
//               className="text-brand font-semibold hover:text-brand/80 transition-colors duration-150 no-underline"
//             >
//               Sign in
//             </Link>
//           </p>
//         </GlassCard>
//       </PageShell>
//     </>
//   );
// }

"use client";

import { registerAction, RegisterState } from "@/actions/auth/registration";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useActionState,
  useCallback,
  useTransition,
} from "react";
import { ArrowRight } from "lucide-react";
import {
  Logo,
  Toast,
  GlassCard,
  Input,
  PasswordInput,
  GradientButton,
  GenderSelector,
  PageShell,
  RateLimitBanner,
  CountryPhoneInput,
} from "@/components/ui";
import { useCountdown } from "@/hooks/useCountdown";
import { fetchCountries } from "@/actions/geo/geo";
import type { Country } from "@/actions/geo/geo";

// FIX: Changed dialCode from +880 to +88 to avoid duplicate-zero issues
const DEFAULT_COUNTRY: Country = {
  name: "Bangladesh",
  code: "BD",
  dialCode: "+88",
  flag: "🇧🇩",
};

export default function RegisterPage() {
  const router = useRouter();

  // ── Form fields ──────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(DEFAULT_COUNTRY);

  // ── Countries ────────────────────────────────────────────────────────────
  const [countries, setCountries] = useState<Country[]>([DEFAULT_COUNTRY]);
  const [, startCountryLoad] = useTransition();

  useEffect(() => {
    startCountryLoad(async () => {
      const list = await fetchCountries();
      if (list.length > 0) {
        // FIX: Ensure Bangladesh entry also uses +88
        const patched = list.map((c) =>
          c.code === "BD" ? { ...c, dialCode: "+88" } : c,
        );
        setCountries(patched);
      }
    });
  }, []);

  // ── Server action ────────────────────────────────────────────────────────
  const [toastDismissedFor, setToastDismissedFor] = useState<object | null>(
    null,
  );
  const initialState: RegisterState = { success: false, message: "" };
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );
  const countdown = useCountdown(0);

  useEffect(() => {
    if (state.retryAfter && state.retryAfter > 0)
      countdown.start(state.retryAfter);
  }, [state.retryAfter, countdown]);

  const toastData = (() => {
    if (toastDismissedFor === state) return null;
    if (state.success && state.phone)
      return {
        message: "Account created! Verifying your phone...",
        type: "success" as const,
      };
    if (state.message && !state.success && !state.retryAfter)
      return { message: state.message, type: "error" as const };
    return null;
  })();

  const handleToastClose = useCallback(
    () => setToastDismissedFor(state),
    [state],
  );

  // FIX: OTP redirect — only push if we haven't already navigated
  const [hasRedirected, setHasRedirected] = useState(false);
  useEffect(() => {
    if (!state.success || !state.phone || hasRedirected) return;
    setHasRedirected(true);
    const timer = setTimeout(() => {
      router.replace(`/verify-otp?phone=${encodeURIComponent(state.phone!)}`);
    }, 800);
    return () => clearTimeout(timer);
  }, [state, router, hasRedirected]);

  return (
    <>
      {toastData && (
        <Toast
          message={toastData.message}
          type={toastData.type}
          onClose={handleToastClose}
        />
      )}

      <PageShell>
        <div className="animate-[fadeUp_0.55s_ease_0.05s_both] mb-5 z-10">
          <Logo />
        </div>

        <GlassCard className="relative z-10 w-full max-w-md px-8 py-6 md:px-10">
          <div className="animate-[fadeUp_0.55s_ease_0.1s_both] mb-4">
            <h1 className="font-syne text-white font-extrabold text-[24px] tracking-tight leading-tight mb-1">
              Create your account
            </h1>
            <p className="text-slate-200 text-sm">
              Start your journey to real connection
            </p>
          </div>

          {countdown.isActive && (
            <RateLimitBanner
              message="You can register a limited number of times. Please wait before trying again."
              formattedTime={countdown.formatted}
              onDismiss={countdown.reset}
            />
          )}

          <form action={formAction} className="flex flex-col gap-3">
            {/* Hidden fields */}
            <input type="hidden" name="gender" value={gender} />

            <Input
              label="Full Name"
              name="name"
              value={name}
              onChange={setName}
              placeholder="Your full name"
              autoComplete="name"
              error={state.errors?.name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              error={state.errors?.email}
            />

            {/* Country + Phone */}
            <CountryPhoneInput
              phoneValue={phone}
              onPhoneChange={setPhone}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              countries={countries}
              phoneInputName="phone"
              countryInputName="country"
              phoneError={state.errors?.phone}
              countryError={state.errors?.country}
            />

            <PasswordInput
              name="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              placeholder="Min. 6 characters"
              error={state.errors?.password}
            />

            <GenderSelector
              value={gender}
              onChange={(g) => setGender(g)}
              error={state.errors?.gender}
            />

            {/* FIX: Legal links — Privacy Policy & Terms */}
            <p className="text-slate-300 text-xs text-center leading-relaxed mt-1">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-white font-semibold underline underline-offset-2 hover:text-brand transition-colors"
              >
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-white font-semibold underline underline-offset-2 hover:text-brand transition-colors"
              >
                Privacy Policy
              </Link>
            </p>

            <GradientButton
              type="submit"
              fullWidth
              loading={isPending}
              disabled={countdown.isActive}
              loadingText="Creating account..."
              className="mt-1"
            >
              {countdown.isActive ? (
                `Wait ${countdown.formatted}`
              ) : (
                <>
                  CREATE ACCOUNT <ArrowRight size={15} />
                </>
              )}
            </GradientButton>
          </form>

          {/* FIX: High-contrast Sign In link */}
          <p className="text-center text-slate-200 text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-bold underline underline-offset-2 hover:text-brand transition-colors duration-150 no-underline"
            >
              Sign in
            </Link>
          </p>
        </GlassCard>
      </PageShell>
    </>
  );
}
