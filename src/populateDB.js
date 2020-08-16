// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

const config = require("../prisma/bootstrap.json");

//3
async function main() {
  console.log("prisma: ", prisma);
  const format = await prisma.format.findOne({
    where: { id: "4bd2127a-d7f5-4415-bacd-26f9b690edc1" },
  });
  console.log("format: ", format);
  for (var i = 0; i < config.muscles.length; i++) {
    await prisma.muscle.upsert({
      where: {
        id: config.muscles[i].id,
      },
      create: {
        id: config.muscles[i].id,
        name: config.muscles[i].name,
        description: config.muscles[i].description,
      },
      update: {
        name: config.muscles[i].name,
        description: config.muscles[i].description,
      },
    });
  }

  for (var i = 0; i < config.muscles.length; i++) {
    for (var j = 0; j < 3; j++) {
      await prisma.muscleImpact.upsert({
        where: {
          id: config.muscles[i].id + "-" + j,
        },
        create: {
          id: config.muscles[i].id + "-" + j,
          muscle: {
            connect: {
              id: config.muscles[i].id,
            },
          },
          impactRating: j,
        },
        update: {
          muscle: {
            connect: {
              id: config.muscles[i].id,
            },
          },
          impactRating: j,
        },
      });
    }
  }

  for (var i = 0; i < config.measurables.length; i++) {
    await prisma.measurable.upsert({
      where: {
        id: config.measurables[i].id,
      },
      create: {
        id: config.measurables[i].id,
        name: config.measurables[i].name,
      },
      update: {
        name: config.measurables[i].name,
      },
    });
  }

  for (var i = 0; i < config.formats.length; i++) {
    const format = config.formats[i];
    await prisma.format.upsert({
      where: {
        id: format.id,
      },
      create: {
        id: format.id,
        name: format.name,
        description: format.description,
        measurables: { connect: format.measurables },
      },
      update: {
        name: config.formats[i].name,
        description: format.description,
        measurables: { connect: format.measurables },
      },
    });
  }
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
