import { Context } from "../";
import { Routine } from "@prisma/client";

async function routines(
  parent: any,
  args: any,
  context: Context
): Promise<Routine[]> {
  return context.prisma.user.findFirst({ where: { id: parent.id } }).routines();
}

export default {
  routines,
};
