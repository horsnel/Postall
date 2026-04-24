'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { sampleAchievements, achievementIcons, type Achievement } from '@/components/achievements/achievement-badge'
import {
  Trophy,
  Flame,
  Lock,
  CheckCircle2,
  Sparkles,
  Calendar,
  Star,
} from 'lucide-react'

export default function AchievementsPage() {
  const { user } = useAuthStore()

  const unlockedCount = sampleAchievements.filter(a => a.unlocked).length
  const totalCount = sampleAchievements.length

  // Simulate login streak
  const [streakDays] = useState(3)
  const maxStreak = 7

  const getIconColor = (achievement: Achievement) => {
    if (achievement.unlocked) return 'text-emerald-600'
    return 'text-muted-foreground/50'
  }

  const getBgColor = (achievement: Achievement) => {
    if (achievement.unlocked) return 'bg-emerald-100'
    return 'bg-muted/50'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-600" />
          Achievements
        </h1>
        <p className="text-muted-foreground">
          Track your progress and unlock rewards on PostAll.
        </p>
      </div>

      {/* Daily Login Streak */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-teal-50/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200/50">
              <Flame className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-emerald-900">Daily Login Streak</h3>
                <Badge className="bg-emerald-600 text-white text-xs">Day {streakDays} of {maxStreak}</Badge>
              </div>
              <p className="text-sm text-emerald-700 mb-2">Log in every day to keep your streak going!</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-emerald-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${(streakDays / maxStreak) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-emerald-700 shrink-0">{streakDays}/{maxStreak}</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: maxStreak }).map((_, i) => (
                <div
                  key={i}
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i < streakDays
                      ? 'bg-emerald-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Progress */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-200/50">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold">{unlockedCount}/{totalCount} Achievements Unlocked</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Keep completing tasks to unlock more achievements!</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-amber-600 shrink-0">{Math.round((unlockedCount / totalCount) * 100)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleAchievements.map((achievement) => {
          const IconComponent = achievementIcons[achievement.icon] || Star

          return (
            <Card
              key={achievement.id}
              className={`relative overflow-hidden transition-all ${
                achievement.unlocked
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 hover:shadow-lg hover:shadow-emerald-100/50'
                  : 'opacity-70 hover:opacity-90'
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full" />
              )}
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`relative h-12 w-12 rounded-xl ${getBgColor(achievement)} flex items-center justify-center shrink-0 ${achievement.unlocked ? 'shadow-md' : ''}`}>
                    <IconComponent className={`h-6 w-6 ${getIconColor(achievement)}`} />
                    {achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {!achievement.unlocked && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                        <Lock className="h-2.5 w-2.5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{achievement.description}</p>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <p className="text-[10px] text-emerald-600 mt-1.5 flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5" />
                        {achievement.unlockedAt}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar for incomplete achievements */}
                {!achievement.unlocked && achievement.progress !== undefined && achievement.progress > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-muted-foreground">Progress</span>
                      <span className="text-[10px] font-semibold text-amber-600">{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Unlocked glow effect */}
                {achievement.unlocked && (
                  <div className="mt-3 pt-3 border-t border-emerald-100">
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                      <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                      Unlocked
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tips */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Tips to Unlock Achievements</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Log in daily to build your streak and earn daily bonuses.</li>
                <li>Post listings and complete transactions to earn seller badges.</li>
                <li>Respond quickly to messages for the Quick Draw achievement.</li>
                <li>Invite friends via your referral link for the Referral King badge.</li>
                <li>Complete ID verification to unlock the Verified Pro achievement.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
