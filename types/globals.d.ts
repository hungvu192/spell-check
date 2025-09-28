
import { Change } from 'diff';
import * as OriginalDocx from 'docx';

declare global {
  interface Window {
    mammoth: {
      extractRawText(options: { arrayBuffer: ArrayBuffer }): Promise<{ value: string }>;
    };
    Diff: {
      diffWords(oldStr: string, newStr: string): Change[];
    };
    docx: typeof OriginalDocx;
  }
}
