import type { FormField } from "@/components/dynamic-form/form-builder"

// Personal Data Fields
export const personalDataFields: FormField[] = [
  {
    name: "profileImage",
    label: "Profile Photo",
    type: "file",
    description: "Upload your profile photo",
  },
  {
    name: "frontDegree",
    label: "Front Degree",
    type: "text",
    placeholder: "e.g., Dr., Prof.",
  },
  {
    name: "fullName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "backDegree",
    label: "Back Degree",
    type: "text",
    placeholder: "e.g., S.Pd., M.Pd., Ph.D.",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email address",
    required: true,
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "text",
    placeholder: "Enter your phone number",
    required: true,
  },
  {
    name: "employeeId",
    label: "Employee ID",
    type: "text",
    placeholder: "Enter your employee ID",
    required: true,
  },
  {
    name: "position",
    label: "Academic Position",
    type: "select",
    placeholder: "Select your position",
    required: true,
    options: [
      { label: "Assistant Professor", value: "assistant_professor" },
      { label: "Associate Professor", value: "associate_professor" },
      { label: "Professor", value: "professor" },
      { label: "Lecturer", value: "lecturer" },
      { label: "Senior Lecturer", value: "senior_lecturer" },
    ],
  },
  {
    name: "department",
    label: "Department",
    type: "text",
    placeholder: "Enter your department",
    required: true,
  },
  {
    name: "specialization",
    label: "Specialization",
    type: "text",
    placeholder: "Enter your specialization",
  },
  {
    name: "highestDegree",
    label: "Highest Degree",
    type: "select",
    placeholder: "Select your highest degree",
    options: [
      { label: "Bachelor's", value: "bachelors" },
      { label: "Master's", value: "masters" },
      { label: "Doctorate", value: "doctorate" },
      { label: "Post-Doctorate", value: "post_doctorate" },
    ],
  },
  {
    name: "bio",
    label: "Biography",
    type: "textarea",
    placeholder: "Write a short biography",
  },
]

