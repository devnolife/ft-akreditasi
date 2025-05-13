// Mock users for authentication
export const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    username: "jsmith",
    password: "password123",
    role: "lecturer",
  },
  {
    id: "2",
    name: "Jane Doe",
    username: "jdoe",
    password: "password123",
    role: "lecturer",
  },
  {
    id: "3",
    name: "Admin User",
    username: "admin",
    password: "admin123",
    role: "admin",
  },
]

// Mock personal data
export const mockPersonalData = {
  fullName: "John Smith",
  employeeId: "EMP12345",
  email: "john.smith@university.edu",
  phone: "+1 (555) 123-4567",
  department: "computer_science",
  position: "associate_professor",
  specialization: "Machine Learning",
  highestDegree: "phd",
  bio: "Dr. John Smith is an Associate Professor specializing in machine learning and artificial intelligence. He has over 10 years of experience in academic research and teaching.",
}

// Mock research data
export const mockResearchData = [
  {
    title: "Machine Learning Applications in Healthcare",
    description:
      "This research explores the application of machine learning algorithms to improve diagnostic accuracy in medical imaging.",
    role: "principal_investigator",
    startDate: "2022-01-15",
    endDate: null,
    ongoing: true,
    fundingSource: "National Science Foundation",
    fundingAmount: "$250,000",
    studentInvolvement: true,
    numberOfStudents: "3",
    publicationStatus: "published",
    journalName: "IEEE Transactions on Medical Imaging",
  },
  {
    title: "Natural Language Processing for Educational Content",
    description: "Developing NLP techniques to analyze and improve educational content for better learning outcomes.",
    role: "co_investigator",
    startDate: "2021-03-10",
    endDate: "2022-12-15",
    ongoing: false,
    fundingSource: "University Research Grant",
    fundingAmount: "$75,000",
    studentInvolvement: true,
    numberOfStudents: "2",
    publicationStatus: "in_preparation",
    journalName: "",
  },
]

// Mock community service data
export const mockCommunityServiceData = [
  {
    title: "Science Fair Judge",
    organization: "Local High School District",
    description:
      "Served as a judge for the annual science fair, evaluating student projects in computer science and engineering.",
    date: "2023-04-15",
    hours: 8,
  },
  {
    title: "Coding Workshop Instructor",
    organization: "Community Learning Center",
    description:
      "Conducted monthly coding workshops for underprivileged youth, teaching basic programming concepts and problem-solving skills.",
    date: "2022-09-01",
    ongoing: true,
    hours: 4,
  },
]

// Mock publication data
export const mockPublicationData = [
  {
    title: "Deep Learning Approaches for Medical Image Segmentation",
    authors: "Smith, J., Johnson, A., Williams, B.",
    journal: "IEEE Transactions on Medical Imaging",
    volume: "41",
    issue: "3",
    pages: "782-795",
    year: "2023",
    doi: "10.1109/TMI.2022.3456789",
    type: "journal",
  },
  {
    title: "Transformer Models for Educational Content Analysis",
    authors: "Smith, J., Brown, C., Davis, E.",
    conference: "International Conference on Educational Data Mining",
    location: "Toronto, Canada",
    pages: "123-130",
    year: "2022",
    doi: "10.1145/3456789.0123456",
    type: "conference",
  },
]

// Mock intellectual property data
export const mockIntellectualPropertyData = [
  {
    title: "Method and System for Automated Medical Image Analysis",
    type: "patent",
    registrationNumber: "US12345678",
    filingDate: "2022-05-20",
    status: "pending",
    description: "A novel method for automated analysis of medical images using deep learning techniques.",
  },
  {
    title: "EduText: Educational Content Analysis Software",
    type: "copyright",
    registrationNumber: "TXu-2-345-678",
    filingDate: "2021-11-10",
    status: "registered",
    description: "Software for analyzing and improving educational text content using natural language processing.",
  },
]

// Mock recognition data
export const mockRecognitionData = [
  {
    title: "Outstanding Researcher Award",
    organization: "University Research Council",
    year: "2023",
    description: "Awarded for exceptional contributions to research in machine learning applications.",
  },
  {
    title: "Best Paper Award",
    organization: "International Conference on Educational Data Mining",
    year: "2022",
    description: "Received for the paper 'Transformer Models for Educational Content Analysis'.",
  },
  {
    title: "Journal Reviewer",
    organization: "IEEE Transactions on Medical Imaging",
    year: "2021-present",
    description: "Serving as a reviewer for submitted manuscripts.",
  },
]

// Complete mock user data
export const mockCompleteUserData = {
  personalData: mockPersonalData,
  researchData: mockResearchData,
  communityServiceData: mockCommunityServiceData,
  publicationData: mockPublicationData,
  intellectualPropertyData: mockIntellectualPropertyData,
  recognitionData: mockRecognitionData,
}
