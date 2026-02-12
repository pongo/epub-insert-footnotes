import fs from 'fs';
import path from 'path';
import { EpubEditor } from 'src/app/EpubEditor.js';
import { performance } from 'perf_hooks';
const workDir = 'C:\\temp\\epubs\\';
async function main() {
    const files = fs.readdirSync(workDir);
    for (const file of files) {
        const fullPath = path.join(workDir, file);
        const pathResult = path.parse(file);
        if (pathResult.ext !== '.epub')
            continue;
        if (file.includes('.footnotes.epub'))
            continue;
        const dest = path.join(workDir, `${pathResult.name}.footnotes.epub`);
        fs.copyFileSync(fullPath, dest);
        const start = performance.now();
        const notesCount = await editFile(dest);
        console.log(`[${notesCount} notes, ${perfDiff(start)} ms] ${file}`);
    }
}
async function editFile(dest) {
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
function perfDiff(start) {
    const end = performance.now();
    return Math.round(end - start);
}
main()
    .then(() => console.log('done'))
    .catch(console.error);
//# sourceMappingURL=main.js.map