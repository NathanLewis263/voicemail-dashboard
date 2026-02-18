import { Voicemail } from "@/lib/data";
import { VoicemailCard } from "./VoicemailCard";
import { Inbox, Archive } from "lucide-react";

interface VoicemailListProps {
  items: Voicemail[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onArchive?: (id: string) => void;
  currentView: "inbox" | "resolved";
  filterIntent?: string | null;
  onFilterIntentChange?: (intent: string | null) => void;
  filterUrgency?: "High" | "Medium" | "Low" | null;
  onFilterUrgencyChange?: (urgency: "High" | "Medium" | "Low" | null) => void;
}

export function VoicemailList({
  items,
  selectedId,
  onSelect,
  onArchive,
  currentView,
  filterIntent,
  onFilterIntentChange,
  filterUrgency,
  onFilterUrgencyChange,
}: VoicemailListProps) {
  const isInbox = currentView === "inbox";

  return (
    <div className="flex flex-col h-full bg-vm-bg">
      {/* List header */}
      <div className="px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center gap-2">
          {isInbox ? (
            <Inbox className="h-4 w-4 text-vm-text-tertiary" />
          ) : (
            <Archive className="h-4 w-4 text-vm-text-tertiary" />
          )}
          <h2 className="font-display text-sm font-semibold text-vm-text tracking-tight">
            {isInbox ? "Inbox" : "Resolved"}
          </h2>
          <span className="text-[11px] text-vm-text-tertiary tabular-nums ml-auto">
            {items.length} message{items.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Filters */}
        {onFilterIntentChange && onFilterUrgencyChange && (
          <div className="flex gap-2">
            <select
              value={filterIntent || ""}
              onChange={(e) => onFilterIntentChange(e.target.value || null)}
              className="flex-1 h-7 px-2 rounded-md bg-vm-surface border border-vm-border text-[11px] text-vm-text-secondary focus:outline-none focus:ring-1 focus:ring-vm-primary/30 cursor-pointer"
            >
              <option value="">All Intents</option>
              <option value="Appointment">Appointment</option>
              <option value="Prescription">Prescription</option>
              <option value="Results">Results</option>
              <option value="Emergency">Emergency</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={filterUrgency || ""}
              onChange={(e) =>
                onFilterUrgencyChange(
                  (e.target.value as "High" | "Medium" | "Low") || null,
                )
              }
              className="flex-1 h-7 px-2 rounded-md bg-vm-surface border border-vm-border text-[11px] text-vm-text-secondary focus:outline-none focus:ring-1 focus:ring-vm-primary/30 cursor-pointer"
            >
              <option value="">All Urgencies</option>
              <option value="High">High Urgency</option>
              <option value="Medium">Medium Urgency</option>
              <option value="Low">Low Urgency</option>
            </select>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-vm-border mx-4" />

      {/* Card list */}
      <div className="flex-1 overflow-auto pt-1">
        {items.map((item, index) => (
          <VoicemailCard
            key={item.id}
            voicemail={item}
            selected={selectedId === item.id}
            onClick={() => onSelect(item.id)}
            index={index}
            onArchive={onArchive ? () => onArchive(item.id) : undefined}
          />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-8 animate-fade-in">
            <div className="w-10 h-10 rounded-xl bg-vm-card flex items-center justify-center mb-3">
              {isInbox ? (
                <Inbox className="h-4 w-4 text-vm-text-tertiary" />
              ) : (
                <Archive className="h-4 w-4 text-vm-text-tertiary" />
              )}
            </div>
            <p className="text-vm-text-tertiary text-xs text-center">
              {isInbox ? "No voicemails in inbox" : "No resolved voicemails"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
