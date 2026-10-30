(()=>{'use strict';
const projects=[
{key:'oc',title:'OPS COMMAND Studio',label:'SAAS · PROCESSUS MÉTIER · AUTOMATISATION',summary:'Pilotez les processus, validations, rôles et exécutions au sein d’une entreprise.',detail:'Moteur métier actif. Les connexions à des logiciels tiers demandent une configuration et des tests autorisés.',url:'https://ops-command-studio-kdkongodervilons-projects.vercel.app',image:'/portfolio/assets/screens/ops-command-capture-v4.jpg'},
{key:'wa',title:'Workflow Architect',label:'IA GÉNÉRATIVE · N8N · MAKE',summary:'Décrivez votre automatisation, construisez le workflow n8n ou Make et recevez un guide d’installation.',detail:'Génération assistée par IA ; les identifiants et paramètres externes sont à renseigner et valider.',url:'https://workflow-architect-kdkongodervilons-projects.vercel.app',image:'/portfolio/assets/screens/workflow-architect-capture-v4.jpg'}
];
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
const isNewCard=x=>projects.some(p=>normalize(x.querySelector('h3')?.textContent)===normalize(p.title));
function buildCard(p) {
 const card=document.createElement('article');card.className='project-card ops-project-card';card.dataset.opsProject=p.key;card.dataset.opsVersion='v4';
 const fig=document.createElement('figure');fig.className='project-visual ops-real-preview';
 const img=document.createElement('img');img.className='ops-card-img';img.loading='lazy';img.decoding='async';img.width=1194;img.height=760;img.alt='Capture authentique de l’interface '+p.title;img.src=p.image;
 const label=document.createElement('figcaption');label.className='ops-preview-label';label.textContent='Capture d’interface réelle · Application testable';fig.append(img,label);
 const body=document.createElement('div');body.className='project-body';
 const eyebrow=document.createElement('p');eyebrow.className='eyebrow';eyebrow.textContent=p.label;
 const h=document.createElement('h3');h.textContent=p.title;const summary=document.createElement('p');summary.textContent=p.summary;
 const detail=document.createElement('p');detail.className='ops-preview-limit';detail.textContent=p.detail;
 const actions=document.createElement('div');actions.className='actions';const a=document.createElement('a');a.className='button';a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Explorer le projet ↗';
 actions.append(a);body.append(eyebrow,h,summary,detail,actions);card.append(fig,body);return card;
}
function reconcile(){
 const grids=Array.from(document.querySelectorAll('#main .project-grid'));
 if(!grids.length)return;
 const primary=grids[0];
 for(const grid of grids){
   const cards=Array.from(grid.querySelectorAll(':scope > .project-card')).filter(isNewCard);
   for(const p of projects) {
    const matches=cards.filter(node=>normalize(node.querySelector('h3')?.textContent)===normalize(p.title));
    const keep=grid===primary ? matches.find(node=>node.dataset.opsVersion==='v4'&&node.dataset.opsProject===p.key&&node.querySelector('img.ops-card-img')):null;
    for(const node of matches)if(node!==keep)node.remove();
    if(grid===primary&&!keep)primary.append(buildCard(p));
   }
 }
}
let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;reconcile()})}
const main=document.getElementById('main')||document.body;
new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
window.addEventListener('hashchange',schedule);
})();