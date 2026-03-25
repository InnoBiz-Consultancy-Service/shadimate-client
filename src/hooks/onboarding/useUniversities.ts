"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./useDebounce";
import { fetchUniversities, type University } from "@/actions/onboarding/geo";

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */

export interface UniversitySelection {
  universityId: string;
  universityName: string;
}

interface UseUniversitiesReturn {
  universities: University[];
  selection: UniversitySelection;
  search: string;
  filterType: "govt" | "private" | undefined;
  loading: boolean;
  setSearch: (search: string) => void;
  setFilterType: (type: "govt" | "private" | undefined) => void;
  selectUniversity: (id: string, name: string) => void;
  loadUniversities: () => void;
}

/* ─────────────────────────────────────────────────────────
   Hook
───────────────────────────────────────────────────────── */

export function useUniversities(): UseUniversitiesReturn {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selection, setSelection] = useState<UniversitySelection>({
    universityId: "",
    universityName: "",
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<
    "govt" | "private" | undefined
  >();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const loadUniversities = useCallback(async () => {
    if (loaded && !debouncedSearch && !filterType) return;
    setLoading(true);
    try {
      const data = await fetchUniversities(debouncedSearch, filterType);
      setUniversities(data);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to fetch universities:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterType, loaded]);

  // Refetch when search or filter changes
  useEffect(() => {
    if (loaded || debouncedSearch || filterType) {
      loadUniversities();
    }
  }, [debouncedSearch, filterType]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectUniversity = useCallback((id: string, name: string) => {
    setSelection({ universityId: id, universityName: name });
  }, []);

  return {
    universities,
    selection,
    search,
    filterType,
    loading,
    setSearch,
    setFilterType,
    selectUniversity,
    loadUniversities,
  };
}
