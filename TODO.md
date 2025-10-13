# TODO: Fix Series Withdrawal Overlap and Request Submission Issues

## Information Gathered
- Series withdrawal logic in `backend/src/data/store.ts` prevents overlapping ranges for both deposits and withdrawals, causing 400 errors for withdrawals from deposited ranges.
- Request submission in `backend/src/controllers/requestController.ts` fails due to user validation, as no users exist in the database (User model in `backend/prisma/schema.prisma`).
- Overlap check uses OR condition to detect any overlap, but for withdrawals, it should allow overlapping with deposits.

## Plan
- [x] Modify `backend/src/data/store.ts` to skip overlap check for withdrawals (allow withdrawals from existing deposited ranges).
- [x] Seed a default user in the database to enable request submission (e.g., via Prisma migration or seed script).
- [x] Test series withdrawal functionality after changes.
- [x] Test request submission with the seeded user.

## Dependent Files
- `backend/src/data/store.ts` (modify overlap logic for withdrawals)
- `backend/prisma/schema.prisma` or migration files (for seeding user)

## Followup Steps
- [x] Run database migration/seed to add default user.
- [x] Verify series withdrawal works without overlap errors.
- [x] Verify request submission works with user validation.
- [ ] Update any frontend components if needed (e.g., RequestList.tsx for user selection).
