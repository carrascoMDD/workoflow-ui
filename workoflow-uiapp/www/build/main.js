webpackJsonp([0],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserData; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logins_provider__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__interfaces_flow_identityactivation__ = __webpack_require__(311);
/*
 * user-data.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var STOREKEYSEPARATORTOREPLACE = /_-_/g;
var STOREKEYSEPARATORTOREPLACEMENT = "=-=";
var STOREKEYPREFIX = "ACTIVEAPPLICATIONIDENTITIES";
var UserData = (function () {
    function UserData(events, storage, loginsProvider) {
        this.events = events;
        this.storage = storage;
        this.loginsProvider = loginsProvider;
        this.HAS_LOGGED_IN = 'hasLoggedIn';
        this.HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
        this.processingLogin = false;
        this.logins = null;
        this.authenticatedLogin = null;
    }
    UserData.prototype.registerInterest_IdentityActivationsChanged = function (theHandler) {
        if (!theHandler) {
            return;
        }
        if (!this.identityActivationsChangedHandlers) {
            this.identityActivationsChangedHandlers = [];
        }
        this.identityActivationsChangedHandlers.push(theHandler);
    };
    UserData.prototype.propagate_IdentityActivationsChanged = function () {
        var _this = this;
        if (!this.identityActivationsChangedHandlers || !this.identityActivationsChangedHandlers.length) {
            return new Promise(function (resolve) {
                resolve();
            });
        }
        /* ************************************************************
        Return a Promise which shall be fulfilled after the chained fulfillement of all the change handlers
         */
        return new Promise(function (resolveTop) {
            var someIdentityActivationsToPropagate = null;
            if (_this.authenticatedLogin) {
                someIdentityActivationsToPropagate = _this.identityActivations;
            }
            var aFirstResolve = null;
            var aFirstPromise = new Promise(function (resolve) {
                aFirstResolve = resolve;
            });
            var aPreviousPromise = aFirstPromise;
            var _loop_1 = function (anIdentityActivationsChangedHandler) {
                aPreviousPromise = aPreviousPromise.then(function () {
                    return anIdentityActivationsChangedHandler(someIdentityActivationsToPropagate);
                }, function () {
                    return anIdentityActivationsChangedHandler(someIdentityActivationsToPropagate);
                });
            };
            /* ************************************************************
            Each handler executed after the fulfillement
            of aPreviousPromise which is either the first promise or the resulting promise of the previous handler,
            therefore the propagation of changes to the handlers starts upon fulfillement of the first promise
            done imperatively at the bottom of this method,
            and chains one after the other.
            After the last one, the promise returned by this propagate method is fullfilled,
            just in case somebody is waiting to do something
            after the change propagation completes.
            */
            for (var _i = 0, _a = _this.identityActivationsChangedHandlers; _i < _a.length; _i++) {
                var anIdentityActivationsChangedHandler = _a[_i];
                _loop_1(anIdentityActivationsChangedHandler);
            }
            /* ************************************************************
            Sanity check, should not happen because of the check done at the top of the method on
            this.identityActivationsChangedHandlers.length
            and would anyway be handled properly by (empty but for the initial) chaining execution.
            */
            if (aPreviousPromise === aFirstPromise) {
                resolveTop();
                return;
            }
            aPreviousPromise.then(function () {
                resolveTop();
            }, function () {
                resolveTop();
            });
            /* ************************************************************
            Start propagating by resolving the first Promise
            */
            aFirstResolve();
        });
    };
    UserData.prototype.resolveAllWaitingForLoginProcessing = function () {
        if (this.waitingForLoginProcessing) {
            for (var _i = 0, _a = this.waitingForLoginProcessing; _i < _a.length; _i++) {
                var aPromise = _a[_i];
                aPromise(null);
            }
        }
        this.waitingForLoginProcessing = null;
    };
    UserData.prototype.toWaitForLoginProcessing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_this.waitingForLoginProcessing) {
                _this.waitingForLoginProcessing = [];
            }
            _this.waitingForLoginProcessing.push(resolve);
        });
    };
    UserData.prototype.authenticationPerformed = function (theAuthentication) {
        var _this = this;
        this.logins = null;
        this.authenticatedLogin = null;
        this.identityActivations = null;
        if (!theAuthentication || !theAuthentication._v_Success) {
            return new Promise(function (resolve) { resolve(theAuthentication); });
        }
        /* ************************************************************
        Avoid other clients or subscribers to launch resolution of identityActivations
        when already on its (asynchronous) way.
        */
        this.processingLogin = true;
        this.waitingForLoginProcessing = [];
        return new Promise(function (resolve) {
            _this.loginsProvider.getAllLogins().subscribe(function (theLogins) {
                _this.logins = theLogins;
                _this.authenticatedLogin = null;
                _this.identityActivations = null;
                for (var _i = 0, theLogins_1 = theLogins; _i < theLogins_1.length; _i++) {
                    var aLogin = theLogins_1[_i];
                    if (aLogin && (aLogin.login === theAuthentication.login)) {
                        _this.authenticatedLogin = aLogin;
                        break;
                    }
                }
                /* ************************************************************
                If not found a login matching the authenticated
                then do not build the list of identityActivations with active state from storage.
                */
                if (!_this.authenticatedLogin) {
                    _this.processingLogin = false;
                    _this.resolveAllWaitingForLoginProcessing();
                    _this.events.publish('user:logout');
                    resolve(theAuthentication);
                    return;
                }
                /* ************************************************************
                Build the list of identityActivations with active state from storage.
                Create non-active IdentityActivations for all the LoginApplication in the Login
                matching theAuthentication.login
                Index the identityActivations by application key and identity key
                to avoid N*N complexity in match with stored key pairs, below.
                */
                var someIdentityActivationsByKeys = new Map();
                if (_this.authenticatedLogin) {
                    _this.identityActivations = [];
                    for (var _a = 0, _b = _this.authenticatedLogin.loginApplications; _a < _b.length; _a++) {
                        var aLoginApplication = _b[_a];
                        if (aLoginApplication) {
                            if (aLoginApplication.applicationKey && aLoginApplication.identityKeys) {
                                for (var _c = 0, _d = aLoginApplication.identityKeys; _c < _d.length; _c++) {
                                    var anIdentityKey = _d[_c];
                                    var anIdentityActivation = new __WEBPACK_IMPORTED_MODULE_4__interfaces_flow_identityactivation__["a" /* IdentityActivation */](aLoginApplication.applicationKey, anIdentityKey, false);
                                    _this.identityActivations.push(anIdentityActivation);
                                    var someIdentityActivationsByKey = someIdentityActivationsByKeys[aLoginApplication.applicationKey];
                                    if (!someIdentityActivationsByKey) {
                                        someIdentityActivationsByKey = new Map();
                                        someIdentityActivationsByKeys[aLoginApplication.applicationKey] = someIdentityActivationsByKey;
                                    }
                                    someIdentityActivationsByKey[anIdentityKey] = anIdentityActivation;
                                }
                            }
                        }
                    }
                }
                /* ************************************************************
                Retrieve from local store the application key - identity key pairs
                which the logged in user did select as active sometime in the past,
                saving the User the need  to activate manually often-used identities at the beginning of work sessions.
                Stored as an array of elements with IIdentityActivation - like layout:
                    applicationKey: string;
                    identityKey: string;
                    active: boolean;
                */
                var aStorageKey = STOREKEYPREFIX + theAuthentication.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
                _this.storage.get(aStorageKey).then(function (theStoredIdentityActivations) {
                    // ? is it a string or an object ?
                    if (theStoredIdentityActivations) {
                        for (var _i = 0, theStoredIdentityActivations_1 = theStoredIdentityActivations; _i < theStoredIdentityActivations_1.length; _i++) {
                            var anStoredIdentityActivation = theStoredIdentityActivations_1[_i];
                            if (!anStoredIdentityActivation) {
                                continue;
                            }
                            if (!anStoredIdentityActivation.applicationKey || !anStoredIdentityActivation.identityKey) {
                                continue;
                            }
                            var someApplicationIdentityActivations = someIdentityActivationsByKeys[anStoredIdentityActivation.applicationKey];
                            if (someApplicationIdentityActivations) {
                                var anApplicationIdentityActivation = someApplicationIdentityActivations[anStoredIdentityActivation.identityKey];
                                if (anApplicationIdentityActivation) {
                                    anApplicationIdentityActivation.setActive(anStoredIdentityActivation.active === true);
                                }
                            }
                        }
                    }
                    _this.processingLogin = false;
                    _this.resolveAllWaitingForLoginProcessing();
                    _this.events.publish('user:login');
                    resolve(theAuthentication);
                });
            });
        });
    };
    UserData.prototype.storeAndPropagageIdentityActivations = function () {
        var _this = this;
        if (!this.authenticatedLogin || this.processingLogin) {
            return new Promise(function (resolve) {
                resolve(null);
            });
        }
        return new Promise(function (pheResolve, pheReject) {
            var aStorageKey = STOREKEYPREFIX + _this.authenticatedLogin.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
            _this.storage.set(aStorageKey, _this.identityActivations)
                .then(function () {
                pheResolve(_this.identityActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    UserData.prototype.storeIdentityActivations = function () {
        var _this = this;
        if (!this.authenticatedLogin || this.processingLogin) {
            return new Promise(function (resolve) {
                resolve(null);
            });
        }
        return new Promise(function (pheResolve, pheReject) {
            var aStorageKey = STOREKEYPREFIX + _this.authenticatedLogin.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
            _this.storage.set(aStorageKey, _this.identityActivations)
                .then(function () {
                pheResolve(_this.identityActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    UserData.prototype.getIdentityActivations = function () {
        var _this = this;
        if (this.processingLogin) {
            return this.toWaitForLoginProcessing();
        }
        if (!this.authenticatedLogin) {
            return new Promise(function (resolve) {
                resolve(null);
            });
        }
        return new Promise(function (resolve) {
            resolve(_this.identityActivations);
        });
    };
    UserData.prototype.signup = function (username) {
        if (username) { } /*CQT*/
        this.storage.set(this.HAS_LOGGED_IN, true);
        this.events.publish('user:signup');
    };
    UserData.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { } /*CQT*/
            _this.authenticatedLogin = null;
            _this.processingLogin = false;
            _this.waitingForLoginProcessing = null;
            _this.identityActivationsChangedHandlers = null;
            _this.identityActivations = null;
            _this.storage.remove(_this.HAS_LOGGED_IN)
                .then(function () {
                return _this.storage.remove('username');
            }, function (theError) {
                console.log("UserData.logout() Error=" + theError);
                throw theError;
            })
                .then(function () {
                _this.events.publish('user:logout');
                pheResolve();
            }, function (theError) {
                console.log("UserData.logout() Error=" + theError);
                throw theError;
            })
                .catch(function (theError) {
                if (theError) { } /*CQT*/
                try {
                    _this.events.publish('user:logout');
                }
                catch (anException) { }
                pheResolve();
            });
        });
    };
    UserData.prototype.hasLoggedIn = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.getAuthenticatedLogin()
                .then(function (theLogin) {
                pheResolve(!(typeof theLogin === "undefined") && !(theLogin === null));
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    UserData.prototype.getAuthenticatedLogin = function () {
        var _this = this;
        return new Promise(function (resolve) {
            resolve(_this.authenticatedLogin);
        });
    };
    UserData.prototype.checkHasSeenTutorial = function () {
        return this.storage.get(this.HAS_SEEN_TUTORIAL).then(function (value) {
            return value;
        });
    };
    UserData = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__logins_provider__["a" /* LoginsProvider */]])
    ], UserData);
    return UserData;
}());

//# sourceMappingURL=user-data.js.map

/***/ }),

/***/ 109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_logins__ = __webpack_require__(310);
/*
 * logins-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_LOGINS_realhost	= "";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_LOGINS_samehost = "assets/flow/flow-logins-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_LOGINS = URL_LOGINS_samehost;
var LoginsProvider = (function () {
    function LoginsProvider(httpc) {
        this.httpc = httpc;
        console.log("LoginsProvider constructor");
    }
    LoginsProvider.prototype.getAllLogins = function () {
        return this.load();
    };
    LoginsProvider.prototype.load = function () {
        if (this.logins) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(this.logins);
        }
        else {
            this.logins = null;
            return this.httpc.get(URL_SCHEMEHOSTPORT + URL_LOGINS).map(this.parseLogins, this);
        }
    };
    LoginsProvider.prototype.sliceOrNull = function (theStrings) {
        if (!theStrings) {
            return null;
        }
        if (typeof theStrings === "undefined") {
            return null;
        }
        if (!(typeof theStrings.length === "number")) {
            return null;
        }
        if (!theStrings.length) {
            return [];
        }
        return theStrings.slice();
    };
    LoginsProvider.prototype.parseLogins = function (theSrcLogins) {
        console.log(">>> LoginsProvider parseLogins");
        this.logins = [];
        if (!theSrcLogins) {
            return;
        }
        for (var _i = 0, theSrcLogins_1 = theSrcLogins; _i < theSrcLogins_1.length; _i++) {
            var aSrcLogin = theSrcLogins_1[_i];
            if (aSrcLogin) {
                console.log("    LoginsProvider parseLogins aLogin=" + aSrcLogin.login);
                var aLogin = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_logins__["a" /* Login */](aSrcLogin.login, aSrcLogin.name, aSrcLogin.familyName);
                if (aSrcLogin.loginApplications) {
                    for (var _a = 0, _b = aSrcLogin.loginApplications; _a < _b.length; _a++) {
                        var aSrcLoginApplication = _b[_a];
                        if (!aSrcLoginApplication) {
                            continue;
                        }
                        var aLoginApplication = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_logins__["b" /* LoginApplication */](aSrcLoginApplication.applicationKey, this.sliceOrNull(aSrcLoginApplication.identityKeys));
                        aLogin.addLoginApplication(aLoginApplication);
                    }
                }
                this.logins.push(aLogin);
            }
        }
        console.log("<<< LoginsProvider parseLogins");
        return this.logins;
    };
    LoginsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HttpClient */]])
    ], LoginsProvider);
    return LoginsProvider;
}());

