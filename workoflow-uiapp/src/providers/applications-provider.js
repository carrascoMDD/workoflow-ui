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
var flow_applications_1 = require("../interfaces/flow-applications");
// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_APPLICATIONS_realhost	= "";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_APPLICATIONS_samehost = "assets/flow/flow-applications-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_APPLICATIONS = URL_APPLICATIONS_samehost;
var ApplicationsProvider = /** @class */ (function () {
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
            return Observable_1.Observable.of(this.applications);
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
                var anApplication = new flow_applications_1.Application(aSrcApplication.name, aSrcApplication.key);
                if (aSrcApplication.processSpecs) {
                    for (var _a = 0, _b = aSrcApplication.processSpecs; _a < _b.length; _a++) {
                        var aSrcProcessSpec = _b[_a];
                        if (!aSrcProcessSpec) {
                            continue;
                        }
                        var aProcessSpec = new flow_applications_1.ProcessSpec(anApplication, aSrcProcessSpec.name, aSrcProcessSpec.key);
                        anApplication.addProcessSpec(aProcessSpec);
                    }
                }
                if (aSrcApplication.groups) {
                    for (var _c = 0, _d = aSrcApplication.groups; _c < _d.length; _c++) {
                        var aSrcGroup = _d[_c];
                        if (!aSrcGroup) {
                            continue;
                        }
                        var aGroup = new flow_applications_1.Group(anApplication, this.sliceOrNull(aSrcGroup.initiableProcessKeys), this.sliceOrNull(aSrcGroup.participedProcessKeys), aSrcGroup.name, aSrcGroup.key);
                        anApplication.addGroup(aGroup);
                    }
                }
                if (aSrcApplication.identities) {
                    for (var _e = 0, _f = aSrcApplication.identities; _e < _f.length; _e++) {
                        var aSrcIdentity = _f[_e];
                        if (!aSrcIdentity) {
                            continue;
                        }
                        var anIdentity = new flow_applications_1.Identity(anApplication, this.sliceOrNull(aSrcIdentity.initiableProcessKeys), this.sliceOrNull(aSrcIdentity.participedProcessKeys), aSrcIdentity.user, this.sliceOrNull(aSrcIdentity.groups));
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
        core_1.Injectable()
    ], ApplicationsProvider);
    return ApplicationsProvider;
}());
exports.ApplicationsProvider = ApplicationsProvider;
