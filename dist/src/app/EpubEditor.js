"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("src/shared/utils/assert");
const Chapters_1 = require("src/app/Chapters");
const Zip_1 = require("src/shared/utils/Zip");
const NoteLinks_1 = require("src/app/NoteLinks");
const NextParagraph_1 = require("src/app/NextParagraph");
const perf_hooks_1 = require("perf_hooks");
class EpubEditor {
    constructor(path) {
        this.path = path;
        this.chapters = new Chapters_1.Chapters();
        this.noteLinks = new NoteLinks_1.NoteLinks(this.chapters);
        this.modifiedFiles = new Set();
    }
    async parse() {
        assert_1.assert(this.zip == null, 'parse() should be called only once');
        this.zip = new Zip_1.Zip(this.path);
        await this.chapters.parseFromZip(this.zip);
    }
    async save() {
        assert_1.assert(this.zip != null, 'save() should be called after parse()');
        if (this.modifiedFiles.size === 0)
            return;
        for (const path of this.modifiedFiles) {
            const chapter = this.chapters.getByFilePath(path);
            assert_1.assert(chapter != null);
            this.zip.updateFile(path, chapter.html());
        }
        await this.zip.writeZip();
        this.modifiedFiles.clear();
    }
    insertFootNote(noteLink) {
        const t1 = perf_hooks_1.performance.now();
        const note = this.noteLinks.findNote(noteLink.href);
        if (note == null)
            return;
        this.modifiedFiles.add(noteLink.noteLinkFile);
        const t2 = perf_hooks_1.performance.now();
        NextParagraph_1.insertNoteToNextParagraph(noteLink, `<strong>${noteLink.text}</strong>. ${note}`);
    }
}
exports.EpubEditor = EpubEditor;
function perfDiff(start) {
    const end = perf_hooks_1.performance.now();
    return Math.round(end - start);
}
//# sourceMappingURL=EpubEditor.js.map