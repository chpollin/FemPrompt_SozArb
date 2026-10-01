// Tooltips of the shared header navigation, on every page that src/publish/build_pages.py
// generates. Each nav item names its key in data-tip-key; the sentence below describes
// what the item opens. A tooltip shows on hover and on keyboard focus, hides on Escape,
// blur and mouse leave, and is the item's accessible description through
// aria-describedby. The texts carry no counts, so they never go stale with the data.
(function () {
    'use strict';

    const TIPS = {
        chat: 'Fragen an die geprüften Aussagen des Reviews. Ein LLM antwortet nur aus diesen Aussagen und nennt die Belege.',
        wissensnetz: 'Netz der Screening-Kategorien, die in denselben Werken codiert sind, nach Expert:innen, LLM oder Übereinstimmung. Eine Verbindung zählt Werke und behauptet keine Beziehung.',
        literaturbild: 'Evidenz- und Lückenkarte über zwei wählbare Dimensionen, mit Lücken und offenen Zellen markiert. Jede Zelle führt zu ihren Werken.',
        vergleich: 'Landkarte der Screening-Kategorien, Gegenstand gegen Perspektive, wahlweise nach Werken, Einschluss, Übereinstimmung von Expert:innen und LLM oder Aktualität. Eine Zelle zeigt ihre Werke.',
        korpus: 'Alle erfassten Werke mit ihrem Stand in Screening und Auswertung, mit Arbeitslisten, Filtern und Export der Auswahl.',
        prisma: 'PRISM, das Prüfwerkzeug für Screening, Codierung und fachliche Verifikation. Lokal bearbeitbar, gespeichert wird in den eigenen Projektordner.',
        about: 'Projekt, Beteiligte und Prüfstufen des Reviews.',
        methoden: 'Methodik des Reviews von der Suche über das Screening bis zur Analyse.',
        help: 'Anleitung zu den Ansichten und ihrer Bedienung.',
        repo: 'Repository des Projekts auf GitHub.',
        download: 'Paper-Wissenssammlung als ZIP-Archiv herunterladen.',
    };

    function position(tip, anchor) {
        const rect = anchor.getBoundingClientRect();
        const box = tip.getBoundingClientRect();
        let left = rect.left + rect.width / 2 - box.width / 2;
        let top = rect.bottom + 10;
        if (left < 8) left = 8;
        if (left + box.width > window.innerWidth - 8) left = window.innerWidth - box.width - 8;
        if (top + box.height > window.innerHeight - 8) top = rect.top - box.height - 10;
        tip.style.left = left + window.scrollX + 'px';
        tip.style.top = top + window.scrollY + 'px';
    }

    function attach(item) {
        const key = item.dataset.tipKey;
        if (!TIPS[key]) return;
        const tip = document.createElement('div');
        tip.id = 'nav-tip-' + key;
        tip.className = 'rich-tooltip';
        tip.setAttribute('role', 'tooltip');
        tip.hidden = true;
        tip.innerHTML = '<div class="tip-text"></div>';
        tip.firstChild.textContent = TIPS[key];
        document.body.appendChild(tip);
        item.setAttribute('aria-describedby', tip.id);

        function show() {
            document.querySelectorAll('.rich-tooltip[id^="nav-tip-"]').forEach(function (other) { other.hidden = true; });
            tip.hidden = false;
            position(tip, item);
        }
        function hide() { tip.hidden = true; }

        item.addEventListener('mouseenter', show);
        item.addEventListener('mouseleave', function () { if (document.activeElement !== item) hide(); });
        item.addEventListener('focus', show);
        item.addEventListener('blur', hide);
        item.addEventListener('click', hide);
    }

    function init() {
        document.querySelectorAll('.header-nav [data-tip-key]').forEach(attach);
        // Escape dismisses a tooltip opened by hover as well as by focus.
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            document.querySelectorAll('.rich-tooltip[id^="nav-tip-"]').forEach(function (tip) { tip.hidden = true; });
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
