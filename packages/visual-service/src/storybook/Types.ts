import type { Folders } from 'webdriver-image-comparison'

export interface StorybookData {
    id: string;
    title: string;
    name: string;
    importPath: string;
    tags: string[];
    storiesImports?: string[];
    type?: 'docs' | 'story';
    kind?: string;
    story?: string;
    parameters?: {
        __id: string;
        docsOnly: boolean;
        fileName: string;
    };
}

export interface IndexRes {
    v: number;
    entries: { [key: string]: StorybookData };
}

export interface StoriesRes {
    v: number;
    stories: { [key: string]: StorybookData };
}

export type Stories = { [key: string]: StorybookData };

export type CreateTestFileOptions = {
    clip: boolean;
    clipSelector: string;
    directoryPath: string,
    folders: Folders,
    framework: string,
    numShards:number,
    skipStories: string[] | RegExp,
    storiesJson: StorybookData[],
    storybookUrl: string;
}

export interface CapabilityMap {
    chrome: WebdriverIO.Capabilities;
    firefox: WebdriverIO.Capabilities;
    safari: WebdriverIO.Capabilities;
    edge: WebdriverIO.Capabilities;
}

export type CreateTestContent = {
    clip: boolean;
    clipSelector: string;
    folders: Folders;
    framework: string;
    skipStories: string[] | RegExp;
    stories: StorybookData[];
    storybookUrl: string;
}

export type CreateItContent = {
    clip: boolean;
    clipSelector: string;
    folders: Folders;
    framework: string;
    skipStories: string[] | RegExp;
    storyData: StorybookData;
    storybookUrl: string;
}

export type CategoryComponent = { category: string, component: string }

export type ScanStorybookReturnData = { storiesJson: StorybookData[]; storybookUrl: string; tempDir: string}

export type EmulatedDeviceType = {
    name: string,
    screen: {
        dpr: number,
        width: number,
        height: number
    },
    userAgent: string
}

export type WaitForStorybookComponentToBeLoaded = {
    clipSelector?: string,
    id: string;
    timeout?: number,
    url?: string;
}
