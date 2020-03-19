"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NoteLink_1 = require("src/app/NoteLink");
const cheerio_1 = __importDefault(require("cheerio"));
const escape_string_regexp_1 = __importDefault(require("escape-string-regexp"));
const escape_html_1 = __importDefault(require("escape-html"));
class NoteLinks {
    constructor(chapters) {
        this.chapters = chapters;
        this.noteLinksStore = new Map();
        this.collected = false;
    }
    values() {
        if (!this.collected) {
            this.collectNoteLinks();
        }
        return this.noteLinksStore.values();
    }
    findNote(href) {
        if (!this.collected) {
            this.collectNoteLinks();
        }
        const $note = this.findNoteEl(href);
        if ($note == null)
            return undefined;
        return this.getNoteText(href, $note);
    }
    collectNoteLinks() {
        this.noteLinksStore.clear();
        this.collected = true;
        for (const chapter of this.chapters.values()) {
            chapter.$('a').each((_i, a) => {
                const $a = cheerio_1.default(a);
                const href = $a.attr('href');
                if (href == null || href === '')
                    return;
                if (!NoteLink_1.NoteLink.isNoteLink($a))
                    return;
                const noteLink = new NoteLink_1.NoteLink($a, chapter.filePath, chapter.fileName);
                if (this.isBacklink(noteLink.href))
                    return;
                this.noteLinksStore.set(noteLink.href, noteLink);
            });
        }
    }
    getNoteText(href, $note) {
        const origText = $note.text().trim();
        const noteLink = this.noteLinksStore.get(href);
        if (noteLink == null)
            return origText;
        return escape_html_1.default(removeReturns(removeNoteNumber(noteLink)));
        function removeNoteNumber(noteLink_) {
            const reNoteRemove = new RegExp(`^(${noteLink_.number}|${escape_string_regexp_1.default(noteLink_.text)})[\t\r\n. ]\\s*`, 'i');
            return origText.replace(reNoteRemove, '');
        }
        function removeReturns(text) {
            return text.replace(/Вернуться\s*$/, '');
        }
    }
    findNoteEl(href) {
        const [file, id] = correctHref().split('#');
        const chapter = this.chapters.getByFileName(file);
        if (chapter == null)
            return undefined;
        const $note = chapter.$(`#${id}`);
        if ($note.length === 0)
            return undefined;
        if ($note[0].tagName.toLowerCase() === 'a')
            return $note.parent();
        return $note;
        function correctHref() {
            return href.replace(/^.+\//i, '');
        }
    }
    isBacklink(href) {
        return this.findNoteEl(href) == null;
    }
}
exports.NoteLinks = NoteLinks;
//# sourceMappingURL=NoteLinks.js.map