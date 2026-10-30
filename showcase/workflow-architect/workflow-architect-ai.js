'use strict';
const $ = id => document.getElementById(id);
let output=null, guideText='', filename='', plan=null, busy=false;
const API='/api/generate';
function safe(s,max=140){return String(s??'').slice(0,max)}
function asArray(v){return Array.isArray(v)?v:[]}
function node(name,type,id,parameters,pos,typeVersion=1){return{id:String(id),name,type,typeVersion,position:[260+pos*270,300],parameters}}
function codeNode(title,id,script,pos){return node(title,'n8n-nodes-base.code',id,{mode:'runOnceForAllItems',jsCode:script},pos,2)}
function normalizePlan(p){
 if(!p||!Array.isArray(p.steps)||p.steps.length<1||p.steps.length>12)throw Error('Plan incomplet : nombre d’étapes incorrect.');
 const kinds=new Set(['validate','transform','filter','http','gmail','sheets','approval','respond']);
 if(p.steps.some(s=>!kinds.has(s.kind)))throw Error('Type de module non compatible : demande à reformuler.');
 return p;
}
function compileN8n(p){
 let arr=[], con={}, id=1;
 const add=n=>{if(arr.length){let prev=arr[arr.length-1];con[prev.name]={main:[[{node:n.name,type:'main',index:0}]]}}arr.push(n)};
 let slug='wa-'+Date.now().toString(36);
 if(p.trigger==='schedule')add(node('Déclencheur planifié','n8n-nodes-base.scheduleTrigger',id++,{rule:{interval:[{field:'days',triggerAtHour:9}]}},arr.length));
 else add(node('Entrée métier HTTP','n8n-nodes-base.webhook',id++,{httpMethod:'POST',path:slug,responseMode:'onReceived',options:{}},arr.length,2));
 add(codeNode('Contrôler la charge entrante',id++,`return $input.all().map(i=>{const d=i.json.body??i.json;if(typeof d!=='object'||d===null)throw Error('Entrée JSON attendue');if(JSON.stringify(d).length>50000)throw Error('Charge trop volumineuse');return {json:{...d,_workflow_receivedAt:new Date().toISOString()}};});`,arr.length));
 const guides=[],warnings=[];
 for(const [i,step] of p.steps.entries()){
  const title=(i+1)+' · '+safe(step.title,80);
  const config=step.config||{};
  if(step.kind==='validate'){
   const fields=asArray(config.requiredFields).filter(x=>typeof x==='string').slice(0,20);const serialized=JSON.stringify(fields);
   add(codeNode(title,id++,`const required=${serialized};return $input.all().map(i=>{for(const key of required){if(i.json[key]===undefined||i.json[key]===null||i.json[key]==='')throw new Error('Champ requis: '+key)}return i;});`,arr.length));
  }else if(step.kind==='transform'){
   add(codeNode(title,id++,`return $input.all().map(i=>({json:{...i.json,_workflow_stage:${JSON.stringify(safe(step.title,100))},_processedAt:new Date().toISOString()}}));`,arr.length));
  }else if(step.kind==='filter'){
   const fld=safe(config.field||'status',80);const val=safe(config.value||'',150);
   // Filter node: nonmatching items do not reach subsequent modules; no false branch exposed.
   add(node(title,'n8n-nodes-base.filter',id++,{conditions:{options:{caseSensitive:false,leftValue:'',typeValidation:'loose',version:2},combinator:'and',conditions:[{id:'wa-condition-'+i,leftValue:`={{$json[${JSON.stringify(fld)}]}}`,rightValue:val,operator:{type:'string',operation:'equals'}}]},options:{}},arr.length,2));
   warnings.push('Filtre '+(i+1)+' : comparaison égalité (« '+fld+' »). Vérifie l’opérateur et la valeur après import.');
  }else if(step.kind==='http'){
   const v=safe(config.url,500);const validUrl=/^https:\/\/[a-z0-9.-]+\//i.test(v)&&!v.includes('CONFIGURER')&&!v.includes('<<');
   const url=validUrl?v:'https://CONFIGURER_VOTRE_ENDPOINT.example.com/v1/action';
   if(!validUrl)guides.push('Étape « '+title+' » : remplacer l’URL de destination dans le nœud HTTP et ajouter l’authentification requise.');
   add(node(title,'n8n-nodes-base.httpRequest',id++,{method:['GET','POST','PUT','PATCH','DELETE'].includes(String(config.method).toUpperCase())?String(config.method).toUpperCase():'POST',url,sendBody:true,specifyBody:'json',jsonBody:'={{ JSON.stringify($json) }}',options:{timeout:20000}},arr.length,4.2));
  }else if(step.kind==='gmail'){
   const to=safe(config.to,250);add(node(title,'n8n-nodes-base.gmail',id++,{resource:'message',operation:'send',sendTo:to.includes('@')&&!to.includes('CONFIGURER')&&!to.includes('<<')?to:'CONFIGURER_EMAIL_DESTINATAIRE@example.com',subject:safe(config.subject,150)||'Notification Workflow Architect',message:safe(config.body,2000)||'={{ JSON.stringify($json) }}',options:{}},arr.length,2.1));
   guides.push('Étape « '+title+' » : connecter Gmail via OAuth dans n8n, puis vérifier destinataire, sujet et contenu.');
  }else if(step.kind==='sheets'){
   const columns={};const names=asArray(config.columns).slice(0,15).filter(x=>typeof x==='string'&&/^[\wÀ-ÿ -]{1,50}$/.test(x));for(const k of names)columns[k]=`={{ $json[${JSON.stringify(k)}] ?? '' }}`;
   add(node(title,'n8n-nodes-base.googleSheets',id++,{resource:'sheet',operation:'append',documentId:{__rl:true,value:'CONFIGURER_GOOGLE_SHEET_ID',mode:'id'},sheetName:{__rl:true,value:safe(config.sheetName)||'Feuille 1',mode:'name'},columns:{mappingMode:'defineBelow',value:columns,matchingColumns:[],schema:[]},options:{}},arr.length,4.5));
   guides.push('Étape « '+title+' » : connecter Google Sheets dans n8n, renseigner le fichier, sélectionner la feuille et revalider le mappage des colonnes.');
  }else if(step.kind==='approval'){
   // Wait resumes only through its generated resume URL. This is NOT a secure human approval policy by itself.
   add(node(title+' · pause avant action','n8n-nodes-base.wait',id++,{resume:'webhook',options:{}},arr.length,1.1));
   guides.push('Étape « '+title+' » : configurer le nœud Wait et un vrai dispositif de validation authentifié. Le lien de reprise seul ne constitue PAS une approbation sûre.');
   warnings.push('Action sensible : la reprise de Wait doit être protégée par une validation authentifiée, à configurer.');
  }else if(step.kind==='respond'){
   add(codeNode(title,id++,`return $input.all().map(i=>({json:{...i.json,_workflow_complete:true,completedAt:new Date().toISOString()}}));`,arr.length));
  }
 }
 const names=new Set(arr.map(n=>n.name));if(names.size!==arr.length)throw Error('Noms de noeuds en doublon.');
 for(const v of Object.values(con))for(const lane of v.main)for(const item of lane)if(!names.has(item.node))throw Error('Connexion interne invalide.');
 return {file:{name:'Workflow Architect | '+p.title,nodes:arr,connections:con,active:false,settings:{executionOrder:'v1'},pinData:{},tags:[]},guide:guides,warnings};
}
function compileMake(p){
 const unrepresented=p.steps.filter(s=>['filter','approval','validate','transform'].includes(s.kind));
 if(p.trigger==='schedule'||unrepresented.length){
  throw Error('Export Make non fiable pour ce scénario : des opérations métier (validation, transformation, filtrage, approbation ou programmation) ne seraient pas fidèlement représentées dans le blueprint. Aucun fichier incomplet ne sera proposé. Choisis n8n, ou prépare ces étapes directement dans Make.');
 }
 const modules=[],notes=[],warnings=[];let x=0,id=1;
 if(p.trigger==='schedule')warnings.push('Le scénario Make est lancé manuellement après import : configure l’horaire dans Make (le déclencheur planifié n’est pas provisionné par blueprint).');
 modules.push({id:id++,module:'gateway:CustomWebHook',version:1,parameters:{hook:null,maxResults:1},mapper:{},metadata:{designer:{x:x,y:0,name:'Entrée métier'},parameters:[{name:'hook',type:'hook:gateway-webhook',label:'Webhook',required:true}],interface:[{name:'message',type:'text'},{name:'email',type:'text'},{name:'name',type:'text'}]}});x+=300;
 // Make variable module is known importable; external services require account-specific connections.
 modules.push({id:id++,module:'util:SetVariable',version:1,parameters:{},mapper:{name:'demande',scope:'roundtrip',value:'{{1.message}}'},metadata:{designer:{x:x,y:0,name:'Préparer la demande'}}});x+=300;
 for(const [index,step] of p.steps.entries()){
  const title=(index+1)+' · '+safe(step.title,65); const cfg=step.config||{};
  if(step.kind==='transform'||step.kind==='validate'){
   modules.push({id:id++,module:'util:SetVariable',version:1,parameters:{},mapper:{name:'etat_'+index,scope:'roundtrip',value:'{{2.demande}}'},metadata:{designer:{x,y:0,name:title}}});x+=300;
   notes.push('Étape '+title+' : vérifier et compléter les contrôles métier dans Make (variable de préparation).');
  } else if(step.kind==='approval'||step.kind==='filter'){
   notes.push('Étape '+title+' : nécessite un routeur/filtre et une validation humaine configurés manuellement dans Make avant l’action suivante.');
   warnings.push('Étape '+title+' non exécutable automatiquement sans configuration Make.');
  }else if(step.kind==='http'||step.kind==='gmail'||step.kind==='sheets'){
   const provided=safe(cfg.url,400);const valid=/^https:\/\/[a-z0-9.-]+\//i.test(provided)&&!provided.includes('<<')&&!provided.includes('CONFIGURER');
   const dest=step.kind==='http'&&valid?provided:'https://CONFIGURER_DESTINATION.example.com/api';
   modules.push({id:id++,module:'http:ActionSendData',version:3,parameters:{handleErrors:true},mapper:{url:dest,method:'post',headers:[{name:'Content-Type',value:'application/json'}],qs:[],bodyType:'raw',contentType:'application/json',data:JSON.stringify({message:'{{2.demande}}',step:title,kind:step.kind}),parseResponse:true,timeout:'',shareCookies:false,rejectUnauthorized:true,followRedirect:true},metadata:{designer:{x,y:0,name:title}}});x+=300;
   notes.push('Étape '+title+' : remplacer l’URL provisoire, brancher l’API ou utiliser le module natif '+step.kind+' et ajouter les permissions du compte.');
  }else if(step.kind==='respond'){
   modules.push({id:id++,module:'util:SetVariable',version:1,parameters:{},mapper:{name:'resultat',scope:'roundtrip',value:'Demande transmise'},metadata:{designer:{x,y:0,name:title}}});x+=300;
  }
 }
 return {file:{name:'Workflow Architect | '+p.title,flow:modules,metadata:{instant:true,version:1,scenario:{roundtrips:1,maxErrors:3,autoCommit:true,autoCommitTriggerLast:true,sequential:true,confidential:false,dataloss:false,dlq:false},designer:{orphans:[]},zone:'eu1.make.com'}},guide:notes,warnings};
}
function buildGuide(p,meta){
 const n=p.platform==='n8n';const out=[`# Installer l’automatisation : ${p.title}`,'',`Plateforme : ${n?'n8n':'Make'} | Production : Workflow Architect avec Cloudflare Workers AI | État : JSON généré localement — import réel et connexions à tester`,'',`## Objectif\n${p.summary||p.title}`,'',`## 1. Importer le fichier`,n?'1. Ouvre n8n, crée un workflow, puis choisis Import from File.\n2. Sélectionne le fichier .json téléchargé.\n3. Laisse le workflow inactif le temps des tests.':'1. Ouvre Make > Scenarios > Create a new scenario.\n2. Menu ⋯ en haut à droite > Import blueprint.\n3. Choisis le .json et enregistre.','',`## 2. Configurer les connexions`,...asArray(p.requiredConnections).map(x=>'- '+x),'',`## 3. Adapter les modules`,...meta.guide.map((x,i)=>(i+1)+'. '+x),...asArray(p.setupNotes).map(x=>'- '+x),'',`## 4. Tester de bout en bout`,'1. Utilise un compte de test et des données fictives.','2. Lance un essai (n8n : Test workflow / Make : Run once).','3. Si webhook : copie son URL de test et envoie une requête POST JSON avec un outil HTTP.','4. Vérifie les données réellement créées ou envoyées dans chaque application destinataire.','5. Vérifie les erreurs, les doublons, les permissions et les reprises.','6. Active le workflow uniquement après ce contrôle.','',`## Points d’attention`,...meta.warnings.map(x=>'- '+x),...asArray(p.assumptions).map(x=>'- Hypothèse : '+x),'',`## Confidentialité`,'Ne place aucun mot de passe ou clé API dans le brief. Les identifiants doivent être créés et gérés dans n8n ou Make.','',`## État de compatibilité`,'Le JSON est validé localement (structure et connexions) mais son import réel n’est pas certifié tant que le test sur la plateforme n’a pas eu lieu.'];return out.join('\n');
}
function download(text,name,mime){const blob=new Blob([text],{type:mime});const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function renderPlan(p,meta){const root=$('steps');root.replaceChildren();const list=[{kind:'trigger',title:p.trigger==='schedule'?'Déclencheur programmé':'Webhook entrant'},...p.steps];list.forEach((s,i)=>{const el=document.createElement('div');el.className='step';const small=document.createElement('small');small.textContent=`ÉTAPE ${String(i+1).padStart(2,'0')} · ${s.kind.toUpperCase()}`;const strong=document.createElement('b');strong.textContent=s.title;const note=document.createElement('div');note.className='small';note.textContent=s.purpose||'';el.append(small,strong,note);root.append(el)});
 const g=$('guide');if(g)g.textContent=guideText;
 const summary=$('quality');if(summary){summary.textContent=`${list.length} modules · ${meta.warnings.length} avertissement(s) · ${meta.guide.length} configurations accompagnées · JSON vérifié localement · import sur la plateforme non testé`;}
 $('json').textContent=JSON.stringify(output,null,2);$('status').textContent=`Plan généré par Cloudflare Workers AI : ${p.title}. ${p.platform==='make'?'Blueprint de base Make à compléter avant utilisation.':'Brouillon n8n et guide prêts.'} Importe, configure et teste avant activation.`;
 $('download').disabled=false;$('copy').disabled=false;$('guide-download').disabled=false;
}
async function generate(){if(busy)return;const brief=$('brief').value.trim(),platform=$('platform').value;if(brief.length<30){$('status').textContent='Décris ton besoin en au moins 30 caractères.';return}busy=true;$('generate').disabled=true;$('status').textContent='L’IA analyse le besoin et construit le workflow…';output=null;guideText='';plan=null;$('download').disabled=true;$('guide-download').disabled=true;$('copy').disabled=true;$('json').textContent='';$('quality').textContent='';
 try{const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({brief,platform})});const j=await r.json();if(!r.ok)throw Error(j.error||'Erreur du service IA');plan=normalizePlan(j.plan);const meta=platform==='n8n'?compileN8n(plan):compileMake(plan);output=meta.file;guideText=buildGuide(plan,meta);filename='workflow-architect-'+platform+'-'+Date.now()+'.json';renderPlan(plan,meta)}catch(e){$('status').textContent='Impossible de générer : '+e.message}finally{busy=false;$('generate').disabled=false}}
$('generate').addEventListener('click',generate);
$('download').addEventListener('click',()=>{if(output)download(JSON.stringify(output,null,2),filename,'application/json')});
$('guide-download').addEventListener('click',()=>{if(output)download(guideText,filename.replace(/\.json$/,'.md'),'text/markdown;charset=utf-8')});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(JSON.stringify(output,null,2));$('status').textContent='JSON copié'}catch(e){$('status').textContent='Copie indisponible'}});
document.querySelectorAll('[data-example]').forEach(button=>button.addEventListener('click',()=>{$('brief').value=button.dataset.example}));