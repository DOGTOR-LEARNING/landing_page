import React from 'react';
import { Composition } from 'remotion';
import { Promo } from './Video';
import { FPS, H, TOTAL, W } from './plan';

export const Root: React.FC = () => (
  <Composition id="PlatformPromo" component={Promo} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />
);
