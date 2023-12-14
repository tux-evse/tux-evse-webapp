#!/usr/bin/python3

"""
"""

# import libafb python glue
# FIXME from afbpyglue import libafb
from enum import Enum
import time
import _afbpyglue as libafb
import random
import os

class PlugState(Enum):
    DISCONNECTED = "disconnected"
    CONNECTED_UNLOCKED = "connected and unlocked"
    CONNECTED_LOCKED = "connected and locked"
    ERROR = "error"

## static variables
count=0
durationSec=0
tic=0
evtid=None
btnStart=False
energy=44.1
batCharge=77.0
plugState=PlugState.DISCONNECTED
motorLockStatus=False
chargeDurationSec=0
instantEnergy=0.0
totalEnergy=0.0
informationArea=""
# network status
wifiStatus=False
mobileStatus=False
ethernetStatus=False
nfcStatus=False
# smart charging
iso15118Status=False
pncStatus=False
v2gStatus=False

# stopwatch function and display the timer in the UI format in hours:minutes:seconds
def stopwatch():
    """
    A stopwatch function that measures the elapsed time and displays it in the format "hours:minutes:seconds".

    Parameters:
        None

    Returns:
        elapsed_time (str): The elapsed time in the format "hours:minutes:seconds".
    """
    start_time = time.time()

    # Perform some task or wait for a certain period of time
    end_time = time.time()
    elapsed_time = end_time - start_time

    # Convert elapsed_time to hours, minutes, and seconds
    hours = int(elapsed_time // 3600)
    minutes = int((elapsed_time % 3600) // 60)
    seconds = int(elapsed_time % 60)

    # Format the elapsed time as "hours:minutes:seconds"
    elapsed_time_formatted = f"{hours:02}:{minutes:02}:{seconds:02}"

    return elapsed_time_formatted

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

def getVehicleStatus():
    """
    Retrieve the current status of the vehicle.

    This function returns the value of the global variable `PlugState`, which represents
    the state of the vehicle's plug.

    Parameters:
        None

    Returns:
        The current status of the vehicle's plug (PlugState).

    """
    global plugState
    return plugState

def authenticate():
    global nfcStatus
    if nfcStatus:
        return True
    else:
        return False

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
    global durationSec
    global energy
    temp = random.randint(0, 90)
    durationSec += 1
    energy += 0.5
    duration = '01:02:%02d' % (durationSec%60)
    return  {"energy": energy, "duration": duration, "temp": temp}

def getBatteryInfo():
    global batCharge
    batCharge += 0.1
    batStr = '{:3.1f}'.format(batCharge)
    return {'chargeValue': batStr}

# timer handle callback
def timerCB (timer, count, userdata):
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
    batInfo = getBatteryInfo()
    libafb.notice (timer, "timer':%s' tic=%d, chargerInfo={%d, %s, %d}, batteryInfo=%s",
                   libafb.config(timer, 'uid'),
                   tic,
                   chInfo['energy'],
                   chInfo['duration'],
                   chInfo['temp'],
                   batInfo['chargeValue'])
    libafb.evtpush(evtid, {'chargerInfo':chInfo, 'batteryInfo': batInfo})
    #return -1 # should exit timer
    return

## ping/pong test func
def pingCB(rqt, *args):
    global count
    count += 1
    return (0, {"pong":count}) # implicit response

def subscribeCB(rqt, *args):
    libafb.notice  (rqt, "subscribing api event")
    libafb.evtsubscribe (rqt, evtid)
    return 0 # implicit respond

def unsubscribeCB(rqt, *args):
    libafb.notice  (rqt, "unsubscribing api event")
    libafb.evtunsubscribe (rqt, evtid)
    return 0 # implicit respond


def chargerInfoCB(rqt, *args):
    return  (0, getChargerInfo())

# def argsCB(rqt, *args):
#     libafb.notice  (rqt, "actionCB query=%s", args)
#     libafb.reply (rqt, 0, {'query': args})

## executed when binder is ready to serv
def loopBinderCb(binder, nohandle):
    libafb.notice(binder, "loopBinderCb=%s", libafb.config(binder, "uid"))
    return 0 # keep running for ever


# When Api ready (state==init) start event & timer
def apiControlCb(api, state):
    global evtid

    apiname= libafb.config(api, "api")
    #WARNING: from Python 3.10 use switch-case as elseif replacement
    if state == 'config':
        libafb.notice(api, "api=[%s] 'info':[%s]", apiname, libafb.config(api, 'info'))

    elif state == 'ready':
        tictime= libafb.config(api,'tictime')*1000 # move from second to ms
        libafb.notice(api, "api=[%s] start event tictime=%dms", apiname, tictime)

        evtid= libafb.evtnew (api,'py-tux-evse-mock')
        if (evtid is None):
            raise Exception ('fail to create event')

        timer= libafb.timernew (api, {'uid':'py-timer','callback':timerCB, 'period':tictime, 'count':0}, ["my_user-data"])
        if (timer is None):
            raise Exception ('fail to create timer')

    elif state == 'orphan':
        libafb.warning(api, "api=[%s] receive an orphan event", apiname)

    return 0 # 0=ok -1=fatal



## api verb list
demoVerbs = [
    {'uid':'py-ping', 'verb':'ping', 'callback':pingCB, 'info':'py ping demo function'},
    {'uid':'py-subscribe'  , 'verb':'subscribe'  , 'callback':subscribeCB  , 'info':'subscribe to event'},
    {'uid':'py-unsubscribe', 'verb':'unsubscribe', 'callback':unsubscribeCB, 'info':'unsubscribe to event'},

    {'uid':'py-charger-info', 'verb':'charger-info', 'callback':chargerInfoCB, 'info':'charger Info'},

    # {'uid':'py-args', 'verb':'args', 'callback':argsCB, 'info':'py check input query', 'sample':[{'arg1':'arg-one', 'arg2':'arg-two'}, {'argA':1, 'argB':2}]},
]

## define and instantiate API
demoApi = {
    'uid'     : 'py-tux-evse-mock',
    'api'     : 'tux-evse-webapp-mock',
    'class'   : 'test',
    'info'    : 'Tux EVSE mock',
    'control' : apiControlCb,
    'tictime' : 1,
    'verbose' : 9,
    'export'  : 'public',
    'verbs'   : demoVerbs,
}

# On target, export api
if os.environ.get('TUX_EVSE_NATIVE') is None:
    demoApi['uri'] = 'sd:tux-evse-webapp-mock'
#   demoApi['uri'] ='sd:tux-evse-mock?as-api=tux-evse-webapp-mock'



# Determine roothttp directory
httpDir = os.environ.get('TUX_EVSE_WEBUI_DIR')
if httpDir is None or not os.path.exists(httpDir):
    parentCurDir = os.path.join(os.path.dirname(__file__), '..', 'dist', 'valeo')
    if os.path.exists(parentCurDir):
        httpDir = parentCurDir
if httpDir is None or not os.path.exists(httpDir):
    curDir = os.path.join(os.getcwd(), 'dist', 'valeo')
    if os.path.exists(parentCurDir):
        httpDir = parentCurDir
if httpDir is None or not os.path.exists(httpDir):
    if os.path.exists('/usr/redpesk/tux-evse-webapp/htdocs'):
        httpDir = '/usr/redpesk/tux-evse-webapp/htdocs'
if httpDir is None:
    httpDir = '.'

# allow to force the port number only in native mode
# Note: set to 0 to let framework use/determine default port
port = int(os.environ.get('TUX_EVSE_MOCK_PORT', 1235))

# define and instantiate libafb-binder
demoOpts = {
    'uid'     : 'py-binder',
    'verbose' : 1023,
    'rootdir' : '.',
    'roothttp' : httpDir,
    'port': port,
}

# create alias on devtools (accessible localhost:xxxx/devtools) only when installed
devToolPath = '/usr/share/afb-ui-devtools/binder'
if os.path.exists(httpDir):
    demoOpts['alias'] = ['/devtools:' + devToolPath]

# instantiate binder and API
binder= libafb.binder(demoOpts)
myapi = libafb.apicreate(demoApi)

libafb.notice(binder, "roothttp=%s", httpDir)
libafb.notice(binder, "port=%d", port)

# enter loopstart
status= libafb.loopstart(binder, loopBinderCb)
if status < 0 :
    libafb.error (binder, "OnError loopstart Exit")
else:
    libafb.notice(binder, "OnSuccess loopstart Exit")
