"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var lazyload_image_directive_1 = require("./lazyload-image.directive");
var LazyLoadImageModule = (function () {
    function LazyLoadImageModule() {
    }
    LazyLoadImageModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [lazyload_image_directive_1.LazyLoadImageDirective],
                    exports: [lazyload_image_directive_1.LazyLoadImageDirective]
                },] },
    ];
    return LazyLoadImageModule;
}());
exports.LazyLoadImageModule = LazyLoadImageModule;
//# sourceMappingURL=lazyload-image.module.js.map