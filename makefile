portal: $(eval VERSION := $(shell project version))
portal: clean lint paths metadata package deploy vue npm
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	dpkg-deb --build dist
	cp dist.deb builds/hbs-portal-$(VERSION)-hoobs-all.deb
	rm -fR dist
	dpkg-sig --sign builder builds/hbs-portal-$(VERSION)-hoobs-all.deb
endif

lint:
	@echo $(VERSION)
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	./node_modules/.bin/vue-cli-service lint
else
	@echo hbs-portal-$(VERSION) up to date
endif

paths:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
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
endif

metadata:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	cat control | \
	sed "s/__VERSION__/$(VERSION)/" | \
	sed "s/__DEPENDS__/nodejs (>= 14.15.0), dnsmasq, hostapd/" | \
	sed "s/__ARCH__/all/" > dist/DEBIAN/control
endif

package:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	node -e 'const pjson = require("./package.json"); delete pjson.scripts; delete pjson.devDependencies; require("fs").writeFileSync("dist/usr/lib/hbs-portal/package.json", JSON.stringify(pjson, null, 4));'
endif

deploy:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	cp -R main dist/usr/bin/hbs-portal
	cp -R LICENSE dist/usr/lib/hbs-portal/
	cp -R main.js dist/usr/lib/hbs-portal/
	cp -R server dist/usr/lib/hbs-portal/
	cp -R portal.service dist/usr/lib/systemd/system/hbs-portal.service
endif

vue:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	rm -fR ./interface/*
	./node_modules/.bin/vue-cli-service build --modern
	cp -R interface dist/usr/lib/hbs-portal/
endif

npm:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	npm --prefix dist/usr/lib/hbs-portal/ install dist/usr/lib/hbs-portal/
endif

clean:
ifeq (,$(wildcard builds/hbs-portal-$(VERSION)-hoobs-all.deb))
	rm -fR dist
	rm -fR interface
endif
