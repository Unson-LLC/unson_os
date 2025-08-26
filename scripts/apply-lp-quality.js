#!/usr/bin/env node
// Applies LP quality checklist changes to LP folders.
// Usage: node scripts/apply-lp-quality.js [lpRoot ...]
// If no args, auto-discovers: products/**/lp
const fs = require('fs');
const path = require('path');

function read(p){ try { return fs.readFileSync(p,'utf8') } catch(e){ return null } }
function write(p, s){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,s); }
function exists(p){ return fs.existsSync(p) }
function jsonMergeConfig(cfgPath){
  const raw = read(cfgPath); if(!raw) return {changed:false}
  let data; try { data = JSON.parse(raw) } catch(e){ console.error('JSON parse failed:', cfgPath, e.message); return {changed:false} }
  let changed=false;
  // hero.quickPoints
  if(!data.content?.hero?.quickPoints){
    data.content.hero.quickPoints = [
      'Z世代×管理職の認識ギャップをAIで可視化',
      '会議・1on1・評価の「すれ違い」を具体的に改善',
      '先行登録でベータ公開を最優先でご案内'
    ];
    changed=true;
  }
  // faq
  if(!data.content.faq){
    data.content.faq = {
      title: 'よくある質問',
      subtitle: '導入前によくいただくご質問にお答えします',
      items: [
        { question: 'ベータ先行案内に登録すると何が届きますか？', answer: '公開前に優先案内と招待リンク、導入の流れをお送りします。' },
        { question: '個人情報の取り扱いは？', answer: '案内の送付にのみ使用し、第三者提供はしません。' },
        { question: 'どのような組織に向いていますか？', answer: '世代間のコミュニケーション課題を感じている管理職・人事の方におすすめです。' },
      ]
    };
    changed=true;
  }
  if(changed){ write(cfgPath, JSON.stringify(data,null,2)); }
  return {changed}
}

function patchFile(p, replacers){
  let s = read(p); if(s==null) return {changed:false}
  let before = s;
  replacers.forEach(r=>{ s = s.replace(r.from, r.to) })
  if(s!==before){ write(p,s); return {changed:true} }
  return {changed:false}
}

function ensureFaqComponent(lp){
  const p = path.join(lp,'src/components/sections/FaqSection.tsx');
  if(exists(p)) return {created:false}
  const content = `import React from 'react'\n\ninterface FaqItem { question: string; answer: string }\n\ninterface FaqSectionProps {\n  config: { title?: string; subtitle?: string; items: FaqItem[] }\n}\n\nexport default function FaqSection({ config }: FaqSectionProps) {\n  return (\n    <section className=\"section-padding bg-white\">\n      <div className=\"container-width\">\n        <div className=\"text-center mb-10\">\n          <h2 className=\"text-3xl sm:text-4xl font-bold mb-4\">{config.title || 'よくある質問'}</h2>\n          {config.subtitle && (<p className=\"text-gray-600 max-w-2xl mx-auto\">{config.subtitle}</p>)}\n        </div>\n        <div className=\"max-w-3xl mx-auto divide-y divide-gray-200\">\n          {config.items.map((item, idx) => (\n            <div key={idx} className=\"py-5\">\n              <h3 className=\"text-lg font-semibold mb-2\">{item.question}</h3>\n              <p className=\"text-gray-700 leading-relaxed\">{item.answer}</p>\n            </div>\n          ))}\n        </div>\n      </div>\n    </section>\n  )\n}\n`;
  write(p, content); return {created:true}
}

