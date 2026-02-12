"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteLink = void 0;
exports.isLooksLikeNote = isLooksLikeNote;
exports.isItUrl = isItUrl;
exports.parseNoteNumber = parseNoteNumber;
const assert_1 = require("src/shared/utils/assert");
const reNoteTitle = /^\s*[{[(]*\s*(\d+|\*)\s*[}\])]*\s*$/i;
class NoteLink {
    $a;
    noteLinkFile;
    href;
    id;
    text;
    number;
    constructor($a, noteLinkFile, noteLinkFileName) {
        this.$a = $a;
        this.noteLinkFile = noteLinkFile;
        (0, assert_1.assert)(NoteLink.isNoteLink($a));
        const href = $a.attr('href');
        (0, assert_1.assert)(href != null);
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
exports.NoteLink = NoteLink;
function prependFileName(href, fileName) {
    if (href.startsWith('#'))
        return `${fileName}${href}`;
    return href;
}
function isLooksLikeNote(text) {
    return reNoteTitle.test(text);
}
function isItUrl(text) {
    return /:\/\//i.test(text);
}
function parseNoteNumber(text) {
    const found = reNoteTitle.exec(text);
    if (found == null)
        return undefined;
    return parseInt(found[1], 10);
}
//# sourceMappingURL=NoteLink.js.map