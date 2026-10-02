/* Start view of the working Companion: the status sentence under the main question and
   the finding line of each question card. Both read the release model that research-app
   loads, so the coverage figures follow the pipeline coverage contract (knowledge/data.md,
   Analysis field states and coverage) and the findings follow the same assignment as the
   answer pages. Without the model both stay empty rather than show a wrong figure. */
(function () {
    'use strict';

    const EC = window.EC = window.EC || {};

    function statusSentence(model) {
        // Only the baseline fields every coded annotation carries decide whether a work
        // counts as coded, so a field added by a later codebook version, not collected
        // for earlier annotations, does not turn coded works into uncoded ones.
        const fields = model.dims.filter(function (dim) { return dim.id.indexOf('AN_') === 0 && !dim.introducedIn; })
            .map(function (dim) { return dim.id; });
        if (!fields.length) return '';
        const summary = model.codedSummary(model.includes, fields, true);
        const scope = summary.source === 'pipeline' ? ' eingeschlossenen Werken codiert'
            : ' veröffentlichten eingeschlossenen Werken codiert';
        const verified = model.includes.filter(function (work) { return work.status === 'verified'; }).length;
        return 'Vorläufig: ' + summary.coded + ' von ' + summary.total + scope + ', ' +
            (verified ? 'davon ' + verified + ' fachlich verifiziert.' : 'keines fachlich verifiziert.');
    }

    // Reviewed and verified findings are named apart, so an AI source review never reads as verification.
    function findingLine(findings) {
        if (!findings.length) return 'noch kein geprüfter Befund';
        const verified = findings.filter(function (item) {
            return item.status === 'verified' || item.status === 'publication-approved';
        }).length;
        const reviewed = findings.length - verified;
        const parts = [];
        if (reviewed) parts.push(reviewed + (reviewed === 1 ? ' KI-geprüfter Befund' : ' KI-geprüfte Befunde'));
        if (verified) parts.push(verified + (verified === 1 ? ' fachlich verifizierter Befund' : ' fachlich verifizierte Befunde'));
        return parts.join(', ');
    }

    EC.renderStart = function (model) {
        const status = document.getElementById('start-status');
        if (status) status.textContent = statusSentence(model);
        if (!EC.findingsFor) return;
        document.querySelectorAll('#view-start .start-card[data-sq]').forEach(function (card) {
            const line = card.querySelector('.start-card-status');
            if (!line) return;
            const findings = EC.findingsFor(card.dataset.sq);
            // A question without coded fields says so rather than report an empty finding count.
            const uncoded = EC.questionCoded ? !EC.questionCoded(card.dataset.sq) : false;
            line.textContent = uncoded && !findings.length ? 'noch nicht codiert' : findingLine(findings);
        });
    };
})();
