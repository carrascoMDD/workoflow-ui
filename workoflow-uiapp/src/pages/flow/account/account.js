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
var AccountPage = /** @class */ (function (_super) {
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
                    buttons: [
                        'Cancel'
                    ]
                });
                alert.setMessage(pheAuthenticatedLogin.login);
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
        core_1.Component({
            selector: 'page-account',
            templateUrl: 'account.html'
        })
    ], AccountPage);
    return AccountPage;
}(loggedin_1.LoggedinPage));
exports.AccountPage = AccountPage;
