import { scenes } from '../src/plan';
for (const s of scenes) console.log(s.key, s.from+Math.round(s.dur*0.4), s.from+Math.round(s.dur*0.92));
