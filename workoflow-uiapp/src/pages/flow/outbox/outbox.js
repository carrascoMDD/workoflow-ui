"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ionic_angular_1 = require("ionic-angular");
var session_detail_1 = require("../../session-detail/session-detail");
var schedule_filter_1 = require("../../schedule-filter/schedule-filter");
var OutboxPage = /** @class */ (function () {
    function OutboxPage(alertCtrl, app, loadingCtrl, modalCtrl, navCtrl, toastCtrl, user) {
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.user = user;
        this.dayIndex = 0;
        this.queryText = '';
        this.segment = 'outbox';
        this.excludeTracks = [];
        this.shownSessions = [];
        this.groups = [];
    }
    OutboxPage.prototype.ionViewDidLoad = function () {
        this.app.setTitle('Outbox');
        this.updateSchedule();
    };
    OutboxPage.prototype.updateSchedule = function () {
        // Close any open sliding items when the schedule updates
        this.scheduleList && this.scheduleList.closeSlidingItems();
    };
    OutboxPage.prototype.presentFilter = function () {
        var _this = this;
        var modal = this.modalCtrl.create(schedule_filter_1.ScheduleFilterPage, this.excludeTracks);
        modal.present();
        modal.onWillDismiss(function (data) {
            if (data) {
                _this.excludeTracks = data;
                _this.updateSchedule();
            }
        });
    };
    OutboxPage.prototype.goToSessionDetail = function (sessionData) {
        // go to the session detail page
        // and pass in the session data
        this.navCtrl.push(session_detail_1.SessionDetailPage, { sessionId: sessionData.id, name: sessionData.name });
    };
    OutboxPage.prototype.openSocial = function (network, fab) {
        var loading = this.loadingCtrl.create({
            content: "Posting to " + network,
            duration: (Math.random() * 1000) + 500
        });
        loading.onWillDismiss(function () {
            fab.close();
        });
        loading.present();
    };
    OutboxPage.prototype.doRefresh = function (refresher) {
        if (refresher) { }
        /*
      this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
        this.shownSessions = data.shownSessions;
        this.groups = data.groups;
  
        // simulate a network request that would take longer
        // than just pulling from out local json file
        setTimeout(() => {
          refresher.complete();
  
          const toast = this.toastCtrl.create({
            message: 'Sessions have been updated.',
            duration: 3000
          });
          toast.present();
        }, 1000);
      });
      */
    };
    __decorate([
        core_1.ViewChild('scheduleList', { read: ionic_angular_1.List })
    ], OutboxPage.prototype, "scheduleList", void 0);
    OutboxPage = __decorate([
        core_1.Component({
            selector: 'page-outbox',
            templateUrl: 'outbox.html'
        })
    ], OutboxPage);
    return OutboxPage;
}());
exports.OutboxPage = OutboxPage;
