#!/usr/bin/bash

export LD_LIBRARY_PATH=/usr/local/lib64
pkill tux-evse-webapp
cynagora-admin set '' 'HELLO' '' '*' yes
clear

# build test config dirname
DIRNAME=`dirname $0`
cd $DIRNAME/..
CONFDIR=`pwd`/etc

echo tux-evse-webapp debug mode config=$CONFDIR/*.json

/usr/bin/afb-binder \
  --config=$CONFDIR/tux-evse-webapp-binder.json \
  --config=$CONFDIR/../../etc/tux-evse-webapp.json \
  --config=$CONFDIR/../../etc/tux-evse-webapp-debug.json \
  $*
