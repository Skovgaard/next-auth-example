import LoginBtn from "@/components/login-btn";
import RouteGuard from "@/components/route-guard";
import ServerComponent from "@/components/server-component";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <RouteGuard>
        <>
          <LoginBtn />
          {/* @ts-expect-error Server Component */}
          <ServerComponent />
          <Link href="/home">Home link</Link>
        </>
      </RouteGuard>
    </main>
  );
}
