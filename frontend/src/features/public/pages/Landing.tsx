 import { Badge } from "../../../components/ui/badge";
 import { Button } from "../../../components/ui/button";
 import { Card, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
 import { Calendar, Shield, Target, Trophy, Users, Zap } from "lucide-react";

 export default function Landing() {
   return (
     <div className="w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
       <section className="px-4 py-20">
         <div className="mx-auto max-w-6xl text-center">
           <Badge className="mb-4">Sports Management Platform</Badge>
           <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
             Manage Your Sports Team
             <span className="text-blue-600"> Like a Pro</span>
           </h1>
           <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
             Teams, schedules, stats, and communication in one place—built to scale with your club.
           </p>
           <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
             <Button size="lg" className="px-8">Start Free Trial</Button>
             <Button size="lg" variant="outline" className="px-8">
               View Demo
             </Button>
           </div>
         </div>
       </section>

       <section className="bg-white px-4 py-16">
         <div className="mx-auto max-w-6xl">
           <div className="mb-12 text-center">
             <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Everything you need</h2>
             <p className="mt-3 text-gray-600">A clean toolkit for managing operations and performance.</p>
           </div>

           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Users className="mb-3 h-10 w-10 text-blue-600" />
                 <CardTitle>Team Management</CardTitle>
                 <CardDescription>Player roster, profiles, and roles.</CardDescription>
               </CardHeader>
             </Card>

             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Calendar className="mb-3 h-10 w-10 text-green-600" />
                 <CardTitle>Scheduling</CardTitle>
                 <CardDescription>Matches, trainings, and events.</CardDescription>
               </CardHeader>
             </Card>

             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Trophy className="mb-3 h-10 w-10 text-yellow-600" />
                 <CardTitle>Stats &amp; Results</CardTitle>
                 <CardDescription>Track performance and outcomes.</CardDescription>
               </CardHeader>
             </Card>

             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Target className="mb-3 h-10 w-10 text-purple-600" />
                 <CardTitle>Goals</CardTitle>
                 <CardDescription>Set objectives and monitor progress.</CardDescription>
               </CardHeader>
             </Card>

             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Zap className="mb-3 h-10 w-10 text-orange-600" />
                 <CardTitle>Announcements</CardTitle>
                 <CardDescription>Send updates to players and staff.</CardDescription>
               </CardHeader>
             </Card>

             <Card className="transition-shadow hover:shadow-lg">
               <CardHeader>
                 <Shield className="mb-3 h-10 w-10 text-red-600" />
                 <CardTitle>Secure</CardTitle>
                 <CardDescription>Keep team data safe and private.</CardDescription>
               </CardHeader>
             </Card>
           </div>
         </div>
       </section>
     </div>
   );
 }
