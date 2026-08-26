export type TApplicationStatus =
  | "submitted"
  | "underReview"
  | "approved"
  | "rejected"
  | "finalist"
  | "winner"
  | "archived";

export interface ApplicationTrackData {
  _id: string;
  applicationPeriod: {
    title: string;
  };
  personal: {
    name: string;
    dob: string;
    nationality: string;
    location: string;
    image?: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  identification: {
    nationalId: string;
    passport: string;
  };
  grant: {
    projectName: string;
    projectDescription: string;
    requestedAmount: number;
    fundUsage: string;
    expectedImpact: string;
  };
  background: {
    occupation: string;
    financialBackground: string;
  };
  documents: {
    type: string;
    url: string;
  }[];
  status: TApplicationStatus;
  rejectionReason?: string;
  successStory?: string;
  fundedAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export const POSITIVE_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "underReview", label: "Under Review" },
  { key: "approved", label: "Approved" },
  { key: "finalist", label: "Finalist" },
  { key: "winner", label: "Winner" },
];
