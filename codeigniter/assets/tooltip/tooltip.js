/*
 Copyright (C) Federico Zivolo 2019
 Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).
 */
(function (a, b) {
    'object' == typeof exports && 'undefined' != typeof module ? module.exports = b(require('popper.js')) : 'function' == typeof define && define.amd ? define(['popper.js'], b) : a.Tooltip = b(a.Popper)
}
)(this, function (a) {
    'use strict';
    function b(a) {
        return a && '[object Function]' === {}.toString.call(a)
    }
    a = a && a.hasOwnProperty('default') ? a['default'] : a;
    var c = function (a, b) {
        if (!(a instanceof b))
            throw new TypeError('Cannot call a class as a function')
    }
        , d = function () {
            function a(a, b) {
                for (var c, d = 0; d < b.length; d++)
                    c = b[d],
                        c.enumerable = c.enumerable || !1,
                        c.configurable = !0,
                        'value' in c && (c.writable = !0),
                        Object.defineProperty(a, c.key, c)
            }
            return function (b, c, d) {
                return c && a(b.prototype, c),
                    d && a(b, d),
                    b
            }
        }()
        , e = Object.assign || function (a) {
            for (var b, c = 1; c < arguments.length; c++)
                for (var d in b = arguments[c],
                    b)
                    Object.prototype.hasOwnProperty.call(b, d) && (a[d] = b[d]);
            return a
        }
        , f = {
            container: !1,
            delay: 0,
            html: !1,
            placement: 'top',
            title: '',
            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: 'hover focus',
            offset: 0,
            arrowSelector: '.tooltip-arrow, .tooltip__arrow',
            innerSelector: '.tooltip-inner, .tooltip__inner'
        }
        , g = function () {
            function g(a, b) {
                c(this, g),
                    h.call(this),
                    b = e({}, f, b),
                    a.jquery && (a = a[0]),
                    this.reference = a,
                    this.options = b;
                var d = 'string' == typeof b.trigger ? b.trigger.split(' ').filter(function (a) {
                    return -1 !== ['click', 'hover', 'focus'].indexOf(a)
                }) : [];
                this._isOpen = !1,
                    this._popperOptions = {},
                    this._setEventListeners(a, d, b)
            }
            return d(g, [{
                key: '_create',
                value: function (a, b, c, d) {
                    var e = window.document.createElement('div');
                    e.innerHTML = b.trim();
                    var f = e.childNodes[0];
                    f.id = 'tooltip_' + Math.random().toString(36).substr(2, 10),
                        f.setAttribute('aria-hidden', 'false');
                    var g = e.querySelector(this.options.innerSelector);
                    return this._addTitleContent(a, c, d, g),
                        f
                }
            }, {
                key: '_addTitleContent',
                value: function (a, c, d, e) {
                    if (1 === c.nodeType || 11 === c.nodeType)
                        d && e.appendChild(c);
                    else if (b(c)) {
                        var f = c.call(a);
                        d ? e.innerHTML = f : e.textContent = f
                    } else
                        d ? e.innerHTML = c : e.textContent = c
                }
            }, {
                key: '_show',
                value: function (b, c) {
                    if (this._isOpen && !this._isOpening)
                        return this;
                    if (this._isOpen = !0,
                        this._tooltipNode)
                        return this._tooltipNode.style.visibility = 'visible',
                            this._tooltipNode.setAttribute('aria-hidden', 'false'),
                            this.popperInstance.update(),
                            this;
                    var d = b.getAttribute('title') || c.title;
                    if (!d)
                        return this;
                    var f = this._create(b, c.template, d, c.html);
                    b.setAttribute('aria-describedby', f.id);
                    var g = this._findContainer(c.container, b);
                    return this._append(f, g),
                        this._popperOptions = e({}, c.popperOptions, {
                            placement: c.placement
                        }),
                        this._popperOptions.modifiers = e({}, this._popperOptions.modifiers, {
                            arrow: e({}, this._popperOptions.modifiers && this._popperOptions.modifiers.arrow, {
                                element: c.arrowSelector
                            }),
                            offset: e({}, this._popperOptions.modifiers && this._popperOptions.modifiers.offset, {
                                offset: c.offset
                            })
                        }),
                        c.boundariesElement && (this._popperOptions.modifiers.preventOverflow = {
                            boundariesElement: c.boundariesElement
                        }),
                        this.popperInstance = new a(b, f, this._popperOptions),
                        this._tooltipNode = f,
                        this
                }
            }, {
                key: '_hide',
                value: function () {
                    return this._isOpen ? (this._isOpen = !1,
                        this._tooltipNode.style.visibility = 'hidden',
                        this._tooltipNode.setAttribute('aria-hidden', 'true'),
                        this) : this
                }
            }, {
                key: '_dispose',
                value: function () {
                    var a = this;
                    return this._events.forEach(function (b) {
                        var c = b.func
                            , d = b.event;
                        a.reference.removeEventListener(d, c)
                    }),
                        this._events = [],
                        this._tooltipNode && (this._hide(),
                            this.popperInstance.destroy(),
                            !this.popperInstance.options.removeOnDestroy && (this._tooltipNode.parentNode.removeChild(this._tooltipNode),
                                this._tooltipNode = null)),
                        this
                }
            }, {
                key: '_findContainer',
                value: function (a, b) {
                    return 'string' == typeof a ? a = window.document.querySelector(a) : !1 === a && (a = b.parentNode),
                        a
                }
            }, {
                key: '_append',
                value: function (a, b) {
                    b.appendChild(a)
                }
            }, {
                key: '_setEventListeners',
                value: function (a, b, c) {
                    var d = this
                        , e = []
                        , f = [];
                    b.forEach(function (a) {
                        'hover' === a ? (e.push('mouseenter'),
                            f.push('mouseleave')) : 'focus' === a ? (e.push('focus'),
                                f.push('blur')) : 'click' === a ? (e.push('click'),
                                    f.push('click')) : void 0
                    }),
                        e.forEach(function (b) {
                            var e = function (b) {
                                !0 === d._isOpening || (b.usedByTooltip = !0,
                                    d._scheduleShow(a, c.delay, c, b))
                            };
                            d._events.push({
                                event: b,
                                func: e
                            }),
                                a.addEventListener(b, e)
                        }),
                        f.forEach(function (b) {
                            var f = function (b) {
                                !0 === b.usedByTooltip || d._scheduleHide(a, c.delay, c, b)
                            };
                            d._events.push({
                                event: b,
                                func: f
                            }),
                                a.addEventListener(b, f),
                                'click' === b && c.closeOnClickOutside && document.addEventListener('mousedown', function (b) {
                                    if (d._isOpening) {
                                        var c = d.popperInstance.popper;
                                        a.contains(b.target) || c.contains(b.target) || f(b)
                                    }
                                }, !0)
                        })
                }
            }, {
                key: '_scheduleShow',
                value: function (a, b, c) {
                    var d = this;
                    this._isOpening = !0;
                    var e = b && b.show || b || 0;
                    this._showTimeout = window.setTimeout(function () {
                        return d._show(a, c)
                    }, e)
                }
            }, {
                key: '_scheduleHide',
                value: function (a, b, c, d) {
                    var e = this;
                    this._isOpening = !1;
                    var f = b && b.hide || b || 0;
                    window.clearTimeout(this._showTimeout),
                        window.setTimeout(function () {
                            if (!1 !== e._isOpen && document.body.contains(e._tooltipNode)) {
                                if ('mouseleave' === d.type) {
                                    var f = e._setTooltipNodeEvent(d, a, b, c);
                                    if (f)
                                        return
                                }
                                e._hide(a, c)
                            }
                        }, f)
                }
            }, {
                key: '_updateTitleContent',
                value: function (a) {
                    if ('undefined' == typeof this._tooltipNode)
                        return void ('undefined' != typeof this.options.title && (this.options.title = a));
                    var b = this._tooltipNode.querySelector(this.options.innerSelector);
                    this._clearTitleContent(b, this.options.html, this.reference.getAttribute('title') || this.options.title),
                        this._addTitleContent(this.reference, a, this.options.html, b),
                        this.options.title = a,
                        this.popperInstance.update()
                }
            }, {
                key: '_clearTitleContent',
                value: function (a, b, c) {
                    1 === c.nodeType || 11 === c.nodeType ? b && a.removeChild(c) : b ? a.innerHTML = '' : a.textContent = ''
                }
            }]),
                g
        }()
        , h = function () {
            var a = this;
            this.show = function () {
                return a._show(a.reference, a.options)
            }
                ,
                this.hide = function () {
                    return a._hide()
                }
                ,
                this.dispose = function () {
                    return a._dispose()
                }
                ,
                this.toggle = function () {
                    return a._isOpen ? a.hide() : a.show()
                }
                ,
                this.updateTitleContent = function (b) {
                    return a._updateTitleContent(b)
                }
                ,
                this._events = [],
                this._setTooltipNodeEvent = function (b, c, d, e) {
                    var f = b.relatedreference || b.toElement || b.relatedTarget;
                    return !!a._tooltipNode.contains(f) && (a._tooltipNode.addEventListener(b.type, function d(f) {
                        var g = f.relatedreference || f.toElement || f.relatedTarget;
                        a._tooltipNode.removeEventListener(b.type, d),
                            c.contains(g) || a._scheduleHide(c, e.delay, e, f)
                    }),
                        !0)
                }
        };
    return g
});
//# sourceMappingURL=tooltip.min.js.map
