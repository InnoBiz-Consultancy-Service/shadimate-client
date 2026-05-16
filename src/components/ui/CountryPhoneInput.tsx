// "use client";

// import { useState, useRef, useEffect, useCallback } from "react";
// import { ChevronDown, Search, X, Check, Loader2 } from "lucide-react";
// import { dt } from "@/lib/design-tokens";
// import type { Country } from "@/actions/geo/geo";

// interface CountryPhoneInputProps {
//   /** The raw local phone number (without dial code) */
//   phoneValue: string;
//   onPhoneChange: (value: string) => void;

//   /** Selected country object */
//   selectedCountry: Country | null;
//   onCountryChange: (country: Country) => void;

//   /** Countries list from API */
//   countries: Country[];
//   countriesLoading?: boolean;

//   phoneError?: string;
//   countryError?: string;

//   /** hidden input names for server action */
//   phoneInputName?: string;
//   countryInputName?: string;
// }

// export default function CountryPhoneInput({
//   phoneValue,
//   onPhoneChange,
//   selectedCountry,
//   onCountryChange,
//   countries,
//   countriesLoading = false,
//   phoneError,
//   countryError,
//   phoneInputName = "phone",
//   countryInputName = "country",
// }: CountryPhoneInputProps) {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [search, setSearch] = useState("");
//   const [phoneFocused, setPhoneFocused] = useState(false);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const searchRef = useRef<HTMLInputElement>(null);
//   const phoneRef = useRef<HTMLInputElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     if (!dropdownOpen) return;
//     function handleOutside(e: MouseEvent) {
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(e.target as Node)
//       ) {
//         setDropdownOpen(false);
//         setSearch("");
//       }
//     }
//     document.addEventListener("mousedown", handleOutside);
//     return () => document.removeEventListener("mousedown", handleOutside);
//   }, [dropdownOpen]);

//   const openDropdown = useCallback(() => {
//     setDropdownOpen(true);
//     setTimeout(() => searchRef.current?.focus(), 60);
//   }, []);

//   const selectCountry = useCallback(
//     (country: Country) => {
//       onCountryChange(country);
//       setDropdownOpen(false);
//       setSearch("");
//       setTimeout(() => phoneRef.current?.focus(), 60);
//     },
//     [onCountryChange],
//   );

//   const filtered = search.trim()
//     ? countries.filter(
//         (c) =>
//           c.name.toLowerCase().includes(search.toLowerCase()) ||
//           c.dialCode.includes(search) ||
//           c.code.toLowerCase().includes(search.toLowerCase()),
//       )
//     : countries;

//   const hasError = !!(phoneError || countryError);
//   const error = phoneError || countryError;

//   return (
//     <div className="flex flex-col gap-1.5">
//       <label className={`font-outfit text-white ${dt.inputLabel}`}>
//         Phone Number
//       </label>

//       {/* Hidden inputs for server action */}
//       {selectedCountry && (
//         <input
//           type="hidden"
//           name={countryInputName}
//           value={selectedCountry.name}
//         />
//       )}

//       {/* Combined input row */}
//       <div
//         ref={containerRef}
//         className="relative flex items-stretch gap-0"
//         style={{
//           borderRadius: "1rem",
//           border: "1px solid",
//           borderColor: hasError
//             ? "rgba(239,68,68,0.5)"
//             : phoneFocused || dropdownOpen
//               ? "rgb(from var(--color-brand) r g b / 0.5)"
//               : "var(--color-border)",
//           boxShadow: hasError
//             ? "0 0 0 3px rgba(239,68,68,0.06)"
//             : phoneFocused || dropdownOpen
//               ? "0 0 0 3px rgb(from var(--color-brand) r g b / 0.06)"
//               : "none",
//           background: "var(--color-surface-card)",
//           overflow: "visible",
//           transition: "border-color 0.2s, box-shadow 0.2s",
//         }}
//       >
//         {/* Country trigger button */}
//         <button
//           type="button"
//           onClick={openDropdown}
//           className="flex items-center gap-1.5 px-3 py-3.5 cursor-pointer transition-colors duration-150 shrink-0 border-r"
//           style={{
//             borderColor: hasError
//               ? "rgba(239,68,68,0.2)"
//               : "var(--color-border)",
//             borderRadius: "1rem 0 0 1rem",
//             background: "transparent",
//             minWidth: "88px",
//           }}
//         >
//           {countriesLoading ? (
//             <Loader2 size={14} className="animate-spin text-text-muted" />
//           ) : selectedCountry ? (
//             <>
//               <span className="text-base leading-none">
//                 {selectedCountry.flag}
//               </span>
//               <span
//                 className="font-outfit text-sm font-medium tabular-nums"
//                 style={{ color: "var(--color-text)" }}
//               >
//                 {selectedCountry.dialCode}
//               </span>
//             </>
//           ) : (
//             <span
//               className="font-outfit text-sm"
//               style={{ color: "var(--color-text-muted)" }}
//             >
//               +XX
//             </span>
//           )}
//           <ChevronDown
//             size={13}
//             className={`transition-transform duration-200 shrink-0`}
//             style={{
//               color: "var(--color-text-muted)",
//               transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
//             }}
//           />
//         </button>

