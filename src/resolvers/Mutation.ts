import { Context } from "../";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { exception } from "console";
// import { prismaVersion } from "@prisma/client";
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent: any, args: any, context: Context, info: any) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({
    data: { ...args, password, id: uuidv4() },
  });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user,
  };
}

async function login(parent: any, args: any, context: Context, info: any) {
  // 1
  const user = await context.prisma.user.findFirst({
    where: { username: args.username },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  };
}

function createMuscle(parent: any, args: any, context: Context, info: any) {
  return context.prisma.muscle.create({
    data: {
      id: uuidv4(),
      name: args.name,
      description: args.description,
    }
  })
}

function createMeasurable(parent: any, args: any, context: Context, info: any) {
  return context.prisma.measurable.create({
    data: {
      id: uuidv4(),
      name: args.name,
    }
  })
}

function createFormat(parent: any, args: any, context: Context, info: any) {
  return context.prisma.format.create({
    data: {
      id: uuidv4(),
      name: args.name,
      description: args.description,
      measurables: { 
        connect: args.measurables.map((m) => {
          return { id: m }
        })
      }
    }
  })
}


function createExercise(parent: any, args: any, context: Context, info: any) {
  const userId = getUserId(context);

  return context.prisma.exercise.create({
    data: {
      id: uuidv4(),
      name: args.name,
      description: args.description,
      format: { connect: { id: args.format } },
      createdBy: { connect: { id: userId } },
      muscleImpacts: {
        connect: args.muscleImpacts.map((impact) => {
          return { id: impact };
        }),
      },
    },
  });
}

async function incrementCompletedSetGroups(parent: any, args: any, context: Context, info: any): Promise<string> {
  const userId = getUserId(context);
  if (!args.routineRevisionRecordingId) {
    throw new Error("no routine revision recording specified");
  }
  const recording = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}})
  if (!recording) {
    throw new Error("no recording found");
  }
  await context.prisma.routineRevisionRecording.update({where: {id: args.routineRevisionRecordingId}, data: {
    completedSetGroups: recording.completedSetGroups + 1
  }});
  return recording.id;
}


async function incrementCompletedSets(parent: any, args: any, context: Context, info: any): Promise<string> {
  const userId = getUserId(context);
  if (!args.routineRevisionRecordingId) {
    throw new Error("no routine revision recording specified");
  }
  const recording = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}})
  if (!recording) {
    throw new Error("no recording found");
  }

  const setGroupRecordings = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}}).setGroupRecordings();
  const setGroupRecording = await context.prisma.setGroupRecording.findFirst({where: { id: setGroupRecordings[recording.completedSetGroups].id }})
  
  await context.prisma.setGroupRecording.update({where: {id: setGroupRecording.id }, data: {
    completedSets: setGroupRecording.completedSets + 1
  }})
  
  return recording.id;
}

async function startRoutineRevisionRecording(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<string> {
  const userId = getUserId(context);
  if (!userId) {
    throw new Error("No user included in request");
  }
  const routine = await context.prisma.routine.findFirst({
    where: { id: args.routineId },
  });

  if (routine.createdById !== userId) {
    throw new Error(
      "Routine not created by current user. Please clone routine first."
    );
  }

  const revision = await context.prisma.routineRevision.findFirst({
    where: { id: args.revisionId },
  });
  if (revision.routineId !== routine.id) {
    throw new Error("Specified revision does not belong to specified routine.");
  }

  const routineRecording = await context.prisma.routineRevisionRecording.create(
    {
      data: {
        id: uuidv4(),
        createdBy: { connect: { id: userId } },
        revision: { connect: { id: args.revisionId } },
        completedSetGroups: 0,
      },
    }
  );

  return routineRecording.id;
}

async function completeRecording(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<string> {
  if (!args.routineRevisionRecordingId) {
    throw new Error("no routine revision recording specified");
  }
  const userId = getUserId(context);
  const recording = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}})
  if (!recording) {
    throw new Error("no recording found");
  }
  if (recording.routineCompleted) {
    throw new Error("this recording has already been completed");
  }

  await context.prisma.routineRevisionRecording.update({ where: { id: args.routineRevisionRecordingId}, data: { routineCompleted: true }});
  return recording.id;
}

