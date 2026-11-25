import { scenes, TOTAL } from '../src/plan';
for (const s of scenes) console.log(s.key.padEnd(10), s.dur, (s.from/30).toFixed(1));
console.log('TOTAL', TOTAL, (TOTAL/30).toFixed(1)+'s');
