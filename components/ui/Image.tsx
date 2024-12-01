import { Image as ExpoImage, type ImageProps } from "expo-image";
import { cssInterop } from "nativewind";

const ImagePrimitive = cssInterop(ExpoImage, {
  className: {
    target: "style",
  },
});

export function Image({ ...props }: ImageProps) {
  return <ImagePrimitive {...props} />;
}
