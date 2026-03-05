"use client";

import { useSession } from "next-auth/react";

export function Header({ title }: { title: string }) {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            {session?.user?.name || "Roofer"}
          </p>
          <p className="text-xs text-gray-500">{session?.user?.email}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
          {(session?.user?.name || "R")[0].toUpperCase()}
        </div>
      </div>
    </header>
  );
}
