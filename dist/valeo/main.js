"use strict";
(self["webpackChunkvaleo"] = self["webpackChunkvaleo"] || []).push([["main"],{

/***/ 4493:
/*!*********************************************************!*\
  !*** ./src/app/@core/services/AFB-websocket.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AFBWebSocketService: () => (/* binding */ AFBWebSocketService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 2513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 8071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 5400);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 6231);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 2235);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 4520);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 1891);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 1527);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 9736);
/* harmony import */ var _afb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../afb */ 3190);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 1699);




class AFBWebSocketService {
  constructor() {
    this._wsConnectSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this._wsDisconnectSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this._wsEventSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this._status = {
      connected: false
    };
    this._statusSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject(this._status);
    this._isInitDone = new rxjs__WEBPACK_IMPORTED_MODULE_3__.ReplaySubject(1);
  }
  /**
   * Initializes the class with a base URL and an optional initial token.
   *
   * @param {string} base - The base URL for the class.
   * @param {string} [initialToken] - An optional initial token.
   */
  Init(base, initialToken) {
    this.afb = new _afb__WEBPACK_IMPORTED_MODULE_0__.AFB({
      base: base,
      token: initialToken
    });
    this.wsConnect$ = this._wsConnectSubject.asObservable();
    this.wsDisconnect$ = this._wsDisconnectSubject.asObservable();
    this.wsEvent$ = this._wsEventSubject.asObservable();
    this.Status$ = this._statusSubject.asObservable();
    this.InitDone$ = this._isInitDone.asObservable();
  }
  /**
   * Sets the URL and port for the connection.
   *
   * @param {string} location - The location of the connection.
   * @param {string} [port] - The port of the connection. If not provided, it will use an empty string.
   */
  SetURL(location, port) {
    this.conn_location = location;
    this.conn_port = port || '';
    this.afb.setURL(location, port);
  }
  /**
   * Returns the URL based on the connection location and port.
   *
   * @return {string} The URL.
   */
  GetUrl() {
    if (this.conn_port !== '' && this.conn_port !== undefined) {
      return this.conn_location + ':' + this.conn_port;
    }
    return this.conn_location;
  }
  /**
   * Establishes a websocket connection.
   *
   * @return {Error | null} An error if the connection cannot be established, otherwise null.
   */
  Connect() {
    // Establish websocket connection
    this.ws = new this.afb.ws(
    //  onopen
    event => {
      this._NotifyServerState(true);
      this._wsConnectSubject.next(event);
      this._isInitDone.next(true);
    },
    // onerror
    () => {
      this._isInitDone.next(false);
      console.error('Can not open websocket');
    });
    /**
     * Sets the callback function to be executed when the WebSocket connection is closed.
     *
     * @param {CloseEvent} event - The event object representing the WebSocket connection close event.
     */
    this.ws.onclose = event => {
      this._isInitDone.next(false);
      this._NotifyServerState(false);
      this._wsDisconnectSubject.next(event);
    };
    return null;
  }
  /**
   * Disconnects from the server.
   *
   * @param {type} paramName - description of parameter
   * @return {type} description of return value
   */
  Disconnect() {
    // TODO : close all subjects
    this._NotifyServerState(false);
    this.ws.close();
  }
  /**
   * Send data to the ws server
   */
  // FIXME Send must return an observable
  // Send(method: string, params: object | string): Observable<IAfbResponse> {
  //     const param = this.CheckQuery(params);
  //     return <Observable<IAfbResponse>>this._isInitDone.pipe(
  //         filter(done => done),
  //         map(() => {
  //             return from(this.ws.call(method, param)
  //                 .then((obj) => {
  //                     return obj;
  //                 },
  //                 ).catch((err) => {
  //                     return err;
  //                 },
  //                 )
  //             );
  //         }),
  //         take(1),
  //         switchMap((data: any) => {
  //             return data;
  //         })
  //     );
  // }
  Send(method, params) {
    const param = this.CheckQuery(params);
    return this._isInitDone.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.filter)(done => done), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.switchMap)(() => {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.from)(this.ws.call(method, param).then(obj => {
        return obj;
      }).catch(err => {
        return err;
      }));
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.take)(1));
  }
  /**
   * Check if the given string is a valid JSON.
   *
   * @param {string} str - The string to be checked.
   * @return {boolean} Returns true if the string is a valid JSON, otherwise returns false.
   */
  CheckIfJson(str) {
    if (str === undefined || str === '' || !str.trim().length) {
      return true;
    }
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  /**
   * Check the query parameters and parse them if necessary.
   *
   * @param {object | string} params - The query parameters to check and parse.
   * @return {object} - The parsed query parameters.
   */
  CheckQuery(params) {
    if (!params || params === undefined) {
      return '{}';
    }
    return params;
  }
  /**
   * Syntax highlights JSON data.
   *
   * @param {any} json - The JSON data to be syntax highlighted.
   * @return {string} The syntax highlighted JSON data.
   */
  syntaxHighlight(json) {
    if (typeof json !== 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'text-info';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-primary';
        } else {
          cls = 'text-success';
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-danger';
      } else if (/null/.test(match)) {
        cls = 'text-warning';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }
  /**
   * Receive data from opened websocket
   */
  OnEvent(eventName) {
    // Convert websocket Event based on callback to an Observable
    return rxjs__WEBPACK_IMPORTED_MODULE_8__.Observable.create(observer => {
      this.ws.onevent(eventName, event => {
        observer.next(event);
      });
    });
  }
  /**
   * Notifies the server state.
   *
   * @param {boolean} connected - The connection state.
   * @param {number} [attempt] - The number of connection attempts.
   */
  _NotifyServerState(connected, attempt) {
    this._status.connected = connected;
    if (connected) {
      this._status.reconnect_failed = false;
    }
    this._statusSubject.next(Object.assign({}, this._status));
  }
  // getInfoVerbs(): Observable<Array<object>> {
  //     return this.getApis().pipe(
  //         map((data) => {
  //             const tasks$ = [];
  //             data.forEach(api => {
  //                 tasks$.push(this.Send(api + '/info', {}).pipe(
  //                     map(d => {
  //                         if (d.response) {
  //                             return { 'api': api, 'info': d.response };
  //                         }
  //                     })
  //                 ));
  //             });
  //             return forkJoin(...tasks$);
  //         }),
  //         switchMap(res => {
  //             return res;
  //         })
  //     );
  // }
  /**
   * Retrieves the list of APIs by sending a request to the server.
   *
   * @return {Observable<Array<string>>} An observable that emits an array of strings representing the APIs.
   */
  getApis() {
    return this.Send('monitor/get', {
      'apis': false
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(data => {
      const apis = [];
      const keys = Object.keys(data.response.apis);
      const results = keys.map(key => ({
        key: key,
        value: data.response.apis[key]
      }));
      results.forEach(value => {
        if (value.key !== 'monitor') {
          apis.push(value.key);
        }
      });
      return apis;
    }));
  }
  /**
   * Retrieves the AFBApis by sending a GET request to the 'monitor/get' endpoint.
   *
   * @return {Observable<AFBApis>} An observable that emits the retrieved AFBApis.
   */
  Discover() {
    return this.Send('monitor/get', {
      'apis': true
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.map)(data => {
      return this._GetAFBApis(data.response);
    }));
  }
  /**
   * Generates the function comment for the private _GetAFBApis function.
   *
   * @param {any} data - The input data for the function.
   * @return {AFBApis} The array of AFBApis generated by the function.
   */
  _GetAFBApis(data) {
    const Apis = [];
    const keys = Object.keys(data.apis);
    const results = keys.map(key => ({
      key: key,
      value: data.apis[key]
    }));
    results.forEach(value => {
      if (value.key !== 'monitor') {
        const AFBVerbs2 = this._GetAFBVerbs(value);
        const api = {
          api: value.key,
          title: value.value.info.title,
          version: value.value.info.version,
          description: value.value.info.description,
          verbs: AFBVerbs2
        };
        Apis.push(api);
      }
    });
    return Apis;
  }
  /**
   * Retrieves the AFB verbs from the given value.
   *
   * @param {any} value - The value to retrieve the AFB verbs from.
   * @return {Array<AFBVerb>} An array of AFBVerb objects representing the AFB verbs.
   */
  _GetAFBVerbs(value) {
    const AFBVerbs = [];
    const verbs = Object.keys(value.value.paths);
    const paths = verbs.map(path => ({
      path: path,
      verb: value.value.paths[path]
    }));
    paths.forEach(path => {
      const verb = {
        verb: path.path,
        query: '',
        description: path.verb.get.responses[200].description
      };
      AFBVerbs.push(verb);
    });
    return AFBVerbs;
  }
  static #_ = this.ɵfac = function AFBWebSocketService_Factory(t) {
    return new (t || AFBWebSocketService)();
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjectable"]({
    token: AFBWebSocketService,
    factory: AFBWebSocketService.ɵfac
  });
}

/***/ }),

/***/ 5359:
/*!************************************************!*\
  !*** ./src/app/@core/services/auth-service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 4520);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 1891);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AFB-websocket.service */ 4493);



class AuthService {
  constructor(afbService) {
    this.afbService = afbService;
    this.apiName = 'auth';
    // Now subscribe to event
    this.afbService.InitDone$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_1__.filter)(done => done), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.switchMap)(() => {
      return this.afbService.Send(this.apiName + '/subscribe', 'true');
    })).subscribe(res => {
      if (res.request.code !== 0) {
        console.error('ERROR while subscribing to event:', res);
      }
    });
  }
  static #_ = this.ɵfac = function AuthService_Factory(t) {
    return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: AuthService,
    factory: AuthService.ɵfac
  });
}

/***/ }),

/***/ 4629:
/*!************************************************************!*\
  !*** ./src/app/@core/services/charging-manager-service.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChMgrService: () => (/* binding */ ChMgrService),
/* harmony export */   eAuthMsg: () => (/* binding */ eAuthMsg),
/* harmony export */   eIsoState: () => (/* binding */ eIsoState),
/* harmony export */   ePlugState: () => (/* binding */ ePlugState),
/* harmony export */   ePowerRequest: () => (/* binding */ ePowerRequest)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 8071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 4520);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 1891);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 3839);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 9736);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 1527);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AFB-websocket.service */ 4493);