async function addExerciseRecording(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<string> {
  if (!args.routineRevisionRecordingId) {
    throw new Error("no routine revision recording specified");
  }
  const userId = getUserId(context);
  const recording = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}})
  if (!recording) {
    throw new Error("no recording found");
  }
  const currentSetGroupPlacement = recording.completedSetGroups;
  const setGroupRecordings2 = await context.prisma.routineRevisionRecording.findFirst({where: {id: args.routineRevisionRecordingId}}).setGroupRecordings();
  if (recording.createdById !== userId) {
    throw new Error("authenticated user is not owner of specified recording");
  }

  if (!args.setGroupId) {
    throw new Error("no setGroupId specified");
  }

  let setGroupRecording;
  if (!args.setGroupRecordingId) {
     setGroupRecording = await context.prisma.setGroupRecording.create({ data: {
       id: uuidv4(),
       completedSets: 0,
       createdBy: { connect: { id : userId }},
       setGroup: { connect: { id: args.setGroupId }}
     }});
     setGroupRecordings2.push(setGroupRecording);
     await context.prisma.routineRevisionRecording.update({ where: { id: recording.id }, data: {
      setGroupRecordings: { connect: setGroupRecordings2.map((group) => { return { id: group.id }}) }
     }})
  } else {
    setGroupRecording = await context.prisma.setGroupRecording.findFirst({ where: { id: args.setGroupRecordingId }});
    if (!setGroupRecording) {
      throw new Error("setGroupRecording not found");
    }
  }

  let exerciseRecording = await context.prisma.exerciseRecording.create({ data: {
    id: uuidv4(),
    exercise: { connect: { id: args.exerciseRecordingInput.exerciseID }},
  }});

  let measurableRecordings = [];
  args.exerciseRecordingInput.measurableRecordings.map(
    async (recording) => { 
      const measurableRecording = await context.prisma.measurableRecording.create(
        { 
          data: {
            id: uuidv4(),
            measurable: { connect: { id: recording.measurableID }},
            value: recording.value,
            ExerciseRecording: { connect: { id: exerciseRecording.id}}
          }
        }
      );
      measurableRecordings.push(measurableRecording)
    }
  )

  exerciseRecording = await context.prisma.exerciseRecording.update({where: {id: exerciseRecording.id}, data: {
    measurableRecordings: { connect: measurableRecordings.map((recording) => { return { id: recording.id }})}
  }});
  const currentSet = setGroupRecording.completedSets;
  // const 

  const setRecordings = await context.prisma.setGroupRecording.findFirst({ where: { id: setGroupRecording.id }}).setRecordings();
  let setRecording;
  if (setRecordings.length <= currentSet) {
    setRecording = await context.prisma.setRecording.create({data: {
      id: uuidv4(),
      setGroupRecording: { connect: { id: setGroupRecording.id }}
    }});
  } else {
    setRecording = setRecordings[currentSet];
  }

  const exerciseRecordings = await context.prisma.setRecording.findFirst({where: {id: setRecording.id}}).exericseRecordings();
  exerciseRecordings.push(exerciseRecording);
  await context.prisma.setRecording.update({where: {id: setRecording.id}, data: {
    exericseRecordings: { connect: exerciseRecordings.map((recording) => { return { id: recording.id }}) }
  }})

  const numExercisesRecorded = exerciseRecordings.length;
  const numExercisesInSet = await (await context.prisma.setGroup.findFirst({where: {id: args.setGroupId}}).exercises()).length;
  console.log("numExercisesRecorded: ", numExercisesRecorded);
  console.log("numExercisesInSet: ", numExercisesInSet);
  if (numExercisesRecorded >= numExercisesInSet) {
    console.log("GO INCREMENT COMPLETED SETS");
    await incrementCompletedSets(parent, {
      routineRevisionRecordingId: args.routineRevisionRecordingId
    }, context, info)
  }

  const numSetsInGroup =  (await context.prisma.setGroup.findFirst({where: {id: args.setGroupId}})).defaultNumSets;
  const numSetsCompleted = (await context.prisma.setGroupRecording.findFirst({ where: { id: setGroupRecording.id }})).completedSets;

  console.log("numSetsInGroup: ", numSetsInGroup);
  console.log("numSetsCompleted: ", numSetsCompleted);

  // if (numSetsCompleted >= numSetsInGroup) {
  //   console.log("GO INCREMENT COMPLETED SET GROUPS");
  //   await incrementCompletedSetGroups(parent, {
  //     routineRevisionRecordingId: args.routineRevisionRecordingId
  //   }, context, info)
  // } 

  return recording.id;
}

