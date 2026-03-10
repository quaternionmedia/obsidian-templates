'use strict';

var obsidian = require('obsidian');
var child_process = require('child_process');
var fs = require('fs');
var path = require('path');
var os = require('os');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var Rule;
(function (Rule) {
    class _Rule {
        constructor(items, value) {
            this.items = items;
            this.value = value;
        }
    }
    Rule._Rule = _Rule;
    class Empty extends _Rule {
        constructor(value) {
            super([], value);
        }
    }
    Rule.Empty = Empty;
    class Exact extends _Rule {
    }
    Rule.Exact = Exact;
    class Contains extends _Rule {
    }
    Rule.Contains = Contains;
    class NotExact extends _Rule {
    }
    Rule.NotExact = NotExact;
    class NotContains extends _Rule {
    }
    Rule.NotContains = NotContains;
})(Rule || (Rule = {}));
var Platform;
(function (Platform) {
    Platform["Unknown"] = "unknown";
    Platform["Linux"] = "linux";
    Platform["Mac"] = "mac";
    Platform["Win"] = "win";
})(Platform || (Platform = {}));
var Modifier;
(function (Modifier) {
    Modifier["Alt"] = "alt";
    Modifier["Ctrl"] = "ctrl";
    Modifier["Meta"] = "meta";
    Modifier["Shift"] = "shift";
})(Modifier || (Modifier = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Main"] = 0] = "Main";
    MouseButton[MouseButton["Auxiliary"] = 1] = "Auxiliary";
    MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
    MouseButton[MouseButton["Fourth"] = 3] = "Fourth";
    MouseButton[MouseButton["Fifth"] = 4] = "Fifth";
})(MouseButton || (MouseButton = {}));
var ViewMode;
(function (ViewMode) {
    ViewMode[ViewMode["LAST"] = 0] = "LAST";
    ViewMode[ViewMode["NEW"] = 1] = "NEW";
})(ViewMode || (ViewMode = {}));

class RulesChecker {
    constructor(_rules = []) {
        this._rules = _rules;
    }
    addRule(rule) {
        this._rules.push(rule);
    }
    check(input, options = {}) {
        var _a;
        const matched = [];
        for (const rule of this._rules) {
            if (((_a = options === null || options === void 0 ? void 0 : options.breakOnFirstSuccess) !== null && _a !== void 0 ? _a : false) &&
                matched.length > 0) {
                break;
            }
            const { items } = rule;
            if (rule instanceof Rule.Exact || rule instanceof Rule.NotExact) {
                let ok = false;
                if (items.length === input.length) {
                    ok = items.every((item) => input.contains(item));
                }
                if (rule instanceof Rule.Exact ? ok : !ok) {
                    matched.push(rule.value);
                }
            }
            else if (rule instanceof Rule.Contains ||
                rule instanceof Rule.NotContains) {
                let ok = false;
                if (items.length <= input.length) {
                    ok = items.every((item) => input.contains(item));
                }
                if (rule instanceof Rule.Contains ? ok : !ok) {
                    matched.push(rule.value);
                }
            }
            else if (rule instanceof Rule.Empty) {
                if (input.length === 0) {
                    matched.push(rule.value);
                }
            }
            else {
                throw new TypeError(`invalid rule type: ${rule.constructor.name}`);
            }
        }
        return matched;
    }
}
class WindowUtils {
    constructor(_plugin) {
        this._plugin = _plugin;
        this._windows = {};
    }
    initWindow(win) {
        win.mid = genRandomStr(8);
        return win;
    }
    registerWindow(win) {
        if (typeof win.mid === 'undefined') {
            win = this.initWindow(win);
            if (this._plugin.settings.enableLog) {
                log('info', 'window registered', { mid: win.mid, window: win });
            }
            this._windows[win.mid] = win;
        }
    }
    unregisterWindow(win) {
        if (typeof win.mid !== 'undefined') {
            delete this._windows[win.mid];
            log('info', 'window unregistered', { mid: win.mid, window: win });
            win.mid = undefined;
        }
    }
    getRecords() {
        return this._windows;
    }
    getWindow(mid) {
        return this._windows[mid];
    }
}
const getPlatform = () => {
    const platform = window.navigator.platform;
    switch (platform.slice(0, 3)) {
        case 'Mac':
            return Platform.Mac;
        case 'Win':
            return Platform.Win;
        default:
            return Platform.Linux;
    }
};
const getModifiersFromMouseEvt = (evt) => {
    const { altKey, ctrlKey, metaKey, shiftKey } = evt;
    const mods = [];
    if (altKey) {
        mods.push(Modifier.Alt);
    }
    if (ctrlKey) {
        mods.push(Modifier.Ctrl);
    }
    if (metaKey) {
        mods.push(Modifier.Meta);
    }
    if (shiftKey) {
        mods.push(Modifier.Shift);
    }
    return mods;
};
const genRandomChar = (radix) => {
    return Math.floor(Math.random() * radix)
        .toString(radix)
        .toLocaleUpperCase();
};
const genRandomStr = (len) => {
    const id = [];
    for (const _ of ' '.repeat(len)) {
        id.push(genRandomChar(36));
    }
    return id.join('');
};
const getValidHttpURL = (url) => {
    if (typeof url === 'undefined') {
        return null;
    }
    else if (url instanceof URL) {
        return ['http:', 'https:'].indexOf(url.protocol) != -1
            ? url.toString()
            : null;
    }
    else {
        try {
            return getValidHttpURL(new URL(url));
        }
        catch (TypeError) {
            return null;
        }
    }
};
const getValidModifiers = (platform) => {
    if (platform === Platform.Unknown) {
        return ['none'];
    }
    else {
        return ['none', 'ctrl', 'meta', 'alt', 'shift'];
    }
};
const log = (level, title, message) => {
    let logger;
    if (level === 'warn') {
        logger = console.warn;
    }
    else if (level === 'error') {
        logger = console.error;
    }
    else {
        logger = console.info;
    }
    logger(`[open-link-with] ${title}`, message);
};

