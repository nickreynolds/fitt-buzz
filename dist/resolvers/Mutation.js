"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var uuid_1 = require("uuid");
var _a = require("../utils"), APP_SECRET = _a.APP_SECRET, getUserId = _a.getUserId;
function signup(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var password, user, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcrypt.hash(args.password, 10)];
                case 1:
                    password = _a.sent();
                    return [4 /*yield*/, context.prisma.user.create({
                            data: __assign(__assign({}, args), { password: password, id: uuid_1.v4() }),
                        })];
                case 2:
                    user = _a.sent();
                    token = jwt.sign({ userId: user.id }, APP_SECRET);
                    // 4
                    return [2 /*return*/, {
                            token: token,
                            user: user,
                        }];
            }
        });
    });
}
function login(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var user, valid, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, context.prisma.user.findOne({
                        where: { username: args.username },
                    })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        throw new Error("No such user found");
                    }
                    return [4 /*yield*/, bcrypt.compare(args.password, user.password)];
                case 2:
                    valid = _a.sent();
                    if (!valid) {
                        throw new Error("Invalid password");
                    }
                    token = jwt.sign({ userId: user.id }, APP_SECRET);
                    // 3
                    return [2 /*return*/, {
                            token: token,
                            user: user,
                        }];
            }
        });
    });
}
function createExercise(parent, args, context, info) {
    var userId = getUserId(context);
    return context.prisma.exercise.create({
        data: {
            id: uuid_1.v4(),
            name: args.name,
            description: args.description,
            format: { connect: { id: args.format } },
            createdBy: { connect: { id: userId } },
            muscleImpacts: {
                connect: args.muscleImpacts.map(function (impact) {
                    return { id: impact };
                }),
            },
        },
    });
}
function incrementCompletedSetGroups(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, recording;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = getUserId(context);
                    if (!args.routineRevisionRecordingId) {
                        throw new Error("no routine revision recording specified");
                    }
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.findOne({ where: { id: args.routineRevisionRecordingId } })];
                case 1:
                    recording = _a.sent();
                    if (!recording) {
                        throw new Error("no recording found");
                    }
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.update({ where: { id: args.routineRevisionRecordingId }, data: {
                                completedSetGroups: recording.completedSetGroups + 1
                            } })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, recording.id];
            }
        });
    });
}
function incrementCompletedSets(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, recording, setGroupRecordings, setGroupRecording;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = getUserId(context);
                    if (!args.routineRevisionRecordingId) {
                        throw new Error("no routine revision recording specified");
                    }
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.findOne({ where: { id: args.routineRevisionRecordingId } })];
                case 1:
                    recording = _a.sent();
                    if (!recording) {
                        throw new Error("no recording found");
                    }
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.findOne({ where: { id: args.routineRevisionRecordingId } }).setGroupRecordings()];
                case 2:
                    setGroupRecordings = _a.sent();
                    return [4 /*yield*/, context.prisma.setGroupRecording.findOne({ where: { id: setGroupRecordings[recording.completedSetGroups].id } })];
                case 3:
                    setGroupRecording = _a.sent();
                    return [4 /*yield*/, context.prisma.setGroupRecording.update({ where: { id: setGroupRecording.id }, data: {
                                completedSets: setGroupRecording.completedSets + 1
                            } })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, recording.id];
            }
        });
    });
}
function startRoutineRevisionRecording(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, routine, revision, routineRecording;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("start recording 1");
                    userId = getUserId(context);
                    if (!userId) {
                        throw new Error("No user included in request");
                    }
                    console.log("start recording 2");
                    return [4 /*yield*/, context.prisma.routine.findOne({
                            where: { id: args.routineId },
                        })];
                case 1:
                    routine = _a.sent();
                    if (routine.createdById !== userId) {
                        throw new Error("Routine not created by current user. Please clone routine first.");
                    }
                    return [4 /*yield*/, context.prisma.routineRevision.findOne({
                            where: { id: args.revisionId },
                        })];
                case 2:
                    revision = _a.sent();
                    if (revision.routineId !== routine.id) {
                        throw new Error("Specified revision does not belong to specified routine.");
                    }
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.create({
                            data: {
                                id: uuid_1.v4(),
                                createdBy: { connect: { id: userId } },
                                revision: { connect: { id: args.revisionId } },
                                completedSetGroups: 0,
                            },
                        })];
                case 3:
                    routineRecording = _a.sent();
                    return [2 /*return*/, routineRecording.id];
            }
        });
    });
}
function addExerciseRecording(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, recording, currentSetGroupPlacement, setGroupRecordings2, setGroupRecording, exerciseRecording, measurableRecordings, currentSet, setRecordings, setRecording, exerciseRecordings;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.routineRevisionRecordingId) {
                        throw new Error("no routine revision recording specified");
                    }
                    userId = getUserId(context);
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.findOne({ where: { id: args.routineRevisionRecordingId } })];
                case 1:
                    recording = _a.sent();
                    if (!recording) {
                        throw new Error("no recording found");
                    }
                    currentSetGroupPlacement = recording.completedSetGroups;
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.findOne({ where: { id: args.routineRevisionRecordingId } }).setGroupRecordings()];
                case 2:
                    setGroupRecordings2 = _a.sent();
                    if (recording.createdById !== userId) {
                        throw new Error("authenticated user is not owner of specified recording");
                    }
                    if (!args.setGroupId) {
                        throw new Error("no setGroupId specified");
                    }
                    if (!!args.setGroupRecordingId) return [3 /*break*/, 5];
                    return [4 /*yield*/, context.prisma.setGroupRecording.create({ data: {
                                id: uuid_1.v4(),
                                completedSets: 0,
                                createdBy: { connect: { id: userId } },
                                setGroup: { connect: { id: args.setGroupId } }
                            } })];
                case 3:
                    setGroupRecording = _a.sent();
                    setGroupRecordings2.push(setGroupRecording);
                    return [4 /*yield*/, context.prisma.routineRevisionRecording.update({ where: { id: recording.id }, data: {
                                setGroupRecordings: { connect: setGroupRecordings2.map(function (group) { return { id: group.id }; }) }
                            } })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, context.prisma.setGroupRecording.findOne({ where: { id: args.setGroupRecordingId } })];
                case 6:
                    setGroupRecording = _a.sent();
                    if (!setGroupRecording) {
                        throw new Error("setGroupRecording not found");
                    }
                    _a.label = 7;
                case 7: return [4 /*yield*/, context.prisma.exerciseRecording.create({ data: {
                            id: uuid_1.v4(),
                            exercise: { connect: { id: args.exerciseRecordingInput.exerciseID } },
                        } })];
                case 8:
                    exerciseRecording = _a.sent();
                    measurableRecordings = [];
                    args.exerciseRecordingInput.measurableRecordings.map(function (recording) { return __awaiter(_this, void 0, void 0, function () {
                        var measurableRecording;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, context.prisma.measurableRecording.create({
                                        data: {
                                            id: uuid_1.v4(),
                                            measurable: { connect: { id: recording.measurableID } },
                                            value: recording.value,
                                            ExerciseRecording: { connect: { id: exerciseRecording.id } }
                                        }
                                    })];
                                case 1:
                                    measurableRecording = _a.sent();
                                    measurableRecordings.push(measurableRecording);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, context.prisma.exerciseRecording.update({ where: { id: exerciseRecording.id }, data: {
                                measurableRecordings: { connect: measurableRecordings.map(function (recording) { return { id: recording.id }; }) }
                            } })];
                case 9:
                    exerciseRecording = _a.sent();
                    currentSet = setGroupRecording.completedSets;
                    return [4 /*yield*/, context.prisma.setGroupRecording.findOne({ where: { id: setGroupRecording.id } }).setRecordings()];
                case 10:
                    setRecordings = _a.sent();
                    if (!(setRecordings.length <= currentSet)) return [3 /*break*/, 12];
                    return [4 /*yield*/, context.prisma.setRecording.create({ data: {
                                id: uuid_1.v4(),
                                setGroupRecording: { connect: { id: setGroupRecording.id } }
                            } })];
                case 11:
                    setRecording = _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    setRecording = setRecordings[currentSet];
                    _a.label = 13;
                case 13: return [4 /*yield*/, context.prisma.setRecording.findOne({ where: { id: setRecording.id } }).exericseRecordings()];
                case 14:
                    exerciseRecordings = _a.sent();
                    exerciseRecordings.push(exerciseRecording);
                    return [4 /*yield*/, context.prisma.setRecording.update({ where: { id: setRecording.id }, data: {
                                exericseRecordings: { connect: exerciseRecordings.map(function (recording) { return { id: recording.id }; }) }
                            } })
                        // await context.prisma.setGroupRecording.update({ where: { id: setGroupRecording.id }, data: {
                        //   exerciseRecordings: { connect: }
                        // }})
                    ];
                case 15:
                    _a.sent();
                    // await context.prisma.setGroupRecording.update({ where: { id: setGroupRecording.id }, data: {
                    //   exerciseRecordings: { connect: }
                    // }})
                    return [2 /*return*/, recording.id];
            }
        });
    });
}
function cloneRoutineAtRevision(parent, args, context, info) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, originalRoutine, routineRevisions, setGroupPlacements, newSetGroupPlacements, _i, setGroupPlacements_1, setGroupPlacement, exercises, newSetGroupId, newSetGroup, _a, _b, _c, _d, newSetGroupPlacement, revision, routine;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    userId = getUserId(context);
                    return [4 /*yield*/, context.prisma.routine.findOne({
                            where: { id: args.routineId },
                        })];
                case 1:
                    originalRoutine = _e.sent();
                    return [4 /*yield*/, context.prisma.routine
                            .findOne({ where: { id: args.routineId } })
                            .revisions()];
                case 2:
                    routineRevisions = _e.sent();
                    if (!routineRevisions
                        .map(function (rev) {
                        return rev.id;
                    })
                        .includes(args.revisionId)) {
                        throw new Error("Revision not found in Routine! You trying to cheat me??");
                    }
                    console.log("userId: ", userId);
                    return [4 /*yield*/, context.prisma.routineRevision
                            .findOne({ where: { id: args.revisionId } })
                            .setGroupPlacements()];
                case 3:
                    setGroupPlacements = _e.sent();
                    newSetGroupPlacements = [];
                    _i = 0, setGroupPlacements_1 = setGroupPlacements;
                    _e.label = 4;
                case 4:
                    if (!(_i < setGroupPlacements_1.length)) return [3 /*break*/, 10];
                    setGroupPlacement = setGroupPlacements_1[_i];
                    return [4 /*yield*/, context.prisma.setGroup
                            .findOne({ where: { id: setGroupPlacement.setGroupId } })
                            .exercises()];
                case 5:
                    exercises = _e.sent();
                    newSetGroupId = uuid_1.v4();
                    _b = (_a = context.prisma.setGroup).create;
                    _c = {};
                    _d = {
                        id: newSetGroupId,
                        exercises: {
                            connect: exercises.map(function (exercise) {
                                return { id: exercise.id };
                            }),
                        }
                    };
                    return [4 /*yield*/, context.prisma.setGroup.findOne({
                            where: { id: setGroupPlacement.setGroupId },
                        })];
                case 6: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.defaultNumSets = (_e.sent()).defaultNumSets,
                            _d),
                            _c)])];
                case 7:
                    newSetGroup = _e.sent();
                    return [4 /*yield*/, context.prisma.setGroupPlacement.create({
                            data: {
                                createdBy: { connect: { id: userId } },
                                id: setGroupPlacement.placement + "-" + uuid_1.v4(),
                                setGroup: { connect: { id: newSetGroup.id } },
                                placement: setGroupPlacement.placement,
                            },
                        })];
                case 8:
                    newSetGroupPlacement = _e.sent();
                    newSetGroupPlacements.push(newSetGroupPlacement);
                    _e.label = 9;
                case 9:
                    _i++;
                    return [3 /*break*/, 4];
                case 10: return [4 /*yield*/, context.prisma.routineRevision.create({
                        data: {
                            id: uuid_1.v4(),
                            createdBy: { connect: { id: userId } },
                            setGroupPlacements: {
                                connect: newSetGroupPlacements.map(function (newSetGroupPlacement) {
                                    return { id: newSetGroupPlacement.id };
                                }),
                            },
                        },
                    })];
                case 11:
                    revision = _e.sent();
                    return [4 /*yield*/, context.prisma.routine.create({
                            data: {
                                id: uuid_1.v4(),
                                createdBy: { connect: { id: userId } },
                                revisions: { connect: [{ id: revision.id }] },
                                name: originalRoutine.name,
                                description: originalRoutine.description,
                                cloneOf: { connect: { id: originalRoutine.id } },
                            },
                        })];
                case 12:
                    routine = _e.sent();
                    return [2 /*return*/, routine];
            }
        });
    });
}
exports.default = {
    signup: signup,
    login: login,
    createExercise: createExercise,
    cloneRoutineAtRevision: cloneRoutineAtRevision,
    startRoutineRevisionRecording: startRoutineRevisionRecording,
    addExerciseRecording: addExerciseRecording,
    incrementCompletedSetGroups: incrementCompletedSetGroups,
    incrementCompletedSets: incrementCompletedSets
};
//# sourceMappingURL=Mutation.js.map