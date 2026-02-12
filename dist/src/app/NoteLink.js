import { assert } from 'src/shared/utils/assert.js';
const reNoteTitle = /^\s*[{[(]*\s*(\d+|\*)\s*[}\])]*\s*$/i;
export class NoteLink {
    $a;
    noteLinkFile;
    href;
    id;
    text;
    number;
    constructor($a, noteLinkFile, noteLinkFileName) {
        this.$a = $a;
        this.noteLinkFile = noteLinkFile;
        assert(NoteLink.isNoteLink($a));
        const href = $a.attr('href');
        assert(href != null);
        this.href = prependFileName(href, noteLinkFileName);
        this.id = $a.attr('id');
        this.text = $a.text();
        this.number = parseNoteNumber(this.text);
    }
    static isNoteLink($a) {
        if (!isLooksLikeNote($a.text()))
            return false;
        const href = $a.attr('href') ?? '';
        if (href.trim().length === 0)
            return false;
        if (href.includes('backlink'))
            return false;
        if (isItUrl(href))
            return false;
        return true;
    }
}
function prependFileName(href, fileName) {
    if (href.startsWith('#'))
        return `${fileName}${href}`;
    return href;
}
export function isLooksLikeNote(text) {
    return reNoteTitle.test(text);
}
export function isItUrl(text) {
    return /:\/\//i.test(text);
}
export function parseNoteNumber(text) {
    const found = reNoteTitle.exec(text);
    if (found == null)
        return undefined;
    return parseInt(found[1], 10);
}
//# sourceMappingURL=NoteLink.js.map