#!/usr/bin/python3

"""
"""

# import libafb python glue
# FIXME from afbpyglue import libafb
from enum import Enum
from enum import auto
import time
import _afbpyglue as libafb
import random
import os
import datetime


class IecState(Enum):
    Bdf = auto()
    Ef = auto()
    Unset = auto()


class PowerRequest(Enum):
    Start = auto()
    Stop = auto()


class PlugState(Enum):
    PlugIn = "connected and unlocked"
    Lock = "connected and locked"
    Error = "error connect"
    PlugOut = "disconnected"
    Unknown = "unknow status"


class Iso15118State(Enum):
    Iso20 = auto()
    Iso2 = auto()
    Iec = auto()
    Unset = auto()


# Nrj event
evt_nrj_id = None

energy = 0
# charge_bat = 0
charge_power = 0.0
duration = 0
# chargeDurationSec = 0

# Vehicle event
evt_plug_id = None

iecState = IecState.Bdf
powerRequest = PowerRequest.Stop
plugState = PlugState.PlugOut
iso15118State = Iso15118State.Iso20
# smart charging
# iso15118Status = False
# pncStatus = False
# v2gStatus = False
power_imax = 100
# btnStart = False
# motorLockStatus = False

# network status
evt_net_id = None

wifi_status = False
mobile_status = False
ethernet_status = False
nfc_status = False

# static mock variables
count = 0
tic = 0
evtid = None

informationArea = ""


# ______________________________________________________________
# Nrj event

energy = 0
# charge_bat = 0
charge_power = 1253.0
duration = 0


def getChargerInfo():
    """
    Generate the information about the charger.

    Parameters:
        None

    Returns:
        dict: A dictionary containing the following information:
            - energy (float): The amount of energy.
            - duration (str): The duration in the format '01:02:%02d'.
            # - temp (int): The temperature in degrees Celsius.
    """
    global duration
    global energy
    
    duration += 1
    
    energy += 0.5
    
    tmp_charge = charge_power + random.randint(-100, 100)/10.
    return {
        "energy": str(energy),
        "charge_power": str(tmp_charge),
        "duration": str(datetime.timedelta(seconds=duration)),
    }

# timer handle callback


def timerCB(timer, count, userdata):
    """
    Callback function for the timer.

    Args:
        timer: The timer object.
        count: The number of times the timer has been called.
        userdata: Any user-defined data associated with the timer.

    Returns:
        None
    """
    global tic
    tic += 1
    chInfo = getChargerInfo()
    #batInfo = getBatteryInfo()
    '''
    libafb.debug(
        timer,
        "timer':%s' tic=%d, chargerInfo={%d, %s, %d}, batteryInfo=%s",
        libafb.config(timer, "uid"),
        tic,
        chInfo["energy"],
        chInfo["duration"],
        chInfo["temp"],
        batInfo["chargeValue"],
    )
    '''
    # libafb.evtpush(evtid, {"chargerInfo": chInfo, "batteryInfo": batInfo})
    libafb.evtpush(evtid, chInfo)
    # return -1 # should exit timer
    return


# ______________________________________________________________
# Vehicle event

def get_PlugState_list():
    L = []
    for i in PlugState:
        L.append(i.name)
    return L


def get_Iso15118State_list():
    L = []
    for i in Iso15118State:
        L.append(i.name)
    return L


def get_Power_imax_list():
    return [1220, 1350, 2000, 4500, 6500]


def get_IecState_list():
    L = []
    for i in IecState:
        L.append(i.name)
    return L


def get_PowerRequest_list():
    L = []
    for i in PowerRequest:
        L.append(i.name)
    return L


def getIecState():
    global iecState
    return iecState.name


def getPowerRequest():
    global powerRequest
    return powerRequest.name


def getPlugState():
    global plugState
    return plugState.name


def getIso15118State():
    global iso15118State
    return iso15118State.name


def getPower_imax():
    global power_imax
    return power_imax


def subscribe_plug_CB(rqt, *args):
    libafb.notice(rqt, "subscribing api plug event")
    libafb.evtsubscribe(rqt, evt_plug_id)
    return 0  # implicit respond


def unsubscribe_plug_CB(rqt, *args):
    libafb.notice(rqt, "unsubscribing api plug event")
    libafb.evtunsubscribe(rqt, evt_plug_id)
    return 0  # implicit respond


def setPlugState(val):
    global plugState
    if val in get_PlugState_list():
        plugState = PlugState[val]
        return True
    else:
        return False


def setPowerRequest(index):
    global powerRequest
    if index in get_PowerRequest_list():
        powerRequest = PowerRequest[index]
        return True
    else:
        return False


def setPower_imax(val):
    global power_imax
    if val > 0:
        power_imax = val
        return True
    else:
        return False


def setIso15118State(index):
    global iso15118State
    if index in get_Iso15118State_list():
        iso15118State = Iso15118State[index]
        return True
    else:
        return False


def setIecState(index):
    global iecState
    if index in get_IecState_list():
        iecState = IecState[index]
        return True
    else:
        return False


