#!/usr/bin/bash

/usr/bin/afb-binder -M -p 8082 -vvv \
    --roothttp /usr/redpesk/tux-evse-webapp/htdocs
