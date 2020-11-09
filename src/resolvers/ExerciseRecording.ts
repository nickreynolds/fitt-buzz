import { Context } from "../";

function measurableRecordings(parent: any, args: any, context: Context) {
  return context.prisma.exerciseRecording
    .findOne({ where: { id: parent.id } })
    .measurableRecordings();
}

function exercise(parent: any, args: any, context: Context) {
  return context.prisma.exerciseRecording
    .findOne({ where: { id: parent.id } })
    .exercise();
}

export default {
  measurableRecordings,
  exercise
};
