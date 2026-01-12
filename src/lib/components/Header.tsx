import HeaderAuthorProfile from "./HeaderAuthorProfile";
import getAuthor from "../services/getAuthor";
import { createClient } from "../supabase/server";
import Theme from "./ThemeToggle";
import SignOutButton from "./SignOutButton";
import Link from "next/link";

export default async function Header() {
  const supabase = await createClient();
  let profile: Author | null = null;
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;

  if (!!email) {
    const { success, response } = await getAuthor("email", email);
    if (!!success) profile = response as Author;
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "50px",
        marginBottom: 10,
        border: "1px solid red",
      }}
    >
      <HeaderAuthorProfile profile={profile} />
      {profile && <SignOutButton />}
      <Theme />
      <p>האתר</p>
      <Link href="/">דף הבית</Link>
    </div>
  );
}
