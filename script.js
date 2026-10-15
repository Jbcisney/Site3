var WA="5532935000000",FEE=8,FREE_FROM=100;
// [categoria, nome, descrição, preço ou [média, grande]]
var M=[
["Pizzas","Margherita","Molho de tomate, mussarela, manjericão fresco e azeite.",[42,56]],
["Pizzas","Calabresa Acebolada","Calabresa artesanal, cebola roxa e azeitonas.",[44,58]],
["Pizzas","Quatro Queijos","Mussarela, provolone, gorgonzola e parmesão.",[48,64]],
["Pizzas","Portuguesa","Presunto, ovos, cebola, ervilha, pimentão e azeitonas.",[46,62]],
["Pizzas","Frango com Catupiry","Frango desfiado temperado e catupiry cremoso.",[45,60]],
["Pizzas","Napolitana","Mussarela, tomate fresco, parmesão e orégano.",[43,57]],
["Pizzas","Pepperoni","Pepperoni fatiado, mussarela e um toque de mel picante.",[50,66]],
["Pizzas","Rúcula com Tomate Seco","Mussarela de búfala, rúcula, tomate seco e lascas de parmesão.",[52,68]],
["Petiscos","Bruschetta Rústica","Pão de fermentação natural, tomate, alho e manjericão.",24],
["Petiscos","Polenta Frita","Palitos crocantes com molho de queijo.",26],
["Petiscos","Batata Rústica","Batatas assadas com alecrim, alho e sal grosso.",28],
["Petiscos","Bolinho de Queijo Canastra","Porção com 8 unidades e geleia de pimenta.",32],
["Petiscos","Tábua de Frios","Queijos, salame, presunto cru, azeitonas e torradas.",58],
["Sobremesas","Petit Gâteau","Bolo quente de chocolate com sorvete de creme.",28],
["Sobremesas","Tiramisù","Receita tradicional com café e mascarpone.",24],
["Sobremesas","Pizza Doce de Chocolate","Chocolate ao leite, morangos e granulado (média).",38],
["Sobremesas","Pudim de Leite","Calda de caramelo caseira.",16],
["Bebidas","Refrigerante Lata","Coca-Cola, Guaraná ou Sprite (350 ml).",7],
["Bebidas","Suco Natural","Laranja, limão ou maracujá (400 ml).",12],
["Bebidas","Limonada Suíça","Limão batido com leite condensado (500 ml).",14],
["Bebidas","Água Mineral","Com ou sem gás (500 ml).",5],
["Bebidas","Cerveja Artesanal","Pilsen ou IPA (500 ml).",22],
["Bebidas","Vinho Tinto (taça)","Seleção da casa.",21]
];
var CATS=["Pizzas","Petiscos","Sobremesas","Bebidas"],cat="Pizzas",cart=[];
var $=function(i){return document.getElementById(i)};
function brl(v){return "R$ "+v.toFixed(2).replace(".",",")}
try{cart=JSON.parse(localStorage.getItem("fv-cart")||"[]")}catch(e){cart=[]}
function save(){try{localStorage.setItem("fv-cart",JSON.stringify(cart))}catch(e){}}

/* ===== Cardápio ===== */
function renderTabs(){
$("tabs").innerHTML=CATS.map(function(c){return "<button data-c='"+c+"' class='"+(c===cat?"on":"")+"'>"+c+"</button>"}).join("")}
function renderMenu(){
$("menu").innerHTML=M.map(function(m,i){
if(m[0]!==cat)return "";
var p=m[3],sz=Array.isArray(p);
return "<div class='card it'><h3>"+m[1]+"</h3><p>"+m[2]+"</p>"+
(sz?"<select id='s"+i+"' aria-label='Tamanho'><option value='0'>Média (6 fatias) · "+brl(p[0])+"</option><option value='1'>Grande (8 fatias) · "+brl(p[1])+"</option></select>":"")+
"<div class='row' style='margin-top:"+(sz?10:0)+"px'>"+(sz?"":"<span class='pr'>"+brl(p)+"</span>")+"<button class='add' data-i='"+i+"'>Adicionar</button></div></div>"}).join("")}
$("tabs").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;cat=b.dataset.c;renderTabs();renderMenu()});
$("menu").addEventListener("click",function(e){var b=e.target.closest(".add");if(!b)return;
var i=+b.dataset.i,m=M[i],s=$("s"+i),size=s?+s.value:-1,price=s?m[3][size]:m[3];
var name=m[1]+(s?(size?" (Grande)":" (Média)"):""),f=cart.find(function(c){return c.n===name});
if(f)f.q++;else cart.push({n:name,p:price,q:1});
save();renderCart();b.textContent="Adicionado ✓";setTimeout(function(){b.textContent="Adicionar"},900)});