var ePlugState;
(function (ePlugState) {
  ePlugState["PlugIn"] = "plugin";
  ePlugState["Lock"] = "lock";
  ePlugState["Error"] = "error";
  ePlugState["PlugOut"] = "plugout";
  ePlugState["Unknown"] = "unknown";
})(ePlugState || (ePlugState = {}));
var ePowerRequest;
(function (ePowerRequest) {
  ePowerRequest["Start"] = "start";
  ePowerRequest["Charging"] = "charging";
  ePowerRequest["Idle"] = "idle";
  ePowerRequest[ePowerRequest["Stop"] = 0] = "Stop";
  ePowerRequest["Unknown"] = "unknown";
})(ePowerRequest || (ePowerRequest = {}));
var eIsoState;
(function (eIsoState) {
  eIsoState["Iso20"] = "iso20";
  eIsoState["Iso2"] = "iso2";
  eIsoState["Iso3"] = "iso3";
  eIsoState["Iec"] = "iec";
  eIsoState["Unset"] = "unset";
})(eIsoState || (eIsoState = {}));
var eAuthMsg;
(function (eAuthMsg) {
  eAuthMsg["Done"] = "done";
  eAuthMsg["Fail"] = "fail";
  eAuthMsg["Pending"] = "pending";
  eAuthMsg["Idle"] = "idle";
  eAuthMsg["Unknown"] = "unknown";
})(eAuthMsg || (eAuthMsg = {}));
class ChMgrService {
  constructor(afbService) {
    this.afbService = afbService;
    this.apiName = 'chmgr';
    this.chargingState = {
      updated: false,
      imax: 0,
      pmax: 0,
      plugged: ePlugState.Unknown,
      power: ePowerRequest.Unknown,
      iso: eIsoState.Unset,
      auth: eAuthMsg.Unknown
    };
    this.chargingStateSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState);
    this.plugStateSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState.plugged);
    this.powerStateSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState.power);
    this.isoStateSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState.iso);
    this.authStateSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState.auth);
    this.StateSub$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.chargingState);
    // Now subscribe to event
    this.afbService.InitDone$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.filter)(done => done), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.switchMap)(() => {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.combineLatest)([
      // this.afbService.Send(this.apiName + '/state', { 'action': 'subscribe' }),
      this.afbService.Send(this.apiName + '/subscribe', true)]);
    })).subscribe(res => {
      if (res.length !== 1) {
        console.error('ERROR while subscribing to event for ', this.apiName, res);
        return;
      }
      // if (res[0].request.status !== 'success') {
      //     console.error('ERROR while subscribing to charging-state (/state) to event ', res[0]);
      // }
      if (res[0].request.status !== 'success') {
        console.error('ERROR while subscribing to subscribe-msg (/subscribe) to event ', res[0]);
      }
      // TODO - populate initial state
      this.getChargingState().subscribe(res => {
        if (res?.plugged) {
          console.log('Charging state plugged', res?.plugged);
          this.chargingState.plugged = res?.plugged;
          this.plugStateSub.next(this.chargingState.plugged);
        }
        if (res?.iso) {
          console.log('Charging state iso', res?.iso);
          this.chargingState.iso = res?.iso;
          this.isoStateSub.next(this.chargingState.iso);
        }
        if (res?.auth) {
          console.log('Charging state auth', res?.auth);
          this.chargingState.auth = res?.auth;
          this.authStateSub.next(this.chargingState.auth);
        }
        if (res?.power) {
          console.log('Charging state power', res?.power);
          if (typeof res.power === 'string') {
            if (res.power === 'idle') {
              this.chargingState.power = ePowerRequest.Idle;
            } else if (res.power === 'charging') {
              this.chargingState.power = ePowerRequest.Charging;
            } else if (res.power === 'start') {
              this.chargingState.power = ePowerRequest.Start;
            }
          } else if (typeof res.power === 'object') {
            if ('stop' in res.power) {
              this.chargingState.power = ePowerRequest.Stop;
            } else if ('charging' in res.power) {
              this.chargingState.power = ePowerRequest.Charging;
            }
          }
          this.powerStateSub.next(this.chargingState.power);
        }
      });
      //  Update data on event in WS
      this.afbService.OnEvent('*').subscribe(data => {
        if (data.event === this.apiName + '/msg') {
          console.log('Charging state updated', data);
          if (data && data.data) {
            if (data.data?.plugged) {
              console.log('Charging state plugged', data.data?.plugged);
              this.chargingState.plugged = data.data?.plugged;
              this.plugStateSub.next(this.chargingState.plugged);
            }
            if (data.data?.power) {
              console.log('Charging state power', data.data?.power);
              if (typeof data.data.power === 'string') {
                if (data.data.power === 'idle') {
                  this.chargingState.power = ePowerRequest.Idle;
                } else if (data.data.power === 'charging') {
                  this.chargingState.power = ePowerRequest.Charging;
                } else if (data.data.power === 'start') {
                  this.chargingState.power = ePowerRequest.Start;
                }
              } else if (typeof data.data.power === 'object') {
                if ('stop' in data.data.power) {
                  this.chargingState.power = ePowerRequest.Stop;
                } else if ('charging' in data.data.power) {
                  this.chargingState.power = ePowerRequest.Charging;
                }
              }
              this.powerStateSub.next(this.chargingState.power);
            }
            if (data.data?.iso) {
              console.log('Charging state iso', data.data?.iso);
              this.chargingState.iso = data.data?.iso;
              this.isoStateSub.next(this.chargingState.iso);
            }
            if (data.data?.auth) {
              console.log('Charging state auth', data.data?.auth);
              this.chargingState.auth = data.data?.auth;
              this.authStateSub.next(this.chargingState.auth);
            }
            // const cm = <IChargingMsg>data.data;
            // this.chargingState = <IChargingState>{auth: cm.auth,iso: cm.iso,plugged: cm.plugged,power: cm.power};
            // this.powerStateSub.next(this.chargingState.power);
            // this.authStateSub.next(this.chargingState.auth);
            // this.isoStateSub.next(this.chargingState.iso);
            // this.plugStateSub.next(this.chargingState.plugged);
            // this.chargingStateSub.next(this.chargingState);
          }
        } else {
          // console.error('Update data on event in WS : Unknown event api name:', data);
        }
      });
    });
  }
  getChargingState() {
    return this.afbService.Send(this.apiName + '/state', {
      'action': 'read'
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.map)(data => data?.response), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.take)(1));
  }
  getChargingState$() {
    return this.chargingStateSub.asObservable();
  }
  getPlugState$() {
    return this.plugStateSub.asObservable();
  }
  getPowerState$() {
    return this.powerStateSub.asObservable();
  }
  getIsoState$() {
    return this.isoStateSub.asObservable();
  }
  getAuthState$() {
    return this.authStateSub.asObservable();
  }
  static #_ = this.ɵfac = function ChMgrService_Factory(t) {
    return new (t || ChMgrService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
    token: ChMgrService,
    factory: ChMgrService.ɵfac
  });
}

/***/ }),

/***/ 1911:
/*!************************************************!*\
  !*** ./src/app/@core/services/dbus-service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DbusService: () => (/* binding */ DbusService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 8071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 4520);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 1891);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AFB-websocket.service */ 4493);



class DbusService {
  constructor(afbService) {
    this.afbService = afbService;
    this.apiName = 'dbus';
    this.dbusData = '';
    this.dbusDataSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.dbusData);
    // Now subscribe to event
    this.afbService.InitDone$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.filter)(done => done), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.switchMap)(() => {
      return this.afbService.Send(this.apiName + '/subscribe_nfc', '');
    })).subscribe(res => {
      if (res.request.code !== 0) {
        console.error('ERROR while subscribing to event:', res);
      }
      //  Update data on event in WS
      this.afbService.OnEvent('dbus/nfc_device_exists').subscribe(data => {
        if (data && data.data) {
          this.dbusData = data.data;
          this.dbusDataSub.next(this.dbusData);
        } else {
          console.error('invalid tension data:', data);
        }
      });
    });
  }
  getDbusData$() {
    return this.dbusDataSub.asObservable();
  }
  static #_ = this.ɵfac = function DbusService_Factory(t) {
    return new (t || DbusService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: DbusService,
    factory: DbusService.ɵfac
  });
}

/***/ }),

/***/ 6498:
/*!************************************************!*\
  !*** ./src/app/@core/services/engy-service.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EngyService: () => (/* binding */ EngyService),
/* harmony export */   eMeterTagSet: () => (/* binding */ eMeterTagSet)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 8071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 4520);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 1891);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 3839);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AFB-websocket.service */ 4493);



var eMeterTagSet;
(function (eMeterTagSet) {
  eMeterTagSet["Current"] = "current";
  eMeterTagSet["Tension"] = "tension";
  eMeterTagSet["Power"] = "power";
  eMeterTagSet["OverCurrent"] = "overcurrent";
  eMeterTagSet["Energy"] = "energy";
  eMeterTagSet["Unset"] = "unset";
})(eMeterTagSet || (eMeterTagSet = {}));
class EngyService {
  constructor(afbService) {
    this.afbService = afbService;
    this.apiName = 'engy';
    this.meterData = {
      [eMeterTagSet.Current]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      },
      [eMeterTagSet.Tension]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      },
      [eMeterTagSet.Power]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      },
      [eMeterTagSet.OverCurrent]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      },
      [eMeterTagSet.Energy]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      },
      [eMeterTagSet.Unset]: {
        total: 0,
        l1: 0,
        l2: 0,
        l3: 0
      }
    };
    this.engyDataSub = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.meterData);
    // Now subscribe to event
    this.afbService.InitDone$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.filter)(done => done), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.switchMap)(() => {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.combineLatest)([this.afbService.Send(this.apiName + '/tension', {
        'action': 'subscribe'
      }), this.afbService.Send(this.apiName + '/energy', {
        'action': 'subscribe'
      }), this.afbService.Send(this.apiName + '/current', {
        'action': 'subscribe'
      }), this.afbService.Send(this.apiName + '/power', {
        'action': 'subscribe'
      })]);
    })).subscribe(res => {
      if (res.length !== 4) {
        console.error('ERROR while subscribing to event for ', this.apiName, res);
        return;
      }
      for (let r of res) {
        if (r.request.status !== 'success') {
          console.error('ERROR while subscribing, api', this.apiName, ' res=', r);
        }
      }
      //  Update data on event in WS
      this.afbService.OnEvent('engy/tension').subscribe(data => {
        if (data && data.data) {
          this.meterData[eMeterTagSet.Tension] = data.data;
          // console.log('SLY tension: ', data.data);
          this.engyDataSub.next(this.meterData);
        } else {
          console.error('invalid tension data:', data);
        }
      });
      this.afbService.OnEvent('engy/energy').subscribe(data => {
        if (data && data.data) {
          this.meterData[eMeterTagSet.Energy] = data.data;
          // console.log('SLY energy:', data.data);
          this.engyDataSub.next(this.meterData);
        } else {
          console.error('invalid energy data:', data);
        }
      });
      this.afbService.OnEvent('engy/current').subscribe(data => {
        if (data && data.data) {
          this.meterData[eMeterTagSet.Current] = data.data;
          // console.log('SLY current: ', data.data);
          this.engyDataSub.next(this.meterData);
        } else {
          console.error('invalid current data:', data);
        }
      });
      this.afbService.OnEvent('engy/power').subscribe(data => {
        if (data && data.data) {
          this.meterData[eMeterTagSet.Power] = data.data;
          // console.log('SLY power: ', data.data);
          this.engyDataSub.next(this.meterData);
        } else {
          console.error('invalid power data:', data);
        }
      });
    });
  }
  getAllEngyData$() {
    return this.engyDataSub.asObservable();
  }
  static #_ = this.ɵfac = function EngyService_Factory(t) {
    return new (t || EngyService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService));
  };
  static #_2 = this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: EngyService,
    factory: EngyService.ɵfac
  });
}

/***/ }),

/***/ 3966:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);



const routes = [];
class AppRoutingModule {
  static #_ = this.ɵfac = function AppRoutingModule_Factory(t) {
    return new (t || AppRoutingModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
    type: AppRoutingModule
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule.forRoot(routes), _angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__.RouterModule]
  });
})();

/***/ }),

/***/ 6401:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./@core/services/AFB-websocket.service */ 4493);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 7947);
/* harmony import */ var _status_plug_status_plug_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./status-plug/status-plug.component */ 2627);
/* harmony import */ var _charge_information_charge_information_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./charge-information/charge-information.component */ 9714);
/* harmony import */ var _zone_message_zone_message_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./zone-message/zone-message.component */ 519);
/* harmony import */ var _smart_charging_smart_charging_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./smart-charging/smart-charging.component */ 7131);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header/header.component */ 3767);
/* harmony import */ var _borne_information_borne_information_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./borne-information/borne-information.component */ 2791);
/* harmony import */ var _status_nfc_status_nfc_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./status-nfc/status-nfc.component */ 7595);
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./footer/footer.component */ 6515);











class AppComponent {
  constructor(afbService) {
    this.afbService = afbService;
    this.title = 'valeo';
    afbService.Init('api', 'HELLO');
    // if (environment.production) {
    this.afbService.SetURL(window.location.host);
    // } else {
    //     afbService.SetURL('localhost', '1235');
    // }
  }
  static #_ = this.ɵfac = function AppComponent_Factory(t) {
    return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: AppComponent,
    selectors: [["app-root"]],
    decls: 28,
    vars: 0,
    consts: [[1, "global", "m-2", "border", "p-2", "border-dark", "rounded-10", "border-3"], [1, "row"], [1, "col"], [1, "hr", "hr-blurry"], [1, "col-4", "col-md-4"], [1, "row", "align-items-center"], [1, "col-12", "col-md-4", "mb-3", "text-center"], [1, "col-12", "col-md-4", "mb-3"], [1, "row", "text-end"]],
    template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "app-header");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "div", 1)(3, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "hr", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 1)(6, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](7, "app-status-plug");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](9, "app-borne-information");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](11, "app-status-nfc");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "div", 1)(13, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](14, "hr", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "div", 5)(16, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](17, "app-charge-information");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](19, "app-smart-charging");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "div", 1)(21, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](22, "hr", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](23, "app-zone-message");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "div", 8)(25, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](26, "app-footer");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](27, "router-outlet");
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterOutlet, _status_plug_status_plug_component__WEBPACK_IMPORTED_MODULE_1__.StatusPlugComponent, _charge_information_charge_information_component__WEBPACK_IMPORTED_MODULE_2__.ChargeInformationComponent, _zone_message_zone_message_component__WEBPACK_IMPORTED_MODULE_3__.ZoneMessageComponent, _smart_charging_smart_charging_component__WEBPACK_IMPORTED_MODULE_4__.SmartChargingComponent, _header_header_component__WEBPACK_IMPORTED_MODULE_5__.HeaderComponent, _borne_information_borne_information_component__WEBPACK_IMPORTED_MODULE_6__.BorneInformationComponent, _status_nfc_status_nfc_component__WEBPACK_IMPORTED_MODULE_7__.StatusNfcComponent, _footer_footer_component__WEBPACK_IMPORTED_MODULE_8__.FooterComponent],
    styles: ["body[_ngcontent-%COMP%] {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\n*[_ngcontent-%COMP%] {\n  font-family: Roboto, Helvetica, sans-serif;\n}\n\n.container-md[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}\n\n.global[_ngcontent-%COMP%] {\n  border: 3px solid;\n  border-radius: 25px;\n}\n\n.row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  margin: -10px; \n\n}\n\n.col[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  padding: 10px;\n}\n\n\n\n.col-1[_ngcontent-%COMP%] {\n  width: 20%;\n}\n\n.col-3[_ngcontent-%COMP%] {\n  width: 33.33%;\n}\n\n.col-5[_ngcontent-%COMP%] {\n  width: 50%;\n}\n\n\n\n@media screen and (max-width: 600px) {\n  .col-1[_ngcontent-%COMP%], .col-3[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksOEJBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLHNCQUFBO0FBQ0o7O0FBRUE7RUFDSSwwQ0FBQTtBQUNKOztBQUVBO0VBQ0ksaUJBQUE7RUFDQSxjQUFBO0VBQ0EsYUFBQTtBQUNKOztBQUVBO0VBQ0ksaUJBQUE7RUFDQSxtQkFBQTtBQUNKOztBQUVBO0VBQ0ksYUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBLEVBQUEsOEJBQUE7QUFDSjs7QUFFQTtFQUNJLHNCQUFBO0VBQ0EsYUFBQTtBQUNKOztBQUVBLHVCQUFBO0FBQ0E7RUFBUyxVQUFBO0FBRVQ7O0FBREE7RUFBUyxhQUFBO0FBS1Q7O0FBSkE7RUFBUyxVQUFBO0FBUVQ7O0FBTkEsb0NBQUE7QUFDQTtFQUNJO0lBQ0ksV0FBQTtFQVNOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJib2R5IHtcbiAgICBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuKiB7XG4gICAgZm9udC1mYW1pbHk6IFJvYm90bywgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xuICB9XG5cbi5jb250YWluZXItbWQge1xuICAgIG1heC13aWR0aDogMTIwMHB4O1xuICAgIG1hcmdpbjogMCBhdXRvO1xuICAgIHBhZGRpbmc6IDIwcHg7XG59XG5cbi5nbG9iYWwge1xuICAgIGJvcmRlcjogM3B4IHNvbGlkO1xuICAgIGJvcmRlci1yYWRpdXM6IDI1cHg7XG59XG5cbi5yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC13cmFwOiB3cmFwO1xuICAgIG1hcmdpbjogLTEwcHg7IC8qIEFkanVzdCBmb3IgY29sdW1uIHBhZGRpbmcgKi9cbn1cblxuLmNvbCB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBwYWRkaW5nOiAxMHB4O1xufVxuXG4vKiBSZXNwb25zaXZlIGNvbHVtbnMgKi9cbi5jb2wtMSB7IHdpZHRoOiAyMCU7IH1cbi5jb2wtMyB7IHdpZHRoOiAzMy4zMyU7IH1cbi5jb2wtNSB7IHdpZHRoOiA1MCU7IH1cblxuLyogQWRqdXN0bWVudHMgZm9yIHNtYWxsZXIgc2NyZWVucyAqL1xuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcbiAgICAuY29sLTEsIC5jb2wtMyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 8629:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 3966);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 6401);
/* harmony import */ var _valeo_charger_valeo_charger_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./valeo-charger/valeo-charger.component */ 5083);
/* harmony import */ var _date_date_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./date/date.component */ 6753);
/* harmony import */ var _time_time_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./time/time.component */ 1719);
/* harmony import */ var _status_plug_status_plug_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./status-plug/status-plug.component */ 2627);
/* harmony import */ var _status_battery_status_battery_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./status-battery/status-battery.component */ 4805);
/* harmony import */ var _zone_message_zone_message_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./zone-message/zone-message.component */ 519);
/* harmony import */ var _smart_charging_smart_charging_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./smart-charging/smart-charging.component */ 7131);
/* harmony import */ var _details_details_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./details/details.component */ 4712);
/* harmony import */ var _core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./@core/services/AFB-websocket.service */ 4493);
/* harmony import */ var _core_services_engy_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./@core/services/engy-service */ 6498);
/* harmony import */ var _charge_information_charge_information_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./charge-information/charge-information.component */ 9714);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./header/header.component */ 3767);
/* harmony import */ var _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @ng-bootstrap/ng-bootstrap */ 6101);
/* harmony import */ var _start_stop_start_stop_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./start-stop/start-stop.component */ 4034);
/* harmony import */ var _borne_information_borne_information_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./borne-information/borne-information.component */ 2791);
/* harmony import */ var _status_nfc_status_nfc_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./status-nfc/status-nfc.component */ 7595);
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./footer/footer.component */ 6515);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./@core/services/auth-service */ 5359);
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./@core/services/charging-manager-service */ 4629);
/* harmony import */ var _core_services_dbus_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./@core/services/dbus-service */ 1911);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/core */ 1699);
























