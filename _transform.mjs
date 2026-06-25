import fs from 'fs'
const FILE='./data/articles.json'
const data=JSON.parse(fs.readFileSync(FILE,'utf8'))
const isList=(l)=>/^(\d+\.|-)\s/.test(l)

function transform(text){
  if(!text || !text.includes('**')) return text
  const lines=text.split('\n')
  const out=[]
  for(let line of lines){
    let m=line.match(/^\*\*\s*(\d+)[\.\、]\s*([^：:*]+?)\s*[：:]([^*]*)\*\*\s*(.*)$/)
    if(m){ const inside=(m[3]||'').trim(),rest=(m[4]||'').trim()
      out.push(`${m[1]}. **${m[2].trim()}**：${[inside,rest].filter(Boolean).join('')}`); continue }
    m=line.match(/^\*\*\s*[-•*]\s*([^：:*]+?)\s*[：:]([^*]*)\*\*\s*(.*)$/)
    if(m){ const inside=(m[2]||'').trim(),rest=(m[3]||'').trim()
      out.push(`- **${m[1].trim()}**：${[inside,rest].filter(Boolean).join('')}`); continue }
    m=line.match(/^\*\*([^*]*(?:立即下載|現在就下載|馬上下載|現在就立即下載)[^*]*Dogtor[^*]*|[^*]*Dogtor[^*]*(?:立即下載|現在就下載|馬上下載)[^*]*)\*\*$/)
    if(m){ out.push(m[1].trim()); continue }
    out.push(line)
  }
  // Deterministic re-join
  let res=''
  for(let i=0;i<out.length;i++){
    if(i>0){
      const p=out[i-1],c=out[i],pl=isList(p),cl=isList(c)
      if(pl&&cl) res+='\n'
      else if(pl!==cl) res+='\n\n'
      else res+='\n'
    }
    res+=out[i]
  }
  res=res.replace(/\n{3,}/g,'\n\n').trim()
  return res
}

let changed=0
const write = process.argv.includes('--write')
for(const art of data.articles){
  const apply=(s)=>{ const t=transform(s); if(t!==s)changed++; return t }
  if(art.content?.intro) art.content.intro=apply(art.content.intro)
  ;(art.content?.sections||[]).forEach(sec=>{ sec.body=apply(sec.body) })
  ;(art.faq||[]).forEach(f=>{ f.answer=apply(f.answer) })
}
console.log('Changed fields:', changed)
// show one tricky article fully
const t=data.articles.find(x=>x.slug==='xue-ce-dao-shu-yi-ge-yue-ya-li-shi-mian')
console.log('\n=== sample sec1 ===\n'+t.content.sections[1].body)
const t2=data.articles.find(x=>x.slug==='guo-zhong-sheng-zhuan-zhu-li-bu-gou-fan-qie-zhong-shi-ce')
console.log('\n=== sample (bullet list) sec0 ===\n'+t2.content.sections[0].body)
if(write){ fs.writeFileSync(FILE, JSON.stringify(data,null,2)+'\n'); console.log('\nWRITTEN') }
