/* IDA RESILIENCE PHARMA — V0.1
 * Prototype local de validation. Pas encore adapté à une exploitation réelle.
 */
(function(){
"use strict";
const DB_NAME="ida-resilience-pharma", DB_VERSION=1;
let db, cart=[], toastTimer;
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("fr-FR").format(Number(n)||0)+" FCFA";
const dateText=s=>s?new Date(s+"T00:00:00").toLocaleDateString("fr-FR"):"—";
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,9);
function notify(message){const el=$("toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800)}
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,DB_VERSION);req.onupgradeneeded=()=>{const d=req.result;["products","lots","sales","audit"].forEach(name=>{if(!d.objectStoreNames.contains(name))d.createObjectStore(name,{keyPath:"id"})})};req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function all(store){return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readonly"),r=tx.objectStore(store).getAll();r.onsuccess=()=>resolve(r.result||[]);r.onerror=()=>reject(r.error)})}
function put(store,value){return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.objectStore(store).put(value);tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error)})}
function remove(store,id){return new Promise((resolve,reject)=>{const tx=db.transaction(store,"readwrite");tx.objectStore(store).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error)})}
function audit(action,detail){return put("audit",{id:uid(),action,detail,at:new Date().toISOString()})}
async function data(){const [products,lots,sales]=await Promise.all([all("products"),all("lots"),all("sales")]);return{products,lots,sales}}

