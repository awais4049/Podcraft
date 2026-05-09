# PodCraft Security Specification

## Data Invariants
1. A **User** profile must match the `request.auth.uid`.
2. An **Episode** must belong to the user who created it (`userId == request.auth.uid`).
3. Users can only read and write their own data.
4. Timestamps (`createdAt`, `updatedAt`) must be set to `request.time`.

## The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Creating an episode with `userId` of another user.
2. **PII Leak**: Authenticated user trying to read another user's `users/{userId}` profile.
3. **Ghost Field**: Adding a `isAdmin: true` field to a user profile.
4. **Invalid Type**: Sending a 1MB string for `niche`.
5. **Orphan Write**: Creating an episode without a corresponding user document.
6. **Immutable Violation**: Updating `createdAt` field on an existing episode.
7. **Action Bypass**: Updating `goal` when the status is `completed` (if terminal states are enforced).
8. **Malicious ID**: Creating a document with ID `../forbidden/doc`.
9. **Timestamp Spoof**: Sending a client-side timestamp for `updatedAt`.
10. **Resource Exhaustion**: Sending a massive array for `topics`.
11. **State Shortcutting**: Manually setting `status` to `completed` without data.
12. **Blanket Query**: Requesting `episodes` without a `userId` filter.

## Test Runner
The following logic will be implemented in `firestore.rules`.
