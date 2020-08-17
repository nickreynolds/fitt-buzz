import { Context } from "../";

function setGroups(parent: any, args: any, context: Context) {
  return context.prisma.routineRevision
    .findOne({ where: { id: parent.id } })
    .setGroups();
}

export default {
  setGroups,
};