//# sourceMappingURL=logins-provider.js.map

/***/ }),

/***/ 110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Typed; });
/*
 * flow-typed.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var Typed = (function () {
    function Typed() {
    }
    return Typed;
}());

//# sourceMappingURL=flow-typed.js.map

/***/ }),

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/*
 * inbox.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var InboxPage = (function (_super) {
    __extends(InboxPage, _super);
    function InboxPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.flowboxTitle = "Inbox";
        _this.flowboxIcon = "mail";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    InboxPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], InboxPage.prototype, "contentsList", void 0);
    InboxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-inbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/inbox/inbox.html"*/'<!--\n* inbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Inbox\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/inbox/inbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], InboxPage);
    return InboxPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=inbox.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoggedinPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(46);
/*
 * loggedin.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LoggedinPage = (function () {
    function LoggedinPage(app, alertCtrl, loadingCtrl, modalCtrl, navCtrl, toastCtrl, userData) {
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.userData = userData;
        console.log("(abstract)LoggedinPage constructor");
    }
    LoggedinPage.prototype.ionViewDidLoad = function () {
        console.log("(abstract)LoggedinPage ionViewDidLoad");
        this.app.setTitle("(abstract)LoggedinPage");
    };
    LoggedinPage.prototype.ionViewCanEnter = function () {
        return this.beLoggedinOrGoToLoginPage();
    };
    LoggedinPage.prototype.beLoggedinOrGoToLoginPage = function () {
        var _this = this;
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise(function (pheResolve, pheReject) {
            _this.userData.getAuthenticatedLogin()
                .then(function (theAuthenticatedLogin) {
                if (theAuthenticatedLogin) {
                    _this.authenticatedLogin = theAuthenticatedLogin;
                    console.log("(abstract)LoggedinPage LOGGED IN beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin()");
                    pheResolve(theAuthenticatedLogin);
                    return;
                }
                else {
                    console.log("(abstract)LoggedinPage NOT logged in beLoggedinOrGoToLoginPage FALSE theHasLoggedIn");
                    _this.presentAlert()
                        .then(function () {
                        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage after alert");
                        var aNavCtrlLength = 0;
                        try {
                            aNavCtrlLength = _this.navCtrl && _this.navCtrl.length();
                        }
                        catch (anException) {
                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage EXCEPTION during this.navCtrl && this.navCtrl.length()" + anException);
                        }
                        if (aNavCtrlLength) {
                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.navCtrl.length()=" + _this.navCtrl.length() + " about to popToRoot()");
                            setTimeout(function () {
                                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */])
                                    .then(function () {
                                    console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                    pheReject("User not logged in");
                                }, function (theError) {
                                    var aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in popToRoot() theError=" + theError;
                                    console.log(aMsg);
                                    pheReject("User not logged in\n" + aMsg);
                                });
                            }, 0);
                        }
                        else {
                            console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage EMPTY this.navCtrl.length()" + " about to setRoot( LoginPage)");
                            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */])
                                .then(function () {
                                console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage done this.app.getRootNav().setRoot( LoginPage)");
                                pheReject(false);
                            }, function (theError) {
                                var aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage ERROR in setRoot() theError=" + theError;
                                console.log(aMsg);
                                pheReject("User not logged in\n" + aMsg);
                            });
                        }
                    }, function (theError) {
                        var aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage NO this.userData.getAuthenticatedLogin() theError=" + theError;
                        console.log(aMsg);
                        pheReject("User not logged in\n" + aMsg);
                    });
                }
            }, function (theError) {
                var aMsg = "((abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin() error=" + theError;
                console.log(aMsg);
                pheReject("User not logged in\n" + aMsg);
            });
        });
    };
    LoggedinPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: "You are not logged in, or your session expired",
            subTitle: "Please login",
            buttons: ["Go to Login"]
        });
        return alert.present();
    };
    LoggedinPage.prototype.toast_Updated = function (theMessage, theMillisToToast) {
        var _this = this;
        if (theMillisToToast === void 0) { theMillisToToast = 3000; }
        return new Promise(function (pheResolveTop, pheRejectTop) {
            if (pheRejectTop) { } /*CQT*/
            _this.toastCtrl
                .create({
                message: (theMessage ? theMessage : "Updated"),
                duration: (theMillisToToast <= 30000 ? theMillisToToast : 30000)
            })
                .present()
                .then(function () {
                pheResolveTop();
            }, function () {
                pheResolveTop();
            });
        });
    };
    LoggedinPage.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { } /*CQT*/
            _this.userData.logout()
                .then(function () {
                return _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
            }, function (theError) {
                if (theError) { } /*CQT*/
                throw theError;
            })
                .then(function () {
                pheResolve();
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    LoggedinPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    LoggedinPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-loggedin',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/loggedin/loggedin.html"*/'<!--\n* loggedin.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/loggedin/loggedin.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], LoggedinPage);
    return LoggedinPage;
}());

//# sourceMappingURL=loggedin.js.map

/***/ }),

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraftsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/*
 * drafts.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DraftsPage = (function (_super) {
    __extends(DraftsPage, _super);
    function DraftsPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.flowboxTitle = "Drafts";
        _this.flowboxIcon = "mail-open";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    DraftsPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], DraftsPage.prototype, "contentsList", void 0);
    DraftsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-drafts',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/drafts/drafts.html"*/'<!--\n* drafts.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Drafts\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/drafts/drafts.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], DraftsPage);
    return DraftsPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=drafts.js.map

/***/ }),

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArchivedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/*
 * archived.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ArchivedPage = (function (_super) {
    __extends(ArchivedPage, _super);
    function ArchivedPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.flowboxTitle = "Archived";
        _this.flowboxIcon = "done-all";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    ArchivedPage.prototype.ionViewDidLoad = function () {
        console.log("ArchivedPage ionViewDidLoad");
        this.app.setTitle(this.flowboxTitle);
        this.flowheader.setFlowPage(this);
    };
    ArchivedPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], ArchivedPage.prototype, "contentsList", void 0);
    ArchivedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-archived',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/archived/archived.html"*/'<!--\n* archived.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Archived\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/archived/archived.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], ArchivedPage);
    return ArchivedPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=archived.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BouncedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/*
 * bounced.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var BouncedPage = (function (_super) {
    __extends(BouncedPage, _super);
    function BouncedPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.flowboxTitle = "Bounced";
        _this.flowboxIcon = "undo";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    BouncedPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], BouncedPage.prototype, "contentsList", void 0);
    BouncedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-bounced',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/bounced/bounced.html"*/'<!--\n* bounced.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Bounced\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/bounced/bounced.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], BouncedPage);
    return BouncedPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=bounced.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_detail_template_detail__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__filters_templates_filter__ = __webpack_require__(118);
/*
 * templates.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TemplatesPage = (function (_super) {
    __extends(TemplatesPage, _super);
    function TemplatesPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData, templatesFilter) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.templatesFilter = templatesFilter;
        _this.flowboxTitle = "Templates";
        _this.flowboxIcon = "create";
        _this.segment = "all";
        _this.queryText = "";
        _this.templatespecs = [];
        _this.shownTemplates = [];
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    TemplatesPage.prototype.updateContent = function () {
        return this.updateTemplates();
    };
    TemplatesPage.prototype.updateTemplates = function () {
        var _this = this;
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        // seem to be synchronous! - probably just touches some variables
        this.contentsList && this.contentsList.closeSlidingItems();
        return new Promise(function (resolver) {
            _this.templatesFilter.getTemplatespecs(_this.queryText).subscribe(function (theTemplatespecs) {
                _this.templatespecs = theTemplatespecs;
                _this.shownTemplates = _this.templatespecs;
                console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
                resolver(_this.templatespecs);
            });
        });
    };
    TemplatesPage.prototype.goToTemplateDetail = function (theTemplatespec) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__template_detail_template_detail__["a" /* TemplateDetailPage */], {
            templatespec: theTemplatespec,
            name: theTemplatespec.name,
            key: theTemplatespec.key
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], TemplatesPage.prototype, "contentsList", void 0);
    TemplatesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-templates',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/templates/templates.html"*/'<!--\n* templates.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="!templatespecs || ( templatespecs.length === 0)">\n        \n        <ion-item-sliding *ngFor="let aTemplatespec of templatespecs" #slidingItem\n                          [attr.track]="aTemplatespec.key | lowercase" [hidden]="aTemplatespec.hide">\n            \n            <button ion-item (click)="goToTemplateDetail(aTemplatespec)">\n                <h3>{{aTemplatespec.name}} - {{aTemplatespec.key}}</h3>\n                <p>\n                    {{aTemplatespec.description}}\n                </p>\n            </button>\n            \n            <ion-item-options>\n                <button ion-button color="favorite" (click)="addFavorite(slidingItem, aTemplatespec)"\n                        *ngIf="segment === \'all\'">\n                    Favorite\n                </button>\n                <button ion-button color="danger"\n                        (click)="removeFavorite(slidingItem, aTemplatespec, \'Remove Favorite\')"\n                        *ngIf="segment === \'favorites\'">\n                    Remove\n                </button>\n            </ion-item-options>\n        \n        </ion-item-sliding>\n    \n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="templatespecs && templatespecs.length > 0">\n        No Templates Found\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/templates/templates.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_5__filters_templates_filter__["a" /* TemplatesFilter */]])
    ], TemplatesPage);
    return TemplatesPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=templates.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_common_http__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__interfaces_flow_templatespecs__ = __webpack_require__(312);
