# Migration `20201030044556-init`

This migration has been generated by Nick Reynolds at 10/30/2020, 12:45:56 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Exercise" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"createdById" text   ,
"description" text  NOT NULL ,
"formatId" text  NOT NULL ,
"id" text  NOT NULL ,
"name" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."SetGroup" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"createdById" text   ,
"id" text  NOT NULL ,
"defaultNumSets" integer  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."SetGroupPlacement" (
"id" text  NOT NULL ,
"placement" integer  NOT NULL ,
"setGroupId" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."RoutineRevision" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"createdById" text   ,
"id" text  NOT NULL ,
"routineId" text   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Routine" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"createdById" text   ,
"id" text  NOT NULL ,
"name" text  NOT NULL ,
"description" text  NOT NULL ,
"cloneOfRoutineId" text   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Format" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" text  NOT NULL ,
"id" text  NOT NULL ,
"name" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Measurable" (
"id" text  NOT NULL ,
"name" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Muscle" (
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" text  NOT NULL ,
"id" text  NOT NULL ,
"name" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."MuscleImpact" (
"id" text  NOT NULL ,
"impactRating" integer  NOT NULL ,
"muscleId" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"id" text  NOT NULL ,
"password" text  NOT NULL ,
"username" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."_ExerciseToMuscleImpact" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE TABLE "public"."_ExerciseToSetGroup" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE TABLE "public"."_RoutineRevisionToSetGroupPlacement" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE TABLE "public"."_FormatToMeasurable" (
"A" text  NOT NULL ,
"B" text  NOT NULL )

CREATE UNIQUE INDEX "User.username_unique" ON "public"."User"("username")

CREATE UNIQUE INDEX "_ExerciseToMuscleImpact_AB_unique" ON "public"."_ExerciseToMuscleImpact"("A","B")

CREATE  INDEX "_ExerciseToMuscleImpact_B_index" ON "public"."_ExerciseToMuscleImpact"("B")

CREATE UNIQUE INDEX "_ExerciseToSetGroup_AB_unique" ON "public"."_ExerciseToSetGroup"("A","B")

CREATE  INDEX "_ExerciseToSetGroup_B_index" ON "public"."_ExerciseToSetGroup"("B")

CREATE UNIQUE INDEX "_RoutineRevisionToSetGroupPlacement_AB_unique" ON "public"."_RoutineRevisionToSetGroupPlacement"("A","B")

CREATE  INDEX "_RoutineRevisionToSetGroupPlacement_B_index" ON "public"."_RoutineRevisionToSetGroupPlacement"("B")

CREATE UNIQUE INDEX "_FormatToMeasurable_AB_unique" ON "public"."_FormatToMeasurable"("A","B")

CREATE  INDEX "_FormatToMeasurable_B_index" ON "public"."_FormatToMeasurable"("B")

ALTER TABLE "public"."Exercise" ADD FOREIGN KEY ("createdById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Exercise" ADD FOREIGN KEY ("formatId")REFERENCES "public"."Format"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."SetGroup" ADD FOREIGN KEY ("createdById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."SetGroupPlacement" ADD FOREIGN KEY ("setGroupId")REFERENCES "public"."SetGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."RoutineRevision" ADD FOREIGN KEY ("createdById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."RoutineRevision" ADD FOREIGN KEY ("routineId")REFERENCES "public"."Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Routine" ADD FOREIGN KEY ("createdById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Routine" ADD FOREIGN KEY ("cloneOfRoutineId")REFERENCES "public"."Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."MuscleImpact" ADD FOREIGN KEY ("muscleId")REFERENCES "public"."Muscle"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ExerciseToMuscleImpact" ADD FOREIGN KEY ("A")REFERENCES "public"."Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ExerciseToMuscleImpact" ADD FOREIGN KEY ("B")REFERENCES "public"."MuscleImpact"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ExerciseToSetGroup" ADD FOREIGN KEY ("A")REFERENCES "public"."Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_ExerciseToSetGroup" ADD FOREIGN KEY ("B")REFERENCES "public"."SetGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_RoutineRevisionToSetGroupPlacement" ADD FOREIGN KEY ("A")REFERENCES "public"."RoutineRevision"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_RoutineRevisionToSetGroupPlacement" ADD FOREIGN KEY ("B")REFERENCES "public"."SetGroupPlacement"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_FormatToMeasurable" ADD FOREIGN KEY ("A")REFERENCES "public"."Format"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."_FormatToMeasurable" ADD FOREIGN KEY ("B")REFERENCES "public"."Measurable"("id") ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201030044556-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,104 @@
+generator client {
+  provider = "prisma-client-js"
+}
+
+///
+datasource db {
+  provider = "postgresql"
+  url = "***"
+}
+
+model Exercise {
+  createdAt     DateTime       @default(now())
+  createdById   String?
+  description   String
+  formatId      String
+  id            String         @id
+  name          String
+  createdBy     User?          @relation(fields: [createdById], references: [id])
+  format        Format         @relation(fields: [formatId], references: [id])
+  muscleImpacts MuscleImpact[]
+  setGroups     SetGroup[]
+}
+
+model SetGroup {
+  createdAt         DateTime            @default(now())
+  createdById       String?
+  id                String              @id
+  createdBy         User?               @relation(fields: [createdById], references: [id])
+  exercises         Exercise[] // usually will just have 1, but could have multiple to create "super sets"
+  defaultNumSets    Int
+  SetGroupPlacement SetGroupPlacement[]
+}
+
+model SetGroupPlacement {
+  id               String            @id
+  setGroup         SetGroup          @relation(fields: [setGroupId], references: [id])
+  placement        Int
+  routineRevisions RoutineRevision[]
+  setGroupId       String
+}
+
+model RoutineRevision {
+  createdAt          DateTime            @default(now())
+  createdById        String?
+  id                 String              @id
+  createdBy          User?               @relation(fields: [createdById], references: [id])
+  setGroupPlacements SetGroupPlacement[]
+  Routine            Routine?            @relation(fields: [routineId], references: [id])
+  routineId          String?
+}
+
+model Routine {
+  createdAt        DateTime          @default(now())
+  createdById      String?
+  id               String            @id
+  createdBy        User?             @relation(fields: [createdById], references: [id])
+  revisions        RoutineRevision[]
+  name             String
+  description      String
+  cloneOf          Routine?          @relation("RoutineToRoutine", fields: [cloneOfRoutineId], references: [id])
+  clones           Routine[]         @relation("RoutineToRoutine")
+  cloneOfRoutineId String?
+}
+
+model Format {
+  createdAt   DateTime     @default(now())
+  description String
+  id          String       @id
+  name        String
+  exercises   Exercise[]
+  measurables Measurable[]
+}
+
+model Measurable {
+  id      String   @id
+  name    String
+  formats Format[]
+}
+
+model Muscle {
+  createdAt     DateTime       @default(now())
+  description   String
+  id            String         @id
+  name          String
+  muscleImpacts MuscleImpact[]
+}
+
+model MuscleImpact {
+  id           String     @id
+  impactRating Int
+  muscleId     String
+  muscle       Muscle     @relation(fields: [muscleId], references: [id])
+  exercises    Exercise[]
+}
+
+model User {
+  id               String            @id
+  password         String
+  username         String            @unique
+  exercises        Exercise[]
+  setGroups        SetGroup[]
+  routineRevisions RoutineRevision[]
+  routines         Routine[]
+}
```


