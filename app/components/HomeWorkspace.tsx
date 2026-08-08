"use client";

/* eslint-disable @next/next/no-img-element -- GitHub Pages serves the pre-compressed hero image directly. */

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import Link from "@/app/components/SiteLink";
import { subjectCatalog, type SubjectId } from "@/app/data/catalog";
import {
  EMPTY_PROGRESS,
  readLocalStudySnapshot,
  type PracticeProgress,
} from "@/app/lib/local-study-data";
import { siteAssetPath } from "@/app/lib/site-path";

export function HomeWorkspace({
  totalQuestions,
  questionIdsBySubject,
}: {
  totalQuestions: number;
  questionIdsBySubject: Record<SubjectId, string[]>;
}) {
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    // Browser-only learning progress is restored after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readLocalStudySnapshot().progress);
  }, []);

  const completedSet = useMemo(() => new Set(progress.completed), [progress.completed]);

  return (
    <div className="viewport-app home-viewport">
      <AppHeader completedCount={progress.completed.length} />
      <main className="home-main shell-width">
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-kicker">全国硕士研究生招生考试</p>
            <h1><strong>408</strong><span>真题</span></h1>
            <div className="home-hero-meta">
              <span>2009–2026</span>
              <span>{totalQuestions} 道真题</span>
              <span>4 门科目</span>
            </div>
            <p className="home-hero-description">按科目进入题库，每页只做一道题。<br />进度、错题、收藏与笔记都会保存在本机。</p>
            <Link className="home-primary-action" href="/question/real-2026-1">从 2026 真题开始<b>→</b></Link>
          </div>
          <div className="home-visual">
            <img
              src={siteAssetPath("/hero-408-minimal-v5.webp")}
              width={1536}
              height={1024}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt="栈与二叉树、CPU、操作系统窗口和网络路由器组成的 408 知识点形象"
            />
          </div>
        </section>
        <section className="home-subjects" aria-label="选择科目">
          {subjectCatalog.map((subject) => {
            const questionIds = questionIdsBySubject[subject.id];
            const completed = questionIds.reduce((count, id) => count + Number(completedSet.has(id)), 0);
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`} className={`home-subject-card accent-${subject.accent}`}>
                <div className="home-card-top"><span>{subject.index}</span><span>{completed} 已完成</span></div>
                <div className="home-card-title"><small>{subject.english}</small><h2>{subject.name}</h2></div>
                <div className="home-card-bottom">
                  <strong>{questionIds.length}<small> 题</small></strong>
                  <span>进入 →</span>
                </div>
                <div className="home-card-progress"><i style={{ width: `${questionIds.length ? completed / questionIds.length * 100 : 0}%` }} /></div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}