//         {/* Phone number input */}
//         <input
//           ref={phoneRef}
//           id={phoneInputName}
//           name={phoneInputName}
//           type="tel"
//           inputMode="numeric"
//           value={phoneValue}
//           onChange={(e) => onPhoneChange(e.target.value)}
//           onFocus={() => setPhoneFocused(true)}
//           onBlur={() => setPhoneFocused(false)}
//           placeholder={
//             selectedCountry?.code === "BD" ? "01XXXXXXXXX" : "Phone number"
//           }
//           autoComplete="tel-national"
//           className={`font-outfit flex-1 min-w-0 px-3 py-3.5 text-sm bg-transparent outline-none placeholder:text-text-muted ${
//             hasError ? "animate-[shake_0.4s_ease]" : ""
//           }`}
//           style={{
//             borderRadius: "0 1rem 1rem 0",
//             color: "var(--color-text)",
//           }}
//         />

//         {/* Dropdown */}
//         {dropdownOpen && (
//           <div
//             className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden z-50 animate-[fadeUp_0.15s_ease_both]"
//             style={{ minWidth: "260px" }}
//           >
//             {/* Search */}
//             <div className="p-2.5 border-b border-gray-100">
//               <div className="relative">
//                 <Search
//                   size={13}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//                 />
//                 <input
//                   ref={searchRef}
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search country or code..."
//                   className="font-outfit w-full pl-8 pr-8 py-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 outline-none focus:border-gray-300 transition-colors"
//                 />
//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() => setSearch("")}
//                     className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <X size={12} />
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Country list */}
//             <div className="max-h-56 overflow-y-auto overscroll-contain">
//               {countriesLoading ? (
//                 <div className="flex items-center justify-center gap-2 py-6">
//                   <Loader2 size={15} className="animate-spin text-brand" />
//                   <span className="text-gray-400 text-sm">Loading...</span>
//                 </div>
//               ) : filtered.length > 0 ? (
//                 filtered.map((country) => {
//                   const isSelected = selectedCountry?.code === country.code;
//                   return (
//                     <button
//                       key={country.code}
//                       type="button"
//                       onClick={() => selectCountry(country)}
//                       className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-100 cursor-pointer ${
//                         isSelected
//                           ? "bg-brand/8 text-brand"
//                           : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
//                       }`}
//                     >
//                       <span className="text-base leading-none w-5 text-center">
//                         {country.flag}
//                       </span>
//                       <span className="flex-1 truncate font-outfit">
//                         {country.name}
//                       </span>
//                       <span
//                         className="text-xs tabular-nums shrink-0 font-medium"
//                         style={{
//                           color: isSelected
//                             ? "var(--color-brand)"
//                             : "var(--color-text-muted)",
//                         }}
//                       >
//                         {country.dialCode}
//                       </span>
//                       {isSelected && (
//                         <Check size={13} className="text-brand shrink-0" />
//                       )}
//                     </button>
//                   );
//                 })
//               ) : (
//                 <div className="py-6 text-center">
//                   <p className="text-gray-400 text-sm">No countries found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Error / Hint */}
//       {error && (
//         <p
//           className={`${dt.inputError} text-xs mt-0.5 animate-[fadeIn_0.2s_ease]`}
//         >
//           {error}
//         </p>
//       )}
//       {!error && (
//         <p className={`${dt.inputHint} text-xs mt-0.5`}>
//           OTP will be sent to this number
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, X, Check, Loader2 } from "lucide-react";
import { dt } from "@/lib/design-tokens";
import type { Country } from "@/actions/geo/geo";

interface CountryPhoneInputProps {
  /** The raw local phone number (without dial code) */
  phoneValue: string;
  onPhoneChange: (value: string) => void;

  /** Selected country object */
  selectedCountry: Country | null;
  onCountryChange: (country: Country) => void;

  /** Countries list from API */
  countries: Country[];
  countriesLoading?: boolean;

  phoneError?: string;
  countryError?: string;

  /** hidden input names for server action */
  phoneInputName?: string;
  countryInputName?: string;
}

