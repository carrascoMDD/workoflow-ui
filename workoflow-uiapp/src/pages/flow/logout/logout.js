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
var loggedin_1 = require("../loggedin/loggedin");
var LogoutPage = /** @class */ (function (_super) {
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
        return new Promise(function (pheResolve, pheReject) { if (pheReject) { } /*CQT*/ /*CQT*/ pheResolve(); });
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
        core_1.Component({
            selector: 'page-logout',
            templateUrl: 'logout.html'
        })
    ], LogoutPage);
    return LogoutPage;
}(loggedin_1.LoggedinPage));
exports.LogoutPage = LogoutPage;
