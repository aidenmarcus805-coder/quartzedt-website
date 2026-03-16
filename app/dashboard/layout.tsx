import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/signin");
    }

    return (
        <div className="min-h-screen bg-[#050504] text-[#FAF9F6] antialiased selection:bg-[#FAF9F6] selection:text-[#050504] flex">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col pt-12 md:pt-16 px-6 md:px-12 lg:px-20 pb-24 h-screen overflow-y-auto">
                <div className="max-w-[1200px] w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