export default function CountryPhoneInput({
  phoneValue,
  onPhoneChange,
  selectedCountry,
  onCountryChange,
  countries,
  countriesLoading = false,
  phoneError,
  countryError,
  phoneInputName = "phone",
  countryInputName = "country",
}: CountryPhoneInputProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [phoneFocused, setPhoneFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [dropdownOpen]);

  const openDropdown = useCallback(() => {
    setDropdownOpen(true);
    setTimeout(() => searchRef.current?.focus(), 60);
  }, []);

  const selectCountry = useCallback(
    (country: Country) => {
      onCountryChange(country);
      setDropdownOpen(false);
      setSearch("");
      setTimeout(() => phoneRef.current?.focus(), 60);
    },
    [onCountryChange],
  );

  const filtered = search.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase()),
      )
    : countries;

  const hasError = !!(phoneError || countryError);
  const error = phoneError || countryError;

  return (
    <div className="flex flex-col gap-1.5">
      <label className={`font-outfit text-white ${dt.inputLabel}`}>
        Phone Number
      </label>

      {/* Hidden inputs for server action */}
      {selectedCountry && (
        <input
          type="hidden"
          name={countryInputName}
          value={selectedCountry.name}
        />
      )}

      {/* Combined input row */}
      <div
        ref={containerRef}
        className="relative flex items-stretch gap-0"
        style={{
          borderRadius: "1rem",
          border: "1px solid",
          borderColor: hasError
            ? "rgba(239,68,68,0.5)"
            : phoneFocused || dropdownOpen
              ? "rgb(from var(--color-brand) r g b / 0.5)"
              : "var(--color-border)",
          boxShadow: hasError
            ? "0 0 0 3px rgba(239,68,68,0.06)"
            : phoneFocused || dropdownOpen
              ? "0 0 0 3px rgb(from var(--color-brand) r g b / 0.06)"
              : "none",
          background: "var(--color-surface-card)",
          overflow: "visible",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {/* Country trigger button */}
        <button
          type="button"
          onClick={openDropdown}
          className="flex items-center gap-1.5 px-3 py-3.5 cursor-pointer transition-colors duration-150 shrink-0 border-r"
          style={{
            borderColor: hasError
              ? "rgba(239,68,68,0.2)"
              : "var(--color-border)",
            borderRadius: "1rem 0 0 1rem",
            background: "transparent",
            minWidth: "88px",
          }}
        >
          {countriesLoading ? (
            <Loader2 size={14} className="animate-spin text-text-muted" />
          ) : selectedCountry ? (
            <>
              <span className="text-base leading-none">
                {selectedCountry.flag}
              </span>
              <span
                className="font-outfit text-sm font-medium tabular-nums"
                style={{ color: "var(--color-text)" }}
              >
                {selectedCountry.dialCode}
              </span>
            </>
          ) : (
            <span
              className="font-outfit text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              +XX
            </span>
          )}
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 shrink-0`}
            style={{
              color: "var(--color-text-muted)",
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </button>

        {/* Phone number input */}
        <input
          ref={phoneRef}
          id={phoneInputName}
          name={phoneInputName}
          type="tel"
          inputMode="numeric"
          value={phoneValue}
          onChange={(e) => onPhoneChange(e.target.value)}
          onFocus={() => setPhoneFocused(true)}
          onBlur={() => setPhoneFocused(false)}
          placeholder={
            selectedCountry?.code === "BD" ? "01XXXXXXXXX" : "Phone number"
          }
          autoComplete="tel-national"
          className={`font-outfit flex-1 min-w-0 px-3 py-3.5 text-sm bg-transparent outline-none placeholder:text-text-muted ${
            hasError ? "animate-[shake_0.4s_ease]" : ""
          }`}
          style={{
            borderRadius: "0 1rem 1rem 0",
            color: "var(--color-text)",
          }}
        />

        {/* Dropdown */}
        {dropdownOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-black/10 bg-white shadow-2xl overflow-hidden z-50 animate-[fadeUp_0.15s_ease_both]"
            style={{ minWidth: "260px" }}
          >
            {/* Search */}
            <div className="p-2.5 border-b border-gray-100">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code..."
                  className="font-outfit w-full pl-8 pr-8 py-2 rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 outline-none focus:border-gray-300 transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Country list */}
            <div className="max-h-56 overflow-y-auto overscroll-contain">
              {countriesLoading ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 size={15} className="animate-spin text-brand" />
                  <span className="text-gray-400 text-sm">Loading...</span>
                </div>
              ) : filtered.length > 0 ? (
                filtered.map((country) => {
                  const isSelected = selectedCountry?.code === country.code;
                  return (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => selectCountry(country)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-all duration-100 cursor-pointer ${
                        isSelected
                          ? "bg-brand/8 text-brand"
                          : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                      }`}
                    >
                      <span className="text-base leading-none w-5 text-center">
                        {country.flag}
                      </span>
                      <span className="flex-1 truncate font-outfit">
                        {country.name}
                      </span>
                      <span
                        className="text-xs tabular-nums shrink-0 font-medium"
                        style={{
                          color: isSelected
                            ? "var(--color-brand)"
                            : "var(--color-text-muted)",
                        }}
                      >
                        {country.dialCode}
                      </span>
                      {isSelected && (
                        <Check size={13} className="text-brand shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-400 text-sm">No countries found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FIX: Error / Hint — improved contrast on hint text */}
      {error && (
        <p
          className={`${dt.inputError} text-xs mt-0.5 animate-[fadeIn_0.2s_ease]`}
        >
          {error}
        </p>
      )}
      {!error && (
        <p className="text-xs mt-0.5 text-slate-300 font-medium">
          OTP will be sent to this number
        </p>
      )}
    </div>
  );
}
