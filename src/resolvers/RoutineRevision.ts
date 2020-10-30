import { Context } from "../";

async function setGroupPlacements(parent: any, args: any, context: Context) {
  const placements = await context.prisma.routineRevision
    .findOne({ where: { id: parent.id } })
    .setGroupPlacements();

  return placements.sort((a, b) => {
    return a.placement - b.placement;
  });
}

export default {
  setGroupPlacements,
};
