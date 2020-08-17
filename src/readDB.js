// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

//3
async function main() {
  // console.log("prisma: ", prisma);
  const formats = await prisma.format.findMany();
  console.log("formats: ", formats);

  const format = prisma.format.findOne({
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

  const exercise = prisma.exercise.findOne({
    where: { id: "bc122944-fcf1-4902-9193-4bb6a6c16d76" },
  });
  const exerciseMuscleImpacts = await exercise.muscleImpacts();
  const exerciseFormat = await exercise.format();
  console.log("exercise: ", await exercise);
  console.log("exerciseFormat: ", await exerciseFormat);
  console.log("exerciseMuscleImpacts: ", exerciseMuscleImpacts);
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
