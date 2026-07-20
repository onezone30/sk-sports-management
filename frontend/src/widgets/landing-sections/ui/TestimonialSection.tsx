import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const reviews = [
    {
        name: "Coach Mike D.",
        role: "Head Coach, Westside FC",
        content: "I used to spend hours on spreadsheets. SK Sports cut my admin time in half. The scheduling tool is a lifesaver.",
        initials: "MD",
    },
    {
        name: "Sarah Jenkins",
        role: "Team Manager, City Strikers",
        content: "The best part is the communication. Parents actually know where to be and when. No more frantic group texts.",
        initials: "SJ",
    },
    {
        name: "David Chen",
        role: "Director, Youth League",
        content: "Managing 20 teams was a nightmare until we switched to SK. The roster management is incredibly intuitive.",
        initials: "DC",
    },
];

export default function TestimonialsSection() {
    return (
        <section className="bg-white px-4 py-24">
            <div className="mx-auto max-w-6xl">
                <div className="mb-16 text-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Testimonials</p>
                    <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
                        Coaches love SK Sports
                    </h2>
                    <p className="mt-4 text-lg text-slate-500">
                        Don't just take our word for it.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {reviews.map((review, index) => (
                        <Card key={index} className="flex flex-col border-slate-200 bg-slate-50 shadow-none">
                            <CardContent className="flex flex-1 flex-col p-8">
                                <Quote className="mb-4 h-8 w-8 text-blue-200" />
                                <p className="flex-1 text-base leading-relaxed text-slate-600">
                                    {review.content}
                                </p>
                                <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-6">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                        {review.initials}
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900">{review.name}</div>
                                        <div className="text-xs text-slate-500">{review.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
