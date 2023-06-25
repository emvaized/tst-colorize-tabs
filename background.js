// TODO: Rework debug error logging moving forward
// TODO: Ensure add\remove works for single tabs, multi-selected tabs, and browser restarts
// TODO: Document limitation that restored tabs are not given previous tab.id ... so essentially new
// TODO: Review\rework menu handling algo.  Do we can about disabling any of the item? Leave everything enabled?

'use strict';

const kTST_ID = 'treestyletab@piro.sakura.ne.jp';
const debugMode = true;
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
            break;;
        }

        default: {
            removeTabColors(ids);
            //colorizeTabs(selectedColor, multiselectedTabs.length < 2 ? [tab.id] : ids);
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
});

/// Set color for passed tabs
function colorizeTabs(color, ids) {
    browser.runtime.sendMessage(kTST_ID, {
        type: 'add-tab-state',
        tabs: ids,
        state: 'self-colored-' + color,
    });

    if (Array.isArray(ids)) {
        ids.forEach( (tabId) => { 
            browser.sessions.setTabValue(tabId, "color", color);
            colorizedTabs.add(tabId);
            console.log('TST-Colorize-Tabs: Added Tab ' + tabId + ' as ' + color + '. colorizedTabs is now: ');
            console.log(colorizedTabs);
        });
    } else {
        browser.sessions.setTabValue(ids, "color", color);
        colorizedTabs.add(ids);
        console.log('TST-Colorize-Tabs: Added Tab ' + ids + ' as ' + color + '. colorizedTabs is now: ');
        console.log(colorizedTabs); // mci
    }
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
        tabIds.forEach( (tabId) => {
            browser.sessions.removeTabValue(tabId, "color");
            if (colorizedTabs.has(tabId)) {
                colorizedTabs.delete(tabId);
                console.log('TST-Colorize-Tabs: Removed tab ' + tabId + '. colorizedTabs is now: ');
                console.log(colorizedTabs); // mci
                return;
            }
        });        
    } else {
        browser.sessions.removeTabValue(tabIds, "color");
        if (colorizedTabs.has(tabIds)) {
            colorizedTabs.delete(tabIds);
            console.log('TST-Colorize-Tabs: Removed tab ' + tabIds + '. colorizedTabs is now: ');
            console.log(colorizedTabs);
            return;
        }
    }
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
        console.log('TST-Colorize-Tabs: colorizedTabs is now: '); // mci
        console.log(colorizedTabs); // mci
        return;
    }
}

const colorizedTabs = new Set(); // Create Set() to track active tabs that are colorized

/// Init extension
browser.runtime.onMessageExternal.addListener((aMessage, aSender) => {
    switch (aSender.id) {
        case kTST_ID:
            // console.log('TST-Colorize-Tabs: kTST_ID message -> ' + aMessage.type);
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
        console.log('TST-Colorize-Tabs: Try to register with TST');

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
        console.log('TST-Colorize-Tabs: TST is not available'); // mci
    }
}

registerToTST().then(res => {
    browser.tabs.onRemoved.addListener(onTabRemoved);
//    browser.tabs.onCreated.addListener(onTabCreated); 

    loadColorizedTabs(); 
});

function loadColorizedTabs() {

    console.log("TST-Colorize-Tabs: Loading previous tabs into array");    
    browser.tabs.query({}).then((tabs) => {
    
        for (const tab of tabs) {
    
            browser.sessions.getTabValue(tab.id, "color").then((color) => {
    
                if (color != undefined) {
                    // console.log("TST-Colorize-Tabs: Color tab " + tab.id + " to color " + color);
                    colorizeTabs(color, tab.id);
                }
            });
        }
    });
}