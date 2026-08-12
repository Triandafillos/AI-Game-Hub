import Link from "next/link";
import { getSessionUser } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/games";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          AI Game Hub
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          {user ? (
            <>
              <Link href="/account" className="hover:text-white">
                Account
              </Link>
              {isAdminEmail(user.email) && (
                <Link href="/admin/games" className="hover:text-white">
                  Admin
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button type="submit" className="hover:text-white">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-500"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
