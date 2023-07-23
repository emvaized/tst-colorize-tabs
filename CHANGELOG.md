## New Addon History

Upcoming 1.1.0
- Forked version from original addon (history below)
- Initial version attempting to fix issue of losing color information between restarts
  - https://github.com/emvaized/tst-colorize-tabs/issues/8
- Converted browser.storage.local.set\get to browser.sessions.getTabValue\setTabValue
- Removed unneeded index code
- Added addon icon - Attribution to Flaticon creator Hasymi
- Added support for badge count for number of tabs with colors
- Removed customization of menu enable\disable. 
  - Felt it was confusing especially with multi-select of existing multi-colored tabs.
- Added support for keyboard shortcuts to move up or down to colorized tabs
  - Default is "Alt+Down for next" and "Alt+Up for previous"
  - Can change shortcuts via about:addons -> cogwheel -> Manage Extension Shortcuts
  - https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox
- [TODO] [Add ability to assign keyboard shortcuts for each color](https://github.com/irvinm/TST-Colorize-Tabs/issues/3)
- [Add ability to "cycle around" when using keyboard shortcuts](https://github.com/irvinm/TST-Colorize-Tabs/issues/2)
  - New options for light\dark options page
  - New options for keyboard behavior to stop at top\bottom or cycle
  - Options can be seen by clicking on addon icon or about:addons -> Options

## Original Addon History

1.0.2
- Added Dutch translation
- Update stored tab indexes on tabs reorder

1.0.1
- Fix for
