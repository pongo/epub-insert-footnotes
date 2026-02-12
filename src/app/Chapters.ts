import { Chapter } from 'src/app/Chapter.js';
import type { ChapterFileName, ChapterFilePath } from 'src/app/types.js';
import { Zip } from 'src/shared/utils/Zip.js';

export class Chapters {
  readonly chaptersByFileName: Map<ChapterFileName, Chapter> = new Map();
  readonly chaptersByFilePath: Map<ChapterFilePath, Chapter> = new Map();

  async parseFromZip(zip: Zip) {
    const reFile = /\.x?html?$/i;
    const chaptersFiles = zip.files.filter((e) => reFile.test(e.path));
    for (const file of chaptersFiles) {
      const content = await file.getText();
      const chapter = new Chapter(file.path, content);
      this.chaptersByFileName.set(chapter.fileName, chapter);
      this.chaptersByFilePath.set(chapter.filePath, chapter);
    }
  }

  values() {
    return this.chaptersByFilePath.values();
  }

  getByFileName(name: string) {
    return this.chaptersByFileName.get(name as ChapterFileName);
  }

  getByFilePath(path: string) {
    return this.chaptersByFilePath.get(path as ChapterFilePath);
  }
}
