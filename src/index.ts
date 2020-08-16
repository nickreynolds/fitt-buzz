import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import Query from "./resolvers/Query";
// import Mutation from "./resolvers/Mutation";
import Routine from "./resolvers/Routine";
import User from "./resolvers/User";

export interface Context {
  prisma: PrismaClient;
}

// 2
const resolvers = {
  Query,
  // Mutation,
  User,
  Routine,
};

const prisma = new PrismaClient();

// 3
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: (request: any) => {
    return {
      ...request,
      prisma,
    };
  },
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
