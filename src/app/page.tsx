import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");

  return <div className="min-h-screen bg-white"></div>;
}
