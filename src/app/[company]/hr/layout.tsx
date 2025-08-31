import AppLayout from "@/components/layout/AppLayout";

export default function HRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}