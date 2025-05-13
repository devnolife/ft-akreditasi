import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hapus data yang ada (opsional)
  await prisma.document.deleteMany()
  await prisma.research_project.deleteMany()
  await prisma.community_service.deleteMany()
  await prisma.publication.deleteMany()
  await prisma.intellectual_prop.deleteMany()
  await prisma.recognition.deleteMany()
  await prisma.personal_data.deleteMany()
  await prisma.user.deleteMany()
  await prisma.study_program.deleteMany()

  // Buat program studi
  const studyProgram = await prisma.study_program.create({
    data: {
      nama: 'Teknik Informatika',
      kode: 'TI-001',
      fakultas: 'Fakultas Teknik',
      departemen: 'Teknik Informatika'
    }
  })

  // Password yang sama untuk semua akun
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. User Dosen (LECTURER)
  const lecturer = await prisma.user.create({
    data: {
      name: 'Dosen Test',
      username: 'dosen',
      password: hashedPassword,
      role: 'LECTURER',
      front_degree: 'Dr.',
      back_degree: 'S.Kom., M.Kom.',
      study_program_id: studyProgram.id,
      personal_data: {
        create: {
          tempat_lahir: 'Makassar',
          tanggal_lahir: new Date('1990-01-01'),
          jenis_kelamin: 'Laki-laki',
          alamat: 'Jl. Contoh No. 123',
          telepon: '081234567890',
          nomor_pegawai: '123456',
          jabatan: 'Dosen',
          status_kepegawaian: 'Tetap',
          spesialisasi: 'Teknik Informatika',
          gelar_tertinggi: 'S2',
          institusi: 'Universitas Muhammadiyah Makassar',
          tahun_lulus: 2015,
          biografi: 'Dosen aktif di Fakultas Teknik'
        }
      }
    }
  })

  // 2. User Admin (ADMIN)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Test',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      personal_data: {
        create: {
          tempat_lahir: 'Jakarta',
          tanggal_lahir: new Date('1985-05-15'),
          jenis_kelamin: 'Perempuan',
          alamat: 'Jl. Admin No. 456',
          telepon: '081987654321',
          nomor_pegawai: '654321',
          jabatan: 'Admin',
          status_kepegawaian: 'Tetap',
          institusi: 'Universitas Muhammadiyah Makassar',
          biografi: 'Admin sistem akreditasi dosen'
        }
      }
    }
  })

  // 3. User Prodi (PRODI)
  const prodi = await prisma.user.create({
    data: {
      name: 'Prodi Test',
      username: 'prodi',
      password: hashedPassword,
      role: 'PRODI',
      front_degree: 'Dr.',
      back_degree: 'S.T., M.T.',
      study_program_id: studyProgram.id,
      personal_data: {
        create: {
          tempat_lahir: 'Bandung',
          tanggal_lahir: new Date('1988-08-18'),
          jenis_kelamin: 'Laki-laki',
          alamat: 'Jl. Prodi No. 789',
          telepon: '087654321098',
          nomor_pegawai: '789456',
          jabatan: 'Ketua Program Studi',
          status_kepegawaian: 'Tetap',
          spesialisasi: 'Teknik Informatika',
          gelar_tertinggi: 'S3',
          institusi: 'Universitas Muhammadiyah Makassar',
          tahun_lulus: 2010,
          biografi: 'Ketua Program Studi Teknik Informatika'
        }
      }
    }
  })

  // Tambahkan data contoh penelitian untuk dosen
  const research = await prisma.research_project.create({
    data: {
      judul: 'PENGEMBANGAN MEDIA AJAR LUBANG HITAM DI OBSERVATORIUM ILMU FALAK',
      latar_belakang: 'Penelitian tentang pengembangan media ajar lubang hitam',
      tanggal_mulai: new Date('2021-01-01'),
      sedang_berjalan: false,
      sumber_dana: 'HIBAH INTERNAL',
      jumlah_dana: 'Rp. 7,000,000.0',
      fokus: 'SOSIAL HUMANIORA',
      skema: 'PENELITIAN DASAR',
      status_penetapan: 'Diterima',
      ketua_peneliti: 'HASRIAN RUDI SETIAWAN',
      nidn_ketua: '107049101',
      tahun_pelaksanaan: 2021,
      tahun_pengajuan_pertama: 2021,
      program_hibah: 'HIBAH INTERNAL',
      kategori_sumber_dana: 'Institusi Internal',
      negara_sumber_dana: 'ID',
      user_id: lecturer.id
    }
  })

  console.log('Seed data berhasil dibuat:')
  console.log('- Dosen:', lecturer.name)
  console.log('- Admin:', admin.name)
  console.log('- Prodi:', prodi.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
