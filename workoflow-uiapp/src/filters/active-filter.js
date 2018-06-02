"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var Observable_1 = require("rxjs/Observable");
var ActiveFilter = /** @class */ (function () {
    function ActiveFilter(userData, applicationsProvider) {
        this.userData = userData;
        this.applicationsProvider = applicationsProvider;
        console.log("ActiveFilter constructor");
    }
    ActiveFilter.prototype.getAllApplicationsKeyed = function () {
        var _this = this;
        console.log("ActiveFilter getAllApplicationsKeyed");
        return new Observable_1.Observable(function (theObserver) {
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
        core_1.Injectable()
    ], ActiveFilter);
    return ActiveFilter;
}());
exports.ActiveFilter = ActiveFilter;
var ApplicationKeyed = /** @class */ (function () {
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
exports.ApplicationKeyed = ApplicationKeyed;
