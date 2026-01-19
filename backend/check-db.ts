import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();
  console.log(`Nombre d'utilisateurs en base : ${userCount}`);

  if (userCount > 0) {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@togocar.com' },
    });

    if (admin) {
        console.log(`✅ Admin trouvé : ${admin.email}`);
        console.log(`🔑 Mot de passe stocké (Hash) : ${admin.password}`);
        console.log(`   (Est-ce un hash bcrypt ? ${admin.password.startsWith('$2b$') ? 'OUI' : 'NON'})`);
    } else {
        console.log('❌ Admin introuvable !');
    }
  } else {
      console.log('❌ La base de données est VIDE.');
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
