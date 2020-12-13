# Migration `20201109044122-not-sure-again`

This migration has been generated by Nick Reynolds at 11/8/2020, 11:41:22 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."SetGroupRecording" ALTER COLUMN "completedSets" SET DEFAULT 0;

ALTER TABLE "public"."SetRecording" ADD COLUMN "completedExercises" integer  NOT NULL DEFAULT 0;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201102041022-update-recording-models..20201109044122-not-sure-again
--- datamodel.dml
+++ datamodel.dml
@@ -4,9 +4,9 @@
 ///
 datasource db {
   provider = "postgresql"
-  url = "***"
+  url = "***"
 }
 model Exercise {
   createdAt         DateTime            @default(now())
@@ -73,17 +73,18 @@
   createdBy                  User                      @relation(fields: [createdById], references: [id])
   setGroup                   SetGroup                  @relation(fields: [setGroupId], references: [id])
   setGroupId                 String
   setRecordings              SetRecording[]
-  completedSets              Int
+  completedSets              Int                       @default(0)
   RoutineRevisionRecording   RoutineRevisionRecording? @relation(fields: [routineRevisionRecordingId], references: [id])
   routineRevisionRecordingId String?
 }
 model SetRecording {
   id                  String              @id
   setGroupRecording   SetGroupRecording   @relation(fields: [setGroupRecordingId], references: [id])
   setGroupRecordingId String
+  completedExercises  Int                 @default(0)
   exericseRecordings  ExerciseRecording[]
 }
 model ExerciseRecording {
```

