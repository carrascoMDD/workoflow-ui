webpackJsonp([0],{

/***/ 10:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoggedinProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_storage__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__logins_provider__ = __webpack_require__(48);
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




var LoggedinProvider = (function () {
    function LoggedinProvider(events, storage, loginsProvider) {
        this.events = events;
        this.storage = storage;
        this.loginsProvider = loginsProvider;
        this.isDoingLogin = false;
        this.isDoingLogin = false;
        this.waitingForLoginDone = [];
        this.authenticatedLogin = null;
    }
    LoggedinProvider.prototype.resolveAllWaitingForLoginProcessing = function () {
        if (this.waitingForLoginDone) {
            for (var _i = 0, _a = this.waitingForLoginDone; _i < _a.length; _i++) {
                var aPromise = _a[_i];
                aPromise(null);
            }
        }
        this.waitingForLoginDone = null;
    };
    LoggedinProvider.prototype.toWaitForLoginProcessing = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (!_this.waitingForLoginDone) {
                _this.waitingForLoginDone = [];
            }
            _this.waitingForLoginDone.push(resolve);
        });
    };
    LoggedinProvider.prototype.authenticationPerformed = function (theAuthentication) {
        var _this = this;
        this.authenticatedLogin = null;
        if (!theAuthentication || !theAuthentication._v_Success) {
            return Promise.resolve(theAuthentication);
        }
        /* ************************************************************
        Avoid other clients or subscribers to launch resolution of identityActivations
        when already on its (asynchronous) way.
        */
        this.isDoingLogin = true;
        this.waitingForLoginDone = [];
        return new Promise(function (resolve) {
            _this.loginsProvider.getAllLogins().subscribe(function (theLogins) {
                _this.authenticatedLogin = null;
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
                    _this.isDoingLogin = false;
                    _this.resolveAllWaitingForLoginProcessing();
                    _this.events.publish('user:logout');
                    resolve(theAuthentication);
                    return;
                }
                /* ************************************************************
                Retrieve from local store the application key - identity key pairs
                which the logged in user did select as active sometime in the past,
                saving the User the need  to activate manually often-used identities at the beginning of work sessions.
                Stored as an array of elements with IApplicationActivation - like layout:
                    applicationKey: string;
                    identityKey: string;
                    active: boolean;

                let aStorageKey = STOREKEYPREFIX +  theAuthentication.login.replace(STOREKEYSEPARATORTOREPLACE, STOREKEYSEPARATORTOREPLACEMENT);
                this.storage.get( aStorageKey).then(( theStoredIdentityActivations) => {
                    // ? is it a string or an object ?
                    if( theStoredIdentityActivations) {
                        for( let anStoredIdentityActivation of theStoredIdentityActivations) {
                            if( !anStoredIdentityActivation) {
                                continue;
                            }

                            if( !anStoredIdentityActivation.applicationKey || !anStoredIdentityActivation.identityKey) {
                                continue;
                            }

                            const someApplicationIdentityActivations = someIdentityActivationsByKeys[ anStoredIdentityActivation.applicationKey];
                            if( someApplicationIdentityActivations) {
                                const anApplicationIdentityActivation = someApplicationIdentityActivations[ anStoredIdentityActivation.identityKey];
                                if( anApplicationIdentityActivation) {
                                    anApplicationIdentityActivation.setActive( anStoredIdentityActivation.active === true);
                                }
                            }
                        }
                    }

                    this.isDoingLogin = false;
                    this.resolveAllWaitingForLoginProcessing();
                    this.events.publish('user:login');
                    resolve( theAuthentication);
                });
*/
            });
        });
    };
    LoggedinProvider.prototype.signup = function (username) {
        if (username) { } /*CQT
        this.storage.set(this.HAS_LOGGED_IN, true);*/
        this.events.publish('user:signup');
        return Promise.resolve(username);
    };
    LoggedinProvider.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { } /*CQT*/
            _this.authenticatedLogin = null;
            _this.isDoingLogin = false;
            _this.waitingForLoginDone = null;
            _this.events.publish('user:logout');
            pheResolve(true);
        });
    };
    LoggedinProvider.prototype.hasLoggedIn = function () {
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
    LoggedinProvider.prototype.getAuthenticatedLogin = function () {
        return Promise.resolve(this.authenticatedLogin);
    };
    LoggedinProvider.HAS_LOGGED_IN = 'hasLoggedIn';
    LoggedinProvider.HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
    LoggedinProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_3__logins_provider__["a" /* LoginsProvider */]])
    ], LoggedinProvider);
    return LoggedinProvider;
}());

//# sourceMappingURL=loggedin-provider.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(47);
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
    function SignupPage(navCtrl, loggedinProvider) {
        this.navCtrl = navCtrl;
        this.loggedinProvider = loggedinProvider;
        this.signup = { username: '', password: '' };
        this.submitted = false;
    }
    SignupPage.prototype.onSignup = function (form) {
        this.submitted = true;
        if (form.valid) {
            this.loggedinProvider.signup(this.signup.username);
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
        }
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-signup',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/signup/signup.html"*/'<!--\n* signup.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n		<ion-title>Signup for workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="login-page">\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n\n	<form #signupForm="ngForm" novalidate>\n		<ion-list no-lines>\n			<ion-item>\n				<ion-label stacked color="primary">Username</ion-label>\n				<ion-input [(ngModel)]="signup.username" name="username" type="text" #username="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="username.valid || submitted == false" color="danger" padding-left>\n				Username is required\n			</p>\n\n			<ion-item>\n				<ion-label stacked color="primary">Password</ion-label>\n				<ion-input [(ngModel)]="signup.password" name="password" type="password" #password="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="password.valid || submitted == false" color="danger" padding-left>\n				Password is required\n			</p>\n		</ion-list>\n\n		<div padding>\n			<button ion-button (click)="onSignup(signupForm)" type="submit" block>Create</button>\n		</div>\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/signup/signup.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 113:
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

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__ = __webpack_require__(32);
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
    function InboxPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-inbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/inbox/inbox.html"*/'<!--\n* inbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Inbox\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/inbox/inbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], InboxPage);
    return InboxPage;
}(__WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=inbox.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DraftsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__ = __webpack_require__(32);
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
    function DraftsPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-drafts',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/drafts/drafts.html"*/'<!--\n* drafts.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Drafts\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/drafts/drafts.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], DraftsPage);
    return DraftsPage;
}(__WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=drafts.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArchivedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__ = __webpack_require__(32);
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
    function ArchivedPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-archived',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/archived/archived.html"*/'<!--\n* archived.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Archived\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/archived/archived.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], ArchivedPage);
    return ArchivedPage;
}(__WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=archived.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BouncedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__ = __webpack_require__(32);
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
    function BouncedPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-bounced',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/bounced/bounced.html"*/'<!--\n* bounced.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="shownContentItems === 0">\n        \n        <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n            \n            <ion-item-divider sticky>\n                <ion-label>\n                    {{group.time}}\n                </ion-label>\n            </ion-item-divider>\n            \n            <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem\n                              [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n                \n                <button ion-item (click)="goToSessionDetail(session)">\n                    <h3>{{session.name}}</h3>\n                    <p>\n                        {{session.timeStart}} &mdash;\n                        {{session.timeEnd}}:\n                        {{session.location}}\n                    </p>\n                </button>\n                \n                <ion-item-options>\n                    <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)"\n                            *ngIf="segment === \'all\'">\n                        Favorite\n                    </button>\n                    <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')"\n                            *ngIf="segment === \'favorites\'">\n                        Remove\n                    </button>\n                </ion-item-options>\n            \n            </ion-item-sliding>\n        \n        </ion-item-group>\n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="shownContentItems > 0">\n        Nothing found in Bounced\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/bounced/bounced.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], BouncedPage);
    return BouncedPage;
}(__WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=bounced.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flowlist_flowlist__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_detail_template_detail__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__filters_templates_filter__ = __webpack_require__(223);
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
    function TemplatesPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider, templatesFilter) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-templates',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/templates/templates.html"*/'<!--\n* templates.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n    <ion-refresher (ionRefresh)="doRefresh($event)">\n        <ion-refresher-content></ion-refresher-content>\n    </ion-refresher>\n    \n    <ion-list #contentsListView [hidden]="!templatespecs || ( templatespecs.length === 0)">\n        \n        <ion-item-sliding *ngFor="let aTemplatespec of templatespecs" #slidingItem\n                          [attr.track]="aTemplatespec.key | lowercase" [hidden]="aTemplatespec.hide">\n            \n            <button ion-item (click)="goToTemplateDetail(aTemplatespec)">\n                <h3>{{aTemplatespec.name}} - {{aTemplatespec.key}}</h3>\n                <p>\n                    {{aTemplatespec.description}}\n                </p>\n            </button>\n            \n            <ion-item-options>\n                <button ion-button color="favorite" (click)="addFavorite(slidingItem, aTemplatespec)"\n                        *ngIf="segment === \'all\'">\n                    Favorite\n                </button>\n                <button ion-button color="danger"\n                        (click)="removeFavorite(slidingItem, aTemplatespec, \'Remove Favorite\')"\n                        *ngIf="segment === \'favorites\'">\n                    Remove\n                </button>\n            </ion-item-options>\n        \n        </ion-item-sliding>\n    \n    \n    </ion-list>\n    \n    <ion-list-header [hidden]="templatespecs && templatespecs.length > 0">\n        No Templates Found\n    </ion-list-header>\n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/templates/templates.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_5__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */],
            __WEBPACK_IMPORTED_MODULE_6__filters_templates_filter__["a" /* TemplatesFilter */]])
    ], TemplatesPage);
    return TemplatesPage;
}(__WEBPACK_IMPORTED_MODULE_3__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=templates.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_templatespecs__ = __webpack_require__(317);
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
    function TemplatesProvider(httpc) {
        this.httpc = httpc;
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
                var aTemplatespec = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_templatespecs__["a" /* Templatespec */](aProcessSpec.id, aProcessSpec.url, aProcessSpec.key, aProcessSpec.version, aProcessSpec.name, aProcessSpec.description, aProcessSpec.tenantId, aProcessSpec.deploymentId, aProcessSpec.deploymentUrl, aProcessSpec.resource, aProcessSpec.diagramResource, aProcessSpec.category, aProcessSpec.graphicalNotationDefined, aProcessSpec.suspended, aProcessSpec.startFormDefined);
                if (aProcessSpec.variables) {
                    for (var _a = 0, _b = aProcessSpec.variables; _a < _b.length; _a++) {
                        var aProcessVariable = _b[_a];
                        if (!aProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_templatespecs__["b" /* Variablespec */](aProcessVariable.name, aProcessVariable.type);
                        aTemplatespec.addVariablespec(aVariableSpec);
                    }
                }
                if (aProcessSpec.transientVariables) {
                    for (var _c = 0, _d = aProcessSpec.transientVariables; _c < _d.length; _c++) {
                        var aTransientProcessVariable = _d[_c];
                        if (!aTransientProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_templatespecs__["b" /* Variablespec */](aTransientProcessVariable.name, aTransientProcessVariable.type);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
    ], TemplatesProvider);
    return TemplatesProvider;
}());

//# sourceMappingURL=templates-provider.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_applications__ = __webpack_require__(318);
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
    function ApplicationsProvider(httpc) {
        this.httpc = httpc;
        console.log("ApplicationsProvider constructor");
    }
    ApplicationsProvider.prototype.getAllApplications = function () {
        return this.load();
    };
    ApplicationsProvider.prototype.load = function () {
        if (this.applications) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].of(this.applications);
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
                var anApplication = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_applications__["a" /* Application */](aSrcApplication.name, aSrcApplication.key);
                if (aSrcApplication.processSpecs) {
                    for (var _a = 0, _b = aSrcApplication.processSpecs; _a < _b.length; _a++) {
                        var aSrcProcessSpec = _b[_a];
                        if (!aSrcProcessSpec) {
                            continue;
                        }
                        var aProcessSpec = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_applications__["d" /* ProcessSpec */](anApplication, aSrcProcessSpec.name, aSrcProcessSpec.key);
                        anApplication.addProcessSpec(aProcessSpec);
                    }
                }
                if (aSrcApplication.groups) {
                    for (var _c = 0, _d = aSrcApplication.groups; _c < _d.length; _c++) {
                        var aSrcGroup = _d[_c];
                        if (!aSrcGroup) {
                            continue;
                        }
                        var aGroup = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_applications__["b" /* Group */](anApplication, this.sliceOrNull(aSrcGroup.initiableProcessKeys), this.sliceOrNull(aSrcGroup.participedProcessKeys), aSrcGroup.name, aSrcGroup.key);
                        anApplication.addGroup(aGroup);
                    }
                }
                if (aSrcApplication.identities) {
                    for (var _e = 0, _f = aSrcApplication.identities; _e < _f.length; _e++) {
                        var aSrcIdentity = _f[_e];
                        if (!aSrcIdentity) {
                            continue;
                        }
                        var anIdentity = new __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_applications__["c" /* Identity */](anApplication, this.sliceOrNull(aSrcIdentity.initiableProcessKeys), this.sliceOrNull(aSrcIdentity.participedProcessKeys), aSrcIdentity.user, this.sliceOrNull(aSrcIdentity.groups));
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */]])
    ], ApplicationsProvider);
    return ApplicationsProvider;
}());

//# sourceMappingURL=applications-provider.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OutboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__ = __webpack_require__(32);
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
    function OutboxPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, theActivationsProvider) || this;
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
            selector: 'page-outbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/outbox/outbox.html"*/'<!--\n* outbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<flow-header></flow-header>\n\n<ion-content>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-list #contentsListView [hidden]="shownContentItems === 0">\n\n    <ion-item-group *ngFor="let group of groups" [hidden]="group.hide">\n\n      <ion-item-divider sticky>\n        <ion-label>\n          {{group.time}}\n        </ion-label>\n      </ion-item-divider>\n\n      <ion-item-sliding *ngFor="let session of group.sessions" #slidingItem [attr.track]="session.tracks[0] | lowercase" [hidden]="session.hide">\n\n        <button ion-item (click)="goToSessionDetail(session)">\n          <h3>{{session.name}}</h3>\n          <p>\n            {{session.timeStart}} &mdash;\n            {{session.timeEnd}}:\n            {{session.location}}\n          </p>\n        </button>\n\n        <ion-item-options>\n          <button ion-button color="favorite" (click)="addFavorite(slidingItem, session)" *ngIf="segment === \'all\'">\n            Favorite\n          </button>\n          <button ion-button color="danger" (click)="removeFavorite(slidingItem, session, \'Remove Favorite\')" *ngIf="segment === \'favorites\'">\n            Remove\n          </button>\n        </ion-item-options>\n\n      </ion-item-sliding>\n\n    </ion-item-group>\n\n  </ion-list>\n\n  <ion-list-header [hidden]="shownContentItems > 0">\n      Nothing found in Outbox\n  </ion-list-header>\n\n  <ion-fab bottom right #fab>\n    <button ion-fab><ion-icon name="share"></ion-icon></button>\n    <ion-fab-list side="top">\n      <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)"><ion-icon name="logo-vimeo"></ion-icon></button>\n      <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)"><ion-icon name="logo-googleplus"></ion-icon></button>\n      <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)"><ion-icon name="logo-twitter"></ion-icon></button>\n      <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)"><ion-icon name="logo-facebook"></ion-icon></button>\n    </ion-fab-list>\n  </ion-fab>\n\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/outbox/outbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], OutboxPage);
    return OutboxPage;
}(__WEBPACK_IMPORTED_MODULE_4__flowlist_flowlist__["a" /* FlowlistPage */]));

