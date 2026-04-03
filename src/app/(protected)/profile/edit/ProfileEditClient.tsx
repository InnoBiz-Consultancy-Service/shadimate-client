"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ChevronDown } from "lucide-react";
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

/* ── Reusable plain select (for enums only) ── */
const Select = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={name}
      className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase"
    >
      {label}
    </label>
    <select
      id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="font-outfit w-full px-3 py-3 rounded-xl text-sm text-slate-100 bg-white/5 border border-white/10 outline-none focus:border-brand/50 transition-all duration-200 appearance-none"
    >
      <option value="">{placeholder || "Select"}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

/* ── Reusable text field ── */
const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={name}
      className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="font-outfit w-full px-3 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border border-white/10 outline-none focus:border-brand/50 transition-all duration-200"
    />
  </div>
);

/* ── Collapsible section ── */
const Section = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <GlassCard className="p-5 mb-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between cursor-pointer bg-transparent border-0 text-left"
      >
        <h3 className="font-syne text-white text-base font-bold">{title}</h3>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </GlassCard>
  );
};

/* ── Helpers ── */
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

/* ══════════════════════════════════════════════ */
export default function ProfileEditClient({ profile }: { profile?: Profile }) {
  const router = useRouter();
  const [toast, setToast] = useState<ToastData | null>(null);
  const [saving, setSaving] = useState(false);

  /* ── Basic form state ── */
  const [relation, setRelation] = useState(profile?.relation || "");
  const [fatherOcc, setFatherOcc] = useState(profile?.fatherOccupation || "");
  const [motherOcc, setMotherOcc] = useState(profile?.motherOccupation || "");
  const [profession, setProfession] = useState(profile?.profession || "");
  const [salaryRange, setSalaryRange] = useState(profile?.salaryRange || "");
  const [economicalStatus, setEconomicalStatus] = useState(
    profile?.economicalStatus || "",
  );
  const [personality, setPersonality] = useState(profile?.personality || "");
  const [birthDate, setBirthDate] = useState(
    profile?.birthDate?.split("T")[0] || "",
  );
  const [aboutMe, setAboutMe] = useState(profile?.aboutMe || "");
  const [height, setHeight] = useState(profile?.height || "");
  const [weight, setWeight] = useState(profile?.weight || "");
  const [skinTone, setSkinTone] = useState(profile?.skinTone || "");
  const [maritalStatus, setMaritalStatus] = useState(
    profile?.maritalStatus || "",
  );
  const [habits, setHabits] = useState<string[]>(profile?.habits || []);

  /* ── Address (with names for SearchableDropdown) ── */
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

  /* ── Education ── */
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

  /* ── Religion ── */
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

  /* ══ GEO DATA — lazy loaded with debounced search ══ */
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  const [divisionSearch, setDivisionSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [thanaSearch, setThanaSearch] = useState("");
  const [universitySearch, setUniversitySearch] = useState("");

  const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [thanasLoading, setThanasLoading] = useState(false);
  const [universitiesLoading, setUniversitiesLoading] = useState(false);

  const debouncedDivSearch = useDebounce(divisionSearch, 300);
  const debouncedDistSearch = useDebounce(districtSearch, 300);
  const debouncedThanaSearch = useDebounce(thanaSearch, 300);
  const debouncedUniSearch = useDebounce(universitySearch, 300);

  const loadDivisions = useCallback(async () => {
    setDivisionsLoading(true);
    const data = await fetchDivisions(debouncedDivSearch);
    setDivisions(data);
    setDivisionsLoading(false);
  }, [debouncedDivSearch]);

  useEffect(() => {
    loadDivisions();
  }, [debouncedDivSearch]);

  const loadDistricts = useCallback(async () => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }
    setDistrictsLoading(true);
    const data = await fetchDistricts(divisionId, debouncedDistSearch);
    setDistricts(data);
    setDistrictsLoading(false);
  }, [divisionId, debouncedDistSearch]);

  useEffect(() => {
    loadDistricts();
  }, [divisionId, debouncedDistSearch]);

  const loadThanas = useCallback(async () => {
    if (!districtId) {
      setThanas([]);
      return;
    }
    setThanasLoading(true);
    const data = await fetchThanas(districtId, debouncedThanaSearch);
    setThanas(data);
    setThanasLoading(false);
  }, [districtId, debouncedThanaSearch]);

  useEffect(() => {
    loadThanas();
  }, [districtId, debouncedThanaSearch]);

  const loadUniversities = useCallback(async () => {
    setUniversitiesLoading(true);
    const data = await fetchUniversities(debouncedUniSearch);
    setUniversities(data);
    setUniversitiesLoading(false);
  }, [debouncedUniSearch]);

  useEffect(() => {
    loadUniversities();
  }, [debouncedUniSearch]);

  const toggleHabit = (h: string) => {
    setHabits((prev) =>
      prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h],
    );
  };

  const handleSave = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = {};
    if (relation) payload.relation = relation;
    if (fatherOcc) payload.fatherOccupation = fatherOcc;
    if (motherOcc) payload.motherOccupation = motherOcc;
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
    const res = profile
      ? await updateProfile(payload)
      : await createProfile(payload);
    setSaving(false);
    setToast({ message: res.message, type: res.success ? "success" : "error" });
    if (res.success) router.refresh();
  };

  const hideToast = useCallback(() => setToast(null), []);

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <div className="font-outfit min-h-screen px-5 py-8 md:py-12 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 text-sm hover:text-white bg-transparent border-0 cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <Logo size="small" />
        </div>

        <h1 className="font-syne text-white text-2xl font-extrabold tracking-tight mb-6">
          {profile ? "Edit Profile" : "Create Profile"}
        </h1>

        <Section title="Personal Information" defaultOpen>
          <Field
            label="Profession"
            name="profession"
            value={profession}
            onChange={setProfession}
            placeholder="Software Engineer"
          />
          <Select
            label="Personality"
            name="personality"
            value={personality}
            onChange={setPersonality}
            options={PERSONALITY_OPTIONS}
          />
          <Field
            label="Date of Birth"
            name="birthDate"
            type="date"
            value={birthDate}
            onChange={setBirthDate}
          />
          <Select
            label="Marital Status"
            name="maritalStatus"
            value={maritalStatus}
            onChange={setMaritalStatus}
            options={MARITAL_STATUS_OPTIONS}
          />
          <Select
            label="Economic Status"
            name="economicalStatus"
            value={economicalStatus}
            onChange={setEconomicalStatus}
            options={ECONOMICAL_STATUS_OPTIONS}
          />
          <Field
            label="Salary Range"
            name="salaryRange"
            value={salaryRange}
            onChange={setSalaryRange}
            placeholder="50,000 - 80,000"
          />
          <div className="sm:col-span-2">
            <label className="font-outfit text-slate-400 text-[10px] font-semibold tracking-[0.12em] uppercase mb-1.5 block">
              About Me
            </label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={3}
              placeholder="Write something about yourself..."
              className="font-outfit w-full px-3 py-3 rounded-xl text-sm text-slate-100 placeholder-slate-600 bg-white/5 border border-white/10 outline-none focus:border-brand/50 transition-all duration-200 resize-none"
            />
          </div>
        </Section>

        <Section title="Physical Information">
          <Field
            label="Height (cm)"
            name="height"
            value={height}
            onChange={setHeight}
            placeholder="170"
          />
          <Field
            label="Weight (kg)"
            name="weight"
            value={weight}
            onChange={setWeight}
            placeholder="65"
          />
          <Select
            label="Skin Tone"
            name="skinTone"
            value={skinTone}
            onChange={setSkinTone}
            options={SKIN_TONE_OPTIONS}
          />
        </Section>

        <Section title="Address">
          <SearchableDropdown
            label="Division"
            placeholder="Select Division"
            options={divisions}
            loading={divisionsLoading}
            selectedId={divisionId}
            selectedName={divisionName}
            searchValue={divisionSearch}
            onSearchChange={setDivisionSearch}
            onSelect={(id, n) => {
              setDivisionId(id);
              setDivisionName(n);
              setDistrictId("");
              setDistrictName("");
              setThanaId("");
              setThanaName("");
            }}
            onOpen={loadDivisions}
          />
          <SearchableDropdown
            label="District"
            placeholder={
              divisionId ? "Select District" : "Select Division First"
            }
            options={districts}
            loading={districtsLoading}
            disabled={!divisionId}
            selectedId={districtId}
            selectedName={districtName}
            searchValue={districtSearch}
            onSearchChange={setDistrictSearch}
            onSelect={(id, n) => {
              setDistrictId(id);
              setDistrictName(n);
              setThanaId("");
              setThanaName("");
            }}
            onOpen={loadDistricts}
          />
          <SearchableDropdown
            label="Thana"
            placeholder={districtId ? "Select Thana" : "Select District First"}
            options={thanas}
            loading={thanasLoading}
            disabled={!districtId}
            selectedId={thanaId}
            selectedName={thanaName}
            searchValue={thanaSearch}
            onSearchChange={setThanaSearch}
            onSelect={(id, n) => {
              setThanaId(id);
              setThanaName(n);
            }}
            onOpen={loadThanas}
          />
          <Field
            label="Detailed Address"
            name="addressDetails"
            value={addressDetails}
            onChange={setAddressDetails}
            placeholder="House No, Road, Area"
          />
        </Section>

        <Section title="Education">
          <Select
            label="Education Type"
            name="eduVariety"
            value={eduVariety}
            onChange={setEduVariety}
            options={EDUCATION_VARIETY_OPTIONS}
          />
          <SearchableDropdown
            label="University"
            placeholder="Select University"
            options={universities}
            loading={universitiesLoading}
            selectedId={universityId}
            selectedName={universityName}
            searchValue={universitySearch}
            onSearchChange={setUniversitySearch}
            onSelect={(id, n) => {
              setUniversityId(id);
              setUniversityName(n);
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
          <Field
            label="Department/Subject"
            name="department"
            value={department}
            onChange={setDepartment}
            placeholder="Computer Science"
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
        </Section>

        <Section title="Religious Information">
          <Select
            label="Religion"
            name="faith"
            value={faith}
            onChange={setFaith}
            options={FAITH_OPTIONS}
          />
          <Select
            label="Religious Practice"
            name="practiceLevel"
            value={practiceLevel}
            onChange={setPracticeLevel}
            options={PRACTICE_LEVEL_OPTIONS}
          />
          <Field
            label="Sect/Clan"
            name="sectOrCaste"
            value={sectOrCaste}
            onChange={setSectOrCaste}
            placeholder="Sunni"
          />
          <Field
            label="Daily Lifestyle"
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
              placeholder="Details..."
            />
          </div>
        </Section>

        <Section title="Family Information">
          <Select
            label="Guardian Relation"
            name="relation"
            value={relation}
            onChange={setRelation}
            options={RELATION_OPTIONS}
          />
          <Field
            label="Father's Occupation"
            name="fatherOcc"
            value={fatherOcc}
            onChange={setFatherOcc}
            placeholder="Business"
          />
          <Field
            label="Mother's Occupation"
            name="motherOcc"
            value={motherOcc}
            onChange={setMotherOcc}
            placeholder="Housewife"
          />
        </Section>

        <GlassCard className="p-5 mb-4">
          <h3 className="font-syne text-white text-base font-bold mb-4">
            Habits & Hobbies
          </h3>
          <div className="flex flex-wrap gap-2">
            {HABIT_OPTIONS.map((h) => {
              const active = habits.includes(h);
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggleHabit(h)}
                  className={`font-outfit text-xs font-medium px-3 py-2 rounded-xl border cursor-pointer transition-all duration-200 ${active ? "bg-brand/15 border-brand/50 text-brand" : "bg-white/3 border-white/10 text-slate-400 hover:bg-white/5"}`}
                >
                  {active ? "✓ " : ""}
                  {h}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <div className="sticky bottom-4 z-20 pt-4">
          <GradientButton
            fullWidth
            loading={saving}
            loadingText="Saving..."
            onClick={handleSave}
          >
            <Save size={16} /> {profile ? "Update Profile" : "Create Profile"}
          </GradientButton>
        </div>
        <div className="h-8" />
      </div>
    </>
  );
}











// Something went wrong Profile validation failed: gender: Path `gender` is required., maritalStatus: `Never Married` is not a valid enum value for path `maritalStatus`.
// Back
// ShadiMate
// Create Profile



// Personal Information
// Profession
// Web Developer
// Personality

// Caring Soul
// Date of Birth

// 12/03/2004
// Marital Status

// Never Married
// Economic Status

// Medium
// Salary Range
// 10000
// About Me
// I am single, that's it. 

// Physical Information
// Height (cm)
// 170
// Weight (kg)
// 50
// Skin Tone

// Fair

// Address
// Division

// Rangpur
// District

// Kurigram
// Thana

// Bhurungamari
// Detailed Address
// Joymonir Hat

// Education
// Education Type

// Engineering
// University

// American International University Bangladesh
// Department/Subject
// Computer Science
// Institution Name
// Dakha university
// Passing Year
// 2020
// College Name
// Dhaka Collage

// Religious Information
// Religion

// Islam
// Religious Practice