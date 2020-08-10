import { Context } from "../";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent: any, args: any, context: Context, info: any) {
  // 1
  const password = await bcrypt.hash(args.password, 10);

  // 2
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  // 3
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 4
  return {
    token,
    user,
  };
}

async function login(parent: any, args: any, context: Context, info: any) {
  // 1
  const user = await context.prisma.user.findOne({
    where: { username: args.username },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // 2
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 3
  return {
    token,
    user,
  };
}

function post(parent: any, args: any, context: Context, info: any) {
  const userId = getUserId(context);

  return context.prisma.routine.create({
    data: {
      description: args.description,
      color: args.color,
      name: args.name,
      postedBy: { connect: { id: userId } },
    },
  });
}

export default {
  signup,
  login,
  post,
};
