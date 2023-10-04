"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  console.log("gogogogogo");
  

  useEffect(() => {
    if (status === "authenticated" && pathname !== "/") router.push("/");
    if (status === "unauthenticated" && pathname !== "/auth/signin")
      router.push("/auth/signin");
  }, [pathname, router, status]);

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      router.push("/auth/signin"); // Force sign in to hopefully resolve error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status !== "authenticated") return <div>Loading..</div>;

  return children;
}
