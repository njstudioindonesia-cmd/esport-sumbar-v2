import { redirect } from "next/navigation";

export default function CoachesRedirect() {
  redirect("/explore?tab=coach");
}