//# sourceMappingURL=outbox.js.map

/***/ }),

/***/ 133:
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
webpackEmptyAsyncContext.id = 133;

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

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActivationsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__logins_provider__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__interfaces_flow_activations__ = __webpack_require__(314);
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




var ActivationsProvider = (function () {
    function ActivationsProvider(storage, loginsProvider) {
        this.storage = storage;
        this.loginsProvider = loginsProvider;
        this.login = null;
        this.applicationActivations = [];
        this.activationsChangedHandlers = [];
    }
    ActivationsProvider_1 = ActivationsProvider;
    ActivationsProvider.storeKey_applicationActivationsForLogin = function (theLogin) {
        if (!(theLogin && theLogin.login)) {
            return null;
        }
        var aReplacedLogin = theLogin.login.replace(ActivationsProvider_1.STOREKEYSEPARATORTOREPLACE, ActivationsProvider_1.STOREKEYSEPARATORTOREPLACEMENT);
        return ActivationsProvider_1.STOREKEYPREFIX + aReplacedLogin;
    };
    ActivationsProvider.prototype.registerInterest_activationsChanged = function (theHandler) {
        if (!theHandler) {
            return;
        }
        if (!this.activationsChangedHandlers) {
            this.activationsChangedHandlers = [];
        }
        this.activationsChangedHandlers.push(theHandler);
    };
    ActivationsProvider.prototype.getApplicationActivations = function () {
        return Promise.resolve(this.copyOfApplicationActivations());
    };
    ActivationsProvider.prototype.propagate_activationsChanged = function () {
        var _this = this;
        if (!this.activationsChangedHandlers || !this.activationsChangedHandlers.length) {
            return Promise.resolve();
        }
        /* ************************************************************
        Return a Promise which shall be fulfilled after the chained fulfillement of all the change handlers
         */
        return new Promise(function (resolveTop) {
            var aFirstResolve = null;
            var aFirstPromise = new Promise(function (pheResolve) {
                aFirstResolve = pheResolve;
            });
            var aPreviousPromise = aFirstPromise;
            var _loop_1 = function (anactivationsChangedHandler) {
                aPreviousPromise = aPreviousPromise.then(function () {
                    return anactivationsChangedHandler(_this.copyOfApplicationActivations());
                }, function () {
                    return anactivationsChangedHandler(_this.copyOfApplicationActivations());
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
            for (var _i = 0, _a = _this.activationsChangedHandlers; _i < _a.length; _i++) {
                var anactivationsChangedHandler = _a[_i];
                _loop_1(anactivationsChangedHandler);
            }
            /* ************************************************************
            Sanity check, should not happen because of the check done at the top of the method on
            this.activationsChangedHandlers.length
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
    ActivationsProvider.prototype.retrieveApplicationActivations = function (theAuthentication, theLogin) {
        var _this = this;
        this.applicationActivations = null;
        if (!theAuthentication || !theAuthentication._v_Success) {
            return Promise.resolve(null);
        }
        if (!theLogin || !theLogin.loginApplications || !theLogin.loginApplications.length) {
            return Promise.resolve(null);
        }
        this.login = theLogin;
        return new Promise(function (pheResolve, pheReject) {
            /* ************************************************************
            Build the list of applicationActivations with active state from storage.
            Create non-active IdentityActivations for all the LoginApplication in the Login
            matching theAuthentication.login
            Index the identityActivations by application key and identity key
            to avoid N*N complexity in match with stored key pairs, below.
            */
            var someInitialApplicationActivations = null;
            _this.initApplicationActivations(theLogin)
                .then(function (theInitialApplicationActivations) {
                someInitialApplicationActivations = theInitialApplicationActivations;
                return _this.retrieveStoredApplicationActivations(theLogin);
            }, function (theError) {
                throw theError;
            })
                .then(function (theStoredApplicationActivations) {
                return ActivationsProvider_1.mergeApplicationActivations(theStoredApplicationActivations, someInitialApplicationActivations);
            }, function (theError) {
                throw theError;
            })
                .then(function (theMergedApplicationActivations) {
                _this.applicationActivations = theMergedApplicationActivations;
                pheResolve(_this.applicationActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    /* ************************************************************
    Build the list of ApplicationActivations and their IdentityActivations
    with active state from storage.
    Create non-active IdentityActivations for all the LoginApplication in the authenticatedLogin.
    */
    ActivationsProvider.prototype.initApplicationActivations = function (theLogin) {
        var _this = this;
        return new Promise(function (pheResolve) {
            _this.applicationActivations = [];
            for (var _i = 0, _a = theLogin.loginApplications; _i < _a.length; _i++) {
                var aLoginApplication = _a[_i];
                if (!(aLoginApplication
                    && aLoginApplication.applicationKey
                    && aLoginApplication.identityKeys
                    && aLoginApplication.identityKeys.length)) {
                    continue;
                }
                var anApplicationActivation = new __WEBPACK_IMPORTED_MODULE_3__interfaces_flow_activations__["a" /* ApplicationActivation */](theLogin.login, aLoginApplication.applicationKey, ActivationsProvider_1.APPLICATION_ISACTIVE_INITIAL);
                for (var _b = 0, _c = aLoginApplication.identityKeys; _b < _c.length; _b++) {
                    var anIdentityKey = _c[_b];
                    var anIdentityActivation = new __WEBPACK_IMPORTED_MODULE_3__interfaces_flow_activations__["b" /* IdentityActivation */](anApplicationActivation, anIdentityKey, ActivationsProvider_1.IDENTITY_ISACTIVE_INITIAL);
                    anApplicationActivation.addIdentityActivation(anIdentityActivation);
                }
            }
            pheResolve(_this.applicationActivations);
        });
    };
    /* ************************************************************
    Retrieve from local store the application key - identity key pairs
    which the logged in user did select as active sometime in the past,
    saving the User the need  to activate manually often-used identities at the beginning of work sessions.
    Stored as an array of elements with IApplicationActivation with nested IIdentityActivation[]
    */
    ActivationsProvider.prototype.retrieveStoredApplicationActivations = function (theLogin) {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            var aStorageKey = ActivationsProvider_1.storeKey_applicationActivationsForLogin(theLogin);
            if (!aStorageKey) {
                pheReject("ERROR computing store key for application activations, or the user is not logged in");
                return;
            }
            var someApplicationActivations = [];
            _this.storage.get(aStorageKey)
                .then(function (theStoredApplicationActivations) {
                if (!theStoredApplicationActivations) {
                    pheResolve(null);
                    return;
                }
                for (var _i = 0, theStoredApplicationActivations_1 = theStoredApplicationActivations; _i < theStoredApplicationActivations_1.length; _i++) {
                    var aStoredApplicationActivation = theStoredApplicationActivations_1[_i];
                    if (!(aStoredApplicationActivation
                        && aStoredApplicationActivation.login
                        && aStoredApplicationActivation.applicationKey)) {
                        continue;
                    }
                    var anApplicationActivation = new __WEBPACK_IMPORTED_MODULE_3__interfaces_flow_activations__["a" /* ApplicationActivation */](aStoredApplicationActivation.login, aStoredApplicationActivation.applicationKey, aStoredApplicationActivation.isActive, aStoredApplicationActivation);
                    someApplicationActivations.push(anApplicationActivation);
                }
                pheResolve(someApplicationActivations);
            }, function (theError) {
                throw theError;
            });
        });
    };
    ActivationsProvider.prototype.commitActivations = function (theApplicationActivations) {
        var _this = this;
        if (!(theApplicationActivations
            && theApplicationActivations.length)) {
            return Promise.resolve(null);
        }
        if (!(this.login)) {
            return Promise.resolve(null);
        }
        return new Promise(function (pheResolve, pheReject) {
            _this.storeActivations(theApplicationActivations)
                .then(function () {
                return _this.propagate_activationsChanged();
            }, function (pheError) {
                throw pheError;
            })
                .then(function () {
                pheResolve(theApplicationActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    ActivationsProvider.prototype.storeActivations = function (theApplicationActivations) {
        var _this = this;
        if (!(theApplicationActivations
            && theApplicationActivations.length)) {
            return Promise.resolve(null);
        }
        if (!(this.login)) {
            return Promise.resolve(null);
        }
        return new Promise(function (pheResolve, pheReject) {
            var aStorageKey = ActivationsProvider_1.storeKey_applicationActivationsForLogin(_this.login);
            _this.storage.set(aStorageKey, theApplicationActivations)
                .then(function () {
                pheResolve(theApplicationActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    ActivationsProvider.prototype.copyOfApplicationActivations = function () {
        if (!this.applicationActivations) {
            return null;
        }
        if (this.applicationActivations.length < 1) {
            return [];
        }
        return this.applicationActivations.map(function (theApplicationActivation) {
            return theApplicationActivation.copyWithIdentityActivations();
        });
    };
    ActivationsProvider.mergeApplicationActivations = function (theStored, theInitial) {
        if (!(theStored && theStored.length
            && theInitial && theInitial.length)) {
            return Promise.resolve(theInitial);
        }
        if ((theStored.length * theInitial.length) > ActivationsProvider_1.MAXAPPLICATIONACTIVATIONSSQUARE) {
            return ActivationsProvider_1.mergeApplicationActivations_indexing(theStored, theInitial);
        }
        return ActivationsProvider_1.mergeApplicationActivations_square(theStored, theInitial);
    };
    ActivationsProvider.mergeApplicationActivations_indexing = function (theStored, theInitial) {
        return ActivationsProvider_1.mergeApplicationActivations_square(theStored, theInitial);
    };
    ActivationsProvider.mergeApplicationActivations_square = function (theStored, theInitial) {
        if (!(theStored && theStored.length
            && theInitial && theInitial.length)) {
            return Promise.resolve(theInitial);
        }
        for (var _i = 0, theStored_1 = theStored; _i < theStored_1.length; _i++) {
            var aStored = theStored_1[_i];
            if (!(aStored
                && aStored.login
                && aStored.applicationKey)) {
                continue;
            }
            var aFoundInitial = null;
            for (var _a = 0, theInitial_1 = theInitial; _a < theInitial_1.length; _a++) {
                var anInitial = theInitial_1[_a];
                if (!(anInitial
                    && anInitial.login
                    && anInitial.applicationKey)) {
                    continue;
                }
                if (!(aStored.login === anInitial.login)) {
                    continue;
                }
                if (anInitial.applicationKey === aStored.applicationKey) {
                    aFoundInitial = anInitial;
                    break;
                }
            }
            if (!aFoundInitial) {
                continue;
            }
            aFoundInitial.isActive = aStored.isActive === true;
            if (!(aStored.identityActivations
                && aStored.identityActivations.length
                && aFoundInitial.identityActivations
                && aFoundInitial.identityActivations.length)) {
                continue;
            }
            ActivationsProvider_1.mergeIdentityActivations_square(aStored.identityActivations, aFoundInitial.identityActivations);
        }
    };
    ActivationsProvider.mergeIdentityActivations = function (theStored, theInitial) {
        if (!(theStored && theStored.length
            && theInitial && theInitial.length)) {
            return Promise.resolve(theInitial);
        }
        if ((theStored.length * theInitial.length) > ActivationsProvider_1.MAXIDENTITYACTIVATIONSSQUARE) {
            return ActivationsProvider_1.mergeIdentityActivations_indexing(theStored, theInitial);
        }
        return ActivationsProvider_1.mergeIdentityActivations_square(theStored, theInitial);
    };
    ActivationsProvider.mergeIdentityActivations_indexing = function (theStored, theInitial) {
        return ActivationsProvider_1.mergeIdentityActivations_square(theStored, theInitial);
    };
    ActivationsProvider.mergeIdentityActivations_square = function (theStored, theInitial) {
        if (!(theStored && theStored.length
            && theInitial && theInitial.length)) {
            return Promise.resolve(theInitial);
        }
        for (var _i = 0, theStored_2 = theStored; _i < theStored_2.length; _i++) {
            var aStored = theStored_2[_i];
            if (!(aStored
                && aStored.identityKey)) {
                continue;
            }
            var aFoundInitial = null;
            for (var _a = 0, theInitial_2 = theInitial; _a < theInitial_2.length; _a++) {
                var anInitial = theInitial_2[_a];
                if (!(anInitial
                    && anInitial.identityKey)) {
                    continue;
                }
                if (anInitial.identityKey === aStored.identityKey) {
                    aFoundInitial = anInitial;
                    break;
                }
            }
            if (!aFoundInitial) {
                continue;
            }
            aFoundInitial.isActive = aStored.isActive === true;
        }
    };
    ActivationsProvider.equalApplicationActivations = function (theOnes, theOthers) {
        if (!(theOnes && theOnes.length
            && theOthers && theOthers.length
            && (theOnes.length === theOthers.length))) {
            return false;
        }
        if ((theOnes.length * theOthers.length) > ActivationsProvider_1.MAXAPPLICATIONACTIVATIONSSQUARE) {
            return ActivationsProvider_1.equalApplicationActivations_indexing(theOnes, theOthers);
        }
        return ActivationsProvider_1.equalApplicationActivations_square(theOnes, theOthers);
    };
    ActivationsProvider.equalApplicationActivations_indexing = function (theOnes, theOthers) {
        return ActivationsProvider_1.equalApplicationActivations_square(theOnes, theOthers);
    };
    ActivationsProvider.equalApplicationActivations_square = function (theOnes, theOthers) {
        if (!(theOnes && theOnes.length
            && theOthers && theOthers.length
            && (theOnes.length === theOthers.length))) {
            return false;
        }
        for (var _i = 0, theOnes_1 = theOnes; _i < theOnes_1.length; _i++) {
            var aOne = theOnes_1[_i];
            if (!(aOne
                && aOne.login
                && aOne.applicationKey)) {
                continue;
            }
            var aFoundInitial = null;
            for (var _a = 0, theOthers_1 = theOthers; _a < theOthers_1.length; _a++) {
                var aOther = theOthers_1[_a];
                if (!(aOther
                    && aOther.login
                    && aOther.applicationKey)) {
                    continue;
                }
                if (!(aOne.login === aOther.login)) {
                    continue;
                }
                if (aOther.applicationKey === aOne.applicationKey) {
                    aFoundInitial = aOther;
                    break;
                }
            }
            if (!aFoundInitial) {
                continue;
            }
            if (!(aFoundInitial.isActive === aOne.isActive)) {
                return false;
            }
            if (!ActivationsProvider_1.equalIdentityActivations_square(aOne.identityActivations, aFoundInitial.identityActivations)) {
                return false;
            }
        }
        return true;
    };
    ActivationsProvider.equalIdentityActivations = function (theOnes, theOthers) {
        if (!(theOnes && theOnes.length
            && theOthers && theOthers.length
            && (theOnes.length === theOthers.length))) {
            return false;
        }
        if ((theOnes.length * theOthers.length) > ActivationsProvider_1.MAXIDENTITYACTIVATIONSSQUARE) {
            return ActivationsProvider_1.equalIdentityActivations_indexing(theOnes, theOthers);
        }
        return ActivationsProvider_1.equalIdentityActivations_square(theOnes, theOthers);
    };
    ActivationsProvider.equalIdentityActivations_indexing = function (theOnes, theOthers) {
        return ActivationsProvider_1.equalIdentityActivations_square(theOnes, theOthers);
    };
    ActivationsProvider.equalIdentityActivations_square = function (theOnes, theOthers) {
        if (!(theOnes && theOnes.length
            && theOthers && theOthers.length
            && (theOnes.length === theOthers.length))) {
            return false;
        }
        for (var _i = 0, theOnes_2 = theOnes; _i < theOnes_2.length; _i++) {
            var aOne = theOnes_2[_i];
            if (!(aOne
                && aOne.identityKey)) {
                continue;
            }
            var aFoundInitial = null;
            for (var _a = 0, theOthers_2 = theOthers; _a < theOthers_2.length; _a++) {
                var aOther = theOthers_2[_a];
                if (!(aOther
                    && aOther.identityKey)) {
                    continue;
                }
                if (aOther.identityKey === aOne.identityKey) {
                    aFoundInitial = aOther;
                    break;
                }
            }
            if (!aFoundInitial) {
                continue;
            }
            if (!(aFoundInitial.isActive === aOne.isActive)) {
                return false;
            }
        }
        return true;
    };
    ActivationsProvider.STOREKEYSEPARATORTOREPLACE = /_-_/g;
    ActivationsProvider.STOREKEYSEPARATORTOREPLACEMENT = "=-=";
    ActivationsProvider.STOREKEYPREFIX = "ACTIVEAPPLICATIONIDENTITIES";
    ActivationsProvider.APPLICATION_ISACTIVE_INITIAL = false;
    ActivationsProvider.IDENTITY_ISACTIVE_INITIAL = false;
    ActivationsProvider.MAXAPPLICATIONACTIVATIONSSQUARE = 256;
    ActivationsProvider.MAXIDENTITYACTIVATIONSSQUARE = 256;
    ActivationsProvider = ActivationsProvider_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_2__logins_provider__["a" /* LoginsProvider */]])
    ], ActivationsProvider);
    return ActivationsProvider;
    var ActivationsProvider_1;
}());

//# sourceMappingURL=activations-provider.js.map

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
        this.conferenceDate = '2018-09-21';
        console.log("AboutPage constructor");
    }
    AboutPage.prototype.presentPopover = function (event) {
        var popover = this.popoverCtrl.create(__WEBPACK_IMPORTED_MODULE_2__about_popover_about_popover__["a" /* PopoverPage */]);
        popover.present({ ev: event });
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/about/about.html"*/'<!--\n* about.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n\n-->\n\n<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title i18n="@@p_about_bar_title">About workOflow</ion-title>\n        <ion-buttons end>\n            <button ion-button icon-only (click)="presentPopover($event)">\n                <ion-icon name="more"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    <div padding class="about-info">\n        <h4 i18n="@@p_about_presenting_h">workOflow presenting near you shortly</h4>\n        \n        <ion-list no-lines>\n            <ion-item>\n                <ion-icon name="calendar" item-start></ion-icon>\n                <ion-label i18n="@@p_about_presentation_date_l">Presentation date</ion-label>\n                <ion-datetime\n                    displayFormat="DDDD DD MMMM YYYY"\n                    pickerFormat="DDD DD MMM YY"\n                    max="2020" [(ngModel)]="presentationDate">\n                </ion-datetime>\n            </ion-item>\n            \n            <ion-item>\n                <ion-icon name="pin" item-start></ion-icon>\n                <ion-label i18n="@@p_about_presentation_location_l">Location</ion-label>\n                <ion-select>\n                    <ion-option value="valencia" selected>Valencia, ES</ion-option>\n                    <ion-option value="bonn">Bonn, DE</ion-option>\n                    <ion-option value="madrid" >Madrid, ES</ion-option>\n                    <ion-option value="birmingham">Birmingham, UK</ion-option>\n                    <ion-option value="miami">Miami, FL, US</ion-option>\n                    <ion-option value="newyork">New York City, NY, US</ion-option>\n                    <ion-option value="brest">Brest, FR</ion-option>\n                </ion-select>\n            </ion-item>\n        </ion-list>\n        \n        <h2 i18n="@@G_workOflow">workOflow</h2>\n        <p>Single-Page-Application and hybrid Android/iOS app with Ionic3/Angular6 over Flowable REST API/Spring Boot/Java in local ionic & cordova.</p>\n    \n        <h3 i18n="@@p_about_livedemo_h">Live demo</h3>\n        <p><a href="http://workOflow.org" target="_blank">http://workOflow.org</a>\n           &emsp; Often not available because of experimentation and trial restarts</p>\n        \n        <h3 i18n="@@p_about_sourcecode_h">Source code</h3>\n        <p>GitHub repository\n            <a href="https://github.com/carrascoMDD/workoflow-ui" target="_blank">https://github.com/carrascoMDD/workoflow-ui</a>\n        </p>\n        \n        <h3 i18n="@@p_about_author_h">Author</h3>\n        <p><span  i18n="@@p_about_author_created_s">Created</span>@author Antonio Carrasco Valero 201805252222</p>\n        <p>Antonio Carrasco Valero <a href="https://github.com/carrascoMDD" target="_blank">https://github.com/carrascoMDD/</a></p>\n        <p>LinkedIn <a href="https://www.linkedin.com/in/modeldrivendevelopment/" target="_blank">https://www.linkedin.com/in/modeldrivendevelopment/</a></p>\n        <p><span  i18n="@@p_about_author_resume_s">Resume</span><a href="http://carrascomdd.eurocv.eu/" target="_blank">http://carrascomdd.eurocv.eu/</a></p>\n    \n    \n    \n        <h3 i18n="@@p_about_license_h">License</h3>\n        <p i18n="@@p_about_license_l1">Licensed under the EUPL, Version 1.1 only (the "Licence");</p>\n    \n        <p i18n="@@p_about_license_l2">You may not use this work except in compliance with the Licence.\n        <p>\n            <span i18n="@@p_about_license_l3">You may obtain a copy of the Licence at:</span>\n            <a href="https://joinup.ec.europa.eu/software/page/eupl/licence-eupl" target="_blank">\n                https://joinup.ec.europa.eu/software/page/eupl/licence-eupl\n            </a>\n        </p>\n    \n        <p i18n="@@p_about_license_l4">\n            Unless required by applicable law or agreed to in\n            writing, software distributed under the Licence is\n            distributed on an "AS IS" basis,\n            WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\n            express or implied.\n        </p>\n    \n        <p i18n="@@p_about_license_l5">\n            See the Licence for the specific language governing\n            permissions and limitations under the Licence.\n        </p>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/about/about.html"*/
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
        console.log("PopoverPage constructor");
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
            template: "\n                      <ion-list>\n                          <button ion-item (click)=\"close('https://github.com/carrascoMDD/workoflow-ui')\">GitHub Repo</button>\n                          <button ion-item (click)=\"support()\">Support</button>\n                      </ion-list>\n                  "
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
            selector: 'flow-header',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flow-header/flow-header.html"*/'<!--\n* flow-header.html\n*\n* Created @author Antonio Carrasco Valero 201806012216\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<link rel="stylesheet" href="flow-header.scss">\n<ion-header class="page-flow-header">\n    <ion-navbar no-border-bottom>\n        \n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        \n        \n        <ion-segment *ngIf="flowpage" [(ngModel)]="flowpage.segment" (ionChange)="flowpage.updateContent()">\n            \n            <ion-title class="hide-smm">\n                <ion-icon item-start [name]="flowpage.flowboxIcon" color="bright" class="valignmiddle"></ion-icon>\n                <span class="hide-sm valignmiddle">{{flowpage.flowboxTitle}}</span>\n                <span class="hide-md valignmiddle">- workOflow</span>\n            </ion-title>\n            \n            \n            <ion-segment-button value="all">\n                <ion-icon item-start name="filing" class="valignmiddle"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;All</span>\n            </ion-segment-button>\n            \n            <ion-segment-button value="favorites" [disabled]="!flowpage.hasAnyFavoriteItem" >\n                <ion-icon item-start name="star" class="valignmiddle"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;Favorites</span>\n            </ion-segment-button>\n            \n            <ion-segment-button value="urgent" [disabled]="!flowpage.hasAnyUrgentItem" >\n                <ion-icon item-start name="warning" class="valignmiddle"\n                          [color]="flowpage.hasAnyUrgentItem ? \'danger\' : \'\'"></ion-icon>\n                <span class="hide-sms valignmiddle">&nbsp;Urgent</span>\n            </ion-segment-button>\n            \n        </ion-segment>\n        \n        \n        <ion-buttons end *ngIf="flowpage">\n            <button ion-button icon-only (click)="flowpage.presentFilter()">\n                <ion-icon ios="ios-options-outline" md="md-options"></ion-icon>\n            </button>\n        </ion-buttons>\n        \n    </ion-navbar>\n    \n    \n    \n    <ion-toolbar no-border-top *ngIf="flowpage">\n        <ion-searchbar color="primary"\n                       [(ngModel)]="flowpage.queryText"\n                       (ionInput)="flowpage.updateContent()"\n                       placeholder="Search">\n        </ion-searchbar>\n    </ion-toolbar>\n    \n</ion-header>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flow-header/flow-header.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], FlowHeader);
    return FlowHeader;
}());

//# sourceMappingURL=flow-header.js.map

/***/ }),

/***/ 221:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IdentitiesFilterPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__loggedin_loggedin__ = __webpack_require__(49);
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





var IdentitiesFilterPage = (function (_super) {
    __extends(IdentitiesFilterPage, _super);
    function IdentitiesFilterPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, navParams, viewCtrl, activationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        _this.navParams = navParams;
        _this.viewCtrl = viewCtrl;
        _this.activationsProvider = activationsProvider;
        console.log("IdentitiesFilterPage constructor");
        return _this;
    }
    /* **********************************************************************
    IdentitiesFilterPage can ALWAYS leave without further check or user confirmation.
    */
    IdentitiesFilterPage.prototype.ionViewCanLeave_ALWAYS = function () {
        return true;
    };
    // IdentitiesFilterPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    IdentitiesFilterPage.prototype.ionViewCanLeave_SOMETIMES = function () { return Promise.resolve(true); };
    // IdentitiesFilterPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    IdentitiesFilterPage.prototype.ionViewCanLeave_PromptExtraMessage = function () { return Promise.resolve(""); };
    IdentitiesFilterPage.prototype.ionViewDidEnter = function () {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateContent().then(function () { });
    };
    IdentitiesFilterPage.prototype.updateContent = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.activationsProvider.getApplicationActivations()
                .then(function (theApplicationActivations) {
                _this.applicationActivations_original = theApplicationActivations;
                _this.applicationActivations = _this.applicationActivations_original.map(function (theApplicationActivation) {
                    return theApplicationActivation.copyWithIdentityActivations();
                });
                pheResolve(_this.applicationActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    IdentitiesFilterPage.prototype.deactivateAll = function () {
        console.log("IdentitiesFilterPage deactivateAllIdentities");
        return this.setActiveAllIdentities(false);
    };
    IdentitiesFilterPage.prototype.activateAll = function () {
        console.log("IdentitiesFilterPage deactivateAllIdentities");
        return this.setActiveAllIdentities(true);
    };
    IdentitiesFilterPage.prototype.setActiveAllIdentities = function (theActive) {
        if (!this.applicationActivations) {
            return;
        }
        for (var _i = 0, _a = this.applicationActivations; _i < _a.length; _i++) {
            var anApplicationActivation = _a[_i];
            anApplicationActivation.setActive(theActive);
            for (var _b = 0, _c = anApplicationActivation.identityActivations; _b < _c.length; _b++) {
                var anIdentityActivation = _c[_b];
                anIdentityActivation.setActive(theActive);
            }
        }
        return this.commitActivations();
    };
    /* **********************************************************************
    The user has canceled the manipulation of application and identity activations.
    Close the modal.
    Do not submit any changes which may have been made to the isActive.
    */
    IdentitiesFilterPage.prototype.dismiss = function (data) {
        return this.viewCtrl.dismiss(data);
    };
    IdentitiesFilterPage.prototype.applyFilters = function () {
        var _this = this;
        if (!this.hasAnyActivationChanged()) {
            return Promise.resolve(this.applicationActivations);
        }
        return new Promise(function (pheResolve, pheReject) {
            _this.commitActivations()
                .then(function (theApplicationActivations) {
                if (theApplicationActivations) { }
                return _this.dismiss(_this.applicationActivations);
            }, function (theError) {
                throw theError;
            })
                .then(function () {
                pheResolve(_this.applicationActivations);
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    IdentitiesFilterPage.prototype.hasAnyActivationChanged = function () {
        if (!(this.applicationActivations
            && this.applicationActivations_original)) {
            return false;
        }
        return __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */].equalApplicationActivations(this.applicationActivations_original, this.applicationActivations);
    };
    IdentitiesFilterPage.prototype.commitActivations = function () {
        if (!this.applicationActivations) {
            return;
        }
        return this.activationsProvider.commitActivations(this.applicationActivations);
    };
    IdentitiesFilterPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-identities-filter',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/identities-filter/identities-filter.html"*/'<!--\n* identities-filter.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-toolbar>\n        <ion-buttons start>\n            <button ion-button (click)="dismiss()">Cancel</button>\n        </ion-buttons>\n        <ion-title>\n            Application Identities\n        </ion-title>\n        <ion-buttons end>\n            <button ion-button (click)="applyFilters()" strong>Done</button>\n        </ion-buttons>\n    </ion-toolbar>\n</ion-header>\n\n<ion-content class="outer-content">\n    \n    <ion-list>\n        <ion-list-header>Activate / Deactivate</ion-list-header>\n        <ion-row>\n            <ion-col col-6>\n                <div text-center>\n                    <button ion-button round color="danger" (click)="deactivateAll()">None</button>\n                </div>\n            </ion-col>\n            <ion-col col-6>\n                <div text-center>\n                    <button ion-button round color="secondary" (click)="activateAll()">All</button>\n                </div>\n            </ion-col>\n        </ion-row>\n        \n        <ion-item-group *ngFor="let applicationActivation of applicationActivations" >\n            \n            <ion-item-divider sticky>\n                <ion-label>{{applicationActivation.applicationKey}}</ion-label>\n                <ion-toggle [(ngModel)]="applicationActivation.isActive"\n                            color="secondary"></ion-toggle>\n            </ion-item-divider>\n    \n            <ion-item *ngFor="let identityActivation of applicationActivation.identityActivations">\n                <span item-start class="dot"></span>\n                <ion-label>{{identityActivation.applicationKey}} {{identityActivation.identityKey}}</ion-label>\n                <ion-toggle [(ngModel)]="identityActivation.isActive"\n                            color="secondary"></ion-toggle>\n            </ion-item>\n            \n        </ion-item-group>\n    \n    </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/identities-filter/identities-filter.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["r" /* ViewController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], IdentitiesFilterPage);
    return IdentitiesFilterPage;
}(__WEBPACK_IMPORTED_MODULE_4__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=identitites-filter.js.map

/***/ }),

/***/ 222:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplateDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_templates_provider__ = __webpack_require__(119);
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
            selector: 'page-template-detail',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/template-detail/template-detail.html"*/'<!--\n* template-detail.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n\n\n<ion-header>\n  <ion-navbar>\n    <ion-title *ngIf="template">{{template.name}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div *ngIf="template">\n    <h1>{{template.name}}</h1>\n    <h4 >{{template.key}}</h4>\n    <p>{{template.description}}</p>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/template-detail/template-detail.html"*/
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TemplatesFilter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_applications_provider__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__active_filter__ = __webpack_require__(319);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_templates_provider__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_activations_provider__ = __webpack_require__(20);
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
    function TemplatesFilter(theLoggedinProvider, theApplicationsProvider, theActivationsProvider, templatesProvider) {
        var _this = _super.call(this, theLoggedinProvider, theApplicationsProvider, theActivationsProvider) || this;
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
                    console.log("TemplatesFilter about to  this.activationsProvider.getIdentityActivations().then(");
                    _this.activationsProvider.retrieveApplicationActivations(null, null).then(function (theApplicationActivations) {
                        console.log("TemplatesFilter getTemplatespecs received this.activationsProvider.getIdentityActivations().then( theApplicationActivations.length=" + (!theApplicationActivations ? 0 : theApplicationActivations.length));
                        if (!theApplicationActivations || !theApplicationActivations.length) {
                            console.log("TemplatesFilter no or empty theApplicationActivations from this.activationsProvider.getIdentityActivations().then(");
                            theObserver.next(null);
                            theObserver.complete();
                            return;
                        }
                        console.log("TemplatesFilter about to  actually filter templatespecs against initiable or participed processSpecKeys of active identities in applications (according to selectors and loginApplications)");
                        var someAcceptableProcessSpecs = _this.acceptableProcessSpecs(theApplicationActivations);
                        if (!someAcceptableProcessSpecs) {
                            console.log("TemplatesFilter no or empty this.acceptableProcessSpecs(");
                            theObserver.next(null);
                            theObserver.complete();
                            return;
                        }
                        var someAcceptableProcessKeys = someAcceptableProcessSpecs.map(function (theProcessSpec) { return theProcessSpec.key; });
                        var someFilteredTemplatespecs = [];
                        for (var _i = 0, theTemplatespecs_1 = theTemplatespecs; _i < theTemplatespecs_1.length; _i++) {
                            var aTemplatespec = theTemplatespecs_1[_i];
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_2__providers_applications_provider__["a" /* ApplicationsProvider */],
            __WEBPACK_IMPORTED_MODULE_8__providers_activations_provider__["a" /* ActivationsProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_templates_provider__["a" /* TemplatesProvider */]])
    ], TemplatesFilter);
    return TemplatesFilter;
}(__WEBPACK_IMPORTED_MODULE_3__active_filter__["a" /* ActiveFilter */]));

//# sourceMappingURL=templates-filter.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_authentication__ = __webpack_require__(320);
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

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginSelector; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_logins_provider__ = __webpack_require__(48);
/*
 * login-selector.ts
 *
 * Created @author Antonio Carrasco Valero 201806021846
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




var LoginSelector = (function () {
    function LoginSelector(navCtrl, alertCtrl, loginsProvider) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loginsProvider = loginsProvider;
        console.log("LoginSelector constructor");
    }
    LoginSelector.prototype.setLoginPage = function (theLoginPage) {
        this.loginPage = theLoginPage;
    };
    LoginSelector.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.loginsProvider.getAllLogins().subscribe(function (theLogins) {
            _this.logins = theLogins;
        }, function (theError) {
            console.log("LoginSelector ionViewDidLoad loginsProvider.getAllLogins ERROR: " + theError);
        });
    };
    LoginSelector.prototype.loginSelected = function () {
        if (!this.selectedLogin) {
            return Promise.resolve(null);
        }
        return this.loginPage.loginSelected(this.selectedLogin);
    };
    LoginSelector = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'login-selector',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/login-selector/login-selector.html"*/'<!--\n* login-selector.html\n*\n* Created @author Antonio Carrasco Valero 201806021848\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n\n<ion-item>\n    <ion-icon name="person" item-start></ion-icon>\n    <ion-label>Courtesy demo logins</ion-label>\n    <ion-select name="login_select" [(ngModel)]="selectedLogin" (ionChange)="loginSelected()">\n        <ion-option *ngFor="let aLogin of logins" [value]="aLogin">{{ aLogin.login}}</ion-option>\n    </ion-select>\n</ion-item>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/login-selector/login-selector.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_logins_provider__["a" /* LoginsProvider */]])
    ], LoginSelector);
    return LoginSelector;
}());

//# sourceMappingURL=login-selector.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TutorialPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__storage_storage_provider__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__login_login__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__flow_flowtabs_page_flowtabs_page__ = __webpack_require__(60);
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
    function TutorialPage(navCtrl, menu, storageProvider, loggedinProvider) {
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.storageProvider = storageProvider;
        this.loggedinProvider = loggedinProvider;
        // Assist the template to determine whether at the end of the slides or not
        this.showSkip = true;
        console.log("TutorialPage constructor");
    }
    /* **********************************************************************
    Inform the slider that the child slides have changed (as when opening this page)
    */
    TutorialPage.prototype.ionViewWillEnter = function () {
        this.slides.update();
    };
    /* **********************************************************************
    Persist in some storage local to the user's browser and device
        the fact that the user has already visited the tutorial.

    If the user is logged in
        then visit the first of the flowTabs pages
        else visit the login page
    */
    TutorialPage.prototype.tutorialCompleted = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.storageProvider.persist_HAS_SEEN_TUTORIAL(true)
                .then(function () {
                return _this.loggedinProvider.hasLoggedIn();
            }, function (theError) {
                console.log("TutorialPage tutorialCompleted this.persist_HAS_SEEN_TUTORIAL error=" + theError);
                throw theError;
            })
                .then(function (theHasLoggedIn) {
                if (theHasLoggedIn) {
                    console.log("TutorialPage tutorialCompleted this.loggedinProvider.hasLoggedIn() true setting FlowTabsPage as root");
                    return _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], { tabIndex: 0 });
                }
                else {
                    console.log("TutorialPage tutorialCompleted this.loggedinProvider.hasLoggedIn() false setting LoginPage as root");
                    return _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__login_login__["a" /* LoginPage */]);
                }
            }, function (theError) {
                throw theError;
            })
                .then(function () {
                pheResolve();
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    /* **********************************************************************
    Assist the template to determine whether at the end of the slides or not
    */
    TutorialPage.prototype.onSlideChangeStart = function (slider) {
        this.showSkip = !slider.isEnd();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('slides'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* Slides */])
    ], TutorialPage.prototype, "slides", void 0);
    TutorialPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tutorial',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/tutorial/tutorial.html"*/'<!--\n* tutorial.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header no-border>\n    <ion-navbar>\n        <ion-buttons end *ngIf="showSkip">\n            <button ion-button (click)="tutorialCompleted()" color="primary">Skip</button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content no-bounce>\n    <ion-slides #slides (ionSlideWillChange)="onSlideChangeStart($event)" pager>\n        \n        <ion-slide>\n            \n            <div class="logo">\n                <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n            </div>\n            \n            <h2 class="slide-title">Ready to Play?</h2>\n            \n            <button ion-button icon-end large clear (click)="tutorialCompleted()">\n                Continue\n                <ion-icon name="arrow-forward"></ion-icon>\n            </button>\n        </ion-slide>\n    \n    </ion-slides>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/tutorial/tutorial.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_2__storage_storage_provider__["a" /* StorageProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], TutorialPage);
    return TutorialPage;
}());

//# sourceMappingURL=tutorial.js.map

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StorageProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_storage__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__storage_keys__ = __webpack_require__(322);
/*
 * storage-provider.ts
 *
 * Created @author Antonio Carrasco Valero 201806031531
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



var StorageProvider = (function () {
    function StorageProvider(storage) {
        this.storage = storage;
        console.log("StorageProvider constructor");
    }
    StorageProvider.prototype.retrieve_HAS_SEEN_TUTORIAL = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.retrieve_generic(__WEBPACK_IMPORTED_MODULE_2__storage_keys__["a" /* StorageKeys */].STORAGEKEY_HAS_SEEN_TUTORIAL)
                .then(function (theResult) {
                var aResult = true === theResult;
                if (aResult) { } /*CQT*/
                return Promise.resolve(aResult);
            }, function (theError) {
                console.log("Error in StorageProvider retrieve_HAS_SEEN_TUTORIAL this.storage.get( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL)" + theError);
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                pheResolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                pheReject(theError);
            });
        });
    };
    StorageProvider.prototype.persist_HAS_SEEN_TUTORIAL = function (theValue) {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.persist_generic(__WEBPACK_IMPORTED_MODULE_2__storage_keys__["a" /* StorageKeys */].STORAGEKEY_HAS_SEEN_TUTORIAL, theValue)
                .then(function (theResult) {
                var aResult = true === theResult;
                if (aResult) { } /*CQT*/
                return Promise.resolve(aResult);
            }, function (theError) {
                console.log("Error in StorageProvider retrieve_HAS_SEEN_TUTORIAL this.storage.get( StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL)" + theError);
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                pheResolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider retrieve_HASLOGGEDIN " + theError);
                pheReject(theError);
            });
        });
    };
    StorageProvider.prototype.retrieve_AUTO_AUTHENTICATE_LOGIN = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.retrieve_generic(__WEBPACK_IMPORTED_MODULE_2__storage_keys__["a" /* StorageKeys */].STORAGEKEY_AUTO_AUTHENTICATE_LOGIN)
                .then(function (theResult) {
                var aResult = true === theResult;
                if (aResult) { } /*CQT*/
                return Promise.resolve(aResult);
            }, function (theError) {
                console.log("Error in StorageProvider retrieve_AUTO_AUTHENTICATE_LOGIN this.storage.get( StorageKeys.STORAGEKEY_AUTO_AUTHENTICATE_LOGIN)" + theError);
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                pheResolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider retrieve_AUTO_AUTHENTICATE_LOGIN " + theError);
                pheReject(theError);
            });
        });
    };
    StorageProvider.prototype.retrieve_generic = function (theKey) {
        var _this = this;
        if (!theKey) {
            var anErrorMsg = "Missing parameter theKey in StorageProvider retrieve_generic";
            console.log(anErrorMsg);
            throw anErrorMsg;
        }
        return new Promise(function (pheResolve, pheReject) {
            _this.storage.get(theKey)
                .then(function (theHasSeenTutorial) {
                return Promise.resolve(theHasSeenTutorial);
            }, function (theError) {
                try {
                    console.log("Error in StorageProvider retrieve_generic this.storage.get( theKey='" + theKey + "' )" + theError);
                }
                catch (anException) {
                }
                throw (theError);
            })
                .then(function (theValue) {
                try {
                    console.log("StorageProvider retrieve_generic retrieved value=" + JSON.stringify(theValue));
                }
                catch (anException) {
                }
                return Promise.resolve(theValue);
            }, function (theError) {
                // console.log( "Error in StorageProvider retrieve_generic " + theError);
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                pheResolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider retrieve_generic " + theError);
                pheReject(theError);
            });
        });
    };
    StorageProvider.prototype.persist_generic = function (theKey, theValue) {
        var _this = this;
        if (!theKey) {
            var anErrorMsg = "Missing parameter theKey in StorageProvider persist_generic";
            console.log(anErrorMsg);
            throw anErrorMsg;
        }
        if (typeof theValue === "undefined") {
            var anErrorMsg = "Missing parameter theValue in StorageProvider persist_generic";
            console.log(anErrorMsg);
            throw anErrorMsg;
        }
        try {
            console.log("StorageProvider persist_generic theKey='" + theKey + "'  value=" + JSON.stringify(theValue));
        }
        catch (anException) {
        }
        return new Promise(function (pheResolve, pheReject) {
            _this.storage.set(theKey, theValue)
                .then(function (theHasSeenTutorial) {
                return Promise.resolve(theHasSeenTutorial);
            }, function (theError) {
                try {
                    console.log("Error in StorageProvider persist_generic this.storage.set()" + theError);
                }
                catch (anException) {
                }
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                return Promise.resolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider persist_generic " + theError);
                throw (theError);
            })
                .then(function (theHasSeenTutorial) {
                pheResolve(theHasSeenTutorial);
            }, function (theError) {
                // console.log( "Error in StorageProvider persist_generic " + theError);
                pheReject(theError);
            });
        });
    };
    StorageProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_storage__["b" /* Storage */]])
    ], StorageProvider);
    return StorageProvider;
}());

