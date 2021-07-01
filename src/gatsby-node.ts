import { CreateResolversArgs, CreateSchemaCustomizationArgs } from "gatsby";
import fs from "fs";
import svgToTinyDataUri from "mini-svg-data-uri";
import { optimize } from "svgo";
import { FileSystemNode } from "gatsby-source-filesystem";
import renderToSvg from "lottie-to-svg";

async function parseLottie(path: string) {
  const animationJson = await fs.promises.readFile(path, "utf8");
  const animationData = JSON.parse(animationJson);
  const svg = await renderToSvg(animationData, {});
  const { data } = await optimize(svg, { multipass: true });
  const encoded = svgToTinyDataUri(data);
  return { animationJson, content: data, encoded };
}

export function createResolvers(args: CreateResolversArgs) {
  const { createResolvers, reporter } = args;
  reporter.verbose("Creating resolvers for lottie");
  const resolvers = {
    File: {
      lottie: {
        type: "ExtractedLottie",
        async resolve(parent: FileSystemNode) {
          const name = parent.absolutePath.toLowerCase();
          reporter.verbose(`Looking at ${name}`);
          if (name.endsWith(".json") || name.endsWith(".lottie")) {
            return await parseLottie(parent.absolutePath);
          } else {
            return null;
          }
        },
      },
    },
  };
  createResolvers(resolvers);
}

export function createSchemaCustomization(args: CreateSchemaCustomizationArgs) {
  const {
    reporter,
    actions: { createTypes },
  } = args;
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
