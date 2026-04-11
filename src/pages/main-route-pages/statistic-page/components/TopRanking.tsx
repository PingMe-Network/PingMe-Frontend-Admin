import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";

interface TopItem {
  id: string;
  name: string;
  subText: string;
  score: number;
}

interface TopRankingProps {
  activeTab: "auth" | "chat" | "music";
}

export default function TopRanking({ activeTab }: TopRankingProps) {
  // TẠM THỜI: Dùng Mock Data. Sau này bạn sẽ truyền data này từ API vào.
  const getRankingData = (): { title: string; items: TopItem[] } => {
    if (activeTab === "music") {
      return {
        title: "Top 5 Bài hát thịnh hành",
        items: [
          {
            id: "1",
            name: "Có Chắc Yêu Là Đây",
            subText: "Sơn Tùng M-TP",
            score: 1245,
          },
          { id: "2", name: "Chìm Sâu", subText: "MCK", score: 980 },
          {
            id: "3",
            name: "Nơi Này Có Anh",
            subText: "Sơn Tùng M-TP",
            score: 856,
          },
          { id: "4", name: "Waiting For You", subText: "MONO", score: 720 },
          { id: "5", name: "Ngủ Một Mình", subText: "HIEUTHUHAI", score: 650 },
        ],
      };
    }
    if (activeTab === "chat") {
      return {
        title: "Top 5 Thành viên năng nổ",
        items: [
          {
            id: "1",
            name: "Nguyễn Văn Phát",
            subText: "ID: user_8932",
            score: 450,
          },
          { id: "2", name: "Trần Hải", subText: "ID: user_1024", score: 382 },
          { id: "3", name: "Lê Khiêm", subText: "ID: user_5521", score: 310 },
          { id: "4", name: "Anna Tran", subText: "ID: user_9921", score: 285 },
          { id: "5", name: "Hoàng Minh", subText: "ID: user_4412", score: 190 },
        ],
      };
    }
    return {
      title: "Top 5 Khu vực đăng ký mới",
      items: [
        { id: "1", name: "Hồ Chí Minh", subText: "Việt Nam", score: 320 },
        { id: "2", name: "Hà Nội", subText: "Việt Nam", score: 280 },
        { id: "3", name: "Đà Nẵng", subText: "Việt Nam", score: 150 },
        { id: "4", name: "Cần Thơ", subText: "Việt Nam", score: 90 },
        { id: "5", name: "Hải Phòng", subText: "Việt Nam", score: 65 },
      ],
    };
  };

  const data = getRankingData();

  // Đổi màu icon cho Top 1, 2, 3
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <Award className="w-5 h-5 text-blue-200" />;
  };

  return (
    <Card className="shadow-sm border-gray-100 flex flex-col h-full bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/50 font-bold text-gray-600">
                  {getRankIcon(index)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.subText}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {item.score.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                  {activeTab === "music"
                    ? "Lượt nghe"
                    : activeTab === "chat"
                      ? "Tin nhắn"
                      : "Tài khoản"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
