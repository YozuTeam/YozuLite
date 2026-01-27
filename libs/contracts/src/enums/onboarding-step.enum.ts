/**
 * Represents the onboarding step of a user in the application.
 *
 * REGISTERED: User has created an account but no profile yet
 * PROFILE_PENDING: Transitional state (for future use)
 * PROFILE_COMPLETED: User has completed their profile
 */
export enum OnboardingStep {
  REGISTERED = "REGISTERED",
  PROFILE_PENDING = "PROFILE_PENDING",
  PROFILE_COMPLETED = "PROFILE_COMPLETED",
}