def getVehicleState():

    return {
        "plugged": getPlugState(),
        "power_request": getPowerRequest(),
        "power_imax": getPower_imax(),
        "iso15118": getIso15118State(),
        "iec_state": getIecState()
    }


def setIecState_CB(rqt, *args):
    if setIecState(args[0]):
        vehicleInfo = getVehicleState()

        libafb.evtpush(evt_plug_id, vehicleInfo)
        return (0, vehicleInfo)
    else:
        return (1, {"Wrong VehiclePlugStatus"})


def setPowerRequest_CB(rqt, *args):
    if setPowerRequest(args[0]):
        vehicleInfo = getVehicleState()

        libafb.evtpush(evt_plug_id, vehicleInfo)
        return (0, vehicleInfo)
    else:
        return (1, {"Wrong VehiclePlugStatus"})


def setPlugState_CB(rqt, *args):
    if setPlugState(args[0]):
        vehicleInfo = getVehicleState()
        print("vehicleInfo", vehicleInfo)
        libafb.evtpush(evt_plug_id, vehicleInfo)
        return (0, vehicleInfo)
    else:
        return (1, {"Wrong VehiclePlugStatus"})


def setIso15118State_CB(rqt, *args):
    if setIso15118State(args[0]):
        vehicleInfo = getVehicleState()

        libafb.evtpush(evt_plug_id, vehicleInfo)
        return (0, vehicleInfo)
    else:
        return (1, {"Wrong VehiclePlugStatus"})


def setPower_imax_CB(rqt, *args):
    if setPower_imax(args[0]):
        vehicleInfo = getVehicleState()

        libafb.evtpush(evt_plug_id, vehicleInfo)
        return (0, vehicleInfo)
    else:
        return (1, {"Wrong Power_imax"})


# ______________________________________________________________
# network status

def getNetworkStatus():
    """
    Toggles the status of the network connections and returns their updated status.

    Parameters:
    None

    Returns:
    Tuple: A tuple containing the updated status of the wifi, mobile, ethernet, and nfc connections.
        - wifiStatus (bool): The updated status of the wifi connection.
        - mobileStatus (bool): The updated status of the mobile connection.
        - ethernetStatus (bool): The updated status of the ethernet connection.
        - nfcStatus (bool): The updated status of the nfc connection.
    """
    global wifiStatus
    global mobileStatus
    global ethernetStatus
    global nfcStatus
    wifiStatus = not wifiStatus
    mobileStatus = not mobileStatus
    ethernetStatus = not ethernetStatus
    nfcStatus = not nfcStatus
    return wifiStatus, mobileStatus, ethernetStatus, nfcStatus

# ______________________________________________________________

# ping/pong test func


def pingCB(rqt, *args):
    global count
    count += 1
    return (0, {"pong": count})  # implicit response


def subscribeCB(rqt, *args):
    libafb.notice(rqt, "subscribing api event")
    libafb.evtsubscribe(rqt, evtid)
    return 0  # implicit respond


def unsubscribeCB(rqt, *args):
    libafb.notice(rqt, "unsubscribing api event")
    libafb.evtunsubscribe(rqt, evtid)
    return 0  # implicit respond


def chargerInfoCB(rqt, *args):
    return (0, getChargerInfo())


# def argsCB(rqt, *args):
#     libafb.notice  (rqt, "actionCB query=%s", args)
#     libafb.reply (rqt, 0, {'query': args})


# executed when binder is ready to serv
def loopBinderCb(binder, nohandle):
    libafb.notice(binder, "loopBinderCb=%s", libafb.config(binder, "uid"))
    return 0  # keep running for ever


# When Api ready (state==init) start event & timer
def apiControlCb(api, state):
    global evtid
    global evt_plug_id

    apiname = libafb.config(api, "api")
    # WARNING: from Python 3.10 use switch-case as elseif replacement
    if state == "config":
        libafb.notice(api, "api=[%s] 'info':[%s]",
                      apiname, libafb.config(api, "info"))

    elif state == "ready":
        # move from second to ms
        tictime = libafb.config(api, "tictime") * 1000
        libafb.notice(
            api, "api=[%s] start event tictime=%dms", apiname, tictime)

        evtid = libafb.evtnew(api, "evt-nrj-status")
        if evtid is None:
            raise Exception("fail to create event")

        evt_plug_id = libafb.evtnew(api, 'evt-plug-status')
        if (evt_plug_id is None):
            raise Exception('fail to create plug event')

        timer = libafb.timernew(
            api, {'uid': 'py-timer', 'callback': timerCB, 'period': tictime, 'count': 0}, ["my_user-data"])
        if (timer is None):
            raise Exception('fail to create timer')

    elif state == "orphan":
        libafb.warning(api, "api=[%s] receive an orphan event", apiname)

    return 0  # 0=ok -1=fatal


