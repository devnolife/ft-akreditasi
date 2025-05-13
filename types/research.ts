export interface ResearchProject {
  name: string
  email: string
  id_proposal: string
  id_dosen: string
  judul: string
  kategori: string
  id_jenis: string | null
  l_belakang: string | null
  proposal_kegiatan: string | null
  file_proposal: string | null
  kontrak_kegiatan: string | null
  file_luaran: string | null
  stt_penetapan: string
  lokasi: string | null
  total_dana: string | null
  id_sumber_dana: string | null
  sumber_dana: string
  tahun: number
  leader: string
  leader_nidn: number
  first_proposed_year: number
  implementation_year: number
  focus: string
  funds_approved: string
  scheme_id: string
  scheme_abbrev: string
  scheme_name: string
  kategori_sumber_dana: string
  negara_sumber_dana: string
  sumber_data: string
  kd_program_hibah: string
  program_hibah: string
  manual: string
  sumber: string
  created_at: string
  updated_at: string
  nidn: string
  nm_jenis: string | null
}