class AppModule {
  static #_ = this.ɵfac = function AppModule_Factory(t) {
    return new (t || AppModule)();
  };
  static #_2 = this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineNgModule"]({
    type: AppModule,
    bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
  });
  static #_3 = this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵdefineInjector"]({
    providers: [_core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_10__.AFBWebSocketService, _core_services_engy_service__WEBPACK_IMPORTED_MODULE_11__.EngyService, _core_services_auth_service__WEBPACK_IMPORTED_MODULE_18__.AuthService, _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_19__.ChMgrService, _core_services_dbus_service__WEBPACK_IMPORTED_MODULE_20__.DbusService],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_23__.NgbModule]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_21__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _valeo_charger_valeo_charger_component__WEBPACK_IMPORTED_MODULE_2__.ValeoChargerComponent, _date_date_component__WEBPACK_IMPORTED_MODULE_3__.DateComponent, _time_time_component__WEBPACK_IMPORTED_MODULE_4__.TimeComponent, _status_plug_status_plug_component__WEBPACK_IMPORTED_MODULE_5__.StatusPlugComponent, _status_battery_status_battery_component__WEBPACK_IMPORTED_MODULE_6__.StatusBatteryComponent, _charge_information_charge_information_component__WEBPACK_IMPORTED_MODULE_12__.ChargeInformationComponent, _zone_message_zone_message_component__WEBPACK_IMPORTED_MODULE_7__.ZoneMessageComponent, _smart_charging_smart_charging_component__WEBPACK_IMPORTED_MODULE_8__.SmartChargingComponent, _details_details_component__WEBPACK_IMPORTED_MODULE_9__.DetailsComponent, _header_header_component__WEBPACK_IMPORTED_MODULE_13__.HeaderComponent, _start_stop_start_stop_component__WEBPACK_IMPORTED_MODULE_14__.StartStopComponent, _borne_information_borne_information_component__WEBPACK_IMPORTED_MODULE_15__.BorneInformationComponent, _status_nfc_status_nfc_component__WEBPACK_IMPORTED_MODULE_16__.StatusNfcComponent, _footer_footer_component__WEBPACK_IMPORTED_MODULE_17__.FooterComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_22__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _ng_bootstrap_ng_bootstrap__WEBPACK_IMPORTED_MODULE_23__.NgbModule]
  });
})();

/***/ }),

/***/ 2791:
/*!******************************************************************!*\
  !*** ./src/app/borne-information/borne-information.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BorneInformationComponent: () => (/* binding */ BorneInformationComponent)
/* harmony export */ });
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/charging-manager-service */ 4629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);




function BorneInformationComponent_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "span", 7);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("innerHTML", ctx_r0.stationText.get(ctx_r0.stationStatus), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeHtml"]);
  }
}
class BorneInformationComponent {
  constructor(ChMgrService) {
    this.ChMgrService = ChMgrService;
    this.stationStatus = _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Unknown;
    this.stationText = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Charging, "<span class='charging'>Charging</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Start, "<span class='available'>Available</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Stop, "<span class='out-of-order'>Out of</br>order</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Idle, "<span class='intermediate'>Idle</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Unknown, "<span class='error'>Unknown</span>"]]);
    this.classMappings = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Charging, 'charging'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Start, 'available'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Stop, 'out-of-order'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Idle, 'intermediate'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Unknown, 'out-of-order']]);
  }
  ngOnInit() {
    this.ChMgrService.getPowerState$().subscribe(s => this.stationStatus = s);
    console.log(this.stationText.get(this.stationStatus));
  }
  static #_ = this.ɵfac = function BorneInformationComponent_Factory(t) {
    return new (t || BorneInformationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ChMgrService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: BorneInformationComponent,
    selectors: [["app-borne-information"]],
    decls: 7,
    vars: 2,
    consts: [[1, "picto", "drop-shadow", 2, "text-align", "center", 3, "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "50%", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-ev-station"], ["d", "M3.5 2a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5zm2.131 10.46H4.14v-.893h1.403v-.505H4.14v-.855h1.49v-.54H3.485V13h2.146zm1.316.54h.794l1.106-3.333h-.733l-.74 2.615h-.031l-.747-2.615h-.764z"], ["d", "M3 0a2 2 0 0 0-2 2v13H.5a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1H11v-4a1 1 0 0 1 1 1v.5a1.5 1.5 0 0 0 3 0V4a.5.5 0 0 0-.146-.354l-.5-.5a.5.5 0 0 0-.707 0l-.5.5A.5.5 0 0 0 13 4v3c0 .71.38 1.096.636 1.357l.007.008c.253.258.357.377.357.635v3.5a.5.5 0 1 1-1 0V12a2 2 0 0 0-2-2V2a2 2 0 0 0-2-2zm7 2v13H2V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"], [1, "drop-shadow", 2, "font-weight", "800"], [1, "", 2, "text-align", "center", "font-size", "20px"], [3, "innerHTML", 4, "ngIf"], [3, "innerHTML"]],
    template: function BorneInformationComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "svg", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "path", 2)(3, "path", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 4)(5, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BorneInformationComponent_span_6_Template, 1, 1, "span", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.classMappings.get(ctx.stationStatus));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.stationStatus);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 9714:
/*!********************************************************************!*\
  !*** ./src/app/charge-information/charge-information.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChargeInformationComponent: () => (/* binding */ ChargeInformationComponent)
/* harmony export */ });
/* harmony import */ var _core_services_engy_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/engy-service */ 6498);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 2513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 274);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 6575);





