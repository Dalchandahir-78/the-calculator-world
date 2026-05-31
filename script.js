function add(v){scidisplay.value+=v;}
function back(id){
let el=document.getElementById(id);
el.value=el.value.slice(0,-1);
}
function copy(id){navigator.clipboard.writeText(document.getElementById(id).value);}
function clearAllFields(){for(let i=0;i<arguments.length;i++){document.getElementById(arguments[i]).value="";}}

function fact(n){let f=1;for(let i=1;i<=n;i++)f*=i;return f;}
function sin(x){return Math.sin(x*Math.PI/180);}
function cos(x){return Math.cos(x*Math.PI/180);}
function tan(x){return Math.tan(x*Math.PI/180);}
function log(x){return Math.log10(x);}

function calc(){
try{
let e=scidisplay.value;
e=e.replace(/(\d+)!/g,(m,n)=>fact(+n));
let result= eval(e);
scidisplay.value=eval(e);
saveToHistory(e,result);
}catch{scidisplay.value="error";}
}

function conv(t){
let v=+u1.value;
if(isNaN(v))return u2.value="error";
if(t=="km_m")u2.value=v*1000;
if(t=="m_km")u2.value=v/1000;
if(t=="kg_g")u2.value=v*1000;
if(t=="g_kg")u2.value=v/1000;
saveToHistory(t + " : " + v,u2.value);
}

function land(t){
let v=+l1.value;
if(isNaN(v))return l2.value="error";
if(t=="acre_km")l2.value=v*0.00404686;
if(t=="km_acre")l2.value=v/0.00404686;
saveToHistory(t + " : " + v, l2.value); 
}

function area(){
let shapeVal=shape.value;
let valA=parseFloat(inputA.value);
let valB=parseFloat(inputB.value);
let unitVal=unit.value;

if(shapeVal==""||isNaN(valA)){aout.value="error";return;}

let res=0;

if(shapeVal=="rect"){
if(isNaN(valB)){aout.value="error";return;}
res=valA*valB;
}
else if(shapeVal=="square"){res=valA*valA;}
else if(shapeVal=="circle"){res=Math.PI*valA*valA;}

if(unitVal=="cm2")res*=10000;
else if(unitVal=="km2")res/=1000000;
else if(unitVal=="acre")res/=4046.86;

aout.value=res.toFixed(4)+" "+unitVal;
saveToHistory("Area " + shapeVal,aout.value);
}

function quad(){
let a=+qa.value,b=+qb.value,c=+qc.value;
let d=b*b-4*a*c;
if(d<0)return qout.value="error";
qout.value=(-b+Math.sqrt(d))/(2*a)+","+(-b-Math.sqrt(d))/(2*a);
saveToHistory('Quadratic(${a},${b},${c}',result);
}

function temp(){
let v=+t.value,m=mode.value;
if(isNaN(v))return tout.value="error";
if(m=="cf")tout.value=(v*9/5)+32;
if(m=="ck")tout.value=v+273.15;
if(m=="fc")tout.value=(v-32)*5/9;
if(m=="fk")tout.value=(v-32)*5/9+273.15;
if(m=="kc")tout.value=v-273.15;
if(m=="kf")tout.value=(v-273.15)*9/5+32;
saveToHistory(" Temp " + " : " + v, tout.value);
}
function toggleTheme(){
    const root=document.documentElement;
    const btn=document.getElementById('theme-toggle');
    console.log("Button click!");
    if(root.getAttribute("data-theme")==="dark"){
        root.removeAttribute("data-theme");
        btn.innerHTML="&#127769; Dark Mode";
        localStorage.setItem("theme","light");
    } else{
        root.setAttribute("data-theme","dark");
        btn.innerHTML="&#9728;Light Mode";
        localStorage.setItem("theme","dark");
    }
    }
    // 1. Data Conversion Logic
function dataConv() {
    let v = +d1.value;
    let m = document.getElementById('d-mode').value;
    if (isNaN(v)) return dout.value = "error";
    let res = 0;
    if (m == "mb_kb") res = v * 1024;
    if (m == "gb_mb") res = v * 1024;
    if (m == "tb_gb") res = v * 1024;
    if (m == "kb_mb") res = v / 1024;
    if (m == "mb_gb") res = v / 1024;
    if (m == "gb_kb") res = v * 1024 * 1024;
    
    dout.value = res.toLocaleString();
    saveToPermanentHistory("Data (" + m + ")", v + " -> " + res);
}

// 2. Time Conversion Logic
function timeConv() {
    let v = +tm1.value;
    let m = document.getElementById('tm-mode').value;
    if (isNaN(v)) return tmout.value = "error";
    let res = 0;
    if (m == "h_m") res = v * 60;
    if (m == "m_h") res = v / 60;
    if (m == "m_s") res = v * 60;
    if (m == "h_s") res = v * 3600;
    if (m == "s_ms") res = v * 1000;
    if (m == "ms_s") res = v / 1000;

    tmout.value = res.toLocaleString();
    saveToPermanentHistory("Time (" + m + ")", v + " -> " + res);
}

// 3. Permanent History (LocalStorage)
function saveToPermanentHistory(type, detail) {
    let history = JSON.parse(localStorage.getItem("calc_history")) || [];
    history.unshift({ type, detail, time: new Date().toLocaleTimeString() });
    if(history.length > 50) history.pop(); // Limit to 50 items
    localStorage.setItem("calc_history", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("calc_history")) || [];
    let list = document.getElementById("history-list");
    list.innerHTML = history.map(item => `
        <div class="history-item">
            <strong>${item.type}</strong><br>
            ${item.detail}<br>
            <small>${item.time}</small>
        </div>
    `).join("");
}

function clearPermanentHistory() {
    localStorage.removeItem("calc_history");
    displayHistory();
}

// Run on page load
window.onload = () => {
    displayHistory();
    // Load theme
    if(localStorage.getItem("theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
};

// Update your existing saveToHistory to also update the UI
// (In addition to your server fetch)
const originalSaveToHistory = saveToHistory;
saveToHistory = function(sawal, jawab) {
    saveToPermanentHistory("Math", sawal + " = " + jawab);
    originalSaveToHistory(sawal, jawab); // Call your server function
}
async function saveToHistory(sawal, jawab) {
    console.log("Frontend saving:", sawal, jawab);
    try {
        const response = await fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                expression: String(sawal),
                result: String(jawab)
            })
        });

        // Response check logic
        if (response.ok) {
            const data = await response.json();
            console.log("Server ka jawab:", data.message);
        } else {
            console.log("Server ne mana kar diya!");
        }
    } catch (err) {
        console.log("Error: Server connect nahi ho raha. Kya node server.js chal raha hai?");
    }
}