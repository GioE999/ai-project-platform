import { AuthorizationError } from "@/lib/errors";

/**
 * Validates that a resource belongs to the given user.
 * Throws AuthorizationError if the resource's userId doesn't match.
 */
export function assertOwnership(
  resource: { userId: string } | null,
  userId: string
): void {
  if (!resource) {
    return; // Let NotFoundError be thrown by the caller
  }
  if (resource.userId !== userId) {
    throw new AuthorizationError(
      "You do not have access to this resource"
    );
  }
}

/**
 * Validates ownership for an array of resources.
 */
export function assertOwnershipAll(
  resources: { userId: string }[],
  userId: string
): void {
  for (const resource of resources) {
    assertOwnership(resource, userId);
  }
}
