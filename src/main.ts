import fs from 'fs';
import path from 'path';
import { EpubEditor } from '#src/app/EpubEditor.js';
import { performance } from 'perf_hooks';

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.log('Usage: node --experimental-strip-types src/main.ts <path-to-epub>');
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  const pathResult = path.parse(filePath);
  if (pathResult.ext !== '.epub') {
    console.error(`Error: File must be an .epub file: ${filePath}`);
    process.exit(1);
  }

  const dest = path.join(pathResult.dir, `${pathResult.name}.footnotes.epub`);
  fs.copyFileSync(filePath, dest);

  const start = performance.now();
  const notesCount = await editFile(dest);
  console.log(`[${notesCount} notes, ${perfDiff(start)} ms] ${path.basename(filePath)}`);
}

async function editFile(dest: string): Promise<number> {
  const epub = new EpubEditor(dest);
  // const t2 = performance.now();
  await epub.parse();
  // console.log(`${perfDiff(t2)} ms | epub.parse()`);

  // const t3 = performance.now();
  let count = 0;
  for (const noteLink of epub.noteLinks.values()) {
    epub.insertFootNote(noteLink);
    count++;
  }
  // console.log(`${perfDiff(t3)} ms | epub.insertFootNote all`);

  // const t4 = performance.now();
  await epub.save();
  // console.log(`${perfDiff(t4)} ms | epub.save()`);
  return count;
}

function perfDiff(start: number): number {
  const end = performance.now();
  return Math.round(end - start);
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
