import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/authors">כותבים</Link>
      <hr />
      <Link href="/addUser">לוגין</Link>
      <hr />
      <Link href="/about">אודות</Link>
      <hr />
      <Link href="/image">תמונה</Link>
      <hr />
      <Link href="/studio">סטודיו</Link>
    </div>
  );
}
