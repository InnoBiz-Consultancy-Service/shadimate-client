import AppBar from "@/components/shared/AppBar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppBar />
      <div className="md:pt-16 pb-20 md:pb-0">{children}</div>
    </>
  );
}
