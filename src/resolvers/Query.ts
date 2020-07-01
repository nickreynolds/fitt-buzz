import { Context } from "../";

async function feed(
  parent: any,
  args: any,
  context: Context,
  info: any
): Promise<any[]> {
  return context.prisma.routine.findMany();
}
export default {
  feed,
};
