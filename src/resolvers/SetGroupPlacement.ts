import { Context } from "../";

function setGroup(parent: any, args: any, context: Context) {
  return context.prisma.setGroup
    .findOne({ where: { id: parent.setGroupId } })
}

export default {
  setGroup,
};
