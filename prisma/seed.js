import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const MAKES = [
  { make: "Toyota", models: ["Fortuner", "Innova", "Corolla"] },
  { make: "Hyundai", models: ["Creta", "Verna", "i20"] },
  { make: "Honda", models: ["City", "Amaze"] },
  { make: "Tata", models: ["Nexon", "Harrier"] },
  { make: "Mahindra", models: ["XUV700", "Scorpio"] }
];

const IMAGES = [
  "https://fpfxlmeshthvzpgqmwff.supabase.co/storage/v1/object/public/Marketplace-bk/placeholder.jpeg",
  "https://fpfxlmeshthvzpgqmwff.supabase.co/storage/v1/object/public/Marketplace-bk/placeholder.jpeg",
  "https://fpfxlmeshthvzpgqmwff.supabase.co/storage/v1/object/public/Marketplace-bk/placeholder.jpeg"
];

async function seedUsers() {
  console.log("👤 Seeding users...");

  for (let i = 0; i < 15; i++) {
    await prisma.user.upsert({
      where: { clerkUserId: `clerk_user_${i}` },
      update: {
        email: faker.internet.email(),
        name: faker.person.fullName()
      },
      create: {
        clerkUserId: `clerk_user_${i}`,
        email: faker.internet.email(),
        name: faker.person.fullName()
      }
    });
  }
}

async function seedDealership() {
  console.log("🏢 Seeding dealership info...");

  await prisma.dealershipInfo.upsert({
    where: { id: "default-dealership" },
    update: {},
    create: {
      id: "default-dealership"
    }
  });
}

async function seedCars() {
  console.log("🚗 Seeding cars...");

  const cars = [];

  for (let i = 0; i < 80; i++) {
    const brand = faker.helpers.arrayElement(MAKES);

    cars.push({
      make: brand.make,
      model: faker.helpers.arrayElement(brand.models),
      year: faker.number.int({ min: 2019, max: 2024 }),
      price: faker.number.int({ min: 500000, max: 4000000 }),
      mileage: faker.number.int({ min: 3000, max: 90000 }),
      color: faker.color.human(),
      fuelType: faker.helpers.arrayElement(["Petrol", "Diesel"]),
      transmission: faker.helpers.arrayElement(["Manual", "Automatic"]),
      bodyType: faker.helpers.arrayElement(["SUV", "Sedan"]),
      seats: 5,
      description: faker.lorem.sentences(2),
      images: IMAGES,
      featured: Math.random() < 0.25
    });
  }

  await prisma.car.createMany({
    data: cars,
    skipDuplicates: true
  });
}

async function main() {
  console.log("🌱 Starting database seed...");

  await seedDealership();
  await seedUsers();
  await seedCars();

  console.log("✅ Database seeding completed");
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
