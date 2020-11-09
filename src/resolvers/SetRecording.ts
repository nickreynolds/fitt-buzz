import { Context } from "../";

function exerciseRecordings(parent: any, args: any, context: Context) {
  return context.prisma.setRecording
    .findOne({ where: { id: parent.id } })
    .exericseRecordings();
}


export default {
  exerciseRecordings,
};
