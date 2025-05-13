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

  // Buat user test
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      name: 'Dosen Test',
      username: 'dosen',
      password: hashedPassword,
      role: 'LECTURER',
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

  console.log('Seed data berhasil dibuat:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
