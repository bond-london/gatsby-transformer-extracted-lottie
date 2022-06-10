// import { readFile } from "fs/promises";
// import type { CreateResolversArgs, Reporter } from "gatsby";
// import {
//   createFileNodeFromBuffer,
//   FileSystemNode,
// } from "gatsby-source-filesystem";

// import renderToSvg from "lottie-to-svg";
// import svgToTinyDataUri from "mini-svg-data-uri";
// import { optimize, OptimizedError, OptimizedSvg } from "svgo";

// export function createResolvers(args: CreateResolversArgs) {
//   const { createResolvers, reporter } = args;
//   reporter.verbose("Creating resolvers for lottie");
//   const resolvers = {
//     File: {
//       lottie: {
//         type: "ExtractedLottie",
//         async resolve(parent: FileSystemNode) {
//           const name = parent.absolutePath.toLowerCase();
//           if (name.endsWith(".json") || name.endsWith(".lottie")) {
//             return await parseLottie(parent.absolutePath, args);
//           } else {
//             return null;
//           }
//         },
//       },
//     },
//   };
//   createResolvers(resolvers);
// }