/* ===== Carrinho ===== */
function mode(){return document.querySelector("input[name=md]:checked").value}
function totals(){
var sub=cart.reduce(function(a,c){return a+c.p*c.q},0),del=mode()==="delivery"&&sub>0;
var fee=del?(sub>=FREE_FROM?0:FEE):0;return{sub:sub,fee:fee,tot:sub+fee,del:del}}
function renderCart(){
var n=cart.reduce(function(a,c){return a+c.q},0);$("count").textContent=n;
$("items").innerHTML=cart.length?cart.map(function(c,i){
return "<div class='ci'><div><b>"+c.n+"</b><small>"+brl(c.p)+" cada</small><div class='q'><button data-a='-' data-i='"+i+"'>−</button><span>"+c.q+"</span><button data-a='+' data-i='"+i+"'>+</button></div></div><b>"+brl(c.p*c.q)+"</b></div>"}).join(""):"<p class='empty'>Seu carrinho está vazio.</p>";
var t=totals();$("sub").textContent=brl(t.sub);
$("fee").textContent=t.del?(t.fee?brl(t.fee):"Grátis"):"—";$("tot").textContent=brl(t.tot);
$("addr").style.display=t.del||mode()==="delivery"?"block":"none";
$("cfoot").style.display=cart.length?"block":"none"}
$("items").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;
var i=+b.dataset.i;cart[i].q+=b.dataset.a==="+"?1:-1;if(cart[i].q<1)cart.splice(i,1);save();renderCart()});
document.querySelectorAll("input[name=md]").forEach(function(r){r.addEventListener("change",renderCart)});
function toggle(on){$("cart").classList.toggle("on",on);$("ov").classList.toggle("on",on)}
$("openCart").onclick=function(){toggle(true)};$("closeCart").onclick=$("ov").onclick=function(){toggle(false)};
function say(el,txt,err,html){el.style.display="block";el.className="msg"+(err?" err":"");if(html){el.innerHTML="";el.appendChild(html)}else el.textContent=txt}
$("oform").addEventListener("submit",function(e){e.preventDefault();
var t=totals(),nm=$("on").value.trim(),ph=$("op").value.trim(),ad=$("oa").value.trim(),m=$("omsg");
if(!cart.length)return say(m,"Adicione itens ao carrinho.",1);
if(!nm||!ph||(t.del&&!ad))return say(m,"Preencha nome, telefone"+(t.del?" e endereço":"")+".",1);
var L=["*Novo pedido — Forno da Vila*","Cliente: "+nm,"Telefone: "+ph,"Tipo: "+(t.del?"Delivery":"Retirada no local")];
if(t.del)L.push("Endereço: "+ad);
L.push("","*Itens*");cart.forEach(function(c){L.push(c.q+"x "+c.n+" — "+brl(c.p*c.q))});
L.push("","Subtotal: "+brl(t.sub));if(t.del)L.push("Entrega: "+(t.fee?brl(t.fee):"Grátis"));
L.push("*Total: "+brl(t.tot)+"*","Pagamento: "+$("opay").value);
if($("oo").value.trim())L.push("Obs.: "+$("oo").value.trim());
var url="https://wa.me/"+WA+"?text="+encodeURIComponent(L.join("\n"));
var a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";a.textContent="Abrir WhatsApp e finalizar →";
var w=document.createElement("div");w.appendChild(document.createTextNode("Pedido montado, "+nm+"! Total "+brl(t.tot)+". "));w.appendChild(a);
say(m,"",0,w);window.open(url,"_blank");
cart=[];save();renderCart();this.reset()});

/* ===== Reservas ===== */
var rt=$("rt"),rq=$("rq"),h="";
for(var x=18;x<=22;x++){["00","30"].forEach(function(mn){h+="<option>"+x+":"+mn+"</option>"})}
rt.innerHTML=h;
h="";for(var p=1;p<=10;p++)h+="<option value='"+p+"'>"+p+(p===1?" pessoa":" pessoas")+"</option>";
rq.innerHTML=h+"<option value='11+'>Mais de 10</option>";
var d=new Date();$("rd").min=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
$("rform").addEventListener("submit",function(e){e.preventDefault();
var n=$("rn").value.trim(),ph=$("rp").value.trim(),dt=$("rd").value,m=$("rmsg");
if(!n||!ph||!dt)return say(m,"Preencha nome, telefone e data.",1);
if(new Date(dt+"T12:00").getDay()===1)return say(m,"Fechamos às segundas-feiras. Escolha outra data.",1);
var q=rq.value,p=dt.split("-"),when=p[2]+"/"+p[1]+"/"+p[0]+" às "+rt.value;
var txt="Olá! Quero reservar uma mesa no Forno da Vila.\nNome: "+n+"\nData: "+when+"\nPessoas: "+q+($("ro").value.trim()?"\nObs.: "+$("ro").value.trim():"");
var a=document.createElement("a");a.href="https://wa.me/"+WA+"?text="+encodeURIComponent(txt);a.target="_blank";a.rel="noopener";a.textContent="Confirmar pelo WhatsApp →";
var w=document.createElement("div");w.appendChild(document.createTextNode("Reserva solicitada para "+when+" ("+q+" pess.). "));w.appendChild(a);
say(m,"",0,w);this.reset()});

renderTabs();renderMenu();renderCart();
