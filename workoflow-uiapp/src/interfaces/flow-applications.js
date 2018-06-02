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
Object.defineProperty(exports, "__esModule", { value: true });
var flow_typed_1 = require("./flow-typed");
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application(name, key, isDisabled) {
        if (isDisabled === void 0) { isDisabled = false; }
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.key = key;
        _this.isDisabled = isDisabled;
        _this._v_Type = "Application";
        _this.specs = [];
        _this.groups = [];
        _this.identities = [];
        return _this;
    }
    Application.prototype.setDisabled = function (theIsDisabled) {
        this.isDisabled = theIsDisabled === true;
    };
    Application.prototype.getDisabled = function () {
        return this.isDisabled === true;
    };
    Application.prototype.addProcessSpec = function (theProcessSpec) {
        if (!theProcessSpec) {
            return;
        }
        this.specs.push(theProcessSpec);
    };
    Application.prototype.addGroup = function (theGroup) {
        if (!theGroup) {
            return;
        }
        this.groups.push(theGroup);
    };
    Application.prototype.addIdentity = function (theIdentity) {
        if (!theIdentity) {
            return;
        }
        this.identities.push(theIdentity);
    };
    Application.prototype.getAllSpecs = function () {
        if (!this.specs) {
            return null;
        }
        return this.specs.slice();
    };
    Application.prototype.getProcessSpecs = function () {
        if (!this.specs) {
            return null;
        }
        var someProcessSpecs = [];
        for (var _i = 0, _a = this.specs; _i < _a.length; _i++) {
            var aSpec = _a[_i];
            if (!aSpec) {
                continue;
            }
            if (!(aSpec._v_Type === "ProcessSpec")) {
                continue;
            }
            someProcessSpecs.push(aSpec);
        }
        return someProcessSpecs;
    };
    return Application;
}(flow_typed_1.Typed));
exports.Application = Application;
var Spec = /** @class */ (function (_super) {
    __extends(Spec, _super);
    function Spec(application, name, key) {
        var _this = _super.call(this) || this;
        _this.application = application;
        _this.name = name;
        _this.key = key;
        _this._v_Type = "Spec";
        return _this;
    }
    return Spec;
}(flow_typed_1.Typed));
exports.Spec = Spec;
var ProcessSpec = /** @class */ (function (_super) {
    __extends(ProcessSpec, _super);
    function ProcessSpec(theApplication, theName, theKey) {
        var _this = _super.call(this, theApplication, theName, theKey) || this;
        _this._v_Type = "ProcessSpec";
        return _this;
    }
    return ProcessSpec;
}(Spec));
exports.ProcessSpec = ProcessSpec;
var ProcessInitiator = /** @class */ (function (_super) {
    __extends(ProcessInitiator, _super);
    function ProcessInitiator(initiableProcessKeys, participedProcessKeys) {
        var _this = _super.call(this) || this;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this._v_Type = "ProcessInitiator";
        return _this;
    }
    ;
    return ProcessInitiator;
}(flow_typed_1.Typed));
exports.ProcessInitiator = ProcessInitiator;
var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(application, initiableProcessKeys, participedProcessKeys, name, key, isVirtual) {
        if (isVirtual === void 0) { isVirtual = false; }
        var _this = _super.call(this, initiableProcessKeys, participedProcessKeys) || this;
        _this.application = application;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this.name = name;
        _this.key = key;
        _this.isVirtual = isVirtual;
        _this._v_Type = "Group";
        return _this;
    }
    ;
    return Group;
}(ProcessInitiator));
exports.Group = Group;
var Identity = /** @class */ (function (_super) {
    __extends(Identity, _super);
    function Identity(application, initiableProcessKeys, participedProcessKeys, user, groupKeys) {
        var _this = _super.call(this, initiableProcessKeys, participedProcessKeys) || this;
        _this.application = application;
        _this.initiableProcessKeys = initiableProcessKeys;
        _this.participedProcessKeys = participedProcessKeys;
        _this.user = user;
        _this.groupKeys = groupKeys;
        _this._v_Type = "Identity";
        return _this;
    }
    ;
    return Identity;
}(ProcessInitiator));
exports.Identity = Identity;
