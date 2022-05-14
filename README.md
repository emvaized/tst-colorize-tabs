This [TST](https://addons.mozilla.org/ru/firefox/addon/tree-style-tab/) addon allows to set individual color for each tab in order to highlight it. Currently available colors: red, green, blue, yellow, brown, purple, orange.

[TreeStyleTabs](https://addons.mozilla.org/firefox/addon/tree-style-tab/) extension is required for it to run.
It may conflict with other extensions which change tabs color, such as [VivaldiFox](https://addons.mozilla.org/firefox/addon/vivaldifox/) or [TST Colored Tabs](https://addons.mozilla.org/firefox/addon/tst-colored-tabs/)

Link to download:
https://addons.mozilla.org/firefox/addon/tst-colorize-tabs/

---

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