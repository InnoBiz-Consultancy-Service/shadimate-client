"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import {
  fetchDivisions,
  fetchDistricts,
  fetchThanas,
  type Division,
  type District,
  type Thana,
} from "@/actions/onboarding/geo";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface GeoSelection {
  divisionId: string;
  divisionName: string;
  districtId: string;
  districtName: string;
  thanaId: string;
  thanaName: string;
}

interface UseGeoDataReturn {
  // Data
  divisions: Division[];
  districts: District[];
  thanas: Thana[];

  // Selection
  selection: GeoSelection;

  // Search terms
  divisionSearch: string;
  districtSearch: string;
  thanaSearch: string;

  // Loading states
  divisionsLoading: boolean;
  districtsLoading: boolean;
  thanasLoading: boolean;

  // Actions
  setDivisionSearch: (search: string) => void;
  setDistrictSearch: (search: string) => void;
  setThanaSearch: (search: string) => void;
  selectDivision: (id: string, name: string) => void;
  selectDistrict: (id: string, name: string) => void;
  selectThana: (id: string, name: string) => void;
  loadDivisions: () => void;
  loadDistricts: () => void;
  loadThanas: () => void;
}

/* ─────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────── */

export function useGeoData(): UseGeoDataReturn {
  // ── Data ──
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thanas, setThanas] = useState<Thana[]>([]);

  // ── Selection ──
  const [selection, setSelection] = useState<GeoSelection>({
    divisionId: "",
    divisionName: "",
    districtId: "",
    districtName: "",
    thanaId: "",
    thanaName: "",
  });

  // ── Search terms ──
  const [divisionSearch, setDivisionSearch] = useState("");
  const [districtSearch, setDistrictSearch] = useState("");
  const [thanaSearch, setThanaSearch] = useState("");

  // ── Debounced search terms ──
  const debouncedDivisionSearch = useDebounce(divisionSearch, 300);
  const debouncedDistrictSearch = useDebounce(districtSearch, 300);
  const debouncedThanaSearch = useDebounce(thanaSearch, 300);

  // ── Loading states ──
  const [divisionsLoading, setDivisionsLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [thanasLoading, setThanasLoading] = useState(false);

  // ── Flags to track if data was loaded at least once (lazy loading) ──
  const [divisionsLoaded, setDivisionsLoaded] = useState(false);

  // ── Load Divisions (lazy — only when dropdown opens) ──
  const loadDivisions = useCallback(async () => {
    if (divisionsLoaded && !debouncedDivisionSearch) return;
    setDivisionsLoading(true);
    try {
      const data = await fetchDivisions(debouncedDivisionSearch);
      setDivisions(data);
      setDivisionsLoaded(true);
    } catch (err) {
      console.error("Failed to fetch divisions:", err);
    } finally {
      setDivisionsLoading(false);
    }
  }, [debouncedDivisionSearch, divisionsLoaded]);

  // ── Load Districts (lazy — only when dropdown opens + division selected) ──
  const loadDistricts = useCallback(async () => {
    if (!selection.divisionId) return;
    setDistrictsLoading(true);
    try {
      const data = await fetchDistricts(
        selection.divisionId,
        debouncedDistrictSearch,
      );
      setDistricts(data);
    } catch (err) {
      console.error("Failed to fetch districts:", err);
    } finally {
      setDistrictsLoading(false);
    }
  }, [selection.divisionId, debouncedDistrictSearch]);

  // ── Load Thanas (lazy — only when dropdown opens + district selected) ──
  const loadThanas = useCallback(async () => {
    if (!selection.districtId) return;
    setThanasLoading(true);
    try {
      const data = await fetchThanas(
        selection.districtId,
        debouncedThanaSearch,
      );
      setThanas(data);
    } catch (err) {
      console.error("Failed to fetch thanas:", err);
    } finally {
      setThanasLoading(false);
    }
  }, [selection.districtId, debouncedThanaSearch]);

  // ── Search effects — refetch when debounced search changes ──
  useEffect(() => {
    if (divisionsLoaded || debouncedDivisionSearch) {
      loadDivisions();
    }
  }, [debouncedDivisionSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selection.divisionId) {
      loadDistricts();
    }
  }, [debouncedDistrictSearch, selection.divisionId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selection.districtId) {
      loadThanas();
    }
  }, [debouncedThanaSearch, selection.districtId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Selection handlers with cascade reset ──
  const selectDivision = useCallback((id: string, name: string) => {
    setSelection({
      divisionId: id,
      divisionName: name,
      districtId: "",
      districtName: "",
      thanaId: "",
      thanaName: "",
    });
    // Reset downstream
    setDistricts([]);
    setThanas([]);
    setDistrictSearch("");
    setThanaSearch("");
  }, []);

  const selectDistrict = useCallback((id: string, name: string) => {
    setSelection((prev) => ({
      ...prev,
      districtId: id,
      districtName: name,
      thanaId: "",
      thanaName: "",
    }));
    // Reset downstream
    setThanas([]);
    setThanaSearch("");
  }, []);

  const selectThana = useCallback((id: string, name: string) => {
    setSelection((prev) => ({
      ...prev,
      thanaId: id,
      thanaName: name,
    }));
  }, []);

  return {
    divisions,
    districts,
    thanas,
    selection,
    divisionSearch,
    districtSearch,
    thanaSearch,
    divisionsLoading,
    districtsLoading,
    thanasLoading,
    setDivisionSearch,
    setDistrictSearch,
    setThanaSearch,
    selectDivision,
    selectDistrict,
    selectThana,
    loadDivisions,
    loadDistricts,
    loadThanas,
  };
}