function ChargeInformationComponent_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "div", 1)(2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "svg", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "path", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " Voltage :");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 1)(9, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](11, "path", 6)(12, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, " Charging energy :");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 1)(17, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](19, "path", 6)(20, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](22, " Charging current :");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 1)(25, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](27, "path", 6)(28, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](30, " Charging power :");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const engyData_r1 = ctx.ngIf;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", engyData_r1[ctx_r0.enumMeterTagSet.Tension].total / 1000, " V ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", engyData_r1[ctx_r0.enumMeterTagSet.Energy].total / 1000, " Wh ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", engyData_r1[ctx_r0.enumMeterTagSet.Current].total / 1000, " A ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", engyData_r1[ctx_r0.enumMeterTagSet.Power].total / 1000, " W ");
  }
}
class ChargeInformationComponent {
  constructor(EngyService) {
    this.EngyService = EngyService;
    this.enumMeterTagSet = _core_services_engy_service__WEBPACK_IMPORTED_MODULE_0__.eMeterTagSet;
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  }
  ngOnInit() {
    this.engyDataObs$ = this.EngyService.getAllEngyData$().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.destroy$));
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  static #_ = this.ɵfac = function ChargeInformationComponent_Factory(t) {
    return new (t || ChargeInformationComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_engy_service__WEBPACK_IMPORTED_MODULE_0__.EngyService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: ChargeInformationComponent,
    selectors: [["app-charge-information"]],
    decls: 7,
    vars: 3,
    consts: [[1, "row"], [1, "col-12"], [4, "ngIf"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-lightning-charge"], ["d", "M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41z"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-battery-full"], ["d", "M2 6h10v4H2z"], ["d", "M2 4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm10 1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm4 3a1.5 1.5 0 0 1-1.5 1.5v-3A1.5 1.5 0 0 1 16 8"]],
    template: function ChargeInformationComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "p")(3, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Charge Information");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, ChargeInformationComponent_ng_container_5_Template, 32, 4, "ng-container", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](6, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](6, 1, ctx.engyDataObs$));
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.AsyncPipe],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 6753:
/*!****************************************!*\
  !*** ./src/app/date/date.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DateComponent: () => (/* binding */ DateComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class DateComponent {
  constructor() {
    this.currentDay = new Date().toLocaleDateString();
  }
  static #_ = this.ɵfac = function DateComponent_Factory(t) {
    return new (t || DateComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: DateComponent,
    selectors: [["app-date"]],
    decls: 4,
    vars: 1,
    consts: [["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-calendar3"], ["d", "M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"], ["d", "M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"]],
    template: function DateComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "svg", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "path", 1)(2, "path", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("\u00A0", ctx.currentDay, "\u00A0");
      }
    },
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 4712:
/*!**********************************************!*\
  !*** ./src/app/details/details.component.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DetailsComponent: () => (/* binding */ DetailsComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class DetailsComponent {
  static #_ = this.ɵfac = function DetailsComponent_Factory(t) {
    return new (t || DetailsComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: DetailsComponent,
    selectors: [["app-details"]],
    decls: 2,
    vars: 0,
    template: function DetailsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " details works! ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }
    },
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 6515:
/*!********************************************!*\
  !*** ./src/app/footer/footer.component.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterComponent: () => (/* binding */ FooterComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class FooterComponent {
  static #_ = this.ɵfac = function FooterComponent_Factory(t) {
    return new (t || FooterComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: FooterComponent,
    selectors: [["app-footer"]],
    decls: 12,
    vars: 0,
    consts: [["href", "https://iot.bzh"], ["width", "78.991", "height", "20", "version", "1.1", "viewBox", "0 0 20.899 5.2917", "xmlns", "http://www.w3.org/2000/svg"], ["transform", "translate(-20.603 -133.94)", "stroke-width", ".040537"], ["d", "m20.601 134.9h0.73995v2.8695h-0.73995z"], ["d", "m23.376 135.38q-0.33826 0-0.5247 0.24986-0.18642 0.24985-0.18642 0.70344 0 0.45166 0.18642 0.70153 0.18642 0.24986 0.5247 0.24986 0.34019 0 0.52663-0.24986 0.18643-0.24985 0.18643-0.70153 0-0.45358-0.18643-0.70344-0.18642-0.24986-0.52663-0.24986zm0-0.53624q0.69192 0 1.084 0.39593 0.39208 0.39592 0.39208 1.0936 0 0.69576-0.39208 1.0917-0.39208 0.39593-1.084 0.39593-0.69 0-1.084-0.39593-0.39208-0.39592-0.39208-1.0917 0-0.69768 0.39208-1.0936 0.394-0.39593 1.084-0.39593z"], ["d", "m25.07 134.9h2.6447v0.5593h-0.95137v2.3102h-0.73995v-2.3102h-0.95329z"], ["d", "m31.715 135.89c1.1439 0.66041 1.1657 2.3812 0.04041 3.1838-0.31121 0.22198-0.3559 0.19905-0.08089-0.0415 0.70835-0.61961 0.72908-1.7098 0.04399-2.3146l-0.15862-0.14003 0.02931-0.15042c0.01612-0.0827 0.02431-0.23234 0.0182-0.33245-0.01373-0.22484 0.0064-0.26318 0.10758-0.20475zm-2.6255 0.46227c0.28621-0.31385 0.7559-0.57405 1.1772-0.65221l0.2787-0.0517 0.03543 0.11744c0.01949 0.0646 0.02734 0.2118 0.01745 0.32711l-0.01798 0.20966-0.24886 0.0686c-0.44236 0.12191-0.82707 0.44021-1.0318 0.85372l-0.09795 0.19781-0.11119-0.0167c-0.20847-0.0313-0.51605-0.16119-0.51854-0.21891-0.0037-0.0865 0.33836-0.63832 0.51754-0.83479zm1.3461 1.4754c-1.1439 0.66041-2.645-0.18103-2.7775-1.5569-0.03664-0.3805 0.0056-0.40775 0.07638-0.0493 0.18241 0.92325 1.1162 1.4863 1.9825 1.1954l0.20058-0.0674 0.11561 0.1006c0.06358 0.0553 0.18905 0.13722 0.27881 0.18199 0.20158 0.10052 0.22471 0.13713 0.12353 0.19555zm0.9124-2.5049c0.12869 0.4048 0.1192 0.94166-0.02379 1.3456l-0.09458 0.26721-0.11942-0.028c-0.06568-0.0154-0.19708-0.0822-0.29201-0.14844l-0.17258-0.12041 0.06503-0.24982c0.11561-0.44405 0.0323-0.93636-0.22343-1.3204l-0.12234-0.18374 0.07007-0.0879c0.13138-0.16487 0.39763-0.36631 0.44885-0.33961 0.0768 0.04 0.38363 0.61218 0.46419 0.86559zm-1.9783 0.41812c0-1.3208 1.4793-2.2001 2.737-1.627 0.34784 0.15852 0.35034 0.20868 0.0045 0.0908-0.89078-0.30365-1.8454 0.22351-2.0266 1.1192l-0.04197 0.20737-0.14492 0.0498c-0.07971 0.0274-0.21336 0.0951-0.29701 0.15046-0.18785 0.12431-0.23112 0.12604-0.23112 9e-3zm1.713 2.0426c-0.4149-0.0909-0.87509-0.3676-1.1534-0.69342l-0.18411-0.21551 0.08399-0.0894c0.0462-0.0492 0.16974-0.12957 0.27456-0.17866l0.19056-0.0892 0.18382 0.18122c0.32677 0.32215 0.79477 0.49617 1.2553 0.46674l0.22029-0.0141 0.04112 0.10465c0.07709 0.1962 0.11842 0.5275 0.06968 0.55853-0.07307 0.0465-0.72199 0.0261-0.98172-0.0308z", "fill", "#5a2ca0"], ["d", "m34.224 136.01q0.1749 0 0.26523-0.0769 0.09033-0.0769 0.09033-0.22679 0-0.14799-0.09033-0.22487-0.09033-0.0788-0.26523-0.0788h-0.40937v0.60735zm0.02499 1.255q0.22295 0 0.33442-0.0942 0.1134-0.0942 0.1134-0.28445 0-0.18643-0.11147-0.27869-0.11148-0.0942-0.33634-0.0942h-0.43436v0.75149zm0.68806-1.0321q0.23832 0.0692 0.36902 0.25563 0.1307 0.18644 0.13069 0.45742 0 0.41516-0.28061 0.61887-0.28061 0.20372-0.85336 0.20374h-1.2281v-2.8695h1.1109q0.59773 0 0.86489 0.18066 0.26908 0.18066 0.26908 0.57852 0 0.2095-0.09802 0.35748-0.09802 0.14607-0.28445 0.21719z"], ["d", "m35.935 134.9h2.4121v0.44782l-1.5395 1.8624h1.5837v0.55929h-2.5005v-0.44782l1.5395-1.8624h-1.4953z"], ["d", "m38.93 134.9h0.73995v1.0936h1.0917v-1.0936h0.73995v2.8695h-0.73995v-1.2166h-1.0917v1.2166h-0.73995z"]],
    template: function FooterComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p")(1, "a", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, "created by ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "svg", 1)(4, "g", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "path", 3)(6, "path", 4)(7, "path", 5)(8, "path", 6)(9, "path", 7)(10, "path", 8)(11, "path", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
    },
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 3767:
/*!********************************************!*\
  !*** ./src/app/header/header.component.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 2513);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 9736);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 274);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/AFB-websocket.service */ 4493);
/* harmony import */ var _core_services_dbus_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../@core/services/dbus-service */ 1911);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 6575);
/* harmony import */ var _date_date_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../date/date.component */ 6753);
/* harmony import */ var _time_time_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../time/time.component */ 1719);







