import { NoteLink } from 'src/app/NoteLink.js';
class NextParagraph {
    noteLink;
    inside = false;
    insertMode = 'after';
    constructor(noteLink) {
        this.noteLink = noteLink;
    }
    insert(text) {
        const $p = this.selectNextParagraph();
        const tag = this.inside ? 'span' : undefined;
        const code = aside(text, tag);
        if (this.insertMode === 'append')
            $p.append(code);
        else if (this.insertMode === 'before')
            $p.before(code);
        else
            $p.after(code);
    }
    selectNextParagraph() {
        return this.checkNextAsides(this.findP());
    }
    checkNextAsides($p) {
        if ($p.next('.zz07-footnote').length > 0) {
            const $nextAsides = $p.nextAll('.zz07-footnote');
            if ($nextAsides.length > 0) {
                this.insertMode = 'after';
                return $nextAsides.last();
            }
        }
        return $p;
    }
    findP() {
        const $el = this.noteLink.$a.parents('p, li, h1, h2, h3, h4, h5, h6, h7, h8, table, figure');
        if ($el.length === 0) {
            throw Error(`$a parent not found: [${this.noteLink.href}](${this.noteLink.noteLinkFile})`);
        }
        if ($el.find('br').length >= 2) {
            this.inside = true;
            this.insertMode = 'before';
            return $el.find('br').first();
        }
        if ($el[0].tagName.toLowerCase() === 'li') {
            this.insertMode = 'append';
        }
        return $el;
    }
}
function aside(text, tag = 'div') {
    const style = `text-indent: 0; border-top: 0px solid #ccc; border-bottom: 0px solid #ccc; margin: 0.5em 0; padding: 0.5em; background-color: #EFEBE9; color: #000; display: block;`;
    return `<${tag} class="zz07-footnote" style="${style}">${text}</${tag}>`;
}
export function insertNoteToNextParagraph(noteLink, text) {
    new NextParagraph(noteLink).insert(text);
}
//# sourceMappingURL=NextParagraph.js.map