const checkClickable = (el) => {
    const res = {
        is_clickable: false,
        url: null,
        paneType: undefined,
        modifier_rules: [],
    };
    const CTRL = obsidian.Platform.isMacOS ? Modifier.Meta : Modifier.Ctrl;
    const ALT = Modifier.Alt;
    const SHIFT = Modifier.Shift;
    //  - links in read mode
    if (el.classList.contains('external-link')) {
        res.is_clickable = true;
        res.url = el.getAttribute('href');
        res.modifier_rules = [
            new Rule.Exact([CTRL], 'tab'),
            new Rule.Exact([CTRL, ALT], 'split'),
            new Rule.Exact([CTRL, SHIFT], 'tab'),
            new Rule.Exact([CTRL, ALT, SHIFT], 'window'),
            new Rule.Contains([], undefined), // fallback
        ];
    }
    //  -
    if (el.classList.contains('clickable-icon')) ;
    //  - links in live preview mode
    if (el.classList.contains('cm-underline')) {
        res.is_clickable = null;
        // res.url = // determined by `window._builtInOpen`
        res.modifier_rules = [
            new Rule.Empty(undefined),
            new Rule.Exact([CTRL], 'tab'),
            new Rule.Exact([CTRL, ALT], 'split'),
            new Rule.Exact([CTRL, SHIFT], 'tab'),
            new Rule.Exact([CTRL, ALT, SHIFT], 'window'),
        ];
    }
    //  - links in edit mode
    if (el.classList.contains('cm-url')) {
        res.is_clickable = null;
        // res.url = // determined by `window._builtInOpen`
        res.modifier_rules = [
            new Rule.Exact([CTRL], undefined),
            new Rule.Exact([CTRL, ALT], 'split'),
            new Rule.Exact([CTRL, SHIFT], 'tab'),
            new Rule.Exact([CTRL, ALT, SHIFT], 'window'),
        ];
    }
    // - links in community plugins' readme
    if (res.is_clickable === false && el.tagName === 'A') {
        let p = el;
        while (p.tagName !== 'BODY') {
            if (p.classList.contains('internal-link')) {
                break;
            }
            else if (p.classList.contains('community-modal-info')) {
                res.is_clickable = true;
                res.url = el.getAttribute('href');
                res.paneType =
                    el.getAttribute('target') === '_blank'
                        ? 'window'
                        : res.paneType;
                break;
            }
            p = p.parentElement;
        }
    }
    return res;
};
class LocalDocClickHandler {
    constructor(clickUilts) {
        this.clickUilts = clickUilts;
        this._enabled = false;
        this._handleAuxClick = false;
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(val) {
        this._enabled = val;
    }
    get handleAuxClick() {
        return this._handleAuxClick;
    }
    set handleAuxClick(val) {
        this._handleAuxClick = val;
    }
    call(evt) {
        const win = evt.doc.win;
        if (typeof win.mid !== 'undefined' && this._enabled) {
            this._handler(evt);
        }
    }
    _handler(evt) {
        const el = evt.target;
        const win = evt.doc.win;
        const modifiers = getModifiersFromMouseEvt(evt);
        const clickable = checkClickable(el);
        let fire = true;
        let url = clickable.url;
        if (win.oolwPendingUrls.length > 0) {
            // win.oolwPendingUrls for getting correct urls from default open API
            url = win.oolwPendingUrls.pop();
        }
        else {
            // for urls could be invalid (inner links)
            if (url !== null && !getValidHttpURL(url)) {
                fire = false;
                win._builtInOpen(url);
            }
        }
        if (clickable.is_clickable === false && url === null) {
            return false;
        }
        let { paneType } = clickable;
        if (url === null) {
            fire = false;
        }
        if (clickable.modifier_rules.length > 0) {
            const checker = new RulesChecker(clickable.modifier_rules);
            const matched = checker.check(modifiers, {
                breakOnFirstSuccess: true,
            });
            if (matched.length == 0) {
                if (clickable.is_clickable) ;
                else {
                    fire = false;
                }
            }
            else if (matched[0] === false) {
                fire = false;
            }
            else if (typeof matched[0] === 'undefined') {
                paneType = undefined;
            }
            else {
                paneType = matched[0];
            }
        }
        // apply on middle click only
        if (this.handleAuxClick && evt.button === 2) {
            fire = false;
        }
        evt.preventDefault();
        if (this.clickUilts._plugin.settings.enableLog) {
            log('info', 'click event (LocalDocClickHandler)', {
                is_aux: this.handleAuxClick,
                clickable,
                url,
                modifiers,
                btn: evt.button,
            });
        }
        if (!fire) {
            return false;
        }
        const dummy = evt.doc.createElement('a');
        const cid = genRandomStr(4);
        dummy.setAttribute('href', url);
        dummy.setAttribute('oolw-pane-type', paneType || '');
        dummy.setAttribute('oolw-cid', cid);
        dummy.addClass('oolw-external-link-dummy');
        evt.doc.body.appendChild(dummy);
        //
        const e_cp = new MouseEvent(evt.type, evt);
        dummy.dispatchEvent(e_cp);
        dummy.remove();
    }
}
class ClickUtils {
    constructor(_plugin, _windowUtils) {
        this._plugin = _plugin;
        this._windowUtils = _windowUtils;
        this._localHandlers = {};
    }
    initDocClickHandler(win) {
        if (!this._localHandlers.hasOwnProperty(win.mid)) {
            const clickHandler = new LocalDocClickHandler(this);
            clickHandler.enabled = true;
            const auxclickHandler = new LocalDocClickHandler(this);
            auxclickHandler.enabled = true;
            auxclickHandler.handleAuxClick = true;
            //
            win.document.addEventListener('click', clickHandler.call.bind(clickHandler));
            win.document.addEventListener('auxclick', auxclickHandler.call.bind(auxclickHandler));
            //
            this._localHandlers[win.mid] = {
                click: clickHandler,
                auxclick: auxclickHandler,
            };
        }
    }
    removeDocClickHandler(win) {
        if (this._localHandlers.hasOwnProperty(win.mid)) {
            const handlers = this._localHandlers[win.mid];
            handlers.click.enabled = false;
            handlers.auxclick.enabled = false;
            win.document.removeEventListener('click', handlers.click.call.bind(handlers.click));
            win.document.removeEventListener('auxclick', handlers.auxclick.call.bind(handlers.auxclick));
            delete this._localHandlers[win.mid];
        }
    }
    overrideDefaultWindowOpen(win, enabled = true) {
        if (enabled && typeof win._builtInOpen === 'undefined') {
            win._builtInOpen = win.open;
            win.oolwCIDs = [];
            win.oolwPendingUrls = [];
            win.open = (url, target, feature) => {
                if (this._plugin.settings.enableLog) {
                    log('info', 'Obsidian.window._builtInOpen', {
                        url,
                        target,
                        feature,
                    });
                }
                const validUrl = getValidHttpURL(url);
                if (validUrl === null) {
                    return win._builtInOpen(url, target, feature);
                }
                else {
                    win.oolwPendingUrls.push(validUrl);
                    return win;
                }
            };
        }
        else if (!enabled && typeof win._builtInOpen !== 'undefined') {
            win.open = win._builtInOpen;
            delete win._builtInOpen;
            delete win.oolwCIDs;
            delete win.oolwPendingUrls;
        }
    }
}

const BROWSER_SYSTEM = {
    val: '_system',
    display: 'system-default',
};
const BROWSER_GLOBAL = {
    val: '_global',
    display: 'global',
};
const BROWSER_IN_APP = {
    val: '_in_app',
    display: 'in-app view (always new split)',
};
const BROWSER_IN_APP_LAST = {
    val: '_in_app_last',
    display: 'in-app view',
};
const _isExecutableExist = (fp) => __awaiter(void 0, void 0, void 0, function* () {
    return fs.existsSync(fp);
});
const _isExecutableAvailable = (exec) => __awaiter(void 0, void 0, void 0, function* () {
    return child_process.spawnSync('which', [exec]).status === 0;
});
const PRESET_BROWSERS = {
    safari: {
        darwin: {
            sysCmd: 'open',
            sysArgs: ['-a'],
            cmd: 'safari',
            optional: {},
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () {
                return true;
            }),
        },
    },
    firefox: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Firefox.app', 'Contents', 'MacOS', 'firefox'),
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        linux: {
            cmd: 'firefox',
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableAvailable(b.cmd); }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files', 'Mozilla Firefox', 'firefox.exe'),
            optional: {
                private: {
                    args: ['--private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
    },
    chrome: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Google Chrome.app', 'Contents', 'MacOS', 'Google Chrome'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        linux: {
            cmd: 'google-chrome',
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableAvailable(b.cmd); }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
    },
    chromium: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        linux: {
            cmd: 'chromium-browser',
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableAvailable(b.cmd); }),
        },
    },
    edge: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Microsoft Edge.app', 'Contents', 'MacOS', 'Microsoft Edge'),
            optional: {
                private: {
                    args: ['-inprivate'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files (x86)', 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
            optional: {
                private: {
                    args: ['-inprivate'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
    },
    brave: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Brave Browser.app', 'Contents', 'MacOS', 'Brave Browser'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        linux: {
            cmd: 'brave-browser',
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableAvailable(b.cmd); }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files', 'BraveSoftware', 'Brave-Browser', 'Application', 'brave.exe'),
            optional: {
                private: {
                    args: ['-incognito'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
    },
    waterfox: {
        darwin: {
            cmd: path__namespace.join('/Applications', 'Waterfox.app', 'Contents', 'MacOS', 'Waterfox'),
            optional: {
                private: {
                    args: ['-private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
        linux: {
            cmd: 'waterfox',
            optional: {
                private: {
                    args: ['-private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableAvailable(b.cmd); }),
        },
        win32: {
            cmd: path__namespace.join('c:', 'Program Files', 'Waterfox', 'waterfox.exe'),
            optional: {
                private: {
                    args: ['-private-window'],
                },
            },
            isAvailable: (b) => __awaiter(void 0, void 0, void 0, function* () { return _isExecutableExist(b.cmd); }),
        },
    },
};
const MODIFIER_TEXT_FALLBACK = {
    none: 'None',
    meta: 'Meta',
    alt: 'Alt',
    ctrl: 'Ctrl',
    shift: 'Shift',
};
const MODIFIER_TEXT = {
    mac: {
        meta: 'Cmd⌘',
        alt: 'Option⌥',
        ctrl: 'Control⌃',
        shift: 'Shift⇧',
    },
    win: {
        meta: 'Windows',
    },
};

const openWith = (url, cmd, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const _spawn = (args) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((res) => {
            var _a, _b;
            const _args = [...args];
            const reg = RegExp(/^[^"|'](.+)(?<!\\)(\ ){1}/);
            const match = reg.exec(_args[0]);
            if (match !== null) {
                // TODO: may have potential issues
                _args[0] = `"${_args[0]}"`;
            }
            reg.exec(_args[0]);
            if ((_a = options === null || options === void 0 ? void 0 : options.enableLog) !== null && _a !== void 0 ? _a : false) {
                log('info', 'opening', _args.join(' '));
            }
            const child = child_process.spawn(_args[0], args.slice(1), {
                stdio: 'ignore',
                shell: true,
            });
            child.on('exit', (code) => {
                res(code);
            });
            setTimeout(() => {
                res(0);
            }, (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : 250);
        });
    });
    const target = '$TARGET_URL';
    let match = false;
    const _cmd = cmd.map((arg) => {
        const idx = arg.indexOf(target);
        if (idx !== -1) {
            match = true;
            return (arg.slice(0, idx) +
                encodeURIComponent(url) +
                arg.slice(idx + target.length));
        }
        else {
            return arg;
        }
    });
    if (!match) {
        _cmd.push(url);
    }
    return yield _spawn(_cmd);
});

class Browser {
    constructor(name, defaultCMD) {
        this.name = name;
        this.getExecCommands = (platform) => {
            var _a, _b;
            const res = {};
            let bp = this.profiles[platform];
            for (const pvt of [0, 1]) {
                const cmds = [];
                let bpBase;
                if (pvt) {
                    if (!((_a = bp === null || bp === void 0 ? void 0 : bp.optional) === null || _a === void 0 ? void 0 : _a.private)) {
                        continue;
                    }
                    bpBase = Object.assign(Object.assign({}, bp), ((_b = bp.optional.private) !== null && _b !== void 0 ? _b : {}));
                }
                else {
                    bpBase = bp;
                }
                if (bpBase.sysCmd) {
                    cmds.push(bpBase.sysCmd);
                }
                if (bpBase.sysArgs) {
                    bpBase.sysArgs.forEach((arg) => cmds.push(arg));
                }
                cmds.push(bpBase.cmd);
                if (bpBase.args) {
                    bpBase.args.forEach((arg) => cmds.push(arg));
                }
                if (pvt) {
                    res.private = cmds;
                }
                else {
                    res.main = cmds;
                }
            }
            return res;
        };
        this.name = name;
        this.profiles = defaultCMD;
    }
}
const getPresetBrowsers = () => {
    const presets = [];
    for (const name of Object.keys(PRESET_BROWSERS)) {
        presets.push(new Browser(name, PRESET_BROWSERS[name]));
    }
    return presets;
};
class ProfileMgr {
    constructor() {
        this.loadValidPresetBrowsers = () => __awaiter(this, void 0, void 0, function* () {
            this._preset_browser = [];
            const presets = getPresetBrowsers();
            const os$1 = os.platform();
            presets.forEach((browser) => __awaiter(this, void 0, void 0, function* () {
                const { profiles, name } = browser;
                let app = profiles[os$1];
                if (typeof app !== 'undefined' &&
                    app.isAvailable &&
                    (yield app.isAvailable(app))) {
                    this._preset_browser.push(browser);
                }
            }));
        });
        this.getBrowsers = () => {
            return [...this._preset_browser, ...this._browsers];
        };
        this.getBrowsersCMD = (custom) => {
            const res = {};
            this.getBrowsers().forEach((browser) => {
                const cmds = browser.getExecCommands(os.platform());
                res[browser.name] = cmds.main;
                if (typeof cmds.private !== 'undefined') {
                    res[browser.name + '-private'] = cmds.private;
                }
            });
            return Object.assign(Object.assign({}, res), custom);
        };
        this._browsers = [];
    }
}

class InAppView extends obsidian.ItemView {
    constructor(leaf, url) {
        super(leaf);
        this.url = url;
        this.icon = 'link';
        this.title = new URL(url).host;
        // TODO: remove this after tab title issue is fixed
        this.leaf.setPinned(true);
        setTimeout(() => {
            this.leaf.setPinned(false);
        }, 10);
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
            const frame_styles = [
                'height: 100%',
                'width: 100%',
                'background-color: white', // for pages with no background
            ];
            this.frame = document.createElement('iframe');
            this.frame.setAttr('style', frame_styles.join('; '));
            this.frame.setAttr('src', this.url);
            this.containerEl.children[1].appendChild(this.frame);
        });
    }
    getDisplayText() {
        return this.title;
    }
    getViewType() {
        return 'OOLW::InAppView';
    }
}
class ViewMgr {
    constructor(plugin) {
        this.plugin = plugin;
    }
    _getLeafId(leaf) {
        var _a;
        return (_a = leaf['id']) !== null && _a !== void 0 ? _a : '';
    }
    _validRecords() {
        var _a;
        const records = (_a = this.plugin.settings.inAppViewRec) !== null && _a !== void 0 ? _a : [];
        const validRec = [];
        try {
            for (const rec of records) {
                if (this.plugin.app.workspace.getLeafById(rec.leafId) !== null) {
                    validRec.push(rec);
                }
            }
        }
        catch (err) {
            if (this.plugin.settings.enableLog) {
                log('error', 'failed to restore views', `${err}`);
            }
        }
        return validRec;
    }
    createView(url, mode, options = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const getNewLeafId = () => {
                const newLeaf = typeof options.paneType === 'undefined'
                    ? false
                    : options.paneType;
                const leaf = this.plugin.app.workspace.getLeaf(newLeaf === false ? 'tab' : newLeaf // TODO: missing navigation; using tab for now
                );
                return this._getLeafId(leaf);
            };
            let id = undefined;
            // TODO: more robust open behaviors
            if (typeof options.paneType !== 'undefined' || mode === ViewMode.NEW) {
                id = getNewLeafId();
            }
            else {
                const viewRec = this._validRecords();
                let rec = (_a = viewRec.find(({ mode }) => mode === ViewMode.LAST)) !== null && _a !== void 0 ? _a : viewRec.find(({ mode }) => mode === ViewMode.NEW);
                id = (_b = rec === null || rec === void 0 ? void 0 : rec.leafId) !== null && _b !== void 0 ? _b : getNewLeafId();
            }
            return yield this.updateView(id, url, mode, options === null || options === void 0 ? void 0 : options.focus);
        });
    }
    updateView(leafId, url, mode, focus = true) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const leaf = this.plugin.app.workspace.getLeafById(leafId);
            if (leaf === null) {
                return null;
            }
            else {
                const view = new InAppView(leaf, url);
                yield leaf.open(view);
                const rec = this.plugin.settings.inAppViewRec.find((rec) => rec.leafId === leafId);
                if (typeof rec !== 'undefined') {
                    rec.url = url;
                    // TODO:
                    rec.mode = (_a = rec.mode) !== null && _a !== void 0 ? _a : mode;
                }
                else {
                    this.plugin.settings.inAppViewRec.unshift({
                        leafId,
                        url,
                        mode,
                    });
                }
                yield this.plugin.saveSettings();
                // this.plugin.app.workspace.setActiveLeaf(leaf, { focus }) // TODO: option `focus` is not working (cliVer == 1.1.9)
                if (focus) {
                    this.plugin.app.workspace.setActiveLeaf(leaf);
                }
                return leafId;
            }
        });
    }
    restoreView() {
        return __awaiter(this, void 0, void 0, function* () {
            const viewRec = this._validRecords();
            const restored = [];
            for (const rec of viewRec) {
                if ((yield this.updateView(rec.leafId, rec.url, rec.mode, false)) !== null) {
                    restored.push(rec);
                }
            }
            this.plugin.settings.inAppViewRec = restored;
            yield this.plugin.saveSettings();
        });
    }
}

const DEFAULT_SETTINGS = {
    selected: BROWSER_SYSTEM.val,
    custom: {},
    modifierBindings: [],
    enableLog: false,
    timeout: 500,
    inAppViewRec: [],
};
class OpenLinkPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            this._viewmgr = new ViewMgr(this);
            yield this.loadSettings();
            this.profiles = new ProfileMgr();
            yield this.profiles.loadValidPresetBrowsers();
            const extLinkClick = (evt, validClassName, options = {}) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const win = activeWindow;
                const el = evt.target;
                if (!el.classList.contains(validClassName)) {
                    return;
                }
                const oolwCID = el.getAttribute('oolw-cid');
                if (typeof oolwCID !== 'undefined') {
                    if (win.oolwCIDs.contains(oolwCID)) {
                        return; // FIXME: prevent double click
                    }
                    else {
                        win.oolwCIDs.push(oolwCID);
                        setTimeout(() => {
                            win.oolwCIDs.remove(oolwCID);
                        }, 10);
                    }
                }
                const { button, altKey, ctrlKey, metaKey, shiftKey } = evt;
                let modifier = 'none';
                if (altKey) {
                    modifier = 'alt';
                }
                else if (ctrlKey) {
                    modifier = 'ctrl';
                }
                else if (metaKey) {
                    modifier = 'meta';
                }
                else if (shiftKey) {
                    modifier = 'shift';
                }
                // const modifiers = getModifiersFromMouseEvt(evt)
                const url = el.getAttr('href');
                const matchedMB = this.settings.modifierBindings.find((mb) => {
                    if (mb.auxClickOnly && button != MouseButton.Auxiliary) {
                        return false;
                    }
                    else {
                        return mb.modifier === modifier;
                    }
                });
                const profileName = (_a = matchedMB === null || matchedMB === void 0 ? void 0 : matchedMB.browser) !== null && _a !== void 0 ? _a : this.settings.selected;
                const paneType = el.getAttr('target') === '_blank'
                    ? 'window' // higher priority
                    : el.getAttr('oolw-pane-type') || undefined;
                const cmd = this._getOpenCMD(profileName);
                if (this.settings.enableLog) {
                    log('info', 'click event (extLinkClick)', {
                        click: {
                            button,
                            altKey,
                            ctrlKey,
                            metaKey,
                            shiftKey,
                        },
                        el,
                        modifier,
                        mouseEvent: evt,
                        win: evt.doc.win,
                        mid: evt.doc.win.mid,
                        url,
                        profileName,
                        paneType,
                        cmd,
                        matchedBinding: matchedMB,
                    });
                }
                // right click trigger (windows only)
                if (typeof options.allowedButton != 'undefined' &&
                    button != options.allowedButton) {
                    return;
                }
                // in-app view
                if (profileName === BROWSER_IN_APP.val) {
                    evt.preventDefault();
                    this._viewmgr.createView(url, ViewMode.NEW, {
                        focus: matchedMB === null || matchedMB === void 0 ? void 0 : matchedMB.focusOnView,
                        paneType,
                    });
                    return;
                }
                if (profileName === BROWSER_IN_APP_LAST.val) {
                    evt.preventDefault();
                    this._viewmgr.createView(url, ViewMode.LAST, {
                        focus: matchedMB === null || matchedMB === void 0 ? void 0 : matchedMB.focusOnView,
                        paneType,
                    });
                    return;
                }
                if (typeof cmd !== 'undefined') {
                    evt.preventDefault();
                    const code = yield openWith(url, cmd, {
                        enableLog: this.settings.enableLog,
                        timeout: this.settings.timeout,
                    });
                    if (code !== 0) {
                        if (this.settings.enableLog) {
                            log('error', 'failed to open', `'spawn' exited with code ${code} when ` +
                                `trying to open an external link with ${profileName}.`);
                        }
                        win._builtInOpen(url);
                    }
                }
                else {
                    win._builtInOpen(url);
                }
            });
            //
            this.addSettingTab(new SettingTab(this.app, this));
            //
            this._windowUtils = new WindowUtils(this);
            this._clickUtils = new ClickUtils(this, this._windowUtils);
            const initWindow = (win) => {
                this._windowUtils.registerWindow(win);
                this._clickUtils.overrideDefaultWindowOpen(win, true);
                this._clickUtils.initDocClickHandler(win);
                this.registerDomEvent(win, 'click', (evt) => {
                    return extLinkClick(evt, 'oolw-external-link-dummy', {
                        allowedButton: MouseButton.Main,
                    });
                });
                this.registerDomEvent(win, 'auxclick', (evt) => {
                    return extLinkClick(evt, 'oolw-external-link-dummy', {
                        allowedButton: MouseButton.Auxiliary,
                    });
                });
            };
            initWindow(activeWindow);
            this.app.workspace.on('window-open', (ww, win) => {
                initWindow(win);
            });
            this.app.workspace.on('window-close', (ww, win) => {
                this._oolwUnloadWindow(win);
            });
            //
            this.app.workspace.onLayoutReady(() => __awaiter(this, void 0, void 0, function* () {
                yield this._viewmgr.restoreView();
                if (this.settings.enableLog) {
                    log('info', 'restored views', this.settings.inAppViewRec);
                }
            }));
        });
    }
    onunload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this._windowUtils !== 'undefined') {
                Object.keys(this._windowUtils.getRecords()).forEach((mid) => {
                    this._oolwUnloadWindowByMID(mid);
                });
                delete this._clickUtils;
                delete this._windowUtils;
            }
        });
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.settings.enableLog) {
                log('info', 'saving settings', this.settings);
            }
            yield this.saveData(this.settings);
        });
    }
    _getOpenCMD(val) {
        if (val === BROWSER_SYSTEM.val) {
            return undefined;
        }
        if (val === BROWSER_GLOBAL.val) {
            val = this.settings.selected;
        }
        return this.profiles.getBrowsersCMD(this.settings.custom)[val];
    }
    _oolwUnloadWindow(win) {
        if (typeof this._clickUtils !== 'undefined') {
            this._clickUtils.removeDocClickHandler(win);
            this._clickUtils.overrideDefaultWindowOpen(win, false);
        }
        if (typeof this._windowUtils !== 'undefined') {
            this._windowUtils.unregisterWindow(win);
        }
    }
    _oolwUnloadWindowByMID(mid) {
        if (typeof this._windowUtils !== 'undefined') {
            const win = this._windowUtils.getWindow(mid);
            if (typeof win !== 'undefined') {
                this._oolwUnloadWindow(win);
            }
        }
    }
}
class PanicModal extends obsidian.Modal {
    constructor(app, message) {
        super(app);
        this.message = message;
        this.message = message;
    }
    onOpen() {
        let { contentEl } = this;
        contentEl.setText(this.message);
    }
    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }
}
class SettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.plugin = plugin;
        this._profileChangeHandler = obsidian.debounce((val) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const profiles = JSON.parse(val);
                this.plugin.settings.custom = profiles;
                yield this.plugin.saveSettings();
                this._render();
            }
            catch (e) {
                this.panic((_b = (_a = e.message) !== null && _a !== void 0 ? _a : e.toString()) !== null && _b !== void 0 ? _b : 'some error occurred in open-link-with');
            }
        }), 1500, true);
        this._timeoutChangeHandler = obsidian.debounce((val) => __awaiter(this, void 0, void 0, function* () {
            const timeout = parseInt(val);
            if (Number.isNaN(timeout)) {
                this.panic('Value of timeout should be interger.');
            }
            else {
                this.plugin.settings.timeout = timeout;
                yield this.plugin.saveSettings();
                this._render();
            }
        }), 1500, true);
    }
    panic(msg) {
        new PanicModal(this.app, msg).open();
    }
    _render() {
        let { containerEl } = this;
        containerEl.empty();
        new obsidian.Setting(containerEl)
            .setName('Browser')
            .setDesc('Open external link with selected browser.')
            .addDropdown((dd) => {
            const browsers = [
                BROWSER_SYSTEM,
                BROWSER_IN_APP_LAST,
                BROWSER_IN_APP,
                ...Object.keys(this.plugin.profiles.getBrowsersCMD(this.plugin.settings.custom)).map((b) => {
                    return { val: b };
                }),
            ];
            let current = browsers.findIndex(({ val }) => val === this.plugin.settings.selected);
            if (current !== -1) {
                browsers.unshift(browsers.splice(current, 1)[0]);
            }
            browsers.forEach((b) => { var _a; return dd.addOption(b.val, (_a = b.display) !== null && _a !== void 0 ? _a : b.val); });
            dd.onChange((p) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.selected = p;
                yield this.plugin.saveSettings();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Customization')
            .setDesc('Customization profiles in JSON.')
            .addTextArea((text) => text
            .setPlaceholder('{}')
            .setValue(JSON.stringify(this.plugin.settings.custom, null, 4))
            .onChange(this._profileChangeHandler));
        const mbSetting = new obsidian.Setting(containerEl)
            .setName('Modifier Bindings')
            .setDesc('Matching from top to bottom')
            .addButton((btn) => {
            btn.setButtonText('New');
            btn.onClick((_) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.modifierBindings.unshift({
                    id: genRandomStr(6),
                    platform: Platform.Unknown,
                    modifier: 'none',
                    focusOnView: true,
                    auxClickOnly: false,
                });
                yield this.plugin.saveSettings();
                this._render();
            }));
        });
        const mbSettingEl = mbSetting.settingEl;
        mbSettingEl.setAttr('style', 'flex-wrap:wrap');
        const bindings = this.plugin.settings.modifierBindings;
        bindings.forEach((mb) => {
            const ctr = document.createElement('div');
            ctr.setAttr('style', 'flex-basis:100%;height:auto;margin-top:18px');
            const mini = document.createElement('div');
            const kb = new obsidian.Setting(mini);
            kb.addDropdown((dd) => {
                var _a;
                const browsers = [
                    BROWSER_GLOBAL,
                    BROWSER_IN_APP_LAST,
                    BROWSER_IN_APP,
                    ...Object.keys(this.plugin.profiles.getBrowsersCMD(this.plugin.settings.custom)).map((b) => {
                        return { val: b };
                    }),
                    BROWSER_SYSTEM,
                ];
                browsers.forEach((b) => {
                    var _a;
                    dd.addOption(b.val, (_a = b.display) !== null && _a !== void 0 ? _a : b.val);
                });
                dd.setValue((_a = mb.browser) !== null && _a !== void 0 ? _a : BROWSER_GLOBAL.val);
                dd.onChange((browser) => __awaiter(this, void 0, void 0, function* () {
                    if (browser === BROWSER_GLOBAL.val) {
                        browser = undefined;
                    }
                    this.plugin.settings.modifierBindings.find((m) => m.id === mb.id).browser = browser;
                    yield this.plugin.saveSettings();
                    this._render();
                }));
            });
            kb.addToggle((toggle) => {
                toggle.toggleEl.setAttribute('id', 'oolw-aux-click-toggle');
                toggle.setValue(mb.auxClickOnly);
                toggle.setTooltip('Triggers on middle mouse button click only');
                toggle.onChange((val) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.modifierBindings.find((m) => m.id === mb.id).auxClickOnly = val;
                    yield this.plugin.saveSettings();
                }));
            });
            kb.addToggle((toggle) => {
                toggle.toggleEl.setAttribute('id', 'oolw-view-focus-toggle');
                if (mb.browser === BROWSER_IN_APP.val ||
                    mb.browser === BROWSER_IN_APP_LAST.val) {
                    toggle.setDisabled(false);
                    toggle.setValue(mb.focusOnView);
                }
                else {
                    toggle.toggleEl.setAttribute('style', 'opacity:0.2');
                    toggle.setDisabled(true);
                    toggle.setValue(false);
                }
                toggle.setTooltip('Focus on view after opening/updating (in-app browser only)');
                toggle.onChange((val) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.modifierBindings.find((m) => m.id === mb.id).focusOnView = val;
                    yield this.plugin.saveSettings();
                }));
            });
            kb.addDropdown((dd) => {
                const platform = getPlatform();
                getValidModifiers(platform).forEach((m) => {
                    dd.addOption(m, Object.assign(Object.assign({}, MODIFIER_TEXT_FALLBACK), MODIFIER_TEXT[platform])[m]);
                });
                dd.setValue(mb.modifier);
                dd.onChange((modifier) => __awaiter(this, void 0, void 0, function* () {
                    this.plugin.settings.modifierBindings.find((m) => m.id === mb.id).modifier = modifier;
                    yield this.plugin.saveSettings();
                }));
            });
            kb.addButton((btn) => {
                btn.setButtonText('Remove');
                btn.setClass('mod-warning');
                btn.onClick((_) => __awaiter(this, void 0, void 0, function* () {
                    const idx = this.plugin.settings.modifierBindings.findIndex((m) => m.id === mb.id);
                    this.plugin.settings.modifierBindings.splice(idx, 1);
                    yield this.plugin.saveSettings();
                    this._render();
                }));
            });
            kb.controlEl.setAttr('style', 'justify-content: space-between !important;');
            mbSettingEl.appendChild(ctr);
            ctr.appendChild(kb.controlEl);
        });
        new obsidian.Setting(containerEl)
            .setName('Logs')
            .setDesc('Display logs in console (open developer tools to view).')
            .addToggle((toggle) => {
            toggle.setValue(this.plugin.settings.enableLog);
            toggle.onChange((val) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.enableLog = val;
                yield this.plugin.saveSettings();
                this._render();
            }));
        });
        new obsidian.Setting(containerEl)
            .setName('Timeout')
            .addText((text) => text
            .setPlaceholder('500')
            .setValue(this.plugin.settings.timeout.toString())
            .onChange(this._timeoutChangeHandler));
    }
    display() {
        this._render();
    }
}

module.exports = OpenLinkPlugin;


/* nosourcemap */