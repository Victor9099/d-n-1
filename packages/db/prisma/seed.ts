import { PrismaClient, UserRole, StaffRole, StaffStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default shipping config
  await prisma.shippingConfig.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      freeShippingThreshold: 500000, // 500k VND
      baseShippingFee: 30000, // 30k VND
    },
  })
  console.log('✅ Shipping config created')

  // Create sample categories
  const categories = [
    { name: 'Áo thun', slug: 'ao-thun' },
    { name: 'Áo sơ mi', slug: 'ao-so-mi' },
    { name: 'Quần', slug: 'quan' },
    { name: 'Váy', slug: 'vay' },
    { name: 'Phụ kiện', slug: 'phu-kien' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log(`✅ ${categories.length} categories created`)

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@em.vn'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      role: UserRole.staff,
      staffAccount: {
        create: {
          role: StaffRole.owner_admin,
          status: StaffStatus.active,
        },
      },
    },
  })
  console.log(`✅ Admin user created: ${adminEmail}`)

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
