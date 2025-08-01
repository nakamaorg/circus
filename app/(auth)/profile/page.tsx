import type { JSX } from "react";

import { ProfileContent } from "@/components/profile-content";



/**
 * @description
 * Profile page server component that renders the ProfileContent
 *
 * @returns {JSX.Element} The profile page component.
 */
export default function ProfilePage(): JSX.Element {
  return <ProfileContent />;
}
