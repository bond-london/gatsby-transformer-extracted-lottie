declare module "lottie-to-svg" {
  export default function (
    animationData: unknown,
    opts?: unknown,
    frameNumber?: number
  ): Promise<string>;
}
