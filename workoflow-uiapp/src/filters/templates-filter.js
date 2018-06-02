"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var active_filter_1 = require("./active-filter");
require("rxjs/add/operator/map");
require("rxjs/add/observable/of");
var TemplatesFilter = /** @class */ (function (_super) {
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
        return new Observable_1.Observable(function (theObserver) {
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
        core_1.Injectable()
    ], TemplatesFilter);
    return TemplatesFilter;
}(active_filter_1.ActiveFilter));
exports.TemplatesFilter = TemplatesFilter;
