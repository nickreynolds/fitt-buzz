import { Context } from "../";

function exercises(parent: any, args: any, context: Context) {
  return context.prisma.setGroup
    .findOne({ where: { id: parent.id } })
    .exercises();
}

export default {
  exercises,
};
