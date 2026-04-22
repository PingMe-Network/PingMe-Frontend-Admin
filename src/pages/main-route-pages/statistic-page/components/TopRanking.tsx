import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Flame } from "lucide-react";
import { getTopChatUsers, getTopMusicSongs } from "@/services/admin/statisticsApi";

interface TopItem {
  id: string;
  name: string;
  subText: string;
  score: number;
}

interface TopRankingProps {
  activeTab: "auth" | "chat" | "music";
  filterEpoch?: { start?: number; end?: number };
}

export default function TopRanking({ activeTab, filterEpoch }: TopRankingProps) {
  const [data, setData] = useState<{ title: string; items: TopItem[] }>({ title: "", items: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (activeTab === "music") {
          const res = await getTopMusicSongs(filterEpoch?.start, filterEpoch?.end, 5);
          const items = res.data.map((song: any) => ({
            id: String(song.songId),
            name: song.songTitle || `Bài hát #${song.songId}`,
            subText: song.artistName || "Không rõ ca sĩ",
            score: song.playCount,
          }));
          setData({ title: "Top 5 Bài hát thịnh hành", items });
        } else if (activeTab === "chat") {
          const res = await getTopChatUsers(filterEpoch?.start, filterEpoch?.end, 5);
          const items = res.data.map((user: any) => ({
            id: String(user.userId),
            name: user.userName || `Thành viên #${user.userId}`,
            subText: `ID: user_${user.userId}`,
            score: user.messageCount,
          }));
          setData({ title: "Top 5 Thành viên năng nổ", items });
        } else {
          // Mock data for Auth
          setData({
            title: "Top 5 Khu vực đăng ký mới",
            items: [
              { id: "1", name: "Hồ Chí Minh", subText: "Việt Nam", score: 320 },
              { id: "2", name: "Hà Nội", subText: "Việt Nam", score: 280 },
              { id: "3", name: "Đà Nẵng", subText: "Việt Nam", score: 150 },
              { id: "4", name: "Cần Thơ", subText: "Việt Nam", score: 90 },
              { id: "5", name: "Hải Phòng", subText: "Việt Nam", score: 65 },
            ],
          });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu Top Ranking:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab, filterEpoch]);

  const maxScore = data.items.length > 0 ? Math.max(...data.items.map(item => item.score)) : 1;

  // Đổi màu icon cho Top 1, 2, 3
  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-md" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400 drop-shadow-md" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600 drop-shadow-md" />;
    return <span className="text-sm font-bold text-gray-400">#{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return "bg-gradient-to-r from-yellow-50 to-transparent border-l-4 border-yellow-400";
    if (index === 1) return "bg-gradient-to-r from-slate-50 to-transparent border-l-4 border-slate-300";
    if (index === 2) return "bg-gradient-to-r from-amber-50 to-transparent border-l-4 border-amber-500";
    return "hover:bg-gray-50 border-l-4 border-transparent";
  };

  const getProgressBarColor = () => {
    if (activeTab === "auth") return "bg-blue-200/50";
    if (activeTab === "chat") return "bg-indigo-200/50";
    return "bg-emerald-200/50";
  };

  return (
    <Card className="shadow-sm border-none flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-gray-50 pb-4">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <div className="space-y-3">
          {data.items.map((item, index) => {
             const percentage = Math.round((item.score / maxScore) * 100);
             return (
              <div
                key={item.id}
                className={`relative overflow-hidden flex items-center justify-between p-3 rounded-xl transition-all group ${getRankBg(index)}`}
              >
                {/* Progress Bar Background */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 ${getProgressBarColor()} opacity-30 rounded-r-xl transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-white shadow-sm' : ''}`}>
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">{item.subText}</p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-lg font-extrabold text-gray-800">
                    {item.score.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    {activeTab === "music"
                      ? "Lượt nghe"
                      : activeTab === "chat"
                        ? "Tin nhắn"
                        : "Tài khoản"}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
