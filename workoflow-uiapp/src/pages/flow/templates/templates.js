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
var ionic_angular_1 = require("ionic-angular");
var loggedin_1 = require("../loggedin/loggedin");
var template_detail_1 = require("../template-detail/template-detail");
var schedule_filter_1 = require("../../schedule-filter/schedule-filter");
var TemplatesPage = /** @class */ (function (_super) {
    __extends(TemplatesPage, _super);
    function TemplatesPage(theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData, templatesFilter) {
        var _this = _super.call(this, theApp, theAlertCtrl, theLoadingCtrl, theModalCtrl, theNavCtrl, theToastCtrl, theUserData) || this;
        _this.templatesFilter = templatesFilter;
        _this.dayIndex = 0;
        _this.queryText = '';
        _this.segment = 'all';
        _this.excludeTracks = [];
        _this.shownTemplates = [];
        _this.groups = [];
        _this.templatespecs = [];
        console.log("TemplatesPage constructor");
        return _this;
    }
    TemplatesPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'You are not logged in, or your session expired',
            subTitle: 'Please login',
            buttons: ['Go to Login']
        });
        return alert.present();
    };
    TemplatesPage.prototype.ionViewDidLoad = function () {
        console.log("TemplatesPage ionViewDidLoad");
        this.app.setTitle('Templates');
    };
    TemplatesPage.prototype.ionViewDidEnter = function () {
        console.log("TemplatesPage ionViewDidEnter");
        this.updateTemplates();
    };
    TemplatesPage.prototype.updateContent = function () {
        return this.updateTemplates();
    };
    TemplatesPage.prototype.updateTemplates = function () {
        var _this = this;
        console.log("TemplatesPage updateTemplates");
        // Close any open sliding items when the schedule updates
        // seem to be synchronous! - probably just touches some variables
        this.templatesList && this.templatesList.closeSlidingItems();
        return new Promise(function (resolver) {
            _this.templatesFilter.getTemplatespecs(_this.queryText).subscribe(function (theTemplatespecs) {
                _this.templatespecs = theTemplatespecs;
                _this.shownTemplates = _this.templatespecs;
                console.log("templates.ts updateTemplates theTemplatespecs.length=\n" + ((theTemplatespecs && theTemplatespecs.length) ? theTemplatespecs.length : 0));
                resolver(_this.templatespecs);
            });
        });
    };
    TemplatesPage.prototype.presentFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(schedule_filter_1.ScheduleFilterPage, this.excludeTracks);
        modal.present();
        modal.onWillDismiss(function (data) {
            if (data) {
                _this.excludeTracks = data;
                _this.updateTemplates();
            }
        });
    };
    TemplatesPage.prototype.goToTemplateDetail = function (theTemplatespec) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(template_detail_1.TemplateDetailPage, {
            templatespec: theTemplatespec,
            name: theTemplatespec.name,
            key: theTemplatespec.key
        });
    };
    TemplatesPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    __decorate([
        core_1.ViewChild('templatesList', { read: ionic_angular_1.List })
    ], TemplatesPage.prototype, "templatesList", void 0);
    TemplatesPage = __decorate([
        core_1.Component({
            selector: 'page-templates',
            templateUrl: 'templates.html'
        })
    ], TemplatesPage);
    return TemplatesPage;
}(loggedin_1.LoggedinPage));
exports.TemplatesPage = TemplatesPage;
