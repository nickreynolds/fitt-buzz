// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

const config = require("../prisma/bootstrap.json");

//3
async function main() {
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

    // for (var j = 0; j < format.measurables.length; j++) {
    //   const measurable = format.measurables[j];
    //   await prisma.measurablesOnFormats.upsert({
    //     where: {
    //       formatId_measurableId: {
    //         formatId: format.id,
    //         measurableId: measurable.id,
    //       },
    //     },
    //     create: {
    //       format: { connect: { id: format.id } },
    //       measurable: { connect: { id: measurable.id } },
    //     },
    //     update: {
    //       format: { connect: { id: format.id } },
    //       measurable: { connect: { id: measurable.id } },
    //     },
    //   });
    // }
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
