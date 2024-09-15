## 2.0.0

Thanks to [@irvinm](https://github.com/irvinm) for all his contributions! 🎉
- Migrated extension to use [browser.sessions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/sessions) API for storing tab colors instead of saving tab indexes in storage
- Fixed issues with tab colors not saved on browser restore (https://github.com/emvaized/tst-colorize-tabs/issues/8)
- Fixed problem with tab colors applied in several windows at once (https://github.com/emvaized/tst-colorize-tabs/issues/7)
- Added addon icon - Attribution to Flaticon creator Hasymi
- Added support for badge count for number of tabs with colors
- Removed customization of menu enable\disable, as it was confusing with multi-select of existing multi-colored tabs.
- Added support for keyboard shortcuts
  - move up or down to colorized tabs (<kbd>Alt</kbd>+<kbd>Down</kbd> and <kbd>Alt</kbd>+<kbd>Up</kbd>)
  - <kbd>ALT</kbd>+(<kbd>1</kbd>-<kbd>7</kbd>) to set each color for selected tabs, and <kbd>Alt</kbd>+<kbd>0</kbd> to remove any color
- Added options page, which can be seen by clicking on addon icon or about:addons -> Options
  - Switch between light/dark appearance
  - Switch keyboard behavior to stop at top/bottom or cycle (https://github.com/irvinm/TST-Colorize-Tabs/issues/2)

--- 

- Fixed broken "red" icon, which increased overall extension size
- Added "auto" options page appearance
- Added footer buttons to the options page
- Added legacy onLoad handler to migrate tab colors from `v1.0`
- Cleaned up project structure and code

## 1.0.2
- Added Dutch translation
- Update stored tab indexes on tabs reorder

## 1.0.1
- Fix for
