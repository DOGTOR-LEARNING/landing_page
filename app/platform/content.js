// 不公開的頁面：沒有任何站內連結、不在 sitemap、不寫進 robots.txt（寫了反而會洩漏網址），
// 只靠 noindex 標頭與 meta 擋搜尋引擎。內容是獨立的整頁 HTML，原樣輸出。
export const PLATFORM_HTML = String.raw`<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<meta name="referrer" content="no-referrer">
<title>補習班 LINE 招生與教務平台</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@700&display=swap" rel="stylesheet">
<style>
/* Layout idea: 每個模組一節：規劃三欄卡片在上，下方是網頁後台的瀏覽器框與手機框示意；示意畫面固定淺色，像真實產品截圖 */
:root{
  --paper:#f4f7f6;--card:#ffffff;--ink:#16252b;--muted:#58686d;--rule:#d9e2df;
  --accent:#2769a9;--accent-soft:#e4eef8;
  --add:#0e7c86;--add-soft:#ddf1f2;--p2:#a8326e;--p2-soft:#f8e4ee;--ai:#6b46c1;--ai-soft:#f1ecfc;--p3:#9a5b00;--p3-soft:#fff2dc;
  --core:#3d4b50;--core-soft:#e6ebea;
  --staff:#2769a9;--parent:#06a148;--teacher:#3d4b50;
  --display:"Noto Serif TC","Songti TC",serif;
  --body:"Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;
  color-scheme:light;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#0f1719;--card:#172226;--ink:#e4ecea;--muted:#9aaaae;--rule:#2a383c;--accent:#7fb3e6;--accent-soft:#1a2c40;
  --add:#4cc3cc;--add-soft:#143437;--p2:#e58ab8;--p2-soft:#3a1c2b;--ai:#b9a3f0;--ai-soft:#2a2240;--p3:#f0b45a;--p3-soft:#3a2c14;--core:#c3cfcc;--core-soft:#253236;
  --staff:#7fb3e6;--parent:#4cd98a;--teacher:#c3cfcc;color-scheme:dark}}
:root[data-theme="dark"]{
  --paper:#0f1719;--card:#172226;--ink:#e4ecea;--muted:#9aaaae;--rule:#2a383c;--accent:#7fb3e6;--accent-soft:#1a2c40;
  --add:#4cc3cc;--add-soft:#143437;--p2:#e58ab8;--p2-soft:#3a1c2b;--ai:#b9a3f0;--ai-soft:#2a2240;--p3:#f0b45a;--p3-soft:#3a2c14;--core:#c3cfcc;--core-soft:#253236;
  --staff:#7fb3e6;--parent:#4cd98a;--teacher:#c3cfcc;color-scheme:dark}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--paper);color:var(--ink);font-family:var(--body);line-height:1.7;font-size:16px}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
h1,h2,h3,h4{margin:0;line-height:1.35;text-wrap:balance}
h1{font-family:var(--display);font-size:clamp(28px,5vw,40px);margin-top:12px}
h2{font-family:var(--display);font-size:clamp(21px,3vw,26px)}
p{margin:0}
a{color:var(--accent)}
a:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.88em;background:var(--paper);padding:1px 5px;border-radius:4px}

.hero{background:var(--card);border-bottom:1px solid var(--rule);padding:44px 0 30px}
.lead{font-size:17px;max-width:52em;margin-top:14px}
.legend{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:20px}
.legend .sep{width:1px;height:20px;background:var(--rule);margin:0 4px}
.chip{display:inline-flex;font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px;white-space:nowrap}
.chip.core{background:var(--core-soft);color:var(--core)}
.chip.base{background:var(--accent-soft);color:var(--accent)}
.chip.add{background:var(--add-soft);color:var(--add)}
.chip.p2{background:var(--p2-soft);color:var(--p2)}
.chip.p3{background:var(--p3-soft);color:var(--p3)}
.who{font-size:12px;font-weight:700;padding:2px 10px;border-radius:999px;border:1.5px solid;white-space:nowrap}
.who.staff{color:var(--staff)}.who.parent{color:var(--parent)}.who.teacher{color:var(--teacher)}

nav.toc{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(6px);border-bottom:1px solid var(--rule)}
nav.toc ul{list-style:none;margin:0;padding:8px 0;display:flex;gap:4px;overflow-x:auto;white-space:nowrap}
nav.toc a{display:block;padding:4px 10px;border-radius:999px;text-decoration:none;color:var(--muted);font-size:13px}
nav.toc a:hover{background:var(--accent-soft);color:var(--accent)}

.mod{padding:44px 0;border-bottom:1px solid var(--rule)}
.mod-head{display:flex;gap:14px;align-items:center}
.mnum{font-family:var(--display);font-size:30px;color:var(--accent);font-variant-numeric:tabular-nums;line-height:1}
.mnum.s{font-size:18px}
.mh-c{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.stg{font-size:12px;color:var(--muted);border:1px solid var(--rule);border-radius:999px;padding:1px 9px;background:var(--card)}
.purpose{font-size:17px;margin:14px 0 18px;max-width:52em}
.plan{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:12px}
@media (max-width:900px){.plan{grid-template-columns:1fr}}
.pc{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:16px}
.pc h4{font-size:14px;color:var(--accent);margin-bottom:6px}
.pc ul{margin:0;padding-left:1.2em;font-size:14px;color:var(--ink)}
.pc ul li{margin-bottom:3px}
.pc ul.out{color:var(--muted)}
.pc p{font-size:14px;color:var(--muted)}
.note{font-size:14px;color:var(--muted);margin-top:14px}

.ovg{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:10px}
.ov{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:12px 14px;text-decoration:none;color:var(--ink);flex-wrap:wrap}
.ov:hover{border-color:var(--accent)}
.ov b{font-size:15px;flex:1}
.ov-c{display:flex;gap:4px;flex-basis:100%;padding-left:32px}

/* KB diagram */
.kbd{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:16px;margin-top:12px}
.kbd-h{font-weight:700;font-size:14px;color:var(--accent);margin-bottom:10px}
.kbd-g{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.kbd-m{border:1.5px solid var(--accent);border-radius:10px;padding:8px 10px;background:var(--accent-soft);display:flex;flex-direction:column}
.kbd-m b{font-size:14px}.kbd-m span{font-size:12px;color:var(--muted)}
.kbd-flow{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px;font-size:13px;color:var(--muted)}
.kbd-flow span{background:var(--paper);border:1px solid var(--rule);border-radius:999px;padding:2px 10px;color:var(--ink)}
@media (max-width:760px){.kbd-g{grid-template-columns:1fr 1fr}}

/* shots */
.shots{display:flex;flex-wrap:wrap;gap:20px;margin-top:20px;align-items:flex-start}
.shot{margin:0;display:flex;flex-direction:column;gap:8px}
.shot.web{flex:1 1 560px;min-width:0}
.shot.phone,.shot:not(.web){flex:0 0 auto}
figcaption{font-size:14px;color:var(--muted);display:flex;gap:8px;align-items:center;flex-wrap:wrap}

/* ----- mockups: fixed light UI ----- */
.browser,.phone{color:#16252b;font-family:var(--body);line-height:1.5}
.browser{background:#fff;border:1px solid #cfd8d5;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(20,40,40,.08);overflow-x:auto}
.bz-top{display:flex;align-items:center;gap:6px;background:#eef2f1;padding:8px 12px;border-bottom:1px solid #dde4e2}
.bz-top i{width:10px;height:10px;border-radius:50%;background:#cfd8d5}
.bz-top .url{margin-left:10px;font-size:11px;color:#6b7b80;background:#fff;border-radius:6px;padding:2px 10px;flex:1;max-width:420px;white-space:nowrap;overflow:hidden}
.app{display:grid;grid-template-columns:118px 1fr;min-height:380px;min-width:720px}
.sb{background:#16252b;color:#c9d5d2;padding:12px 8px;font-size:12px;display:flex;flex-direction:column;gap:2px}
.sb-brand{color:#fff;font-weight:700;font-size:13px;padding:0 6px}
.sb-org{font-size:10.5px;color:#8fa29e;padding:0 6px 8px;border-bottom:1px solid #2c3d43;margin-bottom:6px}
.sb-i{padding:5px 8px;border-radius:6px}
.sb-i.on{background:#2769a9;color:#fff;font-weight:700}
.main{padding:14px 16px;background:#f7f9f8;font-size:12.5px;display:flex;flex-direction:column;gap:10px;min-width:0}
.pg-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pg-h b{font-size:15px}
.pg-h .sp{flex:1}
.back{color:#6b7b80}
.btn{display:inline-flex;align-items:center;background:#2769a9;color:#fff;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:700;white-space:nowrap}
.btn.ghost{background:#fff;color:#2769a9;border:1px solid #2769a9}
.btn.sm{padding:2px 8px;font-size:11px}
.tag{display:inline-flex;font-size:10.5px;font-weight:700;padding:1px 7px;border-radius:999px;background:#eef2f1;color:#3d4b50;white-space:nowrap}
.tag.ok{background:#e4eef8;color:#2769a9}.tag.warn{background:#fff2dc;color:#9a5b00}.tag.bad{background:#fbe7e7;color:#b23b3b}
.seg{display:inline-flex;background:#e8eeec;border-radius:7px;padding:2px}
.seg i{font-style:normal;padding:2px 9px;border-radius:5px;font-size:11.5px;color:#58686d}
.seg i.on{background:#fff;color:#16252b;font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.muted{color:#6b7b80}
.tabs{display:flex;gap:2px;border-bottom:1px solid #dde4e2}
.tabs i{font-style:normal;padding:5px 10px;font-size:12px;color:#6b7b80}
.tabs i.on{color:#2769a9;border-bottom:2px solid #2769a9;font-weight:700}
.pn{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:6px}
.pn-h{font-weight:700;font-size:12px;color:#58686d}
.li{font-size:12px}

/* kb */
.kb{display:grid;grid-template-columns:150px 1fr 190px;gap:10px;flex:1}
.kb-tree{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px;font-size:12px;display:flex;flex-direction:column;gap:1px}
.t-m{font-weight:700;padding:4px 6px;margin-top:4px}
.t-m::before{content:"▸ ";color:#8fa29e}
.t-m.open::before{content:"▾ "}
.t-c{padding:3px 6px 3px 20px;border-radius:5px;color:#3d4b50}
.t-c.on{background:#e4eef8;color:#2769a9;font-weight:700}
.t-add{padding:3px 6px 3px 20px;color:#2769a9;font-size:11px}
.exp{font-style:normal;font-size:10px;color:#9a5b00;margin-left:4px}
.kb-ed{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:8px}
.crumb{font-size:11.5px;color:#6b7b80}.crumb b{color:#16252b;font-size:14px}
.meta-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:11.5px;color:#58686d}
.fld b{color:#16252b}
.doc{border-top:1px solid #eef2f1;padding-top:8px;display:flex;flex-direction:column;gap:2px}
.doc .h{font-weight:700;margin-top:6px}
.kb-ai{background:#f3effc;border:1px solid #e2d8f7;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:6px;font-size:11.5px}
.ai-h{font-weight:700;color:#6b46c1}
.kb-ai .q{align-self:flex-end;background:#86e48c;border-radius:10px;padding:4px 8px;max-width:90%}
.kb-ai .a{background:#fff;border-radius:10px;padding:5px 8px}
.kb-ai .a.miss{color:#b23b3b;font-weight:700}
.kb-ai .src{font-size:10.5px;color:#6b46c1}
.kb-ai .btn{align-self:flex-start}

/* inbox */
.ib{display:grid;grid-template-columns:170px 1fr 160px;gap:10px;flex:1}
.ib-list{background:#fff;border:1px solid #e1e8e6;border-radius:8px;overflow:hidden}
.ib-i{padding:8px 10px;border-bottom:1px solid #eef2f1;display:grid;grid-template-columns:1fr auto;gap:2px 6px;font-size:12px}
.ib-i small{grid-column:1/3;color:#6b7b80;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ib-i em{grid-column:1/3;font-style:normal;font-size:10.5px;color:#8fa29e}
.ib-i.on{background:#e4eef8;border-left:3px solid #2769a9}
.ib-chat{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}
.banner{background:#fff2dc;color:#9a5b00;font-weight:700;font-size:11.5px;border-radius:6px;padding:5px 8px;display:flex;justify-content:space-between;align-items:center;gap:6px}
.cm{max-width:80%;padding:6px 10px;border-radius:10px;font-size:12px}
.cm i{display:block;font-style:normal;font-size:10px;color:#8fa29e;margin-top:2px}
.cm.p{background:#eef2f1;align-self:flex-start}
.cm.b{background:#f3effc;align-self:flex-end}
.cm.s{background:#e4eef8;align-self:flex-end}
.ib-chat .note{background:#fffbe8;border:1px dashed #e8d48a;color:#7a6400;border-radius:6px;padding:4px 8px;margin:0}
.composer{margin-top:auto;border:1px solid #dde4e2;border-radius:8px;padding:6px 8px;display:flex;align-items:center;gap:8px;color:#8fa29e}
.composer span:first-child{flex:1}
.free{font-style:normal;font-size:10.5px;color:#2769a9;font-weight:700}
.ib-side{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:5px;font-size:11.5px}
.side-h{font-weight:700;color:#58686d;margin-top:4px}
.kv{display:flex;justify-content:space-between;gap:6px}
.kv span{color:#6b7b80}
.chipbtn{border:1px solid #2769a9;color:#2769a9;border-radius:999px;padding:1px 8px;font-size:11px;align-self:flex-start}

/* kanban */
.kanban{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.col{background:#eef2f1;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px;min-height:180px}
.col-h{font-weight:700;font-size:12px;padding:2px 4px;display:flex;justify-content:space-between}
.col-h i{font-style:normal;color:#6b7b80}
.kc{background:#fff;border-radius:6px;padding:6px 8px;display:flex;flex-direction:column;font-size:12px;border-left:3px solid #cfd8d5}
.kc small{color:#58686d}.kc em{font-style:normal;font-size:10.5px;color:#8fa29e}
.kc.warn{border-left-color:#d98b00}.kc.warn em{color:#9a5b00;font-weight:700}
.kc.ok{border-left-color:#2769a9}
.funnel{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:6px 10px;font-size:12px}
.funnel span{color:#6b7b80}.funnel em{font-style:normal;margin-left:auto;color:#2769a9;font-weight:700}

/* students */
.st-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{display:inline-flex;flex-direction:column;margin-right:14px}
.stat b{font-size:18px;color:#2769a9;font-variant-numeric:tabular-nums}
.stat span{font-size:10.5px;color:#6b7b80}
.pn .stat{display:inline-flex}

/* attendance */
.att{display:flex;flex-direction:column;gap:6px}
.att-r{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:grid;grid-template-columns:92px 96px 1fr 80px auto auto;gap:8px;align-items:center;font-size:12px}
.att-r span{color:#6b7b80}
.att-r em{font-style:normal;font-variant-numeric:tabular-nums}
.bar3{height:8px;background:#eef2f1;border-radius:4px;overflow:hidden}
.bar3 i{display:block;height:100%;background:#2769a9}
.alert{background:#fbe7e7;border-radius:8px;padding:8px 10px;font-size:12px;display:flex;flex-direction:column;gap:6px}
.alert b{color:#b23b3b}
.al-r{display:grid;grid-template-columns:70px 1fr auto;gap:8px;align-items:center;background:#fff;border-radius:6px;padding:4px 8px}

/* tables */
.tb{width:100%;border-collapse:collapse;background:#fff;border:1px solid #e1e8e6;border-radius:8px;overflow:hidden;font-size:12px}
.tb th{background:#eef2f1;text-align:left;padding:6px 8px;font-size:11px;color:#58686d}
.tb td{padding:6px 8px;border-top:1px solid #eef2f1}
.tb.grid td,.tb.grid th{text-align:center;font-variant-numeric:tabular-nums;border-left:1px solid #eef2f1}
.tb.grid td:first-child,.tb.grid th:first-child{text-align:left}
.tb td.edit{background:#f3effc;outline:1.5px solid #6b46c1;outline-offset:-2px}
.low{color:#b23b3b}
.rule{font-size:11.5px;color:#6b7b80;background:#fff;border:1px dashed #dde4e2;border-radius:6px;padding:6px 8px}
.rule u{color:#2769a9}

/* notice */
.nt{display:grid;grid-template-columns:1fr 170px;gap:10px}
.nt-f{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:7px}
.fl{display:grid;grid-template-columns:40px 1fr;gap:8px;align-items:start}
.fl>span{color:#6b7b80;padding-top:3px}
.in{border:1px solid #dde4e2;border-radius:6px;padding:3px 8px;display:flex;gap:4px;flex-wrap:wrap;align-items:center}
.in.tall{min-height:46px;align-items:flex-start}
.ck{font-size:11.5px;color:#2769a9}
.ck::before{content:"☑ "}
.nt-q{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:5px;font-size:11.5px;color:#6b7b80}
.q-h{font-weight:700;color:#58686d}
.q-big{font-family:var(--display);font-size:26px;color:#16252b;font-variant-numeric:tabular-nums;line-height:1.2}
.q-big small{font-size:12px;color:#6b7b80;font-family:var(--body)}
.meter{height:8px;background:#eef2f1;border-radius:4px;overflow:hidden}
.meter i{display:block;height:100%;background:#d98b00}

/* report */
.rp{display:grid;grid-template-columns:120px 1fr;gap:10px}
.rp-list{background:#fff;border:1px solid #e1e8e6;border-radius:8px;overflow:hidden;font-size:12px}
.rp-i{padding:7px 10px;border-bottom:1px solid #eef2f1}
.rp-i.on{background:#e4eef8;font-weight:700}.rp-i.ok{color:#2769a9}
.rp-ed{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}
.rp-data{display:flex;gap:14px;font-size:12px;color:#6b7b80}
.rp-data b{color:#16252b}
.rp-txt{background:#f3effc;border-radius:8px;padding:8px 10px;font-size:12.5px;line-height:1.65}
.ai-tag{display:inline-block;background:#6b46c1;color:#fff;font-size:10px;font-weight:700;border-radius:4px;padding:0 5px;margin-right:6px}
.rp-add{font-size:12px;color:#6b7b80}.rp-add span{color:#16252b;border-bottom:1.5px solid #2769a9}
.rp-act{display:flex;gap:6px;justify-content:flex-end}

/* reminders */
.kpis3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.kpis3 div{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column}
.kpis3 b{font-size:20px;color:#2769a9;font-variant-numeric:tabular-nums}
.kpis3 span{font-size:11px;color:#6b7b80}
.kpis3 .bad b{color:#b23b3b}

/* risk */
.rk-l{display:flex;flex-direction:column;gap:6px}
.rk-r{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:grid;grid-template-columns:28px 64px 90px 1fr auto;gap:8px;align-items:center;font-size:12px}
.rk-r>span{color:#6b7b80}
.lv{font-style:normal;font-weight:700;font-size:11px;border-radius:999px;text-align:center;padding:1px 0}
.lv.hi{background:#fbe7e7;color:#b23b3b}.lv.md{background:#fff2dc;color:#9a5b00}
.sig{display:flex;gap:4px;flex-wrap:wrap}
.sig span{background:#eef2f1;border-radius:4px;padding:0 6px;font-size:11px}

/* dashboard */
.kpi4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.kpi4 div{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column}
.kpi4 span{font-size:11px;color:#6b7b80}
.kpi4 b{font-size:22px;font-variant-numeric:tabular-nums}
.kpi4 em{font-style:normal;font-size:11px;color:#6b7b80}
.kpi4 em.up{color:#2769a9}.kpi4 em.dn{color:#b23b3b}
.dash2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hb{display:grid;grid-template-columns:56px 1fr 24px;gap:6px;align-items:center;font-size:11.5px}
.hb i{display:block;height:8px;background:#2769a9;border-radius:4px}
.hb em{font-style:normal;text-align:right;color:#6b7b80;font-variant-numeric:tabular-nums}

/* settings */
.line-ch{display:flex;flex-direction:column;gap:6px}
.lc{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:grid;grid-template-columns:28px 1fr auto auto;gap:10px;align-items:center;font-size:12px}
.lc small{display:block;color:#6b7b80;font-size:11px}
.lc.add{display:block;color:#2769a9;font-weight:700;border-style:dashed;text-align:center}
.lg{width:14px;height:14px;border-radius:4px;background:#06c755;display:inline-block}
.lg.big{width:26px;height:26px;border-radius:7px}
.steps4{display:flex;gap:6px;flex-wrap:wrap}
.steps4 span{font-size:11px;border-radius:999px;padding:2px 9px;background:#eef2f1;color:#6b7b80}
.steps4 span.on{background:#e4eef8;color:#2769a9;font-weight:700}

/* ----- phone ----- */
.phone{width:264px;height:520px;background:#1d2a30;border-radius:34px;padding:9px;position:relative;box-shadow:0 10px 26px rgba(20,40,40,.15);display:flex;flex-direction:column}
.notch{position:absolute;top:9px;left:50%;transform:translateX(-50%);width:90px;height:18px;background:#1d2a30;border-radius:0 0 12px 12px;z-index:2}
.ph-top{background:#1d2a30;color:#fff;font-size:13px;padding:22px 12px 8px;display:flex;align-items:center;gap:8px;border-radius:26px 26px 0 0}
.ph-top .av{width:22px;height:22px;border-radius:50%;background:#06c755;display:grid;place-items:center;font-size:11px;font-weight:700}
.ph-top.liff{background:#fff;color:#16252b;justify-content:space-between;border-bottom:1px solid #eef2f1}
.ph-top.liff span{color:#8fa29e}
.ph-top.apptop{background:#2769a9;justify-content:center}
.ph-top.lock{background:transparent;justify-content:center;font-size:40px;font-weight:300;padding-top:46px;position:absolute;left:9px;right:9px;z-index:1}
.ph-body{flex:1;border-radius:0 0 26px 26px;padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;font-size:12px}
.chatbg{background:#c9d7e3}
.liffbg{background:#fff}
.appbg{background:#f4f7f6}
.lockbg{background:linear-gradient(160deg,#3b5560,#1d2a30);border-radius:26px;padding-top:120px}
.msg{max-width:84%;padding:7px 10px;border-radius:14px;line-height:1.55}
.msg.p{align-self:flex-end;background:#86e48c;border-bottom-right-radius:4px}
.msg.b{align-self:flex-start;background:#fff;border-bottom-left-radius:4px}
.msg.sys{align-self:center;background:rgba(0,0,0,.18);color:#fff;font-size:10.5px;border-radius:999px;padding:2px 10px}
.lf-sec{font-size:11px;font-weight:700;color:#58686d;margin-top:2px}
.lf-sel,.lf-in{border:1px solid #dde4e2;border-radius:8px;padding:6px 10px}
.lf-seg{display:flex;gap:6px;flex-wrap:wrap}
.lf-seg i{font-style:normal;border:1px solid #dde4e2;border-radius:999px;padding:3px 12px}
.lf-seg i.on{background:#2769a9;color:#fff;border-color:#2769a9}
.slot{border:1px solid #dde4e2;border-radius:8px;padding:6px 10px;display:flex;justify-content:space-between}
.slot em{font-style:normal;color:#6b7b80;font-size:11px}
.slot.on{border:2px solid #2769a9;background:#e4eef8}
.slot.dis{color:#aab6b3;background:#f4f7f6}
.lf-btn{margin-top:auto;background:#2769a9;color:#fff;text-align:center;font-weight:700;border-radius:10px;padding:9px}
.lf-btn.ghost{background:#fff;color:#2769a9;border:1.5px solid #2769a9}
.lf-hero{font-size:18px;font-weight:700;margin-top:6px}
.lf-p{color:#3d4b50;line-height:1.6}
.lf-fine{font-size:10.5px;color:#8fa29e}
.lf-link{color:#2769a9;font-weight:700;text-align:center}
.otp{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}
.otp i{font-style:normal;border:1.5px solid #2769a9;border-radius:8px;text-align:center;padding:6px 0;font-weight:700;font-size:15px}
.ok-card{background:#e4eef8;border-radius:10px;padding:8px 10px;display:flex;flex-direction:column}
.ok-card b{color:#2769a9}.ok-card span{font-size:11px;color:#58686d}
.ok-card + .lf-link{margin-top:auto}
.ap-h{font-weight:700;display:flex;justify-content:space-between}
.ap-h span{color:#6b7b80;font-weight:400}
.scan{background:#16252b;border-radius:12px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#c9d5d2;font-size:11px}
.scan-box{width:80px;height:80px;border:3px solid #7fb3e6;border-radius:10px}
.ap-li{background:#fff;border-radius:8px;padding:7px 10px;display:flex;justify-content:space-between}
.ap-li i{font-style:normal;font-size:11px;font-weight:700}
.ap-li i.ok{color:#2769a9}.ap-li i.no{color:#b23b3b}.ap-li i.lvq{color:#9a5b00}
.push{background:rgba(255,255,255,.88);border-radius:14px;padding:8px 10px;display:flex;flex-direction:column;gap:1px}
.ps-h{display:flex;align-items:center;gap:6px;font-size:10.5px;color:#58686d}
.ps-h em{font-style:normal;margin-left:auto}
.ps-h .lg{width:12px;height:12px}
.push span{color:#3d4b50}
.kid{display:flex;justify-content:space-between;align-items:baseline;border-bottom:1px solid #eef2f1;padding-bottom:6px}
.kid b{font-size:16px}.kid span{color:#6b7b80;font-size:11px}
.spark{background:#f4f7f6;border-radius:8px;padding:6px}
.spark svg{width:100%;height:56px;display:block}
.spk-l{display:flex;justify-content:space-between;font-size:10.5px;color:#58686d;font-variant-numeric:tabular-nums;padding:0 4px}
.hw{display:flex;justify-content:space-between;border-bottom:1px solid #eef2f1;padding:4px 0}
.hw i{font-style:normal;font-weight:700;color:#2769a9;font-size:11px}
.flex{align-self:flex-start;width:88%;background:#fff;border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
.fx-h{background:#2769a9;color:#fff;font-weight:700;padding:6px 12px;font-size:12px}
.fx-b{padding:8px 12px;display:flex;flex-direction:column;gap:3px}
.fx-b span{font-size:10.5px;color:#8fa29e}
.fx-btn{border-top:1px solid #eef2f1;text-align:center;color:#2769a9;font-weight:700;padding:6px}
.fx-btn.ghost{color:#3d4b50;font-weight:500}
.rp-hero{background:#2769a9;color:#fff;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column}
.rp-hero span{font-size:11px;opacity:.85}.rp-hero b{font-size:18px}
.rp-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.rp-stats div{background:#f4f7f6;border-radius:8px;padding:6px;text-align:center;display:flex;flex-direction:column}
.rp-stats b{font-size:15px;color:#2769a9;font-variant-numeric:tabular-nums}
.rp-stats span{font-size:10.5px;color:#6b7b80}

footer{padding:30px 0 50px;font-size:13px;color:var(--muted)}

.shot.full{flex-basis:100%}

/* org & permissions */
.brsw{border:1px solid #cfd8d5;background:#fff;border-radius:6px;padding:1px 8px;font-size:11.5px;font-weight:700}
.brsw.lock{background:#eef2f1;color:#58686d}
.role{display:inline-block;font-size:10.5px;font-weight:700;border-radius:4px;padding:0 6px;margin:1px 4px 1px 0}
.role.hq{background:#16252b;color:#fff}.role.mgr{background:#2769a9;color:#fff}.role.ofc{background:#e4eef8;color:#2769a9}
.role.sal{background:#ddf1f2;color:#0e7c86}.role.hr{background:#f8e4ee;color:#a8326e}.role.tch{background:#f4f0e6;color:#7a6400}
.scope{font-size:11px;color:#58686d;margin-right:6px}
.tb.pm td,.tb.pm th{text-align:center;white-space:nowrap}
.tb.pm td:first-child,.tb.pm th:first-child{text-align:left;font-weight:700}
.pe{display:inline-block;font-style:normal;font-size:10.5px;font-weight:700;border-radius:4px;padding:1px 6px}
.pe.all{background:#16252b;color:#fff}.pe.br{background:#2769a9;color:#fff}.pe.own{background:#ece6fb;color:#6b46c1}
.pe.cls{background:#efe8f8;color:#7a4fb0}.pe.vw{background:#eef2f1;color:#3d4b50}.pe.no{color:#aab6b3;font-weight:400}
.pm-lg{display:flex;gap:6px;flex-wrap:wrap}
.browser.mini .main{min-height:300px}
.mini-who{background:#16252b;color:#fff;font-size:11.5px;font-weight:700;padding:5px 12px}
.pool{background:#fff2dc;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:5px;font-size:12px}
.pool b{color:#9a5b00}.pool>span{font-size:11px;color:#7a5a20}
.pool-r{display:flex;justify-content:space-between;background:#fff;border-radius:6px;padding:4px 8px}
.pool .sel{color:#2769a9;font-weight:700}
.pool.empty{background:#eef2f1;color:#6b7b80}
.br-b{font-size:10.5px;font-weight:700;border-radius:4px;padding:0 6px}
.br-b.hq{background:#e4eef8;color:#2769a9}.br-b.bq{background:#ece6fb;color:#6b46c1}.br-b.ty{background:#fff2dc;color:#9a5b00}
.shot.web:has(.browser.mini){flex:1 1 480px}

/* multi binding */
:root{--student:#b5501f}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--student:#f0a17a}}
:root[data-theme="dark"]{--student:#f0a17a}
.who.student{color:var(--student)}
.st-grid2{display:grid;grid-template-columns:1.6fr 1fr;gap:8px}
.tb.bind td,.tb.bind th{text-align:center}
.tb.bind td:first-child,.tb.bind th:first-child{text-align:left}
.tb.bind td.on{color:#2769a9;font-size:13px}
.tb.bind td.off{color:#aab6b3;font-size:13px}
.tb.bind td.na{color:#cfd8d5}
.myqr{background:#f4f7f6;border-radius:12px;padding:10px;display:flex;flex-direction:column;align-items:center;gap:6px}
.myqr span{font-size:10.5px;color:#58686d}
.qr{width:96px;height:96px;background:
 linear-gradient(90deg,#16252b 10px,transparent 10px) 0 0/20px 20px,
 linear-gradient(#16252b 10px,transparent 10px) 5px 5px/15px 15px,#fff;border:6px solid #fff;outline:2px solid #16252b;border-radius:4px}
.hw i.due{color:#9a5b00}

/* identity tags & quick replies */
.idt{display:inline-block;font-size:9.5px;font-weight:700;border-radius:4px;padding:0 5px;vertical-align:1px}
.idt.st{background:#fbe9df;color:#b5501f}.idt.pr{background:#e4eef8;color:#2769a9}.idt.nw{background:#eef2f1;color:#58686d}
.quick{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}
.quick span{background:#fff;color:#2769a9;border:1px solid #2769a9;border-radius:999px;padding:1px 9px;font-size:11px}
.quick span.on{background:#2769a9;color:#fff}
.al-r.late{background:#fffbe8}

/* identity tags & quick replies */
.idt{display:inline-block;font-size:9.5px;font-weight:700;border-radius:4px;padding:0 5px;vertical-align:1px}
.idt.st{background:#fbe9df;color:#b5501f}.idt.pr{background:#e4eef8;color:#2769a9}.idt.nw{background:#eef2f1;color:#58686d}
.quick{display:flex;flex-wrap:wrap;gap:5px;justify-content:flex-end}
.quick span{background:#fff;color:#2769a9;border:1px solid #2769a9;border-radius:999px;padding:1px 9px;font-size:11px}
.quick span.on{background:#2769a9;color:#fff}
.al-r.late{background:#fffbe8}

/* AI block */
.aib{margin-top:12px;border:1.5px solid var(--ai);background:var(--card);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.aib-h{font-weight:700;color:var(--ai);display:flex;align-items:center;gap:6px}
.aib-h .aistar{font-size:16px}
.air{display:grid;grid-template-columns:150px 1fr;gap:12px;align-items:start;border-top:1px dashed var(--rule);padding-top:10px}
.air:first-of-type{border-top:0;padding-top:0}
.air b{font-size:14px}
.cmp{display:grid;grid-template-columns:1fr auto 1.3fr;gap:10px;align-items:start;font-size:14px}
.cmp i{display:block;font-style:normal;font-size:11px;font-weight:700;margin-bottom:2px}
.cmp .old{color:var(--muted)}.cmp .old i{color:var(--muted)}
.cmp .new{color:var(--ink)}.cmp .new i{color:var(--ai)}
.cmp .arr{color:var(--ai);font-weight:700;padding-top:14px}
@media (max-width:760px){.air{grid-template-columns:1fr}.cmp{grid-template-columns:1fr}.cmp .arr{display:none}}
.why3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:900px){.why3{grid-template-columns:1fr}}
.mod.why{background:var(--card)}
.mod.why .pc{background:var(--paper)}
/* mock additions */
.heat{display:inline-block;font-size:9.5px;font-weight:700;border-radius:4px;padding:0 5px;vertical-align:1px}
.heat.h3{background:#fbe7e7;color:#b23b3b}.heat.h2{background:#fff2dc;color:#9a5b00}.heat.h1{background:#eef2f1;color:#6b7b80}
.kc em.sum{color:#6b46c1;font-size:10.5px}
.kc.hot{border-left-color:#b23b3b}
.kc em.warn{color:#9a5b00;font-weight:700}
.ld{display:grid;grid-template-columns:1fr 1.2fr;gap:10px}
.ffx{display:grid;grid-template-columns:44px 1fr 44px 1fr;gap:4px 8px;font-size:12px}
.ffx span{color:#6b7b80}
.cares{display:flex;gap:4px;flex-wrap:wrap}
.cares span{background:#ece6fb;color:#6b46c1;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px}
.sumtxt{font-size:12.5px;line-height:1.6}
.draft{background:#f3effc;border-radius:8px;padding:8px 10px;font-size:12.5px;line-height:1.6;display:flex;flex-direction:column;gap:6px}
.aisum{background:#f3effc;border-radius:6px;padding:6px 8px;font-size:11.5px;line-height:1.55}
.composer i.ai-tag{font-style:normal}
.composer span:first-child{color:#3d4b50}
.ailine{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#f3effc;border:1px solid #e2d8f7;border-radius:8px;padding:6px 10px;font-size:12px}
.aians{background:#fff;border:1px solid #e2d8f7;border-radius:8px;padding:8px 10px;font-size:12px;line-height:1.6}
.voice{background:#fff;border-radius:12px;padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px}
.mic{width:44px;height:44px;border-radius:50%;background:#b23b3b;color:#fff;display:grid;place-items:center;font-size:18px}
.voice span{font-size:11px;color:#58686d}
.wave{display:flex;gap:3px;align-items:center;height:22px}
.wave i{width:4px;background:#2769a9;border-radius:2px;height:8px}
.wave i:nth-child(2n){height:18px}.wave i:nth-child(3n){height:12px}
.pn-h2{font-size:11px;font-weight:700;color:#58686d}
.ap-card{background:#fff;border-radius:10px;padding:8px 10px;line-height:1.6}
.ap-card b{display:block;color:#2769a9;margin-top:4px}
.draft .ai-tag{align-self:flex-start}

/* priorities */
:root{--pr0:#2769a9;--pr0-soft:#e4eef8;--pr1:#0e7c86;--pr1-soft:#ddf1f2;--pr2:#a8326e;--pr2-soft:#f8e4ee;--pr3:#9a5b00;--pr3-soft:#fff2dc}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--pr0:#7fb3e6;--pr0-soft:#1a2c40;--pr1:#4cc3cc;--pr1-soft:#143437;--pr2:#e58ab8;--pr2-soft:#3a1c2b;--pr3:#f0b45a;--pr3-soft:#3a2c14}}
:root[data-theme="dark"]{--pr0:#7fb3e6;--pr0-soft:#1a2c40;--pr1:#4cc3cc;--pr1-soft:#143437;--pr2:#e58ab8;--pr2-soft:#3a1c2b;--pr3:#f0b45a;--pr3-soft:#3a2c14}
.chip.pr0{background:var(--pr0);color:#fff}.chip.pr1{background:var(--pr1-soft);color:var(--pr1)}.chip.pr2{background:var(--pr2-soft);color:var(--pr2)}.chip.pr3{background:var(--pr3-soft);color:var(--pr3)}
.why-p{font-size:14px;color:var(--muted);margin:-8px 0 16px;max-width:60em}
.why-p b{color:var(--accent);margin-right:8px}
.board{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
@media (max-width:900px){.board{grid-template-columns:1fr 1fr}}
.bcol{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:6px}
.bh{font-weight:700;border-radius:8px;padding:6px 10px;display:flex;flex-direction:column}
.bh small{font-weight:400;font-size:12px;opacity:.9}
.bh.pr0{background:var(--pr0);color:#fff}.bh.pr1{background:var(--pr1-soft);color:var(--pr1)}.bh.pr2{background:var(--pr2-soft);color:var(--pr2)}.bh.pr3{background:var(--pr3-soft);color:var(--pr3)}
.bi{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;text-decoration:none;color:var(--ink);font-size:14px;padding:4px 6px;border-radius:6px}
.bi:hover{background:var(--paper)}
.bi span{font-family:var(--display);color:var(--accent);font-variant-numeric:tabular-nums}
.bi em{font-style:normal;font-size:11px;color:var(--pr1);font-weight:700}
/* sources & checks */
.srcv{background:#e6f4ea;border-bottom:1.5px solid #2e7d4f;padding:0 2px;border-radius:2px}
.srcv i{font-style:normal;font-size:9.5px;font-weight:700;color:#2e7d4f;margin-left:3px;vertical-align:1px}
s.bad{color:#b23b3b;background:#fbe7e7}
.chk{font-size:11.5px;border-radius:6px;padding:4px 8px}
.chk.ok{background:#e6f4ea;color:#2e7d4f;font-weight:700}
.chk.warn{background:#fff2dc;color:#9a5b00}
.ref{display:inline-block;background:#e4eef8;color:#2769a9;font-weight:700;font-size:11.5px;border-radius:4px;padding:0 6px}
.vtxt{background:#f4f7f6;border-radius:8px;padding:6px 8px;font-size:11.5px;color:#3d4b50;width:100%}
.mic{background:#2769a9 !important;font-size:16px !important}
.src-t b.good{color:#2e7d4f}
.src-q{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;font-size:12px}
.src-q div:nth-child(2){display:flex;flex-direction:column;flex:1}
.qr.sm{width:54px;height:54px;border-width:4px;flex:none}
.lp-hero{background:linear-gradient(135deg,#2769a9,#1d4f80);color:#fff;border-radius:12px;padding:14px;display:flex;flex-direction:column}
.lp-hero span{font-size:11px;opacity:.85}.lp-hero b{font-size:18px}
.lp-pt{font-size:12.5px;color:#2769a9;font-weight:700}
/* law */
.lawb{margin-top:12px;background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:14px 16px}
.lawb-h{font-weight:700;color:var(--accent);margin-bottom:8px}
.lawt{width:100%;border-collapse:collapse;font-size:14px}
.lawt th{text-align:left;font-size:12px;color:var(--muted);padding:6px 8px;border-bottom:1px solid var(--rule)}
.lawt td{padding:8px;border-bottom:1px solid var(--rule);vertical-align:top}
.lawt td:first-child{color:var(--muted);width:45%}
.lawn{font-size:13px;color:var(--muted);margin-top:8px}
.draft{display:block}
.draft .chk,.draft .rp-act{margin-top:6px}
.draft .ai-tag{margin-right:6px}

.hero .meta{display:flex;flex-wrap:wrap;gap:6px 22px;color:var(--muted);font-size:14px;margin-top:10px}
.tl{font-size:11px;border-left:2px solid #2769a9;padding:1px 0 1px 7px;color:#3d4b50}
.tl b{display:block;font-size:11px;color:#16252b}
.tl2{border-left:3px solid #2769a9;padding:2px 0 2px 9px;font-size:12px;display:flex;flex-direction:column;margin-bottom:4px}
.tl2 b{font-size:12px}
.tl2.next{border-left:3px dashed #cfd8d5;color:#8fa29e}
.tl2.next b{color:#8fa29e}
.composer{flex-wrap:wrap}
.composer span:first-child{flex:1 1 100%;line-height:1.5}
.composer .free{flex:1}
/* makeup policies */
.mk-g{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.mode{border:1px solid #e1e8e6;border-radius:6px;padding:5px 8px;display:flex;flex-direction:column;font-size:12px;color:#8fa29e}
.mode b{font-size:12px;color:#8fa29e}
.mode span{font-size:11px}
.mode.on{border-color:#2769a9;background:#e4eef8;color:#3d4b50}
.mode.on b{color:#2769a9}
.mode.on b::before{content:"✓ "}
.params{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px}
.params span{background:#eef2f1;border-radius:4px;padding:1px 7px;font-size:11px}

/* Site layout: 頂部工具列＋左側可收合導覽；內容是給補習班老闆的介紹，功能區塊用「你會得到／以前→現在／實際畫面」 */
html{scroll-behavior:smooth;scroll-padding-top:64px}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{background:var(--paper)}
.topbar{position:sticky;top:0;z-index:30;height:52px;display:flex;align-items:center;gap:12px;padding:0 16px;background:var(--card);border-bottom:1px solid var(--rule)}
.tb-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--rule);background:var(--card);color:var(--ink);font-size:18px;cursor:pointer}
.tb-btn:hover{background:var(--paper)}
.tb-btn:focus-visible,.ng-b:focus-visible,.nv:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
.tb-brand{font-weight:700;font-size:15px}
.tb-sp{flex:1}
.tb-cta{background:var(--accent);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:7px 16px;border-radius:999px}

.layout{display:grid;grid-template-columns:260px minmax(0,1fr);transition:grid-template-columns .2s}
.layout.collapsed{grid-template-columns:0 minmax(0,1fr)}
.sidebar{position:sticky;top:52px;height:calc(100vh - 52px);overflow-y:auto;background:var(--card);border-right:1px solid var(--rule);padding:16px 12px 40px}
.layout.collapsed .sidebar{visibility:hidden;padding:0;border:0}
.sb-head{display:flex;flex-direction:column;padding:4px 8px 14px;border-bottom:1px solid var(--rule);margin-bottom:10px}
.sb-head b{font-size:15px}.sb-head span{font-size:12px;color:var(--muted)}
.sb-nav{display:flex;flex-direction:column;gap:2px}
.nv{display:block;text-decoration:none;color:var(--ink);font-size:14px;padding:7px 10px;border-radius:8px}
.nv:hover{background:var(--paper)}
.nv.sub{font-size:13.5px;color:var(--muted);padding:5px 10px 5px 22px}
.nv.active{background:var(--accent-soft);color:var(--accent);font-weight:700}
.nv.cta{margin-top:10px;background:var(--accent);color:#fff;text-align:center;font-weight:700}
.nv.cta.active{color:#fff;background:var(--accent)}
.ng{margin:6px 0 2px}
.ng-b{width:100%;display:flex;justify-content:space-between;align-items:center;background:none;border:0;color:var(--ink);font:inherit;font-size:14px;font-weight:700;padding:7px 10px;border-radius:8px;cursor:pointer}
.ng-b:hover{background:var(--paper)}
.ng-b i{font-style:normal;color:var(--muted);transition:transform .15s}
.ng-b[aria-expanded="false"] i{transform:rotate(-90deg)}
.scrim{display:none}

@media (max-width:900px){
  .layout,.layout.collapsed{grid-template-columns:minmax(0,1fr)}
  .sidebar{position:fixed;left:0;top:52px;bottom:0;width:280px;height:auto;z-index:25;transform:translateX(-100%);transition:transform .2s;visibility:visible}
  .layout.drawer-open .sidebar{transform:none;box-shadow:8px 0 24px rgba(0,0,0,.15)}
  .layout.drawer-open .scrim{display:block;position:fixed;inset:52px 0 0 0;background:rgba(0,0,0,.3);z-index:20}
  .tb-brand{font-size:13px}
}

.content{min-width:0;padding:0 32px 60px;max-width:1240px;width:100%;margin:0 auto}
@media (max-width:640px){.content{padding:0 16px 40px}}
.eyebrow{font-size:13px;font-weight:700;color:var(--accent);letter-spacing:.04em}
.sec,.grp{padding:56px 0 20px}
.sec-h{display:flex;flex-direction:column;gap:8px;margin-bottom:24px;max-width:46em}
.sec-h h2{font-family:var(--display);font-size:clamp(22px,3vw,30px)}
.sec-p{color:var(--muted);font-size:16px}
.fine{font-size:13px;color:var(--muted);margin-top:14px}

/* hero */
.hero2{display:grid;grid-template-columns:1.3fr 1fr;gap:32px;align-items:center;padding:48px 0 32px;border-bottom:1px solid var(--rule)}
.hero2 h1{font-family:var(--display);font-size:clamp(30px,4.6vw,46px);line-height:1.25;margin:10px 0 14px}
.lead2{font-size:17px;color:var(--muted);max-width:34em}
.h-pts{display:flex;flex-wrap:wrap;gap:8px 18px;margin:18px 0 22px;font-weight:700;font-size:15px;color:var(--accent)}
.h-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn-p{background:var(--accent);color:#fff;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:999px}
.btn-s{border:1.5px solid var(--accent);color:var(--accent);text-decoration:none;font-weight:700;padding:10px 20px;border-radius:999px;background:var(--card)}
.h-vis{display:flex;justify-content:center}
.h-vis figcaption{display:none}
@media (max-width:900px){.hero2{grid-template-columns:1fr}}

/* why */
.why4{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
@media (max-width:760px){.why4{grid-template-columns:1fr}}
.wcard{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:8px}
.wn{width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:var(--display);font-size:17px}
.wcard h3{font-size:18px}
.wcard p{color:var(--muted);font-size:15px}
.roi{margin-top:16px;display:grid;grid-template-columns:1.6fr 1fr;gap:20px;align-items:center;background:var(--accent);color:#fff;border-radius:16px;padding:22px 26px}
.roi .eyebrow{color:#cfe0f1}
.roi p{margin-top:6px;font-size:15.5px;color:#e9f1f9}
.roi b{color:#fff}
.roi-n{display:flex;flex-direction:column;align-items:flex-end;font-variant-numeric:tabular-nums}
.roi-n b{font-family:var(--display);font-size:38px;line-height:1.1}
.roi-n span{font-size:15px;color:#cfe0f1}
.roi-n em{font-style:normal;font-weight:700;font-size:20px;margin-top:4px}
@media (max-width:760px){.roi{grid-template-columns:1fr}.roi-n{align-items:flex-start}}

/* journey */
.journey{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;counter-reset:j}
@media (max-width:900px){.journey{grid-template-columns:repeat(2,1fr)}}
.jstep{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;position:relative}
.jn{font-family:var(--display);color:var(--accent);font-size:22px;line-height:1}
.jstep b{font-size:16px}
.jstep p{font-size:14px;color:var(--muted)}

/* groups */
.grp{border-top:1px solid var(--rule);margin-top:20px}
.gcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
.gcard{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:14px 16px;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:4px}
.gcard:hover{border-color:var(--accent)}
.gcard b{font-size:15px;color:var(--accent)}
.gcard span{font-size:14px;color:var(--muted)}

/* feature */
.feat{padding:40px 0 12px;border-top:1px dashed var(--rule);margin-top:28px}
.fh-l{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ftitle{font-size:14px;font-weight:700;color:var(--accent)}
.avail{font-size:11.5px;font-weight:700;border-radius:999px;padding:1px 9px}
.avail.a1{background:var(--accent);color:#fff}.avail.a2{background:var(--accent-soft);color:var(--accent)}.avail.a3{background:var(--paper);color:var(--muted);border:1px solid var(--rule)}
.feat h3{font-family:var(--display);font-size:clamp(20px,2.6vw,26px);margin:8px 0 8px}
.fdesc{font-size:16px;color:var(--muted);max-width:46em}
.feat-body{display:grid;grid-template-columns:1.3fr 1fr;gap:14px;margin-top:18px}
@media (max-width:900px){.feat-body{grid-template-columns:1fr}}
.gets{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:16px 18px}
.gets h4{font-size:14px;color:var(--accent);margin-bottom:6px}
.gets ul{margin:0;padding-left:1.2em;font-size:15px}
.gets li{margin-bottom:4px}
.ba{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch}
.ba .b,.ba .a{border-radius:12px;padding:14px;font-size:15px;display:flex;flex-direction:column;gap:4px}
.ba span{font-size:12px;font-weight:700}
.ba .b{background:var(--card);border:1px solid var(--rule);color:var(--muted)}
.ba .a{background:var(--accent-soft);color:var(--ink)}
.ba .a span{color:var(--accent)}
.ba .arrow{align-self:center;color:var(--accent);font-weight:700}
.feat .shots{margin-top:20px}

/* security / onboarding / pricing */
.sec6{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:900px){.sec6{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.sec6{grid-template-columns:1fr}}
.scard{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:16px 18px;display:flex;flex-direction:column;gap:6px}
.scard h3{font-size:16px}
.scard p{font-size:14.5px;color:var(--muted)}
.steps5{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media (max-width:900px){.steps5{grid-template-columns:1fr 1fr}}
.s5{background:var(--card);border:1px solid var(--rule);border-top:4px solid var(--accent);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:6px}
.s5>span{font-family:var(--display);font-size:24px;color:var(--accent);line-height:1}
.s5 h3{font-size:16px}
.s5 p{font-size:14.5px;color:var(--muted)}
.price3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:900px){.price3{grid-template-columns:1fr}}
.pcard{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;gap:6px}
.pcard.main{border:2px solid var(--accent)}
.pcard h3{font-size:18px}
.pt{font-size:13px;font-weight:700;color:var(--accent)}
.pcard ul{margin:4px 0 0;padding-left:1.2em;font-size:15px;color:var(--ink)}
.cta-band{margin-top:16px;display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;background:var(--card);border:1px dashed var(--accent);border-radius:14px;padding:18px 22px}
.cta-band p{font-size:15.5px;max-width:40em}

/* faq */
.faq{display:flex;flex-direction:column;gap:8px;max-width:56em}
.qa{background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:4px 18px}
.qa summary{cursor:pointer;font-weight:700;font-size:16px;padding:12px 0;list-style:none;display:flex;justify-content:space-between;gap:10px}
.qa summary::-webkit-details-marker{display:none}
.qa summary::after{content:"＋";color:var(--accent)}
.qa[open] summary::after{content:"－"}
.qa p{padding:0 0 14px;color:var(--muted);font-size:15px}

/* contact */
.ct{display:flex;gap:16px;flex-wrap:wrap}
.ct-c{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:18px 22px;display:flex;flex-direction:column;gap:4px;font-size:15px}
.ct-c b{font-size:17px;margin-bottom:4px}

/* nav groups with link + toggle */
.ng-row{display:flex;align-items:center;gap:2px}
.ng-row .ng-a{flex:1;font-weight:700}
.ng-t{width:30px;height:30px;border:0;background:none;color:var(--muted);border-radius:6px;cursor:pointer;transition:transform .15s}
.ng-t:hover{background:var(--paper)}
.ng-t:focus-visible{outline:3px solid var(--accent)}
.ng-t[aria-expanded="false"]{transform:rotate(-90deg)}

/* overview phases */
.phases3{display:grid;grid-template-columns:1.25fr 1fr .8fr;gap:14px;align-items:start}
@media (max-width:1000px){.phases3{grid-template-columns:1fr}}
.phcol{display:flex;flex-direction:column;gap:10px;background:var(--card);border:1px solid var(--rule);border-radius:16px;padding:14px}
.ph-h{display:flex;flex-direction:column;padding:4px 6px 8px;border-bottom:1px solid var(--rule)}
.ph-h b{font-size:16px}.ph-h span{font-size:13px;color:var(--muted)}
.pcard2{display:flex;gap:12px;text-decoration:none;color:var(--ink);background:var(--paper);border-radius:12px;padding:12px 14px;border:1.5px solid transparent}
.pcard2:hover{border-color:var(--accent)}
.pn2{flex:none;width:38px;height:38px;border-radius:10px;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:var(--display);font-size:18px}
.pcard2 b{font-size:16px}
.pcard2 p{font-size:14px;color:var(--muted);margin:2px 0 6px}
.pchips{display:flex;flex-wrap:wrap;gap:4px}
.pchips span{font-size:12px;background:var(--card);border:1px solid var(--rule);border-radius:999px;padding:1px 8px;color:var(--ink)}

/* pillar */
.pillar{padding:64px 0 24px;border-top:1px solid var(--rule);margin-top:24px}
.pl-head{display:flex;gap:16px;align-items:center}
.pl-num{flex:none;width:56px;height:56px;border-radius:14px;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:var(--display);font-size:28px}
.pl-head h2{font-family:var(--display);font-size:clamp(24px,3.2vw,32px)}
.pl-pos{font-size:18px;font-weight:700;color:var(--accent);margin-top:2px}
.pl-intro{font-size:16px;color:var(--muted);max-width:48em;margin:16px 0 18px}
.pl-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:14px}
@media (max-width:900px){.pl-grid{grid-template-columns:1fr}}
.pl-inc{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:8px}
.pl-inc h3{font-size:14px;color:var(--accent)}
.inc{display:flex;flex-direction:column;text-decoration:none;color:var(--ink);border-left:3px solid var(--accent);padding:2px 0 2px 12px}
.inc b{font-size:15px}.inc span{font-size:14px;color:var(--muted)}
.inc:hover b{color:var(--accent)}
.ba.v{grid-template-columns:1fr;align-content:start}
.subf{margin-top:36px;padding-top:24px;border-top:1px dashed var(--rule)}
.sf-text{max-width:50em}
.sf-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sf-h h4{font-size:19px}
.sf-text p{color:var(--muted);font-size:15.5px;margin:4px 0 6px}
.sf-text ul{margin:0;padding-left:1.2em;font-size:15px}
.subf .shots{margin-top:16px}
/* new mockups */
.srcb{font-size:10.5px;font-weight:700;border-radius:4px;padding:1px 7px;white-space:nowrap}
.srcb.meta{background:#e4eef8;color:#2769a9}.srcb.flyer{background:#fff2dc;color:#9a5b00}.srcb.ref{background:#e6f4ea;color:#2e7d4f}.srcb.web{background:#ece6fb;color:#6b46c1}.srcb.unk{background:#eef2f1;color:#6b7b80}
.stg2{font-size:10.5px;font-weight:700;border-radius:999px;padding:1px 8px}
.stg2.s1{background:#eef2f1;color:#58686d}.stg2.s2{background:#fff2dc;color:#9a5b00}.stg2.s3{background:#e4eef8;color:#2769a9}
.pipe{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px}
.pipe>i{font-style:normal;color:#aab6b3}
.pp{flex:1;display:flex;flex-direction:column;align-items:center;background:#f4f7f6;border-radius:6px;padding:6px 4px}
.pp span{font-size:10.5px;color:#58686d}
.pp b{font-size:20px;font-variant-numeric:tabular-nums}
.pp em{font-style:normal;font-size:10px;color:#2769a9}
.pp.on{background:#2769a9;color:#fff}.pp.on span,.pp.on em{color:#dbe8f5}
.fu{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:8px 10px;display:flex;flex-direction:column;gap:6px}
.fu-h{font-weight:700;font-size:12.5px}.fu-h b{color:#b23b3b}
.fu-r{display:grid;grid-template-columns:86px 60px 1fr auto;gap:8px;align-items:center;font-size:12px;border-top:1px solid #eef2f1;padding-top:6px}
.why{font-size:10px;font-weight:700;border-radius:4px;padding:1px 6px;text-align:center}
.why.w1{background:#fbe7e7;color:#b23b3b}.why.w2{background:#fff2dc;color:#9a5b00}.why.w3{background:#eef2f1;color:#58686d}.why.w4{background:#ece6fb;color:#6b46c1}

/* ===== visual redesign ===== */
:root{--c1:#2769a9;--c1s:#e4eef8;--c2:#0e7c86;--c2s:#ddf1f2;--c3:#5b4fc9;--c3s:#ebe8fb;--c4:#2e7d4f;--c4s:#e3f2e8;--c5:#b26a00;--c5s:#fdf0dc;--c6:#a8326e;--c6s:#f8e4ee}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--c1:#7fb3e6;--c1s:#1a2c40;--c2:#4cc3cc;--c2s:#143437;--c3:#a79ef0;--c3s:#26223f;--c4:#6fcf97;--c4s:#17301f;--c5:#f0b45a;--c5s:#3a2c14;--c6:#e58ab8;--c6s:#3a1c2b}}
:root[data-theme="dark"]{--c1:#7fb3e6;--c1s:#1a2c40;--c2:#4cc3cc;--c2s:#143437;--c3:#a79ef0;--c3s:#26223f;--c4:#6fcf97;--c4s:#17301f;--c5:#f0b45a;--c5s:#3a2c14;--c6:#e58ab8;--c6s:#3a1c2b}
.c1{--pc:var(--c1);--ps:var(--c1s)}.c2{--pc:var(--c2);--ps:var(--c2s)}.c3{--pc:var(--c3);--ps:var(--c3s)}
.c4{--pc:var(--c4);--ps:var(--c4s)}.c5{--pc:var(--c5);--ps:var(--c5s)}.c6{--pc:var(--c6);--ps:var(--c6s)}

/* flow diagram */
.flow2-wrap{background:var(--card);border:1px solid var(--rule);border-radius:18px;padding:18px;overflow-x:auto}
.flow2{min-width:980px;display:flex;flex-direction:column;gap:8px}
.prow{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
.pband{text-align:center;font-weight:700;font-size:14px;padding:6px;border-radius:10px;background:var(--paper);color:var(--ink);border:1px solid var(--rule)}
.frow{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
.fcol{display:flex;flex-direction:column;gap:8px}
.fper{display:none}
.fst{background:var(--accent);color:#fff;font-weight:700;font-size:14px;padding:9px 8px 9px 18px;display:flex;align-items:center;gap:6px;clip-path:polygon(0 0,calc(100% - 10px) 0,100% 50%,calc(100% - 10px) 100%,0 100%,10px 50%)}
.fst span{width:20px;height:20px;border-radius:50%;background:#fff;color:var(--accent);display:grid;place-items:center;font-size:11px;flex:none}
.fhelps{display:flex;flex-direction:column;gap:6px}
.hc{display:flex;align-items:center;gap:6px;text-decoration:none;font-size:13px;font-weight:700;color:var(--pc);background:var(--ps);border-radius:8px;padding:7px 8px;border:1.5px solid transparent;line-height:1.35}
.hc:hover{border-color:var(--pc)}
.hc i,.lg2 i{font-style:normal;flex:none;width:20px;height:20px;border-radius:6px;background:var(--pc);color:#fff;display:grid;place-items:center;font-size:11px}
.legend2{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:14px 0 18px;font-size:14px;color:var(--muted)}
.lg2{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:var(--pc);font-weight:700;font-size:13.5px;background:var(--ps);border-radius:999px;padding:3px 10px 3px 4px}
@media (max-width:760px){
  .flow2{min-width:0}.prow{display:none}.frow{grid-template-columns:1fr}
  .fper{display:block;font-size:12px;font-weight:700;color:var(--muted)}
  .fhelps{flex-direction:row;flex-wrap:wrap}
}
.pc3-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:1000px){.pc3-grid{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.pc3-grid{grid-template-columns:1fr}}
.pc3{position:relative;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--rule);border-top:5px solid var(--pc);border-radius:14px;padding:16px 18px;display:flex;flex-direction:column;gap:4px}
.pc3:hover{box-shadow:0 6px 18px rgba(20,40,40,.08)}
.pc3-n{font-family:var(--display);font-size:26px;color:var(--pc);line-height:1}
.pc3 b{font-size:18px}
.pc3 p{font-size:14.5px;color:var(--muted)}
.pc3-c{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
.pc3-c span{font-size:12px;background:var(--ps);color:var(--pc);font-weight:700;border-radius:999px;padding:1px 9px}

/* why tiles */
.why4{grid-template-columns:repeat(4,1fr)}
@media (max-width:1000px){.why4{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.why4{grid-template-columns:1fr}}
.wcard{align-items:flex-start;text-align:left}
.wcard h3{font-size:19px}
.wn{width:44px;height:44px;font-size:22px}

/* pillar redesign */
.pillar{padding:56px 0 24px}
.pl-banner{display:flex;gap:20px;align-items:center;background:var(--ps);border-radius:20px;padding:24px 28px;position:relative;overflow:hidden}
.pl-big{font-family:var(--display);font-size:84px;line-height:1;color:var(--pc);opacity:.9;flex:none}
.pl-eb{font-size:14px;font-weight:700;color:var(--pc);letter-spacing:.04em}
.pl-t h2{font-family:var(--display);font-size:clamp(22px,3vw,30px);margin:4px 0 6px;color:var(--ink)}
.pl-t p{font-size:15.5px;color:var(--muted);max-width:44em}
@media (max-width:640px){.pl-big{font-size:56px}.pl-banner{padding:18px}}
.inc-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-top:14px}
.inc2{display:flex;flex-direction:column;gap:2px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--rule);border-left:4px solid var(--pc);border-radius:12px;padding:12px 14px}
.inc2:hover{border-color:var(--pc)}
.inc2 b{font-size:16px}
.inc2 span{font-size:13.5px;color:var(--muted)}
.ba2{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:stretch;margin-top:12px}
.ba2>div{border-radius:12px;padding:12px 16px;font-size:15px;display:flex;flex-direction:column;gap:2px}
.ba2 i{font-style:normal;font-size:12px;font-weight:700}
.ba2 .b{background:var(--card);border:1px dashed var(--rule);color:var(--muted)}
.ba2 .a{background:var(--pc);color:#fff}
.ba2 .a i{color:rgba(255,255,255,.8)}
.ba2 .arr{align-self:center;color:var(--pc);font-size:22px;font-weight:700;padding:0;background:none}
@media (max-width:700px){.ba2{grid-template-columns:1fr}.ba2 .arr{display:none}}
.subf{margin-top:40px;padding-top:0;border-top:0}
.sf-top{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sf-top h4{font-size:21px;position:relative;padding-left:14px}
.sf-top h4::before{content:"";position:absolute;left:0;top:4px;bottom:4px;width:5px;border-radius:3px;background:var(--pc)}
.sf-desc{font-size:15.5px;color:var(--muted);margin:4px 0 12px;max-width:46em}
.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media (max-width:800px){.tiles{grid-template-columns:1fr}}
.tile{display:flex;gap:10px;align-items:flex-start;background:var(--card);border:1px solid var(--rule);border-radius:12px;padding:12px 14px;font-size:14.5px;line-height:1.55}
.tile svg{width:20px;height:20px;flex:none;margin-top:1px}
.tile svg circle{fill:var(--pc)}
.subf .shots{margin-top:16px}
.feat .shots figcaption .who{font-size:11px}

/* security tiles */
.scard{align-items:flex-start}
.si{width:40px;height:40px;border-radius:12px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center;font-weight:700;font-size:17px}
.scard h3{font-size:17px}
/* onboarding timeline */
.tline{display:grid;grid-template-columns:repeat(4,1fr);gap:0;position:relative;margin-top:8px}
.tline::before{content:"";position:absolute;left:12%;right:12%;top:22px;height:3px;background:var(--accent-soft)}
.tl3{display:flex;flex-direction:column;align-items:center;text-align:center;gap:6px;padding:0 10px;position:relative}
.tl3>span{width:46px;height:46px;border-radius:50%;background:var(--accent);color:#fff;display:grid;place-items:center;font-family:var(--display);font-size:20px;box-shadow:0 0 0 6px var(--paper)}
.tl3 h3{font-size:17px;margin-top:4px}
.tl3 p{font-size:14px;color:var(--muted)}
@media (max-width:700px){.tline{grid-template-columns:1fr 1fr;row-gap:20px}.tline::before{display:none}}
.draft .ai-tag{display:inline-block}

/* module codes */
.mcode{font-size:12px;font-weight:700;border-radius:6px;padding:2px 8px;background:var(--pc,var(--accent));color:#fff;font-variant-numeric:tabular-nums}
.mkind{font-size:12px;font-weight:700;border-radius:999px;padding:1px 9px}
.mkind.base{background:#16252b;color:#fff}
.mkind.add{background:var(--paper);color:var(--muted);border:1px solid var(--rule)}
.pl-eb em{font-style:normal;margin-left:10px;font-size:12px;border-radius:999px;padding:1px 9px;vertical-align:1px}
.pl-eb em.base{background:#16252b;color:#fff}
.pl-eb em.add{background:var(--card);color:var(--muted);border:1px solid var(--rule)}
.ic-code{font-size:11.5px !important;font-weight:700;color:var(--pc) !important}
.hc i{width:auto;min-width:22px;padding:0 3px}
/* module overview */
.mstack{display:flex;flex-direction:column;gap:14px}
.mbase{display:grid;grid-template-columns:1fr 1.4fr;gap:20px;background:#16252b;color:#fff;border-radius:20px;padding:22px 26px}
@media (max-width:900px){.mbase{grid-template-columns:1fr}}
.mb-l{display:flex;gap:16px;align-items:center}
.mb-l h3{font-family:var(--display);font-size:28px;margin:4px 0}
.mb-l p{color:#c9d5d2}
.mc-code{font-family:var(--display);font-size:22px;color:var(--pc,var(--accent));font-variant-numeric:tabular-nums;flex:none;width:48px}
.mc-code.big{font-size:52px;color:#7fb3e6;width:auto}
.mbase .mkind.base{background:#2769a9}
.mb-r{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media (max-width:600px){.mb-r{grid-template-columns:1fr}}
.mb-col{background:rgba(255,255,255,.06);border-radius:12px;padding:12px 14px}
.mb-col h4{font-size:13px;color:#9fc3e8;margin-bottom:6px}
.mb-col ul{margin:0;padding-left:1.1em;font-size:14.5px}
.mb-col a{color:#fff}
.madd-h{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin-top:8px}
.madd-h h3{font-size:20px}
.madd-h p{font-size:14.5px;color:var(--muted)}
.madd{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media (max-width:1000px){.madd{grid-template-columns:1fr 1fr}}
@media (max-width:600px){.madd{grid-template-columns:1fr}}
.mcard{display:flex;gap:10px;text-decoration:none;color:var(--ink);background:var(--card);border:1px solid var(--rule);border-left:5px solid var(--pc);border-radius:12px;padding:12px 14px}
.mcard:hover{box-shadow:0 6px 16px rgba(20,40,40,.08)}
.mcard b{font-size:16px}
.mcard p{font-size:13.5px;color:var(--muted);margin:2px 0 6px}
.mc-dep{display:flex;flex-wrap:wrap;gap:4px}
.mc-dep span{font-size:11.5px;font-weight:700;background:var(--paper);border:1px solid var(--rule);border-radius:999px;padding:0 8px;color:var(--ink)}
.mc-dep span.free{color:var(--pc);background:var(--ps);border-color:transparent}

/* AI-through-every-step + six values */
.why6{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
@media (max-width:1000px){.why6{grid-template-columns:repeat(2,1fr)}}
@media (max-width:620px){.why6{grid-template-columns:1fr}}
.vcard{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:8px}
.vk{font-size:12.5px;font-weight:700;color:var(--accent);letter-spacing:.04em}
.vcard h3{font-size:19px}
.vcard p{color:var(--muted);font-size:15px}
.vai{margin-top:auto;font-size:13px;color:var(--ai);background:var(--ai-soft);border-radius:8px;padding:6px 10px;line-height:1.55}
.vai b{font-weight:700;margin-right:4px}
.fai{font-size:12.5px;color:var(--ai);background:var(--ai-soft);border-radius:8px;padding:7px 9px;line-height:1.5;min-height:64px}
.fai b{display:block;font-size:11px;letter-spacing:.04em}
@media (max-width:900px){.fai{min-height:0}}
.ai-band{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:stretch;margin-bottom:16px}
.ai-band>div{border-radius:12px;padding:12px 16px;font-size:15px}
.ai-band .was{background:var(--card);border:1px solid var(--rule);color:var(--muted)}
.ai-band .now{background:var(--ai-soft);color:var(--ink)}
.ai-band span{display:block;font-size:12px;font-weight:700}
.ai-band .now span{color:var(--ai)}
.ai-band .arr{align-self:center;color:var(--ai);font-weight:700}
@media (max-width:760px){.ai-band{grid-template-columns:1fr}.ai-band .arr{display:none}}
.claims{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:760px){.claims{grid-template-columns:repeat(2,1fr)}}
.claim{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:18px 20px;font-family:var(--display);font-size:clamp(19px,2.4vw,24px);font-weight:700;display:flex;align-items:center;gap:12px}
.claim span{font-family:var(--body);font-size:13px;color:var(--accent);font-weight:700;font-variant-numeric:tabular-nums}
.sim{margin-top:18px;background:var(--card);border:1.5px solid var(--accent);border-radius:16px;padding:22px 24px;display:flex;flex-direction:column;gap:16px}
.sim-h h3{font-size:clamp(17px,2.2vw,21px);margin-top:4px}
.sim3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media (max-width:900px){.sim3{grid-template-columns:1fr}}
.simc{background:var(--paper);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:6px}
.sk{font-size:13px;font-weight:700;color:var(--accent)}
.sv{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-variant-numeric:tabular-nums}
.sv s{font-size:20px;color:var(--muted)}
.sv i{font-style:normal;color:var(--accent);font-weight:700}
.sv b{font-family:var(--display);font-size:36px;line-height:1.1;color:var(--ink)}
.sv em{font-style:normal;font-size:14px;color:var(--muted)}
.sr{font-size:15px}
.sr b{color:var(--accent)}
.sa{font-size:13px;color:var(--muted);border-top:1px dashed var(--rule);padding-top:8px;margin-top:auto}
.sim-f{font-size:13px;color:var(--muted)}

/* 大區塊：整塊色底＋實色開頭橫幅，一眼看出進入下一個大區塊 */
:root{--on-pc:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--on-pc:#0f1719}}
:root[data-theme="dark"]{--on-pc:#0f1719}
.pillar{margin:48px 0 0;padding:0 28px 40px;border-radius:24px;border:0;background:color-mix(in srgb,var(--ps) 55%,var(--paper));box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--pc) 35%,transparent)}
.pillar+.pillar{margin-top:56px}
.pillar>.pl-banner{margin:0 -28px;border-radius:24px 24px 0 0;background:var(--pc);color:var(--on-pc);padding:28px 32px}
.pillar .pl-big{color:var(--on-pc);opacity:1;font-size:72px;min-width:1.1em;text-align:center}
.pillar .pl-eb{color:var(--on-pc);opacity:.9}
.pillar .pl-t h2{color:var(--on-pc)}
.pillar .pl-t p{color:var(--on-pc);opacity:.88}
.pillar .pl-eb em.base,.pillar .pl-eb em.add{background:var(--on-pc);color:var(--pc);border:0}
.pillar .subf{margin-top:28px;background:var(--card);border-radius:18px;padding:24px 24px 20px}
.pillar .tile,.pillar .gets,.pillar .pc,.pillar .inc2,.pillar .ba2 .b{background:var(--card)}
.pillar .subf .tile,.pillar .subf .ba2 .b,.pillar .subf .inc2{background:var(--paper)}
.lg2 i:empty{width:12px;height:12px;border-radius:50%}
/* 網頁後台示意一律獨佔一列，不和另一張網頁並排 */
.shot.web,.shot.web:has(.browser.mini){flex:1 1 100%}

/* ---- 模組 01／02 示意調整 ---- */
.kbtabs{margin-top:-2px}
.kbtabs i{font-size:12.5px;padding:6px 14px}
.kb2,.dsh{display:grid;grid-template-columns:1fr 190px;gap:10px;flex:1;align-items:start}
.kb2-l,.dsh-l{display:flex;flex-direction:column;gap:10px;min-width:0}
.kb2 .kb-ai,.dsh .kb-ai{align-self:stretch}
.saved{font-size:11px;color:#8fa29e}
.ed-tb{display:flex;align-items:center;gap:2px;border:1px solid #e1e8e6;border-radius:6px;padding:3px 4px;background:#f7f9f8;font-size:11.5px;flex-wrap:wrap}
.ed-tb i{font-style:normal;padding:2px 7px;border-radius:4px;color:#3d4b50}
.ed-tb i em{font-style:italic}
.ed-tb i.sep{width:1px;height:14px;background:#dde4e2;padding:0;margin:0 3px}
.ed-tb i.hl{color:#2769a9;font-weight:700}
.ed-who{margin-left:auto;display:flex;align-items:center;gap:4px;font-size:10.5px;color:#0e7c86;font-weight:700}
.ed-av{width:16px;height:16px;border-radius:50%;background:#0e7c86;color:#fff;display:grid;place-items:center;font-size:9.5px}
.doc.editing{outline:2px solid #2769a9;outline-offset:4px;border-radius:2px;border-top:0;padding-top:2px}
.doc .h.new{color:#0e7c86}
.doc .typing{background:#fffbe8;border-radius:3px;padding:1px 3px;margin:0 -3px}
.caret{display:inline-block;width:1.5px;height:1.05em;background:#16252b;vertical-align:-2px;margin-left:1px;animation:caret 1s steps(1) infinite}
@keyframes caret{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.caret{animation:none}}
.ib{grid-template-columns:165px 1fr 180px}
.ib-side .ed{border-bottom:1px dashed #8fa29e}
.ib-side .dd{border:1px solid #dde4e2;border-radius:4px;padding:0 5px;font-weight:700}
.memo{background:#fffbe8;border:1px solid #f0e3a8;border-radius:6px;padding:5px 7px;font-size:11.5px;color:#5c4a00;display:flex;flex-direction:column}
.memo i{font-style:normal;font-size:10px;color:#9a8a4a;margin-top:2px}
.memo.add{background:#fff;border-style:dashed;border-color:#dde4e2;color:#2769a9}
.lockd{margin-top:6px;border:1px dashed #cfd8d5;border-radius:6px;padding:5px 7px;display:flex;flex-direction:column;gap:4px}
.lk-h{display:flex;justify-content:space-between;align-items:center;gap:4px;font-weight:700;color:#58686d;font-size:11px}
.lk-h em{font-style:normal;font-size:9.5px;background:#eef2f1;color:#3d4b50;border-radius:999px;padding:0 6px;white-space:nowrap}
.lk-b{opacity:.38;display:flex;flex-direction:column;gap:3px;pointer-events:none}
.src-anno{align-self:center;background:#fff2dc;color:#9a5b00;border:1px dashed #d98b00;font-size:10.5px;font-weight:700;border-radius:999px;padding:1px 10px}
.msg.b.wel{outline:2px dashed #d98b00;outline-offset:2px}
.quick.qs{justify-content:flex-start}
.shot.wm{flex:1 1 300px;min-width:260px;max-width:440px}
.wm-card{background:var(--card);border:1px solid var(--rule);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
.wm-r{border:1px solid var(--rule);border-radius:10px;padding:8px 12px;display:flex;flex-direction:column;gap:2px;font-size:14px}
.wm-r p{color:var(--ink)}
.wm-r em{font-style:normal;font-size:12px;color:var(--muted)}
.wm-s{font-size:12px;font-weight:700;color:var(--muted)}
.wm-r.on{border:2px dashed var(--p3);background:var(--p3-soft)}
.wm-r.on .wm-s{color:var(--p3)}
.sec-lbl{font-weight:700;font-size:12.5px;color:#16252b;display:flex;gap:6px;align-items:baseline}
.sec-lbl .muted{font-weight:400;font-size:11.5px}
.sec-div{border-top:2px solid #dde4e2;margin:6px 0 0}
.src-list{display:flex;flex-direction:column;gap:6px}
.kb2 .tb{font-size:11.5px}.kb2 .tb th,.kb2 .tb td{white-space:nowrap;padding:6px 6px}
.lk-ic{width:54px;height:54px;flex:none;border-radius:8px;background:#eef2f1;display:grid;place-items:center;font-size:22px}

/* ---- AI 試問輸入框、草稿、同學介紹、儀表板 ---- */
.kb-ai{display:flex;flex-direction:column}
.ai-in{margin-top:auto;display:flex;align-items:center;gap:6px;background:#fff;border:1px solid #d5c8f3;border-radius:8px;padding:5px 6px 5px 9px;font-size:11.5px;color:#8fa29e}
.ai-in span{flex:1}
.ai-in i{font-style:normal;width:22px;height:22px;border-radius:6px;background:#6b46c1;color:#fff;display:grid;place-items:center;font-size:11px}
.draftbox{margin-top:auto;background:#f3effc;border:1px solid #e2d8f7;border-radius:8px;padding:7px 9px;font-size:12px;line-height:1.55;color:#3d4b50;cursor:pointer;display:flex;flex-direction:column;gap:3px}
.draftbox:hover{border-color:#6b46c1}
.draftbox .ai-tag{font-style:normal;align-self:flex-start}
.draftbox em{font-style:normal;font-size:10.5px;color:#6b46c1;font-weight:700;align-self:flex-end}
.composer2{border:1px solid #dde4e2;border-radius:8px;padding:5px 6px;display:flex;align-items:center;gap:8px;color:#8fa29e;font-size:12px}
.composer2 .ph{flex:1}
.composer2 .att{width:24px;height:24px;border-radius:6px;display:grid;place-items:center;background:#eef2f1;font-size:12px}
.manual{display:inline-block;font-size:10px;font-weight:700;color:#7a4fb0;background:#efe8f8;border-radius:4px;padding:0 5px;vertical-align:1px}
.setref{display:inline-block;font-size:10.5px;font-weight:700;color:#2769a9;border:1px dashed #2769a9;border-radius:4px;padding:0 5px}
.dsh-l .kpi4 b{font-size:19px}
.vbars{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;height:110px;align-items:end;padding-top:4px}
.vbars div{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;gap:2px;font-size:10.5px}
.vbars i{display:block;width:70%;background:#c9dcef;border-radius:4px 4px 0 0;order:1}
.vbars em{font-style:normal;color:#58686d;font-variant-numeric:tabular-nums;order:0}
.vbars span{color:#8fa29e;order:2}
.vbars .on i{background:#2769a9}.vbars .on em{color:#2769a9;font-weight:700}
.hb{grid-template-columns:64px 1fr 24px}
.ib-i .tag{align-self:start}
</style>
</head>
<body>
<div class="topbar">
  <button class="tb-btn" id="navToggle" aria-label="收合或展開導覽列" aria-controls="sidebar" aria-expanded="true">☰</button>
  <span class="tb-brand">補習班 LINE 招生與教務平台</span>
  <span class="tb-sp"></span>
  <a class="tb-cta" href="#contact">預約展示</a>
</div>
<div class="layout" id="layout">
  <aside class="sidebar" id="sidebar" aria-label="網站導覽">
    <div class="sb-head"><b>超棒軟體</b><span>補習班 LINE 平台</span></div>
    <nav class="sb-nav"><a class="nv" href="#home">首頁</a><a class="nv" href="#why">導入後的六個改變</a><a class="nv" href="#overview">AI 貫穿每一步</a><a class="nv" href="#modules">模組總覽</a><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#ai">一、AI 客服</a><button class="ng-t" aria-expanded="true" aria-controls="ai-list" aria-label="展開或收合AI 客服">▾</button></div><div class="ng-l" id="ai-list"><a class="nv sub" href="#ai-service">AI 家長客服</a><a class="nv sub" href="#offers">課程與方案管理</a><a class="nv sub" href="#inbox">真人接手收件匣</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#source">二、招生來源追溯</a><button class="ng-t" aria-expanded="true" aria-controls="source-list" aria-label="展開或收合招生來源追溯">▾</button></div><div class="ng-l" id="source-list"><a class="nv sub" href="#friends">好友來源名單</a><a class="nv sub" href="#links">來源連結與 QR Code</a><a class="nv sub" href="#roi">來源成效報表</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#crm">三、招生 CRM</a><button class="ng-t" aria-expanded="true" aria-controls="crm-list" aria-label="展開或收合招生 CRM">▾</button></div><div class="ng-l" id="crm-list"><a class="nv sub" href="#followup">招生總覽與跟進清單</a><a class="nv sub" href="#pipeline">名單看板與名單卡片</a><a class="nv sub" href="#trial">試聽預約與試聽回饋</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#family">四、學生與家長服務</a><button class="ng-t" aria-expanded="true" aria-controls="family-list" aria-label="展開或收合學生與家長服務">▾</button></div><div class="ng-l" id="family-list"><a class="nv sub" href="#students">學生檔案與家長綁定</a><a class="nv sub" href="#grades">作業成績與家長查詢</a><a class="nv sub" href="#reports">AI 月學習報告</a><a class="nv sub" href="#notices">公告與聯絡簿</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#daily">五、出缺勤與日常行政</a><button class="ng-t" aria-expanded="true" aria-controls="daily-list" aria-label="展開或收合出缺勤與日常行政">▾</button></div><div class="ng-l" id="daily-list"><a class="nv sub" href="#attendance">到班點名與通知</a><a class="nv sub" href="#leave">LINE 請假</a><a class="nv sub" href="#makeup">補課安排</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a" href="#manage">六、續班與經營管理</a><button class="ng-t" aria-expanded="true" aria-controls="manage-list" aria-label="展開或收合續班與經營管理">▾</button></div><div class="ng-l" id="manage-list"><a class="nv sub" href="#renewal">續班與繳費提醒</a><a class="nv sub" href="#retention">流失預警</a><a class="nv sub" href="#branches">多分校管理</a></div></div><a class="nv" href="#security">資料安全與個資</a><a class="nv" href="#onboarding">導入流程</a><a class="nv" href="#pricing">方案與費用</a><a class="nv" href="#faq">常見問題</a><a class="nv cta" href="#contact">預約展示</a></nav>
  </aside>
  <div class="scrim" id="scrim"></div>
  <main class="content">

<section class="hero2" id="home">
  <div class="h-text">
    <span class="eyebrow">補習班的 AI 營運平台・全部在 LINE 完成</span>
    <h1>繁雜行政交給 AI，<br>你的團隊回到教學與招生</h1>
    <p class="lead2">回覆問班、整理名單、提醒跟進、寫試聽回饋、發公告、通知到班、寫月報、追續班。從招生到續班的每一步，AI 都先替你做好，人員只需要確認與處理真正需要人的事。</p>
    <div class="h-pts"><span>✓ 沿用現有 LINE 官方帳號</span><span>✓ 家長、老師都不用裝 App</span><span>✓ 資料存放在台灣</span></div>
    <div class="h-btns"><a class="btn-p" href="#contact">預約展示</a><a class="btn-s" href="#overview">看 AI 如何貫穿每一步</a></div>
  </div>
  <div class="h-vis"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長只看到答案，不會看到文件結構</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">板橋有國二理化嗎？多少錢</div>
<div class="msg b">有的！板橋分校每週六 14:00–16:00 上課，每期 12 週 NT$9,600，含講義。想先試聽一堂嗎？</div>
<div class="msg p">可以只上半期嗎</div>
<div class="msg b">這個問題我幫您轉給行政人員確認，稍後由專人回覆您 🙏</div></div></div></figure></div>
</section>

<section class="sec" id="why">
  <div class="sec-h"><span class="eyebrow">導入後的六個改變</span><h2>AI 接手行政，補習班全面升級</h2></div>
  <div class="claims">
    <div class="claim"><span>01</span>招生變快</div>
    <div class="claim"><span>02</span>學生變多</div>
    <div class="claim"><span>03</span>行政變少</div>
    <div class="claim"><span>04</span>續班變高</div>
    <div class="claim"><span>05</span>學生關懷變多</div>
    <div class="claim"><span>06</span>招生花費轉換變高</div>
  </div>
  <div class="sim">
    <div class="sim-h"><span class="eyebrow">情境試算・公版範例</span><h3>以一間 500 位學生、每人每週上 2 堂課的補習班來算</h3></div>
    <div class="sim3">
      <div class="simc"><span class="sk">學生變多</span>
        <div class="sv"><s>200</s><i>→</i><b>240</b><em>位新生／年</em></div>
        <p class="sr">一年多 <b>40 位</b>學生</p>
        <p class="sa">假設每年 800 位家長問班，AI 秒回與自動跟進讓報名率從 25% 提升到 30%。</p></div>
      <div class="simc"><span class="sk">行政變少，關懷變多</span>
        <div class="sv"><b>35</b><em>小時／週</em></div>
        <p class="sr">每位學生每月多約 <b>18 分鐘</b>關懷時間</p>
        <p class="sa">每週 1,000 堂次：點名與到班通知每堂次省 1 分鐘（約 17 小時）、5% 請假補課每件省 10 分鐘（約 8 小時）、200 則家長詢問每則省 3 分鐘（10 小時）。</p></div>
      <div class="simc"><span class="sk">花費轉換變高</span>
        <div class="sv"><s>3,000</s><i>→</i><b>2,500</b><em>元／位</em></div>
        <p class="sr">每位學生的進班成本降低 <b>17%</b></p>
        <p class="sa">假設年度招生預算 NT$600,000 不變，新生從 200 位增加到 240 位；看清來源後把預算移到有效管道，還能再降。</p></div>
    </div>
    <p class="sim-f">以上為示意假設，不代表保證成效。導入時我們會先記錄你目前的問班數、報名率與行政工時，之後用你自己的數字比較前後差異。</p>
  </div>
</section>

<section class="sec" id="overview">
  <div class="sec-h"><span class="eyebrow">AI 貫穿每一步</span><h2>從招生到續班，每一步都有 AI 先做好</h2>
  <p class="sec-p">不是在某個角落加一個聊天機器人，而是讓 AI 接手整個流程裡的繁雜工作。點任一個功能，直接看介紹。</p></div>
  <div class="flow2-wrap"><div class="flow2">
  <div class="prow"><div class="pband" style="grid-column:span 4">招生期</div><div class="pband" style="grid-column:span 3">在學期間</div><div class="pband" style="grid-column:span 1">續班</div></div>
  <div class="frow"><div class="fcol"><span class="fper">招生期</span><div class="fst"><span>1</span>招生曝光</div><div class="fhelps"><a class="hc c2" href="#links"><i>02</i>來源連結與 QR</a><a class="hc c2" href="#friends"><i>02</i>好友來源名單</a></div></div><div class="fcol"><span class="fper">招生期</span><div class="fst"><span>2</span>問班諮詢</div><div class="fhelps"><a class="hc c1" href="#ai-service"><i>01</i>AI 家長客服</a><a class="hc c1" href="#offers"><i>01</i>課程與方案</a><a class="hc c1" href="#inbox"><i>01</i>真人接手</a><a class="hc c3" href="#followup"><i>03</i>跟進清單</a></div></div><div class="fcol"><span class="fper">招生期</span><div class="fst"><span>3</span>試聽</div><div class="fhelps"><a class="hc c3" href="#trial"><i>03</i>試聽預約與回饋</a><a class="hc c3" href="#pipeline"><i>03</i>名單看板</a></div></div><div class="fcol"><span class="fper">招生期</span><div class="fst"><span>4</span>報名</div><div class="fhelps"><a class="hc c4" href="#students"><i>04</i>學生與家長綁定</a><a class="hc c2" href="#roi"><i>02</i>來源成效</a></div></div><div class="fcol"><span class="fper">在學期間</span><div class="fst"><span>5</span>開課</div><div class="fhelps"><a class="hc c4" href="#notices"><i>07</i>公告與聯絡簿</a><a class="hc c6" href="#branches"><i>13</i>多分校管理</a></div></div><div class="fcol"><span class="fper">在學期間</span><div class="fst"><span>6</span>日常上課</div><div class="fhelps"><a class="hc c5" href="#attendance"><i>08</i>到班點名</a><a class="hc c5" href="#leave"><i>09</i>LINE 請假</a><a class="hc c5" href="#makeup"><i>10</i>補課安排</a></div></div><div class="fcol"><span class="fper">在學期間</span><div class="fst"><span>7</span>學習追蹤</div><div class="fhelps"><a class="hc c4" href="#grades"><i>05</i>作業成績查詢</a><a class="hc c4" href="#reports"><i>06</i>AI 月學習報告</a></div></div><div class="fcol"><span class="fper">續班</span><div class="fst"><span>8</span>續班或流失</div><div class="fhelps"><a class="hc c6" href="#renewal"><i>11</i>續班提醒</a><a class="hc c6" href="#retention"><i>12</i>流失預警</a></div></div></div>
</div></div>
<div class="legend2"><span>顏色代表六大區塊，數字為模組編號。六大區塊：</span><a class="lg2 c1" href="#ai"><i></i>一、AI 客服</a><a class="lg2 c2" href="#source"><i></i>二、招生來源追溯</a><a class="lg2 c3" href="#crm"><i></i>三、招生 CRM</a><a class="lg2 c4" href="#family"><i></i>四、學生與家長服務</a><a class="lg2 c5" href="#daily"><i></i>五、出缺勤與日常行政</a><a class="lg2 c6" href="#manage"><i></i>六、續班與經營管理</a></div>
</section>

<section class="sec" id="modules">
  <div class="sec-h"><span class="eyebrow">模組總覽</span><h2>從基本模組開始，需要什麼再加什麼</h2>
  <p class="sec-p">AI 客服是每家補習班的基本模組；其他 12 個附加模組可依需要逐步加購。</p></div>
  <div class="mstack">
  <div class="mbase">
    <div class="mb-l"><span class="mc-code big">01</span><div><span class="mkind base">基本模組・每家補習班都包含</span><h3>AI 客服</h3><p>家長的問題即時回答，需要人的交給人。</p></div></div>
    <div class="mb-r"><div class="mb-col"><h4>包含功能</h4><ul><li><a href="#ai-service">AI 家長客服</a></li><li><a href="#offers">課程與方案管理</a></li><li><a href="#inbox">真人接手收件匣</a></li></ul></div>
      <div class="mb-col"><h4>平台基本功能</h4><ul><li>沿用現有 LINE 官方帳號</li><li>後台帳號與角色權限（帳號不限人數）</li><li>資料安全與個資保護</li><li>導入協助與教育訓練</li></ul></div></div>
  </div>
  <div class="madd-h"><h3>附加模組</h3><p>依補習班的需要逐步加購。標示「需搭配」的模組，要先有對應的模組才能使用。</p></div>
  <div class="madd"><a class="mcard c2" href="#friends"><span class="mc-code">02</span><div><b>招生來源追溯</b><p>誰從哪裡加了 LINE，各來源帶來多少報名</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c3" href="#followup"><span class="mc-code">03</span><div><b>招生 CRM</b><p>每位好友在哪個階段、今天該跟進誰</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c4" href="#students"><span class="mc-code">04</span><div><b>學生檔案與家長綁定</b><p>學生、家長、學生本人都連上 LINE</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c4" href="#grades"><span class="mc-code">05</span><div><b>作業成績與家長查詢</b><p>家長在 LINE 查成績與作業</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c4" href="#reports"><span class="mc-code">06</span><div><b>AI 月學習報告</b><p>每月學習報告，班導確認後送出</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span><span>需搭配 05 作業成績與家長查詢</span></div></div></a><a class="mcard c4" href="#notices"><span class="mc-code">07</span><div><b>公告與聯絡簿</b><p>一句話產生公告，發給對的家長</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c5" href="#attendance"><span class="mc-code">08</span><div><b>到班點名與通知</b><p>掃 QR 點名，家長即時收到通知</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c5" href="#leave"><span class="mc-code">09</span><div><b>LINE 請假</b><p>在 LINE 請假，點名自動同步</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span><span>需搭配 08 到班點名與通知</span></div></div></a><a class="mcard c5" href="#makeup"><span class="mc-code">10</span><div><b>補課安排</b><p>依你的補課制度列出補課選項</p><div class="mc-dep"><span>需搭配 09 LINE 請假</span></div></div></a><a class="mcard c6" href="#renewal"><span class="mc-code">11</span><div><b>續班與繳費提醒</b><p>自動提醒，家長一鍵回覆</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c6" href="#retention"><span class="mc-code">12</span><div><b>流失預警</b><p>提早發現可能不續班的學生</p><div class="mc-dep"><span>需搭配 05 作業成績與家長查詢</span><span>需搭配 08 到班點名與通知</span></div></div></a><a class="mcard c6" href="#branches"><span class="mc-code">13</span><div><b>多分校管理</b><p>總部看全部，分校各自管理</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a></div>
</div>
</section>

<section class="pillar c1" id="ai">
  <div class="pl-banner">
    <span class="pl-big">一</span>
    <div class="pl-t"><span class="pl-eb">一、AI 客服<em class="base">模組 01・基本模組</em></span><h2>家長的問題 24 小時即時回答，需要人的交給人</h2><p>家長在你現有的 LINE 官方帳號提問，AI 依你核准的課程與方案資料回答；退費、成績保證、孩子個別狀況這類需要判斷的問題，交給你的人員處理。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#ai-service"><b>AI 家長客服</b><span>依你提供的課程資料</span></a><a class="inc2" href="#offers"><b>課程與方案管理</b><span>學費、優惠、名額、試聽時段集中管理</span></a><a class="inc2" href="#inbox"><b>真人接手收件匣</b><span>AI 轉過來的問題集中在一個收件匣</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>家長晚上傳訊息，隔天才有人回；新人報價說錯也收不回來</div><div class="arr">→</div><div class="a"><i>用了平台</i>AI 立刻依你的資料回答，數字只說你核准的，需要人的才轉過去</div></div>
  <div class="subf" id="ai-service">
  <div class="sf-top"><h4>AI 家長客服</h4><span class="mkind base">基本模組</span></div>
  <p class="sf-desc">依你提供的課程資料，24 小時回答上課時間、地點、收費、試聽。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>課程資料在後台像寫文件一樣編輯，隨時更新</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>AI 答不出來的問題自動收集，補一次就學會</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>需要判斷的問題不自行回答，直接轉人員</span></div></div>
  <div class="shots"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長只看到答案，不會看到文件結構</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">板橋有國二理化嗎？多少錢</div>
<div class="msg b">有的！板橋分校每週六 14:00–16:00 上課，每期 12 週 NT$9,600，含講義。想先試聽一堂嗎？</div>
<div class="msg p">可以只上半期嗎</div>
<div class="msg b">這個問題我幫您轉給行政人員確認，稍後由專人回覆您 🙏</div></div></div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>知識庫・文件分頁：正在編輯子文件，右側直接試問 AI</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/kb/docs/g8-science</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i on">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>知識庫</b><span class="tag warn">待補充問題 3</span><span class="sp"></span><span class="btn ghost">版本紀錄</span><span class="btn">發布變更</span></div>
<div class="tabs kbtabs"><i class="on">文件</i><i>課程與方案</i></div>
<div class="kb">
  <div class="kb-tree">
    <div class="t-m">補習班資訊</div><div class="t-c">本部地址與交通</div><div class="t-c">板橋分校</div>
    <div class="t-m open">課程總覽</div><div class="t-c on">國二理化</div><div class="t-c">國二數學</div><div class="t-c">國三總複習</div><div class="t-add">＋ 新增子文件</div>
    <div class="t-m">收費與規定</div><div class="t-c">退費辦法</div>
    <div class="t-m">公告與異動</div><div class="t-c">颱風停課 <i class="exp">11/18 到期</i></div>
    <div class="t-m">常見問答</div>
  </div>
  <div class="kb-ed">
    <div class="crumb">課程總覽 › <b>國二理化</b></div>
    <div class="meta-row"><span class="fld">適用分校：<b>本部、板橋</b></span><span class="fld">生效：<b>長期</b></span><span class="tag warn">編輯中・未發布</span><span class="saved">已自動儲存・剛剛</span></div>
    <div class="ed-tb"><i><b>B</b></i><i><em>I</em></i><i>H</i><i>• 清單</i><i>🔗 連結</i><i class="sep"></i><i class="hl">＋ 引用課程與方案</i><span class="ed-who"><span class="ed-av">林</span>林主任 編輯中</span></div>
    <div class="doc editing">
      <p class="h">上課時間</p><p>每週三 19:00–21:00（本部 3 樓）、每週六 14:00–16:00（板橋）</p>
      <p class="h">學費、時段與試聽</p><p><span class="ref">引用：課程與方案 › 國二理化</span><br><span class="muted">數字不寫在文件裡，由課程與方案統一管理</span></p>
      <p class="h">師資</p><p>林老師，教學 12 年</p>
      <p class="h">教學特色</p><p>每單元結束有實驗示範與小考，段考前加開複習</p>
      <p class="h new">半期與插班</p><p class="typing">目前不開放只上半期，第 4 週前可插班，學費依剩餘週數計算<span class="caret"></span></p>
    </div>
  </div>
  <div class="kb-ai">
    <div class="ai-h">AI 試問</div>
    <div class="q">板橋有國二理化嗎？多少錢</div>
    <div class="a">有，板橋每週六 14:00–16:00 上課，每期 12 週 NT$9,600，含講義。</div>
    <div class="src">引用：課程與方案 › 國二理化（板橋）</div>
    <div class="q">可以只上半期嗎</div>
    <div class="a miss">查無依據 → 會轉真人</div>
    <div class="btn sm">補進文件</div>
    <div class="src">↑ 左側正在補寫「半期與插班」</div>
    <div class="ai-in"><span>輸入問題試試看…</span><i>➤</i></div>
  </div>
</div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="offers">
  <div class="sf-top"><h4>課程與方案管理</h4><span class="mkind base">基本模組</span></div>
  <p class="sf-desc">學費、優惠、名額、試聽時段集中管理，AI 只能引用這裡的數字。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>AI 回答與跟進訊息中的數字都標出來源</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>沒設定的項目（例如分期）AI 不回答，交給人員</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>優惠到期自動失效</span></div></div>
  <div class="shots"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長問優惠與分期</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">國二數學現在報名有優惠嗎？</div>
<div class="msg b">有的！11/30 前報名板橋國二數學 B，第一期學費折 NT$500。目前還有 3 個名額。</div>
<div class="msg p">學費可以分期嗎</div>
<div class="msg b">繳費方式我請招生老師跟您說明，稍後回覆您 🙏</div></div></div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>知識庫・課程與方案分頁：AI 唯一能引用的數字來源，共用同一個 AI 試問</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/kb/offerings</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i on">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>知識庫</b><span class="tag warn">待補充問題 3</span><span class="sp"></span><span class="btn ghost">變更紀錄</span><span class="btn">＋ 新增方案</span></div>
<div class="tabs kbtabs"><i>文件</i><i class="on">課程與方案</i></div>
<div class="kb2"><div class="kb2-l">
<div class="pg-h"><span class="seg"><i class="on">板橋</i><i>本部</i><i>全部</i></span></div>
<table class="tb"><tr><th>班級</th><th>時段</th><th>每期</th><th>學費</th><th>繳費方式</th><th>人數</th><th>試聽名額</th><th>優惠</th></tr>
<tr><td><b>國二數學 B</b></td><td>週五 19:00</td><td>12 週</td><td>NT$9,600</td><td>一次繳清</td><td>9 / 12</td><td>11/19 剩 2</td><td><span class="tag ok">11/30 前折 500</span></td></tr>
<tr><td><b>國二理化</b></td><td>週六 14:00</td><td>12 週</td><td>NT$9,600</td><td>一次繳清</td><td>14 / 16</td><td>11/22 剩 1</td><td><span class="tag ok">11/30 前折 500</span></td></tr>
<tr><td><b>國三總複習</b></td><td>週二、四 19:00</td><td>16 週</td><td>NT$15,800</td><td>一次・兩期</td><td>18 / 20</td><td class="muted">不開放</td><td class="muted">—</td></tr>
</table>
<div class="pn"><div class="pn-h">AI 草稿檢查（範例）</div>
<p class="sumtxt">國二數學 B 每班上限 <span class="srcv">12 人<i>方案資料</i></span>，週五 <span class="srcv">19:00<i>方案資料</i></span>上課，<span class="srcv">11/30 前報名第一期折 NT$500<i>優惠</i></span>。<s class="bad">學費可分兩期繳</s></p>
<div class="chk warn">「可分兩期」不在國二數學 B 的繳費方式中，已從草稿移除，請人員確認</div></div>
</div>
  <div class="kb-ai">
    <div class="ai-h">AI 試問</div>
    <div class="q">國二數學現在報名有優惠嗎？</div>
    <div class="a">有，11/30 前報名板橋國二數學 B，第一期折 NT$500，目前還有 3 個名額。</div>
    <div class="src">引用：課程與方案 › 國二數學 B（板橋）</div>
    <div class="q">學費可以分期嗎</div>
    <div class="a miss">國二數學 B 只設定一次繳清 → 會轉真人</div>
    <div class="btn sm">設定繳費方式</div>
    <div class="ai-in"><span>輸入問題試試看…</span><i>➤</i></div>
  </div>
</div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="inbox">
  <div class="sf-top"><h4>真人接手收件匣</h4><span class="mkind base">基本模組</span></div>
  <p class="sf-desc">AI 轉過來的問題集中在一個收件匣，指派給對的人，一個都不漏。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>人員接手時 AI 自動暫停，結案後恢復</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>右側直接改名稱、指派負責人、加標籤與備註</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>申訴、退費自動通知主任</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>接手對話、AI 已暫停，右側指派負責人與備註</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/inbox/u8f2</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i on">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>收件匣</b><span class="seg"><i class="on">待處理 4</i><i>處理中 2</i><i>AI 處理中</i><i>已結案</i></span></div>
<div class="ib">
  <div class="ib-list">
    <div class="ib-i on"><b>王小明爸爸 <span class="idt pr">家長</span></b><span class="tag warn">學習狀況</span><small>段考退步很多分，可以知道…</small><em>3 分鐘前</em></div>
    <div class="ib-i"><b>王小明 <span class="idt st">學生</span></b><span class="tag">找老師</span><small>講義忘在教室了可以…</small><em>8 分鐘前</em></div>
    <div class="ib-i"><b>陳媽媽 <span class="idt nw">新朋友</span></b><span class="tag">問班</span><small>可以只上半期嗎</small><em>12 分鐘前</em></div>
    <div class="ib-i"><b>林小姐</b><span class="tag">個別狀況</span><small>孩子最近不想來…</small><em>1 小時前</em></div>
    <div class="ib-i"><b>張先生</b><span class="tag">其他</span><small>發票抬頭可以改嗎</small><em>昨天</em></div>
  </div>
  <div class="ib-chat">
    <div class="banner">AI 已暫停・由 林主任 處理中 <span class="btn sm ghost">結案並恢復 AI</span></div>
    <div class="cm p">下週三理化課照常上嗎？</div>
    <div class="cm b">照常上課喔！國二理化 A 週三 19:00–21:00，在本部 3 樓。<i>AI</i></div>
    <div class="cm p">他這次段考退步很多分，可以知道是為什麼嗎？</div>
    <div class="cm b">孩子的學習狀況需要老師個別了解，我已經轉給主任，稍後回覆您。<i>AI・已轉真人</i></div>
    <div class="cm s">小明爸爸您好，我是林主任，我先看了小明這學期的小考成績……<i>林主任</i></div>
    <div class="draftbox"><i class="ai-tag">AI 草稿</i><span>小明爸爸您好，小明這學期理化小考平均 76 分，退步主要在第 3 單元的計算題。我們可以先幫他安排一次診斷小考…</span><em>點一下帶入輸入框</em></div>
    <div class="composer2"><span class="att" title="附件">📎</span><span class="ph">輸入訊息…</span><span class="btn sm">送出</span></div>
  </div>
  <div class="ib-side">
    <div class="side-h">聊天室</div>
    <div class="kv"><span>顯示名稱</span><b class="ed">王小明爸爸 ✎</b></div>
    <div class="kv"><span>指派給</span><b class="dd">林主任 ▾</b></div>
    <div class="kv"><span>狀態</span><b class="dd">處理中 ▾</b></div>
    <div class="kv"><span>標籤</span><b><span class="tag warn">學習狀況</span> <span class="muted">＋</span></b></div>
    <div class="side-h">備註</div>
    <div class="memo">上期數學 68 分，建議安排小考診斷<i>林主任・11/23</i></div>
    <div class="memo add">＋ 新增備註</div>
    <div class="lockd"><div class="lk-h"><span>家長資訊</span><em>模組 04 開放</em></div>
      <div class="lk-b"><div class="kv"><span>綁定學生</span><b>王小明・國二</b></div><div class="kv"><span>班級</span><b>理化 A、數學 B</b></div></div></div>
    <div class="lockd"><div class="lk-h"><span>招生歷程</span><em>模組 03 開放</em></div>
      <div class="lk-b"><div class="tl"><b>9/02 問班</b>想加強理化</div><div class="tl"><b>9/12 報名</b>國二理化 A</div></div></div>
  </div>
</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>一般問題 AI 直接回答，問到孩子的學習狀況才轉真人</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">下週三理化課照常上嗎？</div>
<div class="msg b">照常上課喔！國二理化 A 週三 19:00–21:00，在本部 3 樓。</div>
<div class="msg p">他這次段考退步很多分，可以知道是為什麼嗎？</div>
<div class="msg b">孩子的學習狀況需要老師個別了解，我已經轉給主任，稍後回覆您。</div>
<div class="msg b">小明爸爸您好，我是林主任，我先看了小明這學期的小考成績……</div></div></div></figure></div>
</div>
</section><section class="pillar c2" id="source">
  <div class="pl-banner">
    <span class="pl-big">二</span>
    <div class="pl-t"><span class="pl-eb">二、招生來源追溯<em class="add">模組 02・附加模組</em></span><h2>誰從哪裡加了 LINE，一目瞭然</h2><p>每個廣告、傳單都有自己的連結與 QR Code；同學介紹來的，加入後由人員標記介紹人。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#friends"><b>好友來源名單</b><span>每一位新加入的 LINE 好友</span></a><a class="inc2" href="#links"><b>來源連結與 QR Code</b><span>每個招生活動產生專屬連結與 QR Code</span></a><a class="inc2" href="#roi"><b>來源成效報表</b><span>各來源、分校、科目的問班、試聽、報名數與每筆報名的取得成本並排比較</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>只知道這個月花了多少錢、報名了幾個人，不知道是哪一筆預算有效</div><div class="arr">→</div><div class="a"><i>用了平台</i>每位好友都有來源，每個來源都算得出報名數與取得成本</div></div>
  <div class="subf" id="friends">
  <div class="sf-top"><h4>好友來源名單</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">每一位新加入的 LINE 好友，從哪個廣告、傳單或誰介紹來，現在在哪個階段。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>點連結、掃 QR 加入時自動記錄來源</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>直接搜尋加入的，AI 在對話中順便詢問</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可依來源、分校篩選</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>每位新好友從哪裡來、現在到哪一步</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm/friends</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>新加入的 LINE 好友</b><span class="seg"><i class="on">本週 46</i><i>本月</i></span><span class="sp"></span><span class="seg"><i class="on">全部來源</i><i>Meta 廣告</i><i>傳單</i><i>同學介紹</i></span></div>
<table class="tb"><tr><th>加入時間</th><th>LINE 名稱</th><th>從哪裡來</th><th>分校</th><th>目前階段</th></tr>
<tr><td>11/23 20:41</td><td><b>陳媽媽</b></td><td><span class="srcb meta">Meta 廣告・國二冬季招生</span></td><td>板橋</td><td><span class="stg2 s2">問班中</span></td></tr>
<tr><td>11/23 18:12</td><td><b>Annie</b></td><td><span class="srcb flyer">傳單・建國國中校門</span></td><td>本部</td><td><span class="stg2 s1">只加好友</span></td></tr>
<tr><td>11/23 12:05</td><td><b>吳爸爸</b></td><td><span class="srcb ref">同學介紹・王小明</span> <span class="manual">✎ 人員標記</span></td><td>本部</td><td><span class="stg2 s3">已約試聽</span></td></tr>
<tr><td>11/22 21:30</td><td><b>小周</b></td><td><span class="srcb web">官網</span></td><td>板橋</td><td><span class="stg2 s2">問班中</span></td></tr>
<tr><td>11/22 19:47</td><td><b>林先生</b></td><td><span class="srcb unk">來源不明・AI 詢問中</span> <span class="setref">＋ 設定介紹人</span></td><td>板橋</td><td><span class="stg2 s1">只加好友</span></td></tr>
</table>
<div class="rule">點專屬連結或掃 QR 加入時自動記錄來源；直接搜尋加入的，AI 會在對話中順便詢問。同學介紹沒有專屬連結，由人員在名單旁<u>設定介紹人</u></div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="links">
  <div class="sf-top"><h4>來源連結與 QR Code</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">每個招生活動產生專屬連結與 QR Code，印在傳單、放進廣告就能開始追蹤。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Meta 廣告、傳單、官網都能建立</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>掃描加入後，歡迎訊息依來源不同，直接接著問下一步</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>依分校與科目分開追蹤</span></div></div>
  <div class="shots"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>掃「小高一試聽班」傳單加入後</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg sys">您已加入示範教育的好友</div>
<div class="src-anno">來源：傳單・小高一試聽班</div>
<div class="msg b wel">您好，歡迎加入示範教育 😊 看到您是從<b>小高一試聽班</b>的傳單來的，想要試聽哪一堂小高一的課呢？</div>
<div class="quick qs"><span>數學</span><span>英文</span><span>物理</span><span>化學</span></div>
<div class="msg p">數學</div>
<div class="msg b">小高一數學試聽在 12/7（六）14:00，本部 3 樓，要幫您保留位子嗎？</div></div></div></figure><figure class="shot wm"><figcaption><span class="who staff">補習班人員設定</span>同一個 LINE 帳號，依來源送出不同的歡迎訊息</figcaption><div class="wm-card">
<div class="wm-r on"><span class="wm-s">傳單・小高一試聽班</span><p>看到您是從小高一試聽班的傳單來的，想要試聽哪一堂小高一的課呢？</p><em>附快速選項：數學／英文／物理／化學</em></div>
<div class="wm-r"><span class="wm-s">Meta 廣告・國二冬季招生</span><p>國二冬季班 12 月開課，想了解數學還是理化呢？</p></div>
<div class="wm-r"><span class="wm-s">官網・直接搜尋</span><p>一般歡迎訊息，AI 會在對話中順便詢問從哪裡知道我們</p></div>
</div></figure></div>
</div><div class="subf" id="roi">
  <div class="sf-top"><h4>來源成效報表</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">各來源、分校、科目的問班、試聽、報名數與每筆報名的取得成本並排比較。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>主任每月填入花費，系統算出取得成本</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>知道哪個來源最划算，下一筆預算放對地方</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每週營運摘要寄到主任信箱</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>來源成效：哪個來源最划算（數字為情境範例）</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/sources</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i on">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>招生來源成效</b><span class="seg"><i class="on">11 月</i><i>本學期</i></span><span class="seg"><i class="on">全部分校</i><i>板橋</i><i>本部</i></span><span class="sp"></span><span class="btn">＋ 建立來源連結</span></div>
<div class="sec-lbl">成效</div>
<table class="tb src-t"><tr><th>來源活動</th><th>分校・科目</th><th>花費</th><th>問班</th><th>試聽</th><th>報名</th><th>報名率</th><th>每筆報名成本</th></tr>
<tr><td><b>Meta 廣告・國二冬季招生</b></td><td>板橋・數學</td><td>NT$100,000</td><td>180</td><td>35</td><td>12</td><td>6.7%</td><td><b>NT$8,333</b></td></tr>
<tr><td><b>傳單・國中校門</b></td><td>本部・理化</td><td>NT$12,000</td><td>40</td><td>14</td><td>6</td><td>15.0%</td><td><b class="good">NT$2,000</b></td></tr>
<tr><td><b>同學介紹</b> <span class="manual">人員標記</span></td><td>全部</td><td>—</td><td>22</td><td>15</td><td>9</td><td>40.9%</td><td>—</td></tr>
<tr><td><b>官網</b></td><td>全部</td><td>—</td><td>31</td><td>8</td><td>3</td><td>9.7%</td><td>—</td></tr>
</table>
<div class="sec-div"></div>
<div class="sec-lbl">來源<span class="muted">（4 個，與上方成效相同）</span></div>
<div class="src-list">
<div class="src-q"><div class="lk-ic">🔗</div><div><b>Meta 廣告・國二冬季招生</b><span>go.補教平台.tw/c/meta-bq-math</span><span class="muted">貼在廣告的按鈕連結</span></div><span class="btn sm ghost">複製連結</span></div>
<div class="src-q"><div class="qr sm"></div><div><b>傳單・國中校門</b><span>go.補教平台.tw/c/flyer-hq-sci</span><span class="muted">印在傳單上，掃描後記錄來源並加入好友</span></div><span class="btn sm ghost">下載 QR</span></div>
<div class="src-q"><div class="lk-ic">👥</div><div><b>同學介紹</b><span>沒有專屬連結，加入後由人員手動標記</span><span class="muted">在好友名單旁「設定介紹人」，選擇是哪位同學介紹的</span></div><span class="btn sm ghost">到好友名單</span></div>
<div class="src-q"><div class="lk-ic">🌐</div><div><b>官網</b><span>go.補教平台.tw/c/website</span><span class="muted">放在官網的「加入 LINE」按鈕</span></div><span class="btn sm ghost">複製連結</span></div>
</div></div>
  </div>
</div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>主任儀表板</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/dashboard</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i on">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>營運報表</b><span class="seg"><i class="on">本月</i><i>上月</i><i>本學期</i></span><span class="sp"></span><span class="seg"><i>本部</i><i>板橋</i><i class="on">全部</i></span></div>
<div class="dsh"><div class="dsh-l">
<div class="kpi4"><div><span>在籍學生</span><b>312</b><em class="up">↑26 人</em></div><div><span>本月新生</span><b>30</b><em class="up">↑8 比上月</em></div><div><span>本月退班</span><b>4</b><em>上月 5</em></div><div><span>續班率</span><b>81%</b><em class="dn">↓3%</em></div></div>
<div class="kpi4"><div><span>行銷花費</span><b>NT$112K</b><em>Meta 100K・傳單 12K</em></div><div><span>每位新生成本</span><b>NT$3,733</b><em class="up">↓ NT$420</em></div><div><span>問班 → 報名</span><b>11%</b><em class="up">↑2%</em></div><div><span>AI 自動回覆率</span><b>78%</b><em class="up">↑4%</em></div></div>
<div class="dash2">
  <div class="pn"><div class="pn-h">在籍學生人數（近 6 個月）</div>
    <div class="vbars"><div><i style="height:62%"></i><em>271</em><span>6月</span></div><div><i style="height:58%"></i><em>264</em><span>7月</span></div><div><i style="height:70%"></i><em>281</em><span>8月</span></div><div><i style="height:80%"></i><em>295</em><span>9月</span></div><div><i style="height:76%"></i><em>286</em><span>10月</span></div><div class="on"><i style="height:92%"></i><em>312</em><span>11月</span></div></div></div>
  <div class="pn"><div class="pn-h">本月新生從哪裡來（共 30 人）</div>
    <div class="hb"><span>Meta 廣告</span><i style="width:100%"></i><em>12</em></div>
    <div class="hb"><span>同學介紹</span><i style="width:75%"></i><em>9</em></div>
    <div class="hb"><span>傳單</span><i style="width:50%"></i><em>6</em></div>
    <div class="hb"><span>官網</span><i style="width:25%"></i><em>3</em></div></div>
</div>
<div class="dash2">
  <div class="pn"><div class="pn-h">家長最常問的問題</div>
    <div class="hb"><span>上課時間</span><i style="width:100%"></i><em>38</em></div>
    <div class="hb"><span>收費</span><i style="width:55%"></i><em>21</em></div>
    <div class="hb"><span>試聽</span><i style="width:45%"></i><em>17</em></div>
    <div class="hb"><span>補課</span><i style="width:30%"></i><em>11</em></div></div>
  <div class="pn"><div class="pn-h">LINE 訊息用量</div><div class="q-big">3,720 <small>/ 6,000 則</small></div><div class="meter"><i style="width:62%"></i></div><span class="muted">到班通知 2,410・公告 860・提醒 450<br>預估月底 5,900 則，在方案額度內</span></div>
</div></div>
  <div class="kb-ai">
    <div class="ai-h">AI 問報表</div>
    <div class="q">這個月板橋問班為什麼變少？</div>
    <div class="a">板橋本月問班 9 筆，比上月少 6 筆。主要差在「國一英文」：上月有傳單活動帶來 5 筆，本月沒有。另外週末時段額滿後，有 3 位家長因時段不合沒有預約試聽。</div>
    <div class="src">依據：來源成效、試聽預約</div>
    <div class="btn sm">加開週末試聽時段</div>
    <div class="ai-in"><span>問報表任何問題…</span><i>➤</i></div>
  </div>
</div></div>
  </div>
</div></figure></div>
</div>
</section><section class="pillar c3" id="crm">
  <div class="pl-banner">
    <span class="pl-big">三</span>
    <div class="pl-t"><span class="pl-eb">三、招生 CRM<em class="add">模組 03・附加模組</em></span><h2>每一個加 LINE 的人，現在在哪個階段、要不要跟進</h2><p>每一位加入 LINE 的人都會進入招生名單：從只加好友、問班、聯絡、試聽到報名，每個人在哪一步一清二楚。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#followup"><b>招生總覽與跟進清單</b><span>一眼看到每個階段有多少人</span></a><a class="inc2" href="#pipeline"><b>名單看板與名單卡片</b><span>家長在 LINE 留下的資料自動建成名單</span></a><a class="inc2" href="#trial"><b>試聽預約與試聽回饋</b><span>家長在 LINE 選試聽時段；老師試聽後用語音說 30 秒</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>招生人員邊聊邊抄名單，忙起來就忘了跟進，問過的家長就這樣流失</div><div class="arr">→</div><div class="a"><i>用了平台</i>每位好友都在名單上，今天該聯絡誰、為什麼、說什麼都列好了</div></div>
  <div class="subf" id="followup">
  <div class="sf-top"><h4>招生總覽與跟進清單</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一眼看到每個階段有多少人，以及今天需要跟進的人與原因。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>從加入好友到報名的每一段轉換率</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>逾時未聯絡、試聽後沒回覆、只加好友沒問班，自動列出</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每一筆跟進都附上建議的動作</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>招生漏斗與今天要跟進的人</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm/overview</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>招生總覽</b><span class="seg"><i class="on">本月</i><i>上月</i></span><span class="sp"></span><span class="seg"><i class="on">全部分校</i><i>本部</i><i>板橋</i></span></div>
<div class="pipe">
  <div class="pp"><span>加入好友</span><b>120</b></div><i>›</i>
  <div class="pp"><span>問班諮詢</span><b>64</b><em>53%</em></div><i>›</i>
  <div class="pp"><span>已聯絡</span><b>30</b><em>47%</em></div><i>›</i>
  <div class="pp"><span>已約試聽</span><b>18</b><em>60%</em></div><i>›</i>
  <div class="pp"><span>已試聽</span><b>12</b><em>67%</em></div><i>›</i>
  <div class="pp on"><span>已報名</span><b>7</b><em>58%</em></div>
</div>
<div class="fu"><div class="fu-h">今天要跟進 <b>4</b> 位</div>
  <div class="fu-r"><span class="why w1">逾時未聯絡</span><b>陳媽媽</b><span class="muted">國二數學・問班 26 小時還沒人聯絡</span><span class="btn sm">查看擬好的訊息</span></div>
  <div class="fu-r"><span class="why w2">試聽後未回覆</span><b>黃小姐</b><span class="muted">國二理化・試聽後 2 天沒有回覆</span><span class="btn sm">傳送試聽回饋</span></div>
  <div class="fu-r"><span class="why w3">只加好友</span><b>Annie</b><span class="muted">加好友 5 天還沒問過課程</span><span class="btn sm ghost">傳送課程介紹</span></div>
  <div class="fu-r"><span class="why w4">考慮中</span><b>吳爸爸</b><span class="muted">國三理化・說要比較其他補習班</span><span class="btn sm ghost">安排主任回電</span></div>
</div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="pipeline">
  <div class="sf-top"><h4>名單看板與名單卡片</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長在 LINE 留下的資料自動建成名單，招生歷程一路累積。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>年級、科目、可上課時段、在意的點自動填好</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>依家長的積極程度排序</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>AI 依家長在意的點擬好跟進訊息，數字只來自方案資料</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>名單看板：AI 依意向排序，每張卡片顯示目前階段的重點</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>招生名單</b><span class="seg"><i class="on">依意向排序</i><i>依時間</i></span><span class="sp"></span><span class="btn ghost">匯出</span><span class="btn">＋ 新增</span></div>
<div class="kanban">
  <div class="col"><div class="col-h">新問班 <i>3</i></div>
    <div class="kc hot"><b>陳媽媽 <span class="heat h3">高</span></b><small>國二・數學</small><em class="sum">問了試聽時間與學費，在意小班</em><em class="warn">逾時 26 小時未聯絡</em></div>
    <div class="kc"><b>周先生 <span class="heat h1">低</span></b><small>國一・英文</small><em class="sum">只問了地址</em></div></div>
  <div class="col"><div class="col-h">已聯絡 <i>2</i></div>
    <div class="kc"><b>吳爸爸 <span class="heat h2">中</span></b><small>國三・理化</small><em class="sum">比較中，擔心會考時間不夠</em></div></div>
  <div class="col"><div class="col-h">已約試聽 <i>2</i></div>
    <div class="kc"><b>李媽媽 <span class="heat h3">高</span></b><small>國一・英文</small><em class="sum">11/21 19:00 試聽</em></div></div>
  <div class="col"><div class="col-h">已試聽 <i>1</i></div>
    <div class="kc"><b>黃小姐 <span class="heat h3">高</span></b><small>國二・理化</small><em class="sum">AI 回饋已送出，等待回覆</em></div></div>
  <div class="col"><div class="col-h">已報名 <i>4</i></div>
    <div class="kc ok"><b>吳媽媽</b><small>國二・數學</small><em>→ 已建立學生</em></div></div>
</div>
<div class="funnel"><span>本月未成交原因</span><b>時段不合 3</b><b>學費 2</b><b>距離 1</b><em>招生季前可再聯絡 4 位</em></div></div>
  </div>
</div></figure><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>名單卡片：AI 填好欄位、累積階段歷程；跟進草稿的數字只來自方案資料</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm/lead/l882</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><span class="back">‹ 招生名單</span><b>陳媽媽</b><span class="heat h3">意向高</span><span class="tag">新問班</span><span class="sp"></span><span class="btn ghost">指派給我</span><span class="btn">轉為已聯絡</span></div>
<div class="ld">
  <div class="pn">
    <div class="pn-h">AI 從對話整理 <span class="ai-tag">AI</span></div>
    <div class="ffx"><span>家長</span><b>陳媽媽</b><span>電話</span><b>0912-345-678</b><span>孩子</span><b>國二・女兒</b><span>學校</span><b>建國國中</b><span>科目</span><b>數學</b><span>可上課</span><b>平日晚上</b><span>來源</span><b>Meta 廣告・國二冬季招生</b><span>分校</span><b>板橋</b></div>
    <div class="pn-h" style="margin-top:6px">家長在意的點</div>
    <div class="cares"><span>小班制</span><span>學費</span><span>女兒數學段考 62 分</span></div>
  </div>
  <div class="pn">
    <div class="pn-h">招生歷程 <span class="muted" style="font-weight:400">每進入一個階段，AI 依該階段資料寫一段摘要</span></div>
    <div class="tl2 done"><b>11/17 問班建檔</b><span>女兒國二數學段考 62 分，想找平日晚上的小班；問了試聽時間與學費，詢問能否分期。</span></div>
    <div class="tl2 next"><b>試聽後</b><span>老師的試聽評估與建議班級，會在這裡整理成一段摘要</span></div>
    <div class="tl2 next"><b>報名</b><span>整段歷程帶進學生檔案，班導第一天就知道學生背景</span></div>
    <div class="pn-h">建議下一步</div>
    <div class="draft"><span class="ai-tag">AI 草稿</span>陳媽媽您好，我是示範板橋的周老師。國二數學班每班上限 <span class="srcv">12 人<i>課程資料</i></span>，老師能照顧到每位同學。這週三 <span class="srcv">19:00 還有 2 個試聽名額<i>試聽名額</i></span>，您方便帶晴晴來試聽嗎？學費與繳費方式我可以當面跟您說明。
      <div class="chk ok">✓ 草稿中的人數與時段都來自課程與方案資料</div>
      <div class="chk warn">家長問「可以分期嗎」：方案資料未設定分期，AI 不回答，已標記給招生人員</div>
      <div class="rp-act"><span class="btn ghost sm">修改</span><span class="btn sm">送出</span></div></div>
  </div>
</div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="trial">
  <div class="sf-top"><h4>試聽預約與試聽回饋</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長在 LINE 選試聽時段；老師試聽後用語音說 30 秒，就產生給家長的回饋與報名建議。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>試聽名額自動扣除，不會超收</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>老師用手機語音輸入，不用裝 App</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長收到回饋卡片，可直接按「我要報名」</span></div></div>
  <div class="shots"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長在 LINE 裡選試聽時段</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>預約試聽</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="lf-sec">想試聽的課程</div>
<div class="lf-sel">國二數學 ▾</div>
<div class="lf-sec">分校</div>
<div class="lf-seg"><i>本部</i><i class="on">板橋</i></div>
<div class="lf-sec">可預約時段</div>
<div class="slot">11/19（三）19:00 <em>剩 2 位</em></div>
<div class="slot on">11/21（五）19:00 <em>剩 3 位</em></div>
<div class="slot dis">11/22（六）10:00 <em>已額滿</em></div>
<div class="lf-sec">聯絡電話</div>
<div class="lf-in">0912-345-678（已帶入）</div>
<div class="lf-btn">確認預約</div></div></div></figure><figure class="shot ph"><figcaption><span class="who teacher">老師・手機</span>老師試聽後用語音輸入 30 秒（不用裝 App）</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>試聽回饋</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="ap-h">試聽回饋・陳同學 <span>國二數學</span></div>
<div class="voice"><div class="mic">🎤</div><span>用手機鍵盤的語音輸入說出評估</span><div class="vtxt">基礎觀念還可以，計算慢，應用題會卡，上課很專心會發問，建議 B 班</div></div>
<div class="pn-h2">AI 整理的評估</div>
<div class="ap-card">基礎觀念大致清楚，計算速度偏慢、應用題容易卡住。上課專心、會主動發問。<b>建議班級：國二數學 B（基礎加強）</b></div>
<div class="lf-btn">確認並產生家長回饋</div></div></div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到試聽回饋</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">試聽回饋</div><div class="fx-b"><b>晴晴的數學試聽</b><p>觀念大致清楚，主要需要加強計算速度與應用題。上課很專心，也會主動發問 👍<br><br>建議：國二數學 B（每週五 19:00，12 人小班）</p><span>周老師・示範板橋</span></div><div class="fx-btn">我要報名</div><div class="fx-btn ghost">想再聊聊</div></div></div></div></figure></div>
</div>
</section><section class="pillar c4" id="family">
  <div class="pl-banner">
    <span class="pl-big">四</span>
    <div class="pl-t"><span class="pl-eb">四、學生與家長服務<em class="add">附加模組</em></span><h2>報名之後，讓家長隨時知道孩子的狀況</h2><p>學生報名後，爸爸、媽媽和學生本人都能在 LINE 連上同一份學生檔案。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#students"><span class="ic-code">模組 04</span><b>學生檔案與家長綁定</b><span>一位學生可綁多位家長與學生本人</span></a><a class="inc2" href="#grades"><span class="ic-code">模組 05</span><b>作業成績與家長查詢</b><span>老師登錄作業與成績</span></a><a class="inc2" href="#reports"><span class="ic-code">模組 06</span><b>AI 月學習報告</b><span>AI 依出缺勤、作業、成績寫好月報草稿</span></a><a class="inc2" href="#notices"><span class="ic-code">模組 07</span><b>公告與聯絡簿</b><span>一句話產生公告</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>家長打電話問成績，老師翻本子回答；公告一個個群組轉貼</div><div class="arr">→</div><div class="a"><i>用了平台</i>家長自己在 LINE 查，老師專心教學，公告一次發給對的人</div></div>
  <div class="subf" id="students">
  <div class="sf-top"><h4>學生檔案與家長綁定</h4><span class="mcode add">模組 04</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一位學生可綁多位家長與學生本人，各自選擇要收哪些通知。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>從招生名單一鍵轉成學生，試聽評估一起帶過來</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>一位家長多個孩子，跨分校也沒問題</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>繳費、續班只送主要聯絡人</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>學生檔案：LINE 綁定與各自的通知設定</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/students/s1024</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i on">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><span class="back">‹ 學生</span><b>王小明</b><span class="tag">國二</span><span class="tag">建國國中</span><span class="sp"></span><span class="btn ghost">產生家長綁定碼</span><span class="btn ghost">產生學生綁定碼</span><span class="btn">編輯</span></div>
<div class="tabs"><i class="on">總覽</i><i>出缺勤</i><i>作業成績</i><i>請假</i><i>學習報告</i><i>備註</i></div>
<div class="st-grid2">
  <div class="pn">
    <div class="pn-h">LINE 綁定（3 人）</div>
    <table class="tb bind"><tr><th>對象</th><th>身分</th><th>到班</th><th>作業</th><th>成績</th><th>公告</th><th>繳費・續班</th><th></th></tr>
    <tr><td><b>王小明爸爸</b> <span class="tag ok">主要聯絡人</span></td><td><span class="role mgr">家長</span></td><td class="on">●</td><td class="off">○</td><td class="on">●</td><td class="on">●</td><td class="on">●</td><td class="muted">⋯</td></tr>
    <tr><td><b>王小明媽媽</b></td><td><span class="role mgr">家長</span></td><td class="on">●</td><td class="on">●</td><td class="on">●</td><td class="on">●</td><td class="off">○</td><td class="muted">⋯</td></tr>
    <tr><td><b>王小明</b>（本人）</td><td><span class="role hr">學生</span></td><td class="na">—</td><td class="on">●</td><td class="on">●</td><td class="on">●</td><td class="na">—</td><td class="muted">⋯</td></tr>
    <tr><td class="muted">王奶奶</td><td><span class="tag warn">家長碼已發出，未綁定</span></td><td colspan="5" class="muted">綁定碼 11/25 到期</td><td class="muted">撤銷</td></tr>
    </table>
    <div class="rule">● 會收到・○ 本人關閉・— 該身分不適用（學生不收到班與繳費通知）</div>
  </div>
  <div class="pn"><div class="pn-h">班級</div><div class="li">國二理化 A・林老師・週三 19:00</div><div class="li">國二數學 B・陳老師・週五 19:00</div>
    <div class="pn-h" style="margin-top:6px">本月概況</div><div><span class="stat"><b>11/12</b><span>出席</span></span><span class="stat"><b>95%</b><span>作業</span></span><span class="stat"><b>82</b><span>數學</span></span></div>
    <div class="pn-h" style="margin-top:6px">兄弟姊妹</div><div class="li">王小美・國一・板橋分校（共用爸爸、媽媽的綁定）</div>
    <div class="pn-h" style="margin-top:6px">招生歷程（從 CRM 帶入）</div><div class="li">9/09 試聽評估：觀念清楚、計算慢，建議國二理化 A</div></div>
</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長綁定：輸入家長碼，可再綁第二個孩子</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>家長綁定</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="lf-hero">綁定孩子</div>
<p class="lf-p">請輸入補習班提供的 6 碼家長綁定碼，或直接掃描 QR Code。</p>
<div class="otp"><i>A</i><i>7</i><i>K</i><i>2</i><i>Q</i><i>9</i></div>
<div class="lf-btn">確認綁定</div>
<div class="ok-card"><b>✓ 已綁定 王小明</b><span>身分：家長（爸爸）・示範本部・國二</span></div>
<div class="ok-card"><b>✓ 已綁定 王小美</b><span>身分：家長（爸爸）・示範板橋・國一</span></div>
<div class="lf-link">＋ 綁定另一位孩子</div>
<p class="lf-fine">綁定即表示同意示範依隱私說明處理孩子的學習資料。<u>查看說明</u></p></div></div></figure><figure class="shot ph"><figcaption><span class="who student">學生本人・手機</span>學生本人：用學生碼綁定，出示點名 QR、看作業</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>我的學習</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="kid"><b>嗨，小明</b><span>國二・示範本部</span></div>
<div class="myqr"><div class="qr"></div><span>點名 QR・到班時給老師掃描</span></div>
<div class="lf-sec">今天的課</div>
<div class="hw"><span>19:00 國二理化 A・3 樓</span><i class="ok">今天</i></div>
<div class="lf-sec">作業</div>
<div class="hw"><span>講義 p.32–35</span><i class="due">11/20 截止</i></div>
<div class="hw"><span>習作第 4 章</span><i class="ok">已繳</i></div>
<div class="lf-sec">最近成績</div>
<div class="hw"><span>11/20 理化小考</span><i class="ok">88</i></div></div></div></figure></div>
</div><div class="subf" id="grades">
  <div class="sf-top"><h4>作業成績與家長查詢</h4><span class="mcode add">模組 05</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">老師登錄作業與成績，家長在 LINE 隨時查看。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>像試算表一樣登錄，也可以拍成績單匯入</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長問「孩子最近數學怎麼樣」，AI 依資料回答</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可設定學生本人是否看得到成績</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>成績登錄，像試算表一樣輸入</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/classes/g8-sci-a/grades</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i on">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>國二理化 A・成績</b><span class="seg"><i class="on">成績</i><i>作業</i></span><span class="sp"></span><span class="btn ghost">📷 拍照匯入</span><span class="btn ghost">＋ 新增考試</span><span class="btn">儲存</span></div>
<table class="tb grid"><tr><th>學生</th><th>11/06 小考</th><th>11/13 小考</th><th>11/15 段考（學校）</th><th>11/20 小考</th><th>平均</th></tr>
<tr><td>王小明</td><td>82</td><td>76</td><td>85</td><td class="edit">88</td><td><b>83</b></td></tr>
<tr><td>陳小安</td><td>91</td><td>94</td><td>90</td><td class="edit"></td><td><b>92</b></td></tr>
<tr><td>林○宇</td><td>64</td><td class="low">58</td><td>61</td><td class="edit"></td><td><b class="low">61</b></td></tr>
<tr><td>李小華</td><td>77</td><td>80</td><td>—</td><td class="edit"></td><td><b>79</b></td></tr>
</table>
<div class="rule">11/20 小考由拍照匯入：AI 辨識 4 筆，其中 1 筆字跡不清請核對・低於 60 分標紅・儲存後家長查詢頁即時更新</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長查詢孩子學習狀況</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>學習狀況</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="kid"><b>王小明</b><span>國二理化 A</span></div>
<div class="lf-sec">近期成績</div>
<div class="spark"><svg viewBox="0 0 200 60"><polyline points="10,30 70,42 130,24 190,16" fill="none" stroke="#2769a9" stroke-width="2.5"/><circle cx="190" cy="16" r="4" fill="#2769a9"/></svg><div class="spk-l"><span>82</span><span>76</span><span>85</span><span>88</span></div></div>
<div class="lf-sec">作業</div>
<div class="hw"><span>11/18 講義 p.32–35</span><i class="ok">已繳</i></div>
<div class="hw"><span>11/13 習作第 4 章</span><i class="ok">已繳</i></div>
<div class="lf-sec">老師評語</div>
<p class="lf-p">計算細心度有進步，應用題可以再多練習。—林老師</p></div></div></figure></div>
</div><div class="subf" id="reports">
  <div class="sf-top"><h4>AI 月學習報告</h4><span class="mcode add">模組 06</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">AI 依出缺勤、作業、成績寫好月報草稿，班導確認後送出。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每月自動產生全班草稿</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>班導可修改、補一句話</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長看完可直接回覆「想跟老師聊聊」</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>班導逐份檢視 AI 草稿</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/reports/2026-11/g8-sci-a</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i on">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>11 月學習報告・國二理化 A</b><span class="tag">已確認 12 / 20</span><span class="sp"></span><span class="btn">送出已確認的 12 份</span></div>
<div class="rp">
  <div class="rp-list"><div class="rp-i ok">陳小安 ✓</div><div class="rp-i on">王小明</div><div class="rp-i">林○宇</div><div class="rp-i">李小華</div></div>
  <div class="rp-ed">
    <div class="rp-data"><span>出席 <b>11/12</b></span><span>作業 <b>95%</b></span><span>平均 <b>83</b>（↑6）</span></div>
    <div class="rp-txt"><span class="ai-tag">AI 草稿</span>小明本月出席穩定，作業幾乎全數準時繳交。理化小考由 76 分進步到 88 分，計算的細心度明顯提升。建議下個月持續練習應用題，特別是電路計算。</div>
    <div class="rp-add">班導補充：<span>上課發問變多了，很棒！</span></div>
    <div class="rp-act"><span class="btn ghost sm">重新產生</span><span class="btn sm">確認</span></div>
  </div>
</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到月報</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>學習報告</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="rp-hero"><span>11 月學習報告</span><b>王小明</b></div>
<div class="rp-stats"><div><b>11/12</b><span>出席</span></div><div><b>95%</b><span>作業</span></div><div><b>83</b><span>平均 ↑6</span></div></div>
<p class="lf-p">小明本月出席穩定，作業幾乎全數準時繳交。理化小考由 76 分進步到 88 分……</p>
<p class="lf-p"><b>班導補充：</b>上課發問變多了，很棒！</p>
<div class="lf-btn ghost">想跟老師聊聊</div></div></div></figure></div>
</div><div class="subf" id="notices">
  <div class="sf-top"><h4>公告與聯絡簿</h4><span class="mcode add">模組 07</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一句話產生公告，依分校、年級、班級發給對的家長。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>停課、調課、活動、聯絡簿都有現成格式</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>發送前看到預估訊息則數</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>停課公告同步到 AI 客服</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>撰寫公告，送出前看到預估則數</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/notices/new</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i on">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>新增公告</b><span class="sp"></span><span class="btn ghost">存草稿</span><span class="btn">送主任審核</span></div>
<div class="nt">
  <div class="nt-f">
    <div class="ailine"><span class="ai-tag">AI</span>用一句話描述：<b>明天颱風停課，國二以下</b><span class="btn sm">產生公告</span></div>
    <div class="fl"><span>模板</span><div class="in">停課公告 ▾</div></div>
    <div class="fl"><span>對象</span><div class="in"><span class="tag">本部</span><span class="tag">國二全部班級</span> ＋</div></div>
    <div class="fl"><span>標題</span><div class="in">颱風停課通知</div></div>
    <div class="fl"><span>內容</span><div class="in tall">因颱風影響，11/18（三）全日課程暫停，補課時間將另行通知。</div></div>
    <div class="fl"><span>發送</span><div class="in">立即 ▾</div></div>
    <label class="ck">同步更新知識庫「公告與異動」，到期日 11/18</label>
  </div>
  <div class="nt-q"><div class="q-h">預估訊息用量</div><div class="q-big">86 則</div><span>86 位已綁定家長</span><div class="meter"><i style="width:62%"></i></div><span>本月已用 3,720 / 6,000 則</span></div>
</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到的公告卡片</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">停課公告</div><div class="fx-b"><b>颱風停課通知</b><p>因颱風影響，11/18（三）全日課程暫停，補課時間將另行通知。</p><span>示範教育・本部</span></div><div class="fx-btn">查看補課安排</div></div>
<div class="msg p">那補課什麼時候？</div>
<div class="msg b">補課時間會在 11/19 公布，屆時會再通知您。</div></div></div></figure></div>
</div>
</section><section class="pillar c5" id="daily">
  <div class="pl-banner">
    <span class="pl-big">五</span>
    <div class="pl-t"><span class="pl-eb">五、出缺勤與日常行政<em class="add">附加模組</em></span><h2>點名、請假、補課，在 LINE 裡完成</h2><p>學生出示 QR Code、老師用手機一掃就點完名，家長立刻收到通知；請假、晚到、補課都在 LINE 完成，行政只處理真正的例外。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#attendance"><span class="ic-code">模組 08</span><b>到班點名與通知</b><span>老師用手機掃 QR 點名</span></a><a class="inc2" href="#leave"><span class="ic-code">模組 09</span><b>LINE 請假</b><span>家長或學生在 LINE 說一聲就能請假</span></a><a class="inc2" href="#makeup"><span class="ic-code">模組 10</span><b>補課安排</b><span>選擇你的補課制度</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>紙本點名、電話請假、行政翻課表找補課空位</div><div class="arr">→</div><div class="a"><i>用了平台</i>點名即通知，請假自動同步，補課依你的規則列出選項</div></div>
  <div class="subf" id="attendance">
  <div class="sf-top"><h4>到班點名與通知</h4><span class="mcode add">模組 08</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">老師用手機掃 QR 點名，家長即時收到到班通知。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>學生自己在 LINE 回報晚到，不會被誤報未到</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>該到沒到的學生，自動提醒行政</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長可自選要不要收離班通知</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>今日點名看板</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/attendance/today</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i on">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>今日點名</b><span class="tag">11/18（三）</span><span class="sp"></span><span class="btn ghost">匯出</span></div>
<div class="att">
  <div class="att-r"><b>國二理化 A</b><span>19:00・林老師</span><div class="bar3"><i style="width:85%"></i></div><em>17 / 20 到班</em><span class="tag warn">晚到 1</span><span class="tag bad">未到 1</span></div>
  <div class="att-r"><b>國三數學 A</b><span>19:00・陳老師</span><div class="bar3"><i style="width:100%"></i></div><em>15 / 15 到班</em></div>
  <div class="att-r"><b>國一英文 B</b><span>19:30・王老師</span><div class="bar3"><i style="width:0%"></i></div><em>尚未開始</em></div>
</div>
<div class="alert"><b>未到班提醒・國二理化 A</b>
  <div class="al-r"><span>林○宇</span><span>王媽媽 0918-xxx-xxx</span><span class="btn sm ghost">標記已聯絡</span></div>
  <div class="al-r late"><span>王小明</span><span>學生回報晚到・預計 19:20（公車誤點）</span><span class="tag warn">等待中</span></div>
</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who teacher">老師・手機</span>老師老師用手機點名，不用裝 App</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>老師點名</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="ap-h">國二理化 A <span>19:00</span></div>
<div class="scan"><div class="scan-box"></div><span>對準學生的點名 QR</span></div>
<div class="ap-li"><b>陳小安</b><i class="ok">已到 18:55</i></div>
<div class="ap-li"><b>王小明</b><i class="lvq">預計晚到 19:20</i></div>
<div class="ap-li"><b>林○宇</b><i class="no">未到</i></div>
<div class="ap-li"><b>李小華</b><i class="lvq">請假</i></div></div></div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到晚到回報與到班通知</figcaption><div class="phone"><div class="notch"></div><div class="ph-top lock">11:42</div><div class="ph-body lockbg">
<div class="push"><div class="ps-h"><span class="lg"></span>LINE・示範教育<em>18:41</em></div><b>小明回報會晚到</b><span>預計 19:20 到班，原因：公車誤點</span></div>
<div class="push"><div class="ps-h"><span class="lg"></span>LINE・示範教育<em>19:18</em></div><b>小明已到班</b><span>國二理化 A・19:18 完成簽到</span></div></div></div></figure><figure class="shot ph"><figcaption><span class="who student">學生本人・手機</span>學生自己傳訊息說會晚到</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">老師我今天會晚點到，公車一直沒來</div>
<div class="msg b">收到！大概幾點會到呢？</div>
<div class="quick"><span>19:10</span><span class="on">19:20</span><span>19:30</span><span>不確定</span></div>
<div class="msg p">19:20</div>
<div class="msg b">好，已幫你登記國二理化 A 預計 19:20 到，也告訴林老師了。路上小心！</div>
<div class="msg sys">已登記晚到・已通知老師與家長</div></div></div></figure></div>
</div><div class="subf" id="leave">
  <div class="sf-top"><h4>LINE 請假</h4><span class="mcode add">模組 09</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長或學生在 LINE 說一聲就能請假，請假直接同步到點名。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>學生請假需家長確認，避免孩子自己跳課</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可設定請假截止時間</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>請假後自動轉給補課安排</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>請假列表：確認後直接寫進出缺勤</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/leave</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i on">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>請假</b><span class="seg"><i class="on">待確認 2</i><i>本週</i><i>全部</i></span><span class="sp"></span><span class="btn ghost">補登請假</span></div>
<table class="tb"><tr><th>學生</th><th>課程</th><th>請假日期</th><th>原因</th><th>提出者</th><th>狀態</th><th>補課</th></tr>
<tr><td>王小明</td><td>國二理化 A</td><td>11/18（三）</td><td>發燒</td><td>王媽媽</td><td><span class="tag ok">已登記出缺勤</span></td><td><span class="tag">已轉補課安排</span></td></tr>
<tr><td>李小華</td><td>國二理化 A</td><td>11/18（三）</td><td>學校活動</td><td>李爸爸</td><td><span class="tag ok">已登記出缺勤</span></td><td><span class="tag">已轉補課安排</span></td></tr>
<tr><td>張○晴 <span class="idt st">學生自己請假</span></td><td>國二數學 B</td><td>11/21（六）</td><td>身體不舒服</td><td>張○晴</td><td><span class="tag warn">等待家長確認</span></td><td class="muted">—</td></tr>
<tr><td>周○廷</td><td>國一英文 B</td><td>11/20（五）</td><td>家庭因素</td><td>行政補登</td><td><span class="tag warn">超過截止時間</span></td><td class="muted">—</td></tr>
</table>
<div class="rule">請假截止：上課前 2 小時・學生請假需家長確認・確認後同步到點名頁 <u>編輯規則</u></div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who student">學生本人・手機</span>學生自己請假</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">我禮拜六數學課要請假，身體不舒服</div>
<div class="msg b">好的，11/21（六）國二數學 B 請假。學生請假需要家長確認，我已經傳給你的家長了，確認後會再告訴你。</div>
<div class="msg sys">已送出・等待家長確認</div>
<div class="msg b">你的家長已確認請假，好好休息！</div></div></div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到確認請求</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">請假確認</div><div class="fx-b"><b>晴晴想請假</b><p>11/21（六）國二數學 B<br>原因：身體不舒服</p><span>由學生本人提出</span></div><div class="fx-btn">確認請假</div><div class="fx-btn ghost">不同意</div><div class="fx-btn ghost">聯絡補習班</div></div>
<div class="msg p">確認請假</div>
<div class="msg b">已確認，會通知老師。</div></div></div></figure></div>
</div><div class="subf" id="makeup">
  <div class="sf-top"><h4>補課安排</h4><span class="mcode add">模組 10</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">選擇你的補課制度，系統依規則列出補課選項，家長自己選。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>跟班補課、固定補課時段、講義自學、老師另約，依科目設定</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可補次數、期限、名額都能設定</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>補課出席自動計入點名</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>補課規則：每家補習班選自己的補課方式</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/makeup/policies</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i on">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>補課安排</b><span class="seg"><i>補課需求 6</i><i class="on">補課規則</i></span><span class="sp"></span><span class="seg"><i class="on">本部</i><i>板橋</i></span></div>
<div class="mk-g">
  <div class="pn"><div class="pn-h">適用：國中理化、數學</div>
    <div class="mode on"><b>跟其他班補課</b><span>同科、同進度的班級有空位即可 ・ 限事先請假</span></div>
    <div class="mode on"><b>固定補課時段</b><span>每週六 14:00–16:00 ・ 名額 8 人</span></div>
    <div class="mode"><b>講義或影片自學</b><span>未啟用</span></div>
    <div class="mode"><b>老師另約時間</b><span>未啟用</span></div>
    <div class="params"><span>每期可補 <b>2</b> 次</span><span>請假後 <b>14</b> 天內</span><span>點名未到 <b>不算</b> 補課需求</span></div></div>
  <div class="pn"><div class="pn-h">適用：國三總複習</div>
    <div class="mode"><b>跟其他班補課</b><span>未啟用（各班進度不同）</span></div>
    <div class="mode"><b>固定補課時段</b><span>未啟用</span></div>
    <div class="mode on"><b>講義或影片自學</b><span>提供錄影連結 ・ 看完由學生回報</span></div>
    <div class="mode on"><b>老師另約時間</b><span>由班導與家長協調，平台記錄結果</span></div>
    <div class="params"><span>每期可補 <b>不限</b></span><span>請假後 <b>7</b> 天內</span><span>點名未到 <b>算</b> 補課需求</span></div></div>
</div>
<div class="rule">導入時依示範教育現行制度設定；調整規則不需要改程式，新的請假會套用新規則</div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長看到依規則列出的補課選項</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>補課安排</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="kid"><b>王小明的補課</b><span>11/18（三）國二理化 A 請假</span></div>
<div class="lf-sec">選擇補課方式</div>
<div class="slot on">跟班補課・11/22（六）14:00 板橋 <em>剩 2 位</em></div>
<div class="slot">跟班補課・11/25（二）19:00 本部 <em>剩 1 位</em></div>
<div class="slot">補課時段・11/29（六）14:00 本部 <em>剩 5 位</em></div>
<div class="slot">不需要補課</div>
<p class="lf-fine">本期已補 0 次，可再補 2 次・請於 12/2 前完成</p>
<div class="lf-btn">確認補課</div></div></div></figure></div>
</div>
</section><section class="pillar c6" id="manage">
  <div class="pl-banner">
    <span class="pl-big">六</span>
    <div class="pl-t"><span class="pl-eb">六、續班與經營管理<em class="add">附加模組</em></span><h2>留住學生，掌握每一間分校</h2><p>續班提醒自動發送、家長一鍵回覆；有流失徵兆的學生提早提醒班導。</p></div>
  </div>
  <div class="inc-row"><a class="inc2" href="#renewal"><span class="ic-code">模組 11</span><b>續班與繳費提醒</b><span>依名單與日期自動提醒</span></a><a class="inc2" href="#retention"><span class="ic-code">模組 12</span><b>流失預警</b><span>從缺課、作業、成績與家長詢問中</span></a><a class="inc2" href="#branches"><span class="ic-code">模組 13</span><b>多分校管理</b><span>集團、分校、班級三層管理</span></a></div>
  <div class="ba2"><div class="b"><i>以前</i>學生不來了才發現；各分校資料各自存，總部看不到全貌</div><div class="arr">→</div><div class="a"><i>用了平台</i>提早發現、及時關心；一套系統管所有分校</div></div>
  <div class="subf" id="renewal">
  <div class="sf-top"><h4>續班與繳費提醒</h4><span class="mcode add">模組 11</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">依名單與日期自動提醒，家長一鍵回覆，行政看得到誰還沒回。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>未回覆自動再提醒一次</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長說「再考慮」時，AI 問原因並整理給班導</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>繳費狀態由行政標記，不經手金流</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>續班提醒追蹤</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/reminders/winter-renew</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i on">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>寒假班續班提醒</b><span class="tag ok">進行中</span><span class="sp"></span><span class="btn ghost">再提醒未回覆</span></div>
<div class="kpis3"><div><b>48</b><span>已確認</span></div><div><b>9</b><span>考慮中</span></div><div class="bad"><b>23</b><span>未回覆</span></div></div>
<table class="tb"><tr><th>學生</th><th>班級</th><th>狀態</th><th>最後提醒</th><th></th></tr>
<tr><td>王小明</td><td>國二理化 A</td><td><span class="tag ok">已確認</span></td><td>12/01</td><td></td></tr>
<tr><td>林○宇</td><td>國二理化 A</td><td><span class="tag warn">考慮中</span></td><td>12/01</td><td><span class="btn sm ghost">轉班導</span></td></tr>
<tr><td>張○晴</td><td>國二數學 B</td><td><span class="tag bad">未回覆</span></td><td>12/03</td><td><span class="btn sm ghost">電話聯絡</span></td></tr>
</table></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長一鍵回覆</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">寒假班續班</div><div class="fx-b"><b>小明的國二理化 寒假班</b><p>1/20 開課，請於 12/10 前確認是否續班。</p></div><div class="fx-btn">確認續班</div><div class="fx-btn ghost">想再考慮</div><div class="fx-btn ghost">聯絡行政</div></div>
<div class="msg p">確認續班</div>
<div class="msg b">收到！已為小明保留寒假班名額，繳費資訊會再通知您。</div></div></div></figure></div>
</div><div class="subf" id="retention">
  <div class="sf-top"><h4>流失預警</h4><span class="mcode add">模組 12</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">從缺課、作業、成績與家長詢問中，找出可能不續班的學生。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>列出原因並依風險排序</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>指派班導並附上關心訊息草稿</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>追蹤關心結果</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>需要關心的學生</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/risk</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i on">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>流失預警</b><span class="seg"><i class="on">待處理 6</i><i>處理中 3</i><i>已解決</i></span><span class="sp"></span><span class="btn ghost">調整規則</span></div>
<div class="rk-l">
  <div class="rk-r"><i class="lv hi">高</i><b>林○宇</b><span>國二理化 A</span><div class="sig"><span>近 3 週缺課 4 次</span><span>成績平均 61</span></div><span class="btn sm ghost">指派 林老師</span></div>
  <div class="rk-r"><i class="lv hi">高</i><b>周○廷</b><span>國一英文 B</span><div class="sig"><span>家長詢問退費</span></div><span class="tag">林主任 處理中</span></div>
  <div class="rk-r"><i class="lv md">中</i><b>張○晴</b><span>國二數學 B</span><div class="sig"><span>作業連續缺交 3 次</span></div><span class="btn sm ghost">指派 陳老師</span></div>
  <div class="rk-r"><i class="lv md">中</i><b>陳○安</b><span>國三數學 A</span><div class="sig"><span>小考連續下滑</span></div><span class="btn sm ghost">指派 陳老師</span></div>
</div></div>
  </div>
</div></figure></div>
</div><div class="subf" id="branches">
  <div class="sf-top"><h4>多分校管理</h4><span class="mcode add">模組 13</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">集團、分校、班級三層管理，每個人依角色看到該看的資料。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>總部看全部，分校只看自己</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>後台帳號不限人數</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>問班自動分配到正確的分校</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>同一份問班名單：總部看全部</figcaption><div class="browser mini">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm?branch=all</span></div>
  <div class="mini-who">總部管理員・張總監</div>
  <div class="main">
<div class="pg-h"><b>招生名單</b><span class="brsw">全部分校 ▾</span></div>
<div class="pool"><b>待分派 2</b><span>無法判斷分校的問班</span>
  <div class="pool-r"><span>許媽媽・國一英文</span><span class="sel">分派到 ▾</span></div>
  <div class="pool-r"><span>鄭先生・國三數學</span><span class="sel">分派到 ▾</span></div></div>
<table class="tb"><tr><th>家長</th><th>分校</th><th>課程</th><th>狀態</th></tr>
<tr><td>陳媽媽</td><td><span class="br-b bq">板橋</span></td><td>國二數學</td><td>新問班</td></tr>
<tr><td>吳爸爸</td><td><span class="br-b hq">本部</span></td><td>國三理化</td><td>已聯絡</td></tr>
<tr><td>李媽媽</td><td><span class="br-b ty">桃園</span></td><td>國一英文</td><td>已約試聽</td></tr>
<tr><td>黃小姐</td><td><span class="br-b bq">板橋</span></td><td>國二理化</td><td>已試聽</td></tr>
</table></div>
</div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>同一份問班名單：板橋主任只看到板橋</figcaption><div class="browser mini">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm</span></div>
  <div class="mini-who">分校主任・黃主任（板橋）</div>
  <div class="main">
<div class="pg-h"><b>招生名單</b><span class="brsw lock">板橋分校 🔒</span></div>
<div class="pool empty"><span>待分派由總部處理，分校看不到</span></div>
<table class="tb"><tr><th>家長</th><th>分校</th><th>課程</th><th>狀態</th></tr>
<tr><td>陳媽媽</td><td><span class="br-b bq">板橋</span></td><td>國二數學</td><td>新問班</td></tr>
<tr><td>黃小姐</td><td><span class="br-b bq">板橋</span></td><td>國二理化</td><td>已試聽</td></tr>
</table>
<div class="rule">本部、桃園的名單不會出現，網址改成其他分校也會被擋下</div></div>
</div></figure><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>人員與角色：一個人可以在不同分校有不同角色</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/settings/members</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i on">設定</div></div>
    <div class="main">
<div class="pg-h"><b>人員與角色</b><span class="brsw">全部分校 ▾</span><span class="sp"></span><span class="btn ghost">角色權限表</span><span class="btn">＋ 邀請人員</span></div>
<table class="tb"><tr><th>姓名</th><th>角色與範圍</th><th>可看班級</th><th>雙重驗證</th><th>最後登入</th><th></th></tr>
<tr><td><b>張總監</b></td><td><span class="role hq">總部管理員</span><span class="scope">全集團</span></td><td class="muted">全部</td><td><span class="tag ok">已啟用</span></td><td>今天</td><td class="muted">編輯</td></tr>
<tr><td><b>林主任</b></td><td><span class="role mgr">分校主任</span><span class="scope">本部</span></td><td class="muted">本部全部</td><td><span class="tag ok">已啟用</span></td><td>今天</td><td class="muted">編輯</td></tr>
<tr><td><b>黃主任</b></td><td><span class="role mgr">分校主任</span><span class="scope">板橋</span><br><span class="role tch">任課老師</span><span class="scope">本部</span></td><td class="muted">板橋全部、本部國三數學 A</td><td><span class="tag ok">已啟用</span></td><td>昨天</td><td class="muted">編輯</td></tr>
<tr><td><b>許小姐</b></td><td><span class="role ofc">行政櫃台</span><span class="scope">板橋</span></td><td class="muted">板橋全部</td><td><span class="tag warn">未啟用</span></td><td>今天</td><td class="muted">編輯</td></tr>
<tr><td><b>周先生</b></td><td><span class="role sal">招生人員</span><span class="scope">本部、板橋</span></td><td class="muted">—</td><td><span class="tag ok">已啟用</span></td><td>3 天前</td><td class="muted">編輯</td></tr>
<tr><td><b>林老師</b></td><td><span class="role hr">班導</span><span class="scope">本部</span></td><td class="muted">國二理化 A</td><td><span class="tag ok">已啟用</span></td><td>今天</td><td class="muted">編輯</td></tr>
</table>
<div class="rule">分校主任以上必須啟用雙重驗證・人員離職時停用帳號即可，資料仍保留在分校</div></div>
  </div>
</div></figure></div>
</div>
</section>

<section class="sec" id="security">
  <div class="sec-h"><span class="eyebrow">資料安全與個資</span><h2>孩子的資料，我們用最高標準保護</h2>
  <p class="sec-p">補習班保管的是未成年學生的成績、家庭與聯絡資料。平台從設計開始就把安全放在第一位。</p></div>
  <div class="sec6">
    <div class="scard"><span class="si">台</span><h3>資料存放在台灣</h3><p>Google Cloud 台灣區域，全程加密</p></div>
    <div class="scard"><span class="si">權</span><h3>分校、角色分權</h3><p>每個人只看到該看的資料</p></div>
    <div class="scard"><span class="si">記</span><h3>查看都有紀錄</h3><p>誰看過、匯出過，隨時可查</p></div>
    <div class="scard"><span class="si">隱</span><h3>AI 只拿必要資料</h3><p>姓名、電話先換成代號</p></div>
    <div class="scard"><span class="si">核</span><h3>人員確認才送出</h3><p>跟進、回饋、報告都由人員把關</p></div>
    <div class="scard"><span class="si">規</span><h3>符合補習班個資規範</h3><p>提供個資維護計畫的文件範本</p></div>
  </div>
  <p class="fine">資料屬於補習班所有，可隨時匯出；合約結束時提供完整匯出並依約定刪除。</p>
</section>

<section class="sec" id="onboarding">
  <div class="sec-h"><span class="eyebrow">導入流程</span><h2>從舊系統換過來，資料我們幫你搬</h2>
  <p class="sec-p">大部分工作由我們完成，你的人員只需要確認。不用重新建檔，也不用擔心資料遺失。</p></div>
  <div class="tline">
    <div class="tl3"><span>1</span><h3>了解需求</h3><p>確認分校、班級與招生方式</p></div>
    <div class="tl3"><span>2</span><h3>資料轉移與開通</h3><p>從政龍等現有系統搬移學生、家長、班級與成績資料，並接上現有 LINE</p></div>
    <div class="tl3"><span>3</span><h3>核對與試用</h3><p>逐筆核對轉移資料、逐題測試 AI 回答，確認才開放</p></div>
    <div class="tl3"><span>4</span><h3>正式上線</h3><p>前兩個月每週檢視與調整</p></div>
  </div>
  <p class="fine">支援從政龍等補教系統、Excel 或紙本照片匯入。轉換期間可新舊系統並行，確認資料無誤後再正式切換。</p>
</section>



<section class="sec" id="pricing">
  <div class="sec-h"><span class="eyebrow">方案與費用</span><h2>費用包含哪些項目</h2>
  <p class="sec-p">依你的分校數與開通的模組報價。以下說明會產生哪些費用。</p></div>
  <div class="price3">
    <div class="pcard"><h3>導入服務</h3><span class="pt">一次性</span><ul><li>LINE 官方帳號開通與設定</li><li>舊系統資料轉移（政龍等現有系統、Excel）</li><li>課程與方案資料建置</li><li>人員教育訓練</li></ul></div>
    <div class="pcard main"><h3>平台月費</h3><span class="pt">基本模組＋開通的附加模組，依分校數計算</span><ul><li>後台帳號不限人數</li><li>AI 使用費已包含</li><li>功能持續更新，不另外收費</li></ul></div>
    <div class="pcard"><h3>LINE 訊息費用</h3><span class="pt">直接支付給 LINE</span><ul><li>回覆家長提問的訊息不計費</li><li>到班通知、提醒等主動訊息依 LINE 方案計算</li><li>平台清楚列出用量與預估費用</li></ul></div>
  </div>
  <div class="cta-band"><p>想知道你的補習班適合哪些模組、大約多少費用？預約展示，我們依你的分校數與需求提供報價。</p><a class="btn-p" href="#contact">預約展示</a></div>
</section>

<section class="sec" id="faq">
  <div class="sec-h"><span class="eyebrow">常見問題</span><h2>老闆們最常問的問題</h2></div>
  <div class="faq"><details class="qa" open><summary>需要換掉現在的 LINE 官方帳號嗎？</summary><p>不用。平台直接接上你現有的官方帳號，家長不需要重新加好友。如果帳號已經接了其他機器人，我們會協助搬移或一起運作。</p></details><details class="qa" open><summary>家長、學生、老師需要下載 App 嗎？</summary><p>不需要。家長與學生在 LINE 裡完成所有操作；老師用手機打開 LINE 裡的頁面就能點名與回饋；補習班人員使用網頁後台。</p></details><details class="qa" open><summary>AI 答錯怎麼辦？</summary><p>AI 只依你核准的課程資料與方案資料回答，價格、優惠、名額都只能引用你設定的內容。查不到依據、或涉及退費與孩子個別狀況的問題，一律交給人員。跟進訊息、試聽回饋、月報都由人員確認後才送出。</p></details><details class="qa" open><summary>一定要全部功能都買嗎？</summary><p>不用。AI 客服是基本模組，其他都是附加模組，可依需要逐步加入。部分模組需要先有學生檔案，模組總覽裡都有標示。</p></details><details class="qa" open><summary>我們現在用政龍或其他系統，換過來會很麻煩嗎？</summary><p>不會。學生、家長、班級與成績等資料，我們協助從政龍等現有補教系統、Excel 或照片完整轉移，不用重新建檔。轉換期間可以新舊並行，確認無誤再正式切換。</p></details><details class="qa" open><summary>資料放在哪裡？安全嗎？</summary><p>資料存放於 Google Cloud 台灣區域，依角色與分校控管權限，查看與匯出都有紀錄。詳見「資料安全與個資」。</p></details><details class="qa" open><summary>費用怎麼算？AI 要另外付錢嗎？</summary><p>依分校數與開通的模組報價，AI 使用費已包含在月費內。LINE 官方帳號的訊息費用由補習班直接支付給 LINE，平台會清楚列出用量。</p></details><details class="qa" open><summary>導入需要多久？我們要花多少人力？</summary><p>開通、舊系統資料轉移與教育訓練由我們協助完成，你的人員主要負責確認課程與方案資料。實際時程依分校數與資料準備情況而定，我們會在展示時一起規劃。</p></details></div>
</section>

<section class="sec contact" id="contact">
  <div class="sec-h"><span class="eyebrow">預約展示</span><h2>30 分鐘，看看平台能為你的補習班做什麼</h2>
  <p class="sec-p">我們會用你的補習班情境示範：家長在 LINE 問班、名單自動建立、主任看招生成效。</p></div>
  <div class="ct">
    <div class="ct-c"><b>超棒軟體科技有限公司</b><span>聯絡人：丁崇耘</span><span>電話：0937-338097</span><span>Email：dino.ting1020@gmail.com</span><span>地址：臺北市中正區金山北路 1 號 5 樓之 6</span></div>
  </div>
  <p class="fine">頁面中的補習班名稱、人名、成績與數字均為示意。</p>
</section>

  </main>
</div>
<script>
(function(){
  var layout=document.getElementById('layout'),btn=document.getElementById('navToggle'),scrim=document.getElementById('scrim');
  var mq=window.matchMedia('(max-width: 900px)');
  function setOpen(open){
    if(mq.matches){layout.classList.toggle('drawer-open',open);}
    else{layout.classList.toggle('collapsed',!open);try{localStorage.setItem('nav-collapsed',open?'0':'1');}catch(e){}}
    btn.setAttribute('aria-expanded',open?'true':'false');
  }
  function isOpen(){return mq.matches?layout.classList.contains('drawer-open'):!layout.classList.contains('collapsed');}
  try{if(!mq.matches&&localStorage.getItem('nav-collapsed')==='1'){layout.classList.add('collapsed');btn.setAttribute('aria-expanded','false');}}catch(e){}
  if(mq.matches)btn.setAttribute('aria-expanded','false');
  btn.addEventListener('click',function(){setOpen(!isOpen());});
  scrim.addEventListener('click',function(){setOpen(false);});
  document.querySelectorAll('.sb-nav a').forEach(function(a){a.addEventListener('click',function(){if(mq.matches)setOpen(false);});});
  document.querySelectorAll('.ng-t').forEach(function(b){b.addEventListener('click',function(){
    var ex=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',ex?'false':'true');
    document.getElementById(b.getAttribute('aria-controls')).hidden=ex;});});
  var links={};document.querySelectorAll('.sb-nav a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      var id=e.target.id;Object.keys(links).forEach(function(k){links[k].classList.toggle('active',k===id);});}});},{rootMargin:'-20% 0px -70% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(s){io.observe(s);});
  }
})();
</script>
</body>
</html>
`
