"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function exercises(parent, args, context) {
    return context.prisma.setGroup
        .findOne({ where: { id: parent.id } })
        .exercises();
}
exports.default = {
    exercises: exercises,
};
//# sourceMappingURL=SetGroup.js.map