async function addSetGroupRepitition(
  parent: any,
  args: any,
  context: Context,
  info: any
) {

}

async function cloneRoutineAtRevision(
  parent: any,
  args: any,
  context: Context,
  info: any
) {
  const userId = getUserId(context);
  const originalRoutine = await context.prisma.routine.findFirst({
    where: { id: args.routineId },
  });

  const routineRevisions = await context.prisma.routine
    .findFirst({ where: { id: args.routineId } })
    .revisions();

  if (
    !routineRevisions
      .map((rev) => {
        return rev.id;
      })
      .includes(args.revisionId)
  ) {
    throw new Error("Revision not found in Routine! You trying to cheat me??");
  }

  const setGroupPlacements = await context.prisma.routineRevision
    .findFirst({ where: { id: args.revisionId } })
    .setGroupPlacements();
  var newSetGroupPlacements = [];
  for (var setGroupPlacement of setGroupPlacements) {
    // const setGroup = await context.prisma.setGroup.findFirst({where: {id: setGroupPlacement.setGroupId}})
    const exercises = await context.prisma.setGroup
      .findFirst({ where: { id: setGroupPlacement.setGroupId } })
      .exercises();
    const newSetGroupId = uuidv4();
    const newSetGroup = await context.prisma.setGroup.create({
      data: {
        id: newSetGroupId,
        exercises: {
          connect: exercises.map((exercise) => {
            return { id: exercise.id };
          }),
        },
        defaultNumSets: (
          await context.prisma.setGroup.findFirst({
            where: { id: setGroupPlacement.setGroupId },
          })
        ).defaultNumSets,
      },
    });
    const newSetGroupPlacement = await context.prisma.setGroupPlacement.create({
      data: {
        createdBy: { connect: { id: userId } },
        id: setGroupPlacement.placement + "-" + uuidv4(),
        setGroup: { connect: { id: newSetGroup.id } },
        placement: setGroupPlacement.placement,
      },
    });
    newSetGroupPlacements.push(newSetGroupPlacement);
  }

  const revision = await context.prisma.routineRevision.create({
    data: {
      id: uuidv4(),
      createdBy: { connect: { id: userId } },
      setGroupPlacements: {
        connect: newSetGroupPlacements.map((newSetGroupPlacement) => {
          return { id: newSetGroupPlacement.id };
        }),
      },
    },
  });

  const routine = await context.prisma.routine.create({
    data: {
      id: uuidv4(),
      createdBy: { connect: { id: userId } },
      revisions: { connect: [{ id: revision.id }] },
      name: originalRoutine.name,
      description: originalRoutine.description,
      cloneOf: { connect: { id: originalRoutine.id } },
    },
  });

  return routine;
}

export default {
  signup,
  login,
  createMuscle,
  createMeasurable,
  createFormat,
  createExercise,
  cloneRoutineAtRevision,
  startRoutineRevisionRecording,
  addExerciseRecording,
  incrementCompletedSetGroups,
  incrementCompletedSets,
  completeRecording,
  addSetGroupRepitition
};
