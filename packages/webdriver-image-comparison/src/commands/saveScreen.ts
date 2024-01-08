import { takeBase64Screenshot } from '../methods/screenshots.js'
import { makeCroppedBase64Image } from '../methods/images.js'
import beforeScreenshot from '../helpers/beforeScreenshot.js'
import afterScreenshot from '../helpers/afterScreenshot.js'
import { determineScreenRectangles } from '../methods/rectangles.js'
import type { Methods } from '../methods/methods.interfaces'
import type { Folders } from '../base.interfaces'
import type { SaveScreenOptions } from './screen.interfaces'
import type { BeforeScreenshotOptions, BeforeScreenshotResult } from '../helpers/beforeScreenshot.interfaces'
import type { InstanceData } from '../methods/instanceData.interfaces'
import type { AfterScreenshotOptions, ScreenshotOutput } from '../helpers/afterScreenshot.interfaces'
import type { RectanglesOutput, ScreenRectanglesOptions } from '../methods/rectangles.interfaces'

/**
 * Saves an image of the viewport of the screen
 */
export default async function saveScreen(
    methods: Methods,
    instanceData: InstanceData,
    folders: Folders,
    tag: string,
    saveScreenOptions: SaveScreenOptions,
): Promise<ScreenshotOutput> {
    // 1a. Set some variables
    const { addressBarShadowPadding, addIOSBezelCorners, formatImageName, logLevel, savePerInstance, toolBarShadowPadding } =
        saveScreenOptions.wic

    // 1b. Set the method options to the right values
    const disableCSSAnimation: boolean = 'disableCSSAnimation' in saveScreenOptions.method
        ? Boolean(saveScreenOptions.method.disableCSSAnimation)
        : saveScreenOptions.wic.disableCSSAnimation
    const hideScrollBars: boolean = 'hideScrollBars' in saveScreenOptions.method
        ? Boolean(saveScreenOptions.method.hideScrollBars)
        : saveScreenOptions.wic.hideScrollBars
    const hideElements: HTMLElement[] = saveScreenOptions.method.hideElements || []
    const removeElements: HTMLElement[] = saveScreenOptions.method.removeElements || []

    // 2.  Prepare the beforeScreenshot
    const beforeOptions: BeforeScreenshotOptions = {
        instanceData,
        addressBarShadowPadding,
        disableCSSAnimation,
        hideElements,
        logLevel,
        noScrollBars: hideScrollBars,
        removeElements,
        toolBarShadowPadding,
    }
    const enrichedInstanceData: BeforeScreenshotResult = await beforeScreenshot(methods.executor, beforeOptions)
    const {
        browserName,
        browserVersion,
        deviceName,
        dimensions: {
            window: { devicePixelRatio, innerHeight, innerWidth, isLandscape, outerHeight, outerWidth, screenHeight, screenWidth },
        },
        isAndroidChromeDriverScreenshot,
        isAndroidNativeWebScreenshot,
        isIos,
        isMobile,
        isTestInBrowser,
        logName,
        name,
        platformName,
        platformVersion,
    } = enrichedInstanceData

    // 3.  Take the screenshot
    const base64Image: string = await takeBase64Screenshot(methods.screenShot)

    // Determine the rectangles
    const screenRectangleOptions: ScreenRectanglesOptions = {
        devicePixelRatio: devicePixelRatio || NaN,
        innerHeight: innerHeight || NaN,
        innerWidth: innerWidth || NaN,
        isAndroidChromeDriverScreenshot,
        isAndroidNativeWebScreenshot,
        isIos,
        isLandscape,
    }
    const rectangles: RectanglesOutput = determineScreenRectangles(base64Image, screenRectangleOptions)
    // 4.  Make a cropped base64 image
    const croppedBase64Image: string = await makeCroppedBase64Image({
        addIOSBezelCorners,
        base64Image,
        deviceName,
        devicePixelRatio: devicePixelRatio || NaN,
        isIos,
        isLandscape,
        logLevel,
        rectangles,
    })

    // 5.  The after the screenshot methods
    const afterOptions: AfterScreenshotOptions = {
        actualFolder: folders.actualFolder,
        base64Image: croppedBase64Image,
        disableCSSAnimation,
        filePath: {
            browserName,
            deviceName,
            isMobile,
            savePerInstance,
        },
        fileName: {
            browserName,
            browserVersion,
            deviceName,
            devicePixelRatio: devicePixelRatio || NaN,
            formatImageName,
            isMobile,
            isTestInBrowser,
            logName,
            name,
            outerHeight: outerHeight || NaN,
            outerWidth: outerWidth || NaN,
            platformName,
            platformVersion,
            screenHeight: screenHeight || NaN,
            screenWidth: screenWidth || NaN,
            tag,
        },
        hideElements,
        hideScrollBars,
        isLandscape,
        logLevel,
        platformName: instanceData.platformName,
        removeElements,
    }

    // 6.  Return the data
    return afterScreenshot(methods.executor, afterOptions)
}
