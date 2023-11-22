# Tux-EVSE Webapp

This repository contains source of web application that display data of Tux EVSE.

## Dependencies

* `afb-libafb` (from jan/2022 version)
* `afb-libglue`
* `python3`

## Installation

### On native host (development usage)

Install from repo

```bash
vi /etc/apt/sources.list.d/redpesk-sdk.list
deb [trusted=yes] https://silo.redpesk.iot/redpesk/private/sdk/obs/next/sdk/xUbuntu_22.04/latest/ ./
```

sudo apt install libafb-python

Or you can also rebuild build from sources

```bash
    mkdir build
    cd build
    cmake ..
    make
```

### On target (production)

Login on target and declare repo where you build this app binding

```bash
dnf install tux-evse-webapp-mock
afm-util list
afm-util start tux-evse-webapp-mock
#afm-util kill tux-evse-webapp-mock

# [optional] add afb-ui-devtools - useful for analysis
dnf install afb-ui-devtools
```

## Testing

Make sure that your dependencies are reachable from the Python scripting engine, before starting your test.

Start natively on your host :

```bash
    export TUX_EVSE_NATIVE=1
    export TUX_EVSE_MOCK_PORT=1234
    ./mock/tux-evse-mock-api.py

    # in another terminal
    curl -s localhost:1234/api/tux-evse-mock/ping |jq

    # start dev-tool
    xdg-open localhost:1234/devtools
```

## Debug from codium

Codium does not include the GDP profile by default, you should get it from the Ms-Code repository

Go to the VSCode marketplace and download a version compatible with your editor version:

* https://github.com/microsoft/vscode-cpptools/releases
* https://github.com/microsoft/vscode-python/releases

Install your extension

```bash
codium --install-extension cpptools-linux.vsix
codium --install-extension ms-python-release.vsix
```

WARNING: the latest version is probably not compatible with your codium version.