function HeaderComponent_ng_container_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "svg", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "path", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const nfcData_r3 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", nfcData_r3 ? "on" : "error");
  }
}
function HeaderComponent_ng_template_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "svg", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "path", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", "error");
  }
}
class HeaderComponent {
  constructor(afbService, dbusService) {
    this.afbService = afbService;
    this.dbusService = dbusService;
    this.title = 'valeo';
    this.onDestroy = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
    this.wifiStatus = 'off';
    this.nfcStatus = 'off';
    this.ethernetStatus = 'off';
    this.mobileStatus = 'off';
    afbService.Init('api', 'HELLO');
    // if (environment.production) {
    this.afbService.SetURL(window.location.host);
    // } else {
    //     afbService.SetURL('localhost', '1235');
    // }
  }
  /**
   * Initializes the component.
   *
   * Subscribes to the Status$ Observable of the afbService to listen for changes in the connection status.
   * If the status is connected, sets the wifiStatus property to 'on', otherwise sets it to 'off'.
   * Logs the AFB connection status to the console.
   * Connects to the afbService.
   */
  ngOnInit() {
    this.dbusState$ = this.dbusService.getDbusData$().pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.map)(res => {
      return res;
    }));
    this.afbService.Status$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this.onDestroy)).subscribe(status => {
      if (status.connected) {
        this.wifiStatus = 'on';
        // this.nfcStatus = 'on';
        this.ethernetStatus = 'on';
        this.mobileStatus = 'on';
      } else {
        this.wifiStatus = 'off';
        // this.nfcStatus = 'off';
        this.ethernetStatus = 'off';
        this.mobileStatus = 'off';
      }
      console.log('AFB connection status:', status);
    });
    this.afbService.Connect();
  }
  ngOnDestroy() {
    this.onDestroy.next(true);
    this.onDestroy.complete();
  }
  restartConnection() {
    this.afbService.Disconnect();
    this.afbService.Connect();
  }
  static #_ = this.ɵfac = function HeaderComponent_Factory(t) {
    return new (t || HeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_AFB_websocket_service__WEBPACK_IMPORTED_MODULE_0__.AFBWebSocketService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_core_services_dbus_service__WEBPACK_IMPORTED_MODULE_1__.DbusService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
    type: HeaderComponent,
    selectors: [["app-header"]],
    decls: 36,
    vars: 7,
    consts: [[1, "row"], [1, "col-12", "col-md-6", "mb-3", "text-center", "text-md-start"], ["src", "../assets/images/tux_evsex40.png", "alt", "logo", 1, "logo"], ["height", "40px", "version", "1.1", "viewBox", "0 0 37.218 26.458", "xmlns", "http://www.w3.org/2000/svg", 2, "padding", "0 10px"], ["transform", "translate(-31.485 -120.91)"], ["transform", "matrix(.06503 0 0 .06503 17.579 101.63)"], ["d", "m549.06 701.23c-13.3 0.4-26.5 2.1-39.8 2.2-16.1 0-32.2-0.4-48.2-1.8-0.7-0.1-1.3-0.1-2-0.2a3.4 3.4 0 0 1-1-0.1c-1-0.1-2-0.1-3-0.2-9.7-1.7-19.4-3.4-29-5.1-0.6-0.1-1.2-0.3-1.8-0.4-1-0.2-2.1-0.4-3.1-0.7a0.76 0.76 0 0 0-0.9-0.3c-1-0.2-2-0.5-3.1-0.7-0.7-0.1-1.4-0.3-2.2-0.4-0.3-0.1-0.6-0.1-1-0.2a5.75 5.75 0 0 0-4-1c-7.7-2.5-15.3-5.1-23-7.6-1.5-0.5-3.1-1.1-4.6-1.6a16.53 16.53 0 0 0-2.6-1.4 289.18 289.18 0 0 1-59.5-31.4c-33.8-23.4-60.8-52.9-79.7-89.6-4.5-8.7-8.3-17.7-12.4-26.6h0.1c-6.9-20.8-11.8-42-13.6-63.8a13.4 13.4 0 0 0-0.1-2c0.2-2.1 0.6-4.1-0.3-6.1-0.9-5.3-0.1-10.5 0.1-15.7 0.8-3.3 0.6-6.7 0.5-10.1l0.3-3c1-6.3 1.9-12.7 2.9-19 0.2-0.6 0.4-1.3 0.6-1.9 3.5-13.9 7.8-27.4 14.4-40.2a130.37 130.37 0 0 1 37.4-44.7c24.3-15.4 51.2-23.8 79.4-27.8 9.8-1.4 19.8-2.1 29.8-2.9 9.1-0.7 18.2-0.2 27.1-0.1 34.9 0.5 69.2 6.3 102.9 15.4 59.1 15.9 114.5 40.3 165.6 74.2 23.7 15.7 46.2 33 65.4 54.1s36 44 42.7 72.7c7.1 30.6 0.5 58.5-17.2 83.9-18.2 26.2-43.1 44.9-70.8 59.9-30.3 16.4-62.5 27.6-96 35.4-1.1 0.3-2.2 0.7-3.3 1.1-5.9 1-11.8 2.1-17.7 3.1-9 1.6-17.9 3.1-26.9 4.7a19.27 19.27 0 0 0-2.4-0.1z", "fill", "#fff"], ["d", "m549.06 701.23c-13.3 0.4-26.5 2.1-39.8 2.2-16.1 0-32.2-0.4-48.2-1.8-0.7-0.1-1.3-0.1-2-0.2a3.4 3.4 0 0 1-1-0.1c-1-0.1-2-0.1-3-0.2-9.7-1.7-19.4-3.4-29-5.1-0.6-0.1-1.2-0.3-1.8-0.4-1-0.2-2.1-0.4-3.1-0.7a0.76 0.76 0 0 0-0.9-0.3c-1-0.2-2-0.5-3.1-0.7-0.7-0.1-1.4-0.3-2.2-0.4-0.3-0.1-0.6-0.1-1-0.2a5.75 5.75 0 0 0-4-1c-7.7-2.5-15.3-5.1-23-7.6-1.5-0.5-3.1-1.1-4.6-1.6a16.53 16.53 0 0 0-2.6-1.4 289.18 289.18 0 0 1-59.5-31.4c-33.8-23.4-60.8-52.9-79.7-89.6-4.5-8.7-8.3-17.7-12.4-26.6h0.1c-6.9-20.8-11.8-42-13.6-63.8a13.4 13.4 0 0 0-0.1-2c0.2-2.1 0.6-4.1-0.3-6.1-0.9-5.3-0.1-10.5 0.1-15.7 0.8-3.3 0.6-6.7 0.5-10.1l0.3-3c1-6.3 1.9-12.7 2.9-19 0.2-0.6 0.4-1.3 0.6-1.9 3.5-13.9 7.8-27.4 14.4-40.2a130.37 130.37 0 0 1 37.4-44.7c24.3-15.4 51.2-23.8 79.4-27.8 9.8-1.4 19.8-2.1 29.8-2.9 9.1-0.7 18.2-0.2 27.1-0.1 34.9 0.5 69.2 6.3 102.9 15.4 59.1 15.9 114.5 40.3 165.6 74.2 23.7 15.7 46.2 33 65.4 54.1s36 44 42.7 72.7c7.1 30.6 0.5 58.5-17.2 83.9-18.2 26.2-43.1 44.9-70.8 59.9-30.3 16.4-62.5 27.6-96 35.4-1.1 0.3-2.2 0.7-3.3 1.1-5.9 1-11.8 2.1-17.7 3.1-9 1.6-17.9 3.1-26.9 4.7a19.27 19.27 0 0 0-2.4-0.1zm-202.8-244.7c1.3-0.4 2.2-0.8 0.8-2.2 0.6-15 1.9-29.9 5.2-44.5 0.9-4-0.1-4.5-3.6-4.5q-37.5 0.15-75 0c-2.9 0-4.5 0.9-5.6 3.7-5.6 13.9-8.3 28.3-9.2 43.2-0.2 4.1 1.2 5 5.1 5 26-0.2 52-0.1 78-0.1 1.4 0 2.9 0.4 4.3-0.6zm-43.2 12.7h-40c-2.4 0-4.2 0-3.8 3.4a228.74 228.74 0 0 0 9.7 43.2c1.1 3.4 2.8 4.7 6.4 4.7 11.2-0.2 22.3-0.1 33.5-0.1 13.7 0 27.3 0 41-0.1 1.5 0 4.2 1 3.4-2.4a322.85 322.85 0 0 1-6-44.9c-0.3-3.5-1.8-3.9-4.8-3.9-13 0.2-26.2 0.1-39.4 0.1zm40.3 115.2h30c1.3 0 4.3 0.8 2.7-2.2-7.7-14.8-13.4-30.3-18.3-46.2-0.6-2.1-2.1-2.6-4.1-2.7-5.9-0.4-11.9-0.2-17.8-0.2-17.8 0.1-35.6 1.1-53.4-0.5-5.4-0.5-6.4 1-3.9 5.9a229.24 229.24 0 0 0 26.1 39.3c4.1 5.1 8.5 7.4 15.2 6.9 7.8-0.8 15.7-0.3 23.5-0.3zm48.64-244.3a160.87 160.87 0 0 0-40.5 2.1c-30.7 5.4-56.1 19.4-72.9 46.6-0.7 1.1-2 2.2-1.5 3.5 0.6 1.6 2.3 1 3.5 1 24.2 0 48.3 0 72.5 0.1 3 0 4-1.3 4.9-3.7a117.44 117.44 0 0 1 17.1-32 100.48 100.48 0 0 1 16.9-17.6zm79.8 154.8c0-0.8 0.1-3 0-5.1-1.1-17.5-10.8-30-25.9-33.2a66.52 66.52 0 0 0-26.3-0.3c-12.4 2.4-21.3 9.2-25.3 21.4a54.13 54.13 0 0 0 1.6 39 29.79 29.79 0 0 0 19.2 17.6 56.62 56.62 0 0 0 30 1.2c14.3-3.2 23-12.1 25.7-26.5a51.07 51.07 0 0 0 0.96-14.1zm162.9 0.3h-0.2c0 10-0.1 20 0 30 0.2 13.4-2.7 10.7 11.8 11.2 2.9 0.1 3.8-1.1 3.6-3.8a41.7 41.7 0 0 1 0-5v-54c0-2.1-0.6-4.5 2.9-4.5 6.3 0.1 12.7-0.1 19 0.2 4.6 0.2 7.1 3 7.6 7.7 0.8 8-3.5 13.9-13.7 16.1-5.8 1.2-6.6 3.9-5.4 8.7a3 3 0 0 1 0.2 1c1.1 5.4 2.9 6.6 8.5 5.2 5.4-1.4 10.4-3.2 14.9-6.9 6-4.9 10.2-10.4 11.4-18.1 2.3-13.9-4.3-24.8-16.9-26.6-13.7-2-27.6-0.5-41.4-0.8-3.2-0.1-2.5 1.9-2.5 4.2 0.36 11.8 0.16 23.6 0.16 35.4zm-70.3 0.9c-0.1 10.2-0.1 20.3-0.1 30.5 0 11.3 0 11.3 11.6 10.7 2.8-0.1 3.9-1.2 3.8-3.8-0.1-2 0-4 0-6 0-18 0.1-36-0.1-53.9 0-3.5 1-4.7 4.5-4.5 5.5 0.3 11-0.1 16.5 0.2 6 0.3 9 3.7 9 9.7 0 4.9-2.5 8.5-6.5 11.1a32.06 32.06 0 0 1-11.1 4.3c-2.1 0.4-2.9 1.1-2.4 3.3 0.6 2.8 1.1 5.6 1.4 8.3 0.2 1.6 0.8 2.3 2.6 2 9.8-1.8 19.3-4.5 25.9-12.6 6.9-8.4 7.2-18.1 3.7-27.8-3.1-8.5-10.5-11-18.8-11.6-12.5-1-25-0.2-37.4-0.4-2.8-0.1-2.7 1.6-2.7 3.6 0.16 12.3 0.06 24.6 0.06 36.9zm-65.4-1.2c0.1-17.5 8.2-25.8 25.7-26.6a63.11 63.11 0 0 1 17.8 1.9c7.3 1.9 7.1 1.8 7.5-6 0.2-4.2-1.3-5.9-5.2-6.8-10.7-2.5-21.4-3.2-32.1-1.1-14.6 2.8-25 10.5-28.5 25.7a58.8 58.8 0 0 0-1 20.9c2.4 17.7 11 28.4 25.9 32.1 11.7 2.9 23.4 2.5 35.1-0.1 4.3-0.9 5.9-2.9 5.7-7.5-0.4-7.8-0.1-7.8-7.3-5.7a54.7 54.7 0 0 1-21.3 1.6c-15.44-1.6-22.3-10.6-22.3-28.4zm-73.2 154.2c-2.8-2.7-5.9-5.2-8.5-8.1-11.8-13.2-23.4-26.7-32.1-42.3-0.7-1.2-1.4-2.2-3-2.2-17.6 0-35.2-0.1-52.9-0.1-1.1 0-2.6-0.4-3 1.1-0.4 1.3 0.6 2.2 1.5 2.9 4.1 3.3 8.2 6.7 12.5 9.9 17 12.5 35.7 22.2 55.3 30 9.66 3.9 19.4 7.8 30.16 8.8z", "fill", "#8d4b98"], ["d", "m346.26 456.53c-1.4 0.9-2.9 0.6-4.4 0.6-26 0-52-0.1-78 0.1-3.9 0-5.3-0.9-5.1-5a139 139 0 0 1 9.24-43.23c1.1-2.7 2.7-3.7 5.6-3.7q37.5 0.15 75 0c3.5 0 4.5 0.5 3.6 4.5-3.4 14.6-4.6 29.5-5.2 44.5a2.11 2.11 0 0 0-0.74 2.23z", "fill", "#e8dfef"], ["d", "m303.06 469.23c13.2 0 26.3 0.1 39.5-0.1 2.9 0 4.5 0.4 4.8 3.9a322.85 322.85 0 0 0 6 44.9c0.8 3.5-2 2.4-3.4 2.4-13.7 0.1-27.3 0.1-41 0.1-11.2 0-22.3-0.1-33.5 0.1-3.6 0.1-5.3-1.3-6.4-4.7a228.74 228.74 0 0 1-9.7-43.2c-0.4-3.4 1.4-3.4 3.8-3.4q19.95 0.15 39.9 0z", "fill", "#d4c0df"], ["d", "m343.36 584.43c-7.8 0-15.7-0.5-23.5 0.1-6.7 0.6-11.1-1.8-15.2-6.9a233.19 233.19 0 0 1-26.1-39.3c-2.5-4.9-1.6-6.4 3.9-5.9 17.8 1.7 35.6 0.7 53.4 0.5 5.9 0 11.9-0.3 17.8 0.2 2.1 0.2 3.5 0.7 4.1 2.7 4.9 15.9 10.6 31.4 18.3 46.2 1.5 3-1.5 2.2-2.7 2.2-10 0.2-20 0.2-30 0.2z", "fill", "#bfa0cb"], ["d", "m425.76 649.13c-10.8-1-20.5-4.9-30.1-8.8-19.6-7.8-38.3-17.5-55.3-30-4.3-3.1-8.4-6.5-12.5-9.9-0.9-0.7-1.9-1.6-1.5-2.9s1.9-1.1 3-1.1c17.6 0 35.2 0.1 52.9 0.1 1.6 0 2.3 1 3 2.2 8.7 15.6 20.2 29.1 32.1 42.3 2.5 2.97 5.5 5.4 8.4 8.1z", "fill", "#ab7fb7"], ["d", "m346.26 456.53c-0.1-0.9-0.1-1.7 0.8-2.2 1.4 1.4 0.5 1.9-0.8 2.2z", "fill", "#b496c8"], ["d", "m456.26 496.43c-0.1 9.4-1.6 18.4-10.4 23.8-12.1 7.5-35.1 5.2-38-16a52.87 52.87 0 0 1 0.1-17.3c2-10.5 8.9-17.2 19.4-18.3a40.94 40.94 0 0 1 9.9 0.1c9.7 1.2 15 7.5 17.7 16.4 1.3 3.6 1.4 7.5 1.3 11.3z", "fill", "#8d4b98"], ["height", "64.981", "version", "1.1", "viewBox", "0 0 39.688 17.193", "xmlns", "http://www.w3.org/2000/svg", 1, "logo"], ["transform", "translate(42.598 -68.263)"], ["transform", "matrix(.72106 0 0 -.72106 -3.9637 80.893)"], ["d", "m0 0c-4.597 0.341-10.317 0.624-16.568 0.624-9.568 0-20.371-0.653-30.224-2.695-1.652 2.086-3.662 3.724-6.743 5.018l-0.045-0.09c2.725-2.961 4.466-5.521 5.7-9.184 13.813 5.15 31.154 6.104 44.247 6.104 1.253 0 2.447-0.015 3.602-0.03l0.031 0.253", "fill", "#4e6b7c"], ["transform", "matrix(.72106 0 0 -.72106 -14.33 74.143)"], ["d", "m0 0c0.075 0.356 0.135 0.654 0.135 1.071 0 0.803-0.507 1.132-1.044 1.132-0.879 0-1.337-0.522-1.545-2.203zm-17.429-4.05c-0.268-0.193-0.67-0.416-1.116-0.416-0.849 0-0.968 0.715-0.968 1.563 0 0.997 0.269 2.768 0.565 3.468 0.448 1.072 1.058 1.369 2.04 1.369 0.029 0 0.105 0 0.209-0.015zm28.842 2.443c-0.311-2.888-0.744-3.484-1.574-3.484-0.761 0-1.058 0.552-1.058 1.757 0 0.52 0.059 1.249 0.149 2.008 0.313 2.889 0.745 3.484 1.575 3.484 0.761 0 1.058-0.551 1.058-1.756 0-0.521-0.06-1.25-0.15-2.009zm-19.766-5.477h-4.135l1.875 15.239h4.139zm8.413 2.648c0.83 0 1.948 0.193 2.827 0.446l-0.506-2.769c-1.044-0.266-2.514-0.415-3.826-0.415-4.18 0-5.342 1.817-5.342 4.197 0 6.088 2.619 7.471 6.221 7.471 2.828 0 4.582-1.368 4.582-3.989 0-1.144-0.234-2.173-0.398-2.887h-6.222c0-1.311 0.428-2.054 2.664-2.054zm-16.269 8.841c-2.887 0-4.449-0.55-5.715-1.904-1.205-1.282-1.845-3.544-1.845-5.94 0-2.084 0.52-3.809 3.096-3.809 1.174 0 2.203 0.444 3.155 0.997h0.044l-0.103-0.833h3.914l1.399 11.414c-1.146 0.046-2.471 0.075-3.945 0.075zm32.046-4.049c0 2.948-1.909 4.138-5.109 4.138-3.866 0-6.221-1.772-6.221-7.784 0-2.946 1.908-4.138 5.109-4.138 3.866 0 6.221 1.727 6.221 7.784zm-41.036 7.799c-0.951-3.571-2.262-7.144-3.944-10.731h-0.03c-0.445 2.917-0.669 7.115-0.669 10.731h-4.794c0.15-5.713 1.147-10.76 2.264-15.239h4.614c2.604 4.702 5.045 9.762 6.935 15.239h-4.376", "fill", "#82e600"], [1, "col-12", "col-md-3", "mb-3", "text-sm-start", "text-md-end"], [2, "vertical-align", "middle"], [1, "col-12", "col-md-3", "text-sm-start", "text-md-end", "picto-header"], [4, "ngIf", "ngIfElse"], ["dbusLoading", ""], ["xmlns", "http://www.w3.org/2000/svg", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-ethernet", 3, "ngClass"], ["d", "M14 13.5v-7a.5.5 0 0 0-.5-.5H12V4.5a.5.5 0 0 0-.5-.5h-1v-.5A.5.5 0 0 0 10 3H6a.5.5 0 0 0-.5.5V4h-1a.5.5 0 0 0-.5.5V6H2.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5M3.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m2 0h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25zM9.75 11h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25m1.75.25a.25.25 0 0 1 .25-.25h.5a.25.25 0 0 1 .25.25v1.5a.25.25 0 0 1-.25.25h-.5a.25.25 0 0 1-.25-.25z"], ["d", "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"], ["xmlns", "http://www.w3.org/2000/svg", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-reception-4", 3, "ngClass"], ["d", "M0 11.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-5zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-8zm4-3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-11z"], ["xmlns", "http://www.w3.org/2000/svg", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-wifi", 3, "ngClass"], ["d", "M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"], ["d", "M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065zm-2.183 2.183c.226-.226.185-.605-.1-.75A6.473 6.473 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.478 5.478 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091l.016-.015zM9.06 12.44c.196-.196.198-.52-.04-.66A1.99 1.99 0 0 0 8 11.5a1.99 1.99 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"], ["height", "100%", "fill", "currentColor", "version", "1.1", "viewBox", "0 0 16 16", "xmlns", "http://www.w3.org/2000/svg", 1, "bi", "bi-nfc", 3, "ngClass"], ["d", "m7.3559 15.981c-1.5009-0.13384-2.9193-0.60315-4.116-1.3619-0.55788-0.35372-1.1599-0.83461-1.2409-0.99122-0.0954-0.18442-0.0188-0.40711 0.16664-0.48458 0.16796-0.0702 0.28435-0.0322 0.52763 0.17224 1.1069 0.93008 2.3622 1.5314 3.7612 1.8016 0.64825 0.12519 0.98701 0.15617 1.6997 0.15542 0.91936-9.7e-4 1.6015-0.0959 2.4315-0.33835 1.0404-0.30391 2.059-0.84169 2.8754-1.518 0.1722-0.14266 0.34817-0.27279 0.39104-0.28918 0.20163-0.0771 0.46996 0.0987 0.46996 0.30797 0 0.15479-0.0633 0.25669-0.271 0.43617-1.2895 1.1143-2.9134 1.8241-4.7228 2.0643-0.44832 0.0595-1.5345 0.0846-1.9725 0.0455zm0.0939-2.2071c-0.53956-0.0869-0.93473-0.20702-1.3805-0.41949-0.49421-0.23555-1.0644-0.64035-1.1586-0.82259-0.0944-0.18259-0.0245-0.38989 0.16128-0.47805 0.1545-0.0733 0.27662-0.0445 0.46797 0.11036 0.63969 0.51771 1.2932 0.79627 2.1235 0.90509 0.71812 0.0941 1.5452-0.0401 2.2296-0.36178 0.24243-0.11396 0.60174-0.34482 0.84423-0.54244 0.0861-0.0702 0.20097-0.13607 0.25526-0.14645 0.12977-0.0248 0.31282 0.0624 0.37231 0.17747 0.0981 0.18963 0.0404 0.35205-0.194 0.54677-0.66599 0.55319-1.4544 0.89904-2.351 1.0313-0.3808 0.0562-1.0206 0.0561-1.37-2.2e-4zm-5.8112-2.9094c-0.19407-0.10952-0.18453 0.0198-0.1844-2.4976 1.3e-4 -2.219 2e-3 -2.2978 0.0611-2.3946 0.0893-0.14641 0.2672-0.19426 0.42883-0.11533 0.10557 0.0516 0.26175 0.26979 1.2632 1.7652l1.1428 1.7064 0.0157-1.6437c9e-3 -0.90405 0.0274-1.6675 0.0418-1.6966 0.0745-0.15102 0.34828-0.20995 0.50334-0.10835 0.18044 0.11823 0.17698 0.0657 0.16778 2.5436l-8e-3 2.2719-0.11695 0.10717c-0.13126 0.12027-0.24981 0.13769-0.4019 0.059-0.0684-0.0353-0.39597-0.50244-1.2341-1.7595l-1.141-1.7114-9e-3 1.6493-9e-3 1.6493-0.0969 0.0968c-0.11524 0.11522-0.29782 0.14902-0.42309 0.0783zm5.0853-0.0141c-0.0549-0.0344-0.11475-0.0906-0.13307-0.12483-0.0227-0.0424-0.0333-0.80163-0.0333-2.3788v-2.3165l0.092-0.0921c0.0506-0.0506 0.13692-0.10102 0.19177-0.11199 0.0548-0.011 0.75663-0.0199 1.5595-0.0199 1.6382 6e-5 1.6245-2e-3 1.734 0.22198 0.0708 0.14484 0.0443 0.28443-0.0774 0.40603l-0.092 0.0921h-2.6878v1.4715h0.92463c0.70994 0 0.94835 0.01 1.0268 0.0427 0.2221 0.0928 0.28159 0.37588 0.11758 0.55951l-0.0913 0.10225-1.9777 0.018-1.6e-4 0.89887c-1e-4 0.49835-0.014 0.94874-0.0313 1.0108-0.0657 0.23636-0.32336 0.34498-0.52231 0.22016zm5.6076 0.0129c-0.49249-0.10716-0.99001-0.4988-1.2138-0.95548-0.18334-0.37413-0.2071-0.55192-0.2071-1.5498 0-0.99665 0.024-1.1766 0.20566-1.5459 0.20379-0.41409 0.64224-0.78195 1.1082-0.92981 0.14041-0.0445 0.32745-0.0572 1.0131-0.0684 0.46252-8e-3 0.90255-4e-3 0.97784 7e-3 0.30652 0.046 0.43376 0.36472 0.23462 0.58777l-0.0913 0.10225-0.91844 0.0177c-0.8669 0.0167-0.92897 0.0218-1.1061 0.0912-0.25507 0.0999-0.51149 0.3563-0.61149 0.61144-0.0689 0.17578-0.0743 0.23856-0.0865 0.99454-8e-3 0.52627-3.7e-4 0.87896 0.0232 1.0141 0.0691 0.39688 0.27091 0.66594 0.6276 0.83677l0.20351 0.0975 0.87666 9e-3c0.54089 6e-3 0.91004 0.0222 0.96382 0.0434 0.27197 0.10725 0.28391 0.5012 0.0193 0.63802-0.11965 0.0619-1.7336 0.061-2.0189-1e-3zm-7.267-6.9173c-0.17342-0.078-0.24565-0.30438-0.15381-0.48199 0.0942-0.18224 0.66439-0.58704 1.1586-0.82259 1.3712-0.65355 2.9352-0.62191 4.3236 0.0875 0.3818 0.19507 0.8946 0.58224 0.97366 0.73513 0.0944 0.18259 0.0245 0.3899-0.16128 0.47805-0.15482 0.0735-0.27697 0.0444-0.46798-0.11123-1.2801-1.0432-2.9876-1.2271-4.4616-0.4805-0.27376 0.13867-0.43434 0.24346-0.73106 0.4771-0.19203 0.15121-0.3312 0.18557-0.48015 0.11857zm-2.9118-1.0958c-0.17352-0.0781-0.24565-0.30438-0.15369-0.48221 0.081-0.15661 0.683-0.6375 1.2409-0.99122 1.0903-0.69127 2.3182-1.1267 3.7246-1.3206 0.54451-0.0751 1.8039-0.0751 2.3482 3e-5 1.8529 0.2557 3.4447 0.9506 4.7385 2.0686 0.20769 0.17948 0.271 0.28138 0.271 0.43617 0 0.20922-0.26833 0.38506-0.46996 0.30797-0.0429-0.0164-0.21884-0.14652-0.39104-0.28918-0.9878-0.81835-2.2706-1.4281-3.5526-1.6886-0.60991-0.12394-1.0608-0.16706-1.7544-0.16779-1.1144-1e-3 -1.9883 0.14961-3.004 0.51828-0.74669 0.27103-1.6549 0.7848-2.256 1.2762-0.40547 0.33147-0.43007 0.34808-0.53717 0.36284-0.0576 8e-3 -0.14955-6e-3 -0.2044-0.0304z", "fill", "currentColor", "stroke-width", ".031962"]],
    template: function HeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "img", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "svg", 3)(4, "g", 4)(5, "g", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "path", 6)(7, "path", 7)(8, "path", 8)(9, "path", 9)(10, "path", 10)(11, "path", 11)(12, "path", 12)(13, "path", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "svg", 14)(15, "g", 15)(16, "g", 16);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "path", 17);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "g", 18);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](19, "path", 19);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "div", 20);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](21, "app-date", 21)(22, "app-time", 21);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "div", 22);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, HeaderComponent_ng_container_24_Template, 3, 1, "ng-container", 23);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](25, "async");
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, HeaderComponent_ng_template_26_Template, 2, 1, "ng-template", null, 24, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplateRefExtractor"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "svg", 25);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](29, "path", 26)(30, "path", 27);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](31, "svg", 28);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](32, "path", 29);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](33, "svg", 30);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](34, "path", 31)(35, "path", 32);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵreference"](27);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](24);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](25, 5, ctx.dbusState$))("ngIfElse", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.ethernetStatus);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.mobileStatus);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", ctx.wifiStatus);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _date_date_component__WEBPACK_IMPORTED_MODULE_2__.DateComponent, _time_time_component__WEBPACK_IMPORTED_MODULE_3__.TimeComponent, _angular_common__WEBPACK_IMPORTED_MODULE_8__.AsyncPipe],
    styles: [".logo[_ngcontent-%COMP%] {\n  height: 40px;\n}\n\n.picto-header[_ngcontent-%COMP%] {\n  height: 30px;\n}\n\n.picto-header[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  padding: 0 5px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvaGVhZGVyL2hlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLFlBQUE7QUFDSjs7QUFFQTtFQUNJLFlBQUE7QUFDSjs7QUFFQTtFQUNJLGNBQUE7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dvIHtcbiAgICBoZWlnaHQ6IDQwcHg7XG59XG5cbi5waWN0by1oZWFkZXIge1xuICAgIGhlaWdodDogMzBweDtcbn1cblxuLnBpY3RvLWhlYWRlciBzdmcge1xuICAgIHBhZGRpbmc6IDAgNXB4O1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 7131:
/*!************************************************************!*\
  !*** ./src/app/smart-charging/smart-charging.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SmartChargingComponent: () => (/* binding */ SmartChargingComponent)
