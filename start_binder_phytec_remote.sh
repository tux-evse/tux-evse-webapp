#!/usr/bin/bash
PHYTEC_REMOTE_BOARD_NAME=phytec-power.tuxevse.vpn

DEBUG_OPTS=--tracereq=all

/usr/bin/afb-binder -M -p 1235 -vvv \
    --ws-client=tcp:$PHYTEC_REMOTE_BOARD_NAME:12351/engy \
    --ws-client=tcp:$PHYTEC_REMOTE_BOARD_NAME:12371/chmgr \
    --ws-client=tcp:$PHYTEC_REMOTE_BOARD_NAME:12381/auth \
    $DEBUG_OPTS \
    --roothttp=./dist/valeo