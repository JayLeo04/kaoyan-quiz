import Link from "next/link";
import { subjectCatalog } from "@/app/data/catalog";

export type SignedInUser = { displayName: string; email: string };
export type AuthView = {
  user: SignedInUser | null;
  signInPath: string;
  signOutPath: string;
};

export function AppHeader({ completedCount, auth }: { completedCount: number; auth: AuthView }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-brand" aria-label="研刷 408 首页">
          <span>研</span>
          <strong>研刷 408</strong>
        </Link>
        <nav aria-label="科目导航">
          {subjectCatalog.map((subject) => <Link key={subject.id} href={`/subject/${subject.id}`}><span>{subject.index}</span>{subject.shortName}</Link>)}
        </nav>
        <div className="header-account">
          <div className="header-progress"><span>已完成</span><b>{completedCount}</b><span>题</span></div>
          {auth.user ? <div className="signed-in-user"><span>{auth.user.displayName}</span><a href={auth.signOutPath}>退出</a></div> : <a className="sign-in-link" href={auth.signInPath}>登录 / 注册</a>}
        </div>
      </div>
    </header>
  );
}
