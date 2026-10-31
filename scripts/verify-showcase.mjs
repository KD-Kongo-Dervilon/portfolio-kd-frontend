/**
 * D. Mk — public frontend evidence verification
 * Node 22+, no npm dependencies, no accounts or secrets required.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const load = name => readFileSync(resolve(root, name), 'utf8');
const manifest = JSON.parse(load('showcase/manifest.json'));
const live = process.argv.includes('--live');
let passed = 0;
const ok = (cond, message) => { assert.ok(cond, message); console.log('✓ ' + message); passed++; };

function verifyLocal() {
  ok(manifest.sourceFiles.length === 7, 'seven documented client source files');
  const sensitive = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
    /sk-proj-[a-z0-9_-]{12,}/i,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]\s*["'][^"']{8,}/i,
    /CLOUDFLARE_AI_API_TOKEN\s*[:=]\s*["'][^"']{8,}/i
  ];
  for (const entry of manifest.sourceFiles) {
    ok(existsSync(resolve(root,entry.path)), 'snapshot exists: ' + entry.path);
    const source = load(entry.path);
    ok(source.length > 100, 'snapshot is non-empty: ' + entry.path);
    ok(!sensitive.some(pattern => pattern.test(source)), 'no obvious server credential in ' + entry.path);
    if (entry.path.endsWith('.js')) {
      const syntax = spawnSync(process.execPath,['--check',resolve(root,entry.path)],{encoding:'utf8'});
      ok(syntax.status === 0,'JavaScript syntax: '+entry.path);
    }
  }

  const script = load('showcase/workflow-architect/workflow-architect-ai.js');
  const cut = script.indexOf("$('generate').addEventListener");
  ok(cut > 0, 'Workflow Architect compiler available');
  // Loaded code is our versioned, reviewed frontend snapshot, not user input.
  const getCompilers = new Function(script.slice(0,cut) + '\nreturn {compileN8n,compileMake,normalizePlan};');
  const {compileN8n,compileMake,normalizePlan} = getCompilers();

  const normal = normalizePlan({
    title:'Recette locale',platform:'n8n',trigger:'webhook',
    steps:[
      {kind:'validate',title:'Contrôler la demande',config:{requiredFields:['email']}},
      {kind:'respond',title:'Clore le traitement',config:{}}
    ]
  });
  const n8n = compileN8n(normal).file;
  const names = new Set(n8n.nodes.map(n => n.name));
  ok(n8n.active === false, 'n8n export is disabled by default');
  ok(n8n.nodes.length === 4, 'n8n has trigger, input validation and 2 business nodes');
  ok(names.size === n8n.nodes.length,'n8n node names are unique');
  const edges=Object.values(n8n.connections).flatMap(c=>c.main).flat();
  ok(edges.length === n8n.nodes.length-1 && edges.every(c=>names.has(c.node)), 'n8n links reference existing nodes');
  ok(JSON.parse(JSON.stringify(n8n)).nodes.length === 4,'n8n JSON serializes');

  for (const kind of ['validate','transform','filter','approval']) {
    let refused = false;
    try{compileMake({title:'Cas test',trigger:'webhook',steps:[{kind,title:'Étape sensible',config:{}}]});}
    catch(e){refused=/non fiable/.test(String(e.message));}
    ok(refused, 'Make refuses unsupported operation: '+kind);
  }
  let scheduleRefused=false;
  try{compileMake({title:'Planification',trigger:'schedule',steps:[{kind:'http',title:'Appel',config:{url:'https://example.org/api'}}]});}
  catch(e){scheduleRefused=/non fiable/.test(String(e.message));}
  ok(scheduleRefused,'Make refuses unsupported scheduling');
  const make = compileMake({title:'Cas simple',trigger:'webhook',steps:[
    {kind:'http',title:'Appel HTTPS',config:{url:'https://example.org/api',method:'POST'}},
    {kind:'respond',title:'Fin',config:{}}
  ]}).file;
  ok(Array.isArray(make.flow) && make.flow.length === 4,'Make exports a simple structural blueprint');
  ok(new Set(make.flow.map(m=>m.id)).size === make.flow.length,'Make blueprint IDs are unique');
  ok(JSON.parse(JSON.stringify(make)).flow.length === 4,'Make blueprint serializes');
  ok(script.includes("const API='/api/generate'"),'AI API uses a same-origin server endpoint');

  const portfolioScript=load('showcase/portfolio/project-ops.js');
  ok(portfolioScript.includes('Sept projets, sept preuves à consulter'),'Portfolio includes a seven-project evidence catalogue');
  ok(portfolioScript.includes("secondary.closest('.recruiter-other-projects')?.remove()"),'No separate secondary project section remains');
  ok(portfolioScript.includes("const names=['HelpDesk Flow','PRISME','BudgetFlow','OPS COMMAND Studio','Workflow Architect','HitDNA','D.k Academy']"),'Seven distinct projects share one planned order');
  ok(portfolioScript.includes("const ordered=names.map("),'Project reorder is idempotent, avoiding DOM mutation loops');
  ok(portfolioScript.includes("updateDocumentation(root)"),'Current documentation is integrated into the rendered portfolio');

  ok(portfolioScript.includes("function nativeDocGroup("),'Documentation uses native case-study cards');
  ok(portfolioScript.includes("titleMatches=!!query&&title.includes(query)"),'Document search supports project names');
  ok(!portfolioScript.includes("section.className='doc-category dmk-current-docs'"),'Separate 2026 update box removed');
  const docMarker='const projectDocumentation=';
  const docStart=portfolioScript.indexOf(docMarker)+docMarker.length;
  const docEnd=portfolioScript.indexOf(';\\nconst projectDocGroups=',docStart);
  ok(docStart>docMarker.length&&docEnd>docStart,'Embedded project documents can be inspected');
  const liveDocuments=JSON.parse(portfolioScript.slice(docStart,docEnd));
  ok(Object.keys(liveDocuments).length===33,'Three project documentation sets, 11 files each');
  for(const [path,content] of Object.entries(liveDocuments)){
    ok(load('docs/catalogue/'+path).trimEnd()===content.trimEnd(),'GitHub document matches Vercel source: '+path);
  }

  for(const textPath of ['README.md','docs/ARCHITECTURE.md','docs/QUALITE-ET-TESTS.md','docs/SECURITE-ET-CONFIDENTIALITE.md']){
    const content=load(textPath);
    ok(content.length>500,'documented: '+textPath);
  }
}

async function verifyLive(){
  for (const entry of manifest.sourceFiles.filter(x=>x.compareLive)) {
    const response=await fetch(entry.url,{signal:AbortSignal.timeout(20000),headers:{'Accept':'text/plain, */*'}});
    ok(response.ok,'production HTTP '+response.status+': '+entry.url);
    const publicText=await response.text();
    // Ignore a terminal newline added by some source transports, not source changes.
    ok(publicText.trimEnd() === load(entry.path).trimEnd(),'no drift: '+entry.path);
  }
  const response=await fetch('https://workflow-architect-flax.vercel.app/api/generate',{signal:AbortSignal.timeout(15000)});
  ok(response.ok,'AI status endpoint reachable');
  const status=await response.json();
  ok(status.provider === 'Cloudflare Workers AI' && status.available === true,'AI provider is Cloudflare (status only; not a generation test)');
}

try {
  verifyLocal();
  if(live) await verifyLive();
  console.log('\n' + passed + ' checks passed.' + (live ? ' Public-source drift checked.' : ' Run --live to compare deployed assets.'));
} catch (e) {
  console.error('✗ Evidence verification failed:',e.message);
  process.exitCode=1;
}
