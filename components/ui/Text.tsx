import { useThemeColor } from "@/hooks/useThemeColor";
import { cn } from "@/utils/styling";
import { Text as NativeText } from "react-native";

export type TextProps = React.ComponentProps<typeof NativeText>;

export function Text({ className, style, ...props }: TextProps) {
  const themedTextColor = useThemeColor({}, "text");

  return (
    <NativeText
      className={cn(className)}
      style={[
        {
          color: themedTextColor,
        },
        style,
      ]}
      {...props}
    />
  );
}
