import { Button, type HTMLChakraProps } from "@chakra-ui/react";
import { motion, type MotionProps } from "framer-motion";

const MotionButton = motion(Button);

export function GlowButton({
  children,
  ...props
}: HTMLChakraProps<"button"> & MotionProps & { children: React.ReactNode }) {
  return (
    <MotionButton
      rounded="full"
      size="lg"
      variant="subtle"
      whileHover={
        props.disabled
          ? {}
          : { boxShadow: "0 0 10px 5px rgba(248, 159, 26, 0.74)" }
      }
      whileTap={props.disabled ? {} : { y: 2 }}
      transition={{ type: "tween", duration: 0.5 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
