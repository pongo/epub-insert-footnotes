"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapters = void 0;
const Chapter_1 = require("src/app/Chapter");
class Chapters {
    chaptersByFileName = new Map();
    chaptersByFilePath = new Map();
    async parseFromZip(zip) {
        const reFile = /\.x?html?$/i;
        const chaptersFiles = zip.files.filter(e => reFile.test(e.path));
        for (const file of chaptersFiles) {
            const content = await file.getText();
            const chapter = new Chapter_1.Chapter(file.path, content);
            this.chaptersByFileName.set(chapter.fileName, chapter);
            this.chaptersByFilePath.set(chapter.filePath, chapter);
        }
    }
    values() {
        return this.chaptersByFilePath.values();
    }
    getByFileName(name) {
        return this.chaptersByFileName.get(name);
    }
    getByFilePath(path) {
        return this.chaptersByFilePath.get(path);
    }
}
exports.Chapters = Chapters;
//# sourceMappingURL=Chapters.js.map