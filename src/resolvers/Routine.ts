import { Context } from "../";

// function createdBy(parent: any, args: any, context: Context) {
//   return context.prisma.routine
//     .findOne({ where: { id: parent.id } })
//     .createdBy();
// }

function revisions(parent: any, args: any, context: Context) {
  return context.prisma.routine
    .findOne({ where: { id: parent.id } })
    .revisions();
}

export default {
  // createdBy,
  revisions,
};
