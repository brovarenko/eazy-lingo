"use client";

import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">
          This page is not implemented yet. Go back to the{" "}
          <Link href="/" className="underline">
            dashboard
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
