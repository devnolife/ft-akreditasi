import type { FormField } from "@/components/dynamic-form/form-builder"

// Personal Data Fields
export const personalDataFields: FormField[] = [
  {
    name: "url_foto",
    label: "Foto Profil",
    type: "file",
    description: "Unggah foto profil Anda",
  },
  {
    name: "nama",
    label: "Nama Lengkap",
    type: "text",
    placeholder: "Masukkan nama lengkap",
    required: true,
  },
  {
    name: "front_degree",
    label: "Gelar Depan",
    type: "text",
    placeholder: "Contoh: Dr., Prof.",
  },
  {
    name: "back_degree",
    label: "Gelar Belakang",
    type: "text",
    placeholder: "Contoh: S.Pd., M.Pd., Ph.D.",
  },
  {
    name: "tempat_lahir",
    label: "Tempat Lahir",
    type: "text",
    placeholder: "Masukkan tempat lahir",
  },
  {
    name: "tanggal_lahir",
    label: "Tanggal Lahir",
    type: "date",
  },
  {
    name: "jenis_kelamin",
    label: "Jenis Kelamin",
    type: "select",
    placeholder: "Pilih jenis kelamin",
    options: [
      { label: "Laki-laki", value: "Laki-laki" },
      { label: "Perempuan", value: "Perempuan" },
    ],
  },
  {
    name: "alamat",
    label: "Alamat",
    type: "textarea",
    placeholder: "Masukkan alamat lengkap",
  },
  {
    name: "telepon",
    label: "Nomor Telepon",
    type: "text",
    placeholder: "Masukkan nomor telepon",
    required: true,
  },
  {
    name: "nomor_pegawai",
    label: "NIP/NIDN",
    type: "text",
    placeholder: "Masukkan NIP/NIDN",
    required: true,
  },
  {
    name: "jabatan",
    label: "Jabatan Akademik",
    type: "select",
    placeholder: "Pilih jabatan akademik",
    required: true,
    options: [
      { label: "Asisten Ahli", value: "Asisten Ahli" },
      { label: "Lektor", value: "Lektor" },
      { label: "Lektor Kepala", value: "Lektor Kepala" },
      { label: "Profesor", value: "Profesor" },
      { label: "Tenaga Pengajar", value: "Tenaga Pengajar" },
    ],
  },
  {
    name: "status_kepegawaian",
    label: "Status Kepegawaian",
    type: "select",
    placeholder: "Pilih status kepegawaian",
    options: [
      { label: "PNS", value: "PNS" },
      { label: "PPPK", value: "PPPK" },
      { label: "Tetap", value: "Tetap" },
      { label: "Tidak Tetap", value: "Tidak Tetap" },
      { label: "Kontrak", value: "Kontrak" },
    ],
  },
  {
    name: "spesialisasi",
    label: "Bidang Keahlian",
    type: "text",
    placeholder: "Masukkan bidang keahlian",
  },
  {
    name: "gelar_tertinggi",
    label: "Gelar Tertinggi",
    type: "select",
    placeholder: "Pilih gelar tertinggi",
    options: [
      { label: "S1/Sarjana", value: "S1" },
      { label: "S2/Magister", value: "S2" },
      { label: "S3/Doktor", value: "S3" },
    ],
  },
  {
    name: "institusi",
    label: "Institusi Pendidikan Terakhir",
    type: "text",
    placeholder: "Masukkan institusi pendidikan terakhir",
  },
  {
    name: "tahun_lulus",
    label: "Tahun Lulus",
    type: "number",
    placeholder: "Masukkan tahun lulus pendidikan terakhir",
  },
  {
    name: "biografi",
    label: "Biografi",
    type: "textarea",
    placeholder: "Tuliskan biografi singkat",
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
