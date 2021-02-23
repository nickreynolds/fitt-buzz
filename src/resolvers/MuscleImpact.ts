import { Context } from "../";

function muscle(parent: any, args: any, context: Context) {
  return context.prisma.muscleImpact
    .findFirst({ where: { id: parent.id } })
    .muscle();
}

export default {
  muscle,
};
