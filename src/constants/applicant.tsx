export const APPLICANT_COLUMN_MAPPING: { [key: string]: string } = {
  Nationality: "nationality",
  Ethnicnity: "ethnicity",
  "Fee Status": "combined_fee_status",
  Gender: "gender",
  "Decision Status": "decision_status",
};

export const DECISION_STATUS_OPTIONS = [
  "Condition Firm",
  "Condition Declined",
  "Condition Rejected",
  "Condition Pending",
  "Uncondition Firm",
  "Uncondition Firm Temp",
  "Uncodition Declined",
  "Uncondition Pending",
  "Reconsideration",
  "Rejected",
  "Offer Withdrawn",
  "Withdrawn",
  "Deferred",
  "No Decision",
];
