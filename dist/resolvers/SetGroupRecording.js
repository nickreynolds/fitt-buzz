"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setGroup(parent, args, context) {
    console.log("get setGroup");
    return context.prisma.setGroupRecording
        .findOne({ where: { id: parent.id } })
        .setGroup();
}
function setRecordings(parent, args, context) {
    console.log("get setGroup");
    return context.prisma.setGroupRecording
        .findOne({ where: { id: parent.id } })
        .setRecordings();
}
exports.default = {
    setGroup: setGroup,
    setRecordings: setRecordings
};
//# sourceMappingURL=SetGroupRecording.js.map