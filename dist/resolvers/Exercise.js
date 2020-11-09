"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function muscleImpacts(parent, args, context) {
    return context.prisma.exercise
        .findOne({ where: { id: parent.id } })
        .muscleImpacts();
}
function format(parent, args, context) {
    return context.prisma.exercise.findOne({ where: { id: parent.id } }).format();
}
exports.default = {
    muscleImpacts: muscleImpacts,
    format: format,
};
//# sourceMappingURL=Exercise.js.map