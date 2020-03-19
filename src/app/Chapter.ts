import { ChapterFileName, ChapterFilePath } from 'src/app/types';
import path from 'path';
import $ from 'cheerio';

export class Chapter {
  readonly fileName: ChapterFileName;
  readonly $: CheerioStatic;
  readonly closeBr: boolean;

  constructor(readonly filePath: ChapterFilePath, content: string) {
    this.fileName = path.basename(filePath) as ChapterFileName;
    this.$ = $.load(content, { decodeEntities: false, recognizeSelfClosing: true, xmlMode: true });
    this.closeBr = includesClosedBrs(content);
  }

  html(): string {
    let result = this.$.html();
    if (this.closeBr) {
      // noinspection CheckTagEmptyBody,HtmlExtraClosingTag
      result = result.replace(/<br\/>/ig, '<br></br>');
    }
    return result;
  }
}

function includesClosedBrs(content: string): boolean {
  return content.includes('</br>');
}
