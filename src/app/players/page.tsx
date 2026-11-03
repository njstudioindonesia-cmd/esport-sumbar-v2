import { redirect } from "next/navigation";

export default function PlayersRedirect() {
  redirect("/explore?tab=player");
}
