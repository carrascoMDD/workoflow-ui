"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var login_1 = require("../../login/login");
var LoggedinPage = /** @class */ (function () {
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
    LoggedinPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: "You are not logged in, or your session expired",
            subTitle: "Please login",
            buttons: ["Go to Login"]
        });
        return alert.present();
    };
    LoggedinPage.prototype.ionViewDidLoad = function () {
        console.log("(abstract)LoggedinPage ionViewDidLoad");
        this.app.setTitle("(abstract)LoggedinPage");
    };
    LoggedinPage.prototype.beLoggedinOrGoToLoginPage = function () {
        var _this = this;
        console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage");
        return new Promise(function (pheResolve, pheReject) {
            _this.userData.getAuthenticatedLogin()
                .then(function (theAuthenticatedLogin) {
                if (theAuthenticatedLogin) {
                    console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage this.userData.getAuthenticatedLogin() false");
                    pheResolve(theAuthenticatedLogin);
                    return;
                }
                else {
                    console.log("(abstract)LoggedinPage beLoggedinOrGoToLoginPage FALSE theHasLoggedIn");
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
                                _this.app.getRootNav().setRoot(login_1.LoginPage)
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
                            _this.app.getRootNav().setRoot(login_1.LoginPage)
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
    LoggedinPage.prototype.ionViewCanEnter = function () {
        return this.beLoggedinOrGoToLoginPage();
    };
    LoggedinPage.prototype.ionViewDidEnter = function () {
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
    LoggedinPage.prototype.doRefresh = function (refresher) {
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
    LoggedinPage.prototype.logout = function () {
        var _this = this;
        return new Promise(function (pheResolve, pheReject) {
            if (pheReject) { } /*CQT*/
            _this.userData.logout()
                .then(function () {
                return _this.app.getRootNav().setRoot(login_1.LoginPage);
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
    LoggedinPage = __decorate([
        core_1.Component({
            selector: 'page-loggedin',
            templateUrl: 'loggedin.html'
        })
    ], LoggedinPage);
    return LoggedinPage;
}());
exports.LoggedinPage = LoggedinPage;
