"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGeoData, type GeoSelection } from "./useGeoData";
import { useUniversities, type UniversitySelection } from "./useUniversities";
import { submitBasicInfo } from "@/actions/onboarding/submit-basic-info";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export const STEPS = ["Basic Info", "Appearance", "Preferences", "Submit"];

export interface BasicInfoFormData {
  // Step 1
  name: string;
  dob: string;
  address: GeoSelection;

  // Step 2
  height: string;
  skinTone: string;
  bodyType: string;

  // Step 3
  education: string;
  universityId: UniversitySelection;
  profession: string;
  maritalStatus: string;
}

interface UseBasicInfoFormReturn {
  // Form state
  step: number;
  submitting: boolean;
  submitted: boolean;
  formRef: React.RefObject<HTMLFormElement | null>;

  // Geo & University hooks (passed through)
  geo: ReturnType<typeof useGeoData>;
  uni: ReturnType<typeof useUniversities>;

  // Actions
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/* ─────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────── */

export function useBasicInfoForm(): UseBasicInfoFormReturn {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sub-hooks
  const geo = useGeoData();
  const uni = useUniversities();

  // Prevent browser back navigation
  useEffect(() => {
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const nextStep = useCallback(() => {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  }, [step]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // If not on last step, just go next
      if (step < STEPS.length) {
        nextStep();
        return;
      }

      // Final submission
      setSubmitting(true);
      try {
        const formData = new FormData(e.currentTarget);
        const rawPayload = Object.fromEntries(formData.entries());

        // Merge geo & university selections into payload
        const payload = {
          name: rawPayload.name as string,
          dob: rawPayload.dob as string,
          address: {
            divisionId: geo.selection.divisionId,
            districtId: geo.selection.districtId,
            thanaId: geo.selection.thanaId,
          },
          height: rawPayload.height as string,
          skinTone: rawPayload.skinTone as string,
          bodyType: rawPayload.bodyType as string,
          education: {
            level: rawPayload.education as string,
            universityId: uni.selection.universityId,
          },
          profession: rawPayload.profession as string,
          maritalStatus: rawPayload.maritalStatus as string,
        };

        const res = await submitBasicInfo(payload);

        if (res.success) {
          setSubmitted(true);
          setTimeout(() => router.replace("/dashboard"), 1500);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [step, nextStep, geo.selection, uni.selection, router],
  );

  return {
    step,
    submitting,
    submitted,
    formRef,
    geo,
    uni,
    nextStep,
    prevStep,
    handleSubmit,
  };
}
