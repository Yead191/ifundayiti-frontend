import getProfile from "@/helpers/next-fetch/getProfile";
import { Navbar } from "./navbar";

export default async function NavServer() {
  const user = await getProfile();
  return <Navbar user={user} />;
}