/* harmony export */ });
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/charging-manager-service */ 4629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);




function SmartChargingComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "label", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "input", 7)(4, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const smart_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", smart_r1.name, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", smart_r1.checked || smart_r1.name === ctx_r0.smartStatus);
  }
}
class SmartChargingComponent {
  constructor(chMgrService) {
    this.chMgrService = chMgrService;
    this.smartStatus = _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eIsoState.Unset;
    this.smartList = [{
      name: 'iso20',
      checked: false
    }, {
      name: 'iso2',
      checked: false
    }, {
      name: 'iso3',
      checked: false
    }, {
      name: 'iec',
      checked: false
    }];
  }
  ngOnInit() {
    this.chMgrService.getIsoState$().subscribe(state => {
      this.smartStatus = state;
    });
  }
  static #_ = this.ɵfac = function SmartChargingComponent_Factory(t) {
    return new (t || SmartChargingComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ChMgrService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: SmartChargingComponent,
    selectors: [["app-smart-charging"]],
    decls: 7,
    vars: 1,
    consts: [[1, "row", 2, "border", "2px dashed"], [1, "col"], [2, "font-size", "20px", "font-weight", "800", "text-align", "center"], [1, "row"], ["class", "col-6 mb-1", "style", "padding-right: 15%;", 4, "ngFor", "ngForOf"], [1, "col-6", "mb-1", 2, "padding-right", "15%"], [1, "switch", 2, "vertical-align", "middle", "float", "right"], ["type", "checkbox", "disabled", "", 3, "checked"], [1, "slider", "round"]],
    template: function SmartChargingComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div")(3, "p", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "test & debug indicators");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, SmartChargingComponent_div_6_Template, 5, 2, "div", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.smartList);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf],
    styles: ["\n\n.switch[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n  width: 48px;\n  height: 28px;\n}\n\n\n\n.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  display: none !important;\n}\n\n\n\n.slider[_ngcontent-%COMP%] {\n  position: absolute;\n  cursor: default;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  transition: 0.4s;\n}\n\n.slider[_ngcontent-%COMP%]:before {\n  position: absolute;\n  content: \"\";\n  height: 20px;\n  width: 20px;\n  left: 4px;\n  bottom: 4px;\n  background-color: white;\n  transition: 0.4s;\n}\n\ninput[_ngcontent-%COMP%]:checked    + .slider[_ngcontent-%COMP%] {\n  background-color: var(--green-color);\n}\n\ninput[_ngcontent-%COMP%]:focus    + .slider[_ngcontent-%COMP%] {\n  box-shadow: 0 0 1px var(--green-color);\n}\n\ninput[_ngcontent-%COMP%]:checked    + .slider[_ngcontent-%COMP%]:before {\n  transform: translateX(20px);\n}\n\n\n\n.slider.round[_ngcontent-%COMP%] {\n  border-radius: 34px;\n}\n\n.slider.round[_ngcontent-%COMP%]:before {\n  border-radius: 50%;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc21hcnQtY2hhcmdpbmcvc21hcnQtY2hhcmdpbmcuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkNBQUE7QUFDQTtFQUNHLGtCQUFBO0VBQ0EscUJBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQUNIOztBQUVBLCtCQUFBO0FBQ0E7RUFDRyx3QkFBQTtBQUNIOztBQUVBLGVBQUE7QUFDQTtFQUNHLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtFQUVBLGdCQUFBO0FBQ0g7O0FBRUE7RUFDRyxrQkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0VBQ0EsdUJBQUE7RUFFQSxnQkFBQTtBQUNIOztBQUVBO0VBQ0csb0NBQUE7QUFDSDs7QUFFQTtFQUNHLHNDQUFBO0FBQ0g7O0FBRUE7RUFHRywyQkFBQTtBQUNIOztBQUVBLG9CQUFBO0FBQ0E7RUFDRyxtQkFBQTtBQUNIOztBQUVBO0VBQ0csa0JBQUE7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qIFRoZSBzd2l0Y2ggLSB0aGUgYm94IGFyb3VuZCB0aGUgc2xpZGVyICovXG4uc3dpdGNoIHtcbiAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgIHdpZHRoOiA0OHB4O1xuICAgaGVpZ2h0OiAyOHB4O1xufVxuXG4vKiBIaWRlIGRlZmF1bHQgSFRNTCBjaGVja2JveCAqL1xuLnN3aXRjaCBpbnB1dCB7XG4gICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG59XG5cbi8qIFRoZSBzbGlkZXIgKi9cbi5zbGlkZXIge1xuICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgY3Vyc29yOiBkZWZhdWx0O1xuICAgdG9wOiAwO1xuICAgbGVmdDogMDtcbiAgIHJpZ2h0OiAwO1xuICAgYm90dG9tOiAwO1xuICAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcbiAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjRzO1xuICAgdHJhbnNpdGlvbjogLjRzO1xufVxuXG4uc2xpZGVyOmJlZm9yZSB7XG4gICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICBjb250ZW50OiBcIlwiO1xuICAgaGVpZ2h0OiAyMHB4O1xuICAgd2lkdGg6IDIwcHg7XG4gICBsZWZ0OiA0cHg7XG4gICBib3R0b206IDRweDtcbiAgIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuNHM7XG4gICB0cmFuc2l0aW9uOiAuNHM7XG59XG5cbmlucHV0OmNoZWNrZWQrLnNsaWRlciB7XG4gICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1ncmVlbi1jb2xvcik7XG59XG5cbmlucHV0OmZvY3VzKy5zbGlkZXIge1xuICAgYm94LXNoYWRvdzogMCAwIDFweCB2YXIoLS1ncmVlbi1jb2xvcik7XG59XG5cbmlucHV0OmNoZWNrZWQrLnNsaWRlcjpiZWZvcmUge1xuICAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMjBweCk7XG4gICAtbXMtdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDIwcHgpO1xuICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDIwcHgpO1xufVxuXG4vKiBSb3VuZGVkIHNsaWRlcnMgKi9cbi5zbGlkZXIucm91bmQge1xuICAgYm9yZGVyLXJhZGl1czogMzRweDtcbn1cblxuLnNsaWRlci5yb3VuZDpiZWZvcmUge1xuICAgYm9yZGVyLXJhZGl1czogNTAlO1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 4034:
/*!****************************************************!*\
  !*** ./src/app/start-stop/start-stop.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StartStopComponent: () => (/* binding */ StartStopComponent)
/* harmony export */ });
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/charging-manager-service */ 4629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);



