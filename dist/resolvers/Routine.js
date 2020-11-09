"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createdBy(parent, args, context) {
    return context.prisma.routine
        .findOne({ where: { id: parent.id } })
        .createdBy();
}
function revisions(parent, args, context) {
    return context.prisma.routine
        .findOne({ where: { id: parent.id } })
        .revisions();
}
exports.default = {
    createdBy: createdBy,
    revisions: revisions,
};
//# sourceMappingURL=Routine.js.map