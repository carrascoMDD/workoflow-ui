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
var flow_templatespecs_1 = require("../interfaces/flow-templatespecs");
// const URL_SCHEMEHOSTPORT_realhost = "http://localhost:8080";
// const URL_PROCESSDEFINITIONS_realhost	= "/process-api/repository/process-definitions";
var URL_SCHEMEHOSTPORT_samehost = "";
var URL_PROCESSDEFINITIONS_samehost = "assets/flow/flow-templates-static.json";
var URL_SCHEMEHOSTPORT = URL_SCHEMEHOSTPORT_samehost;
var URL_PROCESSDEFINITIONS = URL_PROCESSDEFINITIONS_samehost;
/*
const URL_PROCESSINSTANCES   	= "/process-api/runtime/process-instances";
const URL_QUERYTASKS 			= "/process-api/query/tasks";
const URL_TASKVARIABLESALL 	= "/process-api/runtime/tasks/{taskId}/variables";
const URL_TASKVARIABLESLOCAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=local";
const URL_TASKVARIABLESGLOBAL 	= "/process-api/runtime/tasks/{taskId}/variables?scope=global";
const URL_EXECUTETASKACTION    = "/process-api/runtime/tasks/{taskId}";
*/
var TemplatesProvider = /** @class */ (function () {
    function TemplatesProvider(httpc, user) {
        this.httpc = httpc;
        this.user = user;
        console.log("TemplatesProvider constructor");
    }
    TemplatesProvider.prototype.getTemplatespecs = function (queryText) {
        if (queryText === void 0) { queryText = ''; }
        console.log("TemplatesProvider getTemplatespecs queryText" + queryText);
        return this.load();
    };
    ;
    TemplatesProvider.prototype.load = function () {
        if (this.templatespecs) {
            return Observable_1.Observable.of(this.templatespecs);
        }
        else {
            this.templatespecs = null;
            var aURL = URL_SCHEMEHOSTPORT + URL_PROCESSDEFINITIONS;
            return this.httpc.get(aURL).map(this.parseProcessSpec, this);
            /*
             this.httpc.get(aURL)
               .subscribe(data => {
                 console.log(JSON.stringify( data, null, 4));
               }, err => {
                 console.log(err);
               });
             return null;
          */
        }
    };
    TemplatesProvider.prototype.parseProcessSpec = function (theSpecs) {
        this.templatespecs = [];
        if (!theSpecs) {
            return;
        }
        var someProcessSpecs = theSpecs.data;
        if (!someProcessSpecs) {
            return;
        }
        for (var _i = 0, someProcessSpecs_1 = someProcessSpecs; _i < someProcessSpecs_1.length; _i++) {
            var aProcessSpec = someProcessSpecs_1[_i];
            if (aProcessSpec) {
                var aTemplatespec = new flow_templatespecs_1.Templatespec(aProcessSpec.id, aProcessSpec.url, aProcessSpec.key, aProcessSpec.version, aProcessSpec.name, aProcessSpec.description, aProcessSpec.tenantId, aProcessSpec.deploymentId, aProcessSpec.deploymentUrl, aProcessSpec.resource, aProcessSpec.diagramResource, aProcessSpec.category, aProcessSpec.graphicalNotationDefined, aProcessSpec.suspended, aProcessSpec.startFormDefined);
                if (aProcessSpec.variables) {
                    for (var _a = 0, _b = aProcessSpec.variables; _a < _b.length; _a++) {
                        var aProcessVariable = _b[_a];
                        if (!aProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new flow_templatespecs_1.Variablespec(aProcessVariable.name, aProcessVariable.type);
                        aTemplatespec.addVariablespec(aVariableSpec);
                    }
                }
                if (aProcessSpec.transientVariables) {
                    for (var _c = 0, _d = aProcessSpec.transientVariables; _c < _d.length; _c++) {
                        var aTransientProcessVariable = _d[_c];
                        if (!aTransientProcessVariable) {
                            continue;
                        }
                        var aVariableSpec = new flow_templatespecs_1.Variablespec(aTransientProcessVariable.name, aTransientProcessVariable.type);
                        aTemplatespec.addTransientVariablespec(aVariableSpec);
                    }
                }
                this.templatespecs.push(aTemplatespec);
            }
        }
        return this.templatespecs;
    };
    TemplatesProvider.prototype.filterTemplate = function (theTemplatespec, queryWords) {
        var matchesQueryText = false;
        if (queryWords.length) {
            // of any query word is in the session name than it passes the query test
            queryWords.forEach(function (queryWord) {
                if ((theTemplatespec.name.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.key.toLowerCase().indexOf(queryWord) >= 0)
                    || (theTemplatespec.description.toLowerCase().indexOf(queryWord) >= 0)) {
                    matchesQueryText = true;
                }
            });
        }
        else {
            // if there are no query words then this session passes the query test
            matchesQueryText = true;
        }
        // all tests must be true if it should not be hidden
        theTemplatespec.hide = !matchesQueryText;
    };
    TemplatesProvider = __decorate([
        core_1.Injectable()
    ], TemplatesProvider);
    return TemplatesProvider;
}());
exports.TemplatesProvider = TemplatesProvider;
