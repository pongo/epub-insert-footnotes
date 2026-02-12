import { NoteLink } from 'src/app/NoteLink.js';
import { assert } from 'src/shared/utils/assert.js';
import { Chapters } from 'src/app/Chapters.js';
import { Zip } from 'src/shared/utils/Zip.js';
import { NoteLinks } from 'src/app/NoteLinks.js';
import { insertNoteToNextParagraph } from 'src/app/NextParagraph.js';
export class EpubEditor {
    path;
    chapters = new Chapters();
    noteLinks = new NoteLinks(this.chapters);
    modifiedFiles = new Set();
    zip;
    constructor(path) {
        this.path = path;
    }
    async parse() {
        assert(this.zip == null, 'parse() should be called only once');
        this.zip = new Zip(this.path);
        await this.chapters.parseFromZip(this.zip);
    }
    async save() {
        assert(this.zip != null, 'save() should be called after parse()');
        if (this.modifiedFiles.size === 0)
            return;
        for (const path of this.modifiedFiles) {
            const chapter = this.chapters.getByFilePath(path);
            assert(chapter != null);
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
        insertNoteToNextParagraph(noteLink, `<strong>${noteLink.text}</strong>. ${note}`);
    }
}
//# sourceMappingURL=EpubEditor.js.map