/*
 * templates-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_PROCESSDEFINITIONS_realhost	= "/process-api/repository/process-definitions";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_PROCESSDEFINITIONS_samehost = "assets/flow/flow-templates-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_PROCESSDEFINITIONS = URL_PROCESSDEFINITIONS_samehost;
/*
const URL_PROCESSINSTANCES   	= "/process-api/runtime/process-instances";
const URL_QUERYTASKS 			= "/process-api/query/tasks";
const URL_TASKVARIABLESALL 	= "/process-api/runtime/tasks/{taskId}/variables";
const URL_TASKVARIABLESLOCAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=local";
const URL_TASKVARIABLESGLOBAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=global";
const URL_EXECUTETASKACTION    = "/process-api/runtime/tasks/{taskId}";
*/
var TemplatesProvider = (function () {
    function TemplatesProvider(httpc, user) {
        this.httpc = httpc;
        this.user = user;
        console.log("TemplatesProvider constructor");
    }
    TemplatesProvider.prototype.getTemplatespecs = function (queryText) {
        if (queryText === void 0) { queryText = ''; }
        console.log("TemplatesProvider getTemplatespecs queryText" + queryText);
        return this.load();
    };
    ;
    TemplatesProvider.prototype.load = function () {
        if (this.templatespecs) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(this.templatespecs);
        }
        else {
            this.templatespecs = null;
            var aURL = URL_SCHEMEHOSTPORT + URL_PROCESSDEFINITIONS;
            return this.httpc.get(aURL).map(this.parseProcessSpec, this);
        }
    };
    TemplatesProvider.prototype.parseProcessSpec = function (theSpecs) {
        this.templatespecs = [];
        if (!theSpecs) {
            return;
        }
        var someProcessSpecs = theSpecs.data;
        if (!someProcessSpecs) {
            return;
        }
        for (var _i = 0, someProcessSpecs_1 = someProcessSpecs; _i < someProcessSpecs_1.length; _i++) {
            var aProcessSpec = someProcessSpecs_1[_i];
            if (aProcessSpec) {
                var aTemplatespec = new __WEBPACK_IMPORTED_MODULE_6__interfaces_flow_templatespecs__["a" /* Templatespec */](aProcessSpec.id, aProcessSpec.url, aProcessSpec.key, aProcessSpec.version, aProcessSpec.name, aProcessSpec.description, aProcessSpec.tenantId, aProcessSpec.deploymentId, aProcessSpec.deploymentUrl, aProcessSpec.resource, aProcessSpec.diagramResource, aProcessSpec.category, aProcessSpec.graphicalNotationDefined, aProcessSpec.suspended, aProcessSpec.startFormDefined);
                if (aProcessSpec.variables) {
                    for (var _a = 0, _b = aProcessSpec.variables; _a < _b.length; _a++) {
                        var aProcessVariable = _b[_a];
                        if (!aProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new __WEBPACK_IMPORTED_MODULE_6__interfaces_flow_templatespecs__["b" /* Variablespec */](aProcessVariable.name, aProcessVariable.type);
                        aTemplatespec.addVariablespec(aVariableSpec);
                    }
                }
                if (aProcessSpec.transientVariables) {
                    for (var _c = 0, _d = aProcessSpec.transientVariables; _c < _d.length; _c++) {
                        var aTransientProcessVariable = _d[_c];
                        if (!aTransientProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new __WEBPACK_IMPORTED_MODULE_6__interfaces_flow_templatespecs__["b" /* Variablespec */](aTransientProcessVariable.name, aTransientProcessVariable.type);
                        aTemplatespec.addTransientVariablespec(aVariableSpec);
                    }
                }
                this.templatespecs.push(aTemplatespec);
            }
        }
        return this.templatespecs;
    };
    TemplatesProvider.prototype.filterTemplate = function (theTemplatespec, queryWords) {
        var matchesQueryText = false;
        if (queryWords.length) {
            // of any query word is in the session name than it passes the query test
            queryWords.forEach(function (queryWord) {
                if ((theTemplatespec.name.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.key.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.description.toLowerCase().indexOf(queryWord) >= 0)) {
                    matchesQueryText = true;
                }
            });
        }
        else {
            // if there are no query words then this session passes the query test
            matchesQueryText = true;
        }
        // all tests must be true if it should not be hidden
        theTemplatespec.hide = !matchesQueryText;
    };
    TemplatesProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2__user_data__["a" /* UserData */]])
    ], TemplatesProvider);
    return TemplatesProvider;
}());

//# sourceMappingURL=templates-provider.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_applications_provider__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__active_filter__ = __webpack_require__(314);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_templates_provider__ = __webpack_require__(117);
/*
 * templates-filter.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TemplatesFilter = (function (_super) {
    __extends(TemplatesFilter, _super);
    function TemplatesFilter(userData, applicationsProvider, templatesProvider) {
        var _this = _super.call(this, userData, applicationsProvider) || this;
        _this.userData = userData;
        _this.applicationsProvider = applicationsProvider;
        _this.templatesProvider = templatesProvider;
        console.log("TemplatesFilter constructor");
        return _this;
    }
    TemplatesFilter.prototype.getTemplatespecs = function (queryText) {
        var _this = this;
        if (queryText === void 0) { queryText = ''; }
        console.log("TemplatesFilter getTemplatespecs queryText" + queryText);
        return new __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"](function (theObserver) {
            console.log("TemplatesFilter about to this.templatesProvider.getTemplatespecs().subscribe.\nDelivering after observing templatesProvider, observing applications provide, and .then on applications provider promise is resolved.");
            _this.templatesProvider.getTemplatespecs().subscribe(function (theTemplatespecs) {
                console.log("TemplatesFilter getTemplatespecs received this.templatesProvider.getTemplatespecs().subscribe theTemplatespecs.length=" + (!theTemplatespecs ? 0 : theTemplatespecs.length));
                if (!theTemplatespecs || !theTemplatespecs.length) {
                    console.log("TemplatesFilter no or empty theTemplatespecs from this.templatesProvider.getTemplatespecs().subscribe(");
                    theObserver.next(null);
                    theObserver.complete();
                    return;
                }
                console.log("TemplatesFilter about to this.applicationsProvider.getAllApplications().subscribe");
                _this.getAllApplicationsKeyed().subscribe(function (theApplicationsKeyedMap) {
                    console.log("TemplatesFilter getTemplatespecs received this.getAllApplicationsKeyed().subscribe theApplicationsKeyedMap.length=" + (!theApplicationsKeyedMap ? 0 : theApplicationsKeyedMap.size));
                    if (!theApplicationsKeyedMap || (theApplicationsKeyedMap.size < 1)) {
                        console.log("TemplatesFilter no or empty theApplications from this.getAllApplicationsKeyed().subscribe(");
                        theObserver.next(null);
                        theObserver.complete();
                        return;
                    }
                    console.log("TemplatesFilter about to  this.userData.getIdentityActivations().then(");
                    _this.userData.getIdentityActivations().then(function (theIdentityActivations) {
                        console.log("TemplatesFilter getTemplatespecs received this.userData.getIdentityActivations().then(\" theIdentityActivations.length=" + (!theIdentityActivations ? 0 : theIdentityActivations.length));
                        if (!theIdentityActivations || !theIdentityActivations.length) {
                            console.log("TemplatesFilter no or empty theIdentityActivations from this.userData.getIdentityActivations().then(");
                            theObserver.next(null);
                            theObserver.complete();
                            return;
                        }
                        console.log("TemplatesFilter about to  actually filter templatespecs against initiable or participed processSpecKeys of active identities in applications (according to selectors and loginApplications)");
                        var someAcceptableProcessSpecs = _this.acceptableProcessSpecs(theIdentityActivations);
                        if (!someAcceptableProcessSpecs) {
                            console.log("TemplatesFilter no or empty this.acceptableProcessSpecs(");
                            theObserver.next(null);
                            theObserver.complete();
                            return;
                        }
                        var someAcceptableProcessKeys = [];
                        for (var _i = 0, someAcceptableProcessSpecs_1 = someAcceptableProcessSpecs; _i < someAcceptableProcessSpecs_1.length; _i++) {
                            var aProcessSpec = someAcceptableProcessSpecs_1[_i];
                            if (aProcessSpec && aProcessSpec.key) {
                                if (someAcceptableProcessKeys.indexOf(aProcessSpec.key) < 0) {
                                    someAcceptableProcessKeys.push(aProcessSpec.key);
                                }
                            }
                        }
                        var someFilteredTemplatespecs = [];
                        for (var _a = 0, theTemplatespecs_1 = theTemplatespecs; _a < theTemplatespecs_1.length; _a++) {
                            var aTemplatespec = theTemplatespecs_1[_a];
                            if (aTemplatespec && aTemplatespec.key && (someAcceptableProcessKeys.indexOf(aTemplatespec.key) >= 0)) {
                                someFilteredTemplatespecs.push(aTemplatespec);
                            }
                        }
                        theObserver.next(someFilteredTemplatespecs);
                        theObserver.complete();
                    }, function (theError) {
                        theObserver.error(theError);
                        theObserver.complete();
                    });
                }, function (theError) {
                    console.log("TemplatesFilter getTemplatespecs theError=" + theError);
                    theObserver.error(theError);
                    theObserver.complete();
                });
            }, function (theError) {
                console.log("TemplatesFilter getTemplatespecs theError=" + theError);
                theObserver.error(theError);
                theObserver.complete();
            });
            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe: function () {
                    console.log("TemplatesFilter getTemplatespecs observable unsubscribe");
                }
            };
        });
    };
    TemplatesFilter = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_3__providers_applications_provider__["a" /* ApplicationsProvider */],
            __WEBPACK_IMPORTED_MODULE_7__providers_templates_provider__["a" /* TemplatesProvider */]])
    ], TemplatesFilter);
    return TemplatesFilter;
}(__WEBPACK_IMPORTED_MODULE_4__active_filter__["a" /* ActiveFilter */]));

//# sourceMappingURL=templates-filter.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__interfaces_flow_applications__ = __webpack_require__(313);
/*
 * applications-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_APPLICATIONS_realhost	= "";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_APPLICATIONS_samehost = "assets/flow/flow-applications-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_APPLICATIONS = URL_APPLICATIONS_samehost;
var ApplicationsProvider = (function () {
    function ApplicationsProvider(http, httpc, user) {
        this.http = http;
        this.httpc = httpc;
        this.user = user;
        console.log("ApplicationsProvider constructor");
    }
    ApplicationsProvider.prototype.getAllApplications = function () {
        return this.load();
    };
    ApplicationsProvider.prototype.load = function () {
        if (this.applications) {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].of(this.applications);
        }
        else {
            this.applications = null;
            return this.httpc.get(URL_SCHEMEHOSTPORT + URL_APPLICATIONS).map(this.parseApplications, this);
        }
    };
    ApplicationsProvider.prototype.sliceOrNull = function (theStrings) {
        if (!theStrings) {
            return null;
        }
        if (typeof theStrings === "undefined") {
            return null;
        }
        if (!(typeof theStrings.length === "number")) {
            return null;
        }
        if (!theStrings.length) {
            return [];
        }
        return theStrings.slice();
    };
    ApplicationsProvider.prototype.parseApplications = function (theSrcApplications) {
        console.log(">>> ApplicationsProvider parseApplications");
        this.applications = [];
        if (!theSrcApplications) {
            return;
        }
        for (var _i = 0, theSrcApplications_1 = theSrcApplications; _i < theSrcApplications_1.length; _i++) {
            var aSrcApplication = theSrcApplications_1[_i];
            if (aSrcApplication && (aSrcApplication._v_Type === "Application")) {
                var anApplication = new __WEBPACK_IMPORTED_MODULE_7__interfaces_flow_applications__["a" /* Application */](aSrcApplication.name, aSrcApplication.key);
                if (aSrcApplication.processSpecs) {
                    for (var _a = 0, _b = aSrcApplication.processSpecs; _a < _b.length; _a++) {
                        var aSrcProcessSpec = _b[_a];
                        if (!aSrcProcessSpec) {
                            continue;
                        }
                        var aProcessSpec = new __WEBPACK_IMPORTED_MODULE_7__interfaces_flow_applications__["d" /* ProcessSpec */](anApplication, aSrcProcessSpec.name, aSrcProcessSpec.key);
                        anApplication.addProcessSpec(aProcessSpec);
                    }
                }
                if (aSrcApplication.groups) {
                    for (var _c = 0, _d = aSrcApplication.groups; _c < _d.length; _c++) {
                        var aSrcGroup = _d[_c];
                        if (!aSrcGroup) {
                            continue;
                        }
                        var aGroup = new __WEBPACK_IMPORTED_MODULE_7__interfaces_flow_applications__["b" /* Group */](anApplication, this.sliceOrNull(aSrcGroup.initiableProcessKeys), this.sliceOrNull(aSrcGroup.participedProcessKeys), aSrcGroup.name, aSrcGroup.key);
                        anApplication.addGroup(aGroup);
                    }
                }
                if (aSrcApplication.identities) {
                    for (var _e = 0, _f = aSrcApplication.identities; _e < _f.length; _e++) {
                        var aSrcIdentity = _f[_e];
                        if (!aSrcIdentity) {
                            continue;
                        }
                        var anIdentity = new __WEBPACK_IMPORTED_MODULE_7__interfaces_flow_applications__["c" /* Identity */](anApplication, this.sliceOrNull(aSrcIdentity.initiableProcessKeys), this.sliceOrNull(aSrcIdentity.participedProcessKeys), aSrcIdentity.user, this.sliceOrNull(aSrcIdentity.groups));
                        anApplication.addIdentity(anIdentity);
                    }
                }
                this.applications.push(anApplication);
            }
        }
        console.log("<<< ApplicationsProvider parseApplications");
        return this.applications;
    };
    ApplicationsProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3__user_data__["a" /* UserData */]])
    ], ApplicationsProvider);
    return ApplicationsProvider;
}());

