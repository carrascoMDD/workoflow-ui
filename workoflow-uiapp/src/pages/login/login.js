"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var flowtabs_page_1 = require("../flow/flowtabs-page/flowtabs-page");
var MAXERRORLEN = 256;
var LoginPage = /** @class */ (function () {
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
                _this.navCtrl.push(flowtabs_page_1.FlowTabsPage);
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
            _this.navCtrl.push(flowtabs_page_1.FlowTabsPage);
        }, function (theError) {
            _this.alertCtrl.create({
                title: 'Error after authentication',
                subTitle: theError.toString().substr(0, MAXERRORLEN),
                buttons: ['Dismiss']
            });
        });
    };
    LoginPage = __decorate([
        core_1.Component({
            selector: 'page-user',
            templateUrl: 'login.html'
        })
    ], LoginPage);
    return LoginPage;
}());
exports.LoginPage = LoginPage;