class StartStopComponent {
  onStop() {
    alert('STOPPED !!!');
    this.btnDisabled = true;
  }
  constructor(ChMgrService) {
    this.ChMgrService = ChMgrService;
    this.btnDisabled = false;
    this.chargeStatus = _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePowerRequest.Unknown;
  }
  ngOnInit() {
    this.ChMgrService.getPowerState$().subscribe(s => this.chargeStatus = s);
  }
  static #_ = this.ɵfac = function StartStopComponent_Factory(t) {
    return new (t || StartStopComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ChMgrService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: StartStopComponent,
    selectors: [["app-start-stop"]],
    decls: 7,
    vars: 1,
    consts: [[1, "text-center"], ["type", "button", 1, "btn", "btn-danger", "btn-circle", "btn-xl", "start-stop", 3, "disabled", "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "auto", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-stop-fill"], ["d", "M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"]],
    template: function StartStopComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function StartStopComponent_Template_button_click_1_listener() {
          return ctx.onStop();
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "svg", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "path", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "br");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "strong");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "STOP");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.chargeStatus !== "charging");
      }
    },
    styles: [".btn-circle.btn-xl[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  padding: 13px 18px;\n  border-radius: 60px;\n  font-size: 15px;\n  text-align: center;\n}\n\n.start-stop[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 30px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc3RhcnQtc3RvcC9zdGFydC1zdG9wLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksWUFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0FBQ0o7O0FBRUE7RUFDSSxZQUFBO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIuYnRuLWNpcmNsZS5idG4teGwge1xuICAgIHdpZHRoOiAxMDBweDtcbiAgICBoZWlnaHQ6IDEwMHB4O1xuICAgIHBhZGRpbmc6IDEzcHggMThweDtcbiAgICBib3JkZXItcmFkaXVzOiA2MHB4O1xuICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5zdGFydC1zdG9wIHN2ZyB7XG4gICAgaGVpZ2h0OiAzMHB4O1xufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }),

/***/ 4805:
/*!************************************************************!*\
  !*** ./src/app/status-battery/status-battery.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusBatteryComponent: () => (/* binding */ StatusBatteryComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _core_services_engy_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/engy-service */ 6498);


class StatusBatteryComponent {
  /**
   * Constructs a new instance of the class.
   *
   * @param {EngyService} EngyService - The EngyService instance.
   */
  constructor(EngyService) {
    this.EngyService = EngyService;
  }
  /**
   * Initializes the component and retrieves battery information from the service.
   *
   * @return {void}
   */
  ngOnInit() {}
  static #_ = this.ɵfac = function StatusBatteryComponent_Factory(t) {
    return new (t || StatusBatteryComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_engy_service__WEBPACK_IMPORTED_MODULE_0__.EngyService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: StatusBatteryComponent,
    selectors: [["app-status-battery"]],
    decls: 15,
    vars: 1,
    consts: [[2, "text-align", "center"], [1, "picto", 2, "text-align", "center"], ["xmlns", "http://www.w3.org/2000/svg", "width", "50%", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-battery-charging"], ["d", "M9.585 2.568a.5.5 0 0 1 .226.58L8.677 6.832h1.99a.5.5 0 0 1 .364.843l-5.334 5.667a.5.5 0 0 1-.842-.49L5.99 9.167H4a.5.5 0 0 1-.364-.843l5.333-5.667a.5.5 0 0 1 .616-.09z", 1, "blink"], ["d", "M2 4h4.332l-.94 1H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h2.38l-.308 1H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"], ["d", "M2 6h2.45L2.908 7.639A1.5 1.5 0 0 0 3.313 10H2V6zm8.595-2-.308 1H12a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9.276l-.942 1H12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.405z"], ["d", "M12 10h-1.783l1.542-1.639c.097-.103.178-.218.241-.34V10zm0-3.354V6h-.646a1.5 1.5 0 0 1 .646.646zM16 8a1.5 1.5 0 0 1-1.5 1.5v-3A1.5 1.5 0 0 1 16 8z"], [2, "font-weight", "800", "color", "var(--bluelight-color)"], [2, "font-size", "20px"]],
    template: function StatusBatteryComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div")(1, "p", 0)(2, "b");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "Status battery");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "svg", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "path", 3)(7, "path", 4)(8, "path", 5)(9, "path", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 7)(11, "p", 0)(12, "span", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "kw");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.battery);
      }
    },
    styles: [".blink[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_blink 5s infinite;\n}\n\n@keyframes _ngcontent-%COMP%_blink {\n  0% {\n    fill: currentColor;\n  }\n  20% {\n    fill: var(--green-color);\n  }\n  40% {\n    fill: currentColor;\n  }\n  60% {\n    fill: var(--green-color);\n  }\n  80% {\n    fill: currentColor;\n  }\n  100% {\n    fill: var(--green-color);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc3RhdHVzLWJhdHRlcnkvc3RhdHVzLWJhdHRlcnkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSw0QkFBQTtBQUNKOztBQUNBO0VBQ0k7SUFDSSxrQkFBQTtFQUVOO0VBQUU7SUFDSSx3QkFBQTtFQUVOO0VBQUU7SUFDSSxrQkFBQTtFQUVOO0VBQUU7SUFDSSx3QkFBQTtFQUVOO0VBQUU7SUFDSSxrQkFBQTtFQUVOO0VBQUU7SUFDSSx3QkFBQTtFQUVOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIuYmxpbmt7XG4gICAgYW5pbWF0aW9uOiBibGluayA1cyBpbmZpbml0ZTtcbn1cbkBrZXlmcmFtZXMgYmxpbmt7XG4gICAgMCUge1xuICAgICAgICBmaWxsOiBjdXJyZW50Q29sb3I7XG4gICAgfVxuICAgIDIwJSB7XG4gICAgICAgIGZpbGw6IHZhcigtLWdyZWVuLWNvbG9yKTtcbiAgICB9XG4gICAgNDAlIHtcbiAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgIH1cbiAgICA2MCUge1xuICAgICAgICBmaWxsOiB2YXIoLS1ncmVlbi1jb2xvcilcbiAgICB9XG4gICAgODAlIHtcbiAgICAgICAgZmlsbDogY3VycmVudENvbG9yO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgICAgZmlsbDogdmFyKC0tZ3JlZW4tY29sb3IpO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }),

/***/ 7595:
/*!****************************************************!*\
  !*** ./src/app/status-nfc/status-nfc.component.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusNfcComponent: () => (/* binding */ StatusNfcComponent)
/* harmony export */ });
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/charging-manager-service */ 4629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);




class StatusNfcComponent {
  constructor(ChMgrService) {
    this.ChMgrService = ChMgrService;
    this.nfcStatus = _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Unknown;
    this.nfcText = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Done, "<span class='on'>Done</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Fail, "<span class='error'>Fail</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Pending, "<span class='intermediate'>Pending"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Idle, "<span class='idle'>Idle</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Unknown, "<span class='error'>Unknown</span>"]]);
    this.classMappings = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Done, 'on'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Fail, 'error'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Pending, 'intermediate'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Idle, 'idle'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.eAuthMsg.Unknown, 'error']]);
  }
  ngOnInit() {
    this.ChMgrService.getAuthState$().subscribe(s => this.nfcStatus = s);
  }
  static #_ = this.ɵfac = function StatusNfcComponent_Factory(t) {
    return new (t || StatusNfcComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ChMgrService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: StatusNfcComponent,
    selectors: [["app-status-nfc"]],
    decls: 8,
    vars: 2,
    consts: [[1, "picto", "drop-shadow", 2, "text-align", "center", 3, "ngClass"], ["width", "50%", "height", "100%", "version", "1.1", "viewBox", "0 0 21.649 26.458", "xmlns", "http://www.w3.org/2000/svg"], ["transform", "translate(-83.608 -165.89)"], ["transform", "matrix(1.6537 0 0 1.6537 81.204 165.89)", "fill", "currentColor"], ["d", "m7.3559 15.981c-1.5009-0.13384-2.9193-0.60315-4.116-1.3619-0.55788-0.35372-1.1599-0.83461-1.2409-0.99122-0.0954-0.18442-0.0188-0.40711 0.16664-0.48458 0.16796-0.0702 0.28435-0.0322 0.52763 0.17224 1.1069 0.93008 2.3622 1.5314 3.7612 1.8016 0.64825 0.12519 0.98701 0.15617 1.6997 0.15542 0.91936-9.7e-4 1.6015-0.0959 2.4315-0.33835 1.0404-0.30391 2.059-0.84169 2.8754-1.518 0.1722-0.14266 0.34817-0.27279 0.39104-0.28918 0.20163-0.0771 0.46996 0.0987 0.46996 0.30797 0 0.15479-0.0633 0.25669-0.271 0.43617-1.2895 1.1143-2.9134 1.8241-4.7228 2.0643-0.44832 0.0595-1.5345 0.0846-1.9725 0.0455zm0.0939-2.2071c-0.53956-0.0869-0.93473-0.20702-1.3805-0.41949-0.49421-0.23555-1.0644-0.64035-1.1586-0.82259-0.0944-0.18259-0.0245-0.38989 0.16128-0.47805 0.1545-0.0733 0.27662-0.0445 0.46797 0.11036 0.63969 0.51771 1.2932 0.79627 2.1235 0.90509 0.71812 0.0941 1.5452-0.0401 2.2296-0.36178 0.24243-0.11396 0.60174-0.34482 0.84423-0.54244 0.0861-0.0702 0.20097-0.13607 0.25526-0.14645 0.12977-0.0248 0.31282 0.0624 0.37231 0.17747 0.0981 0.18963 0.0404 0.35205-0.194 0.54677-0.66599 0.55319-1.4544 0.89904-2.351 1.0313-0.3808 0.0562-1.0206 0.0561-1.37-2.2e-4zm-5.8112-2.9094c-0.19407-0.10952-0.18453 0.0198-0.1844-2.4976 1.3e-4 -2.219 2e-3 -2.2978 0.0611-2.3946 0.0893-0.14641 0.2672-0.19426 0.42883-0.11533 0.10557 0.0516 0.26175 0.26979 1.2632 1.7652l1.1428 1.7064 0.0157-1.6437c9e-3 -0.90405 0.0274-1.6675 0.0418-1.6966 0.0745-0.15102 0.34828-0.20995 0.50334-0.10835 0.18044 0.11823 0.17698 0.0657 0.16778 2.5436l-8e-3 2.2719-0.11695 0.10717c-0.13126 0.12027-0.24981 0.13769-0.4019 0.059-0.0684-0.0353-0.39597-0.50244-1.2341-1.7595l-1.141-1.7114-0.018 3.2986-0.0969 0.0968c-0.11524 0.11522-0.29782 0.14902-0.42309 0.0783zm5.0853-0.0141c-0.0549-0.0344-0.11475-0.0906-0.13307-0.12483-0.0227-0.0424-0.0333-0.80163-0.0333-2.3788v-2.3165l0.092-0.0921c0.0506-0.0506 0.13692-0.10102 0.19177-0.11199 0.0548-0.011 0.75663-0.0199 1.5595-0.0199 1.6382 6e-5 1.6245-2e-3 1.734 0.22198 0.0708 0.14484 0.0443 0.28443-0.0774 0.40603l-0.092 0.0921h-2.6878v1.4715h0.92463c0.70994 0 0.94835 0.01 1.0268 0.0427 0.2221 0.0928 0.28159 0.37588 0.11758 0.55951l-0.0913 0.10225-1.9777 0.018-1.6e-4 0.89887c-1e-4 0.49835-0.014 0.94874-0.0313 1.0108-0.0657 0.23636-0.32336 0.34498-0.52231 0.22016zm5.6076 0.0129c-0.49249-0.10716-0.99001-0.4988-1.2138-0.95548-0.18334-0.37413-0.2071-0.55192-0.2071-1.5498 0-0.99665 0.024-1.1766 0.20566-1.5459 0.20379-0.41409 0.64224-0.78195 1.1082-0.92981 0.14041-0.0445 0.32745-0.0572 1.0131-0.0684 0.46252-8e-3 0.90255-4e-3 0.97784 7e-3 0.30652 0.046 0.43376 0.36472 0.23462 0.58777l-0.0913 0.10225-0.91844 0.0177c-0.8669 0.0167-0.92897 0.0218-1.1061 0.0912-0.25507 0.0999-0.51149 0.3563-0.61149 0.61144-0.0689 0.17578-0.0743 0.23856-0.0865 0.99454-8e-3 0.52627-3.7e-4 0.87896 0.0232 1.0141 0.0691 0.39688 0.27091 0.66594 0.6276 0.83677l0.20351 0.0975 0.87666 9e-3c0.54089 6e-3 0.91004 0.0222 0.96382 0.0434 0.27197 0.10725 0.28391 0.5012 0.0193 0.63802-0.11965 0.0619-1.7336 0.061-2.0189-1e-3zm-7.267-6.9173c-0.17342-0.078-0.24565-0.30438-0.15381-0.48199 0.0942-0.18224 0.66439-0.58704 1.1586-0.82259 1.3712-0.65355 2.9352-0.62191 4.3236 0.0875 0.3818 0.19507 0.8946 0.58224 0.97366 0.73513 0.0944 0.18259 0.0245 0.3899-0.16128 0.47805-0.15482 0.0735-0.27697 0.0444-0.46798-0.11123-1.2801-1.0432-2.9876-1.2271-4.4616-0.4805-0.27376 0.13867-0.43434 0.24346-0.73106 0.4771-0.19203 0.15121-0.3312 0.18557-0.48015 0.11857zm-2.9118-1.0958c-0.17352-0.0781-0.24565-0.30438-0.15369-0.48221 0.081-0.15661 0.683-0.6375 1.2409-0.99122 1.0903-0.69127 2.3182-1.1267 3.7246-1.3206 0.54451-0.0751 1.8039-0.0751 2.3482 3e-5 1.8529 0.2557 3.4447 0.9506 4.7385 2.0686 0.20769 0.17948 0.271 0.28138 0.271 0.43617 0 0.20922-0.26833 0.38506-0.46996 0.30797-0.0429-0.0164-0.21884-0.14652-0.39104-0.28918-0.9878-0.81835-2.2706-1.4281-3.5526-1.6886-0.60991-0.12394-1.0608-0.16706-1.7544-0.16779-1.1144-1e-3 -1.9883 0.14961-3.004 0.51828-0.74669 0.27103-1.6549 0.7848-2.256 1.2762-0.40547 0.33147-0.43007 0.34808-0.53717 0.36284-0.0576 8e-3 -0.14955-6e-3 -0.2044-0.0304z", "stroke-width", ".031962"], [1, "drop-shadow", 2, "font-weight", "800"], [2, "text-align", "center", "font-size", "20px"], [3, "innerHTML"]],
    template: function StatusNfcComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "svg", 1)(2, "g", 2)(3, "g", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](4, "path", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 5)(6, "p", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "span", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.classMappings.get(ctx.nfcStatus));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("innerHTML", ctx.nfcText.get(ctx.nfcStatus), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeHtml"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 2627:
/*!******************************************************!*\
  !*** ./src/app/status-plug/status-plug.component.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusPlugComponent: () => (/* binding */ StatusPlugComponent)
