"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Ruler,
  MapPin,
  GraduationCap,
  BookOpen,
  Heart,
  Users,
  Sparkles,
  AlertCircle,
  Edit2,
  Eye,
} from "lucide-react";
import { updateProfile, createProfile } from "@/actions/profile/profile";
import {
  fetchDivisions,
  fetchDistricts,
  fetchThanas,
  fetchUniversities,
  type Division,
  type District,
  type Thana,
  type University,
} from "@/actions/geo/geo";
import {
  Logo,
  Toast,
  GlassCard,
  GradientButton,
  SearchableDropdown,
} from "@/components/ui";
import {
  RELATION_OPTIONS,
  EDUCATION_VARIETY_OPTIONS,
  FAITH_OPTIONS,
  PRACTICE_LEVEL_OPTIONS,
  PERSONALITY_OPTIONS,
  HABIT_OPTIONS,
  ECONOMICAL_STATUS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  SKIN_TONE_OPTIONS,
} from "@/constants/profile";
import { useDebounce } from "@/hooks/useDebounce";
import type { Profile, ToastData } from "@/types";

/* ─────────────────────────────────────────
   Step config
───────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Basic Info", icon: User },
  { id: 2, label: "Physical", icon: Ruler },
  { id: 3, label: "Address", icon: MapPin },
  { id: 4, label: "Education", icon: GraduationCap },
  { id: 5, label: "Religion", icon: BookOpen },
  { id: 6, label: "Family", icon: Users },
  { id: 7, label: "Interests", icon: Sparkles },
];

const TOTAL_STEPS = STEPS.length; // 7 — preview is step 8

/* ─────────────────────────────────────────
   Reusable field components
───────────────────────────────────────── */
const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={name}
      className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase"
    >
      {label}
      {required && <span className="text-brand ml-1">*</span>}
    </label>
    <input
      id={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`font-outfit w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border outline-none transition-all duration-200
        ${error ? "border-red-500/60 bg-red-500/5 focus:border-red-500/80" : "border-white/10 focus:border-brand/50 focus:bg-white/8"}`}
    />
    {error && (
      <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={name}
      className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase"
    >
      {label}
      {required && <span className="text-brand ml-1">*</span>}
    </label>
    <select
      id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`font-outfit w-full px-4 py-3 rounded-xl text-sm text-slate-100 bg-white/5 border outline-none transition-all duration-200 appearance-none cursor-pointer
        ${error ? "border-red-500/60 bg-red-500/5 focus:border-red-500/80" : "border-white/10 focus:border-brand/50"}`}
    >
      <option value="">{placeholder || "Select"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && (
      <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

/* helpers */
function geoId(
  val: string | { _id: string; name: string } | undefined,
): string {
  if (!val) return "";
  return typeof val === "string" ? val : val._id;
}
function geoName(
  val: string | { _id: string; name: string } | undefined,
): string {
  if (!val) return "";
  return typeof val === "string" ? "" : val.name;
}

/* ─────────────────────────────────────────
   Progress Bar
───────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((s) => {
          const done = current > s.id;
          const active = current === s.id;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className="flex flex-col items-center gap-1.5 relative"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${
                    done
                      ? "bg-brand border-brand shadow-[var(--shadow-brand-sm)]"
                      : active
                        ? "bg-brand/15 border-brand shadow-[var(--shadow-brand-xs)]"
                        : "bg-white/5 border-white/10"
                  }`}
              >
                {done ? (
                  <Check size={15} className="text-on-brand" />
                ) : (
                  <Icon
                    size={15}
                    className={active ? "text-brand" : "text-slate-500"}
                  />
                )}
              </div>
              <span
                className={`font-outfit text-[9px] font-semibold tracking-wide hidden sm:block
                  ${active ? "text-brand" : done ? "text-slate-400" : "text-slate-600"}`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-brand to-accent transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="font-outfit text-xs text-slate-500">
          Step {current} of {total}
        </span>
        <span className="font-outfit text-xs text-brand font-semibold">
          {STEPS[current - 1].label}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Preview Card Row
───────────────────────────────────────── */
function PreviewRow({
  label,
  value,
}: {
  label: string;
  value?: string | string[];
}) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-outfit text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500">
        {label}
      </span>
      <span className="font-outfit text-sm text-slate-200">
        {Array.isArray(value) ? value.join(", ") : value}
      </span>
    </div>
  );
}

function PreviewSection({
  title,
  stepId,
  icon: Icon,
  onEdit,
  children,
}: {
  title: string;
  stepId: number;
  icon: React.ElementType;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white/4 border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/3 border-b border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand/15 border border-brand/25 flex items-center justify-center">
            <Icon size={13} className="text-brand" />
          </div>
          <span className="font-syne text-white text-sm font-bold">
            {title}
          </span>
        </div>
        <button
          onClick={() => onEdit(stepId)}
          className="flex items-center gap-1.5 text-xs font-outfit font-semibold text-brand/80 hover:text-brand transition-colors bg-brand/8 hover:bg-brand/15 border border-brand/20 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <Edit2 size={11} /> Edit
        </button>
      </div>
      <div className="px-4 py-4 grid grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function ProfileEditClient({ profile }: { profile?: Profile }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const hideToast = useCallback(() => setToast(null), []);

  /* ── Form state ── */
  const [profession, setProfession] = useState(profile?.profession || "");
  const [personality, setPersonality] = useState(profile?.personality || "");
  const [birthDate, setBirthDate] = useState(
    profile?.birthDate?.split("T")[0] || "",
  );
  const [maritalStatus, setMaritalStatus] = useState(
    profile?.maritalStatus || "",
  );
  const [economicalStatus, setEconomicalStatus] = useState(
    profile?.economicalStatus || "",
  );
  const [salaryRange, setSalaryRange] = useState(profile?.salaryRange || "");
  const [aboutMe, setAboutMe] = useState(profile?.aboutMe || "");

  const [height, setHeight] = useState(profile?.height || "");
  const [weight, setWeight] = useState(profile?.weight || "");
  const [skinTone, setSkinTone] = useState(profile?.skinTone || "");

  const [divisionId, setDivisionId] = useState(
    geoId(profile?.address?.divisionId),
  );
  const [divisionName, setDivisionName] = useState(
    geoName(profile?.address?.divisionId),
  );
  const [districtId, setDistrictId] = useState(
    geoId(profile?.address?.districtId),
  );
  const [districtName, setDistrictName] = useState(
    geoName(profile?.address?.districtId),
  );
  const [thanaId, setThanaId] = useState(geoId(profile?.address?.thanaId));
  const [thanaName, setThanaName] = useState(
    geoName(profile?.address?.thanaId),
  );
  const [addressDetails, setAddressDetails] = useState(
    profile?.address?.details || "",
  );

  const [eduVariety, setEduVariety] = useState(
    profile?.education?.graduation?.variety || "",
  );
  const [department, setDepartment] = useState(
    profile?.education?.graduation?.department || "",
  );
  const [institution, setInstitution] = useState(
    profile?.education?.graduation?.institution || "",
  );
  const [passingYear, setPassingYear] = useState(
    profile?.education?.graduation?.passingYear || "",
  );
  const [collegeName, setCollegeName] = useState(
    profile?.education?.graduation?.collegeName || "",
  );
  const [universityId, setUniversityId] = useState(
    geoId(profile?.education?.graduation?.universityId),
  );
  const [universityName, setUniversityName] = useState(
    geoName(profile?.education?.graduation?.universityId),
  );

  const [faith, setFaith] = useState(profile?.religion?.faith || "");
  const [sectOrCaste, setSectOrCaste] = useState(
    profile?.religion?.sectOrCaste || "",
  );
  const [practiceLevel, setPracticeLevel] = useState(
    profile?.religion?.practiceLevel || "",
  );
  const [dailyLifestyle, setDailyLifestyle] = useState(
    profile?.religion?.dailyLifeStyleSummary || "",
  );
  const [religiousDetails, setReligiousDetails] = useState(
    profile?.religion?.religiousLifestyleDetails || "",
  );

  const [relation, setRelation] = useState(profile?.relation || "");
  const [fatherOcc, setFatherOcc] = useState(profile?.fatherOccupation || "");
  const [motherOcc, setMotherOcc] = useState(profile?.motherOccupation || "");

  const [habits, setHabits] = useState<string[]>(profile?.habits || []);

  /* ── Geo data ── */
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  const [divSearch, setDivSearch] = useState("");
  const [distSearch, setDistSearch] = useState("");
  const [thanaSearch, setThanaSearch] = useState("");
  const [uniSearch, setUniSearch] = useState("");

  const [divLoading, setDivLoading] = useState(false);
  const [distLoading, setDistLoading] = useState(false);
  const [thanaLoading, setThanaLoading] = useState(false);
  const [uniLoading, setUniLoading] = useState(false);

  const debouncedDiv = useDebounce(divSearch, 300);
  const debouncedDist = useDebounce(distSearch, 300);
  const debouncedThana = useDebounce(thanaSearch, 300);
  const debouncedUni = useDebounce(uniSearch, 300);

  const loadDivisions = useCallback(async () => {
    setDivLoading(true);
    setDivisions(await fetchDivisions(debouncedDiv));
    setDivLoading(false);
  }, [debouncedDiv]);

  const loadDistricts = useCallback(async () => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    setDistLoading(true);
    setDistricts(await fetchDistricts(divisionId, debouncedDist));
    setDistLoading(false);
  }, [divisionId, debouncedDist]);

  const loadThanas = useCallback(async () => {
    if (!districtId) {
      setThanas([]);
      return;
    }
    setThanaLoading(true);
    setThanas(await fetchThanas(districtId, debouncedThana));
    setThanaLoading(false);
  }, [districtId, debouncedThana]);

  const loadUniversities = useCallback(async () => {
    setUniLoading(true);
    setUniversities(await fetchUniversities(debouncedUni));
    setUniLoading(false);
  }, [debouncedUni]);

  useEffect(() => {
    if (step === 3) loadDivisions();
  }, [debouncedDiv, step]);
  useEffect(() => {
    if (step === 3) loadDistricts();
  }, [divisionId, debouncedDist, step]);
  useEffect(() => {
    if (step === 3) loadThanas();
  }, [districtId, debouncedThana, step]);
  useEffect(() => {
    if (step === 4) loadUniversities();
  }, [debouncedUni, step]);

  const toggleHabit = (h: string) =>
    setHabits((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
    );

  /* ─────────────────────────────────────────
     Validation per step
  ───────────────────────────────────────── */
  const validateStep = (s: number): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!profession.trim()) errs.profession = "Profession is required";
      if (!birthDate) errs.birthDate = "Date of birth is required";
      if (!maritalStatus) errs.maritalStatus = "Please select marital status";
      if (!economicalStatus)
        errs.economicalStatus = "Please select economic status";
      if (!aboutMe.trim())
        errs.aboutMe = "Please write something about yourself";
    }

    if (s === 2) {
      if (!height.trim()) errs.height = "Height is required";
      if (!weight.trim()) errs.weight = "Weight is required";
      if (!skinTone) errs.skinTone = "Please select skin tone";
    }

    if (s === 3) {
      if (!divisionId) errs.divisionId = "Please select a division";
      if (!districtId) errs.districtId = "Please select a district";
      if (!thanaId) errs.thanaId = "Please select a thana";
    }

    if (s === 4) {
      if (!eduVariety) errs.eduVariety = "Education type is required";
      if (!universityId) errs.universityId = "Please select a university";
      if (!department.trim()) errs.department = "Department is required";
    }

    if (s === 5) {
      if (!faith) errs.faith = "Please select your religion";
      if (!practiceLevel) errs.practiceLevel = "Please select practice level";
    }

    if (s === 6) {
      if (!relation) errs.relation = "Please select guardian relation";
      if (!fatherOcc.trim()) errs.fatherOcc = "Father's occupation is required";
      if (!motherOcc.trim()) errs.motherOcc = "Mother's occupation is required";
    }

    if (s === 7) {
      if (habits.length === 0)
        errs.habits = "Please select at least one habit or interest";
    }

    return errs;
  };

  /* clear field-level error when user fixes it */
  const clearError = (key: string) =>
    setErrors((prev) => {
      const n = { ...prev };
      delete n[key];
      return n;
    });

  /* ── Navigation with validation ── */
  const next = () => {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to top of card so user sees errors
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors({});
    if (step === TOTAL_STEPS) {
      setShowPreview(true);
    } else {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    setErrors({});
    if (showPreview) {
      setShowPreview(false);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const editFromPreview = (targetStep: number) => {
    setShowPreview(false);
    setStep(targetStep);
  };

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = {};
    if (profession) payload.profession = profession;
    if (salaryRange) payload.salaryRange = salaryRange;
    if (economicalStatus) payload.economicalStatus = economicalStatus;
    if (personality) payload.personality = personality;
    if (birthDate) payload.birthDate = birthDate;
    if (aboutMe) payload.aboutMe = aboutMe;
    if (height) payload.height = height;
    if (weight) payload.weight = weight;
    if (skinTone) payload.skinTone = skinTone;
    if (maritalStatus) payload.maritalStatus = maritalStatus;
    if (habits.length) payload.habits = habits;
    if (divisionId) {
      payload.address = {
        divisionId,
        districtId: districtId || undefined,
        thanaId: thanaId || undefined,
        details: addressDetails || undefined,
      };
    }
    if (eduVariety || universityId || department) {
      payload.education = {
        graduation: {
          variety: eduVariety || undefined,
          universityId: universityId || undefined,
          department: department || undefined,
          institution: institution || undefined,
          passingYear: passingYear || undefined,
          collegeName: collegeName || undefined,
        },
      };
    }
    if (faith) {
      payload.religion = {
        faith,
        sectOrCaste: sectOrCaste || undefined,
        practiceLevel: practiceLevel || undefined,
        dailyLifeStyleSummary: dailyLifestyle || undefined,
        religiousLifestyleDetails: religiousDetails || undefined,
      };
    }
    if (relation) payload.relation = relation;
    if (fatherOcc) payload.fatherOccupation = fatherOcc;
    if (motherOcc) payload.motherOccupation = motherOcc;

    const res = profile
      ? await updateProfile(payload)
      : await createProfile(payload);
    setSaving(false);
    setToast({ message: res.message, type: res.success ? "success" : "error" });
    if (res.success) setTimeout(() => router.push("/feed"), 1500);
  };

  /* ─────────────────────────────────────────
     Preview page
  ───────────────────────────────────────── */
  const renderPreview = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
            <Eye size={15} className="text-brand" />
          </div>
          <h2 className="font-syne text-white text-xl font-extrabold tracking-tight">
            Your Biodata Preview
          </h2>
        </div>
        <p className="font-outfit text-slate-400 text-sm">
          Review everything before submitting. Tap{" "}
          <span className="text-brand font-semibold">Edit</span> on any section
          to make changes.
        </p>
      </div>

      {/* Section: Basic Info */}
      <PreviewSection
        title="Basic Info"
        stepId={1}
        icon={User}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Profession" value={profession} />
        <PreviewRow label="Date of Birth" value={birthDate} />
        <PreviewRow label="Marital Status" value={maritalStatus} />
        <PreviewRow label="Personality" value={personality} />
        <PreviewRow label="Economic Status" value={economicalStatus} />
        <PreviewRow label="Salary Range" value={salaryRange} />
        {aboutMe && (
          <div className="col-span-2 flex flex-col gap-0.5">
            <span className="font-outfit text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500">
              About Me
            </span>
            <span className="font-outfit text-sm text-slate-200 leading-relaxed">
              {aboutMe}
            </span>
          </div>
        )}
      </PreviewSection>

      {/* Section: Physical */}
      <PreviewSection
        title="Physical"
        stepId={2}
        icon={Ruler}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Height" value={height ? `${height} cm` : ""} />
        <PreviewRow label="Weight" value={weight ? `${weight} kg` : ""} />
        <PreviewRow label="Skin Tone" value={skinTone} />
      </PreviewSection>

      {/* Section: Address */}
      <PreviewSection
        title="Address"
        stepId={3}
        icon={MapPin}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Division" value={divisionName} />
        <PreviewRow label="District" value={districtName} />
        <PreviewRow label="Thana" value={thanaName} />
        <PreviewRow label="Details" value={addressDetails} />
      </PreviewSection>

      {/* Section: Education */}
      <PreviewSection
        title="Education"
        stepId={4}
        icon={GraduationCap}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Type" value={eduVariety} />
        <PreviewRow label="University" value={universityName} />
        <PreviewRow label="Department" value={department} />
        <PreviewRow label="Institution" value={institution} />
        <PreviewRow label="Passing Year" value={passingYear} />
        <PreviewRow label="College" value={collegeName} />
      </PreviewSection>

      {/* Section: Religion */}
      <PreviewSection
        title="Religion"
        stepId={5}
        icon={BookOpen}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Faith" value={faith} />
        <PreviewRow label="Practice Level" value={practiceLevel} />
        <PreviewRow label="Sect / Clan" value={sectOrCaste} />
        <PreviewRow label="Daily Lifestyle" value={dailyLifestyle} />
        {religiousDetails && (
          <div className="col-span-2 flex flex-col gap-0.5">
            <span className="font-outfit text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500">
              Religious Details
            </span>
            <span className="font-outfit text-sm text-slate-200 leading-relaxed">
              {religiousDetails}
            </span>
          </div>
        )}
      </PreviewSection>

      {/* Section: Family */}
      <PreviewSection
        title="Family"
        stepId={6}
        icon={Users}
        onEdit={editFromPreview}
      >
        <PreviewRow label="Guardian Relation" value={relation} />
        <PreviewRow label="Father's Occupation" value={fatherOcc} />
        <PreviewRow label="Mother's Occupation" value={motherOcc} />
      </PreviewSection>

      {/* Section: Interests */}
      <PreviewSection
        title="Interests & Habits"
        stepId={7}
        icon={Sparkles}
        onEdit={editFromPreview}
      >
        {habits.length > 0 && (
          <div className="col-span-2">
            <span className="font-outfit text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500 block mb-2">
              Selected Habits
            </span>
            <div className="flex flex-wrap gap-2">
              {habits.map((h) => (
                <span
                  key={h}
                  className="font-outfit text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand/12 border border-brand/25 text-brand"
                >
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}
      </PreviewSection>

      {/* Submit notice */}
      <div className="rounded-2xl bg-brand/5 border border-brand/20 p-4 mt-2">
        <p className="font-outfit text-slate-300 text-sm leading-relaxed">
          🎉 Everything looks good! Press{" "}
          <span className="text-brand font-semibold">
            {profile ? "Update Profile" : "Create Profile"}
          </span>{" "}
          below to save your biodata.
        </p>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     Step content
  ───────────────────────────────────────── */
  const renderStep = () => {
    switch (step) {
      /* STEP 1 — Basic Info */
      case 1:
        return (
          <div className="space-y-4">
            <StepTitle
              title="Basic Information"
              subtitle="Tell us about yourself to find the best match"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Profession"
                name="profession"
                value={profession}
                onChange={(v) => {
                  setProfession(v);
                  clearError("profession");
                }}
                placeholder="e.g. Software Engineer"
                required
                error={errors.profession}
              />
              <Field
                label="Date of Birth"
                name="birthDate"
                type="date"
                value={birthDate}
                onChange={(v) => {
                  setBirthDate(v);
                  clearError("birthDate");
                }}
                required
                error={errors.birthDate}
              />
              <Select
                label="Personality"
                name="personality"
                value={personality}
                onChange={setPersonality}
                options={PERSONALITY_OPTIONS}
              />
              <Select
                label="Marital Status"
                name="maritalStatus"
                value={maritalStatus}
                onChange={(v) => {
                  setMaritalStatus(v);
                  clearError("maritalStatus");
                }}
                options={MARITAL_STATUS_OPTIONS}
                required
                error={errors.maritalStatus}
              />
              <Select
                label="Economic Status"
                name="economicalStatus"
                value={economicalStatus}
                onChange={(v) => {
                  setEconomicalStatus(v);
                  clearError("economicalStatus");
                }}
                options={ECONOMICAL_STATUS_OPTIONS}
                required
                error={errors.economicalStatus}
              />
              <Field
                label="Salary Range"
                name="salaryRange"
                value={salaryRange}
                onChange={setSalaryRange}
                placeholder="e.g. 50,000 – 80,000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase">
                About Me <span className="text-brand ml-1">*</span>
              </label>
              <textarea
                value={aboutMe}
                onChange={(e) => {
                  setAboutMe(e.target.value);
                  clearError("aboutMe");
                }}
                rows={3}
                placeholder="Write something about yourself..."
                className={`font-outfit w-full px-4 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border outline-none transition-all duration-200 resize-none
                  ${errors.aboutMe ? "border-red-500/60 bg-red-500/5" : "border-white/10 focus:border-brand/50"}`}
              />
              {errors.aboutMe && (
                <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
                  <AlertCircle size={11} /> {errors.aboutMe}
                </p>
              )}
            </div>
          </div>
        );

      /* STEP 2 — Physical */
      case 2:
        return (
          <div className="space-y-4">
            <StepTitle
              title="Physical Information"
              subtitle="Your appearance helps find compatible matches"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Height (cm)"
                name="height"
                value={height}
                onChange={(v) => {
                  setHeight(v);
                  clearError("height");
                }}
                placeholder="e.g. 170"
                required
                error={errors.height}
              />
              <Field
                label="Weight (kg)"
                name="weight"
                value={weight}
                onChange={(v) => {
                  setWeight(v);
                  clearError("weight");
                }}
                placeholder="e.g. 65"
                required
                error={errors.weight}
              />
              <Select
                label="Skin Tone"
                name="skinTone"
                value={skinTone}
                onChange={(v) => {
                  setSkinTone(v);
                  clearError("skinTone");
                }}
                options={SKIN_TONE_OPTIONS}
                required
                error={errors.skinTone}
              />
            </div>
          </div>
        );

      /* STEP 3 — Address */
      case 3:
        return (
          <div className="space-y-4">
            <StepTitle
              title="Your Address"
              subtitle="Where are you based? This helps find nearby matches"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <SearchableDropdown
                  label="Division *"
                  placeholder="Select Division"
                  options={divisions}
                  loading={divLoading}
                  selectedId={divisionId}
                  selectedName={divisionName}
                  searchValue={divSearch}
                  onSearchChange={setDivSearch}
                  onSelect={(id, n) => {
                    setDivisionId(id);
                    setDivisionName(n);
                    setDistrictId("");
                    setDistrictName("");
                    setThanaId("");
                    setThanaName("");
                    clearError("divisionId");
                  }}
                  onOpen={loadDivisions}
                />
                {errors.divisionId && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
                    <AlertCircle size={11} /> {errors.divisionId}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <SearchableDropdown
                  label="District *"
                  placeholder={
                    divisionId ? "Select District" : "Select Division First"
                  }
                  options={districts}
                  loading={distLoading}
                  disabled={!divisionId}
                  selectedId={districtId}
                  selectedName={districtName}
                  searchValue={distSearch}
                  onSearchChange={setDistSearch}
                  onSelect={(id, n) => {
                    setDistrictId(id);
                    setDistrictName(n);
                    setThanaId("");
                    setThanaName("");
                    clearError("districtId");
                  }}
                  onOpen={loadDistricts}
                />
                {errors.districtId && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
                    <AlertCircle size={11} /> {errors.districtId}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <SearchableDropdown
                  label="Thana *"
                  placeholder={
                    districtId ? "Select Thana" : "Select District First"
                  }
                  options={thanas}
                  loading={thanaLoading}
                  disabled={!districtId}
                  selectedId={thanaId}
                  selectedName={thanaName}
                  searchValue={thanaSearch}
                  onSearchChange={setThanaSearch}
                  onSelect={(id, n) => {
                    setThanaId(id);
                    setThanaName(n);
                    clearError("thanaId");
                  }}
                  onOpen={loadThanas}
                />
                {errors.thanaId && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
                    <AlertCircle size={11} /> {errors.thanaId}
                  </p>
                )}
              </div>

              <Field
                label="Detailed Address"
                name="addressDetails"
                value={addressDetails}
                onChange={setAddressDetails}
                placeholder="House No, Road, Area"
              />
            </div>
          </div>
        );

      /* STEP 4 — Education */
      case 4:
        return (
          <div className="space-y-4">
            <StepTitle title="Education" subtitle="Your academic background" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Education Type"
                name="eduVariety"
                value={eduVariety}
                onChange={(v) => {
                  setEduVariety(v);
                  clearError("eduVariety");
                }}
                options={EDUCATION_VARIETY_OPTIONS}
                required
                error={errors.eduVariety}
              />
              <div className="flex flex-col gap-1.5">
                <SearchableDropdown
                  label="University *"
                  placeholder="Search University"
                  options={universities}
                  loading={uniLoading}
                  selectedId={universityId}
                  selectedName={universityName}
                  searchValue={uniSearch}
                  onSearchChange={setUniSearch}
                  onSelect={(id, n) => {
                    setUniversityId(id);
                    setUniversityName(n);
                    clearError("universityId");
                  }}
                  onOpen={loadUniversities}
                  renderExtra={(opt) =>
                    (opt as University).shortName ? (
                      <span className="text-xs text-slate-500 shrink-0">
                        {(opt as University).shortName}
                      </span>
                    ) : null
                  }
                />
                {errors.universityId && (
                  <p className="flex items-center gap-1 text-[11px] text-red-400 font-outfit">
                    <AlertCircle size={11} /> {errors.universityId}
                  </p>
                )}
              </div>
              <Field
                label="Department / Subject"
                name="department"
                value={department}
                onChange={(v) => {
                  setDepartment(v);
                  clearError("department");
                }}
                placeholder="Computer Science"
                required
                error={errors.department}
              />
              <Field
                label="Institution Name"
                name="institution"
                value={institution}
                onChange={setInstitution}
                placeholder="Dhaka University"
              />
              <Field
                label="Passing Year"
                name="passingYear"
                value={passingYear}
                onChange={setPassingYear}
                placeholder="2020"
              />
              <Field
                label="College Name"
                name="collegeName"
                value={collegeName}
                onChange={setCollegeName}
                placeholder="Dhaka College"
              />
            </div>
          </div>
        );

      /* STEP 5 — Religion */
      case 5:
        return (
          <div className="space-y-4">
            <StepTitle
              title="Religious Information"
              subtitle="Faith and lifestyle compatibility matters"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Religion"
                name="faith"
                value={faith}
                onChange={(v) => {
                  setFaith(v);
                  clearError("faith");
                }}
                options={FAITH_OPTIONS}
                required
                error={errors.faith}
              />
              <Select
                label="Practice Level"
                name="practiceLevel"
                value={practiceLevel}
                onChange={(v) => {
                  setPracticeLevel(v);
                  clearError("practiceLevel");
                }}
                options={PRACTICE_LEVEL_OPTIONS}
                required
                error={errors.practiceLevel}
              />
              <Field
                label="Sect / Clan"
                name="sectOrCaste"
                value={sectOrCaste}
                onChange={setSectOrCaste}
                placeholder="e.g. Sunni"
              />
              <Field
                label="Daily Lifestyle Summary"
                name="dailyLifestyle"
                value={dailyLifestyle}
                onChange={setDailyLifestyle}
                placeholder="Brief description"
              />
              <div className="sm:col-span-2">
                <Field
                  label="Religious Lifestyle Details"
                  name="religiousDetails"
                  value={religiousDetails}
                  onChange={setReligiousDetails}
                  placeholder="More details..."
                />
              </div>
            </div>
          </div>
        );

      /* STEP 6 — Family */
      case 6:
        return (
          <div className="space-y-4">
            <StepTitle
              title="Family Information"
              subtitle="Tell us about your family background"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Guardian Relation"
                name="relation"
                value={relation}
                onChange={(v) => {
                  setRelation(v);
                  clearError("relation");
                }}
                options={RELATION_OPTIONS}
                required
                error={errors.relation}
              />
              <Field
                label="Father's Occupation"
                name="fatherOcc"
                value={fatherOcc}
                onChange={(v) => {
                  setFatherOcc(v);
                  clearError("fatherOcc");
                }}
                placeholder="e.g. Business"
                required
                error={errors.fatherOcc}
              />
              <Field
                label="Mother's Occupation"
                name="motherOcc"
                value={motherOcc}
                onChange={(v) => {
                  setMotherOcc(v);
                  clearError("motherOcc");
                }}
                placeholder="e.g. Housewife"
                required
                error={errors.motherOcc}
              />
            </div>
          </div>
        );

      /* STEP 7 — Habits & Interests */
      case 7:
        return (
          <div className="space-y-5">
            <StepTitle
              title="Interests & Habits"
              subtitle="Select everything that describes you — this improves your matches"
            />
            <div className="flex flex-wrap gap-2">
              {HABIT_OPTIONS.map((h) => {
                const active = habits.includes(h);
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      toggleHabit(h);
                      clearError("habits");
                    }}
                    className={`font-outfit text-xs font-semibold px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-200
                      ${
                        active
                          ? "bg-brand/15 border-brand/50 text-brand shadow-[var(--shadow-brand-xs)]"
                          : "bg-white/4 border-white/10 text-slate-400 hover:bg-white/7 hover:border-white/20"
                      }`}
                  >
                    {active && "✓ "}
                    {h}
                  </button>
                );
              })}
            </div>
            {errors.habits && (
              <p className="flex items-center gap-1.5 text-[12px] text-red-400 font-outfit bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-2.5">
                <AlertCircle size={13} /> {errors.habits}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  /* ─────────────────────────────────────────
     Render
  ───────────────────────────────────────── */
  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="font-outfit min-h-screen px-4 py-8 md:py-12 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() =>
              showPreview ? prev() : step > 1 ? prev() : router.back()
            }
            className="flex items-center gap-1.5 text-slate-400 text-sm hover:text-white bg-transparent border-0 cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
            {showPreview ? "Back to Edit" : step > 1 ? "Back" : "Exit"}
          </button>
          <Logo size="small" />
        </div>

        {/* Progress bar — hidden on preview */}
        {!showPreview && <ProgressBar current={step} total={TOTAL_STEPS} />}

        {/* Preview badge */}
        {showPreview && (
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="font-outfit text-xs font-semibold text-brand tracking-widest uppercase px-3">
              Preview &amp; Confirm
            </span>
            <div className="flex-1 h-px bg-white/8" />
          </div>
        )}

        {/* Content */}
        <GlassCard className="p-4 md:p-7 mb-5">
          {showPreview ? renderPreview() : renderStep()}
        </GlassCard>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {(step > 1 || showPreview) && (
            <button
              onClick={prev}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-outfit font-semibold text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft size={15} />{" "}
              {showPreview ? "Back to Edit" : "Previous"}
            </button>
          )}

          {!showPreview ? (
            <GradientButton fullWidth onClick={next}>
              {step === TOTAL_STEPS ? (
                <>
                  <Eye size={15} /> Preview Biodata
                </>
              ) : (
                <>
                  Next <ArrowRight size={15} />
                </>
              )}
            </GradientButton>
          ) : (
            <GradientButton
              fullWidth
              loading={saving}
              loadingText="Saving..."
              onClick={handleSave}
            >
              <Check size={15} />{" "}
              {profile ? "Update Profile" : "Create Profile"}
            </GradientButton>
          )}
        </div>

        <div className="h-8" />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   Step title helper
───────────────────────────────────────── */
function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <h2 className="font-syne text-white text-xl font-extrabold tracking-tight mb-1">
        {title}
      </h2>
      <p className="font-outfit text-slate-400 text-sm">{subtitle}</p>
    </div>
  );
}