// Research Fields
export const researchFields: FormField[] = [
  {
    name: "title",
    label: "Research Title",
    type: "text",
    placeholder: "Enter research title",
    required: true,
  },
  {
    name: "researchImage",
    label: "Research Image",
    type: "file",
    description: "Upload an image related to your research",
  },
  {
    name: "abstract",
    label: "Abstract",
    type: "textarea",
    placeholder: "Enter research abstract",
    required: true,
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select research status",
    required: true,
    options: [
      { label: "Proposed", value: "proposed" },
      { label: "In Progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "Published", value: "published" },
    ],
  },
  {
    name: "fundingSource",
    label: "Funding Source",
    type: "text",
    placeholder: "Enter funding source",
  },
  {
    name: "fundingAmount",
    label: "Funding Amount",
    type: "number",
    placeholder: "Enter funding amount",
  },
  {
    name: "collaborators",
    label: "Collaborators",
    type: "text",
    placeholder: "Enter collaborators (comma separated)",
  },
  {
    name: "researchDocuments",
    label: "Research Documents",
    type: "file",
    multiple: true,
  },
]

// Community Service Fields
export const communityServiceFields: FormField[] = [
  {
    name: "title",
    label: "Service Title",
    type: "text",
    placeholder: "Enter service title",
    required: true,
  },
  {
    name: "serviceImage",
    label: "Service Image",
    type: "file",
    description: "Upload an image of your community service activity",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter service description",
    required: true,
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Enter service location",
    required: true,
  },
  {
    name: "startDate",
    label: "Start Date",
    type: "date",
    required: true,
  },
  {
    name: "endDate",
    label: "End Date",
    type: "date",
  },
  {
    name: "beneficiaries",
    label: "Beneficiaries",
    type: "text",
    placeholder: "Enter beneficiaries",
  },
  {
    name: "impact",
    label: "Impact",
    type: "textarea",
    placeholder: "Describe the impact of this service",
  },
  {
    name: "serviceDocuments",
    label: "Service Documents",
    type: "file",
    multiple: true,
  },
]

// Publication Fields
export const publicationFields: FormField[] = [
  {
    name: "title",
    label: "Publication Title",
    type: "text",
    placeholder: "Enter publication title",
    required: true,
  },
  {
    name: "publicationImage",
    label: "Publication Image",
    type: "file",
    description: "Upload an image of your publication (e.g., journal cover)",
  },
  {
    name: "abstract",
    label: "Abstract",
    type: "textarea",
    placeholder: "Enter publication abstract",
    required: true,
  },
  {
    name: "authors",
    label: "Authors",
    type: "text",
    placeholder: "Enter authors (comma separated)",
    required: true,
  },
  {
    name: "publicationType",
    label: "Publication Type",
    type: "select",
    placeholder: "Select publication type",
    required: true,
    options: [
      { label: "Journal Article", value: "journal_article" },
      { label: "Conference Paper", value: "conference_paper" },
      { label: "Book Chapter", value: "book_chapter" },
      { label: "Book", value: "book" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "publicationDate",
    label: "Publication Date",
    type: "date",
    required: true,
  },
  {
    name: "publisher",
    label: "Publisher/Journal",
    type: "text",
    placeholder: "Enter publisher or journal name",
    required: true,
  },
  {
    name: "doi",
    label: "DOI",
    type: "text",
    placeholder: "Enter DOI if available",
  },
  {
    name: "url",
    label: "URL",
    type: "text",
    placeholder: "Enter publication URL if available",
  },
  {
    name: "publicationDocuments",
    label: "Publication Documents",
    type: "file",
    multiple: true,
  },
]

// Intellectual Property Fields
export const intellectualPropertyFields: FormField[] = [
  {
    name: "title",
    label: "IP Title",
    type: "text",
    placeholder: "Enter intellectual property title",
    required: true,
  },
  {
    name: "ipImage",
    label: "IP Image",
    type: "file",
    description: "Upload an image related to your intellectual property",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter intellectual property description",
    required: true,
  },
  {
    name: "ipType",
    label: "IP Type",
    type: "select",
    placeholder: "Select IP type",
    required: true,
    options: [
      { label: "Patent", value: "patent" },
      { label: "Copyright", value: "copyright" },
      { label: "Trademark", value: "trademark" },
      { label: "Industrial Design", value: "industrial_design" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "registrationNumber",
    label: "Registration Number",
    type: "text",
    placeholder: "Enter registration number",
    required: true,
  },
  {
    name: "registrationDate",
    label: "Registration Date",
    type: "date",
    required: true,
  },
  {
    name: "expiryDate",
    label: "Expiry Date",
    type: "date",
  },
  {
    name: "inventors",
    label: "Inventors/Creators",
    type: "text",
    placeholder: "Enter inventors/creators (comma separated)",
    required: true,
  },
  {
    name: "ipDocuments",
    label: "IP Documents",
    type: "file",
    multiple: true,
  },
]

// Recognition Fields
export const recognitionFields: FormField[] = [
  {
    name: "title",
    label: "Recognition Title",
    type: "text",
    placeholder: "Enter recognition/award title",
    required: true,
  },
  {
    name: "recognitionImage",
    label: "Recognition Image",
    type: "file",
    description: "Upload an image of your award or recognition",
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Enter recognition description",
    required: true,
  },
  {
    name: "awardingBody",
    label: "Awarding Body",
    type: "text",
    placeholder: "Enter awarding institution/organization",
    required: true,
  },
  {
    name: "awardDate",
    label: "Award Date",
    type: "date",
    required: true,
  },
  {
    name: "level",
    label: "Recognition Level",
    type: "select",
    placeholder: "Select recognition level",
    required: true,
    options: [
      { label: "International", value: "international" },
      { label: "National", value: "national" },
      { label: "Regional", value: "regional" },
      { label: "Institutional", value: "institutional" },
    ],
  },
  {
    name: "recognitionDocuments",
    label: "Recognition Documents",
    type: "file",
    multiple: true,
  },
]
