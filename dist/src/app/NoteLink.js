"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("src/shared/utils/assert");
const reNoteTitle = /^\s*[{[(]*\s*(\d+)\s*[}\])]*\s*$/i;
class NoteLink {
    constructor($a, noteLinkFile, noteLinkFileName) {
        this.$a = $a;
        this.noteLinkFile = noteLinkFile;
        assert_1.assert(NoteLink.isNoteLink($a));
        const href = $a.attr('href');
        assert_1.assert(href != null);
        this.href = prependFileName(href, noteLinkFileName);
        this.id = $a.attr('id');
        this.text = $a.text();
        const noteNumber = parseNoteNumber(this.text);
        assert_1.assert(noteNumber != null);
        this.number = noteNumber;
    }
    static isNoteLink($a) {
        var _a;
        if (!isLooksLikeNote($a.text()))
            return false;
        const href = (_a = $a.attr('href'), (_a !== null && _a !== void 0 ? _a : ''));
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
exports.isLooksLikeNote = isLooksLikeNote;
function isItUrl(text) {
    return /:\/\//i.test(text);
}
exports.isItUrl = isItUrl;
function parseNoteNumber(text) {
    const found = reNoteTitle.exec(text);
    if (found == null)
        return undefined;
    return parseInt(found[1], 10);
}
exports.parseNoteNumber = parseNoteNumber;
//# sourceMappingURL=NoteLink.js.map