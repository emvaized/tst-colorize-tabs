// TODO: Rework debug error logging moving forward
// TODO: Ensure add\remove works for single tabs, multi-selected tabs, and browser restarts
// TODO: Review\rework menu handling algo.  Do we can about disabling any of the item? Leave everything enabled?

'use strict';

const kTST_ID = 'treestyletab@piro.sakura.ne.jp';
const coloredTabs = [];
const colorOpacity = 0.2;
const availableColors = {
    'red': `rgba(255, 0, 0, ${colorOpacity})`,
    'green': `rgba(0, 255, 0, ${colorOpacity})`,
    'blue': `rgba(0, 128, 255, ${colorOpacity})`,
    'yellow': `rgba(255, 255, 0, ${colorOpacity})`,
    'brown': `rgba(139, 69, 19, ${colorOpacity})`,
    'purple': `rgba(75, 0, 130, ${colorOpacity})`,
    'orange': `rgba(255, 69, 0, ${colorOpacity})`,
};

// Define cycle constants
const BEHAVIOR_STOP_AT_TOP_BOTTOM = "stop";
const BEHAVIOR_CYCLE_AROUND = "cycle";

// Define color scheme constants
const COLOR_SCHEME_LIGHT = "light";
const COLOR_SCHEME_DARK = "dark";
const COLOR_SCHEME_AUTO = "auto";

let colorScheme = COLOR_SCHEME_AUTO;
var keyboardBehavior = BEHAVIOR_STOP_AT_TOP_BOTTOM;

// Load user preferences from storage
browser.storage.sync.get({
    colorScheme: COLOR_SCHEME_AUTO,
    keyboardBehavior: BEHAVIOR_STOP_AT_TOP_BOTTOM,
  }).then((result) => {
    colorScheme = result.colorScheme;
    keyboardBehavior = result.keyboardBehavior;
  });
  
/// Create menu
const menuItemDefinitionsById = {
    topLevel_colorizeTab: {
        title: browser.i18n.getMessage('color'),
        contexts: ['tab'],
        visible: true,
        enabled: true
    }
};

Object.keys(availableColors).forEach(function (color) {
    menuItemDefinitionsById[color] = {
        parentId: 'topLevel_colorizeTab',
        title: browser.i18n.getMessage(color),
        contexts: ['tab'],
        enabled: true,
        icons: { "16": `icons/${color}.svg` }
    };
});

menuItemDefinitionsById.separator = {
    parentId: 'topLevel_colorizeTab',
    type: 'separator',
    contexts: ['tab'],
};

menuItemDefinitionsById.noColor = {
    parentId: 'topLevel_colorizeTab',
    enabled: true,
    title: browser.i18n.getMessage('noColor'),
    contexts: ['tab'],
};

for (const [id, definition] of Object.entries(menuItemDefinitionsById)) {
    const params = {
        id,
        title: definition.title,
        type: definition.type || 'normal',
        contexts: definition.contexts,
        visible: definition.visible,
        enabled: definition.enabled
    };

    if (definition.icons) params.icons = definition.icons;

    if (definition.parentId)
        params.parentId = definition.parentId;
    browser.menus.create(params);
}

/// Handle menu item click
browser.menus.onClicked.addListener(async (info, tab) => {
    // Extra context menu commands won't be available on the blank area of the tab bar.
    if (!tab) return;

    const selectedColor = info.menuItemId.replace(/^topLevel_/, '');
    await processColors(tab, selectedColor);
});

async function processColors(tab, selectedColor) {
    const multiselectedTabs = await getMultiselectedTabs(tab);
    /// Collect tab ids
    const ids = [];
    multiselectedTabs.forEach((selectedTab) => { ids.push(selectedTab.id); });

    switch (selectedColor) {
        case 'noColor': {
            removeTabColors(ids);
            break;;
        }

        default: {
            removeTabColors(ids);
            colorizeTabs(selectedColor, ids);

            for (const tab of multiselectedTabs) {
                if (coloredTabs.findIndex((el, i, arr) => el.id == tab.id) < 0)
                    coloredTabs.push({
                        id: tab.id,
                        index: tab.index,
                        color: selectedColor
                    });
            }

            break;
        }
    }
}

