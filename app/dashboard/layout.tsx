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
            <main className="flex-1 min-w-0 flex flex-col pt-16 md:pt-20 px-8 md:px-12 pb-20 h-screen overflow-y-auto">
                <div className="max-w-4xl w-full leading-relaxed">
                    {children}
                </div>
            </main>
        </div>
    );
}