async function seedDemoData(){
  if((await all("products")).length) return;
  const products=[
    ["Paracétamol 500 mg","PH-0001","Antalgique",500,20],
    ["Paracétamol sirop 120 mg/5 ml","PH-0002","Sirop",1500,8],
    ["Ibuprofène 200 mg","PH-0003","Antalgique",750,15],
    ["Vitamine C 500 mg","PH-0004","Vitamines",1000,10],
    ["Sérum physiologique 0,9 %","PH-0005","Solution",750,12],
    ["Solution de réhydratation orale (SRO)","PH-0006","Réhydratation",500,20],
    ["Cetirizine 10 mg","PH-0007","Antiallergique",1000,10],
    ["Loratadine 10 mg","PH-0008","Antiallergique",1000,8],
    ["Oméprazole 20 mg","PH-0009","Gastro-entérologie",1500,10],
    ["Métronidazole 250 mg","PH-0010","Comprimés",1000,10],
    ["Amoxicilline 500 mg","PH-0011","Antibiotique",2500,8],
    ["Azithromycine 500 mg","PH-0012","Antibiotique",3500,5],
    ["Miconazole crème 2 %","PH-0013","Dermatologie",2000,6],
    ["Pommade antiseptique","PH-0014","Soins",1750,6],
    ["Compresses stériles (paquet)","PH-0015","Pansements",1000,15],
    ["Bandes extensibles","PH-0016","Pansements",750,10],
    ["Gants d'examen (boîte)","PH-0017","Consommables",3500,5],
    ["Masques chirurgicaux (boîte)","PH-0018","Consommables",2500,5],
    ["Thermomètre digital","PH-0019","Matériel médical",2500,4],
    ["Tensiomètre électronique","PH-0020","Matériel médical",18000,2],
    ["Test de grossesse","PH-0021","Diagnostic",1000,8],
    ["Moustiquaire imprégnée","PH-0022","Prévention",4500,4],
    ["Gel hydroalcoolique 500 ml","PH-0023","Hygiène",2500,6],
    ["Coton hydrophile 100 g","PH-0024","Pansements",1000,8]
  ];
  const suppliers=["LABOREX Mali","COPHARMA","Grossiste Pharmaceutique du Mali","Dépôt pharmaceutique Bamako"];
  const ids=products.map((p,i)=>({id:"demo-p-"+String(i+1).padStart(3,"0"),name:p[0],code:p[1],category:p[2],price:p[3],threshold:p[4],createdAt:new Date().toISOString()}));
  for(const p of ids) await put("products",p);
  const todayDate=new Date(); const plusDays=n=>{const d=new Date(todayDate);d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
  const lots=[];
  ids.forEach((p,i)=>{
    const qty=[85,24,62,40,35,55,28,20,32,18,26,12,16,22,45,30,9,14,8,3,18,11,20,25][i];
    lots.push({id:"demo-lot-a-"+(i+1),productId:p.id,batch:"ML"+(2601+i)+"A",quantity:qty,expiry:plusDays(i===2?35:i===10?68:180+(i*7)),cost:Math.round(p.price*.62),supplier:suppliers[i%suppliers.length],createdAt:new Date().toISOString()});
    if(i%3===0) lots.push({id:"demo-lot-b-"+(i+1),productId:p.id,batch:"ML"+(2509+i)+"B",quantity:Math.max(4,Math.round(qty*.35)),expiry:plusDays(300+i*5),cost:Math.round(p.price*.58),supplier:suppliers[(i+1)%suppliers.length],createdAt:new Date().toISOString()});
  });
  for(const lot of lots) await put("lots",lot);
  const sampleSales=[
    {id:"demo-sale-001",reference:"PH-DEMO-001",date:new Date().toISOString(),items:[{productId:ids[0].id,name:ids[0].name,quantity:2,unitPrice:ids[0].price,lineTotal:ids[0].price*2},{productId:ids[3].id,name:ids[3].name,quantity:1,unitPrice:ids[3].price,lineTotal:ids[3].price}],total:2000,payment:"Espèces"},
    {id:"demo-sale-002",reference:"PH-DEMO-002",date:new Date(Date.now()-86400000).toISOString(),items:[{productId:ids[14].id,name:ids[14].name,quantity:1,unitPrice:ids[14].price,lineTotal:ids[14].price}],total:ids[14].price,payment:"Mobile money (saisi)"}
  ];
  for(const sale of sampleSales) await put("sales",sale);
  await audit("DEMO_DATA_LOADED","Pharmacie de démonstration : 24 références, lots et ventes fictifs.");
}

function stockFor(productId,lots){return lots.filter(l=>l.productId===productId).reduce((n,l)=>n+Number(l.quantity||0),0)}
function lotStatus(lot){const diff=(new Date(lot.expiry+"T00:00:00")-new Date(today()+"T00:00:00"))/86400000;if(diff<0)return"Expiré";if(diff<=90)return"Échéance proche";return"Valide"}
function render(){
return data().then(({products,lots,sales})=>{
const daySales=sales.filter(s=>s.date.slice(0,10)===today());
const totalDay=daySales.reduce((n,s)=>n+s.total,0);
const alerts=lots.filter(l=>Number(l.quantity)>0&&lotStatus(l)!=="Valide");
$("statProducts").textContent=products.length;
$("statStock").textContent=lots.reduce((n,l)=>n+Number(l.quantity||0),0);
$("statSales").textContent=money(totalDay);
$("statSalesCount").textContent=daySales.length+" transaction"+(daySales.length>1?"s":"");
$("statAlerts").textContent=alerts.length;
$("todayLabel").textContent=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
$("expiryList").innerHTML=alerts.length?alerts.sort((a,b)=>a.expiry.localeCompare(b.expiry)).slice(0,8).map(l=>{const p=products.find(x=>x.id===l.productId);return '<div class="cart-item"><div><strong>'+esc(p?p.name:"Produit inconnu")+'</strong><small>Lot '+esc(l.batch)+' · '+l.quantity+' unité(s)</small></div><span class="status low">'+lotStatus(l)+' · '+dateText(l.expiry)+'</span></div>'}).join(""):'<div class="empty">Aucune alerte de péremption.</div>';
$("recentSales").innerHTML=sales.length?sales.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5).map(s=>'<div class="cart-item"><div><strong>'+esc(s.reference)+'</strong><small>'+new Date(s.date).toLocaleString("fr-FR")+' · '+s.items.length+' article(s)</small></div><strong>'+money(s.total)+'</strong></div>').join(""):'<div class="empty">Aucune vente enregistrée.</div>';
$("productRows").innerHTML=products.length?products.slice().sort((a,b)=>a.name.localeCompare(b.name)).filter(p=>(p.name+" "+(p.code||"")).toLowerCase().includes(($("productSearch").value||"").toLowerCase())).map(p=>{const qty=stockFor(p.id,lots),status=qty===0?"Rupture":qty<=Number(p.threshold)?"Stock faible":"Disponible";return '<tr><td>'+esc(p.name)+'</td><td>'+esc(p.code||"—")+'</td><td>'+money(p.price)+'</td><td>'+qty+'</td><td><span class="status '+(qty===0?"out":qty<=Number(p.threshold)?"low":"")+'">'+status+'</span></td><td><button class="row-action" data-add-lot="'+p.id+'">＋ Lot</button></td></tr>'}).join(""):'<tr><td colspan="6" class="empty">Aucun produit. Ajoutez votre première référence.</td></tr>';
const options='<option value="">Choisir un produit</option>'+products.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>'<option value="'+p.id+'">'+esc(p.name)+' ('+stockFor(p.id,lots)+' en stock)</option>').join("");
$("lotProduct").innerHTML=options;$("saleProduct").innerHTML=options;
$("historyRows").innerHTML=sales.length?sales.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(s=>'<tr><td>'+new Date(s.date).toLocaleString("fr-FR")+'</td><td>'+esc(s.reference)+'</td><td>'+s.items.map(i=>esc(i.name)+" × "+i.quantity).join(", ")+'</td><td>'+esc(s.payment)+'</td><td><strong>'+money(s.total)+'</strong></td></tr>').join(""):'<tr><td colspan="5" class="empty">Aucune vente.</td></tr>';
renderCart(products,lots);
});
}
function renderCart(products,lots){$("cartRows").innerHTML=cart.length?cart.map((item,i)=>{const p=products.find(x=>x.id===item.productId);return '<div class="cart-item"><div><strong>'+esc(p?p.name:"Produit")+'</strong><small>'+item.quantity+' × '+money(p?p.price:0)+'</small></div><div><strong>'+money((p?p.price:0)*item.quantity)+'</strong> <button data-remove-cart="'+i+'" aria-label="Retirer">✕</button></div></div>'}).join(""):'<div class="empty">Votre panier est vide.</div>';const total=cart.reduce((n,i)=>{const p=products.find(x=>x.id===i.productId);return n+(p?p.price*i.quantity:0)},0);$("cartTotal").textContent=money(total);$("completeSale").disabled=!cart.length}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id==="view-"+name));document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===name));render()}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
$("showProductForm").addEventListener("click",()=>$("productFormWrap").classList.remove("hidden"));
["closeProductForm","cancelProductForm"].forEach(id=>$(id).addEventListener("click",()=>$("productFormWrap").classList.add("hidden")));
$("productForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.currentTarget),name=String(f.get("name")).trim();if(!name)return;const p={id:uid(),name,code:String(f.get("code")).trim(),category:String(f.get("category")).trim(),price:Number(f.get("price")),threshold:Number(f.get("threshold")||0),createdAt:new Date().toISOString()};if(!Number.isFinite(p.price)||p.price<0||p.threshold<0)return notify("Vérifiez les prix et seuils.");await put("products",p);await audit("PRODUCT_CREATED",name);e.currentTarget.reset();$("productFormWrap").classList.add("hidden");notify("Produit enregistré localement.");render()});
$("lotForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.currentTarget),productId=f.get("productId"),quantity=Number(f.get("quantity")),expiry=String(f.get("expiry"));if(!productId||!Number.isInteger(quantity)||quantity<1||!expiry)return notify("Vérifiez les informations du lot.");if(expiry<today())return notify("Attention : la date de péremption est déjà passée.");const lot={id:uid(),productId,batch:String(f.get("batch")).trim(),quantity,expiry,cost:Number(f.get("cost")||0),supplier:String(f.get("supplier")).trim(),createdAt:new Date().toISOString()};await put("lots",lot);await audit("LOT_RECEIVED",lot.batch+" · "+quantity);e.currentTarget.reset();notify("Lot ajouté au stock.");render()});
$("productRows").addEventListener("click",e=>{const b=e.target.closest("[data-add-lot]");if(b){$("lotProduct").value=b.dataset.addLot;$("lotForm").scrollIntoView({behavior:"smooth",block:"center"})}});
$("productSearch").addEventListener("input",render);
$("saleProduct").addEventListener("change",async()=>{const id=$("saleProduct").value,{lots,products}=await data();const p=products.find(x=>x.id===id);$("saleAvailability").textContent=p?"Stock disponible : "+stockFor(id,lots)+" unité(s)":"Stock disponible : —"});
$("saleForm").addEventListener("submit",async e=>{e.preventDefault();const f=new FormData(e.currentTarget),productId=f.get("productId"),quantity=Number(f.get("quantity"));const {products,lots}=await data(),p=products.find(x=>x.id===productId),available=stockFor(productId,lots);if(!p||!Number.isInteger(quantity)||quantity<1)return notify("Sélectionnez un produit et une quantité valide.");if(quantity>available)return notify("Stock insuffisant : "+available+" unité(s) disponible(s).");const existing=cart.find(x=>x.productId===productId);if(existing)existing.quantity+=quantity;else cart.push({productId,quantity});e.currentTarget.reset();$("saleAvailability").textContent="Stock disponible : —";renderCart(products,lots)});
$("cartRows").addEventListener("click",e=>{const b=e.target.closest("[data-remove-cart]");if(b){cart.splice(Number(b.dataset.removeCart),1);render()}});
$("clearCart").addEventListener("click",()=>{cart=[];render()});
$("completeSale").addEventListener("click",async()=>{if(!cart.length)return;try{const [products,lots]=await Promise.all([all("products"),all("lots")]);const items=[],allocations=[];for(const ci of cart){const p=products.find(x=>x.id===ci.productId);if(!p)throw Error("Produit introuvable");let remaining=ci.quantity;const eligible=lots.filter(l=>l.productId===ci.productId&&Number(l.quantity)>0&&l.expiry>=today()).sort((a,b)=>a.expiry.localeCompare(b.expiry));for(const lot of eligible){if(remaining<=0)break;const take=Math.min(remaining,Number(lot.quantity));allocations.push({lotId:lot.id,newQuantity:Number(lot.quantity)-take});remaining-=take}if(remaining>0)throw Error("Stock insuffisant ou lots expirés pour "+p.name);items.push({productId:p.id,name:p.name,quantity:ci.quantity,unitPrice:p.price,lineTotal:p.price*ci.quantity})}const total=items.reduce((n,i)=>n+i.lineTotal,0),sale={id:uid(),reference:"PH-"+Date.now().toString().slice(-8),date:new Date().toISOString(),items,total,payment:$("paymentMethod").value};const tx=db.transaction(["lots","sales","audit"],"readwrite"),lotStore=tx.objectStore("lots");allocations.forEach(a=>{const l=lots.find(x=>x.id===a.lotId);lotStore.put({...l,quantity:a.newQuantity})});tx.objectStore("sales").put(sale);tx.objectStore("audit").put({id:uid(),action:"SALE_COMPLETED",detail:sale.reference+" · "+money(total),at:new Date().toISOString()});tx.oncomplete=()=>{cart=[];notify("Vente enregistrée : "+sale.reference);render()};tx.onerror=()=>notify("Erreur : vente non enregistrée.");}catch(err){notify(err.message||"Impossible de valider la vente.")}});
$("exportBackup").addEventListener("click",async()=>{const payload={format:"IDA-RESILIENCE-PHARMA",version:1,exportedAt:new Date().toISOString(),...(await data()),audit:await all("audit")};const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="ida-resilience-pharma-backup-"+today()+".json";a.click();URL.revokeObjectURL(url);notify("Sauvegarde téléchargée.")});
$("importBackup").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const payload=JSON.parse(await file.text());if(payload.format!=="IDA-RESILIENCE-PHARMA"||![payload.products,payload.lots,payload.sales,payload.audit].every(Array.isArray))throw Error("Format de sauvegarde non reconnu.");if(!confirm("Cette restauration remplacera toutes les données locales actuelles. Continuer ?"))return;const tx=db.transaction(["products","lots","sales","audit"],"readwrite");for(const store of ["products","lots","sales","audit"]){const os=tx.objectStore(store);os.clear();payload[store].forEach(item=>os.put(item))}tx.oncomplete=()=>{cart=[];notify("Sauvegarde restaurée.");render()};tx.onerror=()=>notify("Échec de restauration.");}catch(err){notify(err.message||"Fichier illisible.")}finally{e.target.value=""}});
function connection(){const offline=!navigator.onLine;$("connectionText").textContent=offline?"Hors connexion":"Connectivité disponible";$("connectionDot").parentElement.classList.toggle("offline",offline)}
window.addEventListener("online",connection);window.addEventListener("offline",connection);
async function start(){try{if(!("indexedDB"in window))throw Error("IndexedDB indisponible sur ce navigateur.");db=await openDB();await seedDemoData();connection();if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js").catch(()=>{});await render()}catch(err){notify("Démarrage impossible : "+err.message)}}
start();
})();