"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpubEditor = void 0;
const assert_1 = require("src/shared/utils/assert");
const Chapters_1 = require("src/app/Chapters");
const Zip_1 = require("src/shared/utils/Zip");
const NoteLinks_1 = require("src/app/NoteLinks");
const NextParagraph_1 = require("src/app/NextParagraph");
class EpubEditor {
    path;
    chapters = new Chapters_1.Chapters();
    noteLinks = new NoteLinks_1.NoteLinks(this.chapters);
    modifiedFiles = new Set();
    zip;
    constructor(path) {
        this.path = path;
    }
    async parse() {
        (0, assert_1.assert)(this.zip == null, 'parse() should be called only once');
        this.zip = new Zip_1.Zip(this.path);
        await this.chapters.parseFromZip(this.zip);
    }
    async save() {
        (0, assert_1.assert)(this.zip != null, 'save() should be called after parse()');
        if (this.modifiedFiles.size === 0)
            return;
        for (const path of this.modifiedFiles) {
            const chapter = this.chapters.getByFilePath(path);
            (0, assert_1.assert)(chapter != null);
            this.zip.updateFile(path, chapter.html());
        }
        await this.zip.writeZip();
        this.modifiedFiles.clear();
    }
    insertFootNote(noteLink) {
        const note = this.noteLinks.findNote(noteLink.href);
        if (note == null)
            return;
        this.modifiedFiles.add(noteLink.noteLinkFile);
        (0, NextParagraph_1.insertNoteToNextParagraph)(noteLink, `<strong>${noteLink.text}</strong>. ${note}`);
    }
}
exports.EpubEditor = EpubEditor;
//# sourceMappingURL=EpubEditor.js.map