import { Exercise, Routine, RoutineRevision, RoutineRevisionRecording, SetGroupRecording } from "@prisma/client";
import { Context } from "../";
const { getUserId } = require("../utils");

async function feed(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<Routine[]> {
  return context.prisma.routine.findMany();
}

async function myRoutines(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<Routine[]> {
  const userId = getUserId(context);
  return context.prisma.routine.findMany({
    where: { createdById: userId },
  });
}

async function myRoutineRecordings(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<RoutineRevisionRecording[]> {
  const userId = getUserId(context);
  return context.prisma.routineRevisionRecording.findMany({
    where: { createdById: userId },
  });
}


async function myPreviousSetGroupRecording(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<SetGroupRecording> {
  const userId = getUserId(context);
  const recordings = await context.prisma.setGroupRecording.findMany({
    where: {
      setGroupId: args.setGroupId,
      createdById: userId,
    },
    orderBy: {
      createdAt: "desc"
    }}
  );
  if (recordings.length > 0) {
  return recordings[0];
  }
  return null;
}

async function routine(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<Routine> {
  return context.prisma.routine.findOne({ where: { id: args.id } });
}

async function routineRevision(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<RoutineRevision> {
  return context.prisma.routineRevision.findOne({ where: { id: args.id } });
}

async function routineRevisionRecording(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<RoutineRevisionRecording> {
  return context.prisma.routineRevisionRecording.findOne({
    where: { id: args.id },
  });
}

async function exercises(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<Exercise[]> {
  return context.prisma.exercise.findMany();
}

function info(
  parent: any,
  args: any,
  context: Context,
  info: any
): string {

  return "ok"
}

export default {
  feed,
  routine,
  exercises,
  myRoutines,
  myRoutineRecordings,
  routineRevision,
  routineRevisionRecording,
  info,
  myPreviousSetGroupRecording
};
