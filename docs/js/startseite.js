/* Start view of the working Companion: one coverage sentence above the question cards.
   The sentence reads the pipeline coverage contract (knowledge/data.md, Analysis field
   states and coverage) so it names the included works, not only the released ones. */
(function () {
    'use strict';

    function codedOf(entry) {
        return entry.value + entry.none + entry.undecidable;
    }

    function render(landscape) {
        const target = document.getElementById('start-status');
        if (!target) return;
        const coverage = landscape.meta && landscape.meta.analysis_coverage;
        if (!coverage || !coverage.scope || !coverage.fields) return;
        const fields = Object.keys(coverage.fields)
            .filter(function (name) { return name.indexOf('AN_') === 0; })
            .map(function (name) { return coverage.fields[name]; });
        if (!fields.length) return;
        const coded = Math.min.apply(null, fields.map(codedOf));
        const verified = (landscape.records || []).filter(function (record) {
            return record.lifecycle_state === 'verified' || record.lifecycle_state === 'publication-approved';
        }).length;
        target.textContent = 'Vorläufiger Stand: ' + coded + ' von ' + coverage.scope.work_total +
            ' eingeschlossenen Werken sind codiert und KI-quellengeprüft, ' +
            (verified ? verified + ' davon fachlich verifiziert.' : 'noch keines ist fachlich verifiziert.');
    }

    document.addEventListener('DOMContentLoaded', function () {
        fetch('data/literature_landscape.json')
            .then(function (response) { return response.ok ? response.json() : null; })
            .then(function (data) { if (data) render(data); })
            .catch(function () { /* the sentence stays empty rather than showing a wrong figure */ });
    });
})();
