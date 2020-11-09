"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_yoga_1 = require("graphql-yoga");
var client_1 = require("@prisma/client");
var Query_1 = require("./resolvers/Query");
var Mutation_1 = require("./resolvers/Mutation");
var Routine_1 = require("./resolvers/Routine");
var RoutineRevision_1 = require("./resolvers/RoutineRevision");
var User_1 = require("./resolvers/User");
var Exercise_1 = require("./resolvers/Exercise");
var ExerciseRecording_1 = require("./resolvers/ExerciseRecording");
var MuscleImpact_1 = require("./resolvers/MuscleImpact");
var SetGroup_1 = require("./resolvers/SetGroup");
var SetGroupRecording_1 = require("./resolvers/SetGroupRecording");
var SetRecording_1 = require("./resolvers/SetRecording");
var SetGroupPlacement_1 = require("./resolvers/SetGroupPlacement");
var RoutineRevisionRecording_1 = require("./resolvers/RoutineRevisionRecording");
var MeasurableRecording_1 = require("./resolvers/MeasurableRecording");
// 2
var resolvers = {
    Query: Query_1.default,
    Mutation: Mutation_1.default,
    User: User_1.default,
    RoutineRevision: RoutineRevision_1.default,
    Routine: Routine_1.default,
    Exercise: Exercise_1.default,
    MuscleImpact: MuscleImpact_1.default,
    SetGroup: SetGroup_1.default,
    SetGroupPlacement: SetGroupPlacement_1.default,
    RoutineRevisionRecording: RoutineRevisionRecording_1.default,
    SetGroupRecording: SetGroupRecording_1.default,
    SetRecording: SetRecording_1.default,
    ExerciseRecording: ExerciseRecording_1.default,
    MeasurableRecording: MeasurableRecording_1.default
};
var prisma = new client_1.PrismaClient();
// 3
var server = new graphql_yoga_1.GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers: resolvers,
    context: function (request) {
        return __assign(__assign({}, request), { prisma: prisma });
    },
});
server.start(function () { return console.log("Server is running on http://localhost:4000"); });
//# sourceMappingURL=index.js.map