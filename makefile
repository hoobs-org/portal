portal: clean lint paths metadata package deploy vue yarn
	dpkg-deb --build dist
	cp dist.deb builds/hbs-portal-$(shell project version)-hoobs-all.deb
	dpkg-sig --sign builder builds/hbs-portal-$(shell project version)-hoobs-all.deb
	rm -f dist.deb
	rm -fR dist
	rm -fR interface

lint:
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
	sed "s/__DEPENDS__/nodejs (>= 16.13.0), dnsmasq, hostapd/" | \
	sed "s/__ARCH__/all/" > dist/DEBIAN/control

package:
	node -e 'const pjson = require("./package.json"); delete pjson.devDependencies; require("fs").writeFileSync("dist/usr/lib/hbs-portal/package.json", JSON.stringify(pjson, null, 4));'

deploy:
	cp -R main dist/usr/bin/hbs-portal
	cp -R LICENSE dist/usr/lib/hbs-portal/
	cp -R main.js dist/usr/lib/hbs-portal/
	cp -R server dist/usr/lib/hbs-portal/
	cp -R portal.service dist/usr/lib/systemd/system/hbs-portal.service
	cp -R postinst dist/DEBIAN/postinst

vue:
	rm -fR ./interface/*
	./node_modules/.bin/vue-cli-service build --modern
	cp -R interface dist/usr/lib/hbs-portal/

yarn:
	(cd dist/usr/lib/hbs-portal && ../../../../../node_modules/.bin/yarn install)

clean:
	rm -fR dist
	rm -fR interface
