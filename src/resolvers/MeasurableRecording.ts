import { Context } from "../";

function measurable(parent: any, args: any, context: Context) {
  return context.prisma.measurableRecording
    .findFirst({ where: { id: parent.id } })
    .measurable();
}


export default {
  measurable
};
