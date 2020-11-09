"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// function createdBy(parent: any, args: any, context: Context) {
//   return context.prisma.routineRevisionRecording
//     .findOne({ where: { id: parent.id } })
//     .createdBy();
// }
function setGroupRecordings(parent, args, context) {
    return context.prisma.routineRevisionRecording
        .findOne({ where: { id: parent.id } })
        .setGroupRecordings();
}
function routineRevision(parent, args, context) {
    console.log("get routineRevision");
    return context.prisma.routineRevisionRecording
        .findOne({ where: { id: parent.id } })
        .revision();
}
exports.default = {
    // createdBy,
    setGroupRecordings: setGroupRecordings,
    routineRevision: routineRevision,
};
//# sourceMappingURL=RoutineRevisionRecording.js.map