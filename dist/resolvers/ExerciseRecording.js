"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function measurableRecordings(parent, args, context) {
    console.log("get measurableRecordings");
    return context.prisma.exerciseRecording
        .findOne({ where: { id: parent.id } })
        .measurableRecordings();
}
function exercise(parent, args, context) {
    console.log("get exercise");
    return context.prisma.exerciseRecording
        .findOne({ where: { id: parent.id } })
        .exercise();
}
exports.default = {
    measurableRecordings: measurableRecordings,
    exercise: exercise
};
//# sourceMappingURL=ExerciseRecording.js.map