//# sourceMappingURL=storage-provider.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SupportPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__ = __webpack_require__(49);
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




var SupportPage = (function (_super) {
    __extends(SupportPage, _super);
    function SupportPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        console.log("SupportPage constructor");
        return _this;
    }
    SupportPage_1 = SupportPage;
    /* **********************************************************************
    Because this FlowBoxPage specialises LoggedinPage this page it is guaranteed by LoggedInPage
    to insure that the user is logged in before proceeding visiting this page
    thanks to the superclass implementation of
    ionViewCanEnter() : Promise<any> {
        return this.beLoggedinOrGoToLoginPage();
    }
    */
    /* **********************************************************************
    Inform the user:
    If the application is not in production, and no test is intended on the support request system
        then no support requests should be sent.
    TODO ACV OJO 201806032001 Dynamically determine whether support request shall be sent, to be driven by some switch DEV/TEST/QA/PREPROD/PROD
    */
    SupportPage.prototype.ionViewDidEnter = function () {
        if (SupportPage_1.SUPPORTREQUEST_MAYSEND) {
            return;
        }
        // Fire and forget: do not wait for the toast to show or close
        this.show_toast(SupportPage_1.SUPPORTREQUEST_MAYSEND_NO_TOAST_MESSAGE, SupportPage_1.SUPPORTREQUEST_TOAST_MILLIS) /*CQT*/.then(function () { });
    };
    /* **********************************************************************
    Handle user's form submission with different policy depending upon whether support request must be actually sent.
    */
    SupportPage.prototype.submit = function (theForm) {
        if (SupportPage_1.SUPPORTREQUEST_MAYSEND) {
            return this.sendSupportRequest_MAYSEND_YES(theForm);
        }
        return this.sendSupportRequest_MAYSEND_NO(theForm);
    };
    /* **********************************************************************
    Check that the information supplied by the user is correct.
    If the information is not correct
        then inform the user and stay in the page for the user to keep editing the support request.
    If the information is correct:
        -- DO NOT ! Submit a support request  the message entered.
        Clean user input text
        Show a toast informing the user that the support request has been sent.
    */
    SupportPage.prototype.sendSupportRequest_MAYSEND_NO = function (theForm) {
        if (!theForm.valid) {
            return Promise.reject(SupportPage_1.SUPPORTREQUEST_INVALIDFORM_MESSAGE);
        }
        // Clean up the message entered by the user such that method ionViewCanLeave below shall not complain
        // when invoked before abandoning the page by ionic/angular machinery b
        this.supportMessage = "";
        return this.show_toast(SupportPage_1.SUPPORTREQUEST_TOAST_SENT_MESSAGE, SupportPage_1.SUPPORTREQUEST_TOAST_MILLIS);
    };
    /* **********************************************************************
    Check that the information supplied by the user is correct.
    If the information is not correct
        then inform the user and stay in the page for the user to keep editing the support request.
    If the information is correct:
        Submit a support request  the message entered.
        Show a toast informing the user that the support request has been sent.

    TODO ACV 201806032133 Implement sending the support request. For now just delegate to the case MAYSEND_NO
    */
    SupportPage.prototype.sendSupportRequest_MAYSEND_YES = function (theForm) {
        return this.sendSupportRequest_MAYSEND_NO(theForm);
    };
    /* **********************************************************************
    Avoid that the user looses the edited contents by inadvertently navigating out of the page without submitting the form,
        by detecting that there is some content in the form
            Note that submit handlers sendSupportRequest_xx above clean the form field model property.
    If there is some content in the form
        then show an alert which shall prompt the user with two action buttons for the user to choose from and continue:
            to NOT allow to abandon the page and keep editing, allowing the user to actually submit (or clear the contents)
            to allow to ABANDON the page

    Method invoked by the ionic/angular navigation machinery before abandoning the page to navigate to other one
        (may not be invoked when the user closes the browser or the native/hybrid app).

    Methods below are concrete implementation of smallish responsabilites for this page to fill for the superclass (CommonPage) implementation
    */
    /* **********************************************************************
    Some pages can ALWAYS leave without further check or user confirmation.
       i.e. purely "read-only" pages
    */
    SupportPage.prototype.ionViewCanLeave_ALWAYS = function () {
        return false;
    };
    /* **********************************************************************
   Some pages may need to check for "dirty" contents or forms, to decide whether or to leave the page without user confirmation
   i.e. pages with forms with input fields, i.e.:
   SupportPage with some content in the request text field,
   Task detail pages which are open for editing and changes made), ...
   */
    SupportPage.prototype.ionViewCanLeave_SOMETIMES = function () {
        if (this.supportMessage.trim()) {
            return Promise.reject(false);
        }
        return Promise.resolve(true);
    };
    /* **********************************************************************
    Asynchronously retrieve an extra message to append to the question when prompting the user to confirm leaving the page (in a dialog) .
        i.e. it may reflect some differences with some asynchronous resource
    */
    SupportPage.prototype.ionViewCanLeave_PromptExtraMessage = function () {
        return Promise.resolve(SupportPage_1.SUPPORTREQUEST_SHALLNOTBESUBMITTED_MESSAGE);
    };
    // TODO ACV "01806032126 Set to true when the mechanism to send support request is actually implemented. See TODO below
    SupportPage.SUPPORTREQUEST_MAYSEND = false;
    /*i18n*/ SupportPage.SUPPORTREQUEST_MAYSEND_NO_TOAST_MESSAGE = "This does not actually send a support request.";
    /*i18n*/ SupportPage.SUPPORTREQUEST_TOAST_SENT_MESSAGE = "Your support request has been sent.";
    /*i18n*/ SupportPage.SUPPORTREQUEST_INVALIDFORM_MESSAGE = "Invalid form data. Please review your input";
    SupportPage.SUPPORTREQUEST_TOAST_MILLIS = 3000;
    /*i18n*/ SupportPage.SUPPORTREQUEST_SHALLNOTBESUBMITTED_MESSAGE = "Your support message will not be submitted.";
    SupportPage = SupportPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-support',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/support/support.html"*/'<!--\n* support.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n		<ion-title>Support from workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    \n    <form #submitForm="ngForm" novalidate (ngSubmit)="submit(submitForm)">\n		<ion-list no-lines>\n			<ion-item>\n				<ion-label stacked color="primary">Enter your support message below</ion-label>\n				<ion-textarea\n                    [(ngModel)]="supportMessage"\n                    name="supportQuestion" #supportQuestion="ngModel"\n                    rows="6"\n                    required>\n                </ion-textarea>\n			</ion-item>\n		</ion-list>\n\n		<p ion-text [hidden]="!( supportMessage && supportQuestion.valid)" color="danger" padding-left>\n			Support message is required\n		</p>\n\n		<div padding>\n			<button ion-button block type="submit">Submit</button>\n		</div>\n	</form>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/support/support.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], SupportPage);
    return SupportPage;
    var SupportPage_1;
}(__WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=support.js.map

/***/ }),

