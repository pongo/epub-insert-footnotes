/* eslint-disable import/first,@typescript-eslint/no-var-requires */
require('module-alias')({ base: process.cwd() }); // tslint:disable-line

import fs from 'fs';
import path from 'path';
import { EpubEditor } from 'src/app/EpubEditor';

const workDir = 'C:\\Temp\\';

async function main() {
  const files = fs.readdirSync(workDir);
  for (const file of files) {
    const fullPath = path.join(workDir, file);
    const pathResult = path.parse(file);

    if (pathResult.ext !== '.epub') continue;
    if (file.includes('.footnotes.epub')) continue;

    const dest = path.join(workDir, `${pathResult.name}.footnotes.epub`);
    fs.copyFileSync(fullPath, dest);

    const notesCount = await editFile(dest);
    console.log(`[${notesCount}] ${file}`);
  }
}

async function editFile(dest: string): Promise<number> {
  const epub = new EpubEditor(dest);
  await epub.parse();

  let count = 0;
  for (const noteLink of epub.noteLinks.values()) {
    epub.insertFootNote(noteLink);
    count++;
  }

  await epub.save();
  return count;
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
