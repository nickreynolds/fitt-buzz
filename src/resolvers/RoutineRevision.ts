import { Context } from "../";

async function setGroupPlacements(parent: any, args: any, context: Context) {
  const placements = await context.prisma.routineRevision
    .findOne({ where: { id: parent.id } })
    .setGroupPlacements();

  return placements.sort((a, b) => {
    return a.placement - b.placement;
  });
}

async function routine(parent: any, args: any, context: Context) {
  return context.prisma.routineRevision
    .findOne({ where: { id: parent.id } })
    .Routine();
}

export default {
  setGroupPlacements,
  routine,
};
