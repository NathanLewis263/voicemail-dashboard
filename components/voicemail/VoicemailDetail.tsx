"use client";

import {
  Phone,
  Calendar,
  Play,
  Pause,
  Check,
  User,
  Loader2,
  ArrowRight,
  Clock,
  Inbox,
  Volume2,
  Sparkles,
} from "lucide-react";
import { useVoicemailAnalysis } from "@/hooks/useVoicemailAnalysis";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import {
  Voicemail,
  mockPatients,
  Patient,
  mockAvailableSlots,
} from "@/lib/data";
import { PatientProfileModal } from "@/components/patient/PatientProfileModal";

interface VoicemailDetailProps {
  voicemail: Voicemail | null;
  onArchive?: () => void;
  onRestore?: () => void;
}

export function VoicemailDetail({
  voicemail,
  onArchive,
  onRestore,
}: VoicemailDetailProps) {
  const { analysis, loading, error } = useVoicemailAnalysis(voicemail);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Patient Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [matchedPatients, setMatchedPatients] = useState<Patient[]>([]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleOpenProfile = () => {
    if (!voicemail) return;

    // Clean phone numbers for comparison (remove spaces and non-digits)
    const normalizeNumber = (num: string) => num.replace(/\D/g, "");
    const currentNumber = normalizeNumber(voicemail.callerNumber);

    const matches = mockPatients.filter(
      (p) => normalizeNumber(p.phoneNumber) === currentNumber,
    );

    setMatchedPatients(matches);
    setIsProfileOpen(true);
  };

  // ── Empty state ──
  if (!voicemail) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-vm-card border border-vm-border flex items-center justify-center mx-auto mb-3">
            <Volume2 className="h-5 w-5 text-vm-text-tertiary" />
          </div>
          <p className="text-vm-text-tertiary text-xs">
            Select a voicemail to view details
          </p>
        </div>
      </div>
    );
  }

  const urgencyConfig = {
    High: {
      bg: "bg-vm-urgent-light",
      text: "text-vm-urgent",
      dot: "bg-vm-urgent",
      border: "border-vm-urgent/30",
      label: "High",
    },
    Medium: {
      bg: "bg-vm-warn-light",
      text: "text-vm-warn",
      dot: "bg-vm-warn",
      border: "border-vm-warn/30",
      label: "Medium",
    },
    Low: {
      bg: "bg-vm-calm-light",
      text: "text-vm-calm",
      dot: "bg-vm-calm",
      border: "border-vm-calm/30",
      label: "Low",
    },
  };

  const urgency = analysis?.urgency ? urgencyConfig[analysis.urgency] : null;

  return (
    <div className="flex h-full flex-col">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-vm-border bg-vm-surface">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-lg bg-vm-card border border-vm-border flex items-center justify-center flex-shrink-0">
            <User className="h-3.5 w-3.5 text-vm-text-tertiary" />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-sm font-semibold text-vm-text truncate">
              {voicemail.callerName}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-vm-text-tertiary tabular-nums">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span>{voicemail.callerNumber}</span>
              <span className="text-vm-border">·</span>
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span>
                {new Date(voicemail.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-vm-border">·</span>
              <span>{voicemail.duration}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {urgency && (
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border",
                urgency.bg,
                urgency.text,
                urgency.border,
              )}
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  urgency.dot,
                  analysis?.urgency === "High" && "animate-pulse-glow",
                )}
              />
              {urgency.label}
            </div>
          )}
          {onArchive && (
            <button
              onClick={onArchive}
              className="h-8 px-3.5 rounded-lg bg-vm-calm text-white text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              Resolve
            </button>
          )}
          {onRestore && (
            <button
              onClick={onRestore}
              className="h-8 px-3.5 rounded-lg bg-vm-card border border-vm-border text-vm-text text-xs font-medium hover:bg-vm-elevated transition-colors flex items-center gap-1.5"
            >
              <Inbox className="h-3.5 w-3.5" />
              Move to Inbox
            </button>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto p-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Analysis */}
            <div className="bg-vm-surface rounded-lg border border-vm-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-vm-primary/15 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-vm-primary" />
                </div>
                <h3 className="font-display text-xs font-semibold text-vm-text tracking-wide uppercase">
                  AI Analysis
                </h3>
              </div>

              {loading ? (
                <div className="flex items-center gap-2 py-8 justify-center text-vm-text-tertiary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Analyzing transcript...</span>
                </div>
              ) : error ? (
                <div className="text-xs text-vm-urgent bg-vm-urgent-light rounded-md p-3 border border-vm-urgent/20">
                  Failed to analyze: {error}
                </div>
              ) : analysis ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <p className="text-[13px] text-vm-text leading-relaxed">
                    {analysis.summary}
                  </p>

                  {/* Intent + Urgency tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] px-2 py-1 rounded bg-vm-primary-light text-vm-primary font-semibold uppercase tracking-wider">
                      {analysis.intent}
                    </span>
                    {urgency && (
                      <span
                        className={cn(
                          "text-[10px] px-2 py-1 rounded font-semibold uppercase tracking-wider",
                          urgency.bg,
                          urgency.text,
                        )}
                      >
                        {urgency.label} Urgency
                      </span>
                    )}
                  </div>

                  {/* Key Details grid */}
                  {analysis.keyDetails && analysis.keyDetails.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {analysis.keyDetails.map((detail, idx) => (
                        <div
                          key={idx}
                          className="bg-vm-bg rounded-md px-3 py-2.5 border border-vm-border-light"
                        >
                          <span className="block text-[10px] text-vm-text-tertiary uppercase tracking-wider">
                            {detail.label}
                          </span>
                          <span className="block font-medium text-[13px] text-vm-text mt-0.5">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action */}

                  <div className="bg-vm-calm-light border border-vm-calm/20 rounded-md px-4 py-3 flex items-start gap-3">
                    <ArrowRight className="h-3.5 w-3.5 text-vm-calm flex-shrink-0 mt-0.5" />
                    <span className="text-[13px] font-medium text-vm-text leading-snug">
                      {analysis.suggestedAction}
                    </span>
                  </div>

                  {/* Suggested Appointments */}
                  {(analysis.intent === "Appointment" ||
                    analysis.intent === "Emergency") && (
                    <div className="space-y-3 pt-2 border-t border-vm-border-light">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-semibold text-vm-text uppercase tracking-wider flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-vm-primary" />
                          Suggested Slots
                          {analysis.suggestedAppointmentType && (
                            <span className="normal-case font-normal text-vm-text-tertiary">
                              ({analysis.suggestedAppointmentType})
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid gap-2">
                        {mockAvailableSlots
                          .filter((slot) => {
                            // 1. Filter by Doctor if requested
                            if (
                              analysis.requestedDoctor &&
                              !slot.doctor
                                .toLowerCase()
                                .includes(
                                  analysis.requestedDoctor.toLowerCase(),
                                )
                            ) {
                              return false;
                            }

                            // 2. Filter by Type (with fallback)
                            return (
                              !analysis.suggestedAppointmentType ||
                              slot.type === analysis.suggestedAppointmentType ||
                              slot.type === "Standard Consult"
                            );
                          })
                          .slice(0, 3)
                          .map((slot) => (
                            <div
                              key={slot.id}
                              className="flex items-center justify-between bg-vm-bg p-2.5 rounded-md border border-vm-border-light group hover:border-vm-primary/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="text-center min-w-[40px]">
                                  <div className="text-[10px] text-vm-text-tertiary uppercase leading-none mb-0.5">
                                    {new Date(slot.date).toLocaleDateString(
                                      "en-US",
                                      { weekday: "short" },
                                    )}
                                  </div>
                                  <div className="text-sm font-bold text-vm-text leading-none">
                                    {new Date(slot.date).getDate()}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-vm-text">
                                    {new Date(slot.date).toLocaleTimeString(
                                      "en-US",
                                      {
                                        hour: "numeric",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </div>
                                  <div className="text-[11px] text-vm-text-secondary">
                                    {slot.doctor} · {slot.type}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() =>
                                  alert(
                                    `Booked ${slot.type} with ${slot.doctor} for ${new Date(
                                      slot.date,
                                    ).toLocaleString()}`,
                                  )
                                }
                                className="px-2.5 py-1.5 bg-vm-surface border border-vm-border rounded text-[11px] font-medium text-vm-text hover:bg-vm-primary hover:text-white hover:border-vm-primary transition-colors"
                              >
                                Book
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Audio Player */}
            <div className="bg-vm-surface rounded-lg border border-vm-border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="flex-shrink-0 w-9 h-9 rounded-lg bg-vm-primary text-white flex items-center justify-center hover:brightness-110 transition-all active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5 ml-0.5" />
                  )}
                </button>

                <audio
                  ref={audioRef}
                  src={voicemail.audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={onTimeUpdate}
                  onLoadedMetadata={onLoadedMetadata}
                  className="hidden"
                />

                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={onSeek}
                    className="cursor-pointer"
                  />
                </div>

                <span className="flex-shrink-0 text-[11px] tabular-nums text-vm-text-tertiary font-medium min-w-[60px] text-right">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-vm-surface rounded-lg border border-vm-border p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="font-display text-xs font-semibold text-vm-text tracking-wide uppercase mb-3">
                Transcript
              </h3>
              <p className="text-vm-text-secondary text-[13px] leading-[1.8] whitespace-pre-wrap">
                {voicemail.transcript}
              </p>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-vm-surface rounded-lg border border-vm-border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="font-display text-xs font-semibold text-vm-text tracking-wide uppercase mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-vm-border text-xs font-medium text-vm-text hover:bg-vm-card hover:border-vm-accent/30 transition-all group">
                  <div className="w-6 h-6 rounded bg-vm-card flex items-center justify-center group-hover:bg-vm-accent-light transition-colors">
                    <Phone className="h-3 w-3 text-vm-text-tertiary group-hover:text-vm-accent transition-colors" />
                  </div>
                  Call Back
                </button>
                <button
                  onClick={() => {
                    alert("Opening appointment scheduler...");
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-vm-border text-xs font-medium text-vm-text hover:bg-vm-card hover:border-vm-accent/30 transition-all group"
                >
                  <div className="w-6 h-6 rounded bg-vm-card flex items-center justify-center group-hover:bg-vm-accent-light transition-colors">
                    <Calendar className="h-3 w-3 text-vm-text-tertiary group-hover:text-vm-accent transition-colors" />
                  </div>
                  Schedule Appointment
                </button>
                <button
                  onClick={handleOpenProfile}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md border border-vm-border text-xs font-medium text-vm-text hover:bg-vm-card hover:border-vm-accent/30 transition-all group"
                >
                  <div className="w-6 h-6 rounded bg-vm-card flex items-center justify-center group-hover:bg-vm-accent-light transition-colors">
                    <User className="h-3 w-3 text-vm-text-tertiary group-hover:text-vm-accent transition-colors" />
                  </div>
                  View Patient Profile
                </button>
              </div>
            </div>

            {/* Call Details */}
            <div className="bg-vm-surface rounded-lg border border-vm-border p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
              <h3 className="font-display text-xs font-semibold text-vm-text tracking-wide uppercase mb-3">
                Call Details
              </h3>
              <dl className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-vm-text-tertiary">Duration</dt>
                  <dd className="text-vm-text font-medium tabular-nums">
                    {voicemail.duration}
                  </dd>
                </div>
                <div className="border-t border-vm-border-light pt-2.5 flex justify-between">
                  <dt className="text-vm-text-tertiary">Received</dt>
                  <dd className="text-vm-text font-medium">
                    {new Date(voicemail.timestamp).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div className="border-t border-vm-border-light pt-2.5 flex justify-between">
                  <dt className="text-vm-text-tertiary">Phone</dt>
                  <dd className="text-vm-text font-medium tabular-nums">
                    {voicemail.callerNumber}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        patients={matchedPatients}
        suggestedPatientId={analysis?.suggestedPatientId || null}
      />
    </div>
  );
}
