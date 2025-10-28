// src/components/LottieAnimationInteractive.jsx
import React, { memo } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

const LottieAnimationInteractive = memo(({ src, autoplay = true, loop = true, className }) => {
  return (
    <Player
      autoplay={autoplay}
      loop={loop}
      src={src}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
});

export default LottieAnimationInteractive;
