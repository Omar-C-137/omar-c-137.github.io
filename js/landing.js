/* ══════════════════════════════════════════
   T-O — LANDING PAGE LOGIC
   Handles: modal flow, role selection, signup/login,
   and real Google Sign-In via Google Identity Services.
══════════════════════════════════════════ */

let chosenRole=null;

/* ─── GOOGLE SIGN-IN CONFIG ───
   1. Go to https://console.cloud.google.com/apis/credentials
   2. Create an OAuth 2.0 Client ID (type: Web application)
   3. Add your site's URL under "Authorized JavaScript origins"
      e.g. https://yourdomain.com  (Google Sign-In does NOT work on file:// or localhost without setup)
   4. Paste the Client ID below
*/
const GOOGLE_CLIENT_ID = '987120778850-jua4bnal1cp5hjqv4o6nojdlajiumvm0.apps.googleusercontent.com';

function initGoogleSignIn(){
  if(typeof google==='undefined'||!google.accounts){
    console.warn('Google Identity script not loaded yet.');
    return;
  }
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleGoogleCredential,
    auto_select: false,
  });
}

/* Called automatically by Google after a successful sign-in */
function handleGoogleCredential(response){
  try{
    const payload=parseJwt(response.credential);
    const account={
      name: payload.name || 'Google User',
      email: payload.email,
      role: chosenRole || localStorage.getItem('to_pending_role') || 'trainee',
      provider:'google',
      avatar: payload.picture || null,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('to_account', JSON.stringify(account));
    localStorage.setItem('to_logged_in','true');
    localStorage.setItem('to_active_role', account.role);
    redirectByRole(account.role);
  }catch(e){
    alert('Google sign-in failed to process. Please try again.');
    console.error(e);
  }
}

/* Decode the JWT Google sends back (no verification needed client-side; the server should verify in production) */
function parseJwt(token){
  const base64Url=token.split('.')[1];
  const base64=base64Url.replace(/-/g,'+').replace(/_/g,'/');
  const jsonPayload=decodeURIComponent(atob(base64).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

/* Trigger the Google One Tap / popup sign-in flow */
function triggerGoogleSignIn(roleContext){
  if(roleContext) chosenRole=roleContext;
  if(GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE_CLIENT_ID')){
    alert('Google Sign-In is not configured yet.\n\nTo enable it:\n1. Create OAuth credentials at console.cloud.google.com\n2. Add your site URL as an authorized origin\n3. Paste your Client ID into js/landing.js (GOOGLE_CLIENT_ID)\n\nGoogle Sign-In only works when this site is hosted on a real domain — it will not work opened as a local file.');
    return;
  }
  if(typeof google==='undefined'||!google.accounts){
    alert('Google Sign-In script failed to load. Check your internet connection.');
    return;
  }
  google.accounts.id.prompt();
}

/* ── ENTRY MODAL (Sign In) ── */
function openAuth(){ document.getElementById('auth-modal').classList.add('open') }
function closeAuth(){ document.getElementById('auth-modal').classList.remove('open') }

function goToSignupRole(){ openRoleModal() }

/* ── ROLE MODAL ── */
function openRoleModal(){
  chosenRole=null;
  document.querySelectorAll('.role-opt').forEach(el=>el.classList.remove('selected'));
  const cbtn=document.getElementById('role-continue-btn');
  cbtn.style.opacity='.4'; cbtn.style.pointerEvents='none';
  document.getElementById('role-modal').classList.add('open');
}
function closeRoleModal(){ document.getElementById('role-modal').classList.remove('open') }

function selectRole(role){
  chosenRole=role;
  localStorage.setItem('to_pending_role',role);
  document.querySelectorAll('.role-opt').forEach(el=>el.classList.remove('selected'));
  document.getElementById('role-'+role).classList.add('selected');
  const btn=document.getElementById('role-continue-btn');
  btn.style.opacity='1'; btn.style.pointerEvents='all';
}

/* ── SIGNUP FORM MODAL ── */
function goToSignupForm(){
  if(!chosenRole)return;
  closeRoleModal();
  const labels={gym:'Signing up as Gym',coach:'Signing up as Coach',trainee:'Signing up as Trainee'};
  document.getElementById('signup-role-label').textContent=labels[chosenRole];
  document.getElementById('signup-modal').classList.add('open');
}
function closeSignupModal(){ document.getElementById('signup-modal').classList.remove('open') }
function backToRoleModal(){ closeSignupModal(); openRoleModal() }

/* ── FACEBOOK (still a UI placeholder — see note) ── */
function socialAuth(provider){
  if(provider==='Google'){
    triggerGoogleSignIn(chosenRole);
    return;
  }
  alert(provider+' sign-in requires a backend server with OAuth credentials.\n\nThis is a static front-end — once T-O is hosted on a server with Facebook OAuth set up, this button will work for real.\n\nFor now, continue with email below, or use Google Sign-In which is wired up.');
}

/* ── EMAIL/PASSWORD LOGIN (local-only fallback, no backend yet) ── */
function submitLogin(){
  const email=document.getElementById('login-email').value.trim();
  const password=document.getElementById('login-password').value;
  if(!email||!password){alert('Please enter your email and password.');return}
  const btn=document.getElementById('login-submit-btn');
  btn.innerHTML='<span class="btn-spinner"></span>Signing in...';
  const account=JSON.parse(localStorage.getItem('to_account')||'null');
  setTimeout(()=>{
    if(account&&account.email===email){
      localStorage.setItem('to_logged_in','true');
      localStorage.setItem('to_active_role',account.role);
      redirectByRole(account.role);
    }else{
      btn.innerHTML='Sign In →';
      alert('No account found with that email.\n\nNote: T-O currently runs without a backend server, so email accounts are only saved on this browser. Try Sign Up first, or use Google Sign-In.');
    }
  },600);
}

/* ── EMAIL/PASSWORD SIGNUP (local-only fallback, no backend yet) ── */
function submitSignup(){
  const name=document.getElementById('signup-name').value.trim();
  const email=document.getElementById('signup-email').value.trim();
  const password=document.getElementById('signup-password').value;
  if(!name||!email||!password){alert('Please fill in all fields.');return}
  if(!chosenRole){alert('Please go back and select a role.');return}
  const btn=document.getElementById('signup-submit-btn');
  btn.innerHTML='<span class="btn-spinner"></span>Creating account...';
  setTimeout(()=>{
    const account={name:name,email:email,role:chosenRole,provider:'email',createdAt:new Date().toISOString()};
    localStorage.setItem('to_account',JSON.stringify(account));
    localStorage.setItem('to_logged_in','true');
    localStorage.setItem('to_active_role',chosenRole);
    redirectByRole(chosenRole);
  },600);
}

/* ── REDIRECT BASED ON ROLE ── */
function redirectByRole(role){
  if(role==='trainee'){
    window.location.href='app.html';
  } else if(role==='coach'){
    alert('Coach Dashboard is coming soon.\n\nFor now you will be taken to the trainee view as a preview.');
    window.location.href='app.html';
  } else if(role==='gym'){
    alert('Gym Dashboard is coming soon.\n\nFor now you will be taken to the trainee view as a preview.');
    window.location.href='app.html';
  }
}

/* ── MODAL OVERLAY CLICK-OUTSIDE-TO-CLOSE ── */
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('auth-modal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeAuth()});
  document.getElementById('role-modal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeRoleModal()});
  document.getElementById('signup-modal')?.addEventListener('click',e=>{if(e.target===e.currentTarget)closeSignupModal()});

  // Init Google Sign-In once the GSI script has loaded
  if(typeof google!=='undefined'){
    initGoogleSignIn();
  }else{
    window.addEventListener('load',()=>setTimeout(initGoogleSignIn,300));
  }
});
