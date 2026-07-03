const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialNotes = [
  { title: "408", venda: 740000, content: "Catete" },
  { title: "01", venda: 770000, content: "Bocoio" },
  { title: "02", venda: 470000, content: "Sabato" },
  { title: "919", venda: 2251410, content: "Bo KM44" },
  { title: "432", venda: 2127500, content: "Catete" },
  { title: "918", venda: 2130000, content: "Catete" },
  { title: "491", venda: 2129000, content: "Catete" },
  { title: "568", venda: 1100000, content: "Chipindo 1" },
  { title: "574", venda: 792250, content: "Chipindo 2" },
  { title: "908", venda: 2128000, content: "Catete" },
  { title: "912", venda: 2127500, content: "Catete" },
  { title: "470", venda: 2124000, content: "Km 44" },
  { title: "383", venda: 1132750, content: "Namibie" },
  { title: "556", venda: 1498567, content: "Namibie" },
  { title: "503", venda: 568000, content: "Namibie" },
  { title: "03", venda: 450000, content: "Chino-reille Med chiekh" },
  { title: "04", venda: 1534400, content: "Chingo-rielle Moud" },
  { title: "05", venda: 700000, content: "Chingo-reille Mini" },
  { title: "06", venda: 450000, content: "Catengue" },
  { title: "0417", venda: 450000, content: "Chinjenje" },
  { title: "08", venda: 655715, content: "Quilengues" },
  { title: "09", venda: 479400, content: "Cala Huambo" },
  { title: "433", venda: 2127000, content: "Catete" },
  { title: "421", venda: 429100, content: "Chilata" },
  { title: "10", venda: 1620000, content: "Feira centralidade" },
  { title: "922", venda: 2125000, content: "Catete" },
  { title: "11", venda: 893500, content: "Bocoio" }
];

async function main() {
  console.log("Starting seeding...");
  
  // Clean up any existing notes first (optional, but ensures we don't duplicate on multiple runs)
  const deleteResult = await prisma.note.deleteMany({});
  console.log(`Deleted ${deleteResult.count} existing notes.`);

  for (const note of initialNotes) {
    const created = await prisma.note.create({
      data: {
        title: note.title,
        venda: note.venda,
        content: note.content,
        pdfurl: null
      }
    });
    console.log(`Added note for Selo: ${created.title}`);
  }
  
  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
