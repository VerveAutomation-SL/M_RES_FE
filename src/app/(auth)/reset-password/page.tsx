import { Suspense } from "react";
import ResetPasswordPage from "./ResetPasswordClient";

export default function ResetPasswordPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