//# sourceMappingURL=applications-provider.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OutboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__ = __webpack_require__(31);
/*
 * outbox.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OutboxPage = (function (_super) {
    __extends(OutboxPage, _super);
    function OutboxPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.flowboxTitle = "Outbox";
        _this.flowboxIcon = "send";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    OutboxPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('contentsListView', { read: __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */] }),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* List */])
    ], OutboxPage.prototype, "contentsList", void 0);
    OutboxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-outbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/outbox/outbox.html"*/'<!--\n* outbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-list #contentsListView [hidden]="shownContentItems === 0">\n\n    <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n\n      <ion-item-divider sticky>\n        <ion-label>\n          {{group.time}}\n        </ion-label>\n      </ion-item-divider>\n\n      <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n\n        <button ion-item (click)="goToSessionDetail(session)">\n          <h3>{{session.name}}</h3>\n          <p>\n            {{session.timeStart}} &mdash;\n            {{session.timeEnd}}:\n            {{session.location}}\n          </p>\n        </button>\n\n        <ion-item-options>\n          <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)" *ngIf="segment === \'all\'">\n            Favorite\n          </button>\n          <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')" *ngIf="segment === \'favorites\'">\n            Remove\n          </button>\n        </ion-item-options>\n\n      </ion-item-sliding>\n\n    </ion-item-group>\n\n  </ion-list>\n\n  <ion-list-header [hidden]="shownContentItems > 0">\n      Nothing found in Outbox\n  </ion-list-header>\n\n  <ion-fab bottom right #fab>\n    <button ion-fab><ion-icon name="share"></ion-icon></button>\n    <ion-fab-list side="top">\n      <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)"><ion-icon name="logo-vimeo"></ion-icon></button>\n      <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)"><ion-icon name="logo-googleplus"></ion-icon></button>\n      <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)"><ion-icon name="logo-twitter"></ion-icon></button>\n      <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)"><ion-icon name="logo-facebook"></ion-icon></button>\n    </ion-fab-list>\n  </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/outbox/outbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], OutboxPage);
    return OutboxPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=outbox.js.map

/***/ }),

/***/ 132:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 132;

/***/ }),

/***/ 175:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 175;

/***/ }),

/***/ 218:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__about_popover_about_popover__ = __webpack_require__(219);
/*
 * about.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AboutPage = (function () {
    function AboutPage(popoverCtrl) {
        this.popoverCtrl = popoverCtrl;
        this.conferenceDate = '2047-05-17';
    }
    AboutPage.prototype.presentPopover = function (event) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_2__about_popover_about_popover__["a" /* PopoverPage */]);
        popover.present({ ev: event });
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/about/about.html"*/'<!--\n* about.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>About workOflow</ion-title>\n        <ion-buttons end>\n            <button ion-button icon-only (click)="presentPopover($event)">\n                <ion-icon name="more"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    <div padding class="about-info">\n        <h4>workOflow presenting near you shortly</h4>\n        \n        <ion-list no-lines>\n            <ion-item>\n                <ion-icon name="calendar" item-start></ion-icon>\n                <ion-label>Presentation date</ion-label>\n                <ion-datetime displayFormat="MMM DD, YYYY" max="2020" [(ngModel)]="presentationDate"></ion-datetime>\n            </ion-item>\n            \n            <ion-item>\n                <ion-icon name="pin" item-start></ion-icon>\n                <ion-label>Location</ion-label>\n                <ion-select>\n                    <ion-option value="valencia" selected>Valencia, ES</ion-option>\n                    <ion-option value="bonn">Bonn, DE</ion-option>\n                    <ion-option value="madrid" >Madrid, ES</ion-option>\n                    <ion-option value="birmingham">Birmingham, UK</ion-option>\n                    <ion-option value="miami">Miami, FL, US</ion-option>\n                    <ion-option value="newyork">New York City, NY, US</ion-option>\n                    <ion-option value="brest">Brest, FR</ion-option>\n                </ion-select>\n            </ion-item>\n        </ion-list>\n        \n        <p>\n            <b>workOflow</b>\n        </p>\n        <p>Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on Flowable REST API as Spring Boot Java application.</p>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/about/about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* PopoverController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 219:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PopoverPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/*
 * about-popover.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var PopoverPage = (function () {
    function PopoverPage(viewCtrl, navCtrl, app, modalCtrl) {
        this.viewCtrl = viewCtrl;
        this.navCtrl = navCtrl;
        this.app = app;
        this.modalCtrl = modalCtrl;
    }
    PopoverPage.prototype.support = function () {
        this.app.getRootNav().push('SupportPage');
        this.viewCtrl.dismiss();
    };
    PopoverPage.prototype.close = function (url) {
        window.open(url, '_blank');
        this.viewCtrl.dismiss();
    };
    PopoverPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            template: "\n    <ion-list>\n      <button ion-item (click)=\"close('https://github.com/carrascoMDD/workoflow-ui')\">GitHub Repo</button>\n      <button ion-item (click)=\"support()\">Support</button>\n    </ion-list>\n  "
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */]])
    ], PopoverPage);
    return PopoverPage;
}());

//# sourceMappingURL=about-popover.js.map

/***/ }),

/***/ 220:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IdentitiesFilterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/*
 * identitites-filter.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var IdentitiesFilterPage = (function () {
    function IdentitiesFilterPage(app, alertCtrl, loadingCtrl, modalCtrl, navCtrl, toastCtrl, userData, navParams, viewCtrl) {
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.userData = userData;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        console.log("IdentitiesFilterPage constructor");
    }
    IdentitiesFilterPage.prototype.ionViewDidLoad = function () {
        console.log("IdentitiesFilterPage ionViewDidLoad");
    };
    IdentitiesFilterPage.prototype.ionViewDidEnter = function () {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateContent();
    };
    IdentitiesFilterPage.prototype.updateContent = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.userData.getIdentityActivations()
                .then(function (theIdentityActivations) {
                _this.identityActivations = theIdentityActivations;
                _this.identityActivationCompositeKeys =
                    _this.identityActivations.map(function (theIdentityActivation) {
                        return theIdentityActivation.applicationKey + "_-_" + theIdentityActivation.identityKey;
                    });
                pheResolve(theIdentityActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    IdentitiesFilterPage.prototype.identityActiveChanged = function (theApplicationKey, theIdentityKey) {
        console.log("IdentitiesFilterPage identityActiveChanged applicationKey=" + theApplicationKey + " identityKey=" + theIdentityKey);
        return new Promise(function (resolve) { resolve(); });
        // return this.storeAndPropagageIdentityActivations();
    };
    IdentitiesFilterPage.prototype.deactivateAllIdentities = function () {
        console.log("IdentitiesFilterPage deactivateAllIdentities");
        return this.setActiveAllIdentities(false);
    };
    IdentitiesFilterPage.prototype.activateAllIdentities = function () {
        console.log("IdentitiesFilterPage deactivateAllIdentities");
        return this.setActiveAllIdentities(true);
    };
    IdentitiesFilterPage.prototype.setActiveAllIdentities = function (theActive) {
        if (!this.identityActivations) {
            return;
        }
        for (var _i = 0, _a = this.identityActivations; _i < _a.length; _i++) {
            var anActivityActivation = _a[_i];
            anActivityActivation.setActive(theActive);
        }
        return this.storeAndPropagageIdentityActivations();
    };
    IdentitiesFilterPage.prototype.applyFilters = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.storeAndPropagageIdentityActivations()
                .then(function (theIdentityActivations) {
                _this.dismiss(_this.identityActivations);
                pheResolve(theIdentityActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    IdentitiesFilterPage.prototype.storeAndPropagageIdentityActivations = function () {
        if (!this.identityActivations) {
            return;
        }
        return this.userData.storeAndPropagageIdentityActivations();
    };
    IdentitiesFilterPage.prototype.dismiss = function (data) {
        // using the injected ViewController this page
        // can "dismiss" itself and pass back data
        this.viewCtrl.dismiss(data);
    };
    IdentitiesFilterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-identities-filter',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/identities-filter/identities-filter.html"*/'<!--\n* identities-filter.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-toolbar>\n        <ion-buttons start>\n            <button ion-button (click)="dismiss()">Cancel</button>\n        </ion-buttons>\n        <ion-title>\n            Application Identities\n        </ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="applyFilters()" strong>Done</button>\n        </ion-buttons>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content class="outer-content">\n    \n    <ion-list>\n        <ion-list-header>Activate / Deactivate</ion-list-header>\n        <ion-row>\n            <ion-col col-6>\n                <div text-center>\n                    <button ion-button round color="danger" (click)="deactivateAllIdentities()">None</button>\n                </div>\n            </ion-col>\n            <ion-col col-6>\n                <div text-center>\n                    <button ion-button round color="secondary" (click)="activateAllIdentities()">All</button>\n                </div>\n            </ion-col>\n        </ion-row>\n        <ion-item *ngFor="let identityActivation of identityActivations" [attr.compositeKey]="(identityActivation.applicationKey + \'_-_\' + identityActivation.identityKey) | lowercase">\n            <span item-start class="dot"></span>\n            <ion-label>{{identityActivation.applicationKey}} {{identityActivation.identityKey}}</ion-label>\n            <ion-toggle [(ngModel)]="identityActivation.isActive"\n                        (click)="identityActiveChanged(identityActivation.applicationKey, identityActivation.identityKey)"\n                        color="secondary"></ion-toggle>\n        </ion-item>\n    \n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/identities-filter/identities-filter.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ViewController */]])
    ], IdentitiesFilterPage);
    return IdentitiesFilterPage;
}());

//# sourceMappingURL=identitites-filter.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowHeader; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * inbox.ts
 *
 * Created @author Antonio Carrasco Valero 201806012216
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FlowHeader = (function () {
    function FlowHeader() {
        console.log("FlowHeader constructor");
    }
    FlowHeader.prototype.setFlowPage = function (theLoggedinPage) {
        this.flowpage = theLoggedinPage;
    };
    FlowHeader.prototype.getFlowPage = function () {
        return this.flowpage;
    };
    FlowHeader = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'flow-header',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flow-header/flow-header.html"*/'<!--\n* flow-header.html\n*\n* Created @author Antonio Carrasco Valero 201806012216\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header class="page-flow-header">\n    <ion-navbar no-border-bottom>\n        \n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        \n        \n        <ion-segment *ngIf="flowpage" [(ngModel)]="flowpage.segment" (ionChange)="flowpage.updateContent()">\n            \n            <ion-title class="hide-smm">\n                <ion-icon item-start [name]="flowpage.flowboxIcon" color="bright" class="valignmiddle"></ion-icon>\n                <span class="hide-sm valignmiddle">{{flowpage.flowboxTitle}}</span>\n                <span class="hide-md valignmiddle">- workOflow</span>\n            </ion-title>\n            \n            \n            <ion-segment-button value="all">\n                <ion-icon item-start name="filing" class="valignmiddle"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;All</span>\n            </ion-segment-button>\n            \n            <ion-segment-button value="favorites" [disabled]="!flowpage.hasAnyFavoriteItem" >\n                <ion-icon item-start name="star" class="valignmiddle"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;Favorites</span>\n            </ion-segment-button>\n            \n            <ion-segment-button value="urgent" [disabled]="!flowpage.hasAnyUrgentItem" >\n                <ion-icon item-start name="warning" class="valignmiddle"\n                          [color]="flowpage.hasAnyUrgentItem ? \'danger\' : \'\'"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;Urgent</span>\n            </ion-segment-button>\n            \n        </ion-segment>\n        \n        \n        <ion-buttons end *ngIf="flowpage">\n            <button ion-button icon-only (click)="flowpage.presentFilter()">\n                <ion-icon ios="ios-options-outline" md="md-options"></ion-icon>\n            </button>\n        </ion-buttons>\n        \n    </ion-navbar>\n    \n    \n    \n    <ion-toolbar no-border-top *ngIf="flowpage">\n        <ion-searchbar color="primary"\n                       [(ngModel)]="flowpage.queryText"\n                       (ionInput)="flowpage.updateContent()"\n                       placeholder="Search">\n        </ion-searchbar>\n    </ion-toolbar>\n    \n</ion-header>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flow-header/flow-header.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], FlowHeader);
    return FlowHeader;
}());

//# sourceMappingURL=flow-header.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplateDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_templates_provider__ = __webpack_require__(117);
/*
 * template-detail.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TemplateDetailPage = (function () {
    function TemplateDetailPage(templatesProvider, navParams) {
        this.templatesProvider = templatesProvider;
        this.navParams = navParams;
        console.log("TemplateDetailPage constructor");
    }
    TemplateDetailPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.templatesProvider.load().subscribe(function (theTemplatespecs) {
            for (var _i = 0, theTemplatespecs_1 = theTemplatespecs; _i < theTemplatespecs_1.length; _i++) {
                var aTemplatespec = theTemplatespecs_1[_i];
                if (aTemplatespec && aTemplatespec.key === _this.navParams.data.key) {
                    _this.template = aTemplatespec;
                    break;
                }
            }
        });
    };
    TemplateDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-template-detail',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/template-detail/template-detail.html"*/'<!--\n* template-detail.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n\n\n<ion-header>\n  <ion-navbar>\n    <ion-title *ngIf="template">{{template.name}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div *ngIf="template">\n    <h1>{{template.name}}</h1>\n    <h4 >{{template.key}}</h4>\n    <p>{{template.description}}</p>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/template-detail/template-detail.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_templates_provider__["a" /* TemplatesProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
    ], TemplateDetailPage);
    return TemplateDetailPage;
}());

