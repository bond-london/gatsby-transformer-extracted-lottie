import { readFile } from "fs/promises";
import { CreateNodeArgs, NodeInput } from "gatsby";
import {
  createFileNodeFromBuffer,
  FileSystemNode,
} from "gatsby-source-filesystem";
import renderToSvg from "lottie-to-svg";
import svgToTinyDataUri from "mini-svg-data-uri";
import { optimize, OptimizedError, OptimizedSvg } from "svgo";

function isOptimizedError(
  a: OptimizedSvg | OptimizedError
): a is OptimizedError {
  return !(a as OptimizedSvg).data;
}

async function parseLottie(fsNode: FileSystemNode, args: CreateNodeArgs) {
  const { reporter } = args;
  const animationJson = await readFile(fsNode.absolutePath, "utf8");
  const animationData = JSON.parse(animationJson) as unknown;
  const svg = await renderToSvg(animationData, {});
  const result = optimize(svg, { multipass: true });
  if (isOptimizedError(result)) {
    return reporter.panic(result.modernError);
  }
  return { animationJson, result };
}
interface LottieNode {
  id: string;
  parent: string;
  encoded?: string;
  encodedFile?: string;
  width: string;
  height: string;
}
export async function onCreateNode(args: CreateNodeArgs) {
  const {
    node,
    createNodeId,
    actions: { createNode, createParentChildLink },
    getCache,
    createContentDigest,
  } = args;

  if (node.internal.type !== "File") return;
  const fsNode = node as FileSystemNode;
  if (fsNode.internal.mediaType !== "application/json") return;

  const parsed = await parseLottie(fsNode, args);
  if (parsed) {
    const { result } = parsed;
    const {
      data,
      info: { width, height },
    } = result;

    const lottieNode: LottieNode = {
      id: `${node.id} >>> Lottie`,
      parent: node.id,
      width,
      height,
    };
    if (data.length < 2048) {
      lottieNode.encoded = svgToTinyDataUri(data);
    } else {
      const previewNode = await createFileNodeFromBuffer({
        buffer: Buffer.from(data),
        createNode,
        createNodeId,
        getCache,
        name: `${fsNode.name}-preview`,
        ext: ".svg",
      });
      lottieNode.encodedFile = previewNode.id;
    }
    const lottieNodeInput: NodeInput = {
      ...lottieNode,
      internal: {
        type: "ExtractedLottie",
        contentDigest: createContentDigest(lottieNode),
      },
    };
    await createNode(lottieNodeInput);
    createParentChildLink({ parent: node, child: lottieNodeInput });
  }
}
