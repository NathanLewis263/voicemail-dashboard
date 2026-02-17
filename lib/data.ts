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
    timestamp: "2023-10-27T09:15:00",
    duration: "0:19",
    transcript:
      "Hi, this is Sarah Jenkins. I'm calling because I've had a really high fever since last night, about 39.5 degrees, and I'm having trouble breathing. I'm really worried and I don't know if I should go to emergency or come in. Please call me back as soon as possible on 0411 123 456.",
    audioUrl: "/audio/1.mp3",
  },
  {
    id: "2",
    callerName: "Michael Chang",
    callerNumber: "0498 765 432",
    timestamp: "2023-10-27T10:30:00",
    duration: "0:09",
    transcript:
      "Hello, this is Michael Chang. I need a repeat for my lisinopril script. The chemist said I've run out. I take it for my blood pressure. My date of birth is the 15th of June, 1980. Thanks.",
    audioUrl: "/audio/2.mp3",
  },
  {
    id: "3",
    callerName: "Unknown",
    callerNumber: "0422 555 199",
    timestamp: "2023-10-26T14:20:00",
    duration: "0:12",
    transcript:
      "Hi, I'm just calling to see if you are accepting new patients for Dr. Smith. I have private health with Bupa. My number is 0422 555 199. Thank you.",
    audioUrl: "/audio/3.mp3",
  },
  {
    id: "4",
    callerName: "Emily Clark",
    callerNumber: "0433 234 567",
    timestamp: "2023-10-27T11:45:00",
    duration: "0:16",
    transcript:
      "Hi, this is Emily Clark calling. I booked an appointment for next Tuesday at 2 PM, but something came up and I need to reschedule. Any time next Wednesday morning would be great. My mobile is 0433 234 567. Please let me know if that works.",
    audioUrl: "/audio/4.mp3",
  },
  {
    id: "5",
    callerName: "Robert Johnson",
    callerNumber: "0444 876 543",
    timestamp: "2023-10-26T16:10:00",
    duration: "0:19",
    transcript:
      "Good afternoon, this is Robert Johnson. Dr. Lee referred me to your clinic for a cardiology consultation. He said he would send over my referral. I wanted to confirm you received it and make an appointment. My number is 0444 876 543.",
    audioUrl: "/audio/5.mp3",
  },
];
