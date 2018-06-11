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
var IdentityActivation = /** @class */ (function (_super) {
    __extends(IdentityActivation, _super);
    function IdentityActivation(applicationKey, identityKey, isActive) {
        if (isActive === void 0) { isActive = false; }
        var _this = _super.call(this) || this;
        _this.applicationKey = applicationKey;
        _this.identityKey = identityKey;
        _this.isActive = isActive;
        _this._v_Type = "IdentityActivation";
        return _this;
    }
    ;
    IdentityActivation.prototype.setActive = function (theIsActive) {
        this.isActive = theIsActive === true;
    };
    IdentityActivation.prototype.getActive = function () {
        return this.isActive === true;
    };
    return IdentityActivation;
}(flow_typed_1.Typed));
exports.IdentityActivation = IdentityActivation;
