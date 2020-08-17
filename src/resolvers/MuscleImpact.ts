import { Context } from "../";

function muscle(parent: any, args: any, context: Context) {
  return context.prisma.muscleImpact
    .findOne({ where: { id: parent.id } })
    .muscle();
}

export default {
  muscle,
};