/***/ 229:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LogoutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__ = __webpack_require__(49);
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
    function LogoutPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        console.log("LogoutPage constructor");
        return _this;
    }
    LogoutPage.prototype.ionViewDidLoad = function () {
        console.log("LogoutPage ionViewDidLoad");
        this.app.setTitle('Logout');
    };
    /* **********************************************************************
    LogoutPage can ALWAYS leave without further check or user confirmation.
    */
    LogoutPage.prototype.ionViewCanLeave_ALWAYS = function () {
        return true;
    };
    // LogoutPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    LogoutPage.prototype.ionViewCanLeave_SOMETIMES = function () { return Promise.resolve(true); };
    // LogoutPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    LogoutPage.prototype.ionViewCanLeave_PromptExtraMessage = function () { return Promise.resolve(""); };
    LogoutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-logout',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/logout/logout.html"*/'<!--\n* logout.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-navbar no-border-bottom>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Log out</ion-title>\n    \n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    \n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    \n    <form novalidate (ngSubmit)="logout()">\n        <ion-row responsive-sm>\n            <ion-col width-50>\n                <div text-center>\n                    <div padding>\n                        <button ion-button round color="danger" type="submit">\n                            <ion-icon name="exit"></ion-icon>\n                            &emsp; Logout\n                        </button>\n                    </div>\n                </div>\n            </ion-col>\n        </ion-row>\n    </form>\n    \n    \n    <ion-fab bottom right #fab>\n        <button ion-fab>\n            <ion-icon name="share"></ion-icon>\n        </button>\n        <ion-fab-list side="top">\n            <button ion-fab color="vimeo" (click)="openSocial(\'Vimeo\', fab)">\n                <ion-icon name="logo-vimeo"></ion-icon>\n            </button>\n            <button ion-fab color="google" (click)="openSocial(\'Google+\', fab)">\n                <ion-icon name="logo-googleplus"></ion-icon>\n            </button>\n            <button ion-fab color="twitter" (click)="openSocial(\'Twitter\', fab)">\n                <ion-icon name="logo-twitter"></ion-icon>\n            </button>\n            <button ion-fab color="facebook" (click)="openSocial(\'Facebook\', fab)">\n                <ion-icon name="logo-facebook"></ion-icon>\n            </button>\n        </ion-fab-list>\n    </ion-fab>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/logout/logout.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], LogoutPage);
    return LogoutPage;
}(__WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=logout.js.map

/***/ }),

