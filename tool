#!/bin/bash

case $1 in
    version )  echo `node -e 'console.log(require("./package.json").version)'`
               ;;

    lint )     sudo make lint
               ;;

    debug )    sudo make interface
               sudo ./node_modules/.bin/nodemon --watch . --ext js --signal SIGINT --exec "sudo node -e 'require(`./main`)();' -- -d"
               ;;

    build )    sudo make portal
               ;;

    clean )    sudo make clean
               ;;

    * )        ;;
esac
