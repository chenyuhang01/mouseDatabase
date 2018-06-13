"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var core_1 = require("@angular/core");
var scroll_listener_1 = require("./scroll-listener");
var lazyload_image_1 = require("./lazyload-image");
var utils_1 = require("./utils");
var LazyLoadImageDirective = (function () {
    function LazyLoadImageDirective(el, ngZone) {
        this.onLoad = new core_1.EventEmitter();
        this.elementRef = el;
        this.ngZone = ngZone;
        this.propertyChanges$ = new rxjs_1.ReplaySubject();
    }
    LazyLoadImageDirective.prototype.ngOnChanges = function (changes) {
        this.propertyChanges$.next({
            lazyImage: this.lazyImage,
            defaultImage: this.defaultImage,
            errorImage: this.errorImage,
            scrollTarget: this.scrollTarget,
            scrollObservable: this.scrollObservable,
            offset: this.offset | 0,
            useSrcset: this.useSrcset
        });
    };
    LazyLoadImageDirective.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (!utils_1.isWindowDefined()) {
            return null;
        }
        this.ngZone.runOutsideAngular(function () {
            var scrollObservable;
            if (_this.scrollObservable) {
                scrollObservable = _this.scrollObservable.pipe(operators_1.startWith(''));
            }
            else {
                var windowTarget = utils_1.isWindowDefined() ? window : undefined;
                scrollObservable = scroll_listener_1.getScrollListener(_this.scrollTarget || windowTarget);
            }
            _this.scrollSubscription = _this.propertyChanges$.pipe(operators_1.debounceTime(10), operators_1.switchMap(function (props) {
                return scrollObservable.pipe(lazyload_image_1.lazyLoadImage(_this.elementRef.nativeElement, props.lazyImage, props.defaultImage, props.errorImage, props.offset, props.useSrcset, props.scrollTarget));
            })).subscribe(function (success) { return _this.onLoad.emit(success); });
        });
    };
    LazyLoadImageDirective.prototype.ngOnDestroy = function () {
        [this.scrollSubscription]
            .filter(function (subscription) { return subscription && !subscription.isUnsubscribed; })
            .forEach(function (subscription) { return subscription.unsubscribe(); });
    };
    LazyLoadImageDirective.decorators = [
        { type: core_1.Directive, args: [{
                    selector: '[lazyLoad]'
                },] },
    ];
    LazyLoadImageDirective.ctorParameters = function () { return [
        { type: core_1.ElementRef, },
        { type: core_1.NgZone, },
    ]; };
    LazyLoadImageDirective.propDecorators = {
        "lazyImage": [{ type: core_1.Input, args: ['lazyLoad',] },],
        "defaultImage": [{ type: core_1.Input },],
        "errorImage": [{ type: core_1.Input },],
        "scrollTarget": [{ type: core_1.Input },],
        "scrollObservable": [{ type: core_1.Input },],
        "offset": [{ type: core_1.Input },],
        "useSrcset": [{ type: core_1.Input },],
        "onLoad": [{ type: core_1.Output },],
    };
    return LazyLoadImageDirective;
}());
exports.LazyLoadImageDirective = LazyLoadImageDirective;
//# sourceMappingURL=lazyload-image.directive.js.map