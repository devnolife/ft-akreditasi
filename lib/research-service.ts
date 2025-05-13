import type { ResearchProject } from "@/types/research"

// This would be replaced with actual API calls in a production environment
export async function getResearchProjects(userId: string): Promise<ResearchProject[]> {
  // Sample data based on the provided structure
  const sampleData: ResearchProject[] = [
    {
      name: "ARWIN JULI RAKHMADI",
      email: "arwinjuli@umsu.ac.id",
      id_proposal: "431654",
      id_dosen: "6170348",
      judul:
        "PENGEMBANGAN MEDIA AJAR LUBANG HITAM DI OBSERVATORIUM ILMU FALAK UNIVERSITAS MUHAMMADIYAH SUMATERA UTARA (OIF UMSU)",
      kategori: "Penelitian",
      id_jenis: null,
      l_belakang: null,
      proposal_kegiatan: null,
      file_proposal: null,
      kontrak_kegiatan: null,
      file_luaran: null,
      stt_penetapan: "Diterima",
      lokasi: null,
      total_dana: null,
      id_sumber_dana: null,
      sumber_dana: "HIBAH INTERNAL",
      tahun: 2021,
      leader: "HASRIAN RUDI SETIAWAN",
      leader_nidn: 107049101,
      first_proposed_year: 2021,
      implementation_year: 2021,
      focus: "SOSIAL HUMANIORA",
      funds_approved: "Rp. 7,000,000.0",
      scheme_id: "",
      scheme_abbrev: "PD",
      scheme_name: "PENELITIAN DASAR",
      kategori_sumber_dana: "Institusi Internal",
      negara_sumber_dana: "ID",
      sumber_data: "MANUAL",
      kd_program_hibah: "10",
      program_hibah: "HIBAH INTERNAL",
      manual: "N",
      sumber: "Sinta",
      created_at: "2024-09-20 00:40:11",
      updated_at: "2024-09-20 00:40:11",
      nidn: "0120078004",
      nm_jenis: null,
    },
    // Add more sample data with different values for demonstration
    {
      name: "ARWIN JULI RAKHMADI",
      email: "arwinjuli@umsu.ac.id",
      id_proposal: "431655",
      id_dosen: "6170348",
      judul: "ANALISIS DAMPAK PEMBELAJARAN DARING TERHADAP MOTIVASI BELAJAR MAHASISWA SELAMA PANDEMI COVID-19",
      kategori: "Penelitian",
      id_jenis: null,
      l_belakang: null,
      proposal_kegiatan: null,
      file_proposal: "proposal.pdf",
      kontrak_kegiatan: null,
      file_luaran: null,
      stt_penetapan: "Diterima",
      lokasi: "Universitas Muhammadiyah Sumatera Utara",
      total_dana: "Rp. 10,000,000.0",
      id_sumber_dana: null,
      sumber_dana: "HIBAH INTERNAL",
      tahun: 2022,
      leader: "ARWIN JULI RAKHMADI",
      leader_nidn: 120078004,
      first_proposed_year: 2022,
      implementation_year: 2022,
      focus: "PENDIDIKAN",
      funds_approved: "Rp. 10,000,000.0",
      scheme_id: "",
      scheme_abbrev: "PT",
      scheme_name: "PENELITIAN TERAPAN",
      kategori_sumber_dana: "Institusi Internal",
      negara_sumber_dana: "ID",
      sumber_data: "MANUAL",
      kd_program_hibah: "10",
      program_hibah: "HIBAH INTERNAL",
      manual: "N",
      sumber: "Sinta",
      created_at: "2024-09-20 00:40:11",
      updated_at: "2024-09-20 00:40:11",
      nidn: "0120078004",
      nm_jenis: null,
    },
    {
      name: "ARWIN JULI RAKHMADI",
      email: "arwinjuli@umsu.ac.id",
      id_proposal: "431656",
      id_dosen: "6170348",
      judul: "PENGEMBANGAN APLIKASI MOBILE UNTUK PEMBELAJARAN ASTRONOMI BERBASIS AUGMENTED REALITY",
      kategori: "Penelitian",
      id_jenis: null,
      l_belakang: null,
      proposal_kegiatan: null,
      file_proposal: null,
      kontrak_kegiatan: null,
      file_luaran: null,
      stt_penetapan: "Menunggu",
      lokasi: null,
      total_dana: null,
      id_sumber_dana: null,
      sumber_dana: "KEMENRISTEK/BRIN",
      tahun: 2023,
      leader: "ARWIN JULI RAKHMADI",
      leader_nidn: 120078004,
      first_proposed_year: 2023,
      implementation_year: 2023,
      focus: "TEKNOLOGI INFORMASI",
      funds_approved: "Rp. 25,000,000.0",
      scheme_id: "",
      scheme_abbrev: "PPT",
      scheme_name: "PENELITIAN PENGEMBANGAN TEKNOLOGI",
      kategori_sumber_dana: "Pemerintah",
      negara_sumber_dana: "ID",
      sumber_data: "MANUAL",
      kd_program_hibah: "20",
      program_hibah: "HIBAH NASIONAL",
      manual: "N",
      sumber: "Sinta",
      created_at: "2024-09-20 00:40:11",
      updated_at: "2024-09-20 00:40:11",
      nidn: "0120078004",
      nm_jenis: null,
    },
  ]

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return sampleData
}

export async function getResearchProjectById(projectId: string): Promise<ResearchProject | null> {
  const projects = await getResearchProjects("any")
  return projects.find((project) => project.id_proposal === projectId) || null
}

// New function to submit research proposal
export async function submitResearchProposal(
  formData: any,
  files: { proposal: File | null; kontrak: File | null; luaran: File | null },
): Promise<{ success: boolean; message: string }> {
  // In a real application, this would be an API call to submit the form data and upload files

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For demonstration purposes, we'll just return a success response
  return {
    success: true,
    message: "Proposal penelitian berhasil diajukan",
  }
}
