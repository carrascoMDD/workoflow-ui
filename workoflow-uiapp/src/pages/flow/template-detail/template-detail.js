"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TemplateDetailPage = /** @class */ (function () {
    function TemplateDetailPage(templatesProvider, navParams) {
        this.templatesProvider = templatesProvider;
        this.navParams = navParams;
        console.log("TemplateDetailPage constructor");
    }
    TemplateDetailPage.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.templatesProvider.load().subscribe(function (theTemplatespecs) {
            for (var _i = 0, theTemplatespecs_1 = theTemplatespecs; _i < theTemplatespecs_1.length; _i++) {
                var aTemplatespec = theTemplatespecs_1[_i];
                if (aTemplatespec && aTemplatespec.key === _this.navParams.data.key) {
                    _this.template = aTemplatespec;
                    break;
                }
            }
        });
    };
    TemplateDetailPage = __decorate([
        core_1.Component({
            selector: 'page-template-detail',
            templateUrl: 'template-detail.html'
        })
    ], TemplateDetailPage);
    return TemplateDetailPage;
}());
exports.TemplateDetailPage = TemplateDetailPage;
