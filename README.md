Merged with https://github.com/bond-london/bond-theme-development

# gatsby-transformer-extracted-lottie

Transform lottie files producing a preview svg either inline or as a file

It creates a new node called `childExtractedLottie` that contains the width, height and the first frame as an svg, either an encoded data uri, or an encoded file.

```
export const lottieFragment = graphql`
  fragment LottieFile on File {
    publicURL
    childExtractedLottie {
      width
      height
      encoded
      encodedFile {
        publicURL
      }
    }
  }
```
