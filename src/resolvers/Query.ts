import { Context } from "../";
const { getUserId } = require("../utils");

async function feed(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<any[]> {
  return context.prisma.routine.findMany();
}

async function myRoutines(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<any[]> {
  const userId = getUserId(context);
  return context.prisma.routine.findMany({
    where: { createdById: userId },
  });
}

async function routine(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<any> {
  return context.prisma.routine.findOne({ where: { id: args.id } });
}

async function exercises(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<any[]> {
  console.log("try");
  try {
    return context.prisma.exercise.findMany();
  } catch (ex) {
    console.log("ex: ", ex);
  }
  return [];
}

export default {
  feed,
  routine,
  exercises,
  myRoutines,
};
