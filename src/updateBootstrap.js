// 1
const { PrismaClient } = require("@prisma/client");

// 2
const prisma = new PrismaClient();

const config = require("../prisma/bootstrap.json");
const { format } = require("path");

const fs = require("fs");

//3
async function main() {
  let bootstrap = {};


  const muscles = await prisma.muscle.findMany();
  bootstrap.muscles = muscles;
  // console.log("bootstrap: ", bootstrap);

  const measurables = await prisma.measurable.findMany();
  bootstrap.measurables = measurables;

  const formats = await prisma.format.findMany();
  bootstrap.formats = formats;
  for (var i in formats) {
    // console.log("prisma.format: ", prisma.format)
    const measurables = await prisma.format.findFirst({where: { id: formats[i].id }}).measurables();
    bootstrap.formats[i].measurables = measurables;
  }

  const exercises = await prisma.exercise.findMany();
  bootstrap.exercises = exercises;
  for (var i in exercises) {
    const muscleImpacts = await prisma.exercise.findFirst({where: {id: exercises[i].id }}).muscleImpacts();
    bootstrap.exercises[i].muscleImpacts = muscleImpacts.map(x => x.id);
  }
  
  const setGroups = await prisma.setGroup.findMany();
  bootstrap.setGroups = setGroups;
  for (var i in setGroups) {
    const exercises = await prisma.setGroup.findFirst({where: {id: setGroups[i].id }}).exercises();
    bootstrap.setGroups[i].exercises = exercises.map(x => x.id);
  }

  const routineRevisions = await prisma.routineRevision.findMany();
  bootstrap.routineRevisions = routineRevisions;
  for (var i in routineRevisions) {
    const test = await prisma.routineRevision.findFirst({where: {id: routineRevisions[i].id }});
    // console.log("test: ", test);
    const setGroups = (await prisma.routineRevision.findFirst({where: {id: routineRevisions[i].id }}).setGroupPlacements());
    console.log("setGroups: ", setGroups);
    const sortedSetGroups = setGroups.sort((x,y) => {
      const res = x.placement - y.placement;
      console.log("res: ", res);
      return res;
    });
    console.log("sorted set groups: ", sortedSetGroups);
    bootstrap.routineRevisions[i].setGroups = sortedSetGroups.map(x => x.setGroupId);
  }

  const routines = await prisma.routine.findMany();
  bootstrap.routines = routines;

  fs.writeFile("testfile.json", JSON.stringify(bootstrap, null, 2), function (err) {
    if (err) throw err;
    console.log("done");
  })
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
