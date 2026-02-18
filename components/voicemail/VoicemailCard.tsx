import { cn } from "@/lib/utils";
import { Voicemail } from "@/lib/data";
import { Loader2, Check } from "lucide-react";
import { useVoicemailAnalysis } from "@/hooks/useVoicemailAnalysis";

interface VoicemailCardProps {
  voicemail: Voicemail;
  selected: boolean;
  onClick: () => void;
  index?: number;
  onArchive?: () => void;
}

export function VoicemailCard({
  voicemail,
  selected,
  onClick,
  index = 0,
  onArchive,
}: VoicemailCardProps) {
  const { analysis, loading } = useVoicemailAnalysis(voicemail);

  const urgencyColor = analysis
    ? {
        High: "bg-[#8f1433]",
        Medium: "bg-[#f0e662]",
        Low: "bg-[#1ad61a]",
      }[analysis.urgency]
    : "bg-vm-text-tertiary";

  const urgencyBg = analysis
    ? {
        High: "bg-vm-urgent-light",
        Medium: "bg-vm-warn-light",
        Low: "bg-vm-calm-light",
      }[analysis.urgency]
    : undefined;

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${index * 50}ms` }}
      className={cn(
        "group relative flex flex-col gap-1.5 px-4 py-3 cursor-pointer transition-all duration-150 animate-fade-in-up border-l-[3px]",
        selected
          ? "bg-vm-surface border-l-vm-primary shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          : cn("border-l-transparent hover:bg-vm-surface/60", urgencyBg),
        selected &&
          analysis?.urgency === "High" &&
          "border-l-vm-urgent shadow-[0_1px_3px_rgba(205,43,49,0.1)]",
      )}
    >
      {/* Urgency dot — top right */}
      {analysis && (
        <div
          className={cn(
            "absolute top-3.5 right-4 w-2 h-2 rounded-full",
            urgencyColor,
          )}
        />
      )}

      {/* Name + quick action */}
      <div className="flex items-center justify-between pr-5">
        <h3
          className={cn(
            "font-medium text-[13px] truncate transition-colors",
            selected ? "text-vm-text" : "text-vm-text-secondary",
          )}
        >
          {voicemail.callerName}
        </h3>
        {onArchive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className="hidden group-hover:flex absolute top-3 right-3 items-center justify-center h-5 w-5 rounded bg-vm-bg border border-vm-border hover:bg-vm-calm hover:text-white hover:border-vm-calm transition-all text-vm-text-tertiary"
            title="Resolve"
          >
            <Check className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Phone + duration + date */}
      <div className="flex items-center justify-between text-[11px] text-vm-text-tertiary tabular-nums">
        <div className="flex items-center gap-1.5">
          <span>{voicemail.callerNumber}</span>
          <span className="text-vm-border">·</span>
          <span>{voicemail.duration}</span>
        </div>
        <span>
          {new Date(voicemail.timestamp).toLocaleDateString([], {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 mt-0.5">
        {loading ? (
          <div className="flex items-center gap-1.5 text-vm-text-tertiary">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-[10px]">Analyzing...</span>
          </div>
        ) : analysis ? (
          <>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-vm-primary-light text-vm-primary font-medium">
              {analysis.intent}
            </span>
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-medium border",
                analysis.urgency === "High" &&
                  "bg-vm-urgent-light text-vm-urgent border-vm-urgent/50",
                analysis.urgency === "Medium" &&
                  "bg-vm-warn-light text-vm-warn border-vm-warn/50",
                analysis.urgency === "Low" &&
                  "bg-vm-calm-light text-vm-calm border-vm-calm/50",
              )}
            >
              {analysis.urgency}
            </span>
          </>
        ) : null}
      </div>

      {/* Summary preview */}
      <p className="text-[12px] text-vm-text-tertiary line-clamp-2 leading-relaxed">
        {analysis?.summary || voicemail.transcript}
      </p>
    </div>
  );
}
