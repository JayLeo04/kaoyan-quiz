import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const bookRoot = path.join(projectRoot, "source-materials", "data-structures-yan-weimin-exercises");
const apply = process.argv.includes("--apply");
const residualDirectories = [
  "part-1-questions/12-file/review",
  "part-2-practice/practice-5/__page_review",
  "part-3-answers/__page_review",
  "part-3-answers/work",
  "tmp",
  "work",
  "01-introduction",
];
const residualFiles = [
  "luna-audit-part1.json",
  "luna-audit-part2.json",
  "luna-audit-part3.json",
  "part-3-answers/luna-audit.json",
  "part-3-answers/review.json",
];

function inside(root, target) {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(target);
  return resolvedTarget === resolvedRoot || resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`);
}

function walkFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile()) result.push(target);
    }
  };
  visit(directory);
  return result;
}

function walkDirectories(directory) {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  const visit = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const target = path.join(current, entry.name);
      visit(target);
      result.push(target);
    }
  };
  visit(directory);
  result.push(directory);
  return result;
}

const directories = residualDirectories.map((relative) => path.resolve(bookRoot, ...relative.split("/"))).filter(fs.existsSync);
const files = new Set(residualFiles.map((relative) => path.resolve(bookRoot, ...relative.split("/"))).filter(fs.existsSync));
for (const directory of directories) for (const file of walkFiles(directory)) files.add(file);

const questionFragmentRoot = path.join(bookRoot, "part-1-questions", "06-tree-and-binary-tree");
const answerFragmentRoot = path.join(bookRoot, "part-3-answers", "06-tree-and-binary-tree");
for (const file of fs.readdirSync(questionFragmentRoot)) if (/^question-.*\.md$/i.test(file)) files.add(path.join(questionFragmentRoot, file));
for (const file of fs.readdirSync(answerFragmentRoot)) if (/^answer-.*\.md$/i.test(file)) files.add(path.join(answerFragmentRoot, file));

for (const target of [...directories, ...files]) {
  if (!inside(bookRoot, target) || target === bookRoot) throw new Error(`清理目标越界：${target}`);
}
const fileList = [...files].sort();
const bytes = fileList.reduce((total, file) => total + fs.statSync(file).size, 0);
console.log(JSON.stringify({ mode: apply ? "apply" : "dry-run", directories: directories.length, files: fileList.length, bytes }, null, 2));

if (!apply) process.exit(0);
for (const file of fileList) fs.rmSync(file);
const removableDirectories = directories.flatMap(walkDirectories).sort((left, right) => right.length - left.length);
for (const directory of removableDirectories) {
  if (fs.existsSync(directory) && fs.readdirSync(directory).length === 0) fs.rmdirSync(directory);
}
console.log(`已移除 ${fileList.length} 个历史拆分/审计文件，并清空 ${directories.length} 个残余目录。`);
