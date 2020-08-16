"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createdBy(parent, args, context) {
    return context.prisma.routine
        .findOne({ where: { id: parent.id } })
        .createdBy();
}
exports.default = {
    createdBy: createdBy,
};
//# sourceMappingURL=Routine.js.map