//# sourceMappingURL=template-detail.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_authentication__ = __webpack_require__(315);
/*
 * authentication-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var IGNOREPASSWORD = true;
var CRASHONERROR = true;
var AuthenticationProvider = (function () {
    function AuthenticationProvider(httpc) {
        this.httpc = httpc;
        console.log("AuthenticationProvider constructor");
    }
    AuthenticationProvider.prototype.authenticate = function (theUsername, thePassword) {
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"](function (theObserver) {
            console.log("AuthenticationProvider authenticate observable subscribe. Delivering immediately.");
            if (IGNOREPASSWORD || thePassword) {
                setTimeout(function () {
                    theObserver.next(new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_authentication__["a" /* Authentication */](theUsername, true, null, null, null));
                    theObserver.complete();
                }, 16);
            }
            else {
                if (CRASHONERROR) {
                    setTimeout(function () {
                        theObserver.error(new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_authentication__["a" /* Authentication */](theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
                else {
                    setTimeout(function () {
                        theObserver.next(new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_authentication__["a" /* Authentication */](theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
            }
            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe: function () {
                    console.log("AuthenticationProvider authenticate observable unsubscribe");
                }
            };
        });
    };
    AuthenticationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], AuthenticationProvider);
    return AuthenticationProvider;
}());

//# sourceMappingURL=authentication-provider.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(46);
/*
 * signup.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var SignupPage = (function () {
    function SignupPage(navCtrl, userData) {
        this.navCtrl = navCtrl;
        this.userData = userData;
        this.signup = { username: '', password: '' };
        this.submitted = false;
    }
    SignupPage.prototype.onSignup = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.userData.signup(this.signup.username);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
        }
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-user',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/signup/signup.html"*/'<!--\n* signup.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n		<ion-title>Signup for workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="login-page">\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n\n	<form #signupForm="ngForm" novalidate>\n		<ion-list no-lines>\n			<ion-item>\n				<ion-label stacked color="primary">Username</ion-label>\n				<ion-input [(ngModel)]="signup.username" name="username" type="text" #username="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="username.valid || submitted == false" color="danger" padding-left>\n				Username is required\n			</p>\n\n			<ion-item>\n				<ion-label stacked color="primary">Password</ion-label>\n				<ion-input [(ngModel)]="signup.password" name="password" type="password" #password="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="password.valid || submitted == false" color="danger" padding-left>\n				Password is required\n			</p>\n		</ion-list>\n\n		<div padding>\n			<button ion-button (click)="onSignup(signupForm)" type="submit" block>Create</button>\n		</div>\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/signup/signup.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TutorialPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__flow_flowtabs_page_flowtabs_page__ = __webpack_require__(57);
/*
 * tutorial.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TutorialPage = (function () {
    function TutorialPage(navCtrl, menu, storage, userData) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.storage = storage;
        this.userData = userData;
        this.showSkip = true;
    }
    TutorialPage.prototype.startApp = function () {
        var _this = this;
        this.storage.set('hasSeenTutorial', 'true')
            .then(function () {
            _this.userData.hasLoggedIn()
                .then(function (theHasLoggedIn) {
                if (theHasLoggedIn) {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */]);
                }
                else {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
            }, function (theError) {
                console.log("TutorialPage startApp this.userData.hasLoggedIn() error=" + theError);
                throw theError;
            });
        }, function (theError) {
            console.log("TutorialPage startApp this.storage.set('hasSeenTutorial', 'true') error=" + theError);
            throw theError;
        });
    };
    TutorialPage.prototype.onSlideChangeStart = function (slider) {
        this.showSkip = !slider.isEnd();
    };
    TutorialPage.prototype.ionViewWillEnter = function () {
        this.slides.update();
    };
    TutorialPage.prototype.ionViewDidEnter = function () {
        // the root left menu should be disabled on the tutorial page
        this.menu.enable(false);
    };
    TutorialPage.prototype.ionViewDidLeave = function () {
        // enable the root left menu when leaving the tutorial page
        this.menu.enable(true);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('slides'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Slides */])
    ], TutorialPage.prototype, "slides", void 0);
    TutorialPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tutorial',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/tutorial/tutorial.html"*/'<!--\n* tutorial.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header no-border>\n  <ion-navbar>\n    <ion-buttons end *ngIf="showSkip">\n      <button ion-button (click)="startApp()" color="primary">Skip</button>\n    </ion-buttons>\n  </ion-navbar>\n</ion-header>\n\n<ion-content no-bounce>\n  <ion-slides #slides (ionSlideWillChange)="onSlideChangeStart($event)" pager>\n\n    <ion-slide>\n      <img src="assets/img/ica-slidebox-img-1.png" class="slide-image"/>\n      <h2 class="slide-title">\n        Welcome to <b>workOflow</b>\n      </h2>\n      <p>\n        .\n      </p>\n    </ion-slide>\n\n    <ion-slide>\n      <img src="assets/img/ica-slidebox-img-2.png" class="slide-image"/>\n      <h2 class="slide-title" >What is workOflow?</h2>\n      <p><b>workOflow</b></p>\n    </ion-slide>\n\n    <ion-slide>\n      <img src="assets/img/ica-slidebox-img-3.png" class="slide-image"/>\n      <h2 class="slide-title">What is workOflow?</h2>\n      <p><b>workOflow</b></p>\n    </ion-slide>\n\n    <ion-slide>\n      <img src="assets/img/ica-slidebox-img-4.png" class="slide-image"/>\n      <h2 class="slide-title">Ready to Play?</h2>\n      <button ion-button icon-end large clear (click)="startApp()">\n        Continue\n        <ion-icon name="arrow-forward"></ion-icon>\n      </button>\n    </ion-slide>\n\n  </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/tutorial/tutorial.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__providers_user_data__["a" /* UserData */]])
    ], TutorialPage);
    return TutorialPage;
}());

//# sourceMappingURL=tutorial.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SupportPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/*
 * support.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var SupportPage = (function () {
    function SupportPage(navCtrl, alertCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.submitted = false;
    }
    SupportPage.prototype.ionViewDidEnter = function () {
        var toast = this.toastCtrl.create({
            message: 'This does not actually send a support request.',
            duration: 3000
        });
        toast.present();
    };
    SupportPage.prototype.submit = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.supportMessage = '';
            this.submitted = false;
            var toast = this.toastCtrl.create({
                message: 'Your support request has been sent.',
                duration: 3000
            });
            toast.present();
        }
    };
    // If the user enters text in the support question and then navigates
    // without submitting first, ask if they meant to leave the page
    SupportPage.prototype.ionViewCanLeave = function () {
        var _this = this;
        // If the support message is empty we should just navigate
        if (!this.supportMessage || this.supportMessage.trim().length === 0) {
            return true;
        }
        return new Promise(function (resolve, reject) {
            var alert = _this.alertCtrl.create({
                title: 'Leave this page?',
                message: 'Are you sure you want to leave this page? Your support message will not be submitted.'
            });
            alert.addButton({ text: 'Stay', handler: reject });
            alert.addButton({ text: 'Leave', role: 'cancel', handler: resolve });
            alert.present();
        });
    };
    SupportPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-user',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/support/support.html"*/'<!--\n* support.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n		<ion-title>Support from workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    \n    <form #submitForm="ngForm" novalidate (ngSubmit)="submit(submitForm)">\n		<ion-list no-lines>\n			<ion-item>\n				<ion-label stacked color="primary">Enter your support message below</ion-label>\n				<ion-textarea [(ngModel)]="supportMessage" name="supportQuestion" #supportQuestion="ngModel" rows="6" required></ion-textarea>\n			</ion-item>\n		</ion-list>\n\n		<p ion-text [hidden]="supportQuestion.valid || submitted === false" color="danger" padding-left>\n			Support message is required\n		</p>\n\n		<div padding>\n			<button ion-button block type="submit">Submit</button>\n		</div>\n	</form>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/support/support.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */]])
    ], SupportPage);
    return SupportPage;
}());

