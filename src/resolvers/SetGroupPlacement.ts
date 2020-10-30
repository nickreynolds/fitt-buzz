import { Context } from "../";

function setGroup(parent: any, args: any, context: Context) {
  return context.prisma.setGroupPlacement
    .findOne({ where: { id: parent.id } })
    .setGroup();
}

export default {
  setGroup,
};
