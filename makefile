portal: clean lint paths metadata package deploy vue npm
	dpkg-deb --build dist
	cp dist.deb builds/hbs-portal-$(shell project version)-hoobs-all.deb
	rm -fR dist
	dpkg-sig --sign builder builds/hbs-portal-$(shell project version)-hoobs-all.deb

lint:
	@echo $(shell project version)
	./node_modules/.bin/vue-cli-service lint

paths:
	mkdir -p interface
	mkdir -p builds
	mkdir -p dist
	mkdir -p dist/DEBIAN
	mkdir -p dist/usr
	mkdir -p dist/usr/lib
	mkdir -p dist/usr/lib/hbs-portal
	mkdir -p dist/usr/lib/systemd
	mkdir -p dist/usr/lib/systemd/system
	mkdir -p dist/usr/bin

metadata:
	cat control | \
	sed "s/__VERSION__/$(shell project version)/" | \
	sed "s/__DEPENDS__/nodejs (>= 14.15.0), dnsmasq, hostapd/" | \
	sed "s/__ARCH__/all/" > dist/DEBIAN/control

package:
	node -e 'const pjson = require("./package.json"); delete pjson.scripts; delete pjson.devDependencies; require("fs").writeFileSync("dist/usr/lib/hbs-portal/package.json", JSON.stringify(pjson, null, 4));'

deploy:
	cp -R main dist/usr/bin/hbs-portal
	cp -R LICENSE dist/usr/lib/hbs-portal/
	cp -R main.js dist/usr/lib/hbs-portal/
	cp -R server dist/usr/lib/hbs-portal/
	cp -R portal.service dist/usr/lib/systemd/system/hbs-portal.service

vue:
	rm -fR ./interface/*
	./node_modules/.bin/vue-cli-service build --modern
	cp -R interface dist/usr/lib/hbs-portal/

npm:
	npm --prefix dist/usr/lib/hbs-portal/ install dist/usr/lib/hbs-portal/

clean:
	rm -fR dist
	rm -fR interface
