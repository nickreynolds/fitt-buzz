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
// import Mutation from "./resolvers/Mutation";
var Routine_1 = require("./resolvers/Routine");
var User_1 = require("./resolvers/User");
// 2
var resolvers = {
    Query: Query_1.default,
    // Mutation,
    User: User_1.default,
    Routine: Routine_1.default,
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