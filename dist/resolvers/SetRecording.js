"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function exerciseRecordings(parent, args, context) {
    console.log("get setGroup");
    return context.prisma.setRecording
        .findOne({ where: { id: parent.id } })
        .exericseRecordings();
}
exports.default = {
    exerciseRecordings: exerciseRecordings,
};
//# sourceMappingURL=SetRecording.js.map