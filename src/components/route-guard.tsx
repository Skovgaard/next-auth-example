"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && pathname !== "/") router.push("/");
    if (status === "unauthenticated" && pathname !== "/auth/signin")
      router.push("/auth/signin");
  }, [pathname, router, status]);

  if (status !== "authenticated" ) return <div>Loading..</div>;

  return children;
}
