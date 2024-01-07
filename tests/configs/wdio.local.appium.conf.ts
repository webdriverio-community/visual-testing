import type { Options } from '@wdio/types'
import { join } from 'node:path'
import { config as sharedConfig } from './wdio.shared.conf.ts'

export const config: Options.Testrunner = {
    ...sharedConfig,
    // =========================
    // Appium Configuration
    // =========================
    port: 4723,
    // ==================
    // Specify Test Files
    // ==================
    specs: [join(process.cwd(), './tests/specs/mobile.spec.ts')],
    specFileRetries: 0,
    // ============
    // Capabilities
    // ============
    capabilities: [
        // iOSCaps('iPhone 14', 'PORTRAIT', '16.0'),
        // iOSCaps('iPhone 14', 'LANDSCAPE', '16.0'),
        // iOSCaps('iPhone 14 Plus', 'PORTRAIT', '16.0'),
        // iOSCaps('iPhone 14 Plus', 'LANDSCAPE', '16.0'),
        // iOSCaps('iPhone 14 Pro', 'PORTRAIT', '16.0'),
        // iOSCaps('iPhone 14 Pro', 'LANDSCAPE', '16.0'),
        // iOSCaps("iPhone 14 Pro Max", "PORTRAIT", "16.0"),
        // iOSCaps('iPhone 14 Pro Max', 'LANDSCAPE', '16.0'),
        iOSCaps('iPhone 15', 'PORTRAIT', '17.0'),
        // iOSCaps('iPhone 15', 'LANDSCAPE', '17.0'),
    ],
    // ===================
    // Image compare setup
    // ===================
    services: [
        [
            'visual',
            {
                addIOSBezelCorners: true,
                baselineFolder: join(process.cwd(), './tests/localBaseline/'),
                formatImageName: '{tag}-{logName}-{width}x{height}',
                screenshotPath: join(process.cwd(), '.tmp/'),
                savePerInstance: true,
                autoSaveBaseline: true,
                blockOutStatusBar: true,
                blockOutToolBar: true,
                blockOutSideBar: true,
                logLevel: 'debug',
            },
        ],
    ],
}

function iOSCaps(
    deviceName: string,
    orientation: string,
    osVersion: string,
    // The commands that need to be executed, none means all,
    // otherwise an array of strings with the commands that
    // need to be executed
    wdioIcsCommands: string[] = []
) {
    return {
        browserName: 'Safari',
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': deviceName,
        'appium:platformVersion': osVersion,
        'appium:orientation': orientation,
        'appium:newCommandTimeout': 240,
        'appium:language': 'en',
        'appium:locale': 'en',
        'wdio-ics:options': {
            logName: `${deviceName
                .split(' ')
                .map(
                    (word:string) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                )
                .join('')}${
                orientation.charAt(0).toUpperCase() +
                orientation.slice(1).toLowerCase()
            }${osVersion.split('.')[0]}`.replace(
                /(\s+|\(+|\)+|Simulator)/g,
                ''
            ),
            commands: wdioIcsCommands,
        },
    }
}
