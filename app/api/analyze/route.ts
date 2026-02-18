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
  urgency: z.enum(["Low", "Medium", "High"]),
  keyDetails: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ),
  suggestedAction: z.string(),
});

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

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

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: AnalysisSchema,
      prompt: `
        Analyze the following voicemail transcript and extract structured information.
        
        Transcript: "${transcript}"
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
