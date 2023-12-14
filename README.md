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

Install dependencies packages

```bash
sudo apt install libafb-python
```

### On target (production)

Login on target and declare repo where you build this app binding

```bash
dnf install tux-evse-webapp-mock
afm-util list


# [optional] add afb-ui-devtools - useful for analysis
dnf install afb-ui-devtools
```

## Webapp build

```bash
npm install
npm run build
```
To build webapp in production mode use:
```bash
./package-webapp.sh
```

## Testing

### Native

Make sure that your dependencies are reachable from the Python scripting engine, before starting your test.

Start natively on your host :

```bash
    npm run watch
    # in a new terminal
    export TUX_EVSE_NATIVE=1
    export TUX_EVSE_MOCK_PORT=1235
    ./mock/tux-evse-mock-api.py

    # in another terminal
    curl -s localhost:1235/api/tux-evse-webapp-mock/ping |jq

    # start dev-tool
    xdg-open localhost:1235/devtools
```

### Target

```bash
#disable firewalld to allow external access
systemctl stop firewalld
afm-util start tux-evse-webapp-mock
#afm-util kill tux-evse-webapp-mock
journalctl -feu tux-evse-webapp-mock
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
