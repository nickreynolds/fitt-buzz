// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

const config = require("../prisma/bootstrap.json");
const { format } = require("path");

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
  }

  for (var exercise of config.exercises) {
    await prisma.exercise.upsert({
      where: {
        id: exercise.id,
      },
      create: {
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        format: { connect: { id: exercise.format } },
        muscleImpacts: {
          connect: exercise.muscleImpacts.map((impact) => {
            return { id: impact };
          }),
        },
      },
      update: {
        name: exercise.name,
        description: exercise.description,
        format: { connect: { id: exercise.format } },
        muscleImpacts: {
          connect: exercise.muscleImpacts.map((impact) => {
            return { id: impact };
          }),
        },
      },
    });
  }

  for (var setGroup of config.setGroups) {
    await prisma.setGroup.upsert({
      where: {
        id: setGroup.id,
      },
      create: {
        id: setGroup.id,
        exercises: {
          connect: setGroup.exercises.map((exercise) => {
            return { id: exercise };
          }),
        },
        defaultNumSets: setGroup.defaultNumSets,
      },
      update: {
        exercises: {
          connect: setGroup.exercises.map((exercise) => {
            return { id: exercise };
          }),
        },
        defaultNumSets: setGroup.defaultNumSets,
      },
    });
  }

  for (var routineRevision of config.routineRevisions) {
    routineRevision.setGroups.map(async (setGroup, i) => {
      console.log("add setgroup placement");
      await prisma.setGroupPlacement.upsert({
        where: {
          id: i + "-" + setGroup,
        },
        create: {
          id: i + "-" + setGroup,
          setGroup: { connect: { id: setGroup } },
          placement: i,
        },
        update: {
          setGroup: { connect: { id: setGroup } },
          placement: i,
        },
      });
    });

    await prisma.routineRevision.upsert({
      where: {
        id: routineRevision.id,
      },
      create: {
        id: routineRevision.id,
        setGroupPlacements: {
          connect: routineRevision.setGroups.map((setGroup, i) => {
            return { id: i + "-" + setGroup };
          }),
        },
      },
      update: {
        setGroupPlacements: {
          connect: routineRevision.setGroups.map((setGroup, i) => {
            return { id: i + "-" + setGroup };
          }),
        },
      },
    });
  }

  for (var routine of config.routines) {
    await prisma.routine.upsert({
      where: {
        id: routine.id,
      },
      create: {
        id: routine.id,
        revisions: {
          connect: routine.revisions.map((revision) => {
            return { id: revision };
          }),
        },
        name: routine.name,
        description: routine.description,
      },
      update: {
        revisions: {
          connect: routine.revisions.map((revision) => {
            return { id: revision };
          }),
        },
        name: routine.name,
        description: routine.description,
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
    await prisma.$disconnect();
  });
