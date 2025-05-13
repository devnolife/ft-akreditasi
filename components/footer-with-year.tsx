"use client"

export function FooterWithYear() {
  // Get the current year on the client side to avoid hydration mismatch
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-4 bg-background">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {currentYear} Universitas Muhammadiyah Makassar. Hak Cipta Dilindungi.</p>
        <p className="mt-1">Sistem Pelacakan Data Akreditasi Dosen</p>
      </div>
    </footer>
  )
} 
