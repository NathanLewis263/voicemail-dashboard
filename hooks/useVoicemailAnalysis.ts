import { Voicemail, mockPatients } from "@/lib/data";
import { useQuery, useQueries } from "@tanstack/react-query";
import axios from "axios";

export interface AIAnalysis {
  summary: string;
  intent: string;
  urgency: "Low" | "Medium" | "High";
  confidence: number;
  keyDetails: { label: string; value: string }[];
  suggestedAction: string;
  suggestedAppointmentType?: string | null;
  suggestedPatientId: string | null;
  requestedDoctor?: string | null;
}

const normalizeNumber = (num: string) => num.replace(/\D/g, "");

function getPotentialPatients(callerNumber: string) {
  const normalizedCaller = normalizeNumber(callerNumber);
  return mockPatients
    .filter((p) => normalizeNumber(p.phoneNumber) === normalizedCaller)
    .map((p) => ({
      id: p.id,
      name: p.name,
      dateOfBirth: p.dateOfBirth,
    }));
}

export function useVoicemailAnalysis(voicemail: Voicemail | null) {
  const {
    data: analysis,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["analysis", voicemail?.id],
    queryFn: async () => {
      if (!voicemail) return null;

      const potentialPatients = getPotentialPatients(voicemail.callerNumber);

      const { data } = await axios.post<AIAnalysis>("/api/analyze", {
        transcript: voicemail.transcript,
        potentialPatients,
      });

      return data;
    },
    enabled: !!voicemail,
    staleTime: Infinity, // Cache forever since voicemail transcripts don't change
  });

  const error = queryError instanceof Error ? queryError.message : null;

  return { analysis, loading, error };
}

export function useVoicemailListAnalysis(voicemails: Voicemail[]) {
  const results = useQueries({
    queries: voicemails.map((voicemail) => ({
      queryKey: ["analysis", voicemail.id],
      queryFn: async () => {
        const potentialPatients = getPotentialPatients(voicemail.callerNumber);

        const { data } = await axios.post<AIAnalysis>("/api/analyze", {
          transcript: voicemail.transcript,
          potentialPatients,
        });
        return data;
      },
      staleTime: Infinity,
    })),
  });

  const analysisMap = new Map<string, AIAnalysis | undefined>();
  let isLoading = false;

  results.forEach((result, index) => {
    if (result.isLoading) isLoading = true;
    if (result.data) {
      analysisMap.set(voicemails[index].id, result.data);
    }
  });

  return { analysisMap, isLoading };
}
