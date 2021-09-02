#!/bin/bash

version() {
    echo `node -e 'console.log(require("./package.json").version)'`
}

debug() {
    sudo make interface
    sudo ./node_modules/.bin/nodemon --watch . --ext js --signal SIGINT --exec "sudo node -e 'require(`./main`)();' -- -d"
}

include() {
    case $1 in
        stable )    reprepro -b ../repo/debian includedeb bleeding builds/hbs-portal-$2-hoobs-$3.deb
                    reprepro -b ../repo/debian includedeb edge builds/hbs-portal-$2-hoobs-$3.deb
                    reprepro -b ../repo/debian includedeb stable builds/hbs-portal-$2-hoobs-$3.deb
                    ;;

        edge )      reprepro -b ../repo/debian includedeb bleeding builds/hbs-portal-$2-hoobs-$3.deb
                    reprepro -b ../repo/debian includedeb edge builds/hbs-portal-$2-hoobs-$3.deb
                    ;;

        bleeding )  reprepro -b ../repo/debian includedeb bleeding builds/hbs-portal-$2-hoobs-$3.deb
                    ;;

        * )         ;;
    esac
}

publish() {
    current=$(version)

    case $1 in
        stable )    include "stable" "$current" "amd64"
                    include "stable" "$current" "arm64"
                    include "stable" "$current" "armel"
                    include "stable" "$current" "armhf"
                    include "stable" "$current" "i386"
                    ;;

        edge )      include "edge" "$current" "amd64"
                    include "edge" "$current" "arm64"
                    include "edge" "$current" "armel"
                    include "edge" "$current" "armhf"
                    include "edge" "$current" "i386"
                    ;;

        bleeding )  include "bleeding" "$current" "amd64"
                    include "bleeding" "$current" "arm64"
                    include "bleeding" "$current" "armel"
                    include "bleeding" "$current" "armhf"
                    include "bleeding" "$current" "i386"
                    ;;

        * )         ;;
    esac
}

case $1 in
    version )  version
               ;;

    lint )     make lint
               ;;

    debug )    debug
               ;;

    build )    make portal
               ;;

    publish )  publish $2
               ;;

    clean )    make clean
               ;;

    * )        ;;
esac
