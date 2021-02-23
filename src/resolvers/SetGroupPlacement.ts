import { Context } from "../";

function setGroup(parent: any, args: any, context: Context) {
  return context.prisma.setGroup
    .findFirst({ where: { id: parent.setGroupId } })
}

export default {
  setGroup,
};
