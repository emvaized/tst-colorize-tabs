xpi: 
	rm -f ./*.xpi
	zip -r -9 TST-Colorize-Tabs.xpi images manifest.json background.js color.png -x '*/.*' >/dev/null 2>/dev/null
