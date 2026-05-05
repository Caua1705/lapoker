import { apiFetch, API_ROUTES } from '../config/api.js';

(function () {

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  const IS_MOBILE = window.innerWidth <= 768;

  /* ══ FRAME SEQUENCE — DESKTOP ══ */
  if (!IS_MOBILE) {
    const TOTAL_FRAMES = 150;
    const canvas = document.getElementById('heroCanvas');
    const ctx    = canvas.getContext('2d');
    const frames = [];
    const cur    = { index: 0 };

    function framePath(i) {
      return 'references/image-frames/desktop/frame_' + String(i).padStart(4, '0') + '.webp';
    }
    function drawFrame(index) {
      const img = frames[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      const cw   = rect.width * dpr, ch = rect.height * dpr;
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      const ir = img.naturalWidth / img.naturalHeight, cr = cw / ch;
      let sw, sh, sx, sy;
      if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth - sw) / 2; sy = 0; }
      else         { sw = img.naturalWidth;  sh = sw / cr; sx = 0; sy = (img.naturalHeight - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image(); img.src = framePath(i);
      img.onload = () => { if (i === 0) drawFrame(0); };
      frames.push(img);
    }
    ScrollTrigger.create({
      trigger: '#heroWrapper', start: 'top top', end: 'bottom bottom', scrub: 0.2,
      onUpdate(self) {
        const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(self.progress * TOTAL_FRAMES));
        if (idx !== cur.index) { cur.index = idx; drawFrame(idx); }
      }
    });

    function initExpansion() {
      const frame = document.getElementById('videoFrame');
      const r     = frame.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) { requestAnimationFrame(initExpansion); return; }
      const iLeft = r.left, iTop = r.top, iWidth = r.width, iHeight = r.height;
      Object.assign(frame.style, {
        position: 'fixed', left: iLeft+'px', top: iTop+'px',
        width: iWidth+'px', height: iHeight+'px', maxWidth: 'none', zIndex: '50',
      });
      drawFrame(cur.index);
      gsap.to('.hero-left', {
        opacity: 0, y: -24,
        scrollTrigger: { trigger:'#heroWrapper', start:'top top', end:'18% top', scrub:true }
      });
      gsap.to(frame, {
        left:0, top:0, width: window.innerWidth, height: window.innerHeight,
        borderRadius:0, ease:'none',
        onUpdate: () => drawFrame(cur.index),
        scrollTrigger: { trigger:'#heroWrapper', start:'12% top', end:'bottom bottom', scrub:0.4 }
      });
      const wrapper = document.getElementById('heroWrapper');
      ScrollTrigger.create({
        trigger: '#heroWrapper',
        start: 'bottom bottom',
        onLeave() {
          const absTop = wrapper.offsetHeight - window.innerHeight;
          Object.assign(frame.style, {
            position: 'absolute',
            top: absTop + 'px',
            left: '0px',
            width: '100%',
            height: window.innerHeight + 'px',
            zIndex: '1',
          });
          drawFrame(cur.index);
        },
        onEnterBack() {
          Object.assign(frame.style, {
            position: 'fixed',
            top: '0px',
            left: '0px',
            width: window.innerWidth + 'px',
            height: window.innerHeight + 'px',
            zIndex: '50',
          });
          drawFrame(cur.index);
        },
      });
    }
    if (document.readyState === 'complete') {
      requestAnimationFrame(() => requestAnimationFrame(initExpansion));
    } else {
      window.addEventListener('load', () => requestAnimationFrame(() => requestAnimationFrame(initExpansion)));
    }
    window.addEventListener('resize', () => { ScrollTrigger.refresh(); drawFrame(cur.index); });
  }

  /* ══ FRAME SEQUENCE — MOBILE ══ */
  if (IS_MOBILE) {
    const TOTAL_M = 150;
    const mCanvas = document.getElementById('heroCanvasMobile');
    const mCtx    = mCanvas.getContext('2d');
    const mFrames = [];
    const mCur    = { index: 0 };

    function mFramePath(i) {
      return 'references/image-frames/mobile/frame_' + String(i).padStart(4, '0') + '.webp';
    }
    function mDraw(index) {
      const img = mFrames[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = mCanvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const cw = Math.round(rect.width  * dpr);
      const ch = Math.round(rect.height * dpr);
      if (mCanvas.width !== cw || mCanvas.height !== ch) {
        mCanvas.width = cw; mCanvas.height = ch;
      }
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let sw, sh, sx, sy;
      if (ir > cr) { sh = img.naturalHeight; sw = sh * cr; sx = (img.naturalWidth  - sw) / 2; sy = 0; }
      else         { sw = img.naturalWidth;  sh = sw / cr; sx = 0;                             sy = (img.naturalHeight - sh) / 2; }
      mCtx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    }

    for (let i = 0; i < TOTAL_M; i++) {
      const img = new Image(); img.src = mFramePath(i);
      img.onload = () => { if (i === 0) requestAnimationFrame(() => mDraw(0)); };
      mFrames.push(img);
    }

    ScrollTrigger.create({
      trigger: '#heroWrapper', start: 'top top', end: 'bottom bottom', scrub: 0.3,
      onUpdate(self) {
        const idx = Math.min(TOTAL_M - 1, Math.floor(self.progress * TOTAL_M));
        if (idx !== mCur.index) { mCur.index = idx; mDraw(idx); }
      }
    });

    gsap.to('#heroMobileOverlay', {
      opacity: 0,
      scrollTrigger: {
        trigger: '#heroWrapper', start: 'top top', end: '20% top', scrub: true
      }
    });

    window.addEventListener('resize', () => { ScrollTrigger.refresh(); mDraw(mCur.index); });
  }

  /* ══ HERO ENTRANCE ANIMATIONS ══ */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ['#navbar-wrap','#heroLabel','#heroHeadline','#heroRule','#heroSub','#heroCta','#heroDisclaimer','#videoFrame',
     '#hmBrand','#hmLabel','#hmHeadline','#hmSub','#hmCta','#hmDisclaimer','#hmScrollHint']
      .forEach(s => { const el = document.querySelector(s); if (el) { el.style.opacity = 1; el.style.transform = 'none'; } });
  } else {
    CustomEase.create('lux', 'M0,0 C0.16,1 0.3,1 1,1');

    if (!IS_MOBILE) {
      const tl = gsap.timeline({ defaults: { ease: 'lux' } });
      gsap.set('#navbar-wrap',    { opacity: 0, y: -16 });
      gsap.set('#heroLabel',      { opacity: 0, x: -12 });
      gsap.set('#heroHeadline',   { opacity: 0, y: 24  });
      gsap.set('#heroRule',       { opacity: 0, scaleX: 0, transformOrigin: 'left center' });
      gsap.set('#heroSub',        { opacity: 0, y: 12  });
      gsap.set('#heroCta',        { opacity: 0, y: 10  });
      gsap.set('#heroDisclaimer', { opacity: 0 });
      tl.to('#navbar-wrap',    { opacity:1, y:0,      duration:1.0, ease:'power2.out'   }, 0.1);
      tl.to('#heroLabel',      { opacity:1, x:0,      duration:0.9, ease:'power2.out'   }, 0.6);
      tl.to('#heroHeadline',   { opacity:1, y:0,      duration:1.2, ease:'power3.out'   }, 1.0);
      tl.to('#heroRule',       { opacity:1, scaleX:1, duration:0.8, ease:'power2.inOut' }, 1.8);
      tl.to('#heroSub',        { opacity:1, y:0,      duration:1.0, ease:'power2.out'   }, 2.0);
      tl.to('#heroCta',        { opacity:1, y:0,      duration:0.9, ease:'power2.out'   }, 2.5);
      tl.to('#heroDisclaimer', { opacity:1,            duration:0.8                     }, 2.9);
      tl.to('#videoFrame',     { opacity:1,            duration:1.4, ease:'power2.out'  }, 0.8);
    } else {
      const e = 'power2.out';
      gsap.to('#navbar-wrap',  { opacity:1, y:0, duration:0.7, ease:'power2.out', delay:0.1 });
      gsap.fromTo('.hm-monogram',  { opacity:0 },       { opacity:1,      duration:1.2, ease:'power1.out', delay:0.2 });
      gsap.fromTo('#hmLabel',      { opacity:0 },       { opacity:1,      duration:0.6, ease:e, delay:0.55 });
      gsap.fromTo('#hmHeadline',   { opacity:0, y:12 }, { opacity:1, y:0, duration:0.9, ease:e, delay:0.72 });
      gsap.fromTo('#hmSub',        { opacity:0, y:8  }, { opacity:1, y:0, duration:0.8, ease:e, delay:1.00 });
      gsap.fromTo('#hmCta',        { opacity:0, y:6  }, { opacity:1, y:0, duration:0.7, ease:e, delay:1.35 });
      gsap.fromTo('#hmDisclaimer', { opacity:0 },       { opacity:1,      duration:0.6, ease:e, delay:1.65 });
      gsap.fromTo('#hmScrollHint', { opacity:0 },       { opacity:1,      duration:0.7, ease:e, delay:2.00 });
    }
  }

  /* ══ NAVBAR SCROLL STATE ══ */
  (function () {
    const wrap = document.getElementById('navbar-wrap');
    const THRESHOLD = 60;
    let ticking = false;
    function updateNav() {
      wrap.classList.toggle('scrolled', window.scrollY > THRESHOLD);
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateNav); ticking = true; }
    }, { passive: true });
  })();

  /* ══ SECTION 2 ══ */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ['s2Label','s2Headline','s2Para','s2Card1','s2Card2','s2Card3']
        .forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = 1; });
      return;
    }
    const T = { trigger: '#s2', start: 'top 82%', once: true };
    const e = 'power3.out';
    gsap.fromTo('#s2Label',    { opacity:0, x:-14 }, { opacity:1, x:0, duration:1.1, ease:e, scrollTrigger:T });
    gsap.fromTo('#s2Headline', { opacity:0, y:36  }, { opacity:1, y:0, duration:1.4, ease:e, delay:0.10, scrollTrigger:T });
    gsap.fromTo('#s2Para',     { opacity:0, y:20  }, { opacity:1, y:0, duration:1.1, ease:e, delay:0.28, scrollTrigger:T });
    ['#s2Card1','#s2Card2','#s2Card3'].forEach((s, i) => {
      gsap.fromTo(s, { opacity:0, y:28 }, { opacity:1, y:0, duration:1.0, ease:e,
        delay: 0.42 + i * 0.16,
        scrollTrigger: { trigger:'#s2', start:'top 76%', once:true } });
    });
  })();

  /* ══ SECTION 3 ══ */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ['s3Label','s3Headline','s3Para','s3Card1','s3Card2','s3Card3']
        .forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = 1; });
      document.querySelectorAll('.s3-card-bar').forEach(b => b.style.width = '100%');
      return;
    }
    const T  = { trigger: '#s3', start: 'top 82%', once: true };
    const TC = { trigger: '#s3', start: 'top 74%', once: true };
    const e  = 'power3.out';
    gsap.fromTo('#s3Label',    { opacity:0, x:-14 }, { opacity:1, x:0, duration:1.0, ease:e, scrollTrigger:T });
    gsap.fromTo('#s3Headline', { opacity:0, y:28  }, { opacity:1, y:0, duration:1.2, ease:e, delay:0.10, scrollTrigger:T });
    gsap.fromTo('#s3Para',     { opacity:0, y:16  }, { opacity:1, y:0, duration:1.0, ease:e, delay:0.24, scrollTrigger:T });
    ['#s3Card1','#s3Card2','#s3Card3'].forEach((s, i) => {
      gsap.fromTo(s, { opacity:0, y:32 }, { opacity:1, y:0, duration:1.0, ease:e,
        delay: i * 0.18, scrollTrigger:TC });
      const bar = document.querySelector(s + ' .s3-card-bar');
      if (bar) gsap.fromTo(bar, { width:'0%' }, { width:'100%', duration:0.85,
        ease:'power2.inOut', delay: 0.22 + i * 0.18, scrollTrigger:TC });
    });
  })();

  /* ══ SECTION 4 ENTRANCE ══ */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ['s4Label','s4Headline','s4Para','s4Trust','s4Card'].forEach(id => {
        const el = document.getElementById(id); if (el) el.style.opacity = 1;
      });
      return;
    }
    const T  = { trigger: '#s4', start: 'top 82%', once: true };
    const TC = { trigger: '#s4', start: 'top 76%', once: true };
    const e  = 'power3.out';

    gsap.fromTo('#s4Label',    { opacity:0, x:-14 }, { opacity:1, x:0, duration:1.0, ease:e, scrollTrigger:T });
    gsap.fromTo('#s4Headline', { opacity:0, y:32  }, { opacity:1, y:0, duration:1.3, ease:e, delay:0.10, scrollTrigger:T });
    gsap.fromTo('#s4Para',     { opacity:0, y:18  }, { opacity:1, y:0, duration:1.0, ease:e, delay:0.25, scrollTrigger:T });

    document.querySelectorAll('.s4-trust-item').forEach((el, i) => {
      gsap.fromTo(el, { opacity:0, x:-10 }, { opacity:1, x:0, duration:0.85, ease:e,
        delay: 0.38 + i * 0.12, scrollTrigger:T });
    });
    gsap.set('#s4Trust', { opacity:1 });

    gsap.fromTo('#s4Card',
      { opacity:0, y:40, scale:0.97 },
      { opacity:1, y:0,  scale:1.00, duration:1.3, ease:e, delay:0.18, scrollTrigger:TC }
    );

    if (window.innerWidth > 768) {
      const inputs = document.querySelectorAll('#s4Form .s4-input, #s4Form .s4-select, #s4Form .s4-textarea');
      inputs.forEach((el, i) => {
        gsap.fromTo(el, { opacity:0 }, { opacity:1, duration:0.6, delay: 0.55 + i * 0.07, scrollTrigger:TC });
      });
    }
  })();

  /* ══ SECTION 4 FORM HANDLER ══ */
  (function () {
    const form      = document.getElementById('s4Form');
    const status    = document.getElementById('s4Status');
    const submitBtn = document.getElementById('s4Submit');
    const submitLbl = document.getElementById('s4SubmitLabel');
    if (!form) return;

    function setFieldError(fieldEl, inputEl, show) {
      fieldEl.classList.toggle('has-error', show);
      inputEl.classList.toggle('error', show);
    }

    function validate() {
      let valid = true;

      const nome = document.getElementById('s4Nome');
      const nomeField = document.getElementById('s4FieldNome');
      if (!nome.value.trim() || nome.value.trim().length < 2) {
        setFieldError(nomeField, nome, true); valid = false;
      } else {
        setFieldError(nomeField, nome, false);
      }

      const wpp = document.getElementById('s4Wpp');
      const wppField = document.getElementById('s4FieldWpp');
      const wppClean = wpp.value.replace(/\D/g, '');
      if (!/^\d+$/.test(wppClean) || wppClean.length < 10 || wppClean.length > 15) {
        setFieldError(wppField, wpp, true); valid = false;
      } else {
        setFieldError(wppField, wpp, false);
      }

      const email = document.getElementById('s4Email');
      const emailField = document.getElementById('s4FieldEmail');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        setFieldError(emailField, email, true); valid = false;
      } else {
        setFieldError(emailField, email, false);
      }

      const age = document.getElementById('s4Age');
      const ageField = document.getElementById('s4FieldAge');
      if (!age.checked) { ageField.classList.add('has-error'); valid = false; }
      else ageField.classList.remove('has-error');

      const consent = document.getElementById('s4Consent');
      const consentField = document.getElementById('s4FieldConsent');
      if (!consent.checked) { consentField.classList.add('has-error'); valid = false; }
      else consentField.classList.remove('has-error');

      return valid;
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      status.className = 's4-form-status';
      status.textContent = '';

      if (!validate()) return;

      submitBtn.disabled = true;
      submitLbl.textContent = 'Enviando solicitação...';

      try {
        let instagram = document.getElementById('s4Insta').value.trim();
        if (instagram && !instagram.startsWith('@')) {
          instagram = '@' + instagram;
        }

        await apiFetch(API_ROUTES.accessRequest, {
          method: 'POST',
          body: JSON.stringify({
            name:      document.getElementById('s4Nome').value.trim(),
            phone:     document.getElementById('s4Wpp').value.replace(/\D/g, ''),
            instagram: instagram || null,
            email:     document.getElementById('s4Email').value.trim(),
          }),
        });

        form.style.display = 'none';
        status.className = 's4-form-status success';
        status.innerHTML =
          '<strong>Solicitação recebida.</strong><br><br>' +
          'Você receberá uma mensagem no WhatsApp com a confirmação.<br>' +
          'Seu acesso está em análise e, se aprovado, enviaremos o convite com todos os detalhes.';
        gsap.fromTo(status, { opacity:0, y:12 }, { opacity:1, y:0, duration:0.9, ease:'power2.out' });

      } catch (err) {
        submitBtn.disabled = false;
        submitLbl.textContent = 'Enviar solicitação';
        status.className = 's4-form-status error';
        status.textContent = err.message || 'Não foi possível enviar agora. Tente novamente em instantes.';
        gsap.fromTo(status, { opacity:0 }, { opacity:1, duration:0.5 });
      }
    });

    ['s4Nome','s4Wpp','s4Email'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', () => {
        el.classList.remove('error');
        el.closest('.s4-field')?.classList.remove('has-error');
      });
    });
  })();

  /* ══ SECTION 5 ══ */
  (function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ['s5Monogram','s5Label','s5Headline','s5Para','s5Cta','s5-footer']
        .concat(['s5Note1','s5Note2','s5Note3','s5Note4'])
        .forEach(id => { const el = document.getElementById(id); if (el) el.style.opacity = 1; });
      const rule = document.getElementById('s5-rule');
      if (rule) rule.style.width = '100%';
      const al = document.getElementById('s5AccentLine');
      if (al) al.style.width = '120px';
      const s5 = document.getElementById('s5');
      if (s5) s5.style.setProperty('--s5-wm-op','1');
      return;
    }

    const T  = { trigger: '#s5', start: 'top 88%', once: true };
    const TN = { trigger: '#s5', start: 'top 78%', once: true };
    const e  = 'power3.out';

    const wm = document.createElement('div');
    Object.assign(wm.style, {
      position: 'absolute', left:'50%', top:'44%',
      transform: 'translate(-50%,-50%)',
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 'clamp(240px, 34vw, 520px)',
      fontWeight: '300',
      letterSpacing: '-0.07em',
      color: 'rgba(201,168,76,0.10)',
      pointerEvents: 'none',
      userSelect: 'none',
      lineHeight: '1',
      whiteSpace: 'nowrap',
      opacity: '0',
      zIndex: '0',
    });
    wm.textContent = 'AP';
    wm.setAttribute('aria-hidden','true');
    const s5el = document.getElementById('s5');
    if (s5el) s5el.appendChild(wm);

    gsap.fromTo(wm, { opacity:0 }, { opacity:1, duration:2.8, ease:'power1.out', scrollTrigger:T });
    gsap.fromTo('#s5-rule', { width:'0%' }, { width:'100%', duration:1.4, ease:'power2.inOut', scrollTrigger:T });
    gsap.fromTo('#s5Monogram', { opacity:0 }, { opacity:1, duration:1.2, ease:e, delay:0.10, scrollTrigger:T });
    gsap.fromTo('#s5Label', { opacity:0 }, { opacity:1, duration:1.0, ease:e, delay:0.25, scrollTrigger:T });
    gsap.fromTo('#s5AccentLine', { width:'0px' }, { width:'120px', duration:1.0, ease:'power2.inOut', delay:0.40, scrollTrigger:T });
    gsap.fromTo('#s5Headline', { opacity:0, y:22 }, { opacity:1, y:0, duration:1.4, ease:e, delay:0.18, scrollTrigger:T });
    gsap.fromTo('#s5Para', { opacity:0, y:14 }, { opacity:1, y:0, duration:1.2, ease:e, delay:0.36, scrollTrigger:T });

    ['#s5Note1','#s5Note2','#s5Note3','#s5Note4'].forEach((sel, i) => {
      gsap.fromTo(sel, { opacity:0, y:8 }, {
        opacity:1, y:0, duration:0.9, ease:e,
        delay: 0.50 + i * 0.14,
        scrollTrigger: TN
      });
    });

    gsap.fromTo('#s5Cta', { opacity:0 }, { opacity:1, duration:0.9, ease:e, delay:1.10, scrollTrigger:TN });
    gsap.fromTo('#s5-footer', { opacity:0 }, { opacity:1, duration:1.1, ease:e, delay:1.40, scrollTrigger:TN });
  })();

  /* ══ DESKTOP REFINEMENTS ══ */
  if (!IS_MOBILE) {

    (function () {
      const bar = document.getElementById('scrollProgress');
      if (!bar) return;
      const update = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (total > 0) bar.style.width = (window.scrollY / total * 100) + '%';
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
    })();

    (function () {
      document.querySelectorAll('.s3-card-num').forEach((el, i) => {
        const target = parseInt(el.textContent, 10);
        if (isNaN(target)) return;
        el.textContent = '00';
        ScrollTrigger.create({
          trigger: el.closest('.s3-card') || '#s3',
          start: 'top 80%',
          once: true,
          onEnter() {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: target,
              duration: 1.0,
              ease: 'power2.out',
              delay: i * 0.18,
              onUpdate() {
                el.textContent = String(Math.round(obj.val)).padStart(2, '0');
              },
            });
          },
        });
      });
    })();

    (function () {
      ['.s2-headline', '.s3-headline', '.s4-headline', '.s5-headline'].forEach(sel => {
        const el = document.querySelector(sel);
        if (!el) return;
        gsap.to(el, {
          y: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el,
            start: 'top bottom',
            end:   'bottom top',
            scrub: 0.6,
          },
        });
      });
    })();

  }

})();
