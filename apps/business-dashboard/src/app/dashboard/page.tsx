"use client";
import { useSession } from "next-auth/react";
import FileUploadPage from "../../components/dashboard/FileUploadPage";
import { useRouter } from "next/navigation";

export default function Index() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  return (
    // <Dashboard user={user}/>
    <FileUploadPage />
  );
}
