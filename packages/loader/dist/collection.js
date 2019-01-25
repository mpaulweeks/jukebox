"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("jukebox-utils/src");
var CollectionLoader = /** @class */ (function () {
    function CollectionLoader(existingCollection) {
        this.data = existingCollection;
    }
    CollectionLoader.prototype.contains = function (songUrl) {
        return !!this.data.songs[songUrl];
    };
    CollectionLoader.prototype.merge = function (songData) {
        var _a;
        this.data.songs = __assign({}, this.data.songs, (_a = {}, _a[songData.source] = __assign({}, songData), _a));
    };
    CollectionLoader.prototype.mergeMany = function (songDatas) {
        var _this = this;
        songDatas.forEach(function (sd) { return _this.merge(sd); });
    };
    CollectionLoader.fromUrlList = function (urlList, existing) {
        return __awaiter(this, void 0, void 0, function () {
            var loader, urlsToUpdate, songPromises, songs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loader = new CollectionLoader(existing);
                        urlsToUpdate = [];
                        urlList.urls.forEach(function (url) {
                            if (!loader.contains(url)) {
                                urlsToUpdate.push(url);
                            }
                        });
                        songPromises = urlsToUpdate.map(function (url) {
                            return src_1.MetaLoader.fromUrl(url).then(function (metaData) { return src_1.compileSongData(url, metaData); });
                        });
                        return [4 /*yield*/, Promise.all(songPromises)];
                    case 1:
                        songs = _a.sent();
                        loader.mergeMany(songs);
                        return [2 /*return*/, loader];
                }
            });
        });
    };
    return CollectionLoader;
}());
exports.CollectionLoader = CollectionLoader;
