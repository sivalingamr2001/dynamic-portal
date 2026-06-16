import { PortfolioWidget } from "@/features/Allocation/PortfolioWidget";
import { RecentEntriesWidget } from "@/features/Allocation/RecentEntriesWidget";
import { StatsBar } from "@/Layout/StatsBar";

export const DashboardPage = () => {
    return (
        <div>
            <StatsBar />
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="flex gap-6">
                    <RecentEntriesWidget />
                    <PortfolioWidget />
                </div>
            </div>
        </div>
    );
}