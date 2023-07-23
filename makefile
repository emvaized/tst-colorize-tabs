xpi: 
	rm -f ./*.xpi
	zip -r -9 TST-Colorize-Tabs.xpi images manifest.json background.js color.png options.html options.css options.js -x '*/.*' >/dev/null 2>/dev/null
