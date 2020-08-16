// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

const config = require("../prisma/bootstrap.json");

//3
async function main() {
  // add muscles:
  // console.log("config: ", config);
  console.log("config.muscles: ", config.muscles);

  config.muscles.forEach(async (muscle) => {
    await prisma.muscle.create({
      data: {
        id: muscle.id,
        name: muscle.name,
        description: muscle.description,
      },
    });
  });

  const allMuscles = await prisma.muscle.findMany();
  console.log(allMuscles);
}

//4
main()
  .catch((e) => {
    throw e;
  })
  // 5
  .finally(async () => {
    await prisma.disconnect();
  });