function addServiceAnchor(lp){
  const p = path.join(lp,'src/components/sections/ServiceSection.tsx');
  if(!exists(p)) return {changed:false}
  const s = read(p);
  if(s.includes('id="service"')) return {changed:false}
  const out = s.replace(/<section\s+className=\"section-padding/g, '<section id=\"service\" className=\"section-padding');
  if(out!==s){ write(p,out); return {changed:true} }
  return {changed:false}
}

function ensureVercelHeaders(lp){
  const p = path.join(lp,'vercel.json');
  const raw = read(p); if(!raw) return {changed:false}
  try{
    const data = JSON.parse(raw);
    if(!data.headers){
      data.headers=[{source:'/(.*)', headers:[
        {key:'X-Frame-Options', value:'SAMEORIGIN'},
        {key:'Referrer-Policy', value:'strict-origin-when-cross-origin'},
        {key:'X-Content-Type-Options', value:'nosniff'}
      ]}];
      write(p, JSON.stringify(data,null,2));
      return {changed:true}
    }
  }catch(e){ console.error('vercel.json parse failed', p) }
  return {changed:false}
}

function patchFormSection(lp){
  const p = path.join(lp,'src/components/sections/FormSection.tsx');
  if(!exists(p)) return {changed:false}
  let s = read(p);
  let changed=false;
  // compact prop
  if(!s.includes('compact?: boolean')){
    s = s.replace(/interface FormSectionProps \{([\s\S]*?)\}/, (m)=> m.replace(/\}$/, '  compact?: boolean\n}'));
    s = s.replace(/export default function FormSection\((\{[^}]*\})\)/, (m,args)=> m.replace(args, '{ config, onSubmit, compact = false }'));
    s = s.replace(/<section className=\"section-padding bg-gray-50\">/, '<Wrapper {...wrapperProps}>');
    s = s.replace(/<div className=\"container-width\">/, '<div className={compact ? \"\" : \"container-width\"} >');
    s = s.replace(/return \(/, 'const Wrapper = compact ? ("div" as any) : ("section" as any);\n  const wrapperProps = compact ? { className: "" } : { className: "section-padding bg-gray-50" };\n  return (');
    s = s.replace(/<\/section>\s*$/, '</Wrapper>\n  )\n}\n');
    changed=true;
  }
  // header card
  if(!s.includes('bg-white/95')){
    s = s.replace(/<div className=\"text-center mb-8\">[\s\S]*?<\/div>/,
      '<div className="text-center mb-6 bg-white/95 backdrop-blur rounded-xl p-5 shadow">\n            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">\n              {config.title}\n            </h2>\n            {config.subtitle && (\n              <p className="text-base sm:text-lg text-gray-700">\n                {config.subtitle}\n              </p>\n            )}\n          </div>');
    changed=true;
  }
  // replace select with button group
  if(s.includes('<select')){
    s = s.replace(/<select[\s\S]*?<\/select>/g,
      '<div role="radiogroup" aria-labelledby={`${field.name}-label`}>\n                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">\n                          {field.options.map((option, optIndex) => {\n                            const selected = (formData[field.name] || \'\') === option\n                            return (\n                              <button\n                                key={optIndex}\n                                type="button"\n                                role="radio"\n                                aria-checked={selected}\n                                onClick={() => handleChange(field.name, option)}\n                                className={cn(\n                                  \'text-left px-4 py-3 rounded-lg border\',\n                                  selected ? \'bg-primary text-white border-primary\' : \'bg-white text-gray-900 border-gray-300 hover:bg-gray-50\'\n                                )}\n                              >\n                                {option}\n                              </button>\n                            )\n                          })}\n                        </div>\n                      </div>');
    changed=true;
  }
  if(changed) write(p,s);
  return {changed}
}

function patchHero(lp){
  const p = path.join(lp,'src/components/sections/HeroSection.tsx');
  let s = read(p); if(!s) return {changed:false}
  if(s.includes('formConfig') && s.includes('hero-survey')) return {changed:false}
  // rough replace using ai-bridge improved version template
  const template = read(path.join(__dirname,'../templates/HeroSection.template.tsx'));
  if(!template) return {changed:false}
  write(p, template);
  return {changed:true}
}
function patchFinalCta(lp){
  const p = path.join(lp,'src/components/sections/FinalCtaSection.tsx');
  if(!exists(p)) return {changed:false}
  let s = read(p);
  if(s.includes('FormSection') && s.includes('formConfig')) return {changed:false}
  const template = read(path.join(__dirname,'../templates/FinalCtaSection.template.tsx'));
  if(!template) return {changed:false}
  write(p, template); return {changed:true}
}
function patchTemplateWiring(lp){
  const p = path.join(lp,'src/components/templates/LandingPageTemplate.tsx');
  if(!exists(p)) return {changed:false}
  let s = read(p);
  if(s.includes('prefill') && s.includes('formConfig')) return {changed:false}
  const template = read(path.join(__dirname,'../templates/LandingPageTemplate.template.tsx'));
  if(!template) return {changed:false}
  write(p, template); return {changed:true}
}

function patchPageHead(lp){
  const p = path.join(lp,'src/app/page.tsx');
  let s = read(p); if(!s) return {changed:false}
  if(s.includes('<Head>') && s.includes('PostHogProvider')) return {changed:false}
  const template = read(path.join(__dirname,'../templates/page.template.tsx'));
  if(!template) return {changed:false}
  write(p, template); return {changed:true}
}

function main(){
  const args = process.argv.slice(2);
  let targets = args.length? args : [];
  if(!targets.length){
    // discover lp folders
    const walk = (dir)=>{
      let out=[]; for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
        const p = path.join(dir, entry.name);
        if(entry.isDirectory()){
          if(entry.name==='lp') out.push(p);
          else out = out.concat(walk(p));
        }
      } return out;
    }
    targets = walk(path.join(process.cwd(),'products'));
  }
  for(const lp of targets){
    console.log('\n==>', lp);
    ensureFaqComponent(lp);
    addServiceAnchor(lp);
    ensureVercelHeaders(lp);
    patchFormSection(lp);
    patchHero(lp);
    patchFinalCta(lp);
    patchTemplateWiring(lp);
    patchPageHead(lp);
    const cfg = path.join(lp,'configs/config.json');
    if(exists(cfg)) jsonMergeConfig(cfg);
  }
}

main();
