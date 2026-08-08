type TextbookRouteTarget = string | { slug: string };

function cleanPathPart(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function routeBookSlug(target: TextbookRouteTarget) {
  return typeof target === "string" ? target : target.slug;
}

export function textbookHref(target: TextbookRouteTarget, pageSlug = "") {
  const bookSlug = routeBookSlug(target);
  const suffix = cleanPathPart(pageSlug);
  return suffix ? `/textbook/${bookSlug}/${suffix}` : `/textbook/${bookSlug}`;
}

export function textbookCondensedHref(target: TextbookRouteTarget, pageSlug: string) {
  return `${textbookHref(target, pageSlug)}?mode=condensed`;
}

export function textbookPracticeHref(target: TextbookRouteTarget, chapterId?: string) {
  const base = `${textbookHref(target)}/practice`;
  return chapterId ? `${base}?chapter=${encodeURIComponent(chapterId)}` : base;
}

export function textbookQuestionHref(target: TextbookRouteTarget, questionId: string) {
  return `${textbookPracticeHref(target)}/${encodeURIComponent(questionId)}`;
}
