"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mouse = (function () {
    function Mouse(physical_id, project_title, gender, mouseline, pfa, freezedown) {
        this.physical_id = physical_id;
        this.project_title = project_title;
        this.gender = gender;
        this.mouseline = mouseline;
        this.pfa = pfa;
        this.freezedown = freezedown;
    }
    return Mouse;
}());
exports.Mouse = Mouse;
var PFA = (function () {
    function PFA(liver) {
        this.liver = liver;
    }
    return PFA;
}());
exports.PFA = PFA;
var FreezeDown = (function () {
    function FreezeDown(liver) {
        this.liver = liver;
    }
    return FreezeDown;
}());
exports.FreezeDown = FreezeDown;
//# sourceMappingURL=mouse.component.js.map