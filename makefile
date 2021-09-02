USER=`whoami`
VERSION=`node -e 'console.log(require("./package.json").version)'`

ifeq ($(shell id -u),0)
	as_root = 
else
	as_root = sudo
endif

portal.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/amd64/" | \
	sed "s/__LINUX_IMAGE__/linux-image-amd64/" > cache/hbs-portal.yaml

portal-interface:
	rm -fR ./interface/*
	./node_modules/.bin/vue-cli-service build --modern

lint:
	./node_modules/.bin/vue-cli-service lint

portal: lint package portal-interface portal.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal.yaml --rootfs-tarball=cache/hbs-portal.tar.gz --output=cache/hbs-portal.img --log build.log
	$(as_root) chown ${USER}:${USER} cache/hbs-portal.tar.gz
	$(as_root) rm -f cache/hbs-portal.img
	$(as_root) rm -f cache/hbs-portal.yaml
	$(as_root) chown ${USER}:${USER} builds/hbs-portal-${VERSION}-hoobs-all.deb
	dpkg-sig --sign builder builds/hbs-portal-${VERSION}-hoobs-all.deb
	rm -f ./cache/package.json

log:
	touch build.log
	truncate -s 0 build.log

paths: log
	mkdir -p interface
	mkdir -p builds
	mkdir -p cache

package: paths
	node -e 'const pjson = require("./package.json"); delete pjson.scripts; delete pjson.devDependencies; require("fs").writeFileSync("cache/package.json", JSON.stringify(pjson, null, 4));'

clean:
	rm -fR cache
	rm -fR interface