//# sourceMappingURL=support.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__ = __webpack_require__(112);
/*
 * logout.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var LogoutPage = (function (_super) {
    __extends(LogoutPage, _super);
    function LogoutPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        console.log("LogoutPage constructor");
        return _this;
    }
    LogoutPage.prototype.ionViewDidLoad = function () {
        console.log("LogoutPage ionViewDidLoad");
        this.app.setTitle('Logout');
    };
    LogoutPage.prototype.ionViewDidEnter = function () {
        console.log("LogoutPage ionViewDidEnter");
    };
    LogoutPage.prototype.updateContent = function () {
        return new Promise(function () { });
    };
    LogoutPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    LogoutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-logout',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/logout/logout.html"*/'<!--\n* logout.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-navbar no-border-bottom>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Log out</ion-title>\n    \n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    \n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    \n    <form novalidate (ngSubmit)="logout()">\n        <ion-row responsive-sm>\n            <ion-col width-50>\n                <div text-center>\n                    <div padding>\n                        <button ion-button round color="danger" type="submit">\n                            <ion-icon name="exit"></ion-icon>\n                            &emsp; Logout\n                        </button>\n                    </div>\n                </div>\n            </ion-col>\n        </ion-row>\n    </form>\n    \n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/logout/logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], LogoutPage);
    return LogoutPage;
}(__WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__filters_templates_filter__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__loggedin_loggedin__ = __webpack_require__(112);
/*
 * account.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AccountPage = (function (_super) {
    __extends(AccountPage, _super);
    function AccountPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData, templatesFilter) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.templatesFilter = templatesFilter;
        console.log("TemplatesPage constructor");
        return _this;
    }
    AccountPage.prototype.ngAfterViewInit = function () {
        this.beLoggedinOrGoToLoginPage();
    };
    AccountPage.prototype.updatePicture = function () {
        console.log('Clicked to update picture');
    };
    AccountPage.prototype.updateContent = function () {
        console.log('Clicked to update picture');
        return new Promise(function () { });
    };
    // Present an alert with the current username populated
    // clicking OK will update the username and display it
    // clicking Cancel will close the alert and do nothing
    AccountPage.prototype.changeUsername = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.beLoggedinOrGoToLoginPage()
                .then(function (pheAuthenticatedLogin) {
                if (!pheAuthenticatedLogin) {
                    pheReject("User is not logged in");
                    return;
                }
                var alert = _this.alertCtrl.create({
                    title: 'Change Username',
                    subTitle: pheAuthenticatedLogin.login
                });
                alert.addInput({
                    name: 'name',
                    value: pheAuthenticatedLogin.name,
                    placeholder: 'name'
                });
                alert.addInput({
                    name: 'familyName',
                    value: pheAuthenticatedLogin.familyName,
                    placeholder: 'username'
                });
                alert.addButton({
                    text: 'Ok',
                    handler: function (data) {
                        if (data) { } /*CQT*/
                        console.log("Changed User name");
                    }
                });
                alert.addButton({
                    text: 'Cancel',
                    handler: function (data) {
                        if (data) { } /*CQT*/
                        console.log("Canceled Change User name");
                    }
                });
                alert.present()
                    .then(function () {
                    pheResolve(pheAuthenticatedLogin);
                }, function () {
                    pheReject(pheAuthenticatedLogin);
                });
            }, function (pheError) {
                pheReject(pheError);
            });
        });
    };
    AccountPage.prototype.changePassword = function () {
        console.log('Clicked to change password');
    };
    AccountPage.prototype.support = function () {
        this.navCtrl.push('SupportPage');
    };
    AccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-account',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/account/account.html"*/'<!--\n* account.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Account - workOflow</ion-title>\n    \n        <ion-buttons end>\n            <button ion-button icon-only (click)="presentFilter()">\n                <ion-icon ios="ios-options-outline" md="md-options"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="outer-content">\n    \n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    <div padding-top text-center *ngIf="authenticatedLogin">\n        <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar">\n        \n        \n        <h2>{{authenticatedLogin.login}}</h2>\n        <h3>{{authenticatedLogin.name}} {{authenticatedLogin.familyName}}</h3>\n        \n        <ion-list inset>\n            <button ion-item (click)="updatePicture()">Update Picture</button>\n            <button ion-item (click)="changeUsername()">Change Username</button>\n            <button ion-item (click)="changePassword()">Change Password</button>\n            <button ion-item (click)="support()">Support</button>\n            <button ion-item (click)="logout()">Logout</button>\n        </ion-list>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/account/account.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_3__filters_templates_filter__["a" /* TemplatesFilter */]])
    ], AccountPage);
    return AccountPage;
}(__WEBPACK_IMPORTED_MODULE_4__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(251);
/*
 * main.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__ = __webpack_require__(297);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(309);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_about_about__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_login_login__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_signup_signup__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_tutorial_tutorial__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_support_support__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_flow_logout_logout__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_flow_identities_filter_identitites_filter__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_flow_inbox_inbox__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_flow_drafts_drafts__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_flow_archived_archived__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_flow_bounced_bounced__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_flow_templates_templates__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_flow_template_detail_template_detail__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_flow_outbox_outbox__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_authentication_provider__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__providers_logins_provider__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__providers_applications_provider__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_templates_provider__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__filters_templates_filter__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__pages_flow_flowbox_flowbox__ = __webpack_require__(31);
/*
 * app.module.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* WorkOFlowApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_tutorial_tutorial__["a" /* TutorialPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_support_support__["a" /* SupportPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_flow_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_flow_identities_filter_identitites_filter__["a" /* IdentitiesFilterPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__["a" /* FlowHeader */],
                __WEBPACK_IMPORTED_MODULE_33__pages_flow_flowbox_flowbox__["a" /* FlowboxPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_flow_inbox_inbox__["a" /* InboxPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_flow_drafts_drafts__["a" /* DraftsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_flow_archived_archived__["a" /* ArchivedPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_flow_bounced_bounced__["a" /* BouncedPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_flow_templates_templates__["a" /* TemplatesPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_flow_template_detail_template_detail__["a" /* TemplateDetailPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_flow_outbox_outbox__["a" /* OutboxPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* WorkOFlowApp */], {}, {
                    links: [
                        { component: __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */], name: 'AboutPage', segment: 'about' },
                        { component: __WEBPACK_IMPORTED_MODULE_14__pages_tutorial_tutorial__["a" /* TutorialPage */], name: 'Tutorial', segment: 'tutorial' },
                        { component: __WEBPACK_IMPORTED_MODULE_15__pages_support_support__["a" /* SupportPage */], name: 'SupportPage', segment: 'support' },
                        { component: __WEBPACK_IMPORTED_MODULE_12__pages_login_login__["a" /* LoginPage */], name: 'LoginPage', segment: 'login' },
                        { component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__["a" /* AccountPage */], name: 'AccountPage', segment: 'account' },
                        { component: __WEBPACK_IMPORTED_MODULE_13__pages_signup_signup__["a" /* SignupPage */], name: 'SignupPage', segment: 'signup' },
                        { component: __WEBPACK_IMPORTED_MODULE_17__pages_flow_logout_logout__["a" /* LogoutPage */], name: 'LogoutPage', segment: 'logout' },
                        { component: __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], name: 'FlowTabsPage', segment: 'flowtabs-page' },
                        { component: __WEBPACK_IMPORTED_MODULE_21__pages_flow_inbox_inbox__["a" /* InboxPage */], name: 'Inbox', segment: 'inbox' },
                        { component: __WEBPACK_IMPORTED_MODULE_22__pages_flow_drafts_drafts__["a" /* DraftsPage */], name: 'Drafts', segment: 'drafts' },
                        { component: __WEBPACK_IMPORTED_MODULE_23__pages_flow_archived_archived__["a" /* ArchivedPage */], name: 'Archived', segment: 'archived' },
                        { component: __WEBPACK_IMPORTED_MODULE_24__pages_flow_bounced_bounced__["a" /* BouncedPage */], name: 'Bounced', segment: 'bounced' },
                        { component: __WEBPACK_IMPORTED_MODULE_25__pages_flow_templates_templates__["a" /* TemplatesPage */], name: 'Templates', segment: 'templates' },
                        { component: __WEBPACK_IMPORTED_MODULE_26__pages_flow_template_detail_template_detail__["a" /* TemplateDetailPage */], name: 'TemplateDetail', segment: 'templateDetail/:templateKey' },
                        { component: __WEBPACK_IMPORTED_MODULE_27__pages_flow_outbox_outbox__["a" /* OutboxPage */], name: 'Outbox', segment: 'outbox' }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* WorkOFlowApp */],
                __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_tutorial_tutorial__["a" /* TutorialPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_support_support__["a" /* SupportPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_flow_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__["a" /* FlowHeader */],
                __WEBPACK_IMPORTED_MODULE_33__pages_flow_flowbox_flowbox__["a" /* FlowboxPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_flow_identities_filter_identitites_filter__["a" /* IdentitiesFilterPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_flow_inbox_inbox__["a" /* InboxPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_flow_drafts_drafts__["a" /* DraftsPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_flow_archived_archived__["a" /* ArchivedPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_flow_bounced_bounced__["a" /* BouncedPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_flow_templates_templates__["a" /* TemplatesPage */],
                __WEBPACK_IMPORTED_MODULE_26__pages_flow_template_detail_template_detail__["a" /* TemplateDetailPage */],
                __WEBPACK_IMPORTED_MODULE_27__pages_flow_outbox_outbox__["a" /* OutboxPage */]
            ],
            providers: [
                { provide: __WEBPACK_IMPORTED_MODULE_3__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["e" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_16__providers_user_data__["a" /* UserData */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_29__providers_logins_provider__["a" /* LoginsProvider */],
                __WEBPACK_IMPORTED_MODULE_28__providers_authentication_provider__["a" /* AuthenticationProvider */],
                __WEBPACK_IMPORTED_MODULE_30__providers_applications_provider__["a" /* ApplicationsProvider */],
                __WEBPACK_IMPORTED_MODULE_31__providers_templates_provider__["a" /* TemplatesProvider */],
                __WEBPACK_IMPORTED_MODULE_32__filters_templates_filter__["a" /* TemplatesFilter */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 309:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkOFlowApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_about_about__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_signup_signup__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tutorial_tutorial__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_support_support__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_flow_logout_logout__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_flow_account_account__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_flow_inbox_inbox__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_flow_drafts_drafts__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_flow_archived_archived__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_flow_bounced_bounced__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_flow_templates_templates__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_flow_outbox_outbox__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_user_data__ = __webpack_require__(10);
/*
 * app.component.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




















/* ACV OJO DEBUG mode is default for Angular */
var ENABLEPRODMODE = true;
if (ENABLEPRODMODE) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_14" /* enableProdMode */])();
}
var WorkOFlowApp = (function () {
    function WorkOFlowApp(events, userData, menu, platform, storage, splashScreen) {
        var _this = this;
        this.events = events;
        this.userData = userData;
        this.menu = menu;
        this.platform = platform;
        this.storage = storage;
        this.splashScreen = splashScreen;
        this.flowPages = [
            {
                title: 'Inbox',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_12__pages_flow_inbox_inbox__["a" /* InboxPage */],
                index: 0,
                icon: 'mail'
            },
            {
                title: 'Drafts',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_13__pages_flow_drafts_drafts__["a" /* DraftsPage */],
                index: 1,
                icon: 'mail-open'
            },
            {
                title: 'Archived',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_14__pages_flow_archived_archived__["a" /* ArchivedPage */],
                index: 2,
                icon: 'done-all'
            },
            {
                title: 'Bounced',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_15__pages_flow_bounced_bounced__["a" /* BouncedPage */],
                index: 3,
                icon: 'undo'
            },
            {
                title: 'Templates',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_16__pages_flow_templates_templates__["a" /* TemplatesPage */],
                index: 4,
                icon: 'create'
            },
            {
                title: 'Outbox',
                name: 'FlowTabsPage',
                component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                tabComponent: __WEBPACK_IMPORTED_MODULE_17__pages_flow_outbox_outbox__["a" /* OutboxPage */],
                index: 5,
                icon: 'send'
            }
        ];
        this.loggedInPages = [
            { title: 'Account', name: 'AccountPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_account_account__["a" /* AccountPage */], icon: 'person' },
            { title: 'Logout', name: 'LogoutPage', component: __WEBPACK_IMPORTED_MODULE_9__pages_flow_logout_logout__["a" /* LogoutPage */], icon: 'log-out' },
            { title: 'Support', name: 'SupportPage', component: __WEBPACK_IMPORTED_MODULE_8__pages_support_support__["a" /* SupportPage */], icon: 'help' },
            { title: 'About', name: 'AboutPage', component: __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */], icon: 'information-circle' },
        ];
        this.loggedOutPages = [
            { title: 'Login', name: 'LoginPage', component: __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */], icon: 'log-in' },
            { title: 'Signup', name: 'SignupPage', component: __WEBPACK_IMPORTED_MODULE_6__pages_signup_signup__["a" /* SignupPage */], icon: 'person-add' },
            { title: 'About', name: 'AboutPage', component: __WEBPACK_IMPORTED_MODULE_4__pages_about_about__["a" /* AboutPage */], icon: 'information-circle' }
        ];
        // Check if the user has already seen the tutorial
        this.storage.get('hasSeenTutorial')
            .then(function (hasSeenTutorial) {
            if (hasSeenTutorial) {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */]; // FlowTabsPage TabsPage
            }
            else {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_tutorial_tutorial__["a" /* TutorialPage */];
            }
            _this.platformReady();
        });
        // decide which menu items should be hidden by current login status stored in local storage
        this.userData.hasLoggedIn().then(function (pheIsLoggedIn) {
            _this.enableMenu(pheIsLoggedIn === true);
        }, function (theError) {
            console.log("Error in app.component.ts constructor this.userData.hasLoggedIn()" + theError);
            _this.enableMenu(false);
        });
        this.listenToLoginEvents();
    }
    WorkOFlowApp.prototype.openPage = function (page) {
        var params = {};
        // the nav component was found using @ViewChild(Nav)
        // setRoot on the nav to remove previous pages and only have this page
        // we wouldn't want the back button to show in this scenario
        if (page.index) {
            params = { tabIndex: page.index };
        }
        // If we are already on tabs just change the selected tab
        // don't setRoot again, this maintains the history stack of the
        // tabs even if changing them from the menu
        if (this.nav.getActiveChildNavs().length && page.index != undefined) {
            this.nav.getActiveChildNavs()[0].select(page.index);
        }
        else {
            // Set the root of the nav with params if it's a tab index
            this.nav.setRoot(page.name, params).catch(function (err) {
                console.log("Didn't set nav root: " + err);
            });
        }
    };
    WorkOFlowApp.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { } /*CQT*/
            _this.userData.logout()
                .then(function () {
                return _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */]);
            }, function (theError) {
                if (theError) { } /*CQT*/
                throw theError;
            })
                .then(function () {
                pheResolve();
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    WorkOFlowApp.prototype.openTutorial = function () {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_7__pages_tutorial_tutorial__["a" /* TutorialPage */]) /*CQT*/.then(function () { });
    };
    WorkOFlowApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:signup', function () {
            _this.enableMenu(true);
        });
        this.events.subscribe('user:logout', function () {
            _this.enableMenu(false);
        });
    };
    WorkOFlowApp.prototype.enableMenu = function (loggedIn) {
        this.menu.enable(loggedIn, 'loggedInMenu');
        this.menu.enable(!loggedIn, 'loggedOutMenu');
    };
    WorkOFlowApp.prototype.platformReady = function () {
        var _this = this;
        // Call any initial plugins when ready
        this.platform.ready().then(function () {
            _this.splashScreen.hide();
        });
    };
    WorkOFlowApp.prototype.isActive = function (page) {
        var childNav = this.nav.getActiveChildNavs()[0];
        // Tabs are a special case because they have their own navigation
        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
                return 'primary';
            }
            return;
        }
        if (this.nav.getActive() && this.nav.getActive().name === page.name) {
            return 'primary';
        }
        return;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Nav */])
    ], WorkOFlowApp.prototype, "nav", void 0);
    WorkOFlowApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/app/app.template.html"*/'<!--\n* app.template.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n\n<!-- OJO ACV <ion-split-pane> removed to have the menu show and hide  -->\n\n<!-- logged out menu -->\n<ion-menu id="loggedOutMenu" [content]="content">\n    \n    <ion-header>\n        <ion-toolbar>\n            <button ion-button menuToggle>\n                <ion-icon name="menu"></ion-icon>\n            </button>\n            <ion-title>Menu</ion-title>\n        </ion-toolbar>\n    </ion-header>\n    \n    <ion-content class="outer-content">\n    \n        <div class="logo">\n            <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n        </div>\n        \n        <ion-list>\n            <ion-list-header>\n                Work (flow) - please login\n            </ion-list-header>\n            <button disabled ion-item menuClose *ngFor="let p of flowPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        <ion-list>\n            <ion-list-header>\n                Account\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of loggedOutPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        <ion-list>\n            <ion-list-header>\n                Tutorial\n            </ion-list-header>\n            <button ion-item menuClose (click)="openTutorial()">\n                <ion-icon item-start name="hammer"></ion-icon>\n                Show Tutorial\n            </button>\n        </ion-list>\n    </ion-content>\n\n</ion-menu>\n\n\n\n<!-- logged in menu -->\n<ion-menu id="loggedInMenu" [content]="content">\n    \n    <ion-header>\n        <ion-toolbar>\n            <button ion-button menuToggle>\n                <ion-icon name="menu"></ion-icon>\n            </button>\n            <ion-title>Menu</ion-title>\n        </ion-toolbar>\n    </ion-header>\n    \n    <ion-content class="outer-content">\n    \n        <div class="logo">\n            <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n        </div>\n        \n        <ion-list>\n            <ion-list-header>\n                Work (flow)\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of flowPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        \n        <ion-list>\n            <ion-list-header>\n                Account\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of loggedInPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="\'\'"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        <ion-list>\n            <ion-list-header>\n                Tutorial\n            </ion-list-header>\n            <button ion-item menuClose (click)="openTutorial()">\n                <ion-icon item-start name="hammer"></ion-icon>\n                Show Tutorial\n            </button>\n        </ion-list>\n    \n    </ion-content>\n\n</ion-menu>\n\n<!-- main navigation -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>\n\n<!-- OJO ACV <ion-split-pane> removed to have the menu show and hide  -->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/app/app.template.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
            __WEBPACK_IMPORTED_MODULE_18__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], WorkOFlowApp);
    return WorkOFlowApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__identities_filter_identitites_filter__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__flow_header_flow_header__ = __webpack_require__(221);
