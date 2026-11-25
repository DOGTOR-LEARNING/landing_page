import { scenes, camAt } from '../src/plan';
for (const s of scenes.filter(s=>['sub-roi','sub-offers'].includes(s.key))) { console.log(s.key, s.from, JSON.stringify(s.cam.map(k=>[k.f,Math.round(k.x),Math.round(k.y),+k.s.toFixed(2)]))); }