# api verb list
demoVerbs = [
    {
        "uid": "ping",
        "verb": "ping",
        "callback": pingCB,
        "info": "py ping demo function",
    },
    {
        "uid": "subscribe",
        "verb": "subscribe",
        "callback": subscribeCB,
        "info": "subscribe to event",
    },
    {
        "uid": "unsubscribe",
        "verb": "unsubscribe",
        "callback": unsubscribeCB,
        "info": "unsubscribe to event",
    },
    {
        "uid": "charger-info",
        "verb": "charger-info",
        "callback": chargerInfoCB,
        "info": "charger Info",
    },
    # ______________________________________________________________
    # Vehicle event

    {
        'uid': 'set-IecState',
        'verb': 'set-IecState',
        'callback': setIecState_CB,
        'info': 'set IecState',
        'sample': get_IecState_list()
    },
    {
        'uid': 'set-PowerRequest',
        'verb': 'set-PowerRequest',
        'callback': setPowerRequest_CB,
        'info': 'set PowerRequest',
        'sample': get_PowerRequest_list()
    },
    {
        'uid': 'set-PlugState',
        'verb': 'set-PlugState',
        'callback': setPlugState_CB,
        'info': 'set PlugState',
        'sample': get_PlugState_list()
    },
    {
        'uid': 'set-Iso15118State',
        'verb': 'set-Iso15118State',
        'callback': setIso15118State_CB,
        'info': 'set Iso15118State',
        'sample': get_Iso15118State_list()
    },
    {
        'uid': 'set-Power_imax',
        'verb': 'set-Power_imax',
        'callback': setPower_imax_CB,
        'info': 'set Power imax',
        'sample': get_Power_imax_list()
    },
    {
        'uid': 'vehicleState-subscribe',
        'verb': 'subscribe_vehicleState',
        'callback': subscribe_plug_CB,
        'info': 'subscribe to plug event'
    },
    {
        'uid': 'vehicleState-unsubscribe',
        'verb': 'unsubscribe_vehicleState',
        'callback': unsubscribe_plug_CB,
        'info': 'unsubscribe to plug event'
    },
    # ______________________________________________________________
    # {'uid':'py-args', 'verb':'args', 'callback':argsCB, 'info':'py check input query', 'sample':[{'arg1':'arg-one', 'arg2':'arg-two'}, {'argA':1, 'argB':2}]},
]

# define and instantiate API
demoApi = {
    "uid": "py-tux-evse-mock",
    "api": "tux-evse-webapp-mock",
    "class": "test",
    "info": "Tux EVSE mock",
    "control": apiControlCb,
    "tictime": 1,
    "verbose": 255,
    "export": "public",
    'uri': 'unix:@tux-evse-webapp-mock',
    "verbs": demoVerbs,
}

# On target, export api
if os.environ.get("TUX_EVSE_NATIVE") is None:
    demoApi["uri"] = "sd:tux-evse-webapp-mock"
#   demoApi['uri'] ='sd:tux-evse-mock?as-api=tux-evse-webapp-mock'


# Determine roothttp directory
httpDir = os.environ.get("TUX_EVSE_WEBUI_DIR")
if httpDir is None or not os.path.exists(httpDir):
    parentCurDir = os.path.join(
        os.path.dirname(__file__), "..", "dist", "valeo")
    if os.path.exists(parentCurDir):
        httpDir = parentCurDir
if httpDir is None or not os.path.exists(httpDir):
    curDir = os.path.join(os.getcwd(), "dist", "valeo")
    if os.path.exists(parentCurDir):
        httpDir = parentCurDir
if httpDir is None or not os.path.exists(httpDir):
    if os.path.exists("/usr/redpesk/tux-evse-webapp/htdocs"):
        httpDir = "/usr/redpesk/tux-evse-webapp/htdocs"
if httpDir is None:
    httpDir = "."

# allow to force the port number only in native mode
# Note: set to 0 to let framework use/determine default port
port = int(os.environ.get("TUX_EVSE_MOCK_PORT", 1235))

# Verbosity : set to 255 => info, 1023 => debug
verbose = int(os.environ.get("TUX_EVSE_MOCK_VERBOSE", 3))

# define and instantiate libafb-binder
demoOpts = {
    "uid": "py-binder",
    "verbose": 3,
    "rootdir": ".",
    "roothttp": httpDir,
    "port": port,
}

# create alias on devtools (accessible localhost:xxxx/devtools) only when installed
devToolPath = "/usr/share/afb-ui-devtools/binder"
if os.path.exists(httpDir):
    demoOpts["alias"] = ["/devtools:" + devToolPath]

# instantiate binder and API
binder = libafb.binder(demoOpts)
myapi = libafb.apicreate(demoApi)

libafb.notice(
    binder, "CONF:\n\t verbose=%d\n\t port=%d\n\t roothttp=%s", verbose, port, httpDir
)

# enter loopstart
status = libafb.loopstart(binder, loopBinderCb)
if status < 0:
    libafb.error(binder, "OnError loopstart Exit")
else:
    libafb.notice(binder, "OnSuccess loopstart Exit")
