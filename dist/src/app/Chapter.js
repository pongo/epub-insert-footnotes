import path from 'path';
import $ from 'cheerio';
export class Chapter {
    filePath;
    fileName;
    $;
    closeBr;
    constructor(filePath, content) {
        this.filePath = filePath;
        this.fileName = path.basename(filePath);
        this.$ = $.load(content, { decodeEntities: false, recognizeSelfClosing: true, xmlMode: true });
        this.closeBr = includesClosedBrs(content);
    }
    html() {
        let result = this.$.html();
        if (this.closeBr) {
            result = result.replace(/<br\/>/gi, '<br></br>');
        }
        return result;
    }
}
function includesClosedBrs(content) {
    return content.includes('</br>');
}
//# sourceMappingURL=Chapter.js.map