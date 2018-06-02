"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Templatespec = /** @class */ (function () {
    function Templatespec(id, url, key, version, name, description, tenantId, deploymentId, deploymentUrl, resource, diagramResource, category, graphicalNotationDefined, suspended, startFormDefined) {
        this.id = id;
        this.url = url;
        this.key = key;
        this.version = version;
        this.name = name;
        this.description = description;
        this.tenantId = tenantId;
        this.deploymentId = deploymentId;
        this.deploymentUrl = deploymentUrl;
        this.resource = resource;
        this.diagramResource = diagramResource;
        this.category = category;
        this.graphicalNotationDefined = graphicalNotationDefined;
        this.suspended = suspended;
        this.startFormDefined = startFormDefined;
        this.variables = [];
        this.transientVariables = [];
        this.hide = false;
    }
    ;
    Templatespec.prototype.addVariablespec = function (theVariableSpec) {
        if (!theVariableSpec) {
            return;
        }
        this.variables.push(theVariableSpec);
    };
    Templatespec.prototype.addTransientVariablespec = function (theVariableSpec) {
        if (!theVariableSpec) {
            return;
        }
        this.transientVariables.push(theVariableSpec);
    };
    return Templatespec;
}());
exports.Templatespec = Templatespec;
var Variablespec = /** @class */ (function () {
    function Variablespec(name, type) {
        this.name = name;
        this.type = type;
    }
    ;
    return Variablespec;
}());
exports.Variablespec = Variablespec;