/*
 * flowbox.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var FlowboxPage = (function (_super) {
    __extends(FlowboxPage, _super);
    function FlowboxPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.hasAnyFavoriteItem = false;
        _this.hasAnyUrgentItem = false;
        _this.flowboxTitle = "(abstract)Flowbox";
        _this.flowboxIcon = "grid";
        _this.segment = "all";
        _this.queryText = "";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    FlowboxPage.prototype.ionViewDidLoad = function () {
        console.log(this.flowboxTitle + " ionViewDidLoad");
        this.app.setTitle(this.flowboxTitle);
        this.flowheader.setFlowPage(this);
    };
    FlowboxPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        console.log("(abstract)LoggedinPage ionViewDidEnter");
        this.beLoggedinOrGoToLoginPage()
            .then(function (pheIsLoggedIn) {
            if (pheIsLoggedIn) {
                return _this.updateContent();
            }
        }, function (pheError) {
            throw pheError;
        });
    };
    FlowboxPage.prototype.presentFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__identities_filter_identitites_filter__["a" /* IdentitiesFilterPage */]);
        modal.present();
        modal.onWillDismiss(function (data) {
            if (data) {
                _this.updateContent();
            }
        });
    };
    FlowboxPage.prototype.doRefresh = function (refresher) {
        var _this = this;
        return new Promise(function (resolveTop, rejectTop) {
            _this.beLoggedinOrGoToLoginPage()
                .then(function (pheIsLoggedIn) {
                if (pheIsLoggedIn) { } /*CQT*/
                return _this.updateContent();
            }, function (pheError) {
                throw pheError;
            })
                .then(function (pheResult) {
                refresher.complete();
                /* ************************************************
                FireAndForget: Let this one run on its own,
                hopefully suffling pages while still open shall not break or break it !
                 */
                _this.toast_Updated("Updated", 3000) /*CQT*/.then(function () { });
                resolveTop(pheResult);
            }, function (pheError) {
                rejectTop(pheError);
            });
        });
    };
    //abstract
    FlowboxPage.prototype.updateContent = function () {
        return new Promise(function (resolve) {
            resolve();
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_5__flow_header_flow_header__["a" /* FlowHeader */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_5__flow_header_flow_header__["a" /* FlowHeader */])
    ], FlowboxPage.prototype, "flowheader", void 0);
    FlowboxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-flowbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flowbox/flowbox.html"*/'<!--\n* flowbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flowbox/flowbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */]])
    ], FlowboxPage);
    return FlowboxPage;
}(__WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=flowbox.js.map

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LoginApplication; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(110);
/*
 * flow-logins.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Login = (function (_super) {
    __extends(Login, _super);
    function Login(login, name, familyName) {
        var _this = _super.call(this) || this;
        _this.login = login;
        _this.name = name;
        _this.familyName = familyName;
        _this._v_Type = "Login";
        _this.loginApplications = [];
        return _this;
    }
    ;
    Login.prototype.addLoginApplication = function (theLoginApplication) {
        if (!theLoginApplication) {
            return;
        }
        this.loginApplications.push(theLoginApplication);
    };
    return Login;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

var LoginApplication = (function () {
    function LoginApplication(applicationKey, identityKeys) {
        this.applicationKey = applicationKey;
        this.identityKeys = identityKeys;
        this._v_Type = "LoginApplication";
        console.log("LoginApplication applicationKey=" + applicationKey, " identityKeys=" + identityKeys.toString());
    }
    ;
    return LoginApplication;
}());

//# sourceMappingURL=flow-logins.js.map

/***/ }),

/***/ 311:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IdentityActivation; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(110);
/*
 * flow-identityactivation.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var IdentityActivation = (function (_super) {
    __extends(IdentityActivation, _super);
    function IdentityActivation(applicationKey, identityKey, isActive) {
        if (isActive === void 0) { isActive = false; }
        var _this = _super.call(this) || this;
        _this.applicationKey = applicationKey;
        _this.identityKey = identityKey;
        _this.isActive = isActive;
        _this._v_Type = "IdentityActivation";
        return _this;
    }
    ;
    IdentityActivation.prototype.setActive = function (theIsActive) {
        this.isActive = theIsActive === true;
    };
    IdentityActivation.prototype.getActive = function () {
        return this.isActive === true;
    };
    return IdentityActivation;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

//# sourceMappingURL=flow-identityactivation.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Templatespec; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Variablespec; });
/*
 * flow-templatespecs.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var Templatespec = (function () {
    function Templatespec(id, url, key, version, name, description, tenantId, deploymentId, deploymentUrl, resource, diagramResource, category, graphicalNotationDefined, suspended, startFormDefined) {
        this.id = id;
        this.url = url;
        this.key = key;
        this.version = version;
        this.name = name;
        this.description = description;
        this.tenantId = tenantId;
        this.deploymentId = deploymentId;
        this.deploymentUrl = deploymentUrl;
        this.resource = resource;
        this.diagramResource = diagramResource;
        this.category = category;
        this.graphicalNotationDefined = graphicalNotationDefined;
        this.suspended = suspended;
        this.startFormDefined = startFormDefined;
        this.variables = [];
        this.transientVariables = [];
        this.hide = false;
    }
    ;
    Templatespec.prototype.addVariablespec = function (theVariableSpec) {
        if (!theVariableSpec) {
            return;
        }
        this.variables.push(theVariableSpec);
    };
    Templatespec.prototype.addTransientVariablespec = function (theVariableSpec) {
        if (!theVariableSpec) {
            return;
        }
        this.transientVariables.push(theVariableSpec);
    };
    return Templatespec;
}());

var Variablespec = (function () {
    function Variablespec(name, type) {
        this.name = name;
        this.type = type;
    }
    ;
    return Variablespec;
}());

//# sourceMappingURL=flow-templatespecs.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* unused harmony export Spec */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ProcessSpec; });
/* unused harmony export ProcessInitiator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Group; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Identity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(110);
/*
 * flow-applications.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Application = (function (_super) {
    __extends(Application, _super);
    function Application(name, key, isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.key = key;
        _this.isDisabled = isDisabled;
        _this._v_Type = "Application";
        _this.specs = [];
        _this.groups = [];
        _this.identities = [];
        return _this;
    }
    Application.prototype.setDisabled = function (theIsDisabled) {
        this.isDisabled = theIsDisabled === true;
    };
    Application.prototype.getDisabled = function () {
        return this.isDisabled === true;
    };
    Application.prototype.addProcessSpec = function (theProcessSpec) {
        if (!theProcessSpec) {
            return;
        }
        this.specs.push(theProcessSpec);
    };
    Application.prototype.addGroup = function (theGroup) {
        if (!theGroup) {
            return;
        }
        this.groups.push(theGroup);
    };
    Application.prototype.addIdentity = function (theIdentity) {
        if (!theIdentity) {
            return;
        }
        this.identities.push(theIdentity);
    };
    Application.prototype.getAllSpecs = function () {
        if (!this.specs) {
            return null;
        }
        return this.specs.slice();
    };
    Application.prototype.getProcessSpecs = function () {
        if (!this.specs) {
            return null;
        }
        var someProcessSpecs = [];
        for (var _i = 0, _a = this.specs; _i < _a.length; _i++) {
            var aSpec = _a[_i];
            if (!aSpec) {
                continue;
            }
            if (!(aSpec._v_Type === "ProcessSpec")) {
                continue;
            }
            someProcessSpecs.push(aSpec);
        }
        return someProcessSpecs;
    };
    return Application;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

var Spec = (function (_super) {
    __extends(Spec, _super);
    function Spec(application, name, key) {
        var _this = _super.call(this) || this;
        _this.application = application;
        _this.name = name;
        _this.key = key;
        _this._v_Type = "Spec";
        return _this;
    }
    return Spec;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

var ProcessSpec = (function (_super) {
    __extends(ProcessSpec, _super);
    function ProcessSpec(theApplication, theName, theKey) {
        var _this = _super.call(this, theApplication, theName, theKey) || this;
        _this._v_Type = "ProcessSpec";
        return _this;
    }
    return ProcessSpec;
}(Spec));

var ProcessInitiator = (function (_super) {
    __extends(ProcessInitiator, _super);
    function ProcessInitiator(initiableProcessKeys, participedProcessKeys) {
        var _this = _super.call(this) || this;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this._v_Type = "ProcessInitiator";
        return _this;
    }
    ;
    return ProcessInitiator;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

var Group = (function (_super) {
    __extends(Group, _super);
    function Group(application, initiableProcessKeys, participedProcessKeys, name, key, isVirtual) {
        if (isVirtual === void 0) { isVirtual = false; }
        var _this = _super.call(this, initiableProcessKeys, participedProcessKeys) || this;
        _this.application = application;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this.name = name;
        _this.key = key;
        _this.isVirtual = isVirtual;
        _this._v_Type = "Group";
        return _this;
    }
    ;
    return Group;
}(ProcessInitiator));

var Identity = (function (_super) {
    __extends(Identity, _super);
    function Identity(application, initiableProcessKeys, participedProcessKeys, user, groupKeys) {
        var _this = _super.call(this, initiableProcessKeys, participedProcessKeys) || this;
        _this.application = application;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this.user = user;
        _this.groupKeys = groupKeys;
        _this._v_Type = "Identity";
        return _this;
    }
    ;
    return Identity;
}(ProcessInitiator));

//# sourceMappingURL=flow-applications.js.map

/***/ }),

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActiveFilter; });
/* unused harmony export ApplicationKeyed */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_applications_provider__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/*
 * active-filter.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ActiveFilter = (function () {
    function ActiveFilter(userData, applicationsProvider) {
        this.userData = userData;
        this.applicationsProvider = applicationsProvider;
        console.log("ActiveFilter constructor");
    }
    ActiveFilter.prototype.getAllApplicationsKeyed = function () {
        var _this = this;
        console.log("ActiveFilter getAllApplicationsKeyed");
        return new __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"](function (theObserver) {
            if (_this.applicationsKeyed) {
                theObserver.next(_this.applicationsKeyed);
                theObserver.complete();
                return;
            }
            _this.applicationsProvider.getAllApplications().subscribe(function (theApplications) {
                console.log("ActiveFilter getAllApplicationsKeyed this.applicationsProvider.getAllApplications().subscribe theApplications.length=" + (!theApplications ? 0 : theApplications.length));
                if (!theApplications || !theApplications.length) {
                    console.log("TemplatesFilter no or empty theApplications from this.applicationsProvider.getAllApplications().subscribe(");
                    theObserver.next(null);
                    theObserver.complete();
                    return;
                }
                _this.applicationsKeyed = new Map();
                for (var _i = 0, theApplications_1 = theApplications; _i < theApplications_1.length; _i++) {
                    var anApplication = theApplications_1[_i];
                    if (!anApplication || !anApplication.key) {
                        continue;
                    }
                    _this.applicationsKeyed.set(anApplication.key, new ApplicationKeyed(anApplication));
                }
                theObserver.next(_this.applicationsKeyed);
                theObserver.complete();
            }, function (theError) {
                theObserver.error(theError);
                theObserver.complete();
            });
            // When the consumer unsubscribes, clean up data ready for next subscription.
            return {
                unsubscribe: function () {
                    console.log("TemplatesFilter getTemplatespecs observable unsubscribe");
                }
            };
        });
    };
    ActiveFilter.prototype.acceptableProcessSpecs = function (theIdentityActivations) {
        if (!theIdentityActivations) {
            return null;
        }
        if (!theIdentityActivations.length) {
            return null;
        }
        if (!this.applicationsKeyed) {
            return null;
        }
        // Shall collect process keys for each application which has any of them
        var someProcessSpecs = [];
        // Iterate over Identity Activations
        for (var _i = 0, theIdentityActivations_1 = theIdentityActivations; _i < theIdentityActivations_1.length; _i++) {
            var anIdentityActivation = theIdentityActivations_1[_i];
            if (!anIdentityActivation
                || !anIdentityActivation.applicationKey
                || !anIdentityActivation.identityKey
                || !!anIdentityActivation.isActive) {
                continue;
            }
            // Lookup an application by its key.
            var anApplicationKeyed = this.applicationsKeyed.get(anIdentityActivation.applicationKey);
            if (!anApplicationKeyed) {
                // Login's LoginApplications refer to an unknown application key
                continue;
            }
            // Acceptable process keys for the application shall be among the ones from process specs in the application
            if (!anApplicationKeyed.processpecsByKey || !anApplicationKeyed.processpecsByKey.size) {
                // The application refered by the IdentityActivation does not hold any process specs
                continue;
            }
            if (!anApplicationKeyed.identitiesByKey) {
                // The application refered by the IdentityActivation does not hold any identities
                continue;
            }
            var anIdentity = anApplicationKeyed.identitiesByKey.get(anIdentityActivation.identityKey);
            if (!anIdentity) {
                // The application refered by the IdentityActivation does not hold the identity refered by its key from the identity activation
                continue;
            }
            // Collect ProcessSpecs with keys as refered by the identity initiableProcessKeys
            if (anIdentity.initiableProcessKeys) {
                this.processSpecsByKeyInto(anApplicationKeyed, anIdentity.initiableProcessKeys, someProcessSpecs);
            }
            // Collect ProcessSpecs with keys as refered by the identity participedProcessKeys
            if (anIdentity.participedProcessKeys) {
                this.processSpecsByKeyInto(anApplicationKeyed, anIdentity.participedProcessKeys, someProcessSpecs);
            }
            // Collect ProcessSpecs from each of the groups refered by the identity group keys
            if (anIdentity.groupKeys) {
                for (var _a = 0, _b = anIdentity.groupKeys; _a < _b.length; _a++) {
                    var aGroupKey = _b[_a];
                    if (!aGroupKey) {
                        continue;
                    }
                    var aGroup = anApplicationKeyed.groupsByKey.get(aGroupKey);
                    if (!aGroup) {
                        continue;
                    }
                    // Collect ProcessSpecs with keys as refered by the group initiableProcessKeys
                    if (aGroup.initiableProcessKeys) {
                        this.processSpecsByKeyInto(anApplicationKeyed, aGroup.initiableProcessKeys, someProcessSpecs);
                    }
                    // Collect ProcessSpecs with keys as refered by the group participedProcessKeys
                    if (aGroup.participedProcessKeys) {
                        this.processSpecsByKeyInto(anApplicationKeyed, aGroup.participedProcessKeys, someProcessSpecs);
                    }
                }
            }
        }
        return someProcessSpecs;
    };
    ActiveFilter.prototype.processSpecsByKeyInto = function (theApplicationKeyed, theProcessKeys, theProcessSpecs) {
        if (!theApplicationKeyed) {
            return;
        }
        if (!theProcessKeys || !theProcessKeys.length) {
            return;
        }
        if (!theProcessSpecs) {
            return;
        }
        for (var _i = 0, theProcessKeys_1 = theProcessKeys; _i < theProcessKeys_1.length; _i++) {
            var aProcessKey = theProcessKeys_1[_i];
            if (!aProcessKey) {
                continue;
            }
            var aProcessSpec = theApplicationKeyed.processpecsByKey.get(aProcessKey);
            if (aProcessSpec) {
                if (theProcessSpecs.indexOf(aProcessSpec) < 0) {
                    theProcessSpecs.push(aProcessSpec);
                }
            }
        }
    };
    ActiveFilter = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_4__providers_applications_provider__["a" /* ApplicationsProvider */]])
    ], ActiveFilter);
    return ActiveFilter;
}());

