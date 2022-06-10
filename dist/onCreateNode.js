"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateNode = void 0;
var tslib_1 = require("tslib");
var promises_1 = require("fs/promises");
var gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
var lottie_to_svg_1 = tslib_1.__importDefault(require("lottie-to-svg"));
var mini_svg_data_uri_1 = tslib_1.__importDefault(require("mini-svg-data-uri"));
var svgo_1 = require("svgo");
function isOptimizedError(a) {
    return !a.data;
}
function parseLottie(fsNode, args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var reporter, animationJson, animationData, svg, result;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reporter = args.reporter;
                    return [4 /*yield*/, (0, promises_1.readFile)(fsNode.absolutePath, "utf8")];
                case 1:
                    animationJson = _a.sent();
                    animationData = JSON.parse(animationJson);
                    return [4 /*yield*/, (0, lottie_to_svg_1.default)(animationData, {})];
                case 2:
                    svg = _a.sent();
                    result = (0, svgo_1.optimize)(svg, { multipass: true });
                    if (isOptimizedError(result)) {
                        return [2 /*return*/, reporter.panic(result.modernError)];
                    }
                    return [2 /*return*/, { animationJson: animationJson, result: result }];
            }
        });
    });
}
function onCreateNode(args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var node, createNodeId, _a, createNode, createParentChildLink, getCache, reporter, createContentDigest, fsNode, parsed, result, data, _b, width, height, lottieNode, previewNode, lottieNodeInput;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    node = args.node, createNodeId = args.createNodeId, _a = args.actions, createNode = _a.createNode, createParentChildLink = _a.createParentChildLink, getCache = args.getCache, reporter = args.reporter, createContentDigest = args.createContentDigest;
                    if (node.internal.type !== "File")
                        return [2 /*return*/];
                    fsNode = node;
                    reporter.info("Looking at node ".concat(fsNode.absolutePath, " ").concat(fsNode.internal.mediaType || "??"));
                    if (fsNode.internal.mediaType !== "application/json")
                        return [2 /*return*/];
                    reporter.info("Processing node ".concat(fsNode.absolutePath));
                    return [4 /*yield*/, parseLottie(fsNode, args)];
                case 1:
                    parsed = _c.sent();
                    if (!parsed) return [3 /*break*/, 6];
                    result = parsed.result;
                    data = result.data, _b = result.info, width = _b.width, height = _b.height;
                    lottieNode = {
                        id: "".concat(node.id, " >>> Lottie"),
                        parent: node.id,
                        width: width,
                        height: height,
                    };
                    if (!(data.length < 2048)) return [3 /*break*/, 2];
                    lottieNode.encoded = (0, mini_svg_data_uri_1.default)(data);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (0, gatsby_source_filesystem_1.createFileNodeFromBuffer)({
                        buffer: Buffer.from(data),
                        createNode: createNode,
                        createNodeId: createNodeId,
                        getCache: getCache,
                        name: "".concat(fsNode.name, "-preview"),
                        ext: ".svg",
                    })];
                case 3:
                    previewNode = _c.sent();
                    lottieNode.encodedFile = previewNode.id;
                    _c.label = 4;
                case 4:
                    lottieNodeInput = tslib_1.__assign(tslib_1.__assign({}, lottieNode), { internal: {
                            type: "ExtractedLottie",
                            contentDigest: createContentDigest(lottieNode),
                        } });
                    return [4 /*yield*/, createNode(lottieNodeInput)];
                case 5:
                    _c.sent();
                    createParentChildLink({ parent: node, child: lottieNodeInput });
                    _c.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.onCreateNode = onCreateNode;
//# sourceMappingURL=onCreateNode.js.map