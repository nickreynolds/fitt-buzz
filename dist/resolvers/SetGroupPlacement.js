"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setGroup(parent, args, context) {
    console.log("1 setGroup parent: ", parent);
    return context.prisma.setGroup
        .findOne({ where: { id: parent.setGroupId } });
}
exports.default = {
    setGroup: setGroup,
};
//# sourceMappingURL=SetGroupPlacement.js.map