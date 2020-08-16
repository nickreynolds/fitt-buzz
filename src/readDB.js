// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

//3
async function main() {
  // console.log("prisma: ", prisma);
  const formats = await prisma.format.findMany();
  console.log("formats: ", formats);

  const format = await prisma.format.findOne({
    where: { id: "4bd2127a-d7f5-4415-bacd-26f9b690edc1" },
  });
  console.log("format: ", format);
  const measurables = await prisma.format
    .findOne({
      where: { id: "4bd2127a-d7f5-4415-bacd-26f9b690edc1" },
    })
    .measurables();
  console.log("measurables: ", measurables);

  const muscleImpacts = await prisma.muscleImpact.findMany();
  console.log("muscleImpacts: ", muscleImpacts);
}

//4
main()
  .catch((e) => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.$disconnect();
  });