var ApplicationKeyed = (function () {
    function ApplicationKeyed(application) {
        this.application = application;
        this.identitiesByKey = new Map();
        this.groupsByKey = new Map();
        this.processpecsByKey = new Map();
        this.initFromApplication();
    }
    ApplicationKeyed.prototype.initFromApplication = function () {
        if (!this.application) {
            return;
        }
        var someSpecs = this.application.getProcessSpecs();
        if (someSpecs) {
            for (var _i = 0, someSpecs_1 = someSpecs; _i < someSpecs_1.length; _i++) {
                var aProcessSpec = someSpecs_1[_i];
                if (!aProcessSpec || !aProcessSpec.key) {
                    continue;
                }
                this.processpecsByKey.set(aProcessSpec.key, aProcessSpec);
            }
        }
        if (this.application.identities) {
            for (var _a = 0, _b = this.application.identities; _a < _b.length; _a++) {
                var anIdentity = _b[_a];
                if (!anIdentity || !anIdentity.user) {
                    continue;
                }
                this.identitiesByKey.set(anIdentity.user, anIdentity);
            }
        }
        if (this.application.groups) {
            for (var _c = 0, _d = this.application.groups; _c < _d.length; _c++) {
                var aGroup = _d[_c];
                if (!aGroup || !aGroup.key) {
                    continue;
                }
                this.groupsByKey.set(aGroup.key, aGroup);
            }
        }
    };
    return ApplicationKeyed;
}());

//# sourceMappingURL=active-filter.js.map

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Authentication; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_result__ = __webpack_require__(316);
/*
 * flow-authentication.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Authentication = (function (_super) {
    __extends(Authentication, _super);
    function Authentication(login, theSuccess, theCondition, theMessage, theDetails) {
        var _this = _super.call(this, theSuccess, theCondition, theMessage, theDetails) || this;
        _this.login = login;
        _this._v_Type = "Authentication";
        return _this;
    }
    ;
    return Authentication;
}(__WEBPACK_IMPORTED_MODULE_0__flow_result__["a" /* Result */]));

//# sourceMappingURL=flow-authentication.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Result; });
/*
 * flow-result.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var Result = (function () {
    function Result(theSuccess, theCondition, theMessage, theDetails) {
        this._v_Success = theSuccess;
        this._v_Condition = theCondition || null;
        this._v_Message = theMessage || null;
        this._v_Details = theDetails || null;
    }
    return Result;
}());

//# sourceMappingURL=flow-result.js.map

/***/ }),

/***/ 46:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_data__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flow_flowtabs_page_flowtabs_page__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_logins_provider__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_authentication_provider__ = __webpack_require__(223);
/*
 * login.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MAXERRORLEN = 256;
var LoginPage = (function () {
    function LoginPage(navCtrl, alertCtrl, userData, loginsProvider, authenticationProvider) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.userData = userData;
        this.loginsProvider = loginsProvider;
        this.authenticationProvider = authenticationProvider;
        this.login = { username: '', password: '' };
        this.submitted = false;
        console.log("LoginPage constructor");
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.loginsProvider.getAllLogins().subscribe(function (theLogins) {
            _this.logins = theLogins;
        }, function (theError) {
            console.log("LoginPage ionViewDidLoad loginsProvider.getAllLogins ERROR: " + theError);
        });
    };
    LoginPage.prototype.courtesyLoginSelected = function () {
        if (!this.selectedLogin) {
            this.login.username = "";
            this.login.password = "";
            return;
        }
        this.login.username = this.selectedLogin.login;
        this.login.password = "AnyPasswordGoes";
        this.doLogin();
    };
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        this.authenticationProvider.authenticate(this.login.username, this.login.password)
            .subscribe(function (theAuthentication) {
            _this.userData.authenticationPerformed(theAuthentication).then(function () {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */]);
            }, function (theError) {
                _this.alertCtrl.create({
                    title: 'Error after authentication',
                    subTitle: theError.toString().substr(0, MAXERRORLEN),
                    buttons: ['Dismiss']
                });
            });
        }, function (theError) {
            _this.alertCtrl.create({
                title: 'Error during authentication',
                subTitle: theError.toString().substr(0, MAXERRORLEN),
                buttons: ['Dismiss']
            });
        });
    };
    LoginPage.prototype.onLogin = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.doLogin();
        }
    };
    LoginPage.prototype.onSignup = function () {
        var _this = this;
        this.userData.authenticationPerformed(null).then(function () {
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */]);
        }, function (theError) {
            _this.alertCtrl.create({
                title: 'Error after authentication',
                subTitle: theError.toString().substr(0, MAXERRORLEN),
                buttons: ['Dismiss']
            });
        });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-user',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/login/login.html"*/'<!--\n* login.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n		<ion-title>Login to workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n	</div>\n\n\n	<form #loginForm="ngForm" novalidate>\n  \n		<ion-list no-lines>\n            \n            <ion-item>\n                <ion-icon name="person" item-start></ion-icon>\n                <ion-label>Courtesy demo logins</ion-label>\n                <ion-select name="login_select" [(ngModel)]="selectedLogin" (ionChange)="courtesyLoginSelected()">\n                    <ion-option *ngFor="let aLogin of logins" [value]="aLogin" >{{ aLogin.login}}</ion-option>\n                </ion-select>\n            </ion-item>\n            \n			<ion-item>\n				<ion-label stacked color="primary">Username</ion-label>\n				<ion-input [(ngModel)]="login.username" name="username" type="text" #username="ngModel" spellcheck="false" autocapitalize="off"\n					required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="username.valid || submitted == false" color="danger" padding-left>\n				Username is required\n			</p>\n\n			<ion-item>\n				<ion-label stacked color="primary">Password</ion-label>\n				<ion-input [(ngModel)]="login.password" name="password" type="password" #password="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="password.valid || submitted == false" color="danger" padding-left>\n				Password is required\n			</p>\n		</ion-list>\n\n		<ion-row responsive-sm>\n			<ion-col>\n				<button ion-button (click)="onLogin(loginForm)" type="submit" block>Login</button>\n			</ion-col>\n			<ion-col>\n				<button ion-button (click)="onSignup()" color="light" block>Signup</button>\n			</ion-col>\n		</ion-row>\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/login/login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_user_data__["a" /* UserData */],
            __WEBPACK_IMPORTED_MODULE_4__providers_logins_provider__["a" /* LoginsProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_authentication_provider__["a" /* AuthenticationProvider */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 57:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowTabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__inbox_inbox__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drafts_drafts__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__archived_archived__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__bounced_bounced__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__templates_templates__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__outbox_outbox__ = __webpack_require__(120);
/*
 * flowtabs-page.ts
 *
 * Created @author Antonio Carrasco Valero 201805252222
 *
 *
 ***************************************************************************

 Copyright 2018 Antonio Carrasco Valero
 workOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.

Licensed under the EUPL, Version 1.1 only (the "Licence");
You may not use this work except in compliance with the
Licence.
You may obtain a copy of the Licence at:
https://joinup.ec.europa.eu/software/page/eupl/licence-eupl
Unless required by applicable law or agreed to in
writing, software distributed under the Licence is
distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
express or implied.
See the Licence for the specific language governing
permissions and limitations under the Licence.
 {{License2}}

 {{Licensed1}}
 {{Licensed2}}

 ***************************************************************************
 *
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var FlowTabsPage = (function () {
    function FlowTabsPage(navParams) {
        // set the root pages for each tab
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_2__inbox_inbox__["a" /* InboxPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__drafts_drafts__["a" /* DraftsPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_4__archived_archived__["a" /* ArchivedPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_5__bounced_bounced__["a" /* BouncedPage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_6__templates_templates__["a" /* TemplatesPage */];
        this.tab6Root = __WEBPACK_IMPORTED_MODULE_7__outbox_outbox__["a" /* OutboxPage */];
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    FlowTabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flowtabs-page/flowtabs-page.html"*/'<!--\n* flowtabs-page.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-tabs [selectedIndex]="mySelectedIndex" name="flow">\n    <ion-tab [root]="tab1Root" flowboxTitle="Inbox" tabIcon="mail" tabUrlPath="inbox"></ion-tab>\n    <ion-tab [root]="tab2Root" flowboxTitle="Drafts" tabIcon="mail-open" tabUrlPath="drafts"></ion-tab>\n    <ion-tab [root]="tab3Root" flowboxTitle="Archived" tabIcon="done-all" tabUrlPath="archived"></ion-tab>\n    <ion-tab [root]="tab4Root" flowboxTitle="Bounced" tabIcon="undo" tabUrlPath="bounced"></ion-tab>\n    <ion-tab [root]="tab5Root" flowboxTitle="Templates" tabIcon="create" tabUrlPath="templates"></ion-tab>\n    <ion-tab [root]="tab6Root" flowboxTitle="Outbox" tabIcon="send" tabUrlPath="outbox"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workoflow-ui_trunk/workoflow-ui/workoflow-uiapp/src/pages/flow/flowtabs-page/flowtabs-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
    ], FlowTabsPage);
    return FlowTabsPage;
}());

//# sourceMappingURL=flowtabs-page.js.map

/***/ })

},[229]);
//# sourceMappingURL=main.js.map