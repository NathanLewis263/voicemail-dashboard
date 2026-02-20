export interface Voicemail {
  id: string;
  callerName: string;
  callerNumber: string;
  timestamp: string;
  duration: string;
  transcript: string;
  audioUrl: string;
}

export const mockVoicemails: Voicemail[] = [
  {
    id: "1",
    callerName: "Sarah Jenkins",
    callerNumber: "0411 123 456",
    timestamp: "2026-02-27T09:15:00",
    duration: "0:42",
    transcript:
      "Hi, this is Sarah Jenkins. I'm calling because I've had a really high fever since last night, about 39.5 degrees, and I'm having trouble breathing. I'm really worried and I don't know if I should go to emergency or come in. Please call me back as soon as possible on 0411 123 456.",
    audioUrl: "/audio/1.mp3",
  },
  {
    id: "2",
    callerName: "Michael Chang",
    callerNumber: "0498 765 432",
    timestamp: "2026-02-27T10:30:00",
    duration: "0:24",
    transcript:
      "Hello, this is Michael Chang. I need a repeat for my lisinopril script. The chemist said I've run out. I take it for my blood pressure. My date of birth is the 15th of June, 1980. Thanks.",
    audioUrl: "/audio/2.mp3",
  },
  {
    id: "3",
    callerName: "Unknown",
    callerNumber: "0422 555 199",
    timestamp: "2026-02-26T14:20:00",
    duration: "0:35",
    transcript:
      "Hi, I'm just calling to see if you are accepting new patients for Dr. Smith. I have private health with Bupa. My number is 0422 555 199. Thank you.",
    audioUrl: "/audio/3.mp3",
  },
  {
    id: "4",
    callerName: "Emily Clark",
    callerNumber: "0433 234 567",
    timestamp: "2026-02-27T11:45:00",
    duration: "0:28",
    transcript:
      "Hi, this is Emily Clark calling. I booked an appointment for next Tuesday at 2 PM, but something came up and I need to reschedule. Any time next Wednesday morning would be great. My mobile is 0433 234 567. Please let me know if that works.",
    audioUrl: "/audio/4.mp3",
  },
  {
    id: "5",
    callerName: "Robert Johnson",
    callerNumber: "0444 876 543",
    timestamp: "2026-02-26T16:10:00",
    duration: "0:30",
    transcript:
      "Good afternoon, this is Robert Johnson. Dr. Lee referred me to your clinic for a cardiology consultation. He said he would send over my referral. I wanted to confirm you received it and make an appointment. My number is 0444 876 543.",
    audioUrl: "/audio/5.mp3",
  },
  {
    id: "6",
    callerName: "Emily Clark",
    callerNumber: "0433 234 567",
    timestamp: "2026-02-27T12:30:00",
    duration: "0:14",
    transcript:
      "Hi, it's Emily. I'm actually calling about my son Noah. He's developed a spotty rash on his torso and seems really lethargic. No fever yet, but I'm worried it might be chicken pox or something. Can we squeeze him in with Dr. Smith today? Thanks.",
    audioUrl: "/audio/6.mp3",
  },
];

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  phoneNumber: string;
  email: string;
  medicalHistory: string[];
  upcomingAppointments: {
    id: string;
    date: string;
    type: string;
    doctor: string;
  }[];
}

export const mockPatients: Patient[] = [
  {
    id: "p1",
    name: "Sarah Jenkins",
    dateOfBirth: "1985-04-12",
    gender: "Female",
    phoneNumber: "0411 123 456",
    email: "sarah.jenkins@example.com",
    medicalHistory: ["Asthma", "Recurrent Bronchitis", "Anxiety"],
    upcomingAppointments: [
      {
        id: "a1",
        date: "2026-03-05T09:00:00",
        type: "General Checkup",
        doctor: "Dr. Smith",
      },
    ],
  },
  {
    id: "p2",
    name: "Michael Chang",
    dateOfBirth: "1980-06-15",
    gender: "Male",
    phoneNumber: "0498 765 432",
    email: "m.chang@example.com",
    medicalHistory: ["Hypertension", "Type 2 Diabetes", "High Cholesterol"],
    upcomingAppointments: [],
  },
  // Example of multiple patients sharing a phone number (e.g., parent/child)
  {
    id: "p3",
    name: "Emily Clark",
    dateOfBirth: "1992-09-23",
    gender: "Female",
    phoneNumber: "0433 234 567",
    email: "emily.clark@example.com",
    medicalHistory: ["Migraines", "Postnatal Depression (Past)"],
    upcomingAppointments: [
      {
        id: "a2",
        date: "2026-03-03T14:00:00",
        type: "Consultation",
        doctor: "Dr. Chloe",
      },
    ],
  },
  {
    id: "p4",
    name: "Noah Clark",
    dateOfBirth: "2017-02-10",
    gender: "Male",
    phoneNumber: "0433 234 567", // Shared phone number
    email: "emily.clark@example.com", // Parent email
    medicalHistory: ["Eczema", "Peanut Allergy", "Asthma"],
    upcomingAppointments: [
      {
        id: "a3",
        date: "2026-03-15T10:30:00",
        type: "Vaccination",
        doctor: "Nurse Joy",
      },
    ],
  },
];

export interface AppointmentSlot {
  id: string;
  date: string;
  doctor: string;
  type: string;
}

export const mockAvailableSlots: AppointmentSlot[] = [
  {
    id: "s1",
    date: "2026-02-27T08:30:00",
    doctor: "Dr. Smith",
    type: "Short Consult",
  },
  {
    id: "s2",
    date: "2026-02-27T09:00:00",
    doctor: "Dr. Smith",
    type: "Standard Consult",
  },
  {
    id: "s3",
    date: "2026-02-27T09:30:00",
    doctor: "Dr. Smith",
    type: "Short Consult",
  },
  {
    id: "s4",
    date: "2026-02-27T10:00:00",
    doctor: "Dr. Jones",
    type: "Standard Consult",
  },
  {
    id: "s5",
    date: "2026-02-27T10:30:00",
    doctor: "Dr. Jones",
    type: "Standard Consult",
  },
  {
    id: "s6",
    date: "2026-02-27T14:00:00",
    doctor: "Dr. Smith",
    type: "Short Consult",
  },
  {
    id: "s7",
    date: "2026-02-27T15:30:00",
    doctor: "Dr. Chloe",
    type: "Long Consult",
  },
  {
    id: "s8",
    date: "2026-02-28T09:00:00",
    doctor: "Dr. Smith",
    type: "Standard Consult",
  },
  {
    id: "s9",
    date: "2026-02-28T10:00:00",
    doctor: "Dr. Jones",
    type: "Standard Consult",
  },
  {
    id: "s10",
    date: "2026-03-04T09:00:00", // Next Wednesday
    doctor: "Dr. Chloe",
    type: "Standard Consult",
  },
  {
    id: "s11",
    date: "2026-03-04T09:30:00", // Next Wednesday
    doctor: "Dr. Chloe",
    type: "Standard Consult",
  },
  {
    id: "s12",
    date: "2026-03-04T10:00:00", // Next Wednesday
    doctor: "Dr. Chloe",
    type: "Standard Consult",
  },
];
