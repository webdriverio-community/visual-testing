import { rmdirSync } from 'node:fs'
import logger from '@wdio/logger'
import { SevereServiceError } from 'webdriverio'
import type { Capabilities, Options } from '@wdio/types'
import type { ClassOptions } from 'webdriver-image-comparison'
import { BaseClass } from 'webdriver-image-comparison'
import {
    createStorybookCapabilities,
    createTestFiles,
    getArgvValue,
    isCucumberFramework,
    isStorybookMode,
    parseSkipStories,
    scanStorybook,
} from './storybook.utils.js'
import { CLIP_SELECTOR, NUM_SHARDS, V6_CLIP_SELECTOR } from './constants.js'

const log = logger('@wdio/visual-service')

export default class VisualLauncher extends BaseClass  {
    #options: ClassOptions

    constructor(options: ClassOptions) {
        super(options)
        this.#options = options
    }

    async onPrepare (
        config: Options.Testrunner,
        capabilities: Capabilities.RemoteCapabilities,
        // For testing purposes
        isStorybookModeFunc = isStorybookMode,
        isCucumberFrameworkFunc = isCucumberFramework,
        scanStorybookFunc = scanStorybook,
        getArgvValueFunc = getArgvValue,
        parseSkipStoriesFunc = parseSkipStories,
        createTestFilesFunc = createTestFiles,
        createStorybookCapabilitiesFunc = createStorybookCapabilities,
    ) {
        const isStorybook = isStorybookModeFunc()
        const framework = config.framework as string
        const isCucumber = isCucumberFrameworkFunc(framework)

        if (isCucumber && isStorybook) {
            throw new SevereServiceError('\n\nRunning Storybook in combination with the cucumber framework adapter is not supported.\nOnly Jasmine and Mocha are supported.\n\n')
        } else if (isStorybook) {
            log.info('Running `@wdio/visual-service` in Storybook mode.')

            const { storiesJson, storybookUrl, tempDir } = await scanStorybookFunc(config, log, this.#options)
            // Set an environment variable so it can be used in the onComplete hook
            process.env.VISUAL_STORYBOOK_TEMP_SPEC_FOLDER = tempDir

            // Determine some run options
            // --version
            const versionOption = this.#options?.storybook?.version
            const versionArgv = getArgvValueFunc('--version', value => Math.floor(parseFloat(value)))
            const version = versionOption ?? versionArgv ?? 7
            // --numShards
            const maxInstances = config?.maxInstances ?? 1
            const numShardsOption = this.#options?.storybook?.numShards
            const numShardsArgv = getArgvValueFunc('--numShards', value => parseInt(value, 10))
            const numShards =  Math.min(numShardsOption || numShardsArgv || NUM_SHARDS, maxInstances)
            // --clip
            const clipOption = this.#options?.storybook?.clip
            const clipArgv = getArgvValueFunc('--clip', value => value !== 'false')
            const clip = clipOption ?? clipArgv ?? true
            // --clipSelector
            const clipSelectorOption = this.#options?.storybook?.clipSelector
            const clipSelectorArgv = getArgvValueFunc('--clipSelector', value => value)
            // V6 has '#root' as the root element, V7 has '#storybook-root'
            const clipSelector = (clipSelectorOption ?? clipSelectorArgv) ?? (version === 6 ? V6_CLIP_SELECTOR : CLIP_SELECTOR)
            // --skipStories
            const skipStoriesOption = this.#options?.storybook?.skipStories
            const skipStoriesArgv = getArgvValueFunc('--skipStories', value => value)
            const skipStories = skipStoriesOption ?? skipStoriesArgv ?? []
            const parsedSkipStories = parseSkipStoriesFunc(skipStories, log)

            // Create the test files
            createTestFilesFunc({
                clip,
                clipSelector,
                directoryPath: tempDir,
                folders: this.folders,
                framework,
                log,
                numShards,
                skipStories: parsedSkipStories,
                storiesJson,
                storybookUrl,
            })

            // Create the capabilities
            createStorybookCapabilitiesFunc(capabilities, log)
        }
    }

    async onComplete () {
        const tempDir = process.env.VISUAL_STORYBOOK_TEMP_SPEC_FOLDER
        if (tempDir) {
            log.info(`Cleaning up temporary folder for storybook specs: ${tempDir}`)
            try {
                rmdirSync(tempDir, { recursive: true })
                log.info(`Temporary folder for storybook specs has been removed: ${tempDir}`)
            } catch (err) {
                log.error(`Failed to remove temporary folder for storybook specs: ${tempDir} due to: ${(err as Error).message}`)
            }

            // Remove the environment variables
            delete process.env.VISUAL_STORYBOOK_TEMP_SPEC_FOLDER
        }
    }
}
