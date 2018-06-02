"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var inbox_1 = require("../inbox/inbox");
var drafts_1 = require("../drafts/drafts");
var archived_1 = require("../archived/archived");
var bounced_1 = require("../bounced/bounced");
var templates_1 = require("../templates/templates");
var outbox_1 = require("../outbox/outbox");
var FlowTabsPage = /** @class */ (function () {
    function FlowTabsPage(navParams) {
        // set the root pages for each tab
        this.tab1Root = inbox_1.InboxPage;
        this.tab2Root = drafts_1.DraftsPage;
        this.tab3Root = archived_1.ArchivedPage;
        this.tab4Root = bounced_1.BouncedPage;
        this.tab5Root = templates_1.TemplatesPage;
        this.tab6Root = outbox_1.OutboxPage;
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
    FlowTabsPage = __decorate([
        core_1.Component({
            templateUrl: 'flowtabs-page.html'
        })
    ], FlowTabsPage);
    return FlowTabsPage;
}());
exports.FlowTabsPage = FlowTabsPage;
