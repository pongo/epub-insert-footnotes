"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const path_1 = __importDefault(require("path"));
const cheerio_1 = __importDefault(require("cheerio"));
class Chapter {
    filePath;
    fileName;
    $;
    closeBr;
    constructor(filePath, content) {
        this.filePath = filePath;
        this.fileName = path_1.default.basename(filePath);
        this.$ = cheerio_1.default.load(content, { decodeEntities: false, recognizeSelfClosing: true, xmlMode: true });
        this.closeBr = includesClosedBrs(content);
    }
    html() {
        let result = this.$.html();
        if (this.closeBr) {
            result = result.replace(/<br\/>/ig, '<br></br>');
        }
        return result;
    }
}
exports.Chapter = Chapter;
function includesClosedBrs(content) {
    return content.includes('</br>');
}
//# sourceMappingURL=Chapter.js.map