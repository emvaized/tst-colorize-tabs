![CI/CD](https://github.com/irvinm/TST-Colorize-Tabs/workflows/CI/CD/badge.svg)

## Old Information

[Original TST Colorize Tabs Firefox Addon](https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/)

This extension allows to set individual color for each tab in order to highlight them. Currently available colors: red, green, blue, yellow, brown, purple, orange. [TreeStyleTabs](https://addons.mozilla.org/firefox/addon/tree-style-tab/) extension is required for it to run.

Extension may conflict with other extensions which change tabs color, such as [VivaldiFox](https://addons.mozilla.org/firefox/addon/vivaldifox/) or [TST Colored Tabs](https://addons.mozilla.org/firefox/addon/tst-colored-tabs/)

-----

## New Information

I started this just as an experiment to try to fix the "loses color information on restart".  This addon's primary change is the migration from using browser.storage.local.set\get to browser.sessions.getTabValue\setTabValue.  This change seems to make the handling of the color information easier by only storing tab IDs with colors associated with them and these are tied to session management.  With this implementation, there is no need to do anything with indexes.  I used this method with my "[TST Lock](https://github.com/irvinm/TST-Lock)" addon and never had any problems with losing lock information between restarts.

LIMITATION:  When you close a tab or window and then use Firefox to "restore" these tabs, they will not have the original Tab IDs assigned.  Because of this (and no great way of mapping "new tabs created\restored" to old closed tabs, once you close a tab\window, the associated color information will be deleted.  

** This means any restored tabs will not have their color information retained and will be treated as "new".

-----

To customize colors, you can use TreeStyleTab's custom CSS.
Here are default style rules for each color, which you could override in TST settings:

```
.tab.self-colored-red tab-item-substance { background-color: rgba(255,0,0,0.2) !important; }
.tab.self-colored-green tab-item-substance { background-color: rgba(0,255,0,0.2) !important; }
.tab.self-colored-blue tab-item-substance { background-color: rgba(0,128,255,0.2) !important; }
.tab.self-colored-yellow tab-item-substance { background-color: rgba(255,255,0,0.2) !important; }
.tab.self-colored-brown tab-item-substance { background-color: rgba(139,69,19,0.2) !important; }
.tab.self-colored-purple tab-item-substance { background-color: rgba(75,0,130,0.2) !important; }
.tab.self-colored-orange tab-item-substance { background-color: rgba(255,69,0,0.2) !important; }
```

color.png provide by:  <a href="https://www.flaticon.com/free-icons/color-wheel" title="color wheel icons">Color wheel icons created by Hasymi - Flaticon</a>
