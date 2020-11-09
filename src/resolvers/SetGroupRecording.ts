import { Context } from "../";

function setGroup(parent: any, args: any, context: Context) {
  return context.prisma.setGroupRecording
    .findOne({ where: { id: parent.id } })
    .setGroup();
}

function setRecordings(parent: any, args: any, context: Context) {
  return context.prisma.setGroupRecording
    .findOne({ where: { id: parent.id } })
    .setRecordings();
}

export default {
  setGroup,
  setRecordings
};
