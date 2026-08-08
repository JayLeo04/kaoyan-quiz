import Link from "@/app/components/SiteLink";
import { AppHeader } from "@/app/components/AppHeader";
import { textbookCatalog } from "@/app/data/textbook-registry";
import { textbookHref, textbookPracticeHref } from "@/app/data/textbook-routes";

export function TextbookShelf({ unavailableBookSlug }: { unavailableBookSlug?: string }) {
  return (
    <div className="textbook-viewport textbook-shelf-viewport">
      <AppHeader completedCount={0} />
      <main className="textbook-shelf-main shell-width">
        <header className="textbook-shelf-hero">
          <Link href="/" className="back-link">← 408 首页</Link>
          <p>TEXTBOOK LIBRARY</p>
          <h1>教材资料库</h1>
          <span>每本教材拥有独立的正文、图片、习题、答案来源和学习进度。</span>
        </header>

        {unavailableBookSlug ? <p className="textbook-shelf-notice">未找到“{unavailableBookSlug}”；可从已收录教材继续学习。</p> : null}

        <section className="textbook-shelf-grid" aria-label="已收录教材">
          {textbookCatalog.map((textbook, index) => {
            const hasPractice = textbook.dataset.stats.exerciseQuestions > 0;
            return <article className="textbook-shelf-card" key={textbook.slug}>
              <div className="textbook-shelf-card-top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>已收录</b>
              </div>
              <p>{textbook.presentation.eyebrow}</p>
              <h2>{textbook.dataset.book.title}</h2>
              <strong>{textbook.presentation.edition}</strong>
              <small>{textbook.presentation.description}</small>
              <div className="textbook-shelf-stats">
                <span>{textbook.dataset.stats.knowledgePages} 篇正文</span>
                <span>{textbook.dataset.stats.exerciseQuestions} 道习题</span>
              </div>
              <footer>
                <Link href={textbookHref(textbook)}>阅读教材 <b>→</b></Link>
                {hasPractice ? <Link href={textbookPracticeHref(textbook)}>刷题</Link> : <span className="textbook-shelf-no-practice">正文已导入</span>}
              </footer>
            </article>
          })}
        </section>

        <p className="textbook-shelf-footnote">后续教材只需注册独立数据集与素材命名空间，即可自动使用同一套阅读与刷题页面。</p>
      </main>
    </div>
  );
}
