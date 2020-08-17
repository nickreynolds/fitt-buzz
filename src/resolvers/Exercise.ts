import { Context } from "../";

function muscleImpacts(parent: any, args: any, context: Context) {
  return context.prisma.exercise
    .findOne({ where: { id: parent.id } })
    .muscleImpacts();
}

function format(parent: any, args: any, context: Context) {
  return context.prisma.exercise.findOne({ where: { id: parent.id } }).format();
}

export default {
  muscleImpacts,
  format,
};
