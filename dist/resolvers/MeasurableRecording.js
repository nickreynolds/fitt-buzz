"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function measurable(parent, args, context) {
    console.log("get measurable");
    return context.prisma.measurableRecording
        .findOne({ where: { id: parent.id } })
        .measurable();
}
exports.default = {
    measurable: measurable
};
//# sourceMappingURL=MeasurableRecording.js.map