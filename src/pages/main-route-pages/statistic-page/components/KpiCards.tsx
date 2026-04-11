import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Headphones } from "lucide-react";

interface KpiCardsProps {
  counts: { auth: number; chat: number; music: number };
}

export default function KpiCards({ counts }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-blue-100 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase">
            Tài khoản đã tạo
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {counts.auth.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="border-indigo-100 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase">
            Tin nhắn hệ thống
          </CardTitle>
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <MessageSquare className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {counts.chat.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-100 hover:shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-gray-600 uppercase">
            Lượt nghe nhạc
          </CardTitle>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Headphones className="w-5 h-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {counts.music.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
