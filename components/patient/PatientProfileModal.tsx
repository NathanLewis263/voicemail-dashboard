"use client";

import {
  Calendar,
  FileText,
  ChevronRight,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { Patient } from "@/lib/data";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  suggestedPatientId: string | null;
}

export function PatientProfileModal({
  isOpen,
  onClose,
  patients,
  suggestedPatientId,
}: PatientProfileModalProps) {
  const [manualSelectionId, setManualSelectionId] = useState<string | null>(
    null,
  );

  // Determine the initially selected patient
  const selectedPatient =
    patients.length === 1
      ? patients[0]
      : manualSelectionId
        ? (patients.find((p) => p.id === manualSelectionId) ?? null)
        : null;

  const handleReschedule = () => {
    alert("Opening appointment scheduler...");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 bg-vm-surface">
        <DialogHeader className="px-6 py-4 border-b border-vm-border bg-vm-surface">
          <DialogTitle className="font-display text-lg font-semibold text-vm-text">
            {patients.length === 0 ? "No Patient Found" : "Patient Profile"}
          </DialogTitle>
        </DialogHeader>

        {patients.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-vm-text mb-6 leading-relaxed">
              We couldn&apos;t find a patient profile matching this phone
              number.
            </p>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Patient Selection Sidebar (if multiple) */}
            {!selectedPatient && patients.length > 1 && (
              <div className="w-full p-6 space-y-4 overflow-y-auto">
                <div>
                  <h3 className="text-sm font-medium text-vm-text mb-1">
                    Multiple Patients Found
                  </h3>
                  <p className="text-xs text-vm-text-secondary">
                    Select a patient associated with this number.
                  </p>
                </div>
                <div className="space-y-2">
                  {patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setManualSelectionId(patient.id)}
                      className={
                        "w-full flex items-center justify-between p-4 rounded-lg border bg-vm-bg transition-all group text-left " +
                        (patient.id === suggestedPatientId
                          ? "border-vm-primary/50 bg-vm-primary/5 hover:bg-vm-primary/10"
                          : "border-vm-border hover:border-vm-primary/50 hover:bg-vm-surface")
                      }
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm text-vm-text">
                            {patient.name}
                          </div>
                          {patient.id === suggestedPatientId && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-vm-primary text-white">
                              <Sparkles className="h-2.5 w-2.5" />
                              Most Likely
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-vm-text-tertiary mt-0.5">
                          DOB:{" "}
                          {new Date(patient.dateOfBirth).toLocaleDateString()} ·{" "}
                          {patient.gender}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-vm-text-tertiary group-hover:text-vm-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Details View */}
            {selectedPatient && (
              <div className="flex-1 overflow-y-auto">
                {/* Back button if multiple */}
                {patients.length > 1 && (
                  <button
                    onClick={() => setManualSelectionId(null)}
                    className="mx-6 mt-4 flex items-center gap-1 text-xs text-vm-text-tertiary hover:text-vm-text-secondary transition-colors"
                  >
                    ← Back to results
                  </button>
                )}

                <div className="p-6 space-y-8">
                  {/* Identity Header */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-vm-primary/10 flex items-center justify-center text-vm-primary text-xl font-display font-bold">
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-vm-text font-display">
                        {selectedPatient.name}
                      </h1>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-vm-text-secondary">
                        <span>
                          {new Date(
                            selectedPatient.dateOfBirth,
                          ).toLocaleDateString()}
                        </span>
                        <span className="text-vm-border">·</span>
                        <span>{selectedPatient.gender}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 text-xs text-vm-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-vm-text-tertiary" />
                          {selectedPatient.phoneNumber}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-vm-text-tertiary" />
                          {selectedPatient.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-vm-text mb-3">
                      <FileText className="h-4 w-4 text-vm-primary" />
                      Medical History
                    </h3>
                    <div className="bg-vm-bg/50 rounded-lg p-3 border border-vm-border">
                      {selectedPatient.medicalHistory.length > 0 ? (
                        <ul className="space-y-1.5">
                          {selectedPatient.medicalHistory.map((item, i) => (
                            <li
                              key={i}
                              className="text-xs text-vm-text-secondary flex items-start gap-2"
                            >
                              <span className="block mt-1.5 w-1 h-1 rounded-full bg-vm-text-tertiary flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-vm-text-tertiary italic">
                          No recorded medical history.
                        </p>
                      )}
                    </div>
                  </section>

                  {/* Appointments */}
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-vm-text mb-3">
                      <Calendar className="h-4 w-4 text-vm-primary" />
                      Upcoming Appointments
                    </h3>
                    <div className="space-y-3">
                      {selectedPatient.upcomingAppointments.length > 0 ? (
                        selectedPatient.upcomingAppointments.map((appt) => (
                          <div
                            key={appt.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-vm-border bg-vm-surface shadow-sm"
                          >
                            <div>
                              <div className="text-sm font-medium text-vm-text">
                                {appt.type}
                              </div>
                              <div className="text-xs text-vm-text-secondary mt-0.5">
                                {new Date(appt.date).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  },
                                )}{" "}
                                with {appt.doctor}
                              </div>
                            </div>
                            <button
                              onClick={handleReschedule}
                              className="px-3 py-1.5 rounded-md text-xs font-medium bg-vm-bg border border-vm-border text-vm-text-secondary hover:bg-vm-surface hover:text-vm-primary hover:border-vm-primary/30 transition-all"
                            >
                              Reschedule
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-lg bg-vm-bg/50 border border-vm-border border-dashed text-center">
                          <p className="text-xs text-vm-text-tertiary">
                            No upcoming appointments.
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
