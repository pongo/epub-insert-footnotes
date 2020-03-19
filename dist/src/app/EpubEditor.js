"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("src/shared/utils/assert");
const Chapters_1 = require("src/app/Chapters");
const Zip_1 = require("src/shared/utils/Zip");
const NoteLinks_1 = require("src/app/NoteLinks");
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
        const note = this.noteLinks.findNote(noteLink.href);
        if (note == null)
            return;
        this.modifiedFiles.add(noteLink.noteLinkFile);
        insertAside(`<strong>${noteLink.text}</strong>. ${note}`);
        function insertAside(text) {
            const [$p, inside, insertMode] = selectNextParagraph(noteLink);
            const tag = inside ? 'span' : undefined;
            const code = aside(text, tag);
            if (insertMode === 'append')
                $p.append(code);
            else if (insertMode === 'before')
                $p.before(code);
            else
                $p.after(code);
        }
        function aside(text, tag = 'div') {
            const style = `text-indent: 0; border-top: 0px solid #ccc; border-bottom: 0px solid #ccc; margin: 0.5em 0; padding: 0.5em; background-color: #EFEBE9; color: #000; display: block;`;
            return `<${tag} class="zz07-footnote" style="${style}">${text}</${tag}>`;
        }
    }
}
exports.EpubEditor = EpubEditor;
function selectNextParagraph(noteLink) {
    let inside = false;
    let insertMode = 'after';
    const $p = findP();
    const $corrected = checkNextAsides();
    return [$corrected, inside, insertMode];
    function checkNextAsides() {
        const $nextAsides = $p.nextAll('.zz07-footnote');
        if ($nextAsides.length > 0) {
            insertMode = 'after';
            return $nextAsides.last();
        }
        return $p;
    }
    function findP() {
        const $el = noteLink.$a.parents('p, li, h1, h2, h3, h4, h5, h6, h7, h8, table, figure');
        if ($el.length === 0) {
            throw Error(`$a parent not found: [${noteLink.href}](${noteLink.noteLinkFile})`);
        }
        if ($el.find('br').length >= 2) {
            inside = true;
            insertMode = 'before';
            return $el.find('br').first();
        }
        if ($el[0].tagName.toLowerCase() === 'li') {
            insertMode = 'append';
        }
        return $el;
    }
}
//# sourceMappingURL=EpubEditor.js.map