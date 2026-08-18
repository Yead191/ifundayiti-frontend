export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "grants",
    title: "Grants",
    items: [
      {
        question: "Who can apply?",
        answer:
          "Applicants should be based in Haiti and able to carry out a community-focused project. Final eligibility is confirmed during review.",
      },
      {
        question: "How much can I request?",
        answer:
          "The maximum requested grant amount is $1,000. Requests above that amount cannot be considered.",
      },
      {
        question: "What documents are required?",
        answer:
          "A government-issued ID, proof of address, and a project description are required. A business plan or supporting images are recommended.",
      },
      {
        question: "When can I apply?",
        answer:
          "Applications are accepted only during an open grant cycle. Dates are published on the Grants page.",
      },
      {
        question: "How are applications reviewed?",
        answer:
          "The IFundAyiti team reviews completeness, feasibility, and expected community impact. Status then moves from submitted to under review.",
      },
      {
        question: "How are finalists selected?",
        answer:
          "Approved applicants with the strongest community case may become finalists for the current cycle.",
      },
      {
        question: "How is the winner selected?",
        answer:
          "One finalist is selected as the winner per application period according to IFundAyiti’s selection process.",
      },
    ],
  },
  {
    id: "application",
    title: "Application",
    items: [
      {
        question: "How do I submit?",
        answer:
          "Use the Apply page, complete each step, upload required documents, review your answers, and submit.",
      },
      {
        question: "How do I track my application?",
        answer:
          "Go to Track Application and enter the email and date of birth used on your submission.",
      },
      {
        question: "What if I lose access to my email?",
        answer:
          "Contact IFundAyiti with your full name and date of birth so the team can help verify your application.",
      },
      {
        question: "Can I edit my application after submission?",
        answer:
          "Submitted applications are not editable. If a correction is needed, contact the team before the review window closes.",
      },
    ],
  },
  {
    id: "donations",
    title: "Donations",
    items: [
      {
        question: "Where does my donation go?",
        answer:
          "Donations go to the IFundAyiti Program Fund. They are not linked to an individual applicant.",
      },
      {
        question: "Can I donate anonymously?",
        answer:
          "You may use a preferred public name. Payment details are still required for processing.",
      },
      {
        question: "How do I receive confirmation?",
        answer:
          "A confirmation is sent to the email provided on the donation form after a successful payment.",
      },
    ],
  },
  {
    id: "shop",
    title: "Shop",
    items: [
      {
        question: "Shipping",
        answer:
          "Shipping details will be confirmed at checkout when the merchandise shop is fully launched.",
      },
      {
        question: "Returns",
        answer:
          "Unworn items in original condition may be returned according to the shop return policy.",
      },
      {
        question: "Payment",
        answer: "Accepted payment methods will be shown at checkout.",
      },
      {
        question: "Order tracking",
        answer:
          "Order status will be available from the confirmation email once fulfillment is live.",
      },
    ],
  },
];