/// Set color for passed tabs
function colorizeTabs(color, ids) {
    browser.runtime.sendMessage(kTST_ID, {
        type: 'add-tab-state',
        tabs: ids,
        state: 'self-colored-' + color,
    });

    if (Array.isArray(ids)) {
        ids.forEach((tabId) => {
            browser.sessions.setTabValue(tabId, "color", color);
            colorizedTabs.add(tabId);
            console.log('[TST-Colorize-Tabs]: Added Tab ' + tabId + ' as ' + color + '. colorizedTabs is now: ');
            console.log(colorizedTabs);
        });
    } else {
        browser.sessions.setTabValue(ids, "color", color);
        colorizedTabs.add(ids);
        console.log('[TST-Colorize-Tabs]: Added Tab ' + ids + ' as ' + color + '. colorizedTabs is now: ');
        console.log(colorizedTabs);
    }

    browser.browserAction.setBadgeText({ text: colorizedTabs.size.toString() }); // Update badge with size
}

/// Clear any colors stored for tabs
function removeTabColors(tabIds) {
    for (const color of Object.keys(availableColors)) {
        browser.runtime.sendMessage(kTST_ID, {
            type: 'remove-tab-state',
            tabs: tabIds,
            state: 'self-colored-' + color,
        });
    }

    if (Array.isArray(tabIds)) {
        tabIds.forEach((tabId) => {
            browser.sessions.removeTabValue(tabId, "color");
            if (colorizedTabs.has(tabId)) {
                colorizedTabs.delete(tabId);
                console.log('[TST-Colorize-Tabs]: Removed tab ' + tabId + '. colorizedTabs is now: ');
                console.log(colorizedTabs);
                return;
            }
        });
    } else {
        browser.sessions.removeTabValue(tabIds, "color");
        if (colorizedTabs.has(tabIds)) {
            colorizedTabs.delete(tabIds);
            console.log('[TST-Colorize-Tabs]: Removed tab ' + tabIds + '. colorizedTabs is now: ');
            console.log(colorizedTabs);
            return;
        }
    }

    browser.browserAction.setBadgeText({ text: colorizedTabs.size.toString() }); // Update badge with size
}

async function getMultiselectedTabs(tab) {
    if (!tab)
        return [];
    if (tab.highlighted)
        return browser.tabs.query({
            windowId: tab.windowId,
            highlighted: true
        });
    else
        return [tab];
}

/// Check if removed tab had assigned color, and also update stored tab indexes
async function onTabRemoved(tabId, removeInfo) {
    if (removeInfo.isWindowClosing) return;

    if (colorizedTabs.has(tabId)) {
        colorizedTabs.delete(tabId);
        console.log('[TST-Colorize-Tabs]: colorizedTabs is now: ');
        console.log(colorizedTabs);
        return;
    }
}

const colorizedTabs = new Set(); // Create Set() to track active tabs that are colorized
browser.browserAction.setBadgeBackgroundColor({ 'color': 'green' }); // Set badge background to green
browser.browserAction.setBadgeText({ text: colorizedTabs.size.toString() }); // Update badge with size

/// Init extension
browser.runtime.onMessageExternal.addListener((aMessage, aSender) => {
    switch (aSender.id) {
        case kTST_ID:
            // console.log('[TST-Colorize-Tabs]: kTST_ID message -> ' + aMessage.type);
            switch (aMessage.type) {
                case 'ready':
                    registerToTST();
                    break;
            }
            break;
    }
});

async function registerToTST() {
    try {
        console.log('[TST-Colorize-Tabs]: Try to register with TST');

        const self = await browser.management.getSelf();

        let css = '';
        for (const [name, color] of Object.entries(availableColors)) {
            css += `.tab.self-colored-${name} tab-item-substance { background-color: ${color} !important; }`;
        }

        let success = await browser.runtime.sendMessage(kTST_ID, {
            type: 'register-self',
            name: self.id,
            style: css,
        });

        return success;
    } catch (e) {
        // TST is not available
        console.log('[TST-Colorize-Tabs]: TST is not available');
    }
}

registerToTST().then(res => {
    browser.tabs.onRemoved.addListener(onTabRemoved);
    //    browser.tabs.onCreated.addListener(onTabCreated);  // mci - nothing really do with new tabs - delete
    loadColorizedTabs();
});

function loadColorizedTabs() {
    browser.storage.local.get("userColoredTabs").then((results) => {
        /// Load tabs colors stored from v1.0
        if (results.userColoredTabs != undefined) {
            console.log('[TST-Colorize-Tabs]: Loaded legacy colorized tabs from storage:');
            console.log(results.userColoredTabs);

            for (const tabInfo of results.userColoredTabs) {
                browser.tabs.query({ index: parseInt(tabInfo.index) }).then((tabs) => {
                    if (tabs.length < 1) return;
                    colorizeTabs(tabInfo.color, [tabs[0].id]);
                })
            }
            browser.storage.local.remove("userColoredTabs");
        } else {
            /// New method of loading
            console.log("[TST-Colorize-Tabs]: Loading previous tabs into array");
            browser.tabs.query({}).then((tabs) => {
                for (const tab of tabs) {
                    browser.sessions.getTabValue(tab.id, "color").then((color) => {
        
                        if (color != undefined) {
                            // console.log("[TST-Colorize-Tabs]: Color tab " + tab.id + " to color " + color);
                            colorizeTabs(color, tab.id);
                        }
                    });
                }
            });
        }
    });
}

function switchToTabWithColor(direction) {
    browser.tabs.query({ currentWindow: true }, function (tabs) {
        let currentTabIndex = -1;

        // Find the current tab index
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].active) {
                currentTabIndex = i;
                break;
            }
        }

        // Find the next or previous tab with color
        let targetTabIndex = -1;

        browser.storage.sync.get({
            keyboardBehavior: BEHAVIOR_STOP_AT_TOP_BOTTOM,
          }).then((result) => {
            keyboardBehavior = result.keyboardBehavior;
          });

        if (keyboardBehavior === BEHAVIOR_CYCLE_AROUND) {
            // Cycle around behavior
            for (let i = currentTabIndex + direction; ; i += direction) {
                if (i >= tabs.length) {
                    i = 0;
                } else if (i < 0) {
                    i = tabs.length - 1;
                }

                if (colorizedTabs.has(tabs[i].id)) {
                    console.log("Moving tab -> targetTabIndex = " + i + ", Tab.id = " + tabs[i].id, ": Name -> (" + tabs[i].title + ")");
                    targetTabIndex = i;
                    break;
                }
            }
        } else {
            // Stop at the top or bottom behavior (default)
            for (let i = currentTabIndex + direction; i >= 0 && i < tabs.length; i += direction) {
                if (colorizedTabs.has(tabs[i].id)) {
                    console.log("Moving tab -> targetTabIndex = " + i + ", Tab.id = " + tabs[i].id, ": Name -> (" + tabs[i].title + ")");
                    targetTabIndex = i;
                    break;
                }
            }
        }

        // If a matching tab was found, activate it
        if (targetTabIndex !== -1) {
            browser.tabs.update(tabs[targetTabIndex].id, { active: true });
        }
    });
}

browser.commands.onCommand.addListener(function (command) {
    if (command === "next-tab-with-color") {
        switchToTabWithColor(1);
    }
    
    if (command === "previous-tab-with-color") {
        switchToTabWithColor(-1);
    }

    // Define a regular expression pattern to match for color commands
    const colorRegex = /red|green|blue|yellow|brown|purple|orange|noColor/;

    // Use the regular expression to test if the command matches the pattern
    const match = command.match(colorRegex);

    if (match) {
        // Get the current tab using the 'active: true' query option
        browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
            if (tabs.length > 0) {
                processColors(tabs[0], command);
            } else {
            console.log('No active tab found.');
            }
        })
        .catch((error) => {
            console.error('Error getting current tab:', error);
        });
    }
});