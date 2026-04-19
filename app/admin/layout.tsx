import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin · Arika Resort",
  description: "Resort administration",
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      {children}
    </div>
  );
}
