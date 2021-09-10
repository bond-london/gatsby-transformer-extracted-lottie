"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaCustomization = exports.createResolvers = void 0;
const fs_1 = __importDefault(require("fs"));
const mini_svg_data_uri_1 = __importDefault(require("mini-svg-data-uri"));
const svgo_1 = require("svgo");
const lottie_to_svg_1 = __importDefault(require("lottie-to-svg"));
async function parseLottie(path) {
    const animationJson = await fs_1.default.promises.readFile(path, "utf8");
    const animationData = JSON.parse(animationJson);
    const svg = await (0, lottie_to_svg_1.default)(animationData, {});
    const { data } = await (0, svgo_1.optimize)(svg, { multipass: true });
    const encoded = (0, mini_svg_data_uri_1.default)(data);
    return { animationJson, content: data, encoded };
}
function createResolvers(args) {
    const { createResolvers, reporter } = args;
    reporter.verbose("Creating resolvers for lottie");
    const resolvers = {
        File: {
            lottie: {
                type: "ExtractedLottie",
                async resolve(parent) {
                    const name = parent.absolutePath.toLowerCase();
                    reporter.verbose(`Looking at ${name}`);
                    if (name.endsWith(".json") || name.endsWith(".lottie")) {
                        return await parseLottie(parent.absolutePath);
                    }
                    else {
                        return null;
                    }
                },
            },
        },
    };
    createResolvers(resolvers);
}
exports.createResolvers = createResolvers;
function createSchemaCustomization(args) {
    const { reporter, actions: { createTypes }, } = args;
    reporter.verbose("Create Lottie customization");
    const typeDefs = `
  type ExtractedLottie implements Node {
    animationJson: String!
    content: String!
    encoded: String!
  }
`;
    createTypes(typeDefs);
}
exports.createSchemaCustomization = createSchemaCustomization;
//# sourceMappingURL=gatsby-node.js.map