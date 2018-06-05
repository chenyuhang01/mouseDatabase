"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var mouse_component_1 = require("../model/mouse.component");
var tableview = (function () {
    function tableview() {
        this.columnsToDisplay = [
            'Physical ID',
            'Project title',
            'Gender',
            'Mouse Line',
            'PFA Liver',
            'FreezeDown Liver'
        ];
        this.mouse_list = [
            new mouse_component_1.Mouse('A123', 'A Project', 'Male', 'A_MouseLine', new mouse_component_1.PFA('5'), new mouse_component_1.FreezeDown('5'))
        ];
    }
    tableview = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'tableview',
            templateUrl: 'tableview.component.html',
            styleUrls: ['tableview.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], tableview);
    return tableview;
}());
exports.tableview = tableview;
//# sourceMappingURL=tableview.component.js.map