/**
 * @license
 * Copyright (C) 2020-2021 IoT.bzh Company
 * Contact: https://www.iot.bzh/licensing
 *
 * This file is part of the afb-ui-devtools module of the redpesk® project.
 *
 * $RP_BEGIN_LICENSE$
 * Commercial License Usage
 *  Licensees holding valid commercial IoT.bzh licenses may use this file in
 *  accordance with the commercial license agreement provided with the
 *  Software or, alternatively, in accordance with the terms contained in
 *  a written agreement between you and The IoT.bzh Company. For licensing terms
 *  and conditions see https://www.iot.bzh/terms-conditions. For further
 *  information use the contact form at https://www.iot.bzh/contact.
 *
 * GNU General Public License Usage
 *  Alternatively, this file may be used under the terms of the GNU General
 *  Public license version 3. This license is as published by the Free Software
 *  Foundation and appearing in the file LICENSE.GPLv3 included in the packaging
 *  of this file. Please review the following information to ensure the GNU
 *  General Public License requirements will be met
 *  https://www.gnu.org/licenses/gpl-3.0.html.
 * $RP_END_LICENSE$
 */
import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, from, ReplaySubject, forkJoin } from 'rxjs';
import { filter, switchMap, map, take } from 'rxjs/operators';
import { AFB } from '../afb';

export interface AFBEvent {
    jtype: string;
    event: string;
    data: any;
}

export interface SocketStatus {
    connected: boolean;
    reconnect_attempt: number;
    reconnect_failed: boolean;
}

export interface AFBApi {
    api: string;
    title: string;
    version: string;
    description: string;
    verbs: AFBVerb[];
}

export interface IAfbRequest {
    status: string;
    code: Number;
}
export interface IAfbResponse {
    jtype: string;
    request: IAfbRequest;
    response: any;
}

export interface AFBApis extends Array<AFBApi> { }

export interface AFBVerb {
    verb: string;
    query: string;
    description: string;
}

@Injectable()
export class AFBWebSocketService {

    conn_location: string;
    conn_port: string;
    wsConnect$: Observable<Event>;
    wsDisconnect$: Observable<Event>;
    wsEvent$: Observable<Event>;
    Status$: Observable<SocketStatus>;
    InitDone$: Observable<boolean>;
    AutoReconnect$: Observable<boolean>;
    event$: Observable<Array<string>>;

    private ws: any;
    private _wsConnectSubject = new Subject<Event>();
    private _wsDisconnectSubject = new Subject<Event>();
    private _wsEventSubject = new Subject<Event>();
    private _status = <SocketStatus>{ connected: false };
    private _statusSubject = <BehaviorSubject<SocketStatus>>new BehaviorSubject(this._status);
    private _isInitDone = <ReplaySubject<boolean>>new ReplaySubject(1);
    private afb: any;

    constructor() {
    }


    /**
     * Initializes the class with a base URL and an optional initial token.
     *
     * @param {string} base - The base URL for the class.
     * @param {string} [initialToken] - An optional initial token.
     */
    Init(base: string, initialToken?: string) {
        this.afb = new AFB({
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
    SetURL(location: string, port?: string) {
        this.conn_location = location;
        this.conn_port = port || '';
        this.afb.setURL(location, port);
    }

    /**
     * Returns the URL based on the connection location and port.
     *
     * @return {string} The URL.
     */
    GetUrl(): string {
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
    Connect(): (Error | null) {

        // Establish websocket connection
        this.ws = new this.afb.ws(
            //  onopen
            (event: Event) => {
                this._NotifyServerState(true);
                this._wsConnectSubject.next(event);
                this._isInitDone.next(true);
            },
            // onerror
            () => {
                this._isInitDone.next(false);
                console.error('Can not open websocket');
            }
        );

        /**
         * Sets the callback function to be executed when the WebSocket connection is closed.
         *
         * @param {CloseEvent} event - The event object representing the WebSocket connection close event.
         */
        this.ws.onclose = (event: CloseEvent) => {
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

    Send(method: string, params: object | string | boolean): Observable<any> {
        const param = this.CheckQuery(params);
        return this._isInitDone.pipe(
            filter(done => done),
            switchMap(() => {
                return from(this.ws.call(method, param)
                    .then((obj) => {
                        return obj;
                    },
                    ).catch((err) => {
                        return (err);
                    },
                    )
                );
            }),
            take(1),
        );
    }

    /**
     * Check if the given string is a valid JSON.
     *
     * @param {string} str - The string to be checked.
     * @return {boolean} Returns true if the string is a valid JSON, otherwise returns false.
     */
    CheckIfJson(str: string): boolean {
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
    CheckQuery(params: object | string | boolean): any {
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
    syntaxHighlight(json: any) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function (match) {
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
    OnEvent(eventName: string): Observable<AFBEvent> {
        // Convert websocket Event based on callback to an Observable
        return Observable.create(
            observer => {
                this.ws.onevent(eventName, (event: AFBEvent) => {
                    observer.next(event);
                });
            },
        );
    }


    /**
     * Notifies the server state.
     *
     * @param {boolean} connected - The connection state.
     * @param {number} [attempt] - The number of connection attempts.
     */
    private _NotifyServerState(connected: boolean, attempt?: number) {
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
    getApis(): Observable<Array<string>> {
        return this.Send('monitor/get', { 'apis': false }).pipe(
            map(data => {
                const apis: Array<string> = [];
                const keys = Object.keys(data.response.apis);
                const results = keys.map(key => ({ key: key, value: data.response.apis[key] }));
                results.forEach(value => {
                    if (value.key !== 'monitor') {
                        apis.push(value.key);
                    }
                });
                return apis;
            })
        );
    }

    /**
     * Retrieves the AFBApis by sending a GET request to the 'monitor/get' endpoint.
     *
     * @return {Observable<AFBApis>} An observable that emits the retrieved AFBApis.
     */
    Discover(): Observable<AFBApis> {
        return this.Send('monitor/get', { 'apis': true }).pipe(
            map(data => {
                return this._GetAFBApis(data.response);
            })
        );
    }

    /**
     * Generates the function comment for the private _GetAFBApis function.
     *
     * @param {any} data - The input data for the function.
     * @return {AFBApis} The array of AFBApis generated by the function.
     */
    private _GetAFBApis(data: any) {
        const Apis: AFBApis = [];
        const keys = Object.keys(data.apis);
        const results = keys.map(key => ({ key: key, value: data.apis[key] }));
        results.forEach(value => {
            if (value.key !== 'monitor') {
                const AFBVerbs2 = this._GetAFBVerbs(value);
                const api = <AFBApi>{
                    api: value.key,
                    title: value.value.info.title,
                    version: value.value.info.version,
                    description: value.value.info.description,
                    verbs: AFBVerbs2,
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
    private _GetAFBVerbs(value: any) {
        const AFBVerbs: Array<AFBVerb> = [];
        const verbs = Object.keys(value.value.paths);
        const paths = verbs.map(path => ({ path: path, verb: value.value.paths[path] }));
        paths.forEach(path => {
            const verb = <AFBVerb>{
                verb: path.path,
                query: '',
                description: path.verb.get.responses[200].description,
            };
            AFBVerbs.push(verb);
        });
        return AFBVerbs;
    }
}
