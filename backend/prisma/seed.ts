// prisma/seed.ts
import { PrismaClient, UserRole, VehicleCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Clean Database
  await prisma.reservation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Base de données nettoyée.');

  // 2. Create Users
  const password = await bcrypt.hash('Password123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@togocar.com',
      password,
      firstName: 'Admin',
      lastName: 'System',
      role: UserRole.ADMIN,
    },
  });

  const emp1 = await prisma.user.create({
    data: {
      email: 'jean.dupont@togocar.com',
      password,
      firstName: 'Jean',
      lastName: 'Dupont',
      role: UserRole.USER,
    },
  });

  const emp2 = await prisma.user.create({
    data: {
      email: 'marie.curie@togocar.com',
      password,
      firstName: 'Marie',
      lastName: 'Curie',
      role: UserRole.USER,
    },
  });

  console.log('👥 Utilisateurs créés (Admin + 2 Employés).');

  // 3. Create Vehicles
  // Flotte: 2 SUV (pour tester le conflit/négociation), 1 Sedan, 1 Pickup
  const suv1 = await prisma.vehicle.create({
    data: {
      brand: 'Toyota',
      model: 'Land Cruiser',
      year: 2023,
      plate: 'TG-1000-A',
      category: VehicleCategory.SUV,
    },
  });

  const suv2 = await prisma.vehicle.create({
    data: {
      brand: 'Mitsubishi',
      model: 'Pajero',
      year: 2022,
      plate: 'TG-1001-B',
      category: VehicleCategory.SUV,
    },
  });

  await prisma.vehicle.create({
    data: {
      brand: 'Toyota',
      model: 'Corolla',
      year: 2021,
      plate: 'TG-2000-X',
      category: VehicleCategory.SEDAN,
    },
  });

  console.log('🚗 Véhicules créés (Flotte: 2 SUV, 1 Sedan).');

  // 4. Create Conflict Scenario (Deadlock) for SUVs
  // Scenario: Tous les SUV sont pris du 20 au 25 Mai 2024
  const start = new Date('2024-05-20T08:00:00Z');
  const end = new Date('2024-05-25T18:00:00Z');

  await prisma.reservation.create({
    data: {
      userId: emp1.id,
      vehicleId: suv1.id,
      startDate: start,
      endDate: end,
      reason: 'Mission terrain Kpalimé (Jean)',
      status: 'CONFIRMED',
    },
  });

  await prisma.reservation.create({
    data: {
      userId: emp2.id,
      vehicleId: suv2.id,
      startDate: start,
      endDate: end,
      reason: "Audit succursale Atakpamé (Marie)",
      status: 'CONFIRMED',
    },
  });

  console.log('📅 Scénario de conflit généré : Tous les SUV sont réservés du 20 au 25 Mai.');
  console.log("   -> Usage: Testez l'endpoint GET /reservations/availability/check sur ces dates pour voir la négociation.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
