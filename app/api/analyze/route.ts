import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const AnalysisSchema = z.object({
  summary: z.string(),
  intent: z.enum([
    "Appointment",
    "Prescription",
    "Referral",
    "Test Results",
    "General Inquiry",
    "Emergency",
  ]),
  urgency: z
    .enum(["Low", "Medium", "High"])
    .describe(
      "Urgency level of the voicemail. Low: Routine appointments, rescheduling, general inquiries. Medium: Acute symptoms but stable, urgent referrals, action required but not immediately life-threatening. High: Emergencies, severe distress, immediate action required.",
    ),
  confidence: z
    .number()
    .min(0)
    .max(100)
    .describe("Confidence score (0-100) of the analysis"),
  keyDetails: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  suggestedAction: z.string(),
  suggestedAppointmentType: z
    .enum(["Short Consult", "Standard Consult", "Long Consult", "Urgent"])
    .nullable()
    .describe(
      "If the intent is Appointment or Emergency, suggest the most appropriate appointment type based on the context. Short: Scripts, simple things. Standard: Normal checkups. Long: Multiple issues, mental health, complex. Urgent: Needs to be seen today.",
    ),
  suggestedPatientId: z
    .string()
    .nullable()
    .describe(
      "ID of the most likely patient from the provided list, or null if none match clearly",
    ),
  requestedDoctor: z
    .string()
    .nullable()
    .describe("Name of the doctor requested by the caller, if any."),
});

export async function POST(req: Request) {
  try {
    const { transcript, potentialPatients } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: apiKey,
    });

    const patientsContext =
      potentialPatients && potentialPatients.length > 0
        ? `
        Potential Patients matching caller number:
        ${JSON.stringify(potentialPatients, null, 2)}
        
        If the transcript indicates who the caller is or who the voicemail is about, identify the best match from the list above and return their ID as 'suggestedPatientId'. If significantly uncertain or no match, return null.
      `
        : "";

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: AnalysisSchema,
      prompt: `
        Analyze the following voicemail transcript and extract structured information. The calls are from Australia. Assume the current date is Friday, February 27th, 2026.
        
        Transcript: "${transcript}"
        
        ${patientsContext}

        Also provide a 'confidence' score (0-100) representing how confident you are in the intent classification and entity extraction.
        
        If the intent is related to booking an appointment or a health issue:
        1. Suggest an appropriate appointment type (Short, Standard, Long, or Urgent) in 'suggestedAppointmentType'.
        2. Extract any requested doctor name into 'requestedDoctor'.
      `,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
