import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
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

  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            Coaches love SK Sports
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Don't just take our word for it.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <Card key={index} className="border-none shadow-lg shadow-blue-900/5">
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                  {review.initials}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{review.name}</div>
                  <div className="text-sm text-slate-500">{review.role}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="leading-relaxed text-slate-600">"{review.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}