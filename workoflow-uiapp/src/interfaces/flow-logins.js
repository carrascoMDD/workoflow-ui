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
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login(login, name, familyName) {
        var _this = _super.call(this) || this;
        _this.login = login;
        _this.name = name;
        _this.familyName = familyName;
        _this._v_Type = "Login";
        _this.loginApplications = [];
        return _this;
    }
    ;
    Login.prototype.addLoginApplication = function (theLoginApplication) {
        if (!theLoginApplication) {
            return;
        }
        this.loginApplications.push(theLoginApplication);
    };
    return Login;
}(flow_typed_1.Typed));
exports.Login = Login;
var LoginApplication = /** @class */ (function () {
    function LoginApplication(applicationKey, identityKeys) {
        this.applicationKey = applicationKey;
        this.identityKeys = identityKeys;
        this._v_Type = "LoginApplication";
        console.log("LoginApplication applicationKey=" + applicationKey, " identityKeys=" + identityKeys.toString());
    }
    ;
    return LoginApplication;
}());
exports.LoginApplication = LoginApplication;
