import { Button } from "@chakra-ui/react";
import { motion, type MotionProps } from "framer-motion";

const MotionButton = motion(Button);

export function GlowButton({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"button"> &
  MotionProps & { children: React.ReactNode }) {
  return (
    <MotionButton
      rounded="full"
      size="lg"
      variant="subtle"
      whileHover={{
        boxShadow: "0 0 10px 5px rgba(248, 159, 26, 0.74)",
      }}
      whileTap={{ y: 2 }}
      transition={{ type: "tween", duration: 0.5 }}
      {...props}
    >
      {children}
    </MotionButton>
  );
}
