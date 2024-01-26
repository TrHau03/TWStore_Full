import { TransitionSpecs } from "@react-navigation/stack";
import { TransitionSpec } from "@react-navigation/stack/lib/typescript/src/types";

export const AnimationConfig: TransitionSpec = {
    ...TransitionSpecs.TransitionIOSSpec,
    animation: 'spring',
    config: {
      stiffness: 600,
      damping: 200,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
    
  };
  