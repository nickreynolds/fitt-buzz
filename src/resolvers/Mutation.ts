import { Context } from "../";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent: any, args: any, context: Context, info: any) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({
    data: { ...args, password },
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
  console.log("createExercise args: ", args);
  console.log("createExercise userId: ", userId);

  return context.prisma.exercise.create({
    data: {
      name: args.name,
      description: args.description,
      format: args.format,
      createdBy: { connect: { id: userId } },
    },
  });
}

function createSet(parent: any, args: any, context: Context, info: any) {
  const userId = getUserId(context);

  return context.prisma.set.create({
    data: {
      restSeconds: args.restSeconds,
      exercise: {
        connect: {
          id: args.exerciseID,
        },
      },
      createdBy: { connect: { id: userId } },
    },
  });
}

function createSetGroup(parent: any, args: any, context: Context, info: any) {
  const userId = getUserId(context);

  return context.prisma.setGroup.create({
    data: {
      sets: {
        connect: [{ id: 1 }],
      },
      createdBy: { connect: { id: userId } },
    },
  });
}

async function createRoutine(
  parent: any,
  args: any,
  context: Context,
  info: any
) {
  const userId = getUserId(context);

  const routine = await context.prisma.routine.create({
    data: {
      description: args.description,
      color: args.color,
      name: args.name,
      createdBy: { connect: { id: userId } },
    },
  });
  await routine;
}

function createRoutineRevision(
  parent: any,
  args: any,
  context: Context,
  info: any
) {
  const userId = getUserId(context);

  return context.prisma.routine.create({
    data: {
      description: args.description,
      color: args.color,
      name: args.name,
      createdBy: { connect: { id: userId } },
    },
  });
}

export default {
  signup,
  login,
  createExercise,
  createSet,
  createSetGroup,
  createRoutineRevision,
  createRoutine,
};
