/**
 * main.js — Ultragaz Anápolis Landing Page
 * JS mínimo (~2KB): FAQ accordion + lazy-load mapa + scroll suave
 * Sem dependências externas. Vanilla JS puro.
 */

(function () {
  'use strict';

  /* ============================================
     1. FAQ ACCORDION
     Abre e fecha as respostas do FAQ ao clicar
     nas perguntas. Apenas uma aberta por vez.
  ============================================ */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-item__question');
      var answer = item.querySelector('.faq-item__answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq-item--open');

        // Fecha todos os outros
        items.forEach(function (other) {
          other.classList.remove('faq-item--open');
          var otherAnswer = other.querySelector('.faq-item__answer');
          var otherBtn = other.querySelector('.faq-item__question');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Abre o clicado (se estava fechado)
        if (!isOpen) {
          item.classList.add('faq-item--open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================================
     2. LAZY-LOAD DO MAPA (Google Maps iframe)
     O mapa só carrega quando a seção de
     localização entra no viewport. Economiza
     ~600KB de dados para quem não rola até lá.
  ============================================ */
  function initLazyMap() {
    var mapPlaceholder = document.getElementById('map-placeholder');
    if (!mapPlaceholder) return;

    // IntersectionObserver: dispara quando o elemento entra na tela
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var src = mapPlaceholder.dataset.src;
          if (src) {
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '300';
            iframe.style.border = '0';
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('loading', 'lazy');
            iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
            iframe.setAttribute('title', 'Mapa da Ultragaz Anápolis — Rua Martinho Fontes, 374, Santa Maria de Nazareth');
            mapPlaceholder.replaceWith(iframe);
          }
          observer.disconnect();
        }
      });
    }, { rootMargin: '200px' }); // Começa a carregar 200px antes de aparecer

    observer.observe(mapPlaceholder);
  }

  /* ============================================
     3. SCROLL SUAVE PARA ÂNCORAS
     Garante scroll suave mesmo em browsers
     que não suportam scroll-behavior: smooth
  ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ============================================
     4. FADE-IN AO SCROLL
     Elementos com classe "fade-in" ficam invisíveis
     inicialmente e aparecem com animação quando
     entram na viewport. Melhora a experiência visual
     sem prejudicar performance.
  ============================================ */
  function initFadeIn() {
    var elements = document.querySelectorAll('.fade-in');
    if (!elements.length || !('IntersectionObserver' in window)) {
      // Fallback: torna tudo visível se não suportar IntersectionObserver
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Para de observar após animar
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================
     INICIALIZAÇÃO — Executa após DOM carregado
  ============================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initFaq();
    initLazyMap();
    initSmoothScroll();
    initFadeIn();
  });

})();
