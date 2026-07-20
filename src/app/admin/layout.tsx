import AdminSidebar from "@/components/admin/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Wild Gaming Cafe",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-text-primary font-sans">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden p-4 border-b border-border bg-surface-100 flex items-center justify-between">
          <h1 className="text-lg font-bold uppercase tracking-wider text-white">
            Wild <span className="text-accent">Admin</span>
          </h1>
          {/* Mobile menu toggle would go here */}
        </div>
        
        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
