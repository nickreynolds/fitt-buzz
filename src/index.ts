import { GraphQLServer } from "graphql-yoga";
import { PrismaClient } from "@prisma/client";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import Routine from "./resolvers/Routine";
import RoutineRevision from "./resolvers/RoutineRevision";
import User from "./resolvers/User";
import Exercise from "./resolvers/Exercise";
import ExerciseRecording from "./resolvers/ExerciseRecording";
import MuscleImpact from "./resolvers/MuscleImpact";
import SetGroup from "./resolvers/SetGroup";
import SetGroupRecording from "./resolvers/SetGroupRecording";
import SetRecording from "./resolvers/SetRecording";
import SetGroupPlacement from "./resolvers/SetGroupPlacement";
import RoutineRevisionRecording from "./resolvers/RoutineRevisionRecording";
import MeasurableRecording from "./resolvers/MeasurableRecording";
import Format from "./resolvers/Format";

export interface Context {
  prisma: PrismaClient;
}

// 2
const resolvers = {
  Query,
  Mutation,
  User,
  RoutineRevision,
  Routine,
  Exercise,
  MuscleImpact,
  SetGroup,
  SetGroupPlacement,
  RoutineRevisionRecording,
  SetGroupRecording,
  SetRecording,
  ExerciseRecording,
  MeasurableRecording,
  Format
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
