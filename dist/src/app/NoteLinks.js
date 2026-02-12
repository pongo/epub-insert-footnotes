import { NoteLink } from 'src/app/NoteLink.js';
import { Chapters } from 'src/app/Chapters.js';
import $ from 'cheerio';
import escapeStringRegexp from 'escape-string-regexp';
import escape from 'escape-html';
export class NoteLinks {
    chapters;
    noteLinksStore = new Map();
    collected = false;
    constructor(chapters) {
        this.chapters = chapters;
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
                const $a = $(a);
                const href = $a.attr('href');
                if (href == null || href === '')
                    return;
                if (!NoteLink.isNoteLink($a))
                    return;
                const noteLink = new NoteLink($a, chapter.filePath, chapter.fileName);
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
        return escape(removeReturns(removeNoteNumber(noteLink)));
        function removeNoteNumber(noteLink_) {
            if (noteLink_.number === undefined)
                return origText;
            const reNoteRemove = new RegExp(`^(${noteLink_.number}|${escapeStringRegexp(noteLink_.text)})[\t\r\n. ]\\s*`, 'i');
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
//# sourceMappingURL=NoteLinks.js.map