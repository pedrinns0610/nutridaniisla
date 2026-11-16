/* Danielle Isla · Interações leves — sem bibliotecas, backend ou npm. */
(() => {
  'use strict';
  const config = window.DANIELLE_CONFIG || {};
  const $ = (selector, base = document) => base.querySelector(selector);
  const $$ = (selector, base = document) => Array.from(base.querySelectorAll(selector));
  const digits = (value) => String(value || '').replace(/\D/g, '');
  const waNumber = digits(config.whatsapp);
  const hasWhatsapp = /^55\d{10,11}$/.test(waNumber);
  const whatsappLink = (message) => `https://wa.me/${waNumber}${message ? '?text=' + encodeURIComponent(message) : ''}`;
  const secureLink = (value) => {
    try { const url = new URL(String(value || '').trim()); return url.protocol === 'https:' ? url.href : ''; }
    catch { return ''; }
  };
  const addContactLink = (root, label, text, link, external = false) => {
    const a = document.createElement('a');
    a.href = link; a.className = 'contact-detail';
    if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    const small = document.createElement('span'); small.textContent = label;
    const strong = document.createElement('strong'); strong.textContent = text;
    const arrow = document.createElement('span'); arrow.setAttribute('aria-hidden','true'); arrow.textContent = '↗';
    a.append(small, strong, arrow); root.append(a);
  };
  const footerLink = (root, label, url, external = false) => {
    const a = document.createElement('a'); a.href = url; a.textContent = label + ' ↗';
    if (external) {a.target = '_blank'; a.rel = 'noopener noreferrer';}
    root.append(a);
  };

  // Navegação desktop + mobile.
  const header = $('#site-header');
  const toggle = $('.menu-toggle');
  const mobile = $('#mobile-nav');
  const links = $$('.nav-link');
  function closeMenu() {
    header?.classList.remove('menu-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
    mobile?.setAttribute('inert', '');
    document.body.classList.remove('lock-scroll');
  }
  toggle?.addEventListener('click', () => {
    const opening = !header.classList.contains('menu-open');
    if (opening) {
      header.classList.add('menu-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      mobile?.removeAttribute('inert');
      document.body.classList.add('lock-scroll');
    } else closeMenu();
  });
  $$('#mobile-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); }, { passive: true });
  const onScroll = () => header?.classList.toggle('header-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const active = '#' + entry.target.id;
        links.forEach(link => link.getAttribute('href') === active
          ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    ['inicio', 'sobre', 'atendimento', 'contato'].forEach(id => {
      const section = document.getElementById(id); if (section) observer.observe(section);
    });
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.documentElement.classList.add('motion-enabled');
      const reveal = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('is-visible');obs.unobserve(entry.target);} });
      }, { rootMargin: '0px 0px -35px 0px', threshold: .03 });
      $$('[data-reveal]').forEach(el => reveal.observe(el));
    }
  }

  // CTA só abre WhatsApp se o número real estiver definido.
  $$('.js-whatsapp-cta').forEach(a => {
    if (hasWhatsapp) {
      a.href = whatsappLink('Olá, Danielle! Gostaria de saber mais sobre os atendimentos.');
      a.target = '_blank'; a.rel = 'noopener noreferrer';
    } else { a.href = '#contato'; a.removeAttribute('target'); a.removeAttribute('rel'); }
  });


  // WhatsApp flutuante: o convite abre sozinho uma vez por carregamento, some
  // após alguns segundos e reaparece ao passar o mouse ou usar o teclado.
  const floatingWidget = $('#floating-whatsapp');
  const floatingButton = $('#floating-whatsapp-link');
  const floatingBubble = $('#floating-whatsapp-bubble');
  if (floatingWidget && floatingButton && floatingBubble) {
    const defaultMessage = 'Olá, Danielle! Encontrei seu site e gostaria de saber mais sobre o atendimento.';
    const configuredMessage = String(config.whatsappMensagem || '').trim();
    const targetLink = hasWhatsapp ? whatsappLink(configuredMessage || defaultMessage) : '#contato';
    [floatingButton, floatingBubble].forEach(link => {
      link.href = targetLink;
      if (hasWhatsapp) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.removeAttribute('target');
        link.removeAttribute('rel');
      }
    });
    floatingButton.setAttribute('aria-label', hasWhatsapp
      ? 'Conversar com Danielle pelo WhatsApp (abre em nova aba)'
      : 'Ver as opções de contato com Danielle');
    const bubbleText = floatingBubble.querySelector('strong');
    const configuredBubble = String(config.whatsappBalao || '').trim();
    if (bubbleText && configuredBubble) bubbleText.textContent = configuredBubble;

    let introTimer;
    let hideTimer;
    const showBubble = () => {
      floatingWidget.classList.add('is-open');
      floatingBubble.setAttribute('aria-hidden', 'false');
      floatingBubble.tabIndex = 0;
    };
    const hideBubble = () => {
      floatingWidget.classList.remove('is-open');
      floatingBubble.setAttribute('aria-hidden', 'true');
      floatingBubble.tabIndex = -1;
    };
    const openOnInteraction = () => {
      clearTimeout(introTimer);
      clearTimeout(hideTimer);
      showBubble();
    };
    const closeOnLeave = () => {
      clearTimeout(introTimer);
      clearTimeout(hideTimer);
      if (!floatingWidget.contains(document.activeElement)) hideBubble();
    };

    // Apenas dispositivos com mouse recebem a interação de hover.
    if (window.matchMedia('(hover: hover)').matches) {
      floatingWidget.addEventListener('mouseenter', openOnInteraction);
      floatingWidget.addEventListener('mouseleave', closeOnLeave);
    }
    floatingWidget.addEventListener('focusin', openOnInteraction);
    floatingWidget.addEventListener('focusout', event => {
      if (!floatingWidget.contains(event.relatedTarget)) hideBubble();
    });

    // O convite inicial não se repete continuamente nem acompanha a rolagem.
    introTimer = window.setTimeout(() => {
      showBubble();
      hideTimer = window.setTimeout(() => {
        if (!floatingWidget.matches(':hover') && !floatingWidget.contains(document.activeElement)) hideBubble();
      }, 5600);
    }, 950);
  }

  // Foto real da profissional, quando estiver disponível.
  if (typeof config.fotoDanielle === 'string' && config.fotoDanielle.trim()) {
    const frame = $('#danielle-portrait-frame');
    if (frame) {
      const image = document.createElement('img');
      image.className = 'about-portrait';
      image.alt = 'Retrato profissional de Danielle Isla';
      image.width = 850;image.height = 1050;image.loading = 'lazy';image.decoding = 'async';
      image.onerror = () => { image.remove(); }; // Mantém o espaço reservado se o arquivo não existir.
      image.onload = () => { frame.replaceChildren(image); };
      image.src = config.fotoDanielle.trim();
    }
  }

  // Dados oficiais de contato e redes (sem links fictícios).
  const contactRoot = $('#contact-links');
  const socialRoot = $('#footer-social');
  const phone = String(config.telefone || '').trim();
  const email = String(config.email || '').trim();
  const instagram = secureLink(config.instagram);
  const facebook = secureLink(config.facebook);
  if (contactRoot) {
    contactRoot.replaceChildren();
    // Mostra o número apenas uma vez. Prioriza a conversa pelo WhatsApp;
    // quando não houver WhatsApp configurado, permite ligação telefônica.
    if (hasWhatsapp) {
      addContactLink(contactRoot, 'CONTATO', phone || 'Iniciar conversa', whatsappLink('Olá, Danielle! Vim pelo site.'), true);
    } else if (phone && digits(phone).length >= 10) {
      addContactLink(contactRoot, 'CONTATO', phone, 'tel:+55' + digits(phone));
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) addContactLink(contactRoot, 'E-MAIL', email, 'mailto:' + email);
    if (instagram) addContactLink(contactRoot, 'INSTAGRAM', 'Acompanhe no Instagram', instagram, true);
    if (facebook) addContactLink(contactRoot, 'FACEBOOK', 'Acompanhe no Facebook', facebook, true);
    if (!contactRoot.children.length) {
      const fallback = document.createElement('div');fallback.className = 'contacts-pending';
      fallback.textContent = '✳  Canais oficiais em atualização. Prepare e copie sua mensagem pelo formulário.';
      contactRoot.append(fallback);
    }
    const location = String(config.localizacao || '').trim();
    if (location) { const p = document.createElement('p');p.className='contact-location';p.textContent=location;contactRoot.after(p); }
  }
  if (socialRoot) {
    const label = socialRoot.querySelector('.footer-heading');
    socialRoot.replaceChildren();if (label) socialRoot.append(label);
    // Um único atalho de contato no rodapé, sem duplicar o número.
    if (hasWhatsapp) footerLink(socialRoot,'Contato',whatsappLink(),true);
    else if (phone && digits(phone).length >= 10) footerLink(socialRoot,'Contato','tel:+55' + digits(phone));
    if (instagram) footerLink(socialRoot,'Instagram',instagram,true);
    if (facebook) footerLink(socialRoot,'Facebook',facebook,true);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) footerLink(socialRoot,'E-mail','mailto:'+email);
    if (socialRoot.children.length < 2) {const n=document.createElement('span');n.className='footer-muted';n.textContent='Em atualização';socialRoot.append(n);}
    if (String(config.crn || '').trim()) {const n=document.createElement('span');n.className='footer-crn';n.textContent=String(config.crn).trim();socialRoot.append(n);}
  }

  // Serviços podem ser atualizados no config, depois de validados pela Danielle.
  if (Array.isArray(config.servicos) && config.servicos.length) {
    const list = $('.service-list');
    if (list) {
      list.replaceChildren();
      config.servicos.slice(0,8).forEach((service,i) => {
        if (!service || !service.titulo) return;
        const a=document.createElement('a');a.href='#contato';a.className='service-row';
        const number=document.createElement('span');number.className='service-number';number.textContent=String(i+1).padStart(2,'0')+' /';
        const main=document.createElement('span');main.className='service-main';
        const title=document.createElement('strong');title.textContent=service.titulo;
        const description=document.createElement('span');description.textContent=service.descricao || '';
        main.append(title,description);
        const action=document.createElement('span');action.className='service-action';
        const detail=document.createElement('span');detail.className='service-action-label';detail.textContent=service.detalhe||'Saiba mais';
        const arrow=document.createElement('span');arrow.className='round-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';action.append(detail,arrow);
        a.append(number,main,action);list.append(a);
      });
      const disclaimer = $('#services-disclaimer');if(disclaimer) disclaimer.textContent='';
    }
  }

  // Ano sempre atual.
  const year=$('#copyright-year');if(year)year.textContent='© '+new Date().getFullYear()+' Danielle Isla. Todos os direitos reservados.';

  // Formulário estático: formata e abre WhatsApp (sem enviar informação ao servidor).
  const form=$('#contact-form');
  const status=$('#form-status');
  const phoneInput=$('#contact-phone');
  const button=$('#submit-contact');
  const intro=$('#form-intro');
  if (form) form.dataset.whatsapp = hasWhatsapp ? waNumber : '';
  if (button) button.innerHTML = (hasWhatsapp ? 'Enviar pelo WhatsApp' : 'Copiar mensagem')+' <span aria-hidden="true">↗</span>';
  if (intro) intro.textContent = hasWhatsapp ? 'Preencha os campos e continue pelo WhatsApp.' : 'Preencha os campos e copie a mensagem para enviar pelo canal de sua preferência.';
  phoneInput?.addEventListener('input', () => {
    const number=digits(phoneInput.value).slice(0,11);let value=number;
    if (number.length <= 2) value=number ? '('+number : '';
    else if(number.length <= 6)value='('+number.slice(0,2)+') '+number.slice(2);
    else if(number.length <= 10)value='('+number.slice(0,2)+') '+number.slice(2,6)+'-'+number.slice(6);
    else value='('+number.slice(0,2)+') '+number.slice(2,7)+'-'+number.slice(7);
    phoneInput.value=value;
  });
  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const name=String(data.get('name')||'').trim();
    const phone=String(data.get('phone')||'').trim();
    const subject=String(data.get('subject')||'').trim();
    const message=String(data.get('message')||'').trim();
    if(!name || !subject || !message) return;
    const text=['Olá, Danielle! Vim pelo seu site.','',`*Nome:* ${name}`,...(phone?[`*Telefone:* ${phone}`]:[]),`*Assunto:* ${subject}`,`*Mensagem:* ${message}`].join('\n');
    if(hasWhatsapp) {
      // Chamada direta no submit preserva popup em navegadores com proteção contra bloqueio.
      const link=whatsappLink(text);
      // Um clique no link com rel=noopener evita redirecionamento duplicado:
      // window.open(..., 'noopener') pode retornar null mesmo quando a aba abriu.
      const outgoing = document.createElement('a');
      outgoing.href = link;
      outgoing.target = '_blank';
      outgoing.rel = 'noopener noreferrer';
      outgoing.click();
      if(status)status.textContent='WhatsApp aberto. Confira e envie a mensagem para concluir.';
      return;
    }
    try {
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard API indisponível');
      await navigator.clipboard.writeText(text);
      if(status)status.textContent='Mensagem copiada! Configure o número oficial em js/config.js para habilitar o WhatsApp.';
    } catch {
      const temp=document.createElement('textarea');temp.value=text;temp.style.position='fixed';temp.style.left='-9999px';
      document.body.append(temp);temp.select();
      const success=document.execCommand('copy');temp.remove();
      if(status)status.textContent=success?'Mensagem copiada! Falta configurar o WhatsApp oficial.':'Não foi possível copiar automaticamente. Tente abrir a página em HTTPS.';
    }
  });
})();
