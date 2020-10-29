import { Context } from "../";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
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
  const user = await context.prisma.user.findOne({
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

async function cloneRoutineAtRevision(
  parent: any,
  args: any,
  context: Context,
  info: any
) {
  const userId = getUserId(context);
  const originalRoutine = await context.prisma.routine.findOne({
    where: { id: args.routineId },
  });

  const routineRevisions = await context.prisma.routine
    .findOne({ where: { id: args.routineId } })
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

  const setGroups = await context.prisma.routineRevision
    .findOne({ where: { id: args.revisionId } })
    .setGroups();
  var newSetGroups = [];
  for (var setGroup of setGroups) {
    const exercises = await context.prisma.setGroup
      .findOne({ where: { id: setGroup.id } })
      .exercises();
    const newSetGroup = await context.prisma.setGroup.create({
      data: {
        id: uuidv4(),
        exercises: {
          connect: exercises.map((exercise) => {
            return { id: exercise.id };
          }),
        },
        defaultNumSets: setGroup.defaultNumSets,
      },
    });
    newSetGroups.push(newSetGroup);
  }

  const revision = await context.prisma.routineRevision.create({
    data: {
      id: uuidv4(),
      createdBy: { connect: { id: userId } },
      setGroups: {
        connect: newSetGroups.map((setGroup) => {
          return { id: setGroup.id };
        }),
      },
    },
  });

  const routine = await context.prisma.routine.create({
    data: {
      id: uuidv4(),
      createdBy: { connect: { id: userId } },
      revisions: { connect: [{ id: revision.id }] },
      name: "Clone of " + originalRoutine.name,
      description: originalRoutine.description,
      cloneOf: { connect: { id: originalRoutine.id } },
    },
  });

  return routine;
}

export default {
  signup,
  login,
  createExercise,
  cloneRoutineAtRevision,
};
