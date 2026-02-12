"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias')({ base: process.cwd() });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const EpubEditor_1 = require("src/app/EpubEditor");
const perf_hooks_1 = require("perf_hooks");
const workDir = 'C:\\temp\\epubs\\';
async function main() {
    const files = fs_1.default.readdirSync(workDir);
    for (const file of files) {
        const fullPath = path_1.default.join(workDir, file);
        const pathResult = path_1.default.parse(file);
        if (pathResult.ext !== '.epub')
            continue;
        if (file.includes('.footnotes.epub'))
            continue;
        const dest = path_1.default.join(workDir, `${pathResult.name}.footnotes.epub`);
        fs_1.default.copyFileSync(fullPath, dest);
        const start = perf_hooks_1.performance.now();
        const notesCount = await editFile(dest);
        console.log(`[${notesCount} notes, ${perfDiff(start)} ms] ${file}`);
    }
}
async function editFile(dest) {
    const epub = new EpubEditor_1.EpubEditor(dest);
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
    const end = perf_hooks_1.performance.now();
    return Math.round(end - start);
}
main()
    .then(() => console.log('done'))
    .catch(console.error);
//# sourceMappingURL=main.js.map