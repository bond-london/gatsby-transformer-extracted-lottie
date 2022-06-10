import { CreateSchemaCustomizationArgs } from "gatsby";

export function createSchemaCustomization(args: CreateSchemaCustomizationArgs) {
  const {
    reporter,
    actions: { createTypes },
  } = args;
  reporter.verbose("Create Lottie customization");
  const typeDefs = `
    type ExtractedLottie implements Node {
      encoded: String
      encodedFile: File @link
    }
  `;

  createTypes(typeDefs);
}
