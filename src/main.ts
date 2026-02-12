/* eslint-disable import/first,@typescript-eslint/no-var-requires */
require('module-alias')({ base: process.cwd() }); // tslint:disable-line

import fs from 'fs';
import path from 'path';
import { EpubEditor } from 'src/app/EpubEditor';
import { performance } from 'perf_hooks';

const workDir = 'C:\\temp\\epubs\\';

async function main() {
  const files = fs.readdirSync(workDir);
  for (const file of files) {
    const fullPath = path.join(workDir, file);
    const pathResult = path.parse(file);

    if (pathResult.ext !== '.epub') continue;
    if (file.includes('.footnotes.epub')) continue;

    const dest = path.join(workDir, `${pathResult.name}.footnotes.epub`);
    fs.copyFileSync(fullPath, dest);

    const start = performance.now();
    const notesCount = await editFile(dest);
    console.log(`[${notesCount} notes, ${perfDiff(start)} ms] ${file}`);
  }
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
