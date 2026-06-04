import re

with open('src/app/(app)/leaderboard/page.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    "import { IconTrophy, IconFlame, IconStar } from '@tabler/icons-react';",
    "import { IconTrophy, IconFlame, IconStar, IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react';\nimport { Skeleton, ListSkeleton } from '@/components/ui/Skeleton';"
)

code = code.replace(
    '<span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank2.name}</span>',
    '<span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank2.name}</span>\n            <span className="text-[10px] text-brand-success font-bold mt-0.5">+{rank2.weeklyXp || 0} XP this week</span>'
)

code = code.replace(
    '<span className="font-bold text-sm sm:text-base text-center px-1 w-full truncate">{rank1.name}</span>',
    '<span className="font-bold text-sm sm:text-base text-center px-1 w-full truncate">{rank1.name}</span>\n            <span className="text-xs text-brand-success font-bold mt-0.5">+{rank1.weeklyXp || 0} XP this week</span>'
)

code = code.replace(
    '<span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank3.name}</span>',
    '<span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank3.name}</span>\n            <span className="text-[10px] text-brand-success font-bold mt-0.5">+{rank3.weeklyXp || 0} XP this week</span>'
)

trend_icon_code = """
const TrendIcon = ({ trend }: { trend?: string }) => {
  if (trend === 'up') return <IconArrowUp size={16} className="text-brand-success" />;
  if (trend === 'down') return <IconArrowDown size={16} className="text-brand-danger" />;
  return <IconMinus size={16} className="text-brand-text-tertiary" />;
};
"""

code = code.replace('const LeaderboardTable = React.memo(({ others, activeTab }: { others: any[], activeTab: string }) => (', trend_icon_code + '\nconst LeaderboardTable = React.memo(({ others, activeTab }: { others: any[], activeTab: string }) => (')

code = code.replace(
    '<th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary text-right">XP</th>',
    '<th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary text-right">Weekly XP</th>\n              <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary text-right">Total XP</th>'
)

code = code.replace(
    '<td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-brand-text-secondary text-sm sm:text-base">#{user.rank}</td>',
    '<td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-brand-text-secondary text-sm sm:text-base">\n                  <div className="flex flex-col items-center gap-1">\n                    <span>#{user.rank}</span>\n                    <TrendIcon trend={user.trend} />\n                  </div>\n                </td>'
)

code = code.replace(
    '<td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-brand-primary text-sm sm:text-base">{user.xp.toLocaleString()}</td>',
    '<td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-brand-success text-sm sm:text-base\">+{user.weeklyXp?.toLocaleString() || 0}</td>\n                <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-brand-primary text-sm sm:text-base">{user.xp.toLocaleString()}</td>'
)

with open('src/app/(app)/leaderboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(code)