/***/ 230:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__loggedin_loggedin__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__ = __webpack_require__(10);
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
    function AccountPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        console.log("TemplatesPage constructor");
        return _this;
    }
    /* **********************************************************************
    AccountPage can ALWAYS leave without further check or user confirmation.
    The change user name operation is exposed through a modal dialog
    and while editing it the user is prevented from leaving the page or any other user interaction
    other than closing the dismissing the dialog or short of closing the whole browser or tab or app, or shutdown the session, computer or devide.
    */
    AccountPage.prototype.ionViewCanLeave_ALWAYS = function () {
        return true;
    };
    // AccountPage does not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    AccountPage.prototype.ionViewCanLeave_SOMETIMES = function () { return Promise.resolve(true); };
    // AccountPage does not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    AccountPage.prototype.ionViewCanLeave_PromptExtraMessage = function () { return Promise.resolve(""); };
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
            selector: 'page-account',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/account/account.html"*/'<!--\n* account.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>Account - workOflow</ion-title>\n    \n        <ion-buttons end>\n            <button ion-button icon-only (click)="presentFilter()">\n                <ion-icon ios="ios-options-outline" md="md-options"></ion-icon>\n            </button>\n        </ion-buttons>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="outer-content">\n    \n    <div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n    </div>\n    \n    <div padding-top text-center *ngIf="authenticatedLogin">\n        <img src="http://www.gravatar.com/avatar?d=mm&s=140" alt="avatar">\n        \n        \n        <h2>{{authenticatedLogin.login}}</h2>\n        <h3>{{authenticatedLogin.name}} {{authenticatedLogin.familyName}}</h3>\n        \n        <ion-list inset>\n            <button ion-item (click)="updatePicture()">Update Picture</button>\n            <button ion-item (click)="changeUsername()">Change Username</button>\n            <button ion-item (click)="changePassword()">Change Password</button>\n            <button ion-item (click)="support()">Support</button>\n            <button ion-item (click)="logout()">Logout</button>\n        </ion-list>\n    </div>\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/account/account.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_3__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], AccountPage);
    return AccountPage;
}(__WEBPACK_IMPORTED_MODULE_2__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 231:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(253);
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

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__ = __webpack_require__(300);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_component__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_about_about__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__ = __webpack_require__(219);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_login_selector_login_selector__ = __webpack_require__(225);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_login_login__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_flow_logout_logout__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_signup_signup__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_tutorial_tutorial__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_flow_support_support__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_flow_identities_filter_identitites_filter__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_flow_inbox_inbox__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_flow_drafts_drafts__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_flow_archived_archived__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_flow_bounced_bounced__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_flow_templates_templates__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_flow_template_detail_template_detail__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__pages_flow_outbox_outbox__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_authentication_provider__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__providers_logins_provider__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_applications_provider__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__providers_templates_provider__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__filters_templates_filter__ = __webpack_require__(223);
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
                __WEBPACK_IMPORTED_MODULE_12__pages_login_selector_login_selector__["a" /* LoginSelector */],
                __WEBPACK_IMPORTED_MODULE_13__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_tutorial_tutorial__["a" /* TutorialPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_flow_support_support__["a" /* SupportPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_flow_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_flow_identities_filter_identitites_filter__["a" /* IdentitiesFilterPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__["a" /* FlowHeader */],
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
                __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_8__app_component__["a" /* WorkOFlowApp */], {}, {
                    links: [
                        { component: __WEBPACK_IMPORTED_MODULE_9__pages_about_about__["a" /* AboutPage */], name: 'AboutPage', segment: 'about' },
                        { component: __WEBPACK_IMPORTED_MODULE_16__pages_tutorial_tutorial__["a" /* TutorialPage */], name: 'Tutorial', segment: 'tutorial' },
                        { component: __WEBPACK_IMPORTED_MODULE_17__pages_flow_support_support__["a" /* SupportPage */], name: 'SupportPage', segment: 'support' },
                        { component: __WEBPACK_IMPORTED_MODULE_13__pages_login_login__["a" /* LoginPage */], name: 'LoginPage', segment: 'login' },
                        { component: __WEBPACK_IMPORTED_MODULE_11__pages_flow_account_account__["a" /* AccountPage */], name: 'AccountPage', segment: 'account' },
                        { component: __WEBPACK_IMPORTED_MODULE_15__pages_signup_signup__["a" /* SignupPage */], name: 'SignupPage', segment: 'signup' },
                        { component: __WEBPACK_IMPORTED_MODULE_14__pages_flow_logout_logout__["a" /* LogoutPage */], name: 'LogoutPage', segment: 'logout' },
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
                __WEBPACK_IMPORTED_MODULE_13__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_about_popover_about_popover__["a" /* PopoverPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_signup_signup__["a" /* SignupPage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_tutorial_tutorial__["a" /* TutorialPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_flow_support_support__["a" /* SupportPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_login_selector_login_selector__["a" /* LoginSelector */],
                __WEBPACK_IMPORTED_MODULE_20__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_flow_logout_logout__["a" /* LogoutPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_flow_flow_header_flow_header__["a" /* FlowHeader */],
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
                // { provide: LOCALE_ID, useValue: 'en' },
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_6__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_29__providers_loggedin_provider__["a" /* LoggedinProvider */],
                __WEBPACK_IMPORTED_MODULE_30__providers_logins_provider__["a" /* LoginsProvider */],
                __WEBPACK_IMPORTED_MODULE_28__providers_authentication_provider__["a" /* AuthenticationProvider */],
                __WEBPACK_IMPORTED_MODULE_31__providers_applications_provider__["a" /* ApplicationsProvider */],
                __WEBPACK_IMPORTED_MODULE_32__providers_templates_provider__["a" /* TemplatesProvider */],
                __WEBPACK_IMPORTED_MODULE_33__filters_templates_filter__["a" /* TemplatesFilter */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 312:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WorkOFlowApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__ = __webpack_require__(217);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_about_about__ = __webpack_require__(218);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_signup_signup__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_tutorial_tutorial__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_flow_support_support__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_flow_logout_logout__ = __webpack_require__(229);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_flow_account_account__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_flow_inbox_inbox__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_flow_drafts_drafts__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_flow_archived_archived__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_flow_bounced_bounced__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_flow_templates_templates__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_flow_outbox_outbox__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__storage_storage_provider__ = __webpack_require__(227);
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
    /* **********************************************************************
    Create the root application instance.
    Delegate to initialise its members and perform any required setup and checks.
    Show/hide menu according to the user logged in status.
    Present the appropriate page as the first the user shall see.
    */
    function WorkOFlowApp(events, loggedinProvider, menu, platform, storageProvider, splashScreen) {
        this.events = events;
        this.loggedinProvider = loggedinProvider;
        this.menu = menu;
        this.platform = platform;
        this.storageProvider = storageProvider;
        this.splashScreen = splashScreen;
        /* **********************************************************************
        Groups of Pages rendered as sectopms in the menu items
            each menu item triggering upon user click the visit to the corresponding page
        flowPages items are always rendered, shall display in the menu as disabled when the user is not logged in
        loggedInPages, loggedOutPages items are only rendered on the corresponding user logged status
        alwaysPages items are always rendered
        An item linking to an additional TutorialPage is always shown at the bottom of the menu whether the user is logged in or not
        */
        this.flowPages = [
            { title: 'Inbox', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_11__pages_flow_inbox_inbox__["a" /* InboxPage */], index: 0, icon: 'mail' },
            { title: 'Drafts', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_12__pages_flow_drafts_drafts__["a" /* DraftsPage */], index: 1, icon: 'mail-open' },
            { title: 'Archived', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_13__pages_flow_archived_archived__["a" /* ArchivedPage */], index: 2, icon: 'done-all' },
            { title: 'Bounced', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_14__pages_flow_bounced_bounced__["a" /* BouncedPage */], index: 3, icon: 'undo' },
            { title: 'Templates', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_15__pages_flow_templates_templates__["a" /* TemplatesPage */], index: 4, icon: 'create' },
            { title: 'Outbox', name: 'FlowTabsPage', component: __WEBPACK_IMPORTED_MODULE_10__pages_flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */], tabComponent: __WEBPACK_IMPORTED_MODULE_16__pages_flow_outbox_outbox__["a" /* OutboxPage */], index: 5, icon: 'send' }
        ];
        this.loggedInPages = [
            { title: 'Account', name: 'AccountPage', component: __WEBPACK_IMPORTED_MODULE_9__pages_flow_account_account__["a" /* AccountPage */], icon: 'person' },
            { title: 'Support', name: 'SupportPage', component: __WEBPACK_IMPORTED_MODULE_7__pages_flow_support_support__["a" /* SupportPage */], icon: 'help' },
            { title: 'Logout', name: 'LogoutPage', component: __WEBPACK_IMPORTED_MODULE_8__pages_flow_logout_logout__["a" /* LogoutPage */], icon: 'log-out' }
        ];
        this.loggedOutPages = [
            { title: 'Login', name: 'LoginPage', component: __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */], icon: 'log-in' },
            { title: 'Signup', name: 'SignupPage', component: __WEBPACK_IMPORTED_MODULE_5__pages_signup_signup__["a" /* SignupPage */], icon: 'person-add' }
        ];
        this.alwaysPages = [
            { title: 'About', name: 'AboutPage', component: __WEBPACK_IMPORTED_MODULE_3__pages_about_about__["a" /* AboutPage */], icon: 'information-circle' }
        ];
        // The result of the constructor is the new instance of WorkOFlowApp, so no promise or result returned.
        this.initWorkOFlowApplication() /*CQT*/.then(function () { }, function (theError) { throw theError; });
    }
    WorkOFlowApp_1 = WorkOFlowApp;
    /* **********************************************************************
    Create the root application instance,
    initialise its members and perform any required setup and checks,
    present the appropriate page as the first the user shall see.
    ***************************
    SHOW TUTORIAL OR LOGIN PAGE
    If the user had already seen the Tutorial,
        as posibly reflected in the local storage of the specific device/computer and browser being used
    then
        show the LoginPage
    else (no record exists in local storage of the user having already seen the Tutorial)
        show the TutorialPage
    ***************************
    WAIT FOR PLATFORM TO BE READY, AND KEEP THE PLATFORM INFO
    ***************************
    DISABLE MENU
    ***************************
    SUBSCRIBE TO EVENTS WHICH WOULD CHANGE THE MENU ENABLEMENT
    */
    WorkOFlowApp.prototype.initWorkOFlowApplication = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.storageProvider.retrieve_HAS_SEEN_TUTORIAL()
                .then(function (theHasSeenTutorial) {
                // Keep the resolution value from storage retrieve has seen tutorial promise, just in case it comes handy later
                _this.hasSeenTutorial = theHasSeenTutorial;
                /* **********************************************************************
                rootPage is the variable in the interpolation of the root nav in the app.template.html
                  <!-- main navigation -->
                  <ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>
               */
                if (theHasSeenTutorial) {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */]; // FlowTabsPage TabsPage
                }
                else {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_6__pages_tutorial_tutorial__["a" /* TutorialPage */];
                }
                return _this.platformReady();
            }, function (theError) {
                throw theError;
            })
                .then(function (theReadySource) {
                // Keep the resolution value from platform.ready() promise, just in case it comes handy later
                _this.readySource = theReadySource;
                // Initially disable menu until the user is logged in
                // which shall happen from LoginPage, whether by manual input by the user
                // or some automated mechanism for login in demo or test automation
                _this.enableMenu(false);
                // Shall enable or disable menu when events happen (shall be disabled until sucessful login).
                _this.listenToLoginEvents();
                return Promise.resolve(theReadySource);
            }, function (theError) {
                throw theError;
            })
                .then(function (theReadySource) {
                pheResolve(theReadySource);
            }, function (theError) {
                console.log("Error in WorkOFlowApp initWorkOFlowApplication " + theError);
                pheReject(theError);
            });
        });
    };
    /* **********************************************************************
    When the platform is ready:
        Hide splash screen
        ... more ?
    Returns a promise which shall be resolved with the platform ready source
    */
    WorkOFlowApp.prototype.platformReady = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            // Call any initial plugins when ready
            _this.platform.ready()
                .then(function (theReadySource) {
                _this.splashScreen.hide();
                return Promise.resolve(theReadySource);
            }, function (theError) {
                console.log("Error in WorkOFlowApp platformReady this.platform.ready()" + theError);
                throw (theError);
            })
                .then(function (theReadySource) {
                pheResolve(theReadySource);
            }, function (theError) {
                // console.log( "Error in WorkOFlowApp platformReady " + theError);
                pheReject(theError);
            });
        });
    };
    WorkOFlowApp.prototype.enableMenu = function (loggedIn) {
        this.menu.enable(loggedIn, WorkOFlowApp_1.DOMID_MENU_LOGGEDIN);
        this.menu.enable(!loggedIn, WorkOFlowApp_1.DOMID_MENU_LOGGEDOUT);
    };
    WorkOFlowApp.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function () {
            _this.enableMenu(true);
            console.log("WorkOFlowApp received event user:login");
        });
        this.events.subscribe('user:signup', function () {
            _this.enableMenu(true);
            console.log("WorkOFlowApp received event user:signup");
        });
        this.events.subscribe('user:logout', function () {
            _this.enableMenu(false);
            console.log("WorkOFlowApp received event user:logout");
        });
    };
    /* **********************************************************************
    Opens a view on the instance of page supplied in the PageInterface specification. Cases:

    Current view already is flowTabs ( because there is at least one getActiveChildNavs):

        Requested PageInterface has a index property, therefore the PageInterface is one of the tabs in flowTabs
            then just the the tab index in the flowtabs sub-navigator controller, do not change root page

        Requested Page is not one of the flowTabs
            then set as root the view registered under the name property of the requested ResquesterPage

    Current view is not flowTabs:
            then set as root the view registered under the name property of the requested ResquesterPage

            if the requested PageInterface has an index property
                then it is assumed (by flowPages, loggedInPages, loggedOutPages, alwaysPages  initialised above)
                    that the requested page
                    is one of the flowtabs
                    the component to actually instantiate is FlowTabsPage
                        as given in property component: of the requested PageInterface
                    the FlowTabsPage upon activation shall instantiate as sub-view
                        the component specified by property tabComponent in the requested PageInterface
                    the index corresponds to the tab index in the flowtabs sub-navigator controller

    See in FlowTabsPage and corresponding template
        how the various tabs are interpolated and rendered
            <ion-tab [root]="tab1Root" flowboxTitle="Inbox" tabIcon="mail" tabUrlPath="inbox"></ion-tab>
            <ion-tab [root]="tab2Root" flowboxTitle="Drafts" tabIcon="mail-open" tabUrlPath="drafts"></ion-tab>
            <ion-tab [root]="tab3Root" flowboxTitle="Archived" tabIcon="done-all" tabUrlPath="archived"></ion-tab>
            <ion-tab [root]="tab4Root" flowboxTitle="Bounced" tabIcon="undo" tabUrlPath="bounced"></ion-tab>
            <ion-tab [root]="tab5Root" flowboxTitle="Templates" tabIcon="create" tabUrlPath="templates"></ion-tab>
            <ion-tab [root]="tab6Root" flowboxTitle="Outbox" tabIcon="send" tabUrlPath="outbox"></ion-tab>
        and bound to specific instances
            tab1Root: any = InboxPage;
            tab2Root: any = DraftsPage;
            tab3Root: any = ArchivedPage;
            tab4Root: any = BouncedPage;
            tab5Root: any = TemplatesPage;
            tab6Root: any = OutboxPage;
    */
    WorkOFlowApp.prototype.openPage = function (page) {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            // Current view is flowTabs and requested PageInterface has index property and therefore is one of the flowTabs
            // just set tab index
            if (_this.nav.getActiveChildNavs().length && page.index != undefined) {
                _this.nav.getActiveChildNavs()[0].select(page.index);
                return;
            }
            // Current view is not flowTabs, or requested PageInterface does not have index property and therefore is not one of the flowTabs
            var params = {};
            // Requested PageInterface has index property
            // it shall be used by flowTabs controller to choose the sub-view to present
            //    whether the current view is already flowTabs or not
            // it is assumed initialisations above flowPages, loggedInPages, loggedOutPages, alwaysPages
            //    that the requested page  component to actually instantiate is FlowTabsPage
            if (page.index) {
                params = { tabIndex: page.index };
            }
            // Set as root the view registered under the name property of the requested ResquesterPage
            // if the page is FlowTabsPage, hopefully params holds an index for the tab to present
            _this.nav.setRoot(page.name, params)
                .then(function (theSetRootResult) {
                pheResolve(theSetRootResult);
            }, function (theError) {
                console.log("Error in WorkOFlowApp openPage this.nav.setRoot( " + (page.name || "?") + ")  Error=" + theError);
                pheReject(theError);
            });
        });
    };
    /* **********************************************************************
    Determines whether a page is active or not such that the menu may display an item as enabled or disabled.

    Handle the two different cases of flowTab pages, and non-flowTab pages.
    */
    WorkOFlowApp.prototype.isActive = function (page) {
        var aChildNav = this.nav.getActiveChildNavs()[0];
        // Tabs are a special case because they have their own navigation
        if (aChildNav) {
            if (aChildNav.getSelected()
                && (aChildNav.getSelected().root === page.tabComponent)) {
                return 'primary';
            }
            return;
        }
        if (this.nav.getActive() && this.nav.getActive().name === page.name) {
            return 'primary';
        }
        return;
    };
    /* **********************************************************************
    Exposed here for convenience of executing logout
    Expected, but not tested, to be used from views, which can get a reference to this root.
    Not sure if this instance is what views get injected in
    constructor(
        theApp: App,
    */
    WorkOFlowApp.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.loggedinProvider.logout()
                .then(function () {
                return _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */]);
            }, function (theError) {
                throw theError;
            })
                .then(function () {
                pheResolve();
            }, function (theError) {
                pheReject(theError);
            });
        });
    };
    /* **********************************************************************
    Invoked from menu item
     */
    WorkOFlowApp.prototype.openTutorial = function () {
        return this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_6__pages_tutorial_tutorial__["a" /* TutorialPage */]);
    };
    WorkOFlowApp.DOMID_MENU_LOGGEDIN = 'domid_menu_loggedIn';
    WorkOFlowApp.DOMID_MENU_LOGGEDOUT = 'domid_menu_loggedOut';
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Nav */])
    ], WorkOFlowApp.prototype, "nav", void 0);
    WorkOFlowApp = WorkOFlowApp_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/app/app.template.html"*/'<!--\n* app.template.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n\n<!-- OJO ACV <ion-split-pane> removed to have the menu show and hide  -->\n\n<!-- **********************************************************************\nlogged out menu\nAlso presents the items for the logged in menu, but shall appear disabled.\n-->\n<ion-menu id="domid_menu_loggedOut" [content]="content">\n    \n    <ion-header>\n        <ion-toolbar>\n            <button ion-button menuToggle>\n                <ion-icon name="menu"></ion-icon>\n            </button>\n            <ion-title>Menu</ion-title>\n        </ion-toolbar>\n    </ion-header>\n    \n    <ion-content class="outer-content">\n    \n        <div class="logo">\n            <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n        </div>\n        \n        <ion-list>\n            <ion-list-header>\n                workOflow&ensp;-&ensp;please login\n            </ion-list-header>\n            <button disabled ion-item menuClose *ngFor="let p of flowPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        <ion-list>\n            <ion-list-header>\n                Account\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of loggedOutPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n    \n        <ion-list>\n            <ion-list-header>\n                Info\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of alwaysPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n            <button ion-item menuClose (click)="openTutorial()">\n                <ion-icon item-start name="hammer"></ion-icon>\n                Show Tutorial\n            </button>\n        </ion-list>\n       \n    </ion-content>\n\n</ion-menu>\n\n\n\n<!-- logged in menu -->\n<ion-menu id="domid_menu_loggedIn" [content]="content">\n    \n    <ion-header>\n        <ion-toolbar>\n            <button ion-button menuToggle>\n                <ion-icon name="menu"></ion-icon>\n            </button>\n            <ion-title>Menu</ion-title>\n        </ion-toolbar>\n    </ion-header>\n    \n    <ion-content class="outer-content">\n    \n        <div class="logo">\n            <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n        </div>\n        \n        <ion-list>\n            <ion-list-header>\n                workOflow\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of flowPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n        \n        \n        <ion-list>\n            <ion-list-header>\n                Account\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of loggedInPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="\'\'"></ion-icon>\n                {{p.title}}\n            </button>\n        </ion-list>\n    \n    \n        <ion-list>\n            <ion-list-header>\n                Info\n            </ion-list-header>\n            <button ion-item menuClose *ngFor="let p of alwaysPages" (click)="openPage(p)">\n                <ion-icon item-start [name]="p.icon" [color]="isActive(p)"></ion-icon>\n                {{p.title}}\n            </button>\n            <button ion-item menuClose (click)="openTutorial()">\n                <ion-icon item-start name="hammer"></ion-icon>\n                Show Tutorial\n            </button>\n        </ion-list>\n\n    </ion-content>\n\n</ion-menu>\n\n<!-- main navigation -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false" main name="app"></ion-nav>\n\n<!-- OJO ACV <ion-split-pane> removed to have the menu show and hide  -->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/app/app.template.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */],
            __WEBPACK_IMPORTED_MODULE_17__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* MenuController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_18__storage_storage_provider__["a" /* StorageProvider */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], WorkOFlowApp);
    return WorkOFlowApp;
    var WorkOFlowApp_1;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 313:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Login; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return LoginApplication; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(113);
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

