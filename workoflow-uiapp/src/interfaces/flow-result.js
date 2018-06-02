"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Result = /** @class */ (function () {
    function Result(theSuccess, theCondition, theMessage, theDetails) {
        this._v_Success = theSuccess;
        this._v_Condition = theCondition || null;
        this._v_Message = theMessage || null;
        this._v_Details = theDetails || null;
    }
    return Result;
}());
exports.Result = Result;
