VERSION=`node -e 'console.log(require("./package.json").version)'`

ifeq ($(shell id -u),0)
	as_root = 
else
	$(error "This must be run as root")
endif

portal-amd64.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/amd64/" | \
	sed "s/__LINUX_IMAGE__/linux-image-amd64/" | \
	sed "s/__SERIAL_CONSOLE__/ttyS1,115200/" > cache/hbs-portal-amd64.yaml
	chmod 0755 cache/hbs-portal-amd64.yaml

portal-amd64: portal-amd64.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal-amd64.yaml --rootfs-tarball=cache/hbs-portal-amd64.tar.gz --output=cache/hbs-portal-amd64.img --log build.log
	chmod 0755 cache/hbs-portal-amd64.tar.gz
	rm -f cache/hbs-portal-amd64.img

portal-i386.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/i386/" | \
	sed "s/__LINUX_IMAGE__/linux-image-686/" | \
	sed "s/__SERIAL_CONSOLE__/ttyS1,115200/" > cache/hbs-portal-i386.yaml
	chmod 0755 cache/hbs-portal-i386.yaml

portal-i386: portal-i386.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal-i386.yaml --rootfs-tarball=cache/hbs-portal-i386.tar.gz --output=cache/hbs-portal-i386.img --log build.log
	chmod 0755 cache/hbs-portal-i386.tar.gz
	rm -f cache/hbs-portal-i386.img

portal-arm64.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/arm64/" | \
	sed "s/__LINUX_IMAGE__/linux-image-arm64/" | \
	sed "s/__SERIAL_CONSOLE__/ttyS1,115200/" > cache/hbs-portal-arm64.yaml
	chmod 0755 cache/hbs-portal-arm64.yaml

portal-arm64: portal-arm64.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal-arm64.yaml --rootfs-tarball=cache/hbs-portal-arm64.tar.gz --output=cache/hbs-portal-arm64.img --log build.log
	chmod 0755 cache/hbs-portal-arm64.tar.gz
	rm -f cache/hbs-portal-arm64.img

portal-armhf.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/armhf/" | \
	sed "s/__LINUX_IMAGE__/linux-image-armmp/" | \
	sed "s/__SERIAL_CONSOLE__/ttyS1,115200/" > cache/hbs-portal-armhf.yaml
	chmod 0755 cache/hbs-portal-armhf.yaml

portal-armhf: portal-armhf.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal-armhf.yaml --rootfs-tarball=cache/hbs-portal-armhf.tar.gz --output=cache/hbs-portal-armhf.img --log build.log
	chmod 0755 cache/hbs-portal-armhf.tar.gz
	rm -f cache/hbs-portal-armhf.img

portal-armel.yaml: build.yaml
	cat build.yaml | \
	sed "s/__RELEASE__/bullseye/" | \
	sed "s/__VERSION__/${VERSION}/" | \
	sed "s/__SECURITY_SUITE__/bullseye-security/" | \
	sed "s/__ARCH__/armel/" | \
	sed "s/__LINUX_IMAGE__/linux-image-rpi/" | \
	sed "s/__SERIAL_CONSOLE__/ttyS1,115200/" > cache/hbs-portal-armel.yaml
	chmod 0755 cache/hbs-portal-armel.yaml

portal-armel: portal-armel.yaml
	time nice $(as_root) vmdb2 --verbose cache/hbs-portal-armel.yaml --rootfs-tarball=cache/hbs-portal-armel.tar.gz --output=cache/hbs-portal-armel.img --log build.log
	chmod 0755 cache/hbs-portal-armel.tar.gz
	rm -f cache/hbs-portal-armel.img

interface:
	rm -fR ./interface/*
	./node_modules/.bin/vue-cli-service build --modern

lint:
	./node_modules/.bin/vue-cli-service lint

portal: lint package interface portal-amd64 portal-i386 portal-arm64 portal-armhf portal-armel

log:
	touch build.log
	chmod 0755 build.log
	truncate -s 0 build.log

paths: log
	mkdir -p interface
	chmod -R 0755 interface
	mkdir -p builds
	chmod -R 0755 builds
	mkdir -p cache
	chmod -R 0755 cache

package: paths
	node -e 'const pjson = require("./package.json"); delete pjson.scripts; delete pjson.devDependencies; require("fs").writeFileSync("cache/package.json", JSON.stringify(pjson, null, 4));'
	chmod 0755 cache/package.json

clean:
	rm -f ./cache/*
