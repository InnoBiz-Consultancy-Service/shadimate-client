import AppBar from "@/components/shared/AppBar";
import { Toaster } from "sonner";
import { SocketProvider } from "@/context/SocketContext";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SocketProvider>
      <AppBar />
      <div className="md:pt-16 pb-20 md:pb-0">
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "12px",
              fontSize: "13px",
            },
            duration: 5000,
          }}
        />
      </div>
    </SocketProvider>
  );
}
