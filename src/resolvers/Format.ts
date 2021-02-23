import { Context } from "../";

function measurables(parent: any, args: any, context: Context) {
  return context.prisma.format
    .findFirst({ where: { id: parent.id } })
    .measurables();
}

export default {
  measurables,
};
