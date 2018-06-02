"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var flow_logins_1 = require("../interfaces/flow-logins");
// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_LOGINS_realhost	= "";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_LOGINS_samehost = "assets/flow/flow-logins-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_LOGINS = URL_LOGINS_samehost;
var LoginsProvider = /** @class */ (function () {
    function LoginsProvider(httpc) {
        this.httpc = httpc;
        console.log("LoginsProvider constructor");
    }
    LoginsProvider.prototype.getAllLogins = function () {
        return this.load();
    };
    LoginsProvider.prototype.load = function () {
        if (this.logins) {
            return Observable_1.Observable.of(this.logins);
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
                var aLogin = new flow_logins_1.Login(aSrcLogin.login, aSrcLogin.name, aSrcLogin.familyName);
                if (aSrcLogin.loginApplications) {
                    for (var _a = 0, _b = aSrcLogin.loginApplications; _a < _b.length; _a++) {
                        var aSrcLoginApplication = _b[_a];
                        if (!aSrcLoginApplication) {
                            continue;
                        }
                        var aLoginApplication = new flow_logins_1.LoginApplication(aSrcLoginApplication.applicationKey, this.sliceOrNull(aSrcLoginApplication.identityKeys));
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
        core_1.Injectable()
    ], LoginsProvider);
    return LoginsProvider;
}());
exports.LoginsProvider = LoginsProvider;
