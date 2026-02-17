import type { ChapterFileName, ChapterFilePath } from '#src/app/types.js';
import path from 'path';
import { load, type CheerioAPI } from 'cheerio';

export class Chapter {
  readonly fileName: ChapterFileName;
  readonly $: CheerioAPI;
  readonly closeBr: boolean;

  readonly filePath: ChapterFilePath;

  constructor(filePath: ChapterFilePath, content: string) {
    this.filePath = filePath;
    this.fileName = path.basename(filePath) as ChapterFileName;
    this.$ = load(content, {
      xml: { decodeEntities: false, recognizeSelfClosing: true, xmlMode: true },
    });
    this.closeBr = includesClosedBrs(content);
  }

  html(): string {
    let result = this.$.html();
    if (this.closeBr) {
      // noinspection CheckTagEmptyBody,HtmlExtraClosingTag
      result = result.replace(/<br\/>/gi, '<br></br>');
    }
    return result;
  }
}

function includesClosedBrs(content: string): boolean {
  return content.includes('</br>');
}