/***/ 314:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Activable */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ApplicationActivation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return IdentityActivation; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(113);
/*
 * flow-activations.ts
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

var Activable = (function (_super) {
    __extends(Activable, _super);
    function Activable(isActive) {
        if (isActive === void 0) { isActive = false; }
        var _this = _super.call(this) || this;
        _this.isActive = isActive;
        _this._v_Type = "Activable";
        return _this;
    }
    ;
    Activable.prototype.setActive = function (theIsActive) {
        this.isActive = theIsActive === true;
    };
    Activable.prototype.getActive = function () {
        return this.isActive === true;
    };
    return Activable;
}(__WEBPACK_IMPORTED_MODULE_0__flow_typed__["a" /* Typed */]));

var ApplicationActivation = (function (_super) {
    __extends(ApplicationActivation, _super);
    function ApplicationActivation(login, applicationKey, theIsActive, theStored) {
        if (theIsActive === void 0) { theIsActive = false; }
        var _this = _super.call(this, theIsActive) || this;
        _this.login = login;
        _this.applicationKey = applicationKey;
        _this._v_Type = "ApplicationActivation";
        _this.identityActivations = [];
        if (theStored) {
            _this.initFromStored(theStored);
        }
        return _this;
    }
    ;
    ApplicationActivation.prototype.getLogin = function () {
        return this.login;
    };
    ApplicationActivation.prototype.addIdentityActivation = function (theIdentityActivation) {
        if (!theIdentityActivation) {
            return;
        }
        this.identityActivations.push(theIdentityActivation);
    };
    ApplicationActivation.prototype.copyWithIdentityActivations = function () {
        var aCopy = new ApplicationActivation(this.login, this.applicationKey, this.isActive);
        if (this.identityActivations) {
            for (var _i = 0, _a = this.identityActivations; _i < _a.length; _i++) {
                var anIdentityActivation = _a[_i];
                anIdentityActivation.copyIntoApplicationActivation(aCopy);
            }
        }
        return aCopy;
    };
    ApplicationActivation.prototype.initFromStored = function (theStored) {
        if (!(theStored
            && theStored.identityActivations)) {
            return;
        }
        for (var _i = 0, theStored_1 = theStored; _i < theStored_1.length; _i++) {
            var aMayBeIdentityActivation = theStored_1[_i];
            if (!(aMayBeIdentityActivation
                && aMayBeIdentityActivation.identityKey)) {
                continue;
            }
            this.addIdentityActivation(new IdentityActivation(this, aMayBeIdentityActivation.identityKey, aMayBeIdentityActivation.isActive === true));
        }
    };
    ApplicationActivation.prototype.copyAsStored = function () {
        if (!(this.login && this.applicationKey)) {
            return null;
        }
        var someIdentityActivations = [];
        var aCopyApplicationActivation = {
            "login": this.login,
            "applicationKey": this.applicationKey,
            "isActive": this.isActive === true,
            "identityActivations": someIdentityActivations
        };
        if (this.identityActivations && this.identityActivations.length) {
            for (var _i = 0, _a = this.identityActivations; _i < _a.length; _i++) {
                var anIdentityActivation = _a[_i];
                if (!anIdentityActivation) {
                    continue;
                }
                someIdentityActivations.push(anIdentityActivation.copyAsStored());
            }
        }
        return aCopyApplicationActivation;
    };
    return ApplicationActivation;
}(Activable));

