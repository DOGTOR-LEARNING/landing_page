import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import './setup';
import { DemoShot } from './demo/engine';
import { Cover, Flow } from './Graphics';
import { PAPER, PILLARS } from './data/story';
import { Scene, scenes, XF } from './plan';

const COVER_T = 74; // 封面停多久後切到流程圖

const SceneView: React.FC<{ sc: Scene; first: boolean }> = ({ sc, first }) => {
  const f = useCurrentFrame();
  const fade = first ? 1 : interpolate(f, [0, XF], [0, 1], { extrapolateRight: 'clamp' });
  let body: React.ReactNode = null;
  if (sc.kind === 'open') body = <Flow f={f} mode="build" />;
  else if (sc.kind === 'end') body = <Flow f={f} mode="all" />;
  else if (sc.kind === 'cover') {
    const x = interpolate(f, [COVER_T, COVER_T + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    body = (
      <>
        {x < 1 && <AbsoluteFill style={{ opacity: 1 - x }}><Cover p={sc.p!} f={f} /></AbsoluteFill>}
        {x > 0 && <AbsoluteFill style={{ opacity: x }}><Flow f={f - COVER_T} mode="hi" p={sc.p!} bg={PILLARS[sc.p!].bg} /></AbsoluteFill>}
      </>
    );
  } else if (sc.shot) body = <DemoShot shot={sc.shot} f={f} color={PILLARS[sc.p!].pc} c={PILLARS[sc.p!].c} />;
  return <AbsoluteFill style={{ background: sc.bg, opacity: fade }}>{body}</AbsoluteFill>;
};

export const Promo: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    {scenes.map((sc, i) => (
      <Sequence key={sc.key} from={sc.from} durationInFrames={sc.dur + XF} name={sc.key}>
        <SceneView sc={sc} first={i === 0} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
