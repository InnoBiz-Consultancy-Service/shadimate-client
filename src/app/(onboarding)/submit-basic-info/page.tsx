"use client";

import { useBasicInfoForm, STEPS } from "@/hooks/onboarding/useBasicInfoForm";
import SearchableDropdown from "@/components/onboarding/SearchableDropdown";

/* ── Heart SVG ── */
const HeartIcon = () => (
  <svg viewBox="0 0 100 90" className="w-8 h-8 fill-brand opacity-80">
    <path d="M50 85 C30 68 5 55 5 33 C5 14 20 5 35 5 C43 5 50 11 50 11 C50 11 57 5 65 5 C80 5 95 14 95 33 C95 55 70 68 50 85Z" />
  </svg>
);

/* ── Progress Step ── */
const Step = ({
  num,
  label,
  active,
  done,
}: {
  num: number;
  label: string;
  active: boolean;
  done: boolean;
}) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
        done
          ? "bg-brand border-brand text-on-brand"
          : active
            ? "border-brand text-brand bg-brand/10"
            : "border-white/15 text-white/30 bg-transparent"
      }`}
    >
      {done ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8L6.5 11.5L13 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        num
      )}
    </div>
    <span
      className={`text-sm font-medium ${
        active ? "text-white" : done ? "text-slate-400" : "text-white/30"
      }`}
    >
      {label}
    </span>
  </div>
);

/* ── Input field (for non-searchable fields) ── */
const Field = ({
  label,
  name,
  type = "text",
  placeholder,
  required,
  options,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}) => {
  const base =
    "font-outfit w-full px-4 py-3.5 rounded-2xl text-sm text-slate-100 placeholder-slate-600 border transition-all duration-200 outline-none border-white/10 bg-white/5 focus:border-[rgb(from_var(--brand)_r_g_b_/_0.5)] focus:bg-[rgb(from_var(--brand)_r_g_b_/_0.04)] focus:shadow-[0_0_0_3px_rgb(from_var(--brand)_r_g_b_/_0.08)]";

  if (options) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase">
          {label}
        </label>
        <select
          name={name}
          required={required}
          className={`${base} appearance-none`}
        >
          <option value="" disabled>
            {placeholder ?? "Select…"}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={base}
      />
    </div>
  );
};

/* ── University Type Badge ── */
const UniversityBadge = ({ type }: { type: string }) => (
  <span
    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
      type === "govt"
        ? "bg-emerald-500/15 text-emerald-400"
        : "bg-violet-500/15 text-violet-400"
    }`}
  >
    {type === "govt" ? "Govt" : "Private"}
  </span>
);

/* ══════════════════════════════════════════════════════════
   Page Component
══════════════════════════════════════════════════════════ */