var IdentityActivation = (function (_super) {
    __extends(IdentityActivation, _super);
    function IdentityActivation(applicationActivation, identityKey, theIsActive) {
        if (theIsActive === void 0) { theIsActive = false; }
        var _this = _super.call(this, theIsActive) || this;
        _this.applicationActivation = applicationActivation;
        _this.identityKey = identityKey;
        _this._v_Type = "IdentityActivation";
        return _this;
    }
    ;
    IdentityActivation.prototype.getLogin = function () {
        if (!this.applicationActivation) {
            return null;
        }
        return this.applicationActivation.getLogin();
    };
    IdentityActivation.prototype.copyIntoApplicationActivation = function (theApplicationActivation) {
        if (!theApplicationActivation) {
            return null;
        }
        var aCopy = new IdentityActivation(theApplicationActivation, this.identityKey, this.isActive);
        theApplicationActivation.addIdentityActivation(aCopy);
    };
    IdentityActivation.prototype.copyAsStored = function () {
        if (!(this.applicationActivation
            && this.identityKey)) {
            return null;
        }
        return {
            "identityKey": this.identityKey,
            "isActive": !!this.isActive
        };
    };
    return IdentityActivation;
}(Activable));

//# sourceMappingURL=flow-activations.js.map

/***/ }),

/***/ 315:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__flow_header_flow_header__ = __webpack_require__(220);
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
    function FlowboxPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        _this.flowboxTitle = "(abstract)Flowbox";
        _this.flowboxIcon = "grid";
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    FlowboxPage.prototype.ionViewDidLoad = function () {
        console.log(this.flowboxTitle + " ionViewDidLoad");
        this.app.setTitle(this.flowboxTitle);
        this.flowheader.setFlowPage(this);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_4__flow_header_flow_header__["a" /* FlowHeader */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__flow_header_flow_header__["a" /* FlowHeader */])
    ], FlowboxPage.prototype, "flowheader", void 0);
    FlowboxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-flowbox',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowbox/flowbox.html"*/'<!--\n* flowbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowbox/flowbox.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], FlowboxPage);
    return FlowboxPage;
}(__WEBPACK_IMPORTED_MODULE_3__loggedin_loggedin__["a" /* LoggedinPage */]));

//# sourceMappingURL=flowbox.js.map

/***/ }),

/***/ 316:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommonPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__flowlist_flowlist__ = __webpack_require__(32);
/*
 * common.ts
 *
 * Created @author Antonio Carrasco Valero 201806032137
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



/* **********************************************************************
Abstract class offering general user interface widgets and interactions intended to be reused by subclass pages.
*/
var CommonPage = (function () {
    function CommonPage(app, alertCtrl, modalCtrl, toastCtrl, loadingCtrl) {
        this.app = app;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.loadingCtrl = loadingCtrl;
        console.log("(abstract)CommonPage constructor");
    }
    CommonPage_1 = CommonPage;
    CommonPage.prototype.present_alert = function (theTitle, theSubTitle, theOKLabel) {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { }
            _this.alertCtrl
                .create({
                title: theTitle,
                subTitle: theSubTitle
            })
                .addButton({ text: theOKLabel, handler: pheResolve })
                .present() /*CQT*/.then(function () { });
        });
    };
    /* **********************************************************************
    Present a modal dialog,  or equivalent device user interface language idiom,
    with the supplied title and message, and buttons for OK and CANCEL with the supplied labels.
    */
    CommonPage.prototype.present_confirm_cancel = function (theTitle, theMessage, theOKLabel, theCancelLabel) {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.alertCtrl
                .create({
                title: theTitle,
                message: theMessage
            })
                .addButton({ text: theOKLabel, handler: pheReject })
                .addButton({ text: theCancelLabel, role: 'cancel', handler: pheResolve })
                .present() /*CQT*/.then(function () { });
        });
    };
    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    CommonPage.prototype.show_toast = function (theMessage, theMillisToToast) {
        var _this = this;
        if (theMillisToToast === void 0) { theMillisToToast = __WEBPACK_IMPORTED_MODULE_2__flowlist_flowlist__["a" /* FlowlistPage */].TOAST_MILLIS_DEFAULT; }
        if (!(theMessage && theMillisToToast)) {
            return Promise.resolve();
        }
        return new Promise(function (pheResolveTop, pheRejectTop) {
            if (pheRejectTop) { }
            /*CQT*/
            _this.toastCtrl
                .create({
                message: theMessage,
                duration: (theMillisToToast <= __WEBPACK_IMPORTED_MODULE_2__flowlist_flowlist__["a" /* FlowlistPage */].TOAST_MILLIS_MAX ? theMillisToToast : __WEBPACK_IMPORTED_MODULE_2__flowlist_flowlist__["a" /* FlowlistPage */].TOAST_MILLIS_MAX)
            })
                .present()
                .then(function () {
                pheResolveTop();
            }, function () {
                pheResolveTop();
            });
        });
    };
    /* **********************************************************************
    Avoid that the user looses the edited contents by inadvertently navigating out of the page.
    If there is some content in the form
        then show an alert which shall prompt the user with two action buttons for the user to choose from before program interactions continue:
            OK: to allow to abandon the page
            CANCEL: to not allow to ABANDON the page, STAYing in the page

    Relies on implementation by specialisations of smallish responsibilities (declared as abstract in this CommonPage):
        ionViewCanLeave_ALWAYS ionViewCanLeave_SOMETIMES ionViewCanLeave_PromptExtraMessage

    Method invoked by the ionic/angular navigation machinery before abandoning the page to navigate to other one
        (may not be invoked when the user closes the browser or the native/hybrid app).
    */
    CommonPage.prototype.ionViewCanLeave = function () {
        var _this = this;
        if (this.ionViewCanLeave_ALWAYS()) {
            return Promise.resolve(true);
        }
        return new Promise(function (pheResolve, pheReject) {
            /* **********************************************************************
            Some pages can ALWAYS leave without further check or user confirmation.
                i.e. purely "read-only" pages
            */
            // Guard to avoid promise steps after first one to engage in further processing
            var anAlreadyDecided = false;
            var aCanLeaveNow = false;
            _this.ionViewCanLeave_SOMETIMES()
                .then(function (theCanLeave) {
                if (theCanLeave) {
                    aCanLeaveNow = true;
                    anAlreadyDecided = true;
                    return Promise.resolve(true);
                }
                // The page, which is not ALWAYS able to leave without user confirmation, has asynchronously checked whether the page can leave
                if (theCanLeave) {
                    aCanLeaveNow = true;
                    anAlreadyDecided = true;
                    return Promise.resolve(null);
                }
                /* **********************************************************************
                The page is not able NOW to leave without user confirmation
                Asynchronously retrieve an extra message to append to the question when prompting the user to confirm leaving the page (in a dialog) .
                i.e. it may reflect some differences with some asynchronous resource
                */
                return _this.ionViewCanLeave_PromptExtraMessage();
            }, function (theError) {
                /* **********************************************************************
                The implementation of ionViewCanLeave_SOMETIMES in concrete specialisations
                    may .reject the returned promise, rather than .resolve(false).
                Because it is expected (in this design) to be an straightforward check constant for each page type,
                    we do not need to handle the error channel as an exceptional one, but rather as responding false.
                */
                if (theError) { } /*CQT*/
                aCanLeaveNow = false;
                anAlreadyDecided = true;
                return Promise.resolve(null);
            })
                .then(function (thePromptExtraMessage) {
                // Was already decided in promise above that the page can leave (either ALWAYS or NOW - after checking asynchronously)
                if (anAlreadyDecided) {
                    return Promise.resolve(null);
                }
                // Prompt the user (with a dialog) for confirmation about leaving the page, appending the extra message retrieved asynchronously above
                var anExtraMessage = thePromptExtraMessage || "";
                return _this.present_confirm_cancel(CommonPage_1.LEAVETHISPAGE_TITLE, CommonPage_1.LEAVETHISPAGE_QUESTION + anExtraMessage, CommonPage_1.LEAVETHISPAGE_LEAVE_LABEL, // theOKLabel
                CommonPage_1.LEAVETHISPAGE_STAY_LABEL); // theCancelLabel
            }, function (theError) {
                /* **********************************************************************
                If there was some error retrieving the extra message, it may actually be an exceptional condition.
                Signal the exceptional condition by re-throwing. Catch ( theError) below shall not allow to leave the page.
                */
                aCanLeaveNow = false;
                anAlreadyDecided = true;
                throw theError;
            })
                .then(function (theUserConfirmed) {
                // Was already decided in promise above that the page can leave (either ALWAYS or NOW - after checking asynchronously)
                if (anAlreadyDecided) {
                    return Promise.resolve(aCanLeaveNow);
                }
                // Resolve with the users choice
                pheResolve(true === theUserConfirmed);
            }, function (theError) {
                /* **********************************************************************
                If there was some error during the dialog, it may actually be an exceptional condition.
                Do not allow to leave the page.
                Signal the exceptional condition by re-throwing.
                */
                pheReject(theError);
            });
        });
    };
    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    CommonPage.prototype.openSocial = function (theNetwork, theFab) {
        var aLoading = this.loadingCtrl.create({
            content: CommonPage_1.POSTINGTOSOCIALNETWORK_MESSAGE + " to " + theNetwork,
            duration: CommonPage_1.OPENSOCIAL_MILLIS_MIN + Math.random() * CommonPage_1.OPENSOCIAL_MILLIS_RANDOM
        });
        aLoading.onWillDismiss(function () {
            theFab.close();
        });
        return aLoading.present();
    };
    CommonPage.OPENSOCIAL_MILLIS_RANDOM = 0; // 1000;
    CommonPage.OPENSOCIAL_MILLIS_MIN = 1000; // 500;
    CommonPage.TOAST_MILLIS_DEFAULT = 3000;
    CommonPage.TOAST_MILLIS_MAX = 30000;
    /*i18n*/ CommonPage.POSTINGTOSOCIALNETWORK_MESSAGE = "Posting to social network";
    /*i18n*/ CommonPage.LEAVETHISPAGE_TITLE = "Leave this page ?";
    /*i18n*/ CommonPage.LEAVETHISPAGE_QUESTION = "Are you sure you want to leave this page?";
    /*i18n*/ CommonPage.LEAVETHISPAGE_STAY_LABEL = "Stay";
    /*i18n*/ CommonPage.LEAVETHISPAGE_LEAVE_LABEL = "Leave";
    CommonPage = CommonPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-common',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/common/common.html"*/'<!--\n* common.html\n*\n* Created @author Antonio Carrasco Valero 201806032137\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/common/common.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */]])
    ], CommonPage);
    return CommonPage;
    var CommonPage_1;
}());

//# sourceMappingURL=common.js.map

/***/ }),

/***/ 317:
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

/***/ 318:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Application; });
/* unused harmony export Spec */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return ProcessSpec; });
/* unused harmony export ProcessInitiator */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return Group; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Identity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_typed__ = __webpack_require__(113);
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

/***/ 319:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ActiveFilter; });
/* unused harmony export ApplicationKeyed */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_applications_provider__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_activations_provider__ = __webpack_require__(20);
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
    function ActiveFilter(loggedinProvider, applicationsProvider, activationsProvider) {
        this.loggedinProvider = loggedinProvider;
        this.applicationsProvider = applicationsProvider;
        this.activationsProvider = activationsProvider;
        console.log("ActiveFilter constructor");
    }
    ActiveFilter.prototype.getAllApplicationsKeyed = function () {
        var _this = this;
        console.log("ActiveFilter getAllApplicationsKeyed");
        return new __WEBPACK_IMPORTED_MODULE_4_rxjs_Observable__["Observable"](function (theObserver) {
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
    ActiveFilter.prototype.acceptableProcessSpecs = function (theApplicationActivations) {
        if (!(theApplicationActivations
            && theApplicationActivations.length)) {
            return null;
        }
        if (!(this.applicationsKeyed
            && this.applicationsKeyed.size)) {
            return null;
        }
        // Shall collect process keys for each application which has any of them
        var someProcessSpecs = [];
        // Iterate over ApplicationActivations
        for (var _i = 0, theApplicationActivations_1 = theApplicationActivations; _i < theApplicationActivations_1.length; _i++) {
            var anApplicationActivation = theApplicationActivations_1[_i];
            if (!anApplicationActivation
                || !anApplicationActivation.login
                || !anApplicationActivation.applicationKey
                || !(anApplicationActivation.isActive === true)) {
                continue;
            }
            // Nothing more to do if no identityActivations
            if (!(anApplicationActivation.identityActivations
                && anApplicationActivation.identityActivations.length)) {
            }
            // Lookup an application by its key.
            var anApplicationKeyed = this.applicationsKeyed.get(anApplicationActivation.applicationKey);
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
            // Iterate over Identity Activations
            for (var _a = 0, _b = anApplicationActivation.identityActivations; _a < _b.length; _a++) {
                var anIdentityActivation = _b[_a];
                if (!anIdentityActivation
                    || !anIdentityActivation.identityKey
                    || !(anIdentityActivation.isActive === true)) {
                    continue;
                }
                var anIdentityByKey = anApplicationKeyed.identitiesByKey.get(anIdentityActivation.identityKey);
                if (!anIdentityByKey) {
                    // The application refered by the IdentityActivation does not hold the identity refered by its key from the identity activation
                    continue;
                }
                // Collect ProcessSpecs with keys as refered by the identity initiableProcessKeys
                if (anIdentityByKey.initiableProcessKeys) {
                    this.processSpecsByKeyInto(anApplicationKeyed, anIdentityByKey.initiableProcessKeys, someProcessSpecs);
                }
                // Collect ProcessSpecs with keys as refered by the identity participedProcessKeys
                if (anIdentityByKey.participedProcessKeys) {
                    this.processSpecsByKeyInto(anApplicationKeyed, anIdentityByKey.participedProcessKeys, someProcessSpecs);
                }
                // Collect ProcessSpecs from each of the groups refered by the identity group keys
                if (anIdentityByKey.groupKeys) {
                    for (var _c = 0, _d = anIdentityByKey.groupKeys; _c < _d.length; _c++) {
                        var aGroupKey = _d[_c];
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_applications_provider__["a" /* ApplicationsProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_activations_provider__["a" /* ActivationsProvider */]])
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

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowlistPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__flowbox_flowbox__ = __webpack_require__(315);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__identities_filter_identitites_filter__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_activations_provider__ = __webpack_require__(20);
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






var FlowlistPage = (function (_super) {
    __extends(FlowlistPage, _super);
    function FlowlistPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider, activationsProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, theNavCtrl, theLoggedinProvider) || this;
        _this.activationsProvider = activationsProvider;
        _this.hasAnyFavoriteItem = false;
        _this.hasAnyUrgentItem = false;
        _this.flowboxTitle = "(abstract)Flowlist";
        _this.flowboxIcon = "grid";
        _this.segment = "all";
        _this.queryText = "";
        _this.hasAnyFavoriteItem = false;
        _this.hasAnyUrgentItem = false;
        console.log(_this.flowboxTitle + " constructor");
        return _this;
    }
    FlowlistPage_1 = FlowlistPage;
    /* **********************************************************************
    TODO ACV OJO 201806040129 This may be way redundant! Check whether user is logged in before performing updateContent()
    upon entering in the view, even if already checked through supertype LoginPage ionViewCanEnter()
    May be could be simplified to just a fire-and-forget of this.updateContent()
     */
    FlowlistPage.prototype.ionViewDidEnter = function () {
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
    /* **********************************************************************
    Flowlist specialisations can ALWAYS leave without further check or user confirmation.
    Because all specialisations must be a list presentation without edits
        other than the query value  which as of today 201806040113 is transient to the page
            we'll see in the future whether/how to persist recent/useful query strings
            and whether such affects leaving the page.
            Chances are that any such persistence of queries shall be handled by some mechanism
            which won't render the page "dirty" for the purpose of leaving the page
    */
    FlowlistPage.prototype.ionViewCanLeave_ALWAYS = function () {
        return true;
    };
    // FLowlist specialisations do not need to check for "dirty" contents or forms. See comment above for method ionViewCanLeave_ALWAYS.
    FlowlistPage.prototype.ionViewCanLeave_SOMETIMES = function () { return Promise.resolve(true); };
    // FLowlist specialisations do not need to retrieve a message to confirm leaving the page. See comment above for method ionViewCanLeave_ALWAYS.
    FlowlistPage.prototype.ionViewCanLeave_PromptExtraMessage = function () { return Promise.resolve(""); };
    /* **********************************************************************
    Shows a modal with the tree of applications and identities available to the logged in user
    with one UI widget to enable/disable each application and identity.
   */
    FlowlistPage.prototype.presentFilter = function () {
        var _this = this;
        var aFilterModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__identities_filter_identitites_filter__["a" /* IdentitiesFilterPage */]);
        aFilterModal.onWillDismiss(function (theData) {
            if (theData) {
                _this.updateContent();
            }
        });
        // fire-and-forget . shall handle close with onWillDismiss handler above
        aFilterModal.present().then(function () { });
    };
    FlowlistPage.prototype.doRefresh = function (refresher) {
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
                _this.toast_Refreshed() /*CQT*/.then(function () { });
                resolveTop(pheResult);
            }, function (pheError) {
                rejectTop(pheError);
            });
        });
    };
    /* **********************************************************************
    Show a toast when the content has been updated by refresh.
    */
    FlowlistPage.prototype.toast_Refreshed = function () {
        return this.show_toast(FlowlistPage_1.TOAST_REFRESHED_MESSAGE, FlowlistPage_1.TOAST_UPDATED_MILLIS);
    };
    /*i18n*/ FlowlistPage.TOAST_REFRESHED_MESSAGE = "Updated";
    FlowlistPage.TOAST_UPDATED_MILLIS = 3000;
    FlowlistPage = FlowlistPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-flowlist',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowlist/flowlist.html"*/'<!--\n* flowbox.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowlist/flowlist.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_loggedin_provider__["a" /* LoggedinProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_activations_provider__["a" /* ActivationsProvider */]])
    ], FlowlistPage);
    return FlowlistPage;
    var FlowlistPage_1;
}(__WEBPACK_IMPORTED_MODULE_2__flowbox_flowbox__["a" /* FlowboxPage */]));

