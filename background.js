'use strict';

const kTST_ID = 'treestyletab@piro.sakura.ne.jp';
const debugMode = false;
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


/// Create menu
const menuItemDefinitionsById = {
    topLevel_colorizeTab: {
        // title: browser.i18n.getMessage('chooseColor'),
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

/// Show menu
browser.menus.onShown.addListener(async (info, tab) => {
    let modified = false;
    for (const [id, definition] of Object.entries(menuItemDefinitionsById)) {
        const enabled = true;
        const changes = {};

        /// Grey out option if it's already selected
        // if (coloredTabs[id] && coloredTabs[id].includes(tab.id)) changes.enabled = false;

        let indexColored = coloredTabs.findIndex((el, i, arr) => el.index == tab.index);
        if (indexColored < 0 && id == 'noColor') changes.enabled = false;
        else if (indexColored > -1 && coloredTabs[indexColored].color == id) changes.enabled = false;
        else changes.enabled = true;

        if (definition.enabled != enabled)
            changes.enabled = definition.enabled = enabled;

        if (Object.keys(changes).length == 0)
            continue;

        browser.menus.update(id, changes);
        modified = true;
    }

    if (modified)
        browser.menus.refresh();
});

/// Handle menu item click
browser.menus.onClicked.addListener(async (info, tab) => {
    // Extra context menu commands won't be available on the blank area of the tab bar.
    if (!tab)
        return;

    const selectedColor = info.menuItemId.replace(/^topLevel_/, '');
    const multiselectedTabs = await getMultiselectedTabs(tab);
    /// Collect tab ids
    const ids = [];
    multiselectedTabs.forEach((selectedTab) => { ids.push(selectedTab.id) });

    switch (selectedColor) {
        case 'noColor': {
            removeTabColors(ids);
            saveColors();
            break;;
        }

        default: {
            removeTabColors(ids);
            colorizeTabs(selectedColor, multiselectedTabs.length < 2 ? [tab.id] : ids);

            for (const tab of multiselectedTabs) {
                if (coloredTabs.findIndex((el, i, arr) => el.id == tab.id) < 0)
                    coloredTabs.push({
                        id: tab.id,
                        index: tab.index,
                        color: selectedColor
                    });
            }

            saveColors();
            break;
        }
    }
});

/// Set color for passed tabs
function colorizeTabs(colorString, tabIds) {
    browser.runtime.sendMessage(kTST_ID, {
        type: 'add-tab-state',
        tabs: tabIds,
        state: 'self-colored-' + colorString,
    });
}

/// Store colors in storage in order to recreate after browser restart
function saveColors() {
    // browser.storage.local.clear();
    if (debugMode) {
        console.log('Saved colored tabs:');
        console.log(coloredTabs);
    }

    browser.storage.local.set({ 'userColoredTabs': coloredTabs });
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

    for (const tabId of tabIds) {
        if (checkToDeleteColorData(tabId)) saveColors();
    }
}

function checkToDeleteColorData(tabId) {
    let result = false;

    /// Clear any saved color for specified tab id
    for (let i = 0, l = coloredTabs.length; i < l; i++) {
        if (parseInt(coloredTabs[i].id) == tabId) {
            coloredTabs.splice(i, 1);
            result = true;
            break;
        }
    }

    return result;
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
    if (checkToDeleteColorData(tabId)) saveColors();
    updateStoredTabIndexes();
}

/// Update tabs indexes when new tab was created
function onTabCreated(tab) {
    updateStoredTabIndexes();
}

function updateStoredTabIndexes() {
    for (let i = 0, l = coloredTabs.length; i < l; i++) {
        let tabInfo = coloredTabs[i];

        browser.tabs.get(parseInt(tabInfo.id)).then((tab) => {
            if (!tab) return;

            if (tab.index !== parseInt(tabInfo.index)) {
                /// Needs to update

                if (debugMode) {
                    console.log('---');
                    console.log('Needs to update index ' + tabInfo.index + ' to ' + tab.index);
                    console.log('Data before update:');
                    console.log(coloredTabs);
                }

                coloredTabs[i].index = tab.index;

                if (debugMode) {
                    console.log('Data after update:');
                    console.log(coloredTabs);
                }

                saveColors();
            }
        })
    }
}

/// Init extension
browser.runtime.onMessageExternal.addListener((aMessage, aSender) => {
    switch (aSender.id) {
        case kTST_ID:
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
    }
}

registerToTST().then(res => {
    browser.tabs.onRemoved.addListener(onTabRemoved);
    browser.tabs.onCreated.addListener(onTabCreated);

    /// Load stored colors from storage and apply to tabs
    browser.storage.local.get("userColoredTabs").then((results) => {
        if (debugMode) {
            console.log('Loaded colored tabs from storage:');
            console.log(results.userColoredTabs);
        }

        if (results.userColoredTabs != undefined) {
            let containsInvalidData = false;

            for (const tabInfo of results.userColoredTabs) {
                browser.tabs.query({ index: parseInt(tabInfo.index) }).then((tabs) => {
                    if (tabs.length < 1) {
                        /// Data is no longer relevant
                        containsInvalidData = true;
                        return;
                    }

                    coloredTabs.push({
                        id: tabs[0].id,
                        index: tabInfo.index,
                        color: tabInfo.color
                    });

                    colorizeTabs(tabInfo.color, [tabs[0].id]);
                })
            }

            if (containsInvalidData) saveColors();
        }
    });
});