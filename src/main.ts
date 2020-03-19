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

    const epub = new EpubEditor(dest);
    await epub.parse();
    let count = 0;
    for (const noteLink of epub.noteLinks.values()) {
      epub.insertFootNote(noteLink);
      count++;
    }
    await epub.save();

    console.log(`[${count}] ${file}`);
  }
}

main()
  .then(() => console.log('done'))
  .catch(console.error);
