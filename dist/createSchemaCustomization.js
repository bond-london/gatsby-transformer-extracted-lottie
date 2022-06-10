"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemaCustomization = void 0;
function createSchemaCustomization(args) {
    var reporter = args.reporter, createTypes = args.actions.createTypes;
    reporter.verbose("Create Lottie customization");
    var typeDefs = "\n    type ExtractedLottie implements Node {\n      encoded: String\n      encodedFile: File @link\n    }\n  ";
    createTypes(typeDefs);
}
exports.createSchemaCustomization = createSchemaCustomization;
//# sourceMappingURL=createSchemaCustomization.js.map