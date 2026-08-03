import Link from "@/app/components/SiteLink";
import { subjectCatalog } from "@/app/data/catalog";

export function AppHeader({ completedCount }: { completedCount: number }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-brand" aria-label="研刷 408 首页">
          <span>研</span>
          <strong>研刷 408</strong>
        </Link>
        <nav aria-label="科目导航">
          {subjectCatalog.map((subject) => <Link key={subject.id} href={`/subject/${subject.id}`}><span>{subject.index}</span>{subject.shortName}</Link>)}
          <Link href="/textbook"><span>教</span>教材</Link>
        </nav>
        <div className="header-account">
          <div className="header-progress"><span>已完成</span><b>{completedCount}</b><span>题</span></div>
          <Link className="local-profile-link" href="/profile" aria-label="打开本地资料库">
            <span aria-hidden="true">我</span>
            <strong>本地资料</strong>
          </Link>
        </div>
      </div>
    </header>
  );
}