//# sourceMappingURL=flowlist.js.map

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Authentication; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__flow_result__ = __webpack_require__(321);
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

/***/ 321:
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

/***/ 322:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StorageKeys; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/*
 * storage-keys.ts
 *
 * Created @author Antonio Carrasco Valero 201806031526
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

var StorageKeys = (function () {
    function StorageKeys() {
    }
    StorageKeys.STORAGEKEY_HAS_SEEN_TUTORIAL = "HAS_SEEN_TUTORIAL";
    StorageKeys.STORAGEKEY_AUTO_AUTHENTICATE_LOGIN = "AUTOAUTHENTICATE_LOGIN";
    StorageKeys = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], StorageKeys);
    return StorageKeys;
}());

//# sourceMappingURL=storage-keys.js.map

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__signup_signup__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__flow_flowtabs_page_flowtabs_page__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_logins_provider__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_authentication_provider__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_selector_login_selector__ = __webpack_require__(225);
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
    function LoginPage(navCtrl, alertCtrl, loginsProvider, authenticationProvider, loggedinProvider) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loginsProvider = loginsProvider;
        this.authenticationProvider = authenticationProvider;
        this.loggedinProvider = loggedinProvider;
        this.login = { username: '', password: '' };
        console.log("LoginPage constructor");
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        this.loginSelector.setLoginPage(this);
    };
    LoginPage.prototype.onLogin = function (form) {
        if (form.valid) {
            this.doLogin();
        }
    };
    LoginPage.prototype.onSignup = function () {
        return this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__signup_signup__["a" /* SignupPage */]);
    };
    LoginPage.prototype.loginSelected = function (theSelectedLogin) {
        var _this = this;
        if (!theSelectedLogin) {
            this.login.username = "";
            this.login.password = "";
            return;
        }
        this.login.username = theSelectedLogin.login;
        this.login.password = "AnyPasswordGoes";
        /* As we have just "typed" values in the form,
        allow onlookers (i.e. Selenium Protractor) to be able to see them in the "next tick"
        before continuing with the doLogin.
         */
        return new Promise(function (pheResolve, pheReject) {
            setTimeout(function () {
                _this.doLogin().then(function (pheResult) {
                    pheResolve(pheResult);
                }, function (theError) {
                    pheReject(theError);
                });
            }, 0);
        });
    };
    LoginPage.prototype.doLogin = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.authenticationProvider.authenticate(_this.login.username, _this.login.password)
                .subscribe(function (theAuthentication) {
                _this.loggedinProvider.authenticationPerformed(theAuthentication)
                    .then(function () {
                    return _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__flow_flowtabs_page_flowtabs_page__["a" /* FlowTabsPage */]);
                }, function (theError) {
                    throw theError;
                })
                    .then(function () {
                    pheResolve();
                }, function (theError) {
                    pheReject(theError);
                    _this.alertCtrl.create({
                        title: 'Error after authentication',
                        subTitle: theError.toString().substr(0, MAXERRORLEN),
                        buttons: ['Dismiss']
                    });
                });
            }, function (theError) {
                pheReject(theError);
                _this.alertCtrl.create({
                    title: 'Error during authentication',
                    subTitle: theError.toString().substr(0, MAXERRORLEN),
                    buttons: ['Dismiss']
                });
            });
        });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_7__login_selector_login_selector__["a" /* LoginSelector */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__login_selector_login_selector__["a" /* LoginSelector */])
    ], LoginPage.prototype, "loginSelector", void 0);
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/login/login.html"*/'<!--\n* login.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n		<ion-title>Login to workOflow</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<div class="logo">\n        <img src="assets/img/logo/workOflow-logo-plain.svg" alt="FlowWork Logo">\n	</div>\n\n\n	<form #loginForm="ngForm" novalidate>\n  \n		<ion-list no-lines>\n            \n            <ion-item>\n                <ion-icon name="person" item-start></ion-icon>\n                <ion-label>Courtesy demo logins</ion-label>\n                <ion-select name="login_select" [(ngModel)]="selectedLogin" (ionChange)="loginSelected()">\n                    <ion-option *ngFor="let aLogin of logins" [value]="aLogin" >{{ aLogin.login}}</ion-option>\n                </ion-select>\n            </ion-item>\n            \n			<ion-item>\n				<ion-label stacked color="primary">Username</ion-label>\n				<ion-input [(ngModel)]="login.username" name="username" type="text" #username="ngModel" spellcheck="false" autocapitalize="off"\n					required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="username && username.valid" color="danger" padding-left>\n				Username is required\n			</p>\n\n			<ion-item>\n				<ion-label stacked color="primary">Password</ion-label>\n				<ion-input [(ngModel)]="login.password" name="password" type="password" #password="ngModel" required>\n				</ion-input>\n			</ion-item>\n			<p ion-text [hidden]="password && password.valid" color="danger" padding-left>\n				Password is required\n			</p>\n		</ion-list>\n\n		<ion-row responsive-sm>\n			<ion-col>\n				<button ion-button (click)="onLogin(loginForm)" type="submit" block>Login</button>\n			</ion-col>\n			<ion-col>\n				<button ion-button (click)="onSignup()" color="light" block>Signup</button>\n			</ion-col>\n		</ion-row>\n	</form>\n\n</ion-content>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/login/login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_logins_provider__["a" /* LoginsProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_authentication_provider__["a" /* AuthenticationProvider */],
            __WEBPACK_IMPORTED_MODULE_6__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginsProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__interfaces_flow_logins__ = __webpack_require__(313);
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

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoggedinPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__common_common__ = __webpack_require__(316);
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





/* **********************************************************************
Abstract class intended to be reused by specialisation by pages which require the user to be logged in.
*/
var LoggedinPage = (function (_super) {
    __extends(LoggedinPage, _super);
    function LoggedinPage(theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl, navCtrl, loggedinProvider) {
        var _this = _super.call(this, theApp, theAlertCtrl, theModalCtrl, theToastCtrl, theLoadingCtrl) || this;
        _this.navCtrl = navCtrl;
        _this.loggedinProvider = loggedinProvider;
        console.log("(abstract)LoggedinPage constructor");
        return _this;
    }
    LoggedinPage_1 = LoggedinPage;
    /* **********************************************************************
    Ensure that the user is logged in before proceeding visiting this page.
    If the user is not logged in
    then present the LoginPage, and not this page
    */
    LoggedinPage.prototype.ionViewCanEnter = function () {
        return this.beLoggedinOrGoToLoginPage();
    };
    /* **********************************************************************
    Returns a promise which shall resolve to the ILogin of the logged in user if any,
    or be rejected if the user is not loged in.

    If the user is not logged in
    then
        an alert is presented to the user indicating that the user is not logged in
        navigation is directed to the Login Page

    Obtains AuthenticatedLogin (an ILogin) from LoggedinProvider
    If authenticated
        then proceed resolving with the ILogin instance of the authenticated user

    else ( the user is not authenticated)
        presentAlert
        set the root nav root to LoginPage
        reject the returned promise
    */
    LoggedinPage.prototype.beLoggedinOrGoToLoginPage = function () {
        var _this = this;
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise(function (pheResolve, pheReject) {
            _this.loggedinProvider.getAuthenticatedLogin()
                .then(function (theAuthenticatedLogin) {
                if (theAuthenticatedLogin) {
                    _this.authenticatedLogin = theAuthenticatedLogin;
                    console.log("(abstract)LoggedinPage LOGGED IN beLoggedinOrGoToLoginPage this.loggedinProvider.getAuthenticatedLogin()");
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
                    }, function (theError) {
                        var aMsg = "(abstract)LoggedinPage beLoggedinOrGoToLoginPage NO this.loggedinProvider.getAuthenticatedLogin() theError=" + theError;
                        console.log(aMsg);
                        pheReject("User not logged in\n" + aMsg);
                    });
                }
            }, function (theError) {
                var aMsg = "((abstract)LoggedinPage beLoggedinOrGoToLoginPage this.loggedinProvider.getAuthenticatedLogin() error=" + theError;
                console.log(aMsg);
                pheReject("User not logged in\n" + aMsg);
            });
        });
    };
    LoggedinPage.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            _this.loggedinProvider.logout()
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
    LoggedinPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: "You are not logged in, or your session expired",
            subTitle: "Please login",
            buttons: ["Go to Login"]
        });
        return alert.present();
    };
    /* **********************************************************************
    Posting to social networks is only allowed to logged in users.

    Note that this behavior implemented in this abstract superclass is available to subclasses
    and subclasses are guaranteed to operate only for logged in users
        as per ionic/angular invocation of ionViewCanEnter() delegating on beLoggedinOrGoToLoginPage above.
    */
    LoggedinPage.prototype.openSocial = function (theNetwork, theFab) {
        var aLoading = this.loadingCtrl.create({
            content: "Posting to " + theNetwork,
            duration: LoggedinPage_1.OPENSOCIAL_MILLIS_MIN + Math.random() * LoggedinPage_1.OPENSOCIAL_MILLIS_RANDOM
        });
        aLoading.onWillDismiss(function () {
            theFab.close();
        });
        return aLoading.present();
    };
    LoggedinPage.OPENSOCIAL_MILLIS_RANDOM = 0; // 1000;
    LoggedinPage.OPENSOCIAL_MILLIS_MIN = 1000; // 500;
    LoggedinPage = LoggedinPage_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-loggedin',template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/loggedin/loggedin.html"*/'<!--\n* loggedin.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/loggedin/loggedin.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["q" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_2__providers_loggedin_provider__["a" /* LoggedinProvider */]])
    ], LoggedinPage);
    return LoggedinPage;
    var LoggedinPage_1;
}(__WEBPACK_IMPORTED_MODULE_4__common_common__["a" /* CommonPage */]));

//# sourceMappingURL=loggedin.js.map

/***/ }),

/***/ 60:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlowTabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__inbox_inbox__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__drafts_drafts__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__archived_archived__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__bounced_bounced__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__templates_templates__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__outbox_outbox__ = __webpack_require__(121);
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
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowtabs-page/flowtabs-page.html"*/'<!--\n* flowtabs-page.html\n*\n* Created @author Antonio Carrasco Valero 201805252222\n*\n*\n***************************************************************************\n\nCopyright 2018 Antonio Carrasco Valero\nworkOflow Single-page-application and hybrid Android/iOS app playground with Ionic3 Angular6 on  Flowable REST API as Spring Boot Java application.\n\nLicensed under the EUPL, Version 1.1 only (the "Licence");\nYou may not use this work except in compliance with the\nLicence.\nYou may obtain a copy of the Licence at:\nhttps://joinup.ec.europa.eu/software/page/eupl/licence-eupl\nUnless required by applicable law or agreed to in\nwriting, software distributed under the Licence is\ndistributed on an "AS IS" basis,\nWITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either\nexpress or implied.\nSee the Licence for the specific language governing\npermissions and limitations under the Licence.\n{{License2}}\n\n{{Licensed1}}\n{{Licensed2}}\n\n***************************************************************************\n*\n-->\n\n<ion-tabs [selectedIndex]="mySelectedIndex" name="flow">\n    <ion-tab [root]="tab1Root" flowboxTitle="Inbox" tabIcon="mail" tabUrlPath="inbox"></ion-tab>\n    <ion-tab [root]="tab2Root" flowboxTitle="Drafts" tabIcon="mail-open" tabUrlPath="drafts"></ion-tab>\n    <ion-tab [root]="tab3Root" flowboxTitle="Archived" tabIcon="done-all" tabUrlPath="archived"></ion-tab>\n    <ion-tab [root]="tab4Root" flowboxTitle="Bounced" tabIcon="undo" tabUrlPath="bounced"></ion-tab>\n    <ion-tab [root]="tab5Root" flowboxTitle="Templates" tabIcon="create" tabUrlPath="templates"></ion-tab>\n    <ion-tab [root]="tab6Root" flowboxTitle="Outbox" tabIcon="send" tabUrlPath="outbox"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/home/acv/Works/MDD/workoflow-ui/SVNs_workoflow-ui/workflow-ui_refactor01/workoflow-ui/workoflow-uiapp/src/pages/flow/flowtabs-page/flowtabs-page.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* NavParams */]])
    ], FlowTabsPage);
    return FlowTabsPage;
}());

//# sourceMappingURL=flowtabs-page.js.map

/***/ })

},[231]);
//# sourceMappingURL=main.js.map