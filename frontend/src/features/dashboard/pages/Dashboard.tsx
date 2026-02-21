import { 
    Users, 
    Trophy, 
    CalendarDays, 
    Activity 
} from "lucide-react";
// ⚠️ Adjust these import paths based on your exact shadcn setup!
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

// --- Static Mock Data ---
const stats = [
    { title: "Total Players", value: "1,248", icon: Users, trend: "+12% from last month" },
    { title: "Active Teams", value: "64", icon: Trophy, trend: "+4 new this season" },
    { title: "Upcoming Games", value: "12", icon: CalendarDays, trend: "Next 7 days" },
    { title: "League Activity", value: "98%", icon: Activity, trend: "Healthy status" },
];

const recentActivities = [
    { id: 1, action: "Game Result", details: "Lakers beat Warriors 112-108", time: "2 hours ago" },
    { id: 2, action: "New Player", details: "John Doe joined Team Alpha", time: "5 hours ago" },
    { id: 3, action: "Schedule Update", details: "Finals moved to Saturday", time: "1 day ago" },
    { id: 4, action: "Team Registration", details: "The Bulldogs completed registration", time: "2 days ago" },
];

export default function Dashboard() {
    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back. Here's what's happening in your league.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">View Schedule</Button>
                    <Button>Create Game</Button>
                </div>
            </div>

            {/* Top Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </CardTitle>
                                <Icon className="w-4 h-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Left side: Could be a chart eventually, but for now just a placeholder card */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>League Overview</CardTitle>
                        <CardDescription>Win/Loss ratios across divisions this season.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center border-t bg-slate-50/50">
                        <p className="text-slate-500 text-sm">Chart Placeholder (e.g., Recharts or Chart.js)</p>
                    </CardContent>
                </Card>

                {/* Right side: Recent Activity Feed */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates from across the platform.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-4 border-b last:border-0 pb-4 last:pb-0">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none text-slate-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {activity.details}
                                        </p>
                                    </div>
                                    <div className="text-xs text-slate-400 whitespace-nowrap">
                                        {activity.time}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}