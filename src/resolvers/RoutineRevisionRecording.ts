import { Context } from "../";

function setGroupRecordings(parent: any, args: any, context: Context) {
  return context.prisma.routineRevisionRecording
    .findOne({ where: { id: parent.id } })
    .setGroupRecordings();
}

function routineRevision(parent: any, args: any, context: Context) {
  return context.prisma.routineRevisionRecording
    .findOne({ where: { id: parent.id } })
    .revision();
}

export default {
  setGroupRecordings,
  routineRevision,
};
