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
var flow_authentication_1 = require("../interfaces/flow-authentication");
var IGNOREPASSWORD = true;
var CRASHONERROR = true;
var AuthenticationProvider = /** @class */ (function () {
    function AuthenticationProvider(httpc) {
        this.httpc = httpc;
        console.log("AuthenticationProvider constructor");
    }
    AuthenticationProvider.prototype.authenticate = function (theUsername, thePassword) {
        return new Observable_1.Observable(function (theObserver) {
            console.log("AuthenticationProvider authenticate observable subscribe. Delivering immediately.");
            if (IGNOREPASSWORD || thePassword) {
                setTimeout(function () {
                    theObserver.next(new flow_authentication_1.Authentication(theUsername, true, null, null, null));
                    theObserver.complete();
                }, 16);
            }
            else {
                if (CRASHONERROR) {
                    setTimeout(function () {
                        theObserver.error(new flow_authentication_1.Authentication(theUsername, false, null, null, null));
                        theObserver.complete();
                    }, 16);
                }
                else {
                    setTimeout(function () {
                        theObserver.next(new flow_authentication_1.Authentication(theUsername, false, null, null, null));
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
        core_1.Injectable()
    ], AuthenticationProvider);
    return AuthenticationProvider;
}());
exports.AuthenticationProvider = AuthenticationProvider;
