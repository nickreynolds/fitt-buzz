import { Context } from "../";

function postedBy(parent: any, args: any, context: Context) {
  return context.prisma.routine
    .findOne({ where: { id: parent.id } })
    .postedBy();
}

export default {
  postedBy,
};
