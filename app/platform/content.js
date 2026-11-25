// 不公開的頁面：沒有任何站內連結、不在 sitemap、不寫進 robots.txt（寫了反而會洩漏網址），
// 只靠 noindex 標頭與 meta 擋搜尋引擎。內容是獨立的整頁 HTML，原樣輸出。
export const PLATFORM_DESKTOP_MIN_WIDTH = 1024

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
.sec-h h2{font-family:var(--display)}
.sec-p{color:var(--muted);font-size:16px}
.fine{font-size:13px;color:var(--muted);margin-top:14px}

/* hero */
.hero2{display:grid;grid-template-columns:1.3fr 1fr;gap:32px;align-items:center;padding:48px 0 32px;border-bottom:1px solid var(--rule)}
.hero2 h1{font-family:var(--display)}
.lead2{font-size:17px;color:var(--muted);max-width:34em}
.h-pts{display:flex;flex-wrap:wrap;gap:8px 18px;margin:18px 0 22px;font-weight:700;font-size:15px;color:var(--accent)}
.h-btns{display:flex;gap:12px;flex-wrap:wrap}
.btn-p{background:var(--accent);color:#fff;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:999px}
.btn-s{border:1.5px solid var(--accent);color:var(--accent);text-decoration:none;font-weight:700;padding:10px 20px;border-radius:999px;background:var(--card)}
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
:root{--c1:#2769a9;--c1s:#e4eef8;--c2:#0e7c86;--c2s:#ddf1f2;--c3:#5b4fc9;--c3s:#ebe8fb;--c4:#2e7d4f;--c4s:#e3f2e8;--c5:#9c5b00;--c5s:#fdf0dc;--c6:#a8326e;--c6s:#f8e4ee}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--c1:#7fb3e6;--c1s:#1a2c40;--c2:#4cc3cc;--c2s:#143437;--c3:#a79ef0;--c3s:#26223f;--c4:#6fcf97;--c4s:#17301f;--c5:#f0b45a;--c5s:#3a2c14;--c6:#e58ab8;--c6s:#3a1c2b}}
:root[data-theme="dark"]{--c1:#7fb3e6;--c1s:#1a2c40;--c2:#4cc3cc;--c2s:#143437;--c3:#a79ef0;--c3s:#26223f;--c4:#6fcf97;--c4s:#17301f;--c5:#f0b45a;--c5s:#3a2c14;--c6:#e58ab8;--c6s:#3a1c2b}
.c1{--pc:var(--c1);--ps:var(--c1s)}.c2{--pc:var(--c2);--ps:var(--c2s)}.c3{--pc:var(--c3);--ps:var(--c3s)}
.c4{--pc:var(--c4);--ps:var(--c4s)}.c5{--pc:var(--c5);--ps:var(--c5s)}.c6{--pc:var(--c6);--ps:var(--c6s)}

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

.draft .ai-tag{display:inline-block}

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

/* ---- AI 回覆設定、單一聊天室暫停 ---- */
.aist{font-size:11px;font-weight:700;color:#6b46c1;background:#f3effc;border-radius:999px;padding:2px 9px}
.set2{display:grid;grid-template-columns:1.15fr 1fr;gap:10px;align-items:start}
.rad{display:flex;gap:8px;align-items:flex-start;border:1px solid #e1e8e6;border-radius:6px;padding:6px 8px;font-size:12px}
.rad>i{flex:none;width:12px;height:12px;border-radius:50%;border:1.5px solid #aab6b3;margin-top:2px}
.rad div{display:flex;flex-direction:column}.rad span{font-size:11px;color:#6b7b80}
.rad.on{border-color:#2769a9;background:#f2f7fc}.rad.on>i{border:4px solid #2769a9}
.wk{display:flex;flex-direction:column;gap:3px;margin-top:4px}
.wk-h,.wk-r{display:grid;grid-template-columns:32px 1fr;align-items:center;font-size:10.5px;color:#6b7b80}
.wk-h div{position:relative;height:14px}.wk-h div span{position:absolute;transform:translateX(-50%);white-space:nowrap}.wk-h div span:first-child{transform:none}.wk-h div span:last-child{transform:translateX(-100%)}
.wk-r div{position:relative;height:12px;background:#d9cdf5;border-radius:3px}
.wk-r i{position:absolute;top:0;bottom:0;border-radius:3px}
i.hm{background:#2769a9}i.ai{background:#d9cdf5}
.wk-lg{display:flex;gap:12px;font-size:10.5px;color:#58686d;margin-top:3px}
.wk-lg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.tgl-r{display:flex;gap:10px;align-items:flex-start;font-size:12px}
.tgl-r div{display:flex;flex-direction:column;flex:1}.tgl-r span{font-size:11px;color:#6b7b80}
.tgl{flex:none;width:30px;height:17px;border-radius:999px;background:#cfd8d5;position:relative;margin-top:2px}
.tgl i{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff}
.tgl.on{background:#2769a9}.tgl.on i{left:15px}
.who3{display:flex;flex-direction:column;gap:4px;background:#f7f9f8;border-radius:6px;padding:6px 8px}
.who3 div{display:flex;justify-content:space-between;align-items:center;font-size:11.5px}
.who3 b{font-size:11px;color:#58686d}.who3 b.ai{color:#6b46c1}
.kv.pz{position:relative;flex-wrap:wrap}
.dd.open{border-color:#2769a9;color:#2769a9}
.pz-menu{flex-basis:100%;margin-top:4px;background:#fff;border:1px solid #cfd8d5;border-radius:8px;box-shadow:0 6px 16px rgba(20,40,40,.12);padding:4px;display:flex;flex-direction:column;font-size:11.5px}
.pz-menu .pz-h{font-size:10.5px;color:#6b7b80;padding:2px 6px 4px;border-bottom:1px solid #eef2f1;margin-bottom:2px}
.pz-menu span{padding:3px 6px;border-radius:4px;color:#16252b}
.pz-menu span.on{background:#e4eef8;color:#2769a9;font-weight:700}
.pz-menu span.go{border-top:1px solid #eef2f1;margin-top:2px;color:#6b46c1;font-weight:700;border-radius:0}

/* Keep the inbox mockup at a browser-like height and scroll its panels independently. */
.inbox-demo{container-type:inline-size;color-scheme:light}
.inbox-demo .app{
  grid-template-columns:clamp(78px,11%,108px) minmax(0,1fr);
  height:clamp(496px,50cqw,540px);
  min-width:0;
  min-height:0;
}
.inbox-demo .main{min-height:0;padding:10px 12px;gap:8px}
.inbox-demo .ib{
  min-height:0;
  grid-template-columns:clamp(103px,19%,158px) minmax(0,1fr) clamp(138px,22%,172px);
  grid-template-rows:minmax(0,1fr);
  gap:8px;
}
.inbox-demo .sb,.inbox-demo .ib-list,.inbox-demo .ib-side,.ib-messages{
  min-height:0;
  overflow-y:auto;
  scrollbar-width:thin;
}
.inbox-demo .sb{padding:9px 6px;gap:1px}
.inbox-demo .sb-i{padding:3px 6px}
.inbox-demo .ib-i{grid-template-columns:minmax(0,1fr) auto;padding:6px 8px}
.inbox-demo .ib-chat{min-width:0;min-height:0;padding:8px;gap:6px}
.ib-messages{display:flex;flex:1 1 0;flex-direction:column;gap:6px;padding-inline-end:3px}
.ib-messages .cm{flex:none;max-width:94%;padding:4px 8px}
.inbox-demo .banner,.inbox-demo .draftbox,.inbox-demo .composer2{flex:none}
.inbox-demo .draftbox{margin-top:0;padding:5px 7px}
.inbox-demo .ib-side{min-width:0;padding:7px;gap:4px}
.inbox-demo .pz-menu{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;font-size:11px}
.inbox-demo .pz-menu .pz-h,.inbox-demo .pz-menu .on,.inbox-demo .pz-menu .go{grid-column:1/-1}
.inbox-demo .pz-menu span{padding:2px 4px}
.inbox-demo [tabindex]:focus-visible{outline:2px solid #2769a9;outline-offset:-2px}
@container (width < 760px){
  .inbox-demo .main{padding:8px;gap:6px}
  .inbox-demo .ib-i{display:flex;flex-wrap:wrap;align-items:center;gap:2px 4px;padding:4px 6px}
  .inbox-demo .ib-i small,.inbox-demo .ib-i em{flex-basis:100%}
  .inbox-demo .ib-chat{padding:7px;gap:5px}
  .ib-messages{gap:5px}
  .ib-messages .cm{font-size:11px;padding-block:3px}
  .inbox-demo .draftbox{font-size:11px;line-height:1.45}
}

/* ---- 試聽預約與回饋 ---- */
.trial-shots{gap:36px}
.ph-grp{display:flex;flex-direction:column;gap:8px}
.grp-lbl{font-size:13px;font-weight:700;color:var(--pc);border-bottom:2px solid var(--pc);padding-bottom:4px}
.grp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start}
.ph-body.bk,.ph-body.fb{gap:7px;padding:10px 12px}
.bk-course{display:flex;gap:9px;align-items:center;background:#f4f7f6;border-radius:12px;padding:8px 10px}
.bk-course div:nth-child(2){display:flex;flex-direction:column;flex:1;line-height:1.35}
.bk-course b{font-size:13.5px}.bk-course span{font-size:10.5px;color:#6b7b80}
.bk-course em{font-style:normal;font-size:11px;color:#2769a9;font-weight:700}
.bk-ic{width:34px;height:34px;border-radius:10px;background:#2769a9;color:#fff;display:grid;place-items:center;font-weight:700;font-size:14px}
.bk-lbl{font-size:10.5px;font-weight:700;color:#8fa29e;letter-spacing:.04em;margin-top:2px}
.bk-seg{display:grid;grid-template-columns:1fr 1fr;background:#eef2f1;border-radius:10px;padding:3px}
.bk-seg i{font-style:normal;text-align:center;padding:4px 0;border-radius:8px;color:#58686d}
.bk-seg i.on{background:#fff;color:#2769a9;font-weight:700;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.bk-days{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.bk-days div{border:1.5px solid #e1e8e6;border-radius:12px;padding:5px 0;display:flex;flex-direction:column;align-items:center;line-height:1.3}
.bk-days span{font-size:10px;color:#8fa29e}.bk-days b{font-size:14px}
.bk-days em{font-style:normal;font-size:10px;color:#0e7c86;font-weight:700}
.bk-days .on{border-color:#2769a9;background:#2769a9;color:#fff}.bk-days .on span,.bk-days .on em{color:#d6e6f5}
.bk-days .full{background:#f4f7f6;color:#aab6b3}.bk-days .full em{color:#aab6b3}
.bk-time{display:flex;justify-content:space-between;align-items:center;background:#e4eef8;color:#2769a9;font-weight:700;border-radius:10px;padding:6px 10px;font-size:12px}
.bk-time em{font-style:normal;font-weight:400;font-size:10.5px;color:#58686d}
.bk-kid{display:flex;align-items:baseline;gap:6px;border:1px solid #e1e8e6;border-radius:10px;padding:6px 10px}
.bk-kid span{flex:1;font-size:11px;color:#6b7b80}.bk-kid em{font-style:normal;font-size:10px;color:#0e7c86;font-weight:700}
.bk-btn{margin-top:auto;background:#06c755;color:#fff;text-align:center;font-weight:700;border-radius:12px;padding:10px;font-size:12.5px}
.bk-fine{text-align:center;font-size:10px;color:#8fa29e;margin-top:-3px}
.fb-kid{display:flex;gap:9px;align-items:center;padding-bottom:7px;border-bottom:1px solid #eef2f1}
.fb-kid div:nth-child(2){display:flex;flex-direction:column;line-height:1.35}
.fb-kid b{font-size:13.5px}.fb-kid span{font-size:10.5px;color:#6b7b80}
.fb-av{width:32px;height:32px;border-radius:50%;background:#f4f0e6;color:#7a6400;display:grid;place-items:center;font-weight:700}
.fb-row{display:flex;justify-content:space-between;align-items:center;gap:6px}
.fb-row>span{font-size:11px;font-weight:700;color:#3d4b50;flex:none}
.fb-row.stack{flex-direction:column;align-items:stretch;gap:4px}
.fb-opt{display:flex;background:#eef2f1;border-radius:8px;padding:2px}
.fb-opt i{font-style:normal;font-size:10.5px;padding:2px 7px;border-radius:6px;color:#6b7b80}
.fb-opt i.on{background:#fff;color:#2769a9;font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.1)}
.fb-tags{display:flex;gap:5px;flex-wrap:wrap}
.fb-tags i{font-style:normal;font-size:10.5px;border:1px solid #dde4e2;border-radius:999px;padding:1px 9px;color:#6b7b80}
.fb-tags i.on{border-color:#2769a9;background:#e4eef8;color:#2769a9;font-weight:700}
.fb-sel{border:1.5px solid #2769a9;border-radius:8px;padding:4px 9px;font-size:11.5px;font-weight:700;color:#16252b}
.fb-note{background:#f7f9f8;border:1px dashed #dde4e2;border-radius:8px;padding:5px 9px;font-size:10.5px;color:#58686d}
.fb .bk-btn{background:#2769a9}

/* ---- 到班點名、請假 ---- */
.att-sum{display:flex;gap:8px;align-items:stretch}
.att-sum div{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:5px 12px;display:flex;flex-direction:column;line-height:1.3}
.att-sum b{font-size:17px;color:#2769a9;font-variant-numeric:tabular-nums}.att-sum span{font-size:10.5px;color:#6b7b80}
.att-sum .lt b{color:#9a5b00}.att-sum .ab b{color:#b23b3b}.att-sum .lv b{color:#58686d}.att-sum .nt b{color:#06a148}
.att-sum em{font-style:normal;margin-left:auto;align-self:center;font-size:11px;color:#6b7b80}
.attt td{vertical-align:top}
.attt small{display:block;font-size:10px;color:#8fa29e;line-height:1.3}
.attt .eta{color:#9a5b00}
.st{display:inline-block;font-size:10.5px;font-weight:700;border-radius:999px;padding:1px 8px;background:#eef2f1;color:#58686d;white-space:nowrap}
.st.ok{background:#e4eef8;color:#2769a9}.st.warn{background:#fff2dc;color:#9a5b00}.st.bad{background:#fbe7e7;color:#b23b3b}.st.lv{background:#efe8f8;color:#7a4fb0}
.nf{font-size:11px;color:#8fa29e}.nf.on{color:#06a148;font-weight:700}
.acts{white-space:nowrap;text-align:right}.acts .btn{margin-left:4px}
tr.hl-ab td{background:#fdf3f3}
.lock-note{margin-top:auto;align-self:center;text-align:center;font-size:10.5px;line-height:1.5;color:#fff;background:rgba(255,255,255,.14);border:1px dashed rgba(255,255,255,.5);border-radius:10px;padding:6px 10px;margin-bottom:10px}
.lv-set{display:grid;grid-template-columns:1.3fr 1fr;gap:10px;align-items:start}
.lv-set .rad{margin-top:4px}
.shot.flowmid{flex:0 0 190px;align-self:center;display:flex;flex-direction:column;gap:14px;margin:0 -6px}
.fm-box{background:var(--card);border:2px solid var(--pc);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:4px;font-size:13.5px}
.fm-box b{color:var(--pc);font-size:14px}.fm-box p{color:var(--ink);line-height:1.6}.fm-box em{font-style:normal;font-size:12px;color:var(--muted)}
.fm-arr{position:relative;height:30px;display:flex;align-items:flex-end;justify-content:center}
.fm-arr span{font-size:12px;font-weight:700;color:var(--pc);text-align:center;line-height:1.35;position:absolute;bottom:12px;left:0;right:0}
.fm-arr.l span{bottom:auto;top:12px}
.fm-arr.l{align-items:flex-start;height:44px}
.fm-arr::before{content:"";position:absolute;left:4px;right:10px;height:2px;background:var(--pc)}
.fm-arr.r::before{bottom:4px}.fm-arr.l::before{top:4px;left:10px;right:4px}
.fm-arr::after{content:"";position:absolute;width:0;height:0;border:6px solid transparent}
.fm-arr.r::after{right:0;bottom:-1px;border-left:10px solid var(--pc);border-right:0}
.fm-arr.l::after{left:0;top:-1px;border-right:10px solid var(--pc);border-left:0}

/* ---- 補課（家長） ---- */
.mk-miss{display:flex;gap:9px;align-items:center;background:#fdf3f3;border-radius:12px;padding:8px 10px}
.mk-miss div:nth-child(2){display:flex;flex-direction:column;line-height:1.35}
.mk-miss b{font-size:12.5px}.mk-miss span{font-size:10.5px;color:#6b7b80}
.mk-x{width:30px;height:30px;border-radius:9px;background:#b23b3b;color:#fff;display:grid;place-items:center;font-weight:700;font-size:13px;flex:none}
.mk-quota{display:flex;justify-content:space-between;font-size:10.5px;color:#58686d;padding:0 2px}
.mk-quota b{color:#2769a9}
.mk-opt{display:flex;align-items:center;gap:9px;border:1.5px solid #e1e8e6;border-radius:12px;padding:6px 9px}
.mk-opt.on{border-color:#2769a9;background:#f2f7fc}
.mk-d{width:40px;flex:none;display:flex;flex-direction:column;align-items:center;line-height:1.2;border-right:1px solid #e1e8e6;padding-right:7px}
.mk-d span{font-size:9.5px;color:#8fa29e}.mk-d b{font-size:13px}
.mk-opt.on .mk-d b{color:#2769a9}
.mk-i{flex:1;display:flex;flex-direction:column;line-height:1.35}
.mk-i b{font-size:12px}.mk-i span{font-size:10.5px;color:#6b7b80}
.mk-opt em{font-style:normal;font-size:10.5px;font-weight:700;color:#0e7c86}
.mk-skip{color:#2769a9;font-weight:700;font-size:11px}
/* flow arrows: draw with borders so they always render */
.shot.flowmid{flex:0 0 210px}
.fm-arr{height:auto;display:flex;flex-direction:column;align-items:center;gap:4px}
.fm-arr::before,.fm-arr::after{display:none}
.fm-arr span{position:static}
.fm-arr i{display:block;width:100%;height:14px;position:relative}
.fm-arr i::before{content:"";position:absolute;top:6px;left:0;right:0;height:2px;background:var(--pc)}
.fm-arr i::after{content:"";position:absolute;top:1px;width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent}
.fm-arr.r i::after{right:-2px;border-left:10px solid var(--pc)}
.fm-arr.l i::after{left:-2px;border-right:10px solid var(--pc)}

/* ---- 班級管理 ---- */
.cls{display:grid;grid-template-columns:168px 1fr;gap:10px;flex:1}
.cls-list{background:#fff;border:1px solid #e1e8e6;border-radius:8px;overflow:hidden;align-self:start}
.cls-i{padding:7px 10px;border-bottom:1px solid #eef2f1;display:grid;grid-template-columns:1fr auto;gap:0 6px;font-size:12px}
.cls-i span{grid-column:1;font-size:10.5px;color:#6b7b80}
.cls-i em{grid-row:1/3;grid-column:2;align-self:center;font-style:normal;font-size:11px;color:#58686d;font-variant-numeric:tabular-nums}
.cls-i.on{background:#e4eef8;border-left:3px solid #2769a9}
.cls-i.new b::after{content:"新班";margin-left:5px;font-size:9.5px;background:#ddf1f2;color:#0e7c86;border-radius:4px;padding:0 4px}
.cls-d{background:#fff;border:1px solid #e1e8e6;border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px;position:relative;min-width:0}
.exp-menu{position:absolute;right:10px;top:40px;z-index:2;background:#fff;border:1px solid #cfd8d5;border-radius:8px;box-shadow:0 8px 20px rgba(20,40,40,.14);padding:4px;display:flex;flex-direction:column;font-size:11.5px;min-width:190px}
.exp-menu span{padding:4px 8px;border-radius:4px}
.exp-menu span:first-child{background:#e4eef8;color:#2769a9;font-weight:700}
.cls-info{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.cls-info div{background:#f7f9f8;border-radius:6px;padding:5px 8px;display:flex;flex-direction:column;line-height:1.35}
.cls-info span{font-size:10.5px;color:#6b7b80}.cls-info b{font-size:12px}
.roster td,.roster th{white-space:nowrap}
.roster td:first-child{color:#8fa29e;font-variant-numeric:tabular-nums}

/* ---- 頂部 logo、聯絡區 ---- */
.tb-logo{display:flex;align-items:center;flex:none}
.tb-logo img{height:34px;width:auto;display:block}
.tb-div{width:1px;height:24px;background:var(--rule)}
.tb-brand{color:var(--muted);font-weight:600}
:root[data-theme="dark"] .tb-logo img{filter:brightness(0) invert(1)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .tb-logo img{filter:brightness(0) invert(1)}}
.ct-band{display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.ct-band span{color:var(--muted);font-size:15px}
.ct-band .btn-p,.tb-cta,.nv.cta,.cta-band .btn-p,.h-btns .btn-p{cursor:pointer}
/* Platform presentation */
:root{
  --paper:#fbfcfe;--card:#fff;--ink:#172c42;--muted:#52647a;--rule:#dce6ef;
  --accent:#215e9e;--accent-soft:#eaf3fc;--action:#215e9e;--nav:#f5f8fc;
  --deep:#142f4a;--on-deep:#f2f8ff;--soft-on-deep:#c8d9eb;
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --paper:#111c29;--card:#172536;--ink:#edf3fc;--muted:#aebed1;--rule:#304255;
  --accent:#9ac8f5;--accent-soft:#1d3650;--action:#225f9c;--nav:#142131;
}}
:root[data-theme="dark"]{
  --paper:#111c29;--card:#172536;--ink:#edf3fc;--muted:#aebed1;--rule:#304255;
  --accent:#9ac8f5;--accent-soft:#1d3650;--action:#225f9c;--nav:#142131;
}
html{scroll-padding-top:82px}
.topbar{height:60px;padding:0 24px;gap:15px;background:var(--card)}
.tb-btn{background:transparent;border-color:transparent;color:var(--accent);font-size:21px}
.tb-btn:hover{background:var(--accent-soft)}
.tb-logo img{height:32px;width:auto}
.tb-cta,.nv.cta,.nv.cta.active,.btn-p{background:var(--action);color:#fff}
.tb-cta,.btn-p,.btn-s{border:1px solid transparent;border-radius:8px;display:inline-flex;align-items:center;justify-content:center;min-height:44px;line-height:1.4}
.tb-cta{min-height:38px;padding:7px 17px}
.btn-s{border-color:var(--rule);background:var(--card);color:var(--accent);padding:10px 18px}
.btn-s:hover{background:var(--accent-soft);border-color:var(--accent)}
.btn-p:hover,.tb-cta:hover,.nv.cta:hover{background:#174c80}
.layout{grid-template-columns:218px minmax(0,1fr)}
.sidebar{top:60px;height:calc(100dvh - 60px);background:var(--nav);padding:20px 12px 32px;scrollbar-width:thin}
.sb-head{padding:0 10px 14px;margin-bottom:10px}
.sb-head span{font-size:13px}
.nv{border-radius:5px;padding:6px 9px}
.nv.sub{padding:4px 6px 4px 12px;font-size:14px}
.nv:hover,.ng-t:hover{background:var(--accent-soft)}
.nv.active{box-shadow:inset 2px 0 var(--accent)}
.ng-a.active{background:var(--ps);color:var(--pc);box-shadow:inset 3px 0 var(--pc)}
.ng{margin:4px 0 2px}
.ng-l{margin-left:11px;border-left:1px solid var(--rule)}
.nv.cta{margin-top:14px}
.content{max-width:1320px;padding:0 clamp(24px,3.4vw,56px) 60px}
.sec{padding:44px 0 0}
.sec+.sec{margin-top:42px;border-top:1px solid var(--rule)}
.sec-h{gap:7px;margin-bottom:22px;max-width:58em}
.eyebrow{font-size:14px;letter-spacing:.04em}
.sec-h h2{font-size:clamp(27px,2.7vw,40px);line-height:1.3}
.sec-p{max-width:52em}
.fine{margin-top:18px}

/* Opening spread */
.hero2{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:clamp(24px,3.5vw,55px);padding:44px 0 38px;align-items:center}
.hero2 h1{font-size:clamp(28px,2.75vw,44px);line-height:1.28;margin:12px 0 16px;letter-spacing:-.025em;text-wrap:balance}
.hero2 h1 span{white-space:nowrap}
.lead2{line-height:1.85}
.h-pts{list-style:none;padding:0;margin:20px 0 24px;gap:5px 18px;font-size:15px}
.h-pts li{display:flex;align-items:baseline;gap:6px}
.h-pts li span{color:var(--accent);font-size:13px}
.h-vis{display:grid;grid-template-columns:minmax(0,1fr) clamp(190px,19vw,258px);align-items:end;min-width:0}
.scene{margin:0;min-width:0}
.scene img{display:block;width:100%;height:100%;object-fit:cover}
.scene figcaption{font-size:12px;line-height:1.55;color:var(--muted);margin-top:7px}
.hero-scene{grid-area:1/1/2/3;align-self:start;margin-right:36px}
.hero-scene img{aspect-ratio:1.25;height:auto;min-height:305px;max-height:440px;border-radius:14px;object-position:37% center;background:var(--accent-soft)}
.h-vis .hero-chat{grid-area:1/2/2/3;align-self:end;z-index:1;min-width:0}
.hero-chat .phone{width:100%;height:auto;padding:6px;border-radius:23px;box-shadow:0 14px 32px #0d213940}
.hero-chat .notch{width:40px;height:7px;top:7px}
.hero-chat .ph-top{font-size:11px;padding:14px 6px 6px;gap:5px;line-height:1.3;overflow-wrap:anywhere}
.hero-chat .av{width:17px;height:17px;flex:none;font-size:9px}
.hero-chat .ph-body{min-height:0;gap:5px;padding:7px 6px;border-radius:0 0 17px 17px;font-size:clamp(11px,.9vw,13px)}
.hero-chat .msg{max-width:91%;padding:4px 6px;line-height:1.45;border-radius:9px}
.hero-chat .msg.staff{background:#eaf3fc}
.hero-chat .msg.staff b{display:block;color:#215e9e;font-size:.9em}
.hero-chat figcaption{font-size:12px;line-height:1.5;justify-content:flex-end;background:var(--paper)}
.desktop-preview{display:none}

/* 導入後的影響方向 */
.impact{overflow:hidden;border:1px solid var(--rule);border-radius:14px;background:var(--card)}
.impact-head{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:4px 18px;padding:20px clamp(20px,3vw,38px)}
.impact-head h2{font-size:clamp(25px,2.7vw,38px)}
.impact-head p{font-size:14px;color:var(--muted)}
.impact-icons{position:absolute;width:0;height:0;overflow:hidden}
.impact-band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,2vw,28px);padding:22px clamp(16px,3vw,38px);background:color-mix(in srgb,var(--trend) 8%,var(--card))}
.impact-up{--trend:light-dark(#bd3028,#ff877c)}
.impact-down{--trend:light-dark(#167448,#6fd4a0)}
.impact-result{display:grid;gap:9px;justify-items:center;margin:0;min-width:0}
.impact-result figcaption{display:block;text-align:center;color:var(--ink);font-size:clamp(16px,1.5vw,21px);font-weight:700}
.impact-visual{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;gap:7px;width:min(100%,264px)}
.impact-visual svg{display:block;width:100%;height:auto}
.impact-before{color:var(--muted)}
.impact-after,.impact-arrow{color:var(--trend)}
.impact-empty-person{color:var(--muted);opacity:.7}
.impact-arrow{font:700 clamp(24px,3vw,37px)/1 system-ui,sans-serif}
@media (max-width:640px){.impact-band{grid-template-columns:1fr}}

/* 招生到續班的流程圖 */
#overview{container-type:inline-size}
.flow2-wrap{background:var(--card);border:1px solid var(--rule);border-radius:10px;padding:12px;overflow-x:auto}
.flow2-wrap:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.flow2{min-width:700px;display:flex;flex-direction:column;gap:8px}
.prow,.frow{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px}
.pband{text-align:center;font-weight:700;font-size:14px;padding:5px 6px;border-radius:6px;background:var(--accent-soft);color:var(--accent)}
.fcol,.fhelps{display:flex;flex-direction:column;gap:6px}
.fst{min-height:48px;background:var(--action);color:#fff;font-weight:700;font-size:14px;line-height:1.3;padding:6px 11px 6px 15px;display:flex;align-items:center;gap:5px;clip-path:polygon(0 0,calc(100% - 9px) 0,100% 50%,calc(100% - 9px) 100%,0 100%,9px 50%)}
.fst>span:first-child{width:19px;height:19px;border-radius:50%;background:#fff;color:var(--action);display:grid;place-items:center;font-size:11px;flex:none}
.hc{display:flex;align-items:center;gap:5px;text-decoration:none;font-size:13px;font-weight:700;color:var(--pc);background:var(--ps);border-radius:6px;padding:6px;border:1px solid transparent;line-height:1.4}
.fcol:last-child .fst{padding-inline:11px 9px;gap:4px}
.fcol:last-child .fst>span:first-child{width:17px;height:17px}
.fst-label,.hc span{word-break:keep-all}
.hc:hover{border-color:var(--pc)}
.hc i{font-style:normal;flex:none;min-width:20px;height:20px;padding-inline:3px;border-radius:4px;background:var(--pc);color:var(--on-pc);display:grid;place-items:center;font-size:11px}
.legend2{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;margin:14px 0 0;font-size:13px;color:var(--muted)}
.lg2{display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:var(--pc);font-weight:700;padding:3px 4px}
.lg2:hover{text-decoration:underline;text-underline-offset:3px}
.lg2 i{width:8px;height:8px;border-radius:50%;background:var(--pc);flex:none}
.flow-scroll-hint{display:none;font-size:13px;color:var(--muted);margin-top:6px}
@container (width < 726px){.flow-scroll-hint{display:block}}
@container (width < 875px){
  .fst{gap:4px;padding-inline:11px 8px;font-size:13px}
  .fst>span:first-child{width:16px;height:16px}
  .fcol:last-child .fst{padding-inline:9px 7px;gap:3px}
  .fcol:last-child .fst>span:first-child{width:14px;height:14px}
  .fcol:last-child .fst-label{font-size:12px}
  .hc{padding-inline:4px;gap:4px}
  .hc i{min-width:17px;height:18px;padding-inline:2px}
}

/* 模組總覽 */
.mstack{display:flex;flex-direction:column;gap:12px}
.mbase{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.5fr);gap:20px;background:var(--accent-soft);border-left:3px solid var(--accent);border-radius:0 8px 8px 0;padding:20px 24px}
.mb-l{display:flex;gap:13px;align-items:flex-start}
.mb-l h3{font-family:var(--display);font-size:29px;margin:1px 0 4px}
.mb-l p{color:var(--muted);font-size:15px}
.mc-code{color:var(--pc,var(--accent));font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;flex:none}
.mc-code.big{font-size:28px;line-height:1.25}
.mb-r{display:grid;grid-template-columns:1fr 1.2fr;gap:16px}
.mb-col h4{font-size:15px;color:var(--accent);margin-bottom:5px}
.mb-col ul{margin:0;padding-left:1.15em;font-size:14px}
.mb-col a{color:var(--ink);text-underline-offset:3px}
.module-catalog{border-block:1px solid var(--rule)}
.module-catalog summary{font-weight:700;color:var(--accent)}
.module-catalog>p{color:var(--muted);font-size:14px;margin:0 12px 12px}
.madd{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:24px;border-bottom:1px solid var(--rule)}
.mcard{display:grid;grid-template-columns:24px minmax(0,1fr);gap:10px;align-items:baseline;text-decoration:none;color:var(--ink);border-top:1px solid var(--rule);padding:11px 5px}
.mcard:hover{background:var(--accent-soft)}
.mcard b{font-size:16px}.mcard p{font-size:14px;color:var(--muted);margin:1px 0 3px}
.mc-dep{display:flex;flex-wrap:wrap;gap:0 10px;font-size:13px;color:var(--muted)}
.mc-dep .free{color:var(--pc)}

/* 六個章節使用流程圖配色，保留寬版介紹與獨立示意區 */
.pillar{
  --chapter-inset:clamp(22px,3vw,44px);
  --chapter-rule:color-mix(in srgb,var(--pc) 24%,var(--rule));
  margin:clamp(52px,5vw,78px) 0 0;
  padding:0 var(--chapter-inset) 30px;
  border:0;
  border-radius:18px;
  background:color-mix(in srgb,var(--ps) 38%,var(--paper));
  box-shadow:inset 0 0 0 1px var(--chapter-rule);
}
.chapter-summary,.pl-banner{margin-inline:calc(-1 * var(--chapter-inset))}
.chapter-summary{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  min-height:88px;
  padding:clamp(14px,1.6vw,22px) var(--chapter-inset);
  border-radius:18px 18px 0 0;
  background:var(--pc);
  color:var(--on-pc);
  cursor:pointer;
  list-style:none;
}
.chapter-summary::-webkit-details-marker{display:none}
.chapter-summary:hover{background:color-mix(in srgb,var(--pc) 92%,var(--on-pc))}
.chapter-summary:focus-visible{outline-color:var(--on-pc)}
.pillar:has(.chapter-detail:not([open])){padding-bottom:0}
.chapter-detail:not([open])>.chapter-summary{border-radius:18px}
.pl-eb{display:flex;align-items:center;gap:clamp(14px,1.65vw,24px);font:700 clamp(24px,2.45vw,36px)/1.25 var(--body)}
.chapter-number{flex:none;padding-right:clamp(14px,1.65vw,24px);border-right:1px solid color-mix(in srgb,var(--on-pc) 42%,transparent);font:700 clamp(38px,3.8vw,56px)/1.05 var(--display)}
.chapter-label{display:flex;align-items:center;flex-wrap:wrap;gap:6px 14px}
.pl-eb em{font-style:normal;font-size:13px;font-weight:700;color:var(--pc);background:var(--on-pc);padding:4px 8px;border-radius:4px;line-height:1.3}
.chapter-action{display:flex;align-items:center;gap:10px;flex:none;font-size:14px;font-weight:700}
.chapter-action::before{content:"展開"}
.chapter-detail[open]>.chapter-summary .chapter-action::before{content:"收合"}
.pl-banner{
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1.08fr);
  gap:20px clamp(22px,3.5vw,48px);
  align-items:center;
  padding:clamp(26px,3.6vw,50px) var(--chapter-inset) clamp(22px,3vw,42px);
  background:color-mix(in srgb,var(--ps) 70%,var(--paper));
}
.pl-t h3{font-family:var(--display);font-size:clamp(27px,2.6vw,38px);margin:0 0 13px;line-height:1.35;text-wrap:pretty}
.pl-t p{font-size:clamp(15px,1.26vw,17px);line-height:1.85;color:var(--muted);max-width:43em}
.chapter-scene img{aspect-ratio:16/9;height:auto;border-radius:11px;background:var(--ps)}
.chapter-scene figcaption{margin-top:8px}
.ba2{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);
  gap:12px clamp(16px,2vw,28px);
  align-items:start;
  margin:26px 0 30px;
  font-size:16px;
  line-height:1.7;
}
.ba2 .b,.ba2 .a{padding:0;text-wrap:balance}
.ba2 i{display:block;font-style:normal;font-size:14px;font-weight:700;margin-bottom:4px}
.ba2 .b{color:var(--muted)}
.ba2 .a i,.ba2 .arr{color:var(--pc);font-weight:700}
.ba2 .arr{align-self:center;font-size:24px}
@media (max-width:800px){.pl-banner{grid-template-columns:1fr}}
.subf{margin-top:28px;padding-top:22px;border-top:1px solid var(--chapter-rule)}
.sf-top{display:flex;align-items:center;gap:5px 10px;flex-wrap:wrap}
.sf-top h4{font-size:23px;border-left:4px solid var(--pc);padding-left:9px}
.feature-detail{border-top:1px solid var(--chapter-rule)}
.feature-detail+.feature-detail{margin-top:14px}
.feature-summary,.module-catalog summary{display:flex;align-items:center;gap:12px;min-height:46px;padding:9px 12px;cursor:pointer;list-style:none}
.feature-summary::-webkit-details-marker,.module-catalog summary::-webkit-details-marker{display:none}
.chapter-action::after,.feature-summary::after,.module-catalog summary::after{content:"";flex:none;width:8px;height:8px;border-right:2px solid;border-bottom:2px solid;transform:translateY(-2px) rotate(45deg)}
.module-catalog summary::after{margin-left:auto}
.chapter-detail[open] .chapter-action::after,[open]>.feature-summary::after,.module-catalog[open]>summary::after{transform:translateY(2px) rotate(225deg)}
.feature-summary{min-height:54px;padding:12px 16px;color:var(--pc);font-size:18px;font-weight:700}
.feature-name{flex:1}
.feature-code{font-size:13px;font-weight:500;color:var(--muted)}
.feature-summary:hover,.feature-detail[open]>.feature-summary,.module-catalog summary:hover{background:var(--card)}
summary:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.feature-detail>.subf{margin:0;padding:0 16px 22px;border:0;background:var(--card);scroll-margin-top:58px}
.feature-detail .sf-top{display:none}
.feature-detail .sf-desc{margin-top:0}
.feature-detail .shot.web{min-width:0}
.sf-desc{color:var(--muted);margin:6px 0 10px;max-width:48em}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,205px),1fr));gap:7px 14px;padding:4px 0}
.tile{display:flex;align-items:flex-start;gap:6px;max-width:100%;font-size:14px;line-height:1.6}
.tile svg{width:14px;height:14px;flex:none;margin-top:4px}
.tile svg circle{fill:var(--pc)}.tile svg path{stroke:var(--on-pc)}
.subf .shots{margin-top:16px}
.shots{gap:16px 22px}
.feature-detail .shots{margin-top:20px;gap:20px 24px}
.shot{max-width:100%}
.shot.web,.shot.web:has(.browser.mini){flex:1 1 100%}
.content .shots figcaption{line-height:1.55;color:var(--muted)}
.mcode,.mkind{font-size:12px;font-weight:700;border-radius:4px;padding:2px 6px;font-variant-numeric:tabular-nums}
.mcode,.mkind.base{background:var(--ps,var(--card));color:var(--pc,var(--accent))}
.mkind.add{color:var(--muted);border:1px solid var(--rule)}
:root{--on-pc:#fff}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--on-pc:#111c29}}
:root[data-theme="dark"]{--on-pc:#111c29}

/* 資安、導入、費用與問答 */
.sec.info-panel{
  margin-top:clamp(48px,4.7vw,72px);
  padding:clamp(24px,3.3vw,44px);
  border:1px solid color-mix(in srgb,var(--pc) 25%,var(--rule));
  border-top:4px solid var(--pc);
  border-radius:16px;
  background:color-mix(in srgb,var(--ps) 51%,var(--paper));
}
.info-head{display:flex;align-items:center;gap:16px;margin-bottom:clamp(22px,2.5vw,36px)}
.info-icon{width:54px;height:54px;flex:none;display:grid;place-items:center;border-radius:12px;background:var(--ps);color:var(--pc)}
.info-icon svg{width:29px;height:29px}
.info-head h2{font-size:clamp(32px,3.2vw,46px);line-height:1.2}
.info-head .sec-p{margin-top:7px;line-height:1.7}
.info-panel .fine{margin-top:22px;font-size:14px;line-height:1.7}
.sec6{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.scard{gap:5px;padding:16px;background:var(--card);border:1px solid var(--rule);border-radius:9px}
.scard h3{font-size:17px}
.scard p{font-size:14px;line-height:1.65}
.si{display:grid;place-items:center;width:30px;height:30px;color:var(--pc);margin-bottom:3px}
.si svg{width:24px;height:24px}
.tline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.tl3{display:flex;flex-direction:column;gap:6px;position:relative;min-width:0}
.tl3:not(:last-child)::before{content:"";position:absolute;left:49px;right:-9px;top:20px;border-top:2px solid color-mix(in srgb,var(--pc) 37%,var(--rule))}
.tl3>span{position:relative;width:42px;height:42px;border-radius:50%;background:var(--pc);color:var(--on-pc);display:grid;place-items:center;font-size:18px;font-weight:700}
.tl3 h3{font-size:18px;margin-top:6px}
.tl3 p{font-size:14px;line-height:1.65;color:var(--muted)}
.price3{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.price3 .pcard{padding:clamp(15px,1.7vw,24px);border:1px solid var(--rule);border-radius:10px;background:var(--card);gap:8px}
.price3 .pcard.main{border-color:var(--pc);background:var(--ps)}
.price3 .pcard.main h3{color:var(--pc)}
.price3 .pcard h3{font-size:20px}
.price3 .pt{font-size:14px;color:var(--muted);line-height:1.5}
.price3 ul{margin:7px 0 0;font-size:14px;line-height:1.65}
.price3 li+li{margin-top:5px}
.info-panel .cta-band{margin-top:19px;border:0;border-radius:8px;background:var(--ps);gap:10px 20px;padding:15px 17px;flex-wrap:nowrap}
.cta-band .btn-p{flex:none}
.faq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start;gap:20px;max-width:none}
.faq-group{min-width:0;padding:15px 17px 5px;border:1px solid var(--rule);border-radius:10px;background:var(--card)}
.faq-group h3{margin-bottom:10px;font-size:18px;color:var(--pc)}
.qa{background:none;border:0;border-top:1px solid var(--rule);border-radius:0;padding:0}
.qa summary{padding:13px 0;font-size:16px;line-height:1.5}
.qa summary::after{color:var(--pc);flex:none}
.qa summary:hover{color:var(--pc)}
.qa p{padding:0 0 14px;font-size:14px;line-height:1.75}
@media (max-width:800px){
  .sec6,.tline{grid-template-columns:repeat(2,minmax(0,1fr))}
  .tl3:nth-child(2n)::before{display:none}
  .price3,.faq{grid-template-columns:1fr}
}
.sec.contact{margin-top:62px;padding:30px clamp(24px,3.5vw,42px);border:0;border-radius:14px;background:var(--deep);color:var(--on-deep)}
.contact .eyebrow{color:#b0d4fb}.contact .sec-p,.contact .fine,.ct-band span{color:var(--soft-on-deep)}
.contact .btn-p{background:#fff;color:#143759}.contact .btn-p:hover{background:#dceeff}

@media (max-width:1150px){
  .content{padding-inline:24px}
  .hero2{gap:25px;padding-top:40px}
  .hero-scene{margin-right:23px}
  .hero-scene img{min-height:290px}
  .hero-chat .phone{box-shadow:0 9px 20px #0d213940}
}
@media (width < ${PLATFORM_DESKTOP_MIN_WIDTH}px){
  .topbar{padding-inline:16px;gap:10px}
  .tb-cta{min-height:44px;white-space:nowrap}
  .tb-btn,.tb-brand,.tb-div,.sidebar,.layout.drawer-open .scrim,
  .content > section:not(#home,#contact),.hero-scene,.hero-overview{display:none}
  .layout,.layout.collapsed{grid-template-columns:minmax(0,1fr)}
  .content{max-width:640px;padding:0 clamp(16px,4vw,24px) 32px}
  .hero2{grid-template-columns:minmax(0,1fr);gap:20px;padding:28px 0 0;border:0}
  .hero2 h1{font-size:clamp(26px,6.8vw,40px);line-height:1.35;text-wrap:balance;margin:8px 0 12px}
  .lead2{font-size:16px;line-height:1.65}
  .h-pts{font-size:14px;margin:12px 0 16px;gap:4px 12px}
  .h-vis{display:block}
  .h-vis .hero-chat{max-width:420px;margin:0 auto}
  .hero-chat .ph-top{font-size:13px;padding:14px 10px 8px}
  .hero-chat .ph-body{padding:9px;gap:6px;font-size:14px}
  .hero-chat .msg{padding:5px 8px}
  .hero-chat figcaption{justify-content:center}
  .desktop-preview{display:block;margin-top:18px;color:var(--muted);font-size:14px}
  .desktop-preview button{font:inherit;font-weight:700;color:var(--accent);background:none;border:0;padding:9px 0;cursor:pointer;text-decoration:underline}
  #desktop-copy-status{overflow-wrap:anywhere}
  .sec.contact{margin-top:24px;padding:22px 18px}
}
@media (prefers-reduced-motion:reduce){.layout,.ng-t{transition:none}}
</style>
</head>
<body>
<div class="topbar">
  <button class="tb-btn" id="navToggle" aria-label="收合或展開導覽列" aria-controls="sidebar" aria-expanded="true">☰</button>
  <a class="tb-logo" href="https://official.superb-tutor.com/zh-TW" target="_blank" rel="noopener" aria-label="超棒軟體 SuperB Software 官網"><img src="/superb-lockup.svg" alt="超棒軟體 SuperB Software" width="152" height="40"></a><span class="tb-div"></span><span class="tb-brand">補習班 LINE 招生與教務平台</span>
  <span class="tb-sp"></span>
  <a class="tb-cta" href="#contact" data-contact="topbar">預約了解</a>
</div>
<div class="layout" id="layout">
  <aside class="sidebar" id="sidebar" aria-label="網站導覽">
    <div class="sb-head"><b>超棒軟體</b><span>補習班 LINE 平台</span></div>
    <nav class="sb-nav"><a class="nv" href="#home">首頁</a><a class="nv" href="#overview">招生到續班的流程</a><a class="nv" href="#why">導入後的六個改變</a><!-- <a class="nv" href="#modules">模組總覽</a> --><div class="ng"><div class="ng-row"><a class="nv ng-a c1" href="#ai">一、AI 客服</a><button class="ng-t" aria-expanded="true" aria-controls="ai-list" aria-label="展開或收合AI 客服">▾</button></div><div class="ng-l" id="ai-list"><a class="nv sub" href="#ai-service">AI 家長客服</a><a class="nv sub" href="#offers">課程與方案管理</a><a class="nv sub" href="#inbox">真人接手收件匣</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a c2" href="#source">二、招生來源追溯</a><button class="ng-t" aria-expanded="true" aria-controls="source-list" aria-label="展開或收合招生來源追溯">▾</button></div><div class="ng-l" id="source-list"><a class="nv sub" href="#friends">好友來源名單</a><a class="nv sub" href="#links">來源連結與 QR Code</a><a class="nv sub" href="#roi">來源成效報表</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a c3" href="#crm">三、招生 CRM</a><button class="ng-t" aria-expanded="true" aria-controls="crm-list" aria-label="展開或收合招生 CRM">▾</button></div><div class="ng-l" id="crm-list"><a class="nv sub" href="#followup">招生總覽與跟進清單</a><a class="nv sub" href="#pipeline">名單看板與名單卡片</a><a class="nv sub" href="#trial">試聽預約與試聽回饋</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a c4" href="#family">四、學生與家長服務</a><button class="ng-t" aria-expanded="true" aria-controls="family-list" aria-label="展開或收合學生與家長服務">▾</button></div><div class="ng-l" id="family-list"><a class="nv sub" href="#students">學生檔案與家長綁定</a><a class="nv sub" href="#grades">作業成績與家長查詢</a><a class="nv sub" href="#reports">AI 月學習報告</a><a class="nv sub" href="#notices">公告與聯絡簿</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a c5" href="#daily">五、出缺勤與日常行政</a><button class="ng-t" aria-expanded="true" aria-controls="daily-list" aria-label="展開或收合出缺勤與日常行政">▾</button></div><div class="ng-l" id="daily-list"><a class="nv sub" href="#classes">班級管理</a><a class="nv sub" href="#attendance">到班點名與通知</a><a class="nv sub" href="#leave">LINE 請假</a><a class="nv sub" href="#makeup">補課安排</a></div></div><div class="ng"><div class="ng-row"><a class="nv ng-a c6" href="#manage">六、續班與經營管理</a><button class="ng-t" aria-expanded="true" aria-controls="manage-list" aria-label="展開或收合續班與經營管理">▾</button></div><div class="ng-l" id="manage-list"><a class="nv sub" href="#renewal">續班與繳費提醒</a><a class="nv sub" href="#retention">流失預警</a><a class="nv sub" href="#branches">多分校管理</a></div></div><a class="nv" href="#security">資料安全與個資</a><a class="nv" href="#onboarding">導入流程</a><a class="nv" href="#pricing">方案與費用</a><a class="nv" href="#faq">常見問題</a><a class="nv cta" href="#contact" data-contact="sidebar">預約了解</a></nav>
  </aside>
  <div class="scrim" id="scrim"></div>
  <main class="content">

<section class="hero2" id="home">
  <div class="h-text">
    <span class="eyebrow">補習班 LINE 招生與教務平台</span>
    <h1>家長用原本的 LINE <span>問課，</span><span>AI 先回，</span><span>招生人員</span><span>接著跟進</span></h1>
    <p class="lead2">AI 依你核准的課程資料回答，遇到需要判斷的問題就交給行政。從追蹤試聽，到報名後的點名、請假與續班，都能在後台管理。</p>
    <ul class="h-pts">
      <li><span aria-hidden="true">✓</span>沿用現有 LINE 官方帳號</li>
      <li><span aria-hidden="true">✓</span>家長、老師都不用裝 App</li>
      <li><span aria-hidden="true">✓</span>資料存放在台灣</li>
    </ul>
    <div class="h-btns"><a class="btn-p" href="#contact" data-contact="hero">預約了解</a><a class="btn-s hero-overview" href="#overview">看招生到續班的流程</a></div>
  </div>
  <div class="h-vis">
    <figure class="scene hero-scene">
      <img src="/platform-scenes/reception.webp" alt="明亮的補習班教室裡，老師陪孩子練習並分享解題成果" width="1200" height="900" loading="lazy" decoding="async">
      <figcaption>補習班教學情境示意</figcaption>
    </figure>
    <figure class="shot ph hero-chat" aria-label="家長在 LINE 的問班對話示意"><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">板橋有國二理化嗎？學費多少？</div>
<div class="msg b">有的！每週六 14:00–16:00 上課，每期 12 週 NT$9,600，含講義。</div>
<div class="msg p">可以只上半期嗎？</div>
<div class="msg b">我幫您轉給招生老師確認。</div>
<div class="msg b staff"><b>招生老師接手</b>您好！可以先安排這週六試聽，再聊適合孩子的上課方案。</div>
    </div></div><figcaption>後台跟進示意｜已聯絡，待確認試聽</figcaption></figure>
  </div>
</section>

<div class="desktop-preview">
  <p>想看完整後台操作示意？可以把連結帶到電腦或橫放的平板繼續看。</p>
  <button id="desktop-copy" type="button">複製網址</button>
  <p id="desktop-copy-status" role="status"></p>
</div>

<section class="sec" id="overview">
  <div class="sec-h"><h2>從招生到續班</h2>
  <p class="sec-p">點選任一功能，查看對應的操作示意。</p></div>
  <div class="flow2-wrap" role="region" aria-label="從招生到續班的八個階段" tabindex="0">
    <div class="flow2">
      <div class="prow"><div class="pband" style="grid-column:span 4">招生期</div><div class="pband" style="grid-column:span 3">在學期間</div><div class="pband" style="grid-column:span 1">續班</div></div>
      <div class="frow">
        <div class="fcol"><div class="fst"><span>1</span><span class="fst-label">招生<wbr>曝光</span></div><div class="fhelps"><a class="hc c2" href="#links"><i>02</i><span>來源連結<wbr>與 QR</span></a><a class="hc c2" href="#friends"><i>02</i><span>好友來源<wbr>名單</span></a></div></div>
        <div class="fcol"><div class="fst"><span>2</span><span class="fst-label">問班<wbr>諮詢</span></div><div class="fhelps"><a class="hc c1" href="#ai-service"><i>01</i><span>AI <wbr>家長客服</span></a><a class="hc c1" href="#offers"><i>01</i><span>課程與<wbr>方案</span></a><a class="hc c1" href="#inbox"><i>01</i><span>真人<wbr>接手</span></a><a class="hc c3" href="#followup"><i>03</i><span>跟進<wbr>清單</span></a></div></div>
        <div class="fcol"><div class="fst"><span>3</span>試聽</div><div class="fhelps"><a class="hc c3" href="#trial"><i>03</i><span>試聽預約<wbr>與回饋</span></a><a class="hc c3" href="#pipeline"><i>03</i><span>名單<wbr>看板</span></a></div></div>
        <div class="fcol"><div class="fst"><span>4</span>報名</div><div class="fhelps"><a class="hc c4" href="#students"><i>04</i><span>學生與<wbr>家長綁定</span></a><a class="hc c2" href="#roi"><i>02</i><span>來源<wbr>成效</span></a></div></div>
        <div class="fcol"><div class="fst"><span>5</span>開課</div><div class="fhelps"><a class="hc c4" href="#notices"><i>07</i><span>公告與<wbr>聯絡簿</span></a><a class="hc c6" href="#branches"><i>13</i><span>多分校<wbr>管理</span></a></div></div>
        <div class="fcol"><div class="fst"><span>6</span><span class="fst-label">日常<wbr>上課</span></div><div class="fhelps"><a class="hc c5" href="#attendance"><i>08</i><span>到班<wbr>點名</span></a><a class="hc c5" href="#leave"><i>09</i><span>LINE 請假</span></a><a class="hc c5" href="#makeup"><i>10</i><span>補課<wbr>安排</span></a></div></div>
        <div class="fcol"><div class="fst"><span>7</span><span class="fst-label">學習<wbr>追蹤</span></div><div class="fhelps"><a class="hc c4" href="#grades"><i>05</i><span>作業成績<wbr>查詢</span></a><a class="hc c4" href="#reports"><i>06</i><span>AI 月<wbr>學習報告</span></a></div></div>
        <div class="fcol"><div class="fst"><span>8</span><span class="fst-label">續班/<wbr>流失</span></div><div class="fhelps"><a class="hc c6" href="#renewal"><i>11</i><span>續班<wbr>提醒</span></a><a class="hc c6" href="#retention"><i>12</i><span>流失<wbr>預警</span></a></div></div>
      </div>
    </div>
  </div>
  <p class="flow-scroll-hint">左右滑動查看完整流程</p>
<div class="legend2"><span>顏色對應六大章，數字是模組編號。</span><a class="lg2 c1" href="#ai"><i></i>一、AI 客服</a><a class="lg2 c2" href="#source"><i></i>二、招生來源追溯</a><a class="lg2 c3" href="#crm"><i></i>三、招生 CRM</a><a class="lg2 c4" href="#family"><i></i>四、學生與家長服務</a><a class="lg2 c5" href="#daily"><i></i>五、出缺勤與日常行政</a><a class="lg2 c6" href="#manage"><i></i>六、續班與經營管理</a></div>
</section>

<section class="sec" id="why">
  <div class="impact">
    <div class="impact-head">
      <h2>導入後的六個改變</h2>
      <p>影響方向示意</p>
    </div>
    <svg class="impact-icons" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <symbol id="impact-person" viewBox="0 0 16 20" fill="currentColor">
        <circle cx="8" cy="5" r="3.5"/><path d="M1 18v-2a7 7 0 0 1 14 0v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
      </symbol>
      <symbol id="impact-empty" viewBox="0 0 16 20" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="8" cy="5" r="3.15"/><path d="M2 18v-2a6 6 0 0 1 12 0v2Z"/>
      </symbol>
      <symbol id="impact-renewed" viewBox="0 0 16 30">
        <use href="#impact-person" width="16" height="20"/><path d="m4 24 2.6 2.6L12 21.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </symbol>
      <symbol id="impact-heart" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21 3.8 13a5.6 5.6 0 0 1 7.9-8l.3.3.3-.3a5.6 5.6 0 0 1 7.9 8Z"/>
      </symbol>
      <symbol id="impact-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9.5"/><path d="M12 6.5v6l3.8 2.2"/>
      </symbol>
      <symbol id="impact-sheet" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="2.5" width="16" height="23" rx="2"/><path d="M8 8h8m-8 5h8m-8 5h5"/>
      </symbol>
      <symbol id="impact-coin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
        <circle cx="12" cy="12" r="9.5"/><path d="M12 6.3v11.4m3-9H11a1.65 1.65 0 0 0 0 3.3h2a1.65 1.65 0 0 1 0 3.3H9"/>
      </symbol>
    </svg>
    <div class="impact-band impact-up" role="group" aria-label="上升項目">
      <figure class="impact-result">
        <figcaption>新生報名數</figcaption>
        <div class="impact-visual" role="img" aria-label="人形從一排變成兩排，示意新生報名數上升">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-person" x="2" y="15" width="14" height="18"/><use href="#impact-person" x="19" y="15" width="14" height="18"/><use href="#impact-person" x="36" y="15" width="14" height="18"/><use href="#impact-person" x="53" y="15" width="14" height="18"/><use href="#impact-person" x="70" y="15" width="14" height="18"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↗</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-person" x="2" y="4" width="14" height="18"/><use href="#impact-person" x="19" y="4" width="14" height="18"/><use href="#impact-person" x="36" y="4" width="14" height="18"/><use href="#impact-person" x="53" y="4" width="14" height="18"/><use href="#impact-person" x="70" y="4" width="14" height="18"/>
            <use href="#impact-person" x="2" y="25" width="14" height="18"/><use href="#impact-person" x="19" y="25" width="14" height="18"/><use href="#impact-person" x="36" y="25" width="14" height="18"/><use href="#impact-person" x="53" y="25" width="14" height="18"/><use href="#impact-person" x="70" y="25" width="14" height="18"/>
          </svg>
        </div>
      </figure>
      <figure class="impact-result">
        <figcaption>續班率</figcaption>
        <div class="impact-visual" role="img" aria-label="同一組學生中，打勾的人變多，示意續班率上升">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-renewed" x="2" y="9" width="14" height="27"/><use href="#impact-renewed" x="19" y="9" width="14" height="27"/><use href="#impact-empty" x="36" y="9" width="14" height="18" class="impact-empty-person"/><use href="#impact-empty" x="53" y="9" width="14" height="18" class="impact-empty-person"/><use href="#impact-empty" x="70" y="9" width="14" height="18" class="impact-empty-person"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↗</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-renewed" x="2" y="9" width="14" height="27"/><use href="#impact-renewed" x="19" y="9" width="14" height="27"/><use href="#impact-renewed" x="36" y="9" width="14" height="27"/><use href="#impact-renewed" x="53" y="9" width="14" height="27"/><use href="#impact-empty" x="70" y="9" width="14" height="18" class="impact-empty-person"/>
          </svg>
        </div>
      </figure>
      <figure class="impact-result">
        <figcaption>學生關懷時間</figcaption>
        <div class="impact-visual" role="img" aria-label="愛心變多，示意可用於關懷學生的時間上升">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-heart" x="18" y="12" width="24" height="24"/><use href="#impact-heart" x="46" y="12" width="24" height="24"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↗</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-heart" x="1" y="14" width="20" height="20"/><use href="#impact-heart" x="23" y="14" width="20" height="20"/><use href="#impact-heart" x="45" y="14" width="20" height="20"/><use href="#impact-heart" x="67" y="14" width="20" height="20"/>
          </svg>
        </div>
      </figure>
    </div>
    <div class="impact-band impact-down" role="group" aria-label="下降項目">
      <figure class="impact-result">
        <figcaption>問班等候時間</figcaption>
        <div class="impact-visual" role="img" aria-label="時鐘變少，示意等候問班回覆的時間下降">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-clock" x="2" y="11" width="26" height="26"/><use href="#impact-clock" x="31" y="11" width="26" height="26"/><use href="#impact-clock" x="60" y="11" width="26" height="26"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↘</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-clock" x="31" y="11" width="26" height="26"/>
          </svg>
        </div>
      </figure>
      <figure class="impact-result">
        <figcaption>日常行政工時</figcaption>
        <div class="impact-visual" role="img" aria-label="文書圖示變少，示意行政工時下降">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-sheet" x="5" y="9" width="24" height="30"/><use href="#impact-sheet" x="32" y="9" width="24" height="30"/><use href="#impact-sheet" x="59" y="9" width="24" height="30"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↘</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-sheet" x="32" y="9" width="24" height="30"/>
          </svg>
        </div>
      </figure>
      <figure class="impact-result">
        <figcaption>每位新生招生成本</figcaption>
        <div class="impact-visual" role="img" aria-label="錢幣圖示變少，示意每位新生的招生成本下降">
          <svg class="impact-before" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-coin" x="2" y="11" width="26" height="26"/><use href="#impact-coin" x="31" y="11" width="26" height="26"/><use href="#impact-coin" x="60" y="11" width="26" height="26"/>
          </svg>
          <span class="impact-arrow" aria-hidden="true">↘</span>
          <svg class="impact-after" viewBox="0 0 88 48" aria-hidden="true" focusable="false">
            <use href="#impact-coin" x="31" y="11" width="26" height="26"/>
          </svg>
        </div>
      </figure>
    </div>
  </div>
</section>

<!-- 暫停顯示模組總覽
<section class="sec" id="modules">
  <div class="sec-h"><span class="eyebrow">模組總覽</span><h2>從基本模組開始，需要什麼再加什麼</h2>
  <p class="sec-p">AI 客服是每家補習班的基本模組；其他 12 個附加模組可依需要逐步加購。</p></div>
  <div class="mstack">
  <div class="mbase">
    <div class="mb-l"><span class="mc-code big">01</span><div><span class="mkind base">基本模組・每家補習班都包含</span><h3>AI 客服</h3><p>家長的問題即時回答，需要人的交給人。</p></div></div>
    <div class="mb-r"><div class="mb-col"><h4>包含功能</h4><ul><li><a href="#ai-service">AI 家長客服</a></li><li><a href="#offers">課程與方案管理</a></li><li><a href="#inbox">真人接手收件匣</a></li></ul></div>
      <div class="mb-col"><h4>平台基本功能</h4><ul><li>沿用現有 LINE 官方帳號</li><li>後台帳號與角色權限（帳號不限人數）</li><li><a href="#classes">班級管理與名單匯出</a></li><li>資料安全與個資保護</li><li>導入協助與教育訓練</li></ul></div></div>
  </div>
  <details class="module-catalog" open><summary>12 個附加模組與搭配條件</summary>
  <p>標示「需搭配」的模組，要先有對應的模組才能使用。</p>
  <div class="madd"><a class="mcard c2" href="#friends"><span class="mc-code">02</span><div><b>招生來源追溯</b><p>誰從哪裡加了 LINE，各來源帶來多少報名</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c3" href="#followup"><span class="mc-code">03</span><div><b>招生 CRM</b><p>每位好友在哪個階段、今天該跟進誰</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c4" href="#students"><span class="mc-code">04</span><div><b>學生檔案與家長綁定</b><p>學生、家長、學生本人都連上 LINE</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a><a class="mcard c4" href="#grades"><span class="mc-code">05</span><div><b>作業成績與家長查詢</b><p>家長在 LINE 查成績與作業</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c4" href="#reports"><span class="mc-code">06</span><div><b>AI 月學習報告</b><p>每月學習報告，班導確認後送出</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span><span>需搭配 05 作業成績與家長查詢</span></div></div></a><a class="mcard c4" href="#notices"><span class="mc-code">07</span><div><b>公告與聯絡簿</b><p>一句話產生公告，發給對的家長</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c5" href="#attendance"><span class="mc-code">08</span><div><b>到班點名與通知</b><p>掃 QR 點名，家長即時收到通知</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c5" href="#leave"><span class="mc-code">09</span><div><b>LINE 請假</b><p>在 LINE 請假，點名自動同步</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span><span>需搭配 08 到班點名與通知</span></div></div></a><a class="mcard c5" href="#makeup"><span class="mc-code">10</span><div><b>補課安排</b><p>依你的補課制度列出補課選項</p><div class="mc-dep"><span>需搭配 09 LINE 請假</span></div></div></a><a class="mcard c6" href="#renewal"><span class="mc-code">11</span><div><b>續班與繳費提醒</b><p>自動提醒，家長一鍵回覆</p><div class="mc-dep"><span>需搭配 04 學生檔案與家長綁定</span></div></div></a><a class="mcard c6" href="#retention"><span class="mc-code">12</span><div><b>流失預警</b><p>提早發現可能不續班的學生</p><div class="mc-dep"><span>需搭配 05 作業成績與家長查詢</span><span>需搭配 08 到班點名與通知</span></div></div></a><a class="mcard c6" href="#branches"><span class="mc-code">13</span><div><b>多分校管理</b><p>總部看全部，分校各自管理</p><div class="mc-dep"><span class="free">可直接加購</span></div></div></a></div>
  </details>
</div>
</section>
-->

<section class="pillar c1" id="ai">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">一</span><span class="chapter-label">AI 客服<em class="base">模組 01・基本模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>家長的問題 24 小時即時回答，需要人的交給人</h3><p>家長在你現有的 LINE 官方帳號提問，AI 依你核准的課程與方案資料回答；退費、成績保證、孩子個別狀況這類需要判斷的問題，交給你的人員處理。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/ai-desk.webp" alt="補習班櫃檯人員在電腦前查看課程資料，準備回覆家長" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>櫃檯回覆家長情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>家長晚上傳訊息，隔天才有人回；新人報價說錯也收不回來</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>AI 立刻依你的資料回答，數字只說你核准的，需要人的才轉過去</div></div>
  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">AI 家長客服</span></summary>
  <div class="subf" id="ai-service">
  <div class="sf-top"><h4>AI 家長客服</h4><span class="mkind base">基本模組</span></div>
  <p class="sf-desc">依你提供的課程資料回答上課時間、地點、收費、試聽。AI 什麼時段回覆、回覆哪些人，都由你決定。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>課程資料在後台像寫文件一樣編輯，隨時更新</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>AI 答不出來的問題自動收集，補一次就學會</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>需要判斷的問題不自行回答，直接轉人員</span></div></div>
  <div class="shots"><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長只看到答案，不會看到文件結構</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">板橋有國二理化嗎？多少錢</div>
<div class="msg b">有的！板橋分校每週六 14:00–16:00 上課，每期 12 週 NT$9,600，含講義。想先試聽一堂嗎？</div>
<div class="msg p">可以只上半期嗎</div>
<div class="msg b">這個問題我幫您轉給行政人員確認，稍後由專人回覆您 🙏</div></div></div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>知識庫・文件分頁：正在編輯子文件，右側直接試問 AI</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/kb/docs/g8-science</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i on">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
</div></figure><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>AI 回覆設定：決定 AI 什麼時候回、回覆哪些人</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/settings/ai-reply</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i on">設定</div></div>
    <div class="main">
<div class="pg-h"><b>AI 回覆設定</b><span class="sp"></span><span class="aist on">● 現在 22:30・AI 回覆中</span><span class="btn">儲存</span></div>
<div class="set2">
  <div class="pn"><div class="pn-h">回覆時段</div>
    <div class="rad"><i></i><div><b>全天 24 小時</b><span>所有時間都由 AI 先回覆</span></div></div>
    <div class="rad on"><i></i><div><b>只在非上班時間</b><span>上班時間由人員回覆，下班後與假日由 AI 接手</span></div></div>
    <div class="rad"><i></i><div><b>自訂時段</b><span>自己指定 AI 回覆的時段</span></div></div>
    <div class="wk">
      <div class="wk-h"><span></span><div><span style="left:0">8:00</span><span style="left:25%">12:00</span><span style="left:50%">16:00</span><span style="left:75%">20:00</span><span style="left:100%">24:00</span></div></div>
      <div class="wk-r"><span>週一</span><div><i class="hm" style="left:37.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週二</span><div><i class="hm" style="left:37.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週三</span><div><i class="hm" style="left:37.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週四</span><div><i class="hm" style="left:37.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週五</span><div><i class="hm" style="left:37.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週六</span><div><i class="hm" style="left:12.5%;width:43.75%"></i></div></div>
      <div class="wk-r"><span>週日</span><div></div></div>
      <div class="wk-lg"><span><i class="hm"></i>人員回覆（平日 14–21、週六 10–17）</span><span><i class="ai"></i>AI 回覆</span></div>
    </div>
  </div>
  <div class="pn"><div class="pn-h">回覆對象</div>
    <div class="tgl-r"><div><b>只回覆陌生訊息</b><span>還不是在學家長或學生的好友（新朋友、問班的家長）由 AI 回覆；在學家長與學生的訊息直接進收件匣，由人員處理</span></div><span class="tgl on"><i></i></span></div>
    <div class="who3">
      <div><span class="idt nw">新朋友</span><b class="ai">AI 回覆</b></div>
      <div><span class="idt pr">在學家長</span><b>→ 收件匣</b></div>
      <div><span class="idt st">學生</span><b>→ 收件匣</b></div>
    </div>
    <div class="pn-h" style="margin-top:8px">AI 不回覆時</div>
    <div class="tgl-r"><div><b>自動回覆一句「已收到」</b><span>例如：收到您的訊息，老師上班後會盡快回覆您 🙏</span></div><span class="tgl on"><i></i></span></div>
  </div>
</div></div>
  </div>
</div></figure></div>
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">課程與方案管理</span></summary>
  <div class="subf" id="offers">
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
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i on">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">真人接手收件匣</span></summary>
  <div class="subf" id="inbox">
  <div class="sf-top"><h4>真人接手收件匣</h4><span class="mkind base">基本模組</span></div>
  <p class="sf-desc">AI 轉過來的問題集中在一個收件匣，指派給對的人，一個都不漏。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可單獨暫停某個聊天室的 AI：一段時間或永久</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>右側直接改名稱、指派負責人、加標籤與備註</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>申訴、退費自動通知主任</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>接手對話、AI 已暫停，右側指派負責人與備註</figcaption><div class="browser inbox-demo">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/inbox/u8f2</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i on">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>收件匣</b><span class="seg"><i class="on">待處理 4</i><i>處理中 2</i><i>AI 處理中</i><i>已結案</i></span></div>
<div class="ib">
  <div class="ib-list" role="region" aria-label="收件匣對話清單示意" tabindex="0">
    <div class="ib-i on"><b>王小明爸爸 <span class="idt pr">家長</span></b><span class="tag warn">學習狀況</span><small>段考退步很多分，可以知道…</small><em>3 分鐘前</em></div>
    <div class="ib-i"><b>王小明 <span class="idt st">學生</span></b><span class="tag">找老師</span><small>講義忘在教室了可以…</small><em>8 分鐘前</em></div>
    <div class="ib-i"><b>陳媽媽 <span class="idt nw">新朋友</span></b><span class="tag">問班</span><small>可以只上半期嗎</small><em>12 分鐘前</em></div>
    <div class="ib-i"><b>林小姐</b><span class="tag">個別狀況</span><small>孩子最近不想來…</small><em>1 小時前</em></div>
    <div class="ib-i"><b>張先生</b><span class="tag">其他</span><small>發票抬頭可以改嗎</small><em>昨天</em></div>
  </div>
  <div class="ib-chat">
    <div class="banner">AI 已暫停至今天 18:00・由 林主任 處理中 <span class="btn sm ghost">結案並恢復 AI</span></div>
    <div class="ib-messages" role="region" aria-label="收件匣對話內容示意" tabindex="0">
      <div class="cm p">下週三理化課照常上嗎？</div>
      <div class="cm b">照常上課喔！國二理化 A 週三 19:00–21:00，在本部 3 樓。<i>AI</i></div>
      <div class="cm p">他這次段考退步很多分，可以知道是為什麼嗎？</div>
      <div class="cm b">孩子的學習狀況需要老師個別了解，我已經轉給主任，稍後回覆您。<i>AI・已轉真人</i></div>
      <div class="cm s">小明爸爸您好，我是林主任，我先看了小明這學期的小考成績……<i>林主任</i></div>
    </div>
    <div class="draftbox"><i class="ai-tag">AI 草稿</i><span>小明爸爸您好，小明這學期理化小考平均 76 分，退步主要在第 3 單元的計算題。我們可以先幫他安排一次診斷小考…</span><em>點一下帶入輸入框</em></div>
    <div class="composer2"><span class="att" title="附件">📎</span><span class="ph">輸入訊息…</span><span class="btn sm">送出</span></div>
  </div>
  <div class="ib-side" role="region" aria-label="聊天室設定與備註示意" tabindex="0">
    <div class="side-h">聊天室</div>
    <div class="kv"><span>顯示名稱</span><b class="ed">王小明爸爸 ✎</b></div>
    <div class="kv"><span>指派給</span><b class="dd">林主任 ▾</b></div>
    <div class="kv"><span>狀態</span><b class="dd">處理中 ▾</b></div>
    <div class="kv pz"><span>AI 回覆</span><b class="dd open">暫停至今天 18:00 ▾</b>
      <div class="pz-menu"><div class="pz-h">暫停這個聊天室的 AI</div><span>30 分鐘</span><span>2 小時</span><span class="on">到今天下班（18:00）</span><span>3 天</span><span>永久暫停</span><span class="go">立即恢復 AI</span></div></div>
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
</details>

  </details>
</section><section class="pillar c2" id="source">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">二</span><span class="chapter-label">招生來源追溯<em class="add">模組 02・附加模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>誰從哪裡加了 LINE，一目瞭然</h3><p>每個廣告、傳單都有自己的連結與 QR Code；同學介紹來的，加入後由人員標記介紹人。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/enrollment-source.webp" alt="家長在補習班入口拿起印有 QR Code 的招生傳單，身旁是背書包的學生" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>招生傳單情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>只知道這個月花了多少錢、報名了幾個人，不知道是哪一筆預算有效</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>每位好友都有來源，每個來源都算得出報名數與取得成本</div></div>
  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">好友來源名單</span></summary>
  <div class="subf" id="friends">
  <div class="sf-top"><h4>好友來源名單</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">每一位新加入的 LINE 好友，從哪個廣告、傳單或誰介紹來，現在在哪個階段。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>點連結、掃 QR 加入時自動記錄來源</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>直接搜尋加入的，AI 在對話中順便詢問</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可依來源、分校篩選</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>每位新好友從哪裡來、現在到哪一步</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm/friends</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">來源連結與 QR Code</span></summary>
  <div class="subf" id="links">
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">來源成效報表</span></summary>
  <div class="subf" id="roi">
  <div class="sf-top"><h4>來源成效報表</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">各來源、分校、科目的問班、試聽、報名數與每筆報名的取得成本並排比較。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>主任每月填入花費，系統算出取得成本</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>知道哪個來源最划算，下一筆預算放對地方</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每週營運摘要寄到主任信箱</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>來源成效：哪個來源最划算（數字為情境範例）</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/sources</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i on">報表</div><div class="sb-i">設定</div></div>
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
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i on">報表</div><div class="sb-i">設定</div></div>
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
</details>

  </details>
</section><section class="pillar c3" id="crm">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">三</span><span class="chapter-label">招生 CRM<em class="add">模組 03・附加模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>每一個加 LINE 的人，現在在哪個階段、要不要跟進</h3><p>每一位加入 LINE 的人都會進入招生名單：從只加好友、問班、聯絡、試聽到報名，每個人在哪一步一清二楚。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/admissions.webp" alt="老師在補習班向家長與孩子介紹課程，桌上攤開試讀講義" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>招生諮詢情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>招生人員邊聊邊抄名單，忙起來就忘了跟進，問過的家長就這樣流失</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>每位好友都在名單上，今天該聯絡誰、為什麼、說什麼都列好了</div></div>
  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">招生總覽與跟進清單</span></summary>
  <div class="subf" id="followup">
  <div class="sf-top"><h4>招生總覽與跟進清單</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一眼看到每個階段有多少人，以及今天需要跟進的人與原因。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>從加入好友到報名的每一段轉換率</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>逾時未聯絡、試聽後沒回覆、只加好友沒問班，自動列出</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每一筆跟進都附上建議的動作</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>招生漏斗與今天要跟進的人</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm/overview</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">名單看板與名單卡片</span></summary>
  <div class="subf" id="pipeline">
  <div class="sf-top"><h4>名單看板與名單卡片</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長在 LINE 留下的資料自動建成名單，招生歷程一路累積。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>年級、科目、可上課時段、在意的點自動填好</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>依家長的積極程度排序</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>AI 依家長在意的點擬好跟進訊息，數字只來自方案資料</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>名單看板：AI 依意向排序，每張卡片顯示目前階段的重點</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/crm</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i on">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">試聽預約與試聽回饋</span></summary>
  <div class="subf" id="trial">
  <div class="sf-top"><h4>試聽預約與試聽回饋</h4><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長在 LINE 選試聽時段；老師試聽後在手機上點選評估，就產生給家長的回饋與報名建議。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>試聽名額自動扣除，不會超收</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>老師用手機點選評估，30 秒完成，不用裝 App</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長收到回饋卡片，可直接按「我要報名」</span></div></div>
  <div class="shots trial-shots">
<div class="ph-grp"><div class="grp-lbl">試聽前</div><div class="grp-row">
<figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長在 LINE 裡預約試聽</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>預約免費試聽</b><span>⋯</span></div><div class="ph-body liffbg bk">
<div class="bk-course"><div class="bk-ic">數</div><div><b>國二數學 B</b><span>周老師・12 人小班</span></div><em>更換</em></div>
<div class="bk-lbl">分校</div>
<div class="bk-seg"><i>本部</i><i class="on">板橋</i></div>
<div class="bk-lbl">選擇日期</div>
<div class="bk-days"><div><span>週三</span><b>11/19</b><em>剩 2</em></div><div class="on"><span>週五</span><b>11/21</b><em>剩 3</em></div><div class="full"><span>週六</span><b>11/22</b><em>額滿</em></div></div>
<div class="bk-time"><span>⏰ 19:00 – 21:00</span><em>板橋分校 2 樓</em></div>
<div class="bk-lbl">試聽學生</div>
<div class="bk-kid"><b>晴晴</b><span>國二・建國國中</span><em>已帶入</em></div>
<div class="bk-btn">確認預約・11/21（五）19:00</div>
<p class="bk-fine">試聽前一天會在 LINE 提醒您</p></div></div></figure>
</div></div>
<div class="ph-grp after"><div class="grp-lbl">試聽後</div><div class="grp-row">
<figure class="shot ph"><figcaption><span class="who teacher">老師・手機</span>老師點選評估，不用裝 App</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>試聽回饋</b><span>⋯</span></div><div class="ph-body liffbg fb">
<div class="fb-kid"><div class="fb-av">晴</div><div><b>陳晴晴</b><span>國二數學・11/21 試聽</span></div></div>
<div class="fb-row"><span>基礎觀念</span><div class="fb-opt"><i>待加強</i><i class="on">清楚</i><i>很好</i></div></div>
<div class="fb-row"><span>計算速度</span><div class="fb-opt"><i class="on">偏慢</i><i>普通</i><i>快</i></div></div>
<div class="fb-row"><span>應用題</span><div class="fb-opt"><i class="on">會卡住</i><i>普通</i><i>熟練</i></div></div>
<div class="fb-row stack"><span>上課表現</span><div class="fb-tags"><i class="on">專心</i><i class="on">會發問</i><i>較安靜</i><i>需提醒</i></div></div>
<div class="fb-row stack"><span>建議班級</span><div class="fb-sel">國二數學 B（基礎加強）▾</div></div>
<div class="fb-note">補充一句（選填）：應用題從 B 班的題型練起</div>
<div class="bk-btn">產生家長回饋</div></div></div></figure>
<figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到試聽回饋</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">試聽回饋</div><div class="fx-b"><b>晴晴的數學試聽</b><p>觀念大致清楚，主要需要加強計算速度與應用題。上課很專心，也會主動發問 👍<br><br>建議：國二數學 B（每週五 19:00，12 人小班）</p><span>周老師・示範板橋</span></div><div class="fx-btn">我要報名</div><div class="fx-btn ghost">想再聊聊</div></div></div></div></figure>
</div></div>
</div>
  </div>
</details>

  </details>
</section><section class="pillar c4" id="family">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">四</span><span class="chapter-label">學生與家長服務<em class="add">附加模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>報名之後，讓家長隨時知道孩子的狀況</h3><p>學生報名後，爸爸、媽媽和學生本人都能在 LINE 連上同一份學生檔案。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/parent.webp" alt="家長在補習班等候區看手機，孩子在一旁展示剛完成的練習" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>家長查看學習資訊情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>家長打電話問成績，老師翻本子回答；公告一個個群組轉貼</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>家長自己在 LINE 查，老師專心教學，公告一次發給對的人</div></div>
  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">學生檔案與家長綁定</span><span class="feature-code">模組 04</span></summary>
  <div class="subf" id="students">
  <div class="sf-top"><h4>學生檔案與家長綁定</h4><span class="mcode add">模組 04</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一位學生可綁多位家長與學生本人，各自選擇要收哪些通知。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>從招生名單一鍵轉成學生，試聽評估一起帶過來</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>一位家長多個孩子，跨分校也沒問題</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>繳費、續班只送主要聯絡人</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>學生檔案：LINE 綁定與各自的通知設定</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/students/s1024</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i on">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">作業成績與家長查詢</span><span class="feature-code">模組 05</span></summary>
  <div class="subf" id="grades">
  <div class="sf-top"><h4>作業成績與家長查詢</h4><span class="mcode add">模組 05</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">老師登錄作業與成績，家長在 LINE 隨時查看。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>像試算表一樣登錄，也可以拍成績單匯入</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長問「孩子最近數學怎麼樣」，AI 依資料回答</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可設定學生本人是否看得到成績</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>成績登錄，像試算表一樣輸入</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/classes/g8-sci-a/grades</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i on">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">AI 月學習報告</span><span class="feature-code">模組 06</span></summary>
  <div class="subf" id="reports">
  <div class="sf-top"><h4>AI 月學習報告</h4><span class="mcode add">模組 06</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">AI 依出缺勤、作業、成績寫好月報草稿，班導確認後送出。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>每月自動產生全班草稿</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>班導可修改、補一句話</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長看完可直接回覆「想跟老師聊聊」</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>班導逐份檢視 AI 草稿</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/reports/2026-11/g8-sci-a</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i on">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">公告與聯絡簿</span><span class="feature-code">模組 07</span></summary>
  <div class="subf" id="notices">
  <div class="sf-top"><h4>公告與聯絡簿</h4><span class="mcode add">模組 07</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">一句話產生公告，依分校、年級、班級發給對的家長。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>停課、調課、活動、聯絡簿都有現成格式</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>發送前看到預估訊息則數</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>停課公告同步到 AI 客服</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>撰寫公告，送出前看到預估則數</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/notices/new</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i on">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
</details>

  </details>
</section><section class="pillar c5" id="daily">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">五</span><span class="chapter-label">出缺勤與日常行政<em class="add">附加模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>點名、請假、補課，在 LINE 裡完成</h3><p>學生出示 QR Code、老師用手機一掃就點完名，家長立刻收到通知；請假、晚到、補課都在 LINE 完成，行政只處理真正的例外。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/classroom.webp" alt="學生出示點名卡，老師在教室門口用手機掃碼" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>到班點名情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>紙本點名、電話請假、行政翻課表找補課空位</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>點名即通知，請假自動同步，補課依你的規則列出選項</div></div>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">班級管理</span><span class="feature-code">平台基本功能</span></summary>
  <div class="subf" id="classes">
  <div class="sf-top"><h4>班級管理</h4><span class="mkind base">平台基本功能</span></div>
  <p class="sf-desc">每個班級的老師、教室、上課時段和學生名單集中在一頁；點名、請假、補課都以這份名單為準。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>一頁看完班級的老師、教室、時段與學生</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>名單匯出 Excel、列印紙本點名表</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>學生轉班、插班、退班都留下紀錄</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>班級名單：誰在這個班、誰教、在哪裡上課</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/classes/g8-sci-a</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i on">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>班級</b><span class="seg"><i class="on">本學期 12 班</i><i>已結束</i></span><span class="sp"></span><span class="btn ghost">＋ 新增班級</span></div>
<div class="cls">
  <div class="cls-list">
    <div class="cls-i on"><b>國二理化 A</b><span>週三 19:00・林老師</span><em>20 / 20</em></div>
    <div class="cls-i"><b>國二數學 B</b><span>週五 19:00・陳老師</span><em>9 / 12</em></div>
    <div class="cls-i"><b>國二理化 B</b><span>週六 14:00・周老師</span><em>14 / 16</em></div>
    <div class="cls-i"><b>國三總複習</b><span>週二、四 19:00・林老師</span><em>18 / 20</em></div>
    <div class="cls-i"><b>國一英文 B</b><span>週五 19:30・王老師</span><em>14 / 16</em></div>
    <div class="cls-i new"><b>小高一數學</b><span>12/7 開課・陳老師</span><em>6 / 15</em></div>
  </div>
  <div class="cls-d">
    <div class="pg-h"><b>國二理化 A</b><span class="tag ok">上課中</span><span class="tag">本部</span><span class="sp"></span><span class="btn ghost">編輯班級</span><span class="btn ghost">＋ 加入學生</span><span class="btn exp-open">匯出名單 ▾</span></div>
    <div class="exp-menu"><span>Excel 名單（含家長聯絡方式）</span><span>列印點名表（PDF）</span><span>只匯出學生姓名</span></div>
    <div class="cls-info"><div><span>授課老師</span><b>林老師</b></div><div><span>助教</span><b>吳助教</b></div><div><span>上課時段</span><b>每週三 19:00–21:00</b></div><div><span>教室</span><b>本部 3 樓 301</b></div><div><span>期間</span><b>9/3 – 11/26・12 週</b></div><div><span>人數</span><b>20 / 20・額滿</b></div></div>
    <table class="tb roster"><tr><th>座號</th><th>學生</th><th>學校・年級</th><th>主要聯絡人</th><th>電話</th><th>入班</th><th>狀態</th></tr>
    <tr><td>01</td><td><b>陳小安</b></td><td>建國國中・國二</td><td>陳媽媽</td><td>0912-xxx-301</td><td>9/3</td><td><span class="st ok">在班</span></td></tr>
    <tr><td>02</td><td><b>李小華</b></td><td>和平國中・國二</td><td>李爸爸</td><td>0921-xxx-118</td><td>9/3</td><td><span class="st ok">在班</span></td></tr>
    <tr><td>03</td><td><b>林○宇</b></td><td>建國國中・國二</td><td>林媽媽</td><td>0918-xxx-552</td><td>9/3</td><td><span class="st ok">在班</span></td></tr>
    <tr><td>04</td><td><b>王小明</b></td><td>建國國中・國二</td><td>王小明爸爸</td><td>0937-xxx-640</td><td>9/12</td><td><span class="st ok">在班</span></td></tr>
    <tr><td>05</td><td><b>黃○恩</b></td><td>大同國中・國二</td><td>黃媽媽</td><td>0955-xxx-027</td><td>10/8</td><td><span class="st warn">插班・第 6 週</span></td></tr>
    <tr><td>06</td><td><b>張○廷</b></td><td>和平國中・國二</td><td>張爸爸</td><td>0960-xxx-913</td><td>9/3</td><td><span class="st">轉出 → 國二理化 B</span></td></tr>
    </table>
    <div class="rule">⋯ 共 20 人。手機號碼依角色權限遮蔽，主任與行政可看完整號碼</div>
  </div>
</div></div>
  </div>
</div></figure></div>
  </div>
</details>

  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">到班點名與通知</span><span class="feature-code">模組 08</span></summary>
  <div class="subf" id="attendance">
  <div class="sf-top"><h4>到班點名與通知</h4><span class="mcode add">模組 08</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">老師用手機掃 QR 點名，學生到班時家長立刻收到通知；晚到只告訴老師，不讓家長白擔心。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>學生回報晚到只通知老師，到班時才通知家長</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>過了應到時間還沒到，一鍵詢問學生或通知家長</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長可自選要不要收離班通知</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>今日點名看板</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/attendance/today</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i on">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>今日點名</b><span class="tag">11/18（三）</span><span class="seg"><i class="on">國二理化 A・19:00</i><i>國三數學 A</i><i>國一英文 B</i></span><span class="sp"></span><span class="btn ghost">通知規則</span></div>
<div class="att-sum"><div><b>17</b><span>已到</span></div><div class="lt"><b>1</b><span>晚到中</span></div><div class="ab"><b>1</b><span>未到</span></div><div class="lv"><b>1</b><span>請假</span></div><div class="nt"><b>18</b><span>已通知家長到班</span></div><em>現在 19:16</em></div>
<table class="tb attt"><tr><th>學生</th><th>應到時間</th><th>實到時間</th><th>狀態</th><th>家長通知</th><th></th></tr>
<tr><td><b>陳小安</b></td><td>19:00</td><td>18:55</td><td><span class="st ok">已到</span></td><td class="nf on">✓ 到班 18:55</td><td></td></tr>
<tr class="hl-ab"><td><b>林○宇</b></td><td>19:00</td><td class="muted">—</td><td><span class="st bad">未到・超過 16 分鐘</span></td><td class="nf">尚未通知</td><td class="acts"><span class="btn sm ghost">詢問學生</span><span class="btn sm">通知家長</span></td></tr>
<tr><td><b>王小明</b></td><td>19:00 → <b class="eta">19:20</b><small>學生回報晚到・公車誤點</small></td><td class="muted">—</td><td><span class="st warn">晚到中</span></td><td class="nf">到班時通知<small>晚到回報不通知家長</small></td><td class="acts"><span class="btn sm ghost">詢問學生</span></td></tr>
<tr><td><b>黃○恩</b></td><td>19:30<small>固定・學校社團</small></td><td class="muted">—</td><td><span class="st">未到應到時間</span></td><td class="nf">到班時通知</td><td></td></tr>
<tr><td><b>李小華</b></td><td class="muted">—</td><td class="muted">—</td><td><span class="st lv">請假</span></td><td class="nf on">✓ 請假已確認</td><td></td></tr>
</table>
<div class="rule">通知規則：<b>到班時</b>通知家長・學生回報晚到<b>只通知老師</b>・超過應到時間 15 分鐘未到 → 提醒行政 <u>編輯規則</u></div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who student">學生本人・手機</span>學生自己傳訊息說會晚到</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">老師我今天會晚點到，公車一直沒來</div>
<div class="msg b">收到！大概幾點會到呢？</div>
<div class="quick"><span>19:10</span><span class="on">19:20</span><span>19:30</span><span>不確定</span></div>
<div class="msg p">19:20</div>
<div class="msg b">好，已幫你登記國二理化 A 預計 19:20 到，也告訴林老師了。到班掃 QR 後，系統會通知爸爸媽媽。路上小心！</div>
<div class="msg sys">已登記晚到・已通知老師</div></div></div></figure><figure class="shot ph"><figcaption><span class="who teacher">老師・手機</span>老師掃 QR 點名，晚到的學生一眼看到</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>老師點名</b><span>⋯</span></div><div class="ph-body liffbg">
<div class="ap-h">國二理化 A <span>19:00</span></div>
<div class="scan"><div class="scan-box"></div><span>對準學生的點名 QR</span></div>
<div class="ap-li"><b>陳小安</b><i class="ok">已到 18:55</i></div>
<div class="ap-li"><b>王小明</b><i class="lvq">晚到・預計 19:20</i></div>
<div class="ap-li"><b>林○宇</b><i class="no">未到</i></div>
<div class="ap-li"><b>李小華</b><i class="lvq">請假</i></div></div></div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長只在小明到班時收到通知</figcaption><div class="phone"><div class="notch"></div><div class="ph-top lock">19:18</div><div class="ph-body lockbg">
<div class="push"><div class="ps-h"><span class="lg"></span>LINE・示範教育<em>19:18</em></div><b>小明已到班</b><span>國二理化 A・19:18 完成簽到</span></div>
<div class="lock-note">18:41 小明回報會晚到時<br>不會傳給家長，避免白擔心</div></div></div></figure></div>
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">LINE 請假</span><span class="feature-code">模組 09</span></summary>
  <div class="subf" id="leave">
  <div class="sf-top"><h4>LINE 請假</h4><span class="mcode add">模組 09</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">家長或學生在 LINE 說一聲就能請假，請假直接同步到點名。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>學生請假要不要經過家長，後台依補習班習慣設定</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可設定請假截止時間</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>請假後自動轉給補課安排</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>請假列表：確認後直接寫進出缺勤</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/leave</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i on">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
    <div class="main">
<div class="pg-h"><b>請假</b><span class="seg"><i class="on">待確認 2</i><i>本週</i><i>全部</i></span><span class="sp"></span><span class="btn ghost">補登請假</span></div>
<table class="tb"><tr><th>學生</th><th>課程</th><th>請假日期</th><th>原因</th><th>提出者</th><th>狀態</th><th>補課</th></tr>
<tr><td>王小明</td><td>國二理化 A</td><td>11/18（三）</td><td>發燒</td><td>王媽媽</td><td><span class="tag ok">已登記出缺勤</span></td><td><span class="tag">已轉補課安排</span></td></tr>
<tr><td>李小華</td><td>國二理化 A</td><td>11/18（三）</td><td>學校活動</td><td>李爸爸</td><td><span class="tag ok">已登記出缺勤</span></td><td><span class="tag">已轉補課安排</span></td></tr>
<tr><td>張○晴 <span class="idt st">學生自己請假</span></td><td>國二數學 B</td><td>11/21（六）</td><td>身體不舒服</td><td>張○晴</td><td><span class="tag warn">等待家長確認</span></td><td class="muted">—</td></tr>
<tr><td>周○廷</td><td>國一英文 B</td><td>11/20（五）</td><td>家庭因素</td><td>行政補登</td><td><span class="tag warn">超過截止時間</span></td><td class="muted">—</td></tr>
</table>
<div class="lv-set"><div class="pn"><div class="pn-h">學生自己請假時</div>
  <div class="rad on"><i></i><div><b>需要家長確認</b><span>家長按「確認請假」才算請假成功</span></div></div>
  <div class="rad"><i></i><div><b>只通知家長</b><span>直接請假成功，同時傳訊息讓家長知道</span></div></div>
  <div class="rad"><i></i><div><b>不通知家長</b><span>適合高中以上、讓學生自己負責的補習班</span></div></div></div>
  <div class="pn"><div class="pn-h">其他規則</div>
  <div class="kv"><span>請假截止</span><b class="dd">上課前 2 小時 ▾</b></div>
  <div class="kv"><span>家長請假</span><b>直接成功</b></div>
  <div class="kv"><span>請假後</span><b>同步點名・轉補課</b></div></div></div></div>
  </div>
</div></figure><figure class="shot ph"><figcaption><span class="who student">學生本人・手機</span>學生自己請假</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="msg p">我禮拜六數學課要請假，身體不舒服</div>
<div class="msg b">好的，11/21（六）國二數學 B 請假。學生請假需要家長確認，我已經傳給你的家長了，確認後會再告訴你。</div>
<div class="msg sys">已送出・等待家長確認</div>
<div class="msg b">你的家長已確認請假，好好休息！</div></div></div></figure><figure class="shot flowmid"><div class="fm-arr r"><span>學生送出請假</span><i></i></div>
<div class="fm-box"><b>依後台設定：需要家長確認</b><p>平台把請假傳給家長，學生這邊顯示「等待家長確認」。</p><em>可改成「只通知家長」或「不通知家長」</em></div>
<div class="fm-arr l"><i></i><span>家長確認後回覆學生，<br>同步到點名</span></div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長收到確認請求</figcaption><div class="phone"><div class="notch"></div><div class="ph-top"><span class="av">示</span>示範教育</div><div class="ph-body chatbg">
<div class="flex"><div class="fx-h">請假確認</div><div class="fx-b"><b>晴晴想請假</b><p>11/21（六）國二數學 B<br>原因：身體不舒服</p><span>由學生本人提出</span></div><div class="fx-btn">確認請假</div><div class="fx-btn ghost">不同意</div><div class="fx-btn ghost">聯絡補習班</div></div>
<div class="msg p">確認請假</div>
<div class="msg b">已確認，會通知老師。</div></div></div></figure></div>
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">補課安排</span><span class="feature-code">模組 10</span></summary>
  <div class="subf" id="makeup">
  <div class="sf-top"><h4>補課安排</h4><span class="mcode add">模組 10</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">選擇你的補課制度，系統依規則列出補課選項，家長自己選。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>跟班補課、固定補課時段、講義自學、老師另約，依科目設定</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>可補次數、期限、名額都能設定</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>補課出席自動計入點名</span></div></div>
  <div class="shots"><figure class="shot web full"><figcaption><span class="who staff">補習班人員・網頁</span>補課規則：每家補習班選自己的補課方式</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/makeup/policies</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i on">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
</div></figure><figure class="shot ph"><figcaption><span class="who parent">家長・手機</span>家長看到依規則列出的補課選項</figcaption><div class="phone"><div class="notch"></div><div class="ph-top liff"><span>✕</span><b>安排補課</b><span>⋯</span></div><div class="ph-body liffbg bk">
<div class="mk-miss"><div class="mk-x">缺</div><div><b>11/18（三）國二理化 A</b><span>小明已請假・第 3 單元 浮力</span></div></div>
<div class="mk-quota"><span>本期還可補 <b>2</b> 次</span><span>請在 <b>12/2</b> 前完成</span></div>
<div class="bk-lbl">跟其他班補課・同進度</div>
<div class="mk-opt on"><div class="mk-d"><span>週六</span><b>11/22</b></div><div class="mk-i"><b>14:00 國二理化 B</b><span>板橋分校・周老師</span></div><em>剩 2</em></div>
<div class="mk-opt"><div class="mk-d"><span>週二</span><b>11/25</b></div><div class="mk-i"><b>19:00 國二理化 C</b><span>本部・林老師</span></div><em>剩 1</em></div>
<div class="bk-lbl">固定補課時段</div>
<div class="mk-opt"><div class="mk-d"><span>週六</span><b>11/29</b></div><div class="mk-i"><b>14:00 補課教室</b><span>本部 3 樓・助教帶</span></div><em>剩 5</em></div>
<div class="bk-btn">確認補課・11/22（六）14:00</div>
<p class="bk-fine mk-skip">這次不需要補課</p></div></div></figure></div>
  </div>
</details>

  </details>
</section><section class="pillar c6" id="manage">
  <details class="chapter-detail" open>
  <summary class="chapter-summary"><h2 class="pl-eb"><span class="chapter-number">六</span><span class="chapter-label">續班與經營管理<em class="add">附加模組</em></span></h2><span class="chapter-action" aria-hidden="true"></span></summary>
  <div class="pl-banner">
    <div class="pl-t"><h3>留住學生，掌握每一間分校</h3><p>續班提醒自動發送、家長一鍵回覆；有流失徵兆的學生提早提醒班導。</p></div>
    <figure class="scene chapter-scene">
      <img src="/platform-scenes/school-management.webp" alt="補習班人員一起核對下期班表與學生追蹤事項" width="960" height="540" loading="lazy" decoding="async">
      <figcaption>續班與班務討論情境示意</figcaption>
    </figure>
  </div>
  <div class="ba2"><div class="b"><i>以前</i>學生不來了才發現；各分校資料各自存，總部看不到全貌</div><div class="arr" aria-hidden="true">→</div><div class="a"><i>用了平台</i>提早發現、及時關心；一套系統管所有分校</div></div>
  <details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">續班與繳費提醒</span><span class="feature-code">模組 11</span></summary>
  <div class="subf" id="renewal">
  <div class="sf-top"><h4>續班與繳費提醒</h4><span class="mcode add">模組 11</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">依名單與日期自動提醒，家長一鍵回覆，行政看得到誰還沒回。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>未回覆自動再提醒一次</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>家長說「再考慮」時，AI 問原因並整理給班導</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>繳費狀態由行政標記，不經手金流</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>續班提醒追蹤</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/reminders/winter-renew</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i on">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">流失預警</span><span class="feature-code">模組 12</span></summary>
  <div class="subf" id="retention">
  <div class="sf-top"><h4>流失預警</h4><span class="mcode add">模組 12</span><span class="mkind add">附加模組</span></div>
  <p class="sf-desc">從缺課、作業、成績與家長詢問中，找出可能不續班的學生。</p>
  <div class="tiles"><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>列出原因並依風險排序</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>指派班導並附上關心訊息草稿</span></div><div class="tile"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/><path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg><span>追蹤關心結果</span></div></div>
  <div class="shots"><figure class="shot web"><figcaption><span class="who staff">補習班人員・網頁</span>需要關心的學生</figcaption><div class="browser">
  <div class="bz-top"><i></i><i></i><i></i><span class="url">app.補教平台.tw/risk</span></div>
  <div class="app">
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i on">流失預警</div><div class="sb-i">報表</div><div class="sb-i">設定</div></div>
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
  </div>
</details>
<details class="feature-detail" open>
  <summary class="feature-summary"><span class="feature-name">多分校管理</span><span class="feature-code">模組 13</span></summary>
  <div class="subf" id="branches">
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
    <div class="sb"><div class="sb-brand">補教平台</div><div class="sb-org">示範教育・本部</div><div class="sb-i">收件匣</div><div class="sb-i">知識庫</div><div class="sb-i">招生</div><div class="sb-i">學生</div><div class="sb-i">班級</div><div class="sb-i">點名</div><div class="sb-i">請假</div><div class="sb-i">補課</div><div class="sb-i">作業成績</div><div class="sb-i">公告</div><div class="sb-i">學習報告</div><div class="sb-i">提醒</div><div class="sb-i">流失預警</div><div class="sb-i">報表</div><div class="sb-i on">設定</div></div>
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
</details>

  </details>
</section>

<section class="sec info-panel c1" id="security">
  <div class="info-head">
    <span class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s7-3 7-10V5l-7-3-7 3v7c0 7 7 10 7 10Z"/><path d="m9 12 2 2 4-4"/></svg></span>
    <div><h2>資料安全與個資</h2><p class="sec-p">保護補習班管理的學生成績、家庭與聯絡資料。</p></div>
  </div>
  <div class="sec6">
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 18a4.5 4.5 0 0 1-.7-9A5.7 5.7 0 0 1 17 8a5 5 0 0 1-.3 10H7Z"/><path d="m10 13 1.5 1.5L14 12"/></svg></span><h3>資料存放在台灣</h3><p>Google Cloud 台灣區域，全程加密</p></div>
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="10" r="4"/><path d="m11 13 8 8m-3-3 2-2m-4 0 2-2"/></svg></span><h3>分校、角色分權</h3><p>每個人只看到該看的資料</p></div>
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 9h6m-6 4h6m-6 4h3"/></svg></span><h3>查看都有紀錄</h3><p>誰看過、匯出過，隨時可查</p></div>
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 4v3"/></svg></span><h3>AI 只拿必要資料</h3><p>姓名、電話先換成代號</p></div>
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></svg></span><h3>人員確認才送出</h3><p>跟進、回饋、報告都由人員把關</p></div>
    <div class="scard"><span class="si"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="5" width="12" height="16" rx="2"/><path d="M9 5V3h6v2M9 10h6m-6 4h6"/></svg></span><h3>符合補習班個資規範</h3><p>提供個資維護計畫的文件範本</p></div>
  </div>
  <p class="fine">資料屬於補習班所有，可隨時匯出；合約結束時提供完整匯出並依約定刪除。</p>
</section>

<section class="sec info-panel c2" id="onboarding">
  <div class="info-head">
    <span class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6h10a3 3 0 0 1 0 6H7a3 3 0 0 0 0 6h10"/></svg></span>
    <div><h2>導入流程</h2><p class="sec-p">我們協助搬移舊系統資料，你的人員只需要確認，無須重新建檔。</p></div>
  </div>
  <div class="tline">
    <div class="tl3"><span>1</span><h3>了解需求</h3><p>確認分校、班級與招生方式</p></div>
    <div class="tl3"><span>2</span><h3>資料轉移與開通</h3><p>從政龍等現有系統搬移學生、家長、班級與成績資料，並接上現有 LINE</p></div>
    <div class="tl3"><span>3</span><h3>核對與試用</h3><p>逐筆核對轉移資料、逐題測試 AI 回答，確認才開放</p></div>
    <div class="tl3"><span>4</span><h3>正式上線</h3><p>前兩個月每週檢視與調整</p></div>
  </div>
  <p class="fine">支援從政龍等補教系統、Excel 或紙本照片匯入。轉換期間可新舊系統並行，確認資料無誤後再正式切換。</p>
</section>

<section class="sec info-panel c5" id="pricing">
  <div class="info-head">
    <span class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18l-3.5-2-3.5 2-3.5-2L5 21V3Z"/><path d="M8 8h8m-8 4h8m-8 4h4"/></svg></span>
    <div><h2>方案與費用</h2><p class="sec-p">依分校數與開通的模組報價。</p></div>
  </div>
  <div class="price3">
    <div class="pcard"><h3>導入服務</h3><span class="pt">一次性</span><ul><li>LINE 官方帳號開通與設定</li><li>舊系統資料轉移（政龍等現有系統、Excel）</li><li>課程與方案資料建置</li><li>人員教育訓練</li></ul></div>
    <div class="pcard main"><h3>平台月費</h3><span class="pt">基本模組＋開通的附加模組，依分校數計算</span><ul><li>後台帳號不限人數</li><li>AI 使用費已包含</li><li>功能持續更新，不另外收費</li></ul></div>
    <div class="pcard"><h3>LINE 訊息費用</h3><span class="pt">直接支付給 LINE</span><ul><li>回覆家長提問的訊息不計費</li><li>到班通知、提醒等主動訊息依 LINE 方案計算</li><li>平台清楚列出用量與預估費用</li></ul></div>
  </div>
  <div class="cta-band"><p>想知道你的補習班適合哪些模組、大約多少費用？跟我們說說你的需求，我們依分校數與需求提供報價。</p><a class="btn-p" href="#contact" data-contact="pricing">預約了解</a></div>
</section>

<section class="sec info-panel c3" id="faq">
  <div class="info-head">
    <span class="info-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.7-3.4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M10 9a2.5 2.5 0 1 1 3.8 2.1c-1 .6-1.3.9-1.3 1.9m0 3h.01"/></svg></span>
    <div><h2>常見問題</h2></div>
  </div>
  <div class="faq">
    <div class="faq-group">
      <h3>日常使用與資安</h3>
      <details class="qa" open><summary>需要換掉現在的 LINE 官方帳號嗎？</summary><p>不用。平台直接接上你現有的官方帳號，家長不需要重新加好友。如果帳號已經接了其他機器人，我們會協助搬移或一起運作。</p></details>
      <details class="qa" open><summary>家長、學生、老師需要下載 App 嗎？</summary><p>不需要。家長與學生在 LINE 裡完成所有操作；老師用手機打開 LINE 裡的頁面就能點名與回饋；補習班人員使用網頁後台。</p></details>
      <details class="qa" open><summary>AI 答錯怎麼辦？</summary><p>AI 只依你核准的課程資料與方案資料回答，價格、優惠、名額都只能引用你設定的內容。查不到依據、或涉及退費與孩子個別狀況的問題，一律交給人員。跟進訊息、試聽回饋、月報都由人員確認後才送出。</p></details>
      <details class="qa" open><summary>資料放在哪裡？安全嗎？</summary><p>資料存放於 Google Cloud 台灣區域，依角色與分校控管權限，查看與匯出都有紀錄。詳見「資料安全與個資」。</p></details>
    </div>
    <div class="faq-group">
      <h3>導入與費用</h3>
      <details class="qa" open><summary>我們現在用政龍或其他系統，換過來會很麻煩嗎？</summary><p>不會。學生、家長、班級與成績等資料，我們協助從政龍等現有補教系統、Excel 或照片完整轉移，不用重新建檔。轉換期間可以新舊並行，確認無誤再正式切換。</p></details>
      <details class="qa" open><summary>導入需要多久？我們要花多少人力？</summary><p>開通、舊系統資料轉移與教育訓練由我們協助完成，你的人員主要負責確認課程與方案資料。實際時程依分校數與資料準備情況而定，我們會在展示時一起規劃。</p></details>
      <details class="qa" open><summary>一定要全部功能都買嗎？</summary><p>不用。AI 客服是基本模組，其他都是附加模組，可依需要逐步加入。部分模組需先建立學生檔案，或搭配其他模組才能使用。</p></details>
      <details class="qa" open><summary>費用怎麼算？AI 要另外付錢嗎？</summary><p>依分校數與開通的模組報價，AI 使用費已包含在月費內。LINE 官方帳號的訊息費用由補習班直接支付給 LINE，平台會清楚列出用量。</p></details>
    </div>
  </div>
</section>

<section class="sec contact" id="contact">
  <div class="sec-h"><h2>聊聊你的補習班怎麼導入</h2>
  <p class="sec-p">我們可以約時間了解你目前的招生和教務流程，一起討論適合的做法。</p></div>
  <div class="ct-band"><a class="btn-p" href="#contact" data-contact="contact-section">預約了解</a></div>
  <p class="fine">頁面中的情境圖片、補習班名稱、人名、成績與數字均為示意。</p>
</section>

  </main>
</div>
<script>
(function(){
  var copy=document.getElementById('desktop-copy'),status=document.getElementById('desktop-copy-status');
  copy.addEventListener('click',async function(){
    try{
      await navigator.clipboard.writeText(location.href);
      status.textContent='已複製網址';
    }catch(e){
      status.textContent='請長按網址複製：'+location.href;
    }
    if(window.posthog&&posthog.capture)posthog.capture('web_platform_copy_link');
  });
  var layout=document.getElementById('layout'),btn=document.getElementById('navToggle'),scrim=document.getElementById('scrim');
  var mq=window.matchMedia('(max-width: 900px)');
  function setOpen(open){
    if(mq.matches){layout.classList.toggle('drawer-open',open);}
    else{layout.classList.toggle('collapsed',!open);}
    btn.setAttribute('aria-expanded',open?'true':'false');
  }
  function isOpen(){return mq.matches?layout.classList.contains('drawer-open'):!layout.classList.contains('collapsed');}
  if(mq.matches)btn.setAttribute('aria-expanded','false');
  btn.addEventListener('click',function(){setOpen(!isOpen());});
  scrim.addEventListener('click',function(){setOpen(false);});
  document.querySelectorAll('.sb-nav a').forEach(function(a){a.addEventListener('click',function(){if(mq.matches)setOpen(false);});});
  document.querySelectorAll('.ng-t').forEach(function(b){b.addEventListener('click',function(){
    var ex=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',ex?'false':'true');
    document.getElementById(b.getAttribute('aria-controls')).hidden=ex;});});
  var links={};document.querySelectorAll('.sb-nav a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a;});
  function openLinkedSection(hash){
    var id=hash.slice(1), target=document.getElementById(id);
    var pillar=target && target.closest('.pillar');
    if(!pillar) return;
    var chapter=pillar.querySelector('.chapter-detail');
    var detail=target.closest('.feature-detail');
    var wasHidden=!chapter.open || (detail && !detail.open);
    chapter.open=true;
    if(detail) detail.open=true;
    var link=links[id], list=link && link.closest('.ng-l');
    if(list && list.hidden){
      list.hidden=false;
      list.parentElement.querySelector('.ng-t').setAttribute('aria-expanded','true');
    }
    if(wasHidden) return target;
  }
  // Reveal the chapter and example before fragment navigation, including clicks on the same hash.
  document.addEventListener('click',function(e){
    if(e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
    var link=e.target.closest('a[href^="#"]');
    if(link) openLinkedSection(link.hash);
  });
  openLinkedSection(location.hash);
  window.addEventListener('hashchange',function(){
    var target=openLinkedSection(location.hash);
    if(target) target.scrollIntoView();
  });
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