export default function SubmitBasicInfoPage() {
  const { step, submitting, submitted, geo, uni, prevStep, handleSubmit } =
    useBasicInfoForm();

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-6">
        <div className="animate-[pop_0.5s_ease_both] w-24 h-24 rounded-full flex items-center justify-center bg-linear-to-br from-brand to-accent shadow-(--shadow-brand-lg)">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M8 20L16 28L32 12"
              stroke="var(--on-brand)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="font-syne text-white text-3xl font-extrabold tracking-tight">
          Profile Complete!
        </h2>
        <p className="font-outfit text-slate-400 text-sm max-w-xs">
          Redirecting you to your personalised dashboard…
        </p>
      </div>
    );
  }

  return (
    <div className="font-outfit min-h-screen w-full flex flex-col items-center justify-center px-5 py-14">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 animate-[fadeUp_0.5s_ease_both]">
          <HeartIcon />
          <div>
            <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight">
              Complete Your Profile
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Step {step} of {STEPS.length} — You can{"'"}t skip this
            </p>
          </div>
        </div>

        {/* Progress steps */}
        <div className="flex flex-col gap-3 mb-10 animate-[fadeUp_0.5s_ease_0.05s_both]">
          {STEPS.map((label, i) => (
            <Step
              key={label}
              num={i + 1}
              label={label}
              active={step === i + 1}
              done={step > i + 1}
            />
          ))}
        </div>

        {/* ── Card ── */}
        <div className="glass-card relative rounded-[28px] p-8 animate-[fadeUp_0.5s_ease_0.1s_both]">
          <div className="noise-layer absolute inset-0 opacity-[0.02] pointer-events-none" />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(from var(--brand) r g b / 0.5), transparent)",
            }}
          />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ── Step 1: Basic Info ── */}
            {step === 1 && (
              <>
                <Field
                  label="Full Name"
                  name="name"
                  placeholder="Your full name"
                  required
                />
                <Field label="Date of Birth" name="dob" type="date" required />

                {/* Division */}
                <SearchableDropdown
                  label="Division"
                  placeholder="Select division"
                  name="divisionId"
                  options={geo.divisions}
                  loading={geo.divisionsLoading}
                  selectedId={geo.selection.divisionId}
                  selectedName={geo.selection.divisionName}
                  searchValue={geo.divisionSearch}
                  onSearchChange={geo.setDivisionSearch}
                  onSelect={geo.selectDivision}
                  onOpen={geo.loadDivisions}
                />

                {/* District */}
                <SearchableDropdown
                  label="District"
                  placeholder={
                    geo.selection.divisionId
                      ? "Select district"
                      : "Select division first"
                  }
                  name="districtId"
                  options={geo.districts}
                  loading={geo.districtsLoading}
                  disabled={!geo.selection.divisionId}
                  selectedId={geo.selection.districtId}
                  selectedName={geo.selection.districtName}
                  searchValue={geo.districtSearch}
                  onSearchChange={geo.setDistrictSearch}
                  onSelect={geo.selectDistrict}
                  onOpen={geo.loadDistricts}
                />

                {/* Thana */}
                <SearchableDropdown
                  label="Thana"
                  placeholder={
                    geo.selection.districtId
                      ? "Select thana"
                      : "Select district first"
                  }
                  name="thanaId"
                  options={geo.thanas}
                  loading={geo.thanasLoading}
                  disabled={!geo.selection.districtId}
                  selectedId={geo.selection.thanaId}
                  selectedName={geo.selection.thanaName}
                  searchValue={geo.thanaSearch}
                  onSearchChange={geo.setThanaSearch}
                  onSelect={geo.selectThana}
                  onOpen={geo.loadThanas}
                />
              </>
            )}

            {/* ── Step 2: Appearance ── */}
            {step === 2 && (
              <>
                <Field
                  label="Height (cm)"
                  name="height"
                  type="number"
                  placeholder="e.g. 170"
                  required
                />
                <Field
                  label="Skin Tone"
                  name="skinTone"
                  options={["Fair", "Medium", "Olive", "Tan", "Dark"]}
                  placeholder="Select skin tone"
                />
                <Field
                  label="Body Type"
                  name="bodyType"
                  options={["Slim", "Athletic", "Average", "Heavyset"]}
                  placeholder="Select body type"
                />
              </>
            )}

            {/* ── Step 3: Preferences ── */}
            {step === 3 && (
              <>
                <Field
                  label="Education Level"
                  name="education"
                  options={[
                    "Secondary",
                    "Higher Secondary",
                    "Bachelor",
                    "Master",
                    "PhD",
                    "Other",
                  ]}
                  placeholder="Select education"
                />

                {/* University — with type filter */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] font-semibold tracking-[0.12em] uppercase">
                      University
                    </span>
                    <div className="flex gap-1.5">
                      {(
                        [
                          { label: "All", value: undefined },
                          { label: "Govt", value: "govt" as const },
                          { label: "Private", value: "private" as const },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.label}
                          type="button"
                          onClick={() => uni.setFilterType(f.value)}
                          className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer border ${
                            uni.filterType === f.value
                              ? "bg-brand/15 text-brand border-brand/30"
                              : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/8"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <SearchableDropdown
                    label=""
                    placeholder="Search university…"
                    name="universityId"
                    options={uni.universities}
                    loading={uni.loading}
                    selectedId={uni.selection.universityId}
                    selectedName={uni.selection.universityName}
                    searchValue={uni.search}
                    onSearchChange={uni.setSearch}
                    onSelect={uni.selectUniversity}
                    onOpen={uni.loadUniversities}
                    renderExtra={(opt) => {
                      const typedOpt = opt as { type?: string };
                      return typedOpt.type ? (
                        <UniversityBadge type={typedOpt.type} />
                      ) : null;
                    }}
                  />
                </div>

                <Field
                  label="Profession"
                  name="profession"
                  placeholder="e.g. Software Engineer"
                  required
                />
                <Field
                  label="Marital Status"
                  name="maritalStatus"
                  options={["Never Married", "Divorced", "Widowed"]}
                  placeholder="Select status"
                />
              </>
            )}

            {/* ── Step 4: Final confirmation ── */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-5">
                  <HeartIcon />
                </div>
                <h3 className="font-syne text-white text-xl font-bold mb-2">
                  Ready to find your match?
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                  Review your info and submit. You can always update these
                  details later from your profile settings.
                </p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex gap-3 mt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3.5 rounded-2xl border border-white/10 text-slate-300 text-sm font-semibold hover:bg-white/5 transition-all duration-200 cursor-pointer bg-transparent"
                >
                  ← Back
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm tracking-[0.05em] text-on-brand bg-linear-to-r from-brand to-accent shadow-(--shadow-brand-md) hover:scale-[1.02] hover:shadow-(--shadow-btn-hover) active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border-0 relative overflow-hidden group ${
                  step === 1 ? "w-full" : ""
                }`}
              >
                <span className="relative z-10">
                  {submitting
                    ? "Submitting…"
                    : step < STEPS.length
                      ? "Continue →"
                      : "Submit Profile"}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </form>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-[28px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgb(from var(--accent) r g b / 0.2), transparent)",
            }}
          />
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          © 2026 Shadimate · This step is required to continue
        </p>
      </div>
    </div>
  );
}
