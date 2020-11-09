"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function muscle(parent, args, context) {
    return context.prisma.muscleImpact
        .findOne({ where: { id: parent.id } })
        .muscle();
}
exports.default = {
    muscle: muscle,
};
//# sourceMappingURL=MuscleImpact.js.map