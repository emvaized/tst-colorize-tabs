## New Addon History

1.1.0
- Forked version from original addon (history below)
- Initial version attempting to fix issue of losing color information between restarts
- Converted browser.storage.local.set\get to browser.sessions.getTabValue\setTabValue
- Removed unneeded index code
- Added addon icon - Attribution to Flaticon creator Hasymi
- Added support for badge count of number of tabs with colors
- Removed customization of menu enable\disable. 
  - Felt it was confusing especially with multi-select of existing multi-colored tabs.
- Added support for keyboard shortcuts to move up or down to colorized tabs
  - Default is Alt+Down for next and Alt+Up for previous
  - Can change shortcuts via about:addons -> cogwheel -> Manage Extension Shortcuts
  - https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox

## Original Addon History

1.0.2
- Added Dutch translation
- Update stored tab indexes on tabs reorder

1.0.1
- Fix for