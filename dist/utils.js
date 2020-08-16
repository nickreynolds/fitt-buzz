"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var APP_SECRET = "GraphQL-is-aw3some";
function getUserId(context) {
    var Authorization = context.request.get("Authorization");
    if (Authorization) {
        var token = Authorization.replace("Bearer ", "");
        var userId = jwt.verify(token, APP_SECRET).userId;
        return userId;
    }
    throw new Error("Not authenticated");
}
module.exports = {
    APP_SECRET: APP_SECRET,
    getUserId: getUserId,
};
//# sourceMappingURL=utils.js.map