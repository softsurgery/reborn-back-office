import React from "react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";
import { motion, useAnimation } from "framer-motion";

interface LoaderProps {
  isPending: boolean;
  size?: "small" | "large" | number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  isPending,
  size = "large",
  className,
}) => {
  const controls = useAnimation();

  React.useEffect(() => {
    controls.start({
      opacity: isPending ? 1 : 0,
      height: isPending
        ? size === "small"
          ? 100
          : size === "large"
          ? 200
          : size
        : 0,
      transition: { duration: 0.3 },
    });
  }, [isPending, size, controls]);

  const pixelSize =
    size === "small" ? 100 : size === "large" ? 200 : size || 200;

  return (
    <motion.div animate={controls} className={cn("overflow-hidden", className)}>
      {isPending && (
        <Lottie
          animationData={require("~/assets/sandy-loading.json")}
          loop
          style={{ width: pixelSize, height: pixelSize, margin: "0 auto" }}
        />
      )}
    </motion.div>
  );
};
