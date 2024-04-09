
export interface Rectangles {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }

export interface ClickPoint {
    x: number;
    y: number;
  }

export interface DetermineClickPointOptions {
    rectangles: Rectangles;
  }

export interface OcrServiceConfig {
    ocrImagesPath?: string;
    ocrLanguage?: string;
  }

export interface WaitForTextDisplayedOptions {
    element?: WebdriverIO.Element|ChainablePromiseElement;
    timeout?: number;
    timeoutMsg?: string;
  }

export interface SetValueOptions {
    element?: WebdriverIO.Element|ChainablePromiseElement;
    clickDuration?: Number;
  }

export interface ClickOnTextOptions {
    element?: WebdriverIO.Element|ChainablePromiseElement;
    clickDuration?: Number;
  }

export interface GetTextOptions {
    element?: WebdriverIO.Element|ChainablePromiseElement;
  }

export interface ElementPositionByText {
    element?: WebdriverIO.Element|ChainablePromiseElement;
  }

export interface Line {
    text: string;
    bbox: Rectangles;
  }

export interface Words {
    text: string;
    bbox: Rectangles;
    wc: number;
  }

export interface GetOcrData {
    text: string;
    lines: Line[];
    words: Words[];
  }

export interface OcrGetDataOptions {
    element?: WebdriverIO.Element|ChainablePromiseElement;
    isTesseractAvailable: boolean;
    language: string;
    ocrImagesPath: string;
  }

export interface OcrGetData extends GetOcrData {
    dpr: number;
  }

export type UnprocessedWord = {
    _: string;
    $: {
        title: string;
    };
}

export type UnprocessedLine ={
    span?: UnprocessedWord[];
}

export type GetOcrDataOptions = {
    filePath: string;
    language: string;
}

export type UnprocessedParagraph = {
    span?: UnprocessedLine[];
}
export type UnprocessedBlock = {
     p?: UnprocessedParagraph[];
}

export type LineData = {
    text: string;
    bbox: Rectangles;
}

export type UnprocessedSystemStringElement = {
    $: {
        CONTENT: string;
        HPOS: string;
        VPOS: string;
        WIDTH: string;
        HEIGHT: string;
        WC: string;
    };
}

export type UnprocessedSystemTextLineElement = {
    $: {
        HPOS: string;
        VPOS: string;
        WIDTH: string;
        HEIGHT: string;
    };
    String: UnprocessedSystemStringElement[];
}

export type UnprocessedSystemTextBlockElement = {
    TextLine: UnprocessedSystemTextLineElement[];
}

export type UnprocessedSystemBlock = {
    TextBlock?: UnprocessedSystemTextBlockElement[];
}

export type RectReturn = {
    x: number;
    y: number;
    width: number;
    height: number;
}
