/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  await prisma.comboProduct.deleteMany();
  await prisma.product.deleteMany();
  await prisma.combo.deleteMany();
}

async function seedDatabase() {
  await prisma.product.createMany({
    data: [
      {
        id: "1",
        name: "Burger",
        description: "Delicious beef burger with lettuce and tomato",
        price: 0.1,
        category: "SANDWICH",
      },
      {
        id: "2",
        name: "Veggie Burger",
        description:
          "Plant-based burger with lettuce, tomato, and special sauce",
        price: 0.1,
        category: "SANDWICH",
      },
      {
        id: "3",
        name: "Bacon Burger",
        description: "Juicy beef burger topped with crispy bacon strips",
        price: 0.1,
        category: "SANDWICH",
      },
      {
        id: "4",
        name: "Salad Burger",
        description:
          "Light beef burger with lettuce, tomato, cucumber, and a tangy sauce",
        price: 10.1,
        category: "SANDWICH",
      },
      {
        id: "5",
        name: "Cheddar Burger",
        description:
          "Delicious beef burger with a generous slice of melted cheddar cheese",
        price: 10.1,
        category: "SANDWICH",
      },
      {
        id: "6",
        name: "Fries",
        description: "Crispy golden potato fries",
        price: 0.1,
        category: "SIDE_DISH",
      },
      {
        id: "7",
        name: "Rustic Potato with Cheddar and Bacon",
        description:
          "Crispy rustic potato slices topped with melted cheddar cheese and crispy bacon bits",
        price: 0.1,
        category: "SIDE_DISH",
      },
      {
        id: "8",
        name: "Nuggets",
        description: "Crispy chicken nuggets served with a tangy dipping sauce",
        price: 0.1,
        category: "SIDE_DISH",
      },
      {
        id: "9",
        name: "Water",
        description: "Refreshing natural mineral water",
        price: 0.1,
        category: "DRINK",
      },
      {
        id: "10",
        name: "Coke",
        description: "Delicious coke",
        price: 0.1,
        category: "DRINK",
      },
      {
        id: "11",
        name: "Soda",
        description: "Refreshing carbonated drink",
        price: 0.1,
        category: "DRINK",
      },
      {
        id: "12",
        name: "Orange Juice",
        description: "Freshly squeezed orange juice",
        price: 0.1,
        category: "DRINK",
      },
      {
        id: "13",
        name: "Grape Juice",
        description: "Sweet and tangy grape juice",
        price: 0.1,
        category: "DRINK",
      },
    ],
  });
}

async function main() {
  await clearDatabase();
  await seedDatabase();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
