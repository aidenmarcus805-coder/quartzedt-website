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
        <div className="min-h-screen bg-white text-black antialiased selection:bg-black selection:text-white flex">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 flex flex-col pt-16 md:pt-20 px-4 md:px-10 lg:px-16 pb-24 h-screen overflow-y-auto">
                <div className="max-w-[1400px] w-full mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
