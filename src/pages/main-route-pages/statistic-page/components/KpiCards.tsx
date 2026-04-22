import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Headphones } from "lucide-react";

interface KpiCardsProps {
  counts: { auth: number; chat: number; music: number };
}

export default function KpiCards({ counts }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Tài khoản */}
      <Card className="relative overflow-hidden border-none shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white group rounded-2xl">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
           <Users className="w-32 h-32 text-blue-600" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Tài khoản đã tạo
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-blue-50/80 text-blue-600 shadow-inner">
            <Users className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {counts.auth.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Tin nhắn */}
      <Card className="relative overflow-hidden border-none shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white group rounded-2xl">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-500">
           <MessageSquare className="w-32 h-32 text-indigo-600" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Tin nhắn hệ thống
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-indigo-50/80 text-indigo-600 shadow-inner">
            <MessageSquare className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {counts.chat.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Lượt nghe */}
      <Card className="relative overflow-hidden border-none shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white group rounded-2xl">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
           <Headphones className="w-32 h-32 text-emerald-600" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Lượt nghe nhạc
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-emerald-50/80 text-emerald-600 shadow-inner">
            <Headphones className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {counts.music.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
