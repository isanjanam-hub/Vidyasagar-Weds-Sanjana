(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const DEFAULT=clone(window.WEDDING_DEFAULTS);
let data=clone(DEFAULT), knockCount=0, isOpening=false, audioObjectUrl="", musicObjectUrl="";
const gate=$("#gate"), invitation=$("#invitation"), editor=$("#editor");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const safe=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function load(){try{const saved=localStorage.getItem("royalWeddingConfig");if(saved)data={...clone(DEFAULT),...JSON.parse(saved)}}catch(e){data=clone(DEFAULT)} applyData();}
function applyData(){
document.documentElement.classList.toggle("palette-ivory",data.palette==="ivory");document.documentElement.classList.toggle("palette-berry",data.palette==="berry");
document.body.classList.toggle("font-modern",data.font==="modern");document.body.classList.toggle("no-animations",data.animations==="off"||reducedMotion);
$(".ambient").style.display=data.particles==="on"?"block":"none";$$(".hero-flower").forEach(e=>e.style.display=data.florals==="on"?"block":"none");
$("#brideName").textContent=data.brideName;$("#groomName").textContent=data.groomName;$("#heroDate").textContent=formatDate(data.weddingDate);$("#heroVenue").textContent=shortVenue(data.venueAddress);$("#heroQuote").textContent=data.heroQuote;$("#introText").textContent=data.introText;
$(".ornament-line").innerHTML=`<span>✧</span> ${safe(data.familyLine||"WITH THE BLESSINGS OF OUR FAMILIES").toUpperCase()} <span>✧</span>`;
$("#venueName").textContent=data.venueName||"Venue details to be announced";$("#venueAddress").textContent=data.venueAddress||"Address to be announced";$("#travelNotes").textContent=data.travelNotes||"Travel details to be announced";$("#directionsBtn").href=validUrl(data.mapUrl)||"https://www.google.com/maps/search/?api=1&query=Lucknow";
$("#footerDate").textContent=`${formatDate(data.weddingDate)} · ${shortVenue(data.venueAddress)}`;
$("#heroPhoto").src=data.heroPhoto||DEFAULT.heroPhoto;$("#sidePhoto").src=data.sidePhoto||DEFAULT.sidePhoto;renderGallery();renderEvents();updateCountdown();renderEditorEvents();renderPhotoEditor();updateMusic();
}
function validUrl(u){try{let x=new URL(u);return ["http:","https:"].includes(x.protocol)?x.href:null}catch{return null}}
function shortVenue(s){return s||"Lucknow, Uttar Pradesh"}
function formatDate(s){if(!s||s==="To be announced")return "Date to be announced";const d=new Date(`${s}T12:00:00`);return isNaN(d) ? s : d.toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}
function openInvitation(){if(isOpening||!invitation.hidden)return;isOpening=true;gate.classList.add("opening");playChime();setTimeout(()=>{gate.classList.add("opened");gate.hidden=true;invitation.hidden=false;window.scrollTo({top:0,behavior:reducedMotion?"auto":"smooth"});isOpening=false;},reducedMotion?30:2250);if(data.musicEnabled==="on")startMusic();}
function tap(){if(isOpening||!invitation.hidden)return;knockCount=Math.min(3,knockCount+1);$$(".tap-dots span").forEach((d,i)=>d.classList.toggle("done",i<knockCount));$("#tapInstruction").textContent=knockCount===1?"One knock…":knockCount===2?"Two knocks… one more to open":"The doors are opening…";gate.classList.remove("shake");void gate.offsetWidth;gate.classList.add("shake");playKnock();if(knockCount===3)setTimeout(openInvitation,reducedMotion?0:420);}
function playKnock(){if(data.soundEffects){const a=$("#knockAudio");try{a.currentTime=0;a.play().catch(()=>{})}catch{}}}
function playChime(){if(data.soundEffects){const a=$("#chimeAudio");try{a.currentTime=0;a.play().catch(()=>{})}catch{}}}
$("#tapLayer").addEventListener("click",tap);$("#openBtn").addEventListener("click",e=>{e.stopPropagation();openInvitation()});
$("#soundToggle").addEventListener("click",e=>{e.stopPropagation();data.soundEffects=!data.soundEffects;$("#soundToggle").textContent=`Sound effects: ${data.soundEffects?"on":"off"}`;$("#soundToggle").setAttribute("aria-pressed",String(data.soundEffects));});
$("#beginBtn").addEventListener("click",()=>$("#story").scrollIntoView({behavior:reducedMotion?"auto":"smooth"}));
$("#replayBtn").addEventListener("click",()=>{window.scrollTo({top:0,behavior:"smooth"});invitation.hidden=true;gate.hidden=false;gate.classList.remove("opened","opening");knockCount=0;$$(".tap-dots span").forEach(d=>d.classList.remove("done"));$("#tapInstruction").textContent="Tap three times to open the doors";});
function renderGallery(){const g=$("#gallery");g.innerHTML="";(data.gallery||[]).forEach((p,i)=>{const b=document.createElement("button");b.type="button";b.className="gallery-item";b.setAttribute("aria-label",`View ${p.caption||"wedding gallery photo"}`);b.innerHTML=`<img loading="lazy" src="${safe(p.src||DEFAULT.heroPhoto)}" alt="${safe(p.caption||"Wedding gallery image")}"><span class="gallery-caption">${safe(p.caption||"A lovely memory")}</span>`;b.addEventListener("click",()=>lightbox(p.src||DEFAULT.heroPhoto,p.caption));g.append(b);});}
function lightbox(src,caption){const box=document.createElement("div");box.className="lightbox";box.setAttribute("role","dialog");box.setAttribute("aria-label",caption||"Photo enlarged");box.innerHTML=`<button aria-label="Close enlarged photo">×</button><img src="${safe(src)}" alt="${safe(caption||"Wedding gallery photo")}">`;box.querySelector("button").onclick=()=>box.remove();box.addEventListener("click",e=>{if(e.target===box)box.remove()});document.body.append(box);box.querySelector("button").focus();}
const eventIcons={Haldi:"✿",Mehndi:"❋",Sangeet:"♫",Wedding:"❦"};
function renderEvents(){const g=$("#eventGrid");g.innerHTML="";(data.events||[]).forEach((ev,i)=>{const card=document.createElement("article");card.className=`event-card ${safe(ev.accent||"wedding")}`;const dateText=ev.date==="To be announced"?"Date to be announced":safe(ev.date||"Date to be announced");const time=[ev.start,ev.end].filter(x=>x&&x!=="Time to be announced").join(" – ")||"Time to be announced";const map=validUrl(ev.mapUrl)||validUrl(data.mapUrl)||"https://www.google.com/maps/search/?api=1&query=Lucknow";card.innerHTML=`<div class="event-icon">${eventIcons[ev.name]||"✧"}</div><h3>${safe(ev.name)}</h3><div class="event-date">${dateText} · ${safe(time)}</div><p>${safe(ev.description||"We look forward to celebrating with you.")}</p><div class="event-meta">⌖ ${safe(ev.venue||"Venue to be announced")}<br>Dress: ${safe(ev.dress||"To be announced")}</div><div class="event-actions"><a href="${map}" target="_blank" rel="noopener">Map ↗</a><button type="button" data-calendar="${i}">Add to Calendar +</button></div>`;if(ev.image){const im=document.createElement("img");im.src=ev.image;im.alt=`${ev.name} event`;im.style.cssText="width:100%;max-height:160px;object-fit:cover;margin-top:14px";card.insertBefore(im,card.querySelector(".event-actions"));}g.append(card);});
$$("[data-calendar]").forEach(b=>b.addEventListener("click",()=>calendarEvent(data.events[+b.dataset.calendar])));
}
function calendarEvent(ev){const date=(ev.date||"").match(/^\d{4}-\d{2}-\d{2}$/)?ev.date:(ev.name==="Wedding"?data.weddingDate:"");if(!date||date==="To be announced"){alert("Please add this event's date in Edit Invitation before adding it to your calendar.");return;}const dt=date.replaceAll("-","");const content=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Royal Wedding Invitation//EN","BEGIN:VEVENT",`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@wedding.local`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}/,"")}`,`DTSTART;VALUE=DATE:${dt}`,`SUMMARY:${ev.name} — ${data.brideName} & ${data.groomName}`,`LOCATION:${(ev.venue||data.venueAddress||"").replace(/[,;]/g," ")}`,`DESCRIPTION:${(ev.description||"").replace(/\n/g," ")}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([content],{type:"text/calendar"}));a.download=`${ev.name.toLowerCase()}-wedding.ics`;a.click();URL.revokeObjectURL(a.href);}
function updateCountdown(){const target=data.weddingDate?new Date(`${data.weddingDate}T00:00:00+05:30`):null;const now=new Date();if(!target||isNaN(target)){["days","hours","minutes","seconds"].forEach(id=>$("#"+id).textContent="—");$("#countMessage").textContent="Wedding date to be announced";return}let diff=target-now;if(diff<=0){["days","hours","minutes","seconds"].forEach(id=>$("#"+id).textContent="0");$("#countMessage").textContent=diff> -86400000?"Today is the day! Let the celebrations begin.":"The wedding day has arrived — wishing the couple a lifetime of love.";return}const sec=Math.floor(diff/1000);$("#days").textContent=Math.floor(sec/86400);$("#hours").textContent=Math.floor(sec%86400/3600);$("#minutes").textContent=Math.floor(sec%3600/60);$("#seconds").textContent=sec%60;$("#countMessage").textContent="Every moment brings us closer."}
setInterval(updateCountdown,1000);
$("#rsvpForm").addEventListener("submit",e=>{e.preventDefault();const r={name:$("#guestName").value.trim(),count:$("#guestCount").value,attendance:$("#attendance").value,diet:$("#diet").value,message:$("#guestMessage").value.trim()};if(!r.name){$("#guestName").focus();return}const msg=`Wedding RSVP — ${data.brideName} & ${data.groomName}%0AName: ${encodeURIComponent(r.name)}%0AAttendance: ${encodeURIComponent(r.attendance)}%0ANumber attending: ${r.count}%0ADietary preference: ${encodeURIComponent(r.diet)}%0AMessage: ${encodeURIComponent(r.message||"—")}`;const num=(data.whatsapp||"").replace(/\D/g,"");$("#rsvpStatus").textContent=num?"WhatsApp will open with your message ready to review.":"No RSVP WhatsApp number is configured yet. Open Edit Invitation → Venue & RSVP to add one.";if(num)window.open(`https://wa.me/${num}?text=${msg}`,"_blank","noopener");});
$("#coupleQuizForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const status=$("#quizStatus"), name=$("#quizGuestName").value.trim();
  const answer=n=>document.querySelector(`input[name="${n}"]:checked`)?.value||"";
  const payload={submittedAt:new Date().toISOString(),guestName:name,q1:answer("q1"),q2:answer("q2"),q3:answer("q3"),q4:answer("q4"),q5:answer("q5"),message:$("#quizMessage").value.trim(),wedding:"Sanjana Mishra & Vidyasagar Pant"};
  if(!name){$("#quizGuestName").focus();return}
  if(!data.responseEndpoint||!/^https:\/\/script\.google\.com\/macros\/s\//.test(data.responseEndpoint)){
    status.textContent="The Q&A is ready, but the organiser still needs to connect the private Google Sheet response link. Please try again after the website organiser has set it up.";
    return;
  }
  const button=e.submitter; if(button){button.disabled=true;button.textContent="Sending your love…"}
  try{
    const body=new URLSearchParams({payload:JSON.stringify(payload)});
    await fetch(data.responseEndpoint,{method:"POST",mode:"no-cors",body});
    status.textContent="Thank you, "+name+"! 💖 Your answers have been sent. The couple will love reading them!";
    $("#coupleQuizForm").reset();
  }catch(err){
    status.textContent="We couldn't send your answers just now. Please check your internet connection and try again.";
  }finally{if(button){button.disabled=false;button.textContent="Send our answers 💌"}}
});
function openEditor(){editor.hidden=false;document.body.style.overflow="hidden";fillEditor();}function closeEditor(){editor.hidden=true;document.body.style.overflow="";}
$("#editOpen").onclick=openEditor;$("#footerEdit").onclick=openEditor;$("#editClose").onclick=closeEditor;$("#cancelBtn").onclick=()=>{data=clone(DEFAULT);try{const s=localStorage.getItem("royalWeddingConfig");if(s)data={...clone(DEFAULT),...JSON.parse(s)}}catch{}applyData();closeEditor();};$("#previewBtn").onclick=()=>{applyEditorFields();applyData();closeEditor();window.scrollTo({top:0,behavior:"smooth"});};
$$(".editor-tab").forEach(b=>b.addEventListener("click",()=>{ $$(".editor-tab").forEach(x=>x.classList.toggle("active",x===b));$$(".editor-panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===b.dataset.tab));}));
function fillEditor(){ $$("[data-bind]").forEach(el=>{const k=el.dataset.bind;if(k in data){if(el.type==="checkbox")el.checked=!!data[k];else el.value=data[k]??""}});renderEditorEvents();renderPhotoEditor(); }
function applyEditorFields(){ $$("[data-bind]").forEach(el=>{const k=el.dataset.bind;if(el.type==="checkbox")data[k]=el.checked;else if(el.type==="range")data[k]=Number(el.value);else data[k]=el.value;});}
$$("[data-bind]").forEach(el=>el.addEventListener("input",()=>{applyEditorFields();applyData()}));
$("#saveBtn").onclick=()=>{applyEditorFields();try{localStorage.setItem("royalWeddingConfig",JSON.stringify(data));$("#editorStatus").textContent="Saved in this browser. Export JSON for a portable backup.";applyData();if(data.musicEnabled==="on")startMusic();}catch(e){$("#editorStatus").textContent="Browser storage is full. Use a smaller audio file or place the MP3 in assets and set its relative path in config.js.";applyData();}};
function renderEditorEvents(){const list=$("#eventEditorList");if(!list)return;list.innerHTML="";(data.events||[]).forEach((ev,i)=>{const div=document.createElement("div");div.className="event-edit";div.innerHTML=`<h4>${safe(ev.name)}</h4><label>Event name<input data-ev="${i}" data-key="name" value="${safe(ev.name)}"></label><div class="two"><label>Date (text or YYYY-MM-DD)<input data-ev="${i}" data-key="date" value="${safe(ev.date)}"></label><label>Start time<input data-ev="${i}" data-key="start" value="${safe(ev.start)}"></label><label>End time<input data-ev="${i}" data-key="end" value="${safe(ev.end)}"></label><label>Dress code<input data-ev="${i}" data-key="dress" value="${safe(ev.dress)}"></label></div><label>Venue<input data-ev="${i}" data-key="venue" value="${safe(ev.venue)}"></label><label>Description<textarea data-ev="${i}" data-key="description" rows="2">${safe(ev.description)}</textarea></label><label>Map URL<input data-ev="${i}" data-key="mapUrl" value="${safe(ev.mapUrl||"")}"></label><label>Event photo<input type="file" accept="image/png,image/jpeg,image/webp" data-event-upload="${i}"></label><div class="event-actions"><button data-move="${i}" data-dir="-1">Move up ↑</button><button data-move="${i}" data-dir="1">Move down ↓</button><button data-delete="${i}">Delete event ×</button></div>`;list.append(div);});
const add=document.createElement("button");add.className="button button-outline full";add.textContent="+ Add event";add.onclick=()=>{data.events.push({name:"New event",date:"To be announced",start:"Time to be announced",end:"",venue:"Venue to be announced",description:"Event description",dress:"To be announced",accent:"wedding"});renderEditorEvents();applyData()};list.append(add);
$$("[data-ev]").forEach(el=>el.addEventListener("change",()=>{data.events[+el.dataset.ev][el.dataset.key]=el.value;applyData();}));$$("[data-move]").forEach(b=>b.onclick=()=>{const i=+b.dataset.move,j=i+ +b.dataset.dir;if(j<0||j>=data.events.length)return;[data.events[i],data.events[j]]=[data.events[j],data.events[i]];renderEditorEvents();applyData()});$$("[data-delete]").forEach(b=>b.onclick=()=>{if(confirm("Delete this event?")){data.events.splice(+b.dataset.delete,1);renderEditorEvents();applyData()}});
$$("[data-event-upload]").forEach(el=>el.addEventListener("change",async()=>{if(el.files[0]){const src=await fileToDataUrl(el.files[0]);data.events[+el.dataset.eventUpload].image=src;applyData();}}));
}
function renderPhotoEditor(){const list=$("#photoEditorList");if(!list)return;list.innerHTML="";(data.gallery||[]).forEach((p,i)=>{const row=document.createElement("div");row.className="photo-edit";row.innerHTML=`<img src="${safe(p.src)}" alt=""><input aria-label="Photo caption" value="${safe(p.caption||"")}" data-caption="${i}"><button data-photo-up="${i}" aria-label="Move photo up">↑</button><button data-photo-down="${i}" aria-label="Move photo down">↓</button><button data-photo-remove="${i}" aria-label="Remove photo">×</button>`;list.append(row)});$$("[data-caption]").forEach(el=>el.onchange=()=>{data.gallery[+el.dataset.caption].caption=el.value;applyData()});$$("[data-photo-up]").forEach(b=>b.onclick=()=>movePhoto(+b.dataset.photoUp,-1));$$("[data-photo-down]").forEach(b=>b.onclick=()=>movePhoto(+b.dataset.photoDown,1));$$("[data-photo-remove]").forEach(b=>b.onclick=()=>{data.gallery.splice(+b.dataset.photoRemove,1);renderPhotoEditor();applyData()});}
function movePhoto(i,dir){const j=i+dir;if(j<0||j>=data.gallery.length)return;[data.gallery[i],data.gallery[j]]=[data.gallery[j],data.gallery[i]];renderPhotoEditor();applyData();}
function validImage(file){return file&&["image/jpeg","image/png","image/webp"].includes(file.type)&&file.size<=8*1024*1024}
function fileToDataUrl(file){return new Promise((resolve,reject)=>{if(!validImage(file)){alert("Choose a JPG, PNG, or WebP image up to 8 MB.");reject(Error("Invalid image"));return}const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
$("#heroUpload").onchange=async e=>{if(e.target.files[0])try{data.heroPhoto=await fileToDataUrl(e.target.files[0]);applyData()}catch{}};
$("#sideUpload").onchange=async e=>{if(e.target.files[0])try{data.sidePhoto=await fileToDataUrl(e.target.files[0]);applyData()}catch{}};
$("#galleryUpload").onchange=async e=>{for(const f of [...e.target.files])try{data.gallery.push({src:await fileToDataUrl(f),caption:f.name.replace(/\.[^.]+$/,"")})}catch{}renderPhotoEditor();applyData();};
function updateMusic(){
  const p=$("#musicPlayer");
  // Uploaded audio is saved as a data URL in the editable config. Reapply it
  // after reload; an object URL alone only survives the current page session.
  if(data.musicUrl && validUrl(data.musicUrl)){
    p.src=data.musicUrl;
  } else if(data.musicDataUrl && String(data.musicDataUrl).startsWith("data:audio/")){
    p.src=data.musicDataUrl;
  } else if(musicObjectUrl){
    p.src=musicObjectUrl;
  } else {
    p.removeAttribute("src");
  }
  p.volume=Number(data.volume??.65);
  p.muted=data.musicEnabled!=="on";
  p.loop=true;
  p.onplay=()=>{data.musicEnabled="on";};
  p.load();
}
$("#musicUpload").onchange=async e=>{const f=e.target.files[0];if(!f)return;if(!["audio/mpeg","audio/ogg","audio/wav","audio/mp4","audio/x-wav"].includes(f.type)||f.size>2*1024*1024){alert("For browser saving, choose an MP3/OGG/WAV/M4A file up to 2 MB. For larger tracks, put the file in assets and set its relative path in config.js.");e.target.value="";return}try{data.musicDataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f)});data.musicUrl="";if(musicObjectUrl){URL.revokeObjectURL(musicObjectUrl);musicObjectUrl=""}updateMusic();$("#editorStatus").textContent="Audio loaded. Turn Background music On, then press Save changes. If the invitation is already open, Save will attempt playback.";if(data.musicEnabled==="on")startMusic();}catch(err){alert("Could not read that audio file. Try another MP3.")}};
function startMusic(){
  const p=$("#musicPlayer");
  if(data.musicEnabled!=="on") return;
  if(!p.getAttribute("src")){
    const status=$("#editorStatus");
    if(status) status.textContent="Choose an audio file or set a direct audio URL first.";
    return;
  }
  p.loop=true;
  p.muted=false;
  p.volume=Number(data.volume??.65);
  const attempt=p.play();
  if(attempt && typeof attempt.then==="function"){
    attempt.then(()=>{
      const status=$("#editorStatus");
      if(status) status.textContent="Music is playing.";
    }).catch(()=>{
      const status=$("#editorStatus");
      if(status) status.textContent="The browser blocked automatic playback. Press Play on the visible audio player once.";
    });
  }
}
$("#exportBtn").onclick=()=>{applyEditorFields();const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wedding-config.json";a.click();URL.revokeObjectURL(a.href);$("#editorStatus").textContent="Configuration JSON downloaded. Photo/audio data may make the file large; keep original media files too.";};
$("#importFile").onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const parsed=JSON.parse(await f.text());if(!parsed||typeof parsed!=="object"||!parsed.brideName||!Array.isArray(parsed.events))throw Error("Invalid configuration");data={...clone(DEFAULT),...parsed};applyData();fillEditor();$("#editorStatus").textContent="Configuration imported. Press Save changes to keep it in this browser."}catch(err){alert("Could not import this file. Please choose a valid wedding-config JSON export.")}};
$("#resetBtn").onclick=()=>{if(confirm("Reset all invitation content to the original details? This will discard unsaved editor changes.")){data=clone(DEFAULT);localStorage.removeItem("royalWeddingConfig");applyData();fillEditor();$("#editorStatus").textContent="Restored original wedding details."}};
load();
})();