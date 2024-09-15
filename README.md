![CI/CD](https://github.com/irvinm/TST-Colorize-Tabs/workflows/CI/CD/badge.svg)
[![Mozilla Add-on Version](https://img.shields.io/amo/v/tst-colorize-tabs?label=version&color=blue)](https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/)
[![Mozilla Add-on](https://img.shields.io/amo/users/tst-colorize-tabs?color=%23FF6611&label=users&logo=Firefox)](https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/)
[![Mozilla Add-on Stars](https://img.shields.io/amo/stars/tst-colorize-tabs)](https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/)

# <sub><img height="40px" src="./images/color.png"></sub> TST Colorize Tabs

This extension allows to set individual color for each tab in order to highlight them. Currently available colors: red, green, blue, yellow, brown, purple, orange. [TreeStyleTabs](https://addons.mozilla.org/firefox/addon/tree-style-tab/) extension is required for it to run. 

<a href="https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/"><img src="https://user-images.githubusercontent.com/585534/107280546-7b9b2a00-6a26-11eb-8f9f-f95932f4bfec.png" alt="Get for Firefox"></a>

Huge thanks to [@irvinm](https://github.com/irvinm) for many contributions to this project! 🎉
Check out his addon [TST Lock](https://github.com/irvinm/TST-Lock)

<br>

## Important notes

- Extension may conflict with other extensions which change tabs color, such as [VivaldiFox](https://addons.mozilla.org/firefox/addon/vivaldifox/) or [TST Colored Tabs](https://addons.mozilla.org/firefox/addon/tst-colored-tabs/)

- When you close a tab or window and then use Firefox to "restore" these tabs, they will not have the original Tab IDs assigned.  Because of this (and no great way of mapping "new tabs created\restored" to old closed tabs), once you close a tab\window, the associated color information will be deleted.  
**This means any restored tabs will not have their color information retained and will be treated as "new".**

* To customize colors, you can use TreeStyleTab's custom CSS.
Here are default style rules for each color, which you could override in Tree Style Tabs settings (custom CSS section):

```
.tab.self-colored-red tab-item-substance { background-color: rgba(255,0,0,0.2) !important; }
.tab.self-colored-green tab-item-substance { background-color: rgba(0,255,0,0.2) !important; }
.tab.self-colored-blue tab-item-substance { background-color: rgba(0,128,255,0.2) !important; }
.tab.self-colored-yellow tab-item-substance { background-color: rgba(255,255,0,0.2) !important; }
.tab.self-colored-brown tab-item-substance { background-color: rgba(139,69,19,0.2) !important; }
.tab.self-colored-purple tab-item-substance { background-color: rgba(75,0,130,0.2) !important; }
.tab.self-colored-orange tab-item-substance { background-color: rgba(255,69,0,0.2) !important; }
```


-----

color.png provided by:  <a href="https://www.flaticon.com/free-icons/color-wheel" title="color wheel icons">Color wheel icons created by Hasymi - Flaticon</a>
