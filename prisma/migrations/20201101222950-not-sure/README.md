# Migration `20201101222950-not-sure`

This migration has been generated by Nick Reynolds at 11/1/2020, 5:29:50 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE "public"."SetGroupPlacement" ADD FOREIGN KEY ("createdById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201030050652-fix-placements..20201101222950-not-sure
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
   createdAt     DateTime       @default(now())
@@ -33,8 +33,9 @@
 model SetGroupPlacement {
   createdAt        DateTime          @default(now())
   createdById      String?
+  createdBy        User?             @relation(fields: [createdById], references: [id])
   id               String            @id
   setGroup         SetGroup          @relation(fields: [setGroupId], references: [id])
   placement        Int
   routineRevisions RoutineRevision[]
@@ -50,8 +51,19 @@
   Routine            Routine?            @relation(fields: [routineId], references: [id])
   routineId          String?
 }
+// model RoutineRevisionRecording {
+//   createdAt   DateTime @default(now())
+//   createdById String
+//   id          String   @id
+//   createdBy   User     @relation(fields: [createdById], references: [id])
+// }
+
+// model SetGroupRecording {
+
+// }
+
 model Routine {
   createdAt        DateTime          @default(now())
   createdById      String?
   id               String            @id
@@ -95,12 +107,13 @@
   exercises    Exercise[]
 }
 model User {
-  id               String            @id
-  password         String
-  username         String            @unique
-  exercises        Exercise[]
-  setGroups        SetGroup[]
-  routineRevisions RoutineRevision[]
-  routines         Routine[]
+  id                String              @id
+  password          String
+  username          String              @unique
+  exercises         Exercise[]
+  setGroups         SetGroup[]
+  routineRevisions  RoutineRevision[]
+  routines          Routine[]
+  SetGroupPlacement SetGroupPlacement[]
 }
```

