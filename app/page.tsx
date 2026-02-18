"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { VoicemailList } from "@/components/voicemail/VoicemailList";
import { VoicemailDetail } from "@/components/voicemail/VoicemailDetail";
import { mockVoicemails } from "@/lib/data";
import { useVoicemailListAnalysis } from "@/hooks/useVoicemailAnalysis";

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(
    mockVoicemails[0].id,
  );
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<"inbox" | "resolved">("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterIntent, setFilterIntent] = useState<string | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<
    "High" | "Medium" | "Low" | null
  >(null);

  // Fetch analysis for all voicemails to enable filtering
  const { analysisMap } = useVoicemailListAnalysis(mockVoicemails);

  const handleArchive = (id: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    if (selectedId === id) {
      const currentIndex = filteredVoicemails.findIndex((v) => v.id === id);
      const nextVoicemail =
        filteredVoicemails[currentIndex + 1] ||
        filteredVoicemails[currentIndex - 1];
      setSelectedId(nextVoicemail?.id || null);
    }
  };

  const handleRestore = (id: string) => {
    setArchivedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (selectedId === id) {
      const currentIndex = filteredVoicemails.findIndex((v) => v.id === id);
      const nextVoicemail =
        filteredVoicemails[currentIndex + 1] ||
        filteredVoicemails[currentIndex - 1];
      setSelectedId(nextVoicemail?.id || null);
    }
  };

  const inboxCount = mockVoicemails.filter(
    (v) => !archivedIds.has(v.id),
  ).length;

  const filteredVoicemails = mockVoicemails
    .filter((voicemail) => {
      if (currentView === "inbox") {
        return !archivedIds.has(voicemail.id);
      } else {
        return archivedIds.has(voicemail.id);
      }
    })
    .filter((voicemail) => {
      const term = searchTerm.toLowerCase();
      const analysis = analysisMap.get(voicemail.id);
      const summary = analysis?.summary?.toLowerCase() || "";
      const urgency = analysis?.urgency?.toLowerCase() || "";

      return (
        voicemail.callerName.toLowerCase().includes(term) ||
        voicemail.callerNumber.includes(term) ||
        voicemail.transcript.toLowerCase().includes(term) ||
        summary.includes(term) ||
        urgency.includes(term)
      );
    })
    .filter((voicemail) => {
      const analysis = analysisMap.get(voicemail.id);

      // Intent filtering
      if (filterIntent) {
        if (!analysis) {
          return false;
        }
        const intentLower = filterIntent.toLowerCase();
        if (
          analysis.intent !== filterIntent &&
          !voicemail.transcript.toLowerCase().includes(intentLower)
        ) {
          return false;
        }
      }

      // Urgency filtering
      if (filterUrgency) {
        if (!analysis) {
          return false;
        }
        if (analysis.urgency !== filterUrgency) {
          return false;
        }
      }

      return true;
    })
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

  const handleViewChange = (view: "inbox" | "resolved") => {
    setCurrentView(view);
  };

  const selectedVoicemail =
    mockVoicemails.find((v) => v.id === selectedId) || null;

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentView={currentView}
        onViewChange={handleViewChange}
        inboxCount={inboxCount}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Voicemail List */}
        <div className="w-full max-w-sm border-r border-vm-border flex-shrink-0">
          <VoicemailList
            items={filteredVoicemails}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onArchive={
              currentView === "inbox" ? (id) => handleArchive(id) : undefined
            }
            currentView={currentView}
            filterIntent={filterIntent}
            onFilterIntentChange={setFilterIntent}
            filterUrgency={filterUrgency}
            onFilterUrgencyChange={setFilterUrgency}
          />
        </div>

        {/* Detail View */}
        <div className="flex-1 overflow-hidden">
          <VoicemailDetail
            key={selectedVoicemail?.id}
            voicemail={selectedVoicemail}
            onArchive={
              currentView === "inbox"
                ? () => selectedVoicemail && handleArchive(selectedVoicemail.id)
                : undefined
            }
            onRestore={
              currentView === "resolved"
                ? () => selectedVoicemail && handleRestore(selectedVoicemail.id)
                : undefined
            }
          />
        </div>
      </main>
    </div>
  );
}
