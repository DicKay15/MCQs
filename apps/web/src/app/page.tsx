"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui";
import { getStats, getHistory, getActivity } from "@/lib/api";
import { ContributionGraph } from "@/components/ContributionGraph";
import { PerformanceGraph } from "@/components/PerformanceGraph";
import type { UserStats, QuizHistoryItem } from "@mcqs/shared";
import { SUBJECT_LABELS, DIFFICULTY_LABELS } from "@mcqs/shared";

interface ActivityDay {
  date: string;
  attempts: number;
  correct: number;
  total: number;
  accuracy: number;
}

export default function Home() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizHistoryItem[]>([]);
  const [activity, setActivity] = useState<ActivityDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, historyData, activityData] = await Promise.all([
          getStats(),
          getHistory({ limit: 10 }),
          getActivity(365),
        ]);
        setStats(statsData);
        setRecentQuizzes(historyData.quizzes);
        setActivity(activityData.activity);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalAttempts = stats?.overall.totalAttempts ?? 0;
  const totalQuestions = stats?.overall.totalQuestions ?? 0;
  const accuracy = stats?.overall.accuracy ?? 0;

  // Show only first 4 quizzes in grid
  const displayedQuizzes = recentQuizzes.slice(0, 4);
  const hasMoreQuizzes = recentQuizzes.length > 4;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header with New Quiz button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Track your UPSC preparation progress</p>
        </div>
        <Link
          href="/quiz/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_12px_rgba(0,102,255,0.15)]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Quiz
        </Link>
      </div>

      {/* Recent Quizzes - 2x2 Grid */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">Recent Quizzes</h2>
          {hasMoreQuizzes && (
            <Link href="/history" className="text-xs text-primary-500 hover:text-primary-600 font-medium">
              View all →
            </Link>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </Card>
            ))}
          </div>
        ) : displayedQuizzes.length === 0 ? (
          <Card className="p-4">
            <p className="text-gray-500 text-center text-sm">
              No quizzes yet. Create your first quiz!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedQuizzes.map((quiz) => (
              <Card key={quiz.id} className="p-4 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow">
                <Link href={`/quiz/${quiz.id}`} className="block">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {SUBJECT_LABELS[quiz.subject as keyof typeof SUBJECT_LABELS]}
                        {quiz.theme && ` - ${quiz.theme}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {quiz.questionCount} questions &middot;{" "}
                        {DIFFICULTY_LABELS[quiz.difficulty as keyof typeof DIFFICULTY_LABELS]}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      {quiz.score !== undefined && quiz.attemptStatus === "completed" ? (
                        <p className="text-base font-semibold text-primary-600">
                          {quiz.score}/{quiz.questionCount}
                        </p>
                      ) : quiz.attemptStatus === "in_progress" ? (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Activity + Quick Stats Row */}
      <div className="flex gap-6 mb-6">
        {/* Activity Graph - Fits content */}
        <Card className="p-4 flex-shrink-0">
          <CardTitle className="text-base">Activity</CardTitle>
          <p className="text-xs text-gray-500 mb-3">
            Last 3 months. Darker = higher accuracy.
          </p>
          {loading ? (
            <div className="h-[140px] flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <ContributionGraph activity={activity} />
          )}
        </Card>

        {/* Quick Stats - Takes remaining space */}
        <Card className="flex-1">
          <CardTitle className="text-base">Quick Stats</CardTitle>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
            <div>
              <p className="text-xs text-gray-500">Quizzes Taken</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : totalAttempts}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Average Score</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : totalAttempts > 0 ? `${Math.round(accuracy)}%` : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Questions Answered</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : totalQuestions}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Correct Answers</p>
              <p className="text-2xl font-semibold text-primary-600">
                {loading ? "..." : stats?.overall.totalCorrect ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Wrong Answers</p>
              <p className="text-2xl font-semibold text-red-500">
                {loading ? "..." : totalQuestions - (stats?.overall.totalCorrect ?? 0)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">This Week</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loading ? "..." : (() => {
                  const now = new Date();
                  const weekAgo = new Date(now);
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  const weekActivity = activity.filter(a => new Date(a.date) >= weekAgo);
                  return weekActivity.reduce((sum, a) => sum + a.total, 0);
                })()}
                <span className="text-xs font-normal text-gray-500 ml-1">questions</span>
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Graph */}
      <Card>
        <CardTitle className="text-base">Performance</CardTitle>
        <p className="text-xs text-gray-500 mb-4">
          Cumulative correct vs wrong answers over time.
        </p>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <PerformanceGraph activity={activity} />
        )}
      </Card>
    </div>
  );
}