/* harmony export */ });
/* harmony import */ var _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../@core/services/charging-manager-service */ 4629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 6575);




class StatusPlugComponent {
  constructor(ChMgrService) {
    this.ChMgrService = ChMgrService;
    this.plugStatus = _core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Unknown;
    this.plugText = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.PlugOut, "<span class='intermediate'>Disconnected</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.PlugIn, "<span class='on'>Connected</span></br><span] class='intermediate'>Unlocked</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Lock, "<span class='on'>Connected</br>Locked</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Error, "<span class='error'>Error</span>"], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Unknown, "<span class='error'>Unknown</span>"]]);
    this.classMappings = new Map([[_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.PlugOut, 'intermediate'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.PlugIn, 'intermediate'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Lock, 'on'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Error, 'error'], [_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ePlugState.Unknown, 'error']]);
  }
  ngOnInit() {
    this.ChMgrService.getPlugState$().subscribe(s => this.plugStatus = s);
  }
  static #_ = this.ɵfac = function StatusPlugComponent_Factory(t) {
    return new (t || StatusPlugComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_charging_manager_service__WEBPACK_IMPORTED_MODULE_0__.ChMgrService));
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: StatusPlugComponent,
    selectors: [["app-status-plug"]],
    decls: 6,
    vars: 2,
    consts: [[1, "picto", "drop-shadow", 2, "text-align", "center", 3, "ngClass"], ["xmlns", "http://www.w3.org/2000/svg", "width", "50%", "height", "100%", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-plugin"], ["fill-rule", "evenodd", "d", "M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0Z"], [1, "drop-shadow", 2, "font-weight", "800"], [2, "text-align", "center", "font-size", "20px"], [3, "innerHTML"]],
    template: function StatusPlugComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "svg", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "path", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 3)(4, "p", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "span", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.classMappings.get(ctx.plugStatus));
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("innerHTML", ctx.plugText.get(ctx.plugStatus), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeHtml"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass],
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 1719:
/*!****************************************!*\
  !*** ./src/app/time/time.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeComponent: () => (/* binding */ TimeComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 3379);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 1699);


class TimeComponent {
  constructor() {
    this.currentTime = '';
  }
  ngOnInit() {
    (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.interval)(1000).subscribe(() => {
      this.updateCurrentTime();
    });
  }
  updateCurrentTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }
  static #_ = this.ɵfac = function TimeComponent_Factory(t) {
    return new (t || TimeComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: TimeComponent,
    selectors: [["app-time"]],
    decls: 4,
    vars: 1,
    consts: [["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-clock"], ["d", "M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"], ["d", "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"]],
    template: function TimeComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "svg", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "path", 1)(2, "path", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("\u00A0", ctx.currentTime, "");
      }
    },
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 5083:
/*!**********************************************************!*\
  !*** ./src/app/valeo-charger/valeo-charger.component.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ValeoChargerComponent: () => (/* binding */ ValeoChargerComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class ValeoChargerComponent {
  static #_ = this.ɵfac = function ValeoChargerComponent_Factory(t) {
    return new (t || ValeoChargerComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: ValeoChargerComponent,
    selectors: [["app-valeo-charger"]],
    decls: 0,
    vars: 0,
    template: function ValeoChargerComponent_Template(rf, ctx) {},
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 519:
/*!********************************************************!*\
  !*** ./src/app/zone-message/zone-message.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZoneMessageComponent: () => (/* binding */ ZoneMessageComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 1699);

class ZoneMessageComponent {
  static #_ = this.ɵfac = function ZoneMessageComponent_Factory(t) {
    return new (t || ZoneMessageComponent)();
  };
  static #_2 = this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: ZoneMessageComponent,
    selectors: [["app-zone-message"]],
    decls: 9,
    vars: 0,
    consts: [[1, "row"], [1, "col"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "fill", "currentColor", "viewBox", "0 0 16 16", 1, "bi", "bi-info-circle-fill"], ["d", "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"]],
    template: function ZoneMessageComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "svg", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "path", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, " Zone Message");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div")(7, "p");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro nemo aliquid possimus, adipisci ratione explicabo aspernatur necessitatibus dolores!");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()();
      }
    },
    styles: ["/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }),

/***/ 4913:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 6480);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 8629);
/// <reference types="@angular/localize" />


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ }),

/***/ 3190:
/*!************************************!*\
  !*** ./src/app/@core/afb/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 * Copyright (C) 2015-2021 "IoT.bzh"
 * Author: José Bollo <jose.bollo@iot.bzh>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var AFB = function (base, initialtoken) {
  if (typeof base != "object") base = {
    base: base,
    token: initialtoken
  };
  var initial = {
    base: base.base || "api",
    token: initialtoken || base.token || URLSearchParams(window.location.search).get('access_token') || URLSearchParams(window.location.search).get('token') || "HELLO",
    host: base.host || window.location.host,
    scheme: base.scheme || (window.location.protocol == "https:" ? "wss:" : "ws:"),
    url: base.url || undefined
  };
  var urlws = initial.url = initial.url || initial.scheme + "//" + initial.host + "/" + initial.base;
  var setURL = function (location, port) {
    let u = (window.location.protocol == "https:" ? "wss://" : "ws://") + location;
    if (port) {
      u += ':' + port;
    }
    urlws = u + '/' + initial.base;
  };

  /*********************************************/
  /****                                     ****/
  /****             AFB_context             ****/
  /****                                     ****/
  /*********************************************/
  var AFB_context;
  {
    var UUID = undefined;
    var TOKEN = initial.token;
    var context = function (token, uuid) {
      this.token = token;
      this.uuid = uuid;
    };
    context.prototype = {
      get token() {
        return TOKEN;
      },
      set token(tok) {
        if (tok) TOKEN = tok;
      },
      get uuid() {
        return UUID;
      },
      set uuid(id) {
        if (id) UUID = id;
      }
    };
    AFB_context = new context();
  }
  /*********************************************/
  /****                                     ****/
  /****             AFB_websocket           ****/
  /****                                     ****/
  /*********************************************/
  var AFB_websocket;
  {
    var CALL = 2;
    var RETOK = 3;
    var RETERR = 4;
    var EVENT = 5;
    var PROTO1 = "x-afb-ws-json1";
    AFB_websocket = function (on_open, on_abort) {
      var u = urlws,
        p = '?';
      if (AFB_context.token) {
        u = u + '?x-afb-token=' + AFB_context.token;
        p = '&';
      }
      if (AFB_context.uuid) u = u + p + 'x-afb-uuid=' + AFB_context.uuid;
      this.ws = new WebSocket(u, [PROTO1]);
      this.url = u;
      this.pendings = {};
      this.awaitens = {};
      this.counter = 0;
      this.ws.onopen = onopen.bind(this);
      this.ws.onerror = onerror.bind(this);
      this.ws.onclose = onclose.bind(this);
      this.ws.onmessage = onmessage.bind(this);
      this.onopen = on_open;
      this.onabort = on_abort;
    };
    function onerror(event) {
      var f = this.onabort;
      if (f) {
        delete this.onopen;
        delete this.onabort;
        f(this);
      }
      this.onerror && this.onerror(this);
    }
    function onopen(event) {
      var f = this.onopen;
      delete this.onopen;
      delete this.onabort;
      f && f(this);
    }
    function onclose(event) {
      var err = {
        jtype: 'afb-reply',
        request: {
          status: 'disconnected',
          info: 'server hung up'
        }
      };
      for (var id in this.pendings) {
        try {
          this.pendings[id][1](err);
        } catch (x) {/*NOTHING*/}
      }
      this.pendings = {};
      this.onclose && this.onclose();
    }
    function fire(awaitens, name, data) {
      var a = awaitens[name];
      if (a) a.forEach(function (handler) {
        handler(data, name);
      });
      var i = name.indexOf("/");
      if (i >= 0) {
        a = awaitens[name.substring(0, i)];
        if (a) a.forEach(function (handler) {
          handler(data, name);
        });
      }
      a = awaitens["*"];
      if (a) a.forEach(function (handler) {
        handler(data, name);
      });
    }
    function reply(pendings, id, ans, offset) {
      if (id in pendings) {
        var p = pendings[id];
        delete pendings[id];
        try {
          p[offset](ans);
        } catch (x) {/*TODO?*/}
      }
    }
    function onmessage(event) {
      var obj = JSON.parse(event.data);
      var code = obj[0];
      var id = obj[1];
      var ans = obj[2];
      AFB_context.token = obj[3];
      switch (code) {
        case RETOK:
          reply(this.pendings, id, ans, 0);
          break;
        case RETERR:
          reply(this.pendings, id, ans, 1);
          break;
        case EVENT:
        default:
          fire(this.awaitens, id, ans);
          break;
      }
    }
    function close() {
      this.ws.close();
      this.ws.onopen = this.ws.onerror = this.ws.onclose = this.ws.onmessage = this.onopen = this.onabort = function () {};
    }
    function call(method, request, callid) {
      return new Promise(function (resolve, reject) {
        var id, arr;
        if (callid) {
          id = String(callid);
          if (id in this.pendings) throw new Error("pending callid(" + id + ") exists");
        } else {
          do {
            id = String(this.counter = 4095 & this.counter + 1);
          } while (id in this.pendings);
        }
        this.pendings[id] = [resolve, reject];
        arr = [CALL, id, method, request];
        if (AFB_context.token) arr.push(AFB_context.token);
        this.ws.send(JSON.stringify(arr));
      }.bind(this));
    }
    function onevent(name, handler) {
      var id = name;
      var list = this.awaitens[id] || (this.awaitens[id] = []);
      list.push(handler);
    }
    AFB_websocket.prototype = {
      close: close,
      call: call,
      onevent: onevent
    };
  }
  /*********************************************/
  /****                                     ****/
  /****                                     ****/
  /****                                     ****/
  /*********************************************/
  return {
    context: AFB_context,
    ws: AFB_websocket,
    setURL: setURL
  };
};
exports.AFB = AFB;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(4686), __webpack_exec__(4913)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map