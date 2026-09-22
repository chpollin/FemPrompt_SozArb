# Manual checklist for native browser permissions

The automated browser pilot covers the editor workflow with a faithful directory-handle replacement. This checklist is limited to behaviour owned by the browser's native folder picker and permission store. Run it in Chrome or Edge against a local repository clone. Record the date, browser, and result in `knowledge/journal.md`.

## First connection

1. Open PRISM with a fresh browser profile. Expected result: read mode, with no reviewer or folder setup. Click `Bearbeiten`, then enter a mixed-case key such as `CP`. Expected result: PRISM shows the canonical target `docs/data/screening/cp.json` and keeps the disk icon disabled.
2. Choose the repository root through `Arbeitsordner wählen`. Expected result: the browser asks for write access once, PRISM resolves or creates `docs/data/screening/`, and the disk icon becomes available when the paper-level gates are complete.
3. Repeat with `docs/data/screening/` selected directly. Expected result: the same reviewer file is targeted.

## Permission persistence

1. Reload the page after a successful connection. Expected result: read mode with no write-permission request. Click `Bearbeiten`: the saved handle is recognised; a browser permission prompt may require one confirmation.
2. Close and reopen the browser. Expected result: PRISM starts read-only. After `Bearbeiten`, it either reconnects automatically with an existing grant or offers one `Arbeitsordner freigeben` action. The selected key and browser recovery copy remain available.
3. Deny the permission request. Expected result: no repository file is changed, the disk icon remains unavailable, and the status explains that write permission is missing.

## Physical write

1. In edit mode, complete one paper and press the disk icon beside the paper position. Expected result: the status advances to the saved state and `docs/data/screening/<key>.json` contains the paper with the current reviewer schema, `text_source`, evidence, and deterministic paper ordering.
2. Save several papers in quick succession. Expected result: every decision appears in the final file. No earlier decision disappears.
3. Revoke write permission and save again. Expected result: the interface reports the write error and the browser recovery copy retains the changed decision.
4. Restore permission and save once more. Expected result: the following save succeeds and updates the reviewer file.

## Existing files

1. Place a valid lowercase reviewer file in `docs/data/screening/` before connecting. Expected result: PRISM loads its decisions and preserves its reviewer key.
2. Place a malformed JSON file in a disposable test clone. Expected result: PRISM reports the file as unreadable, preserves the browser copy, and blocks every write to that reviewer key. The automated pilot verifies the fail-closed state; this manual item confirms only its behaviour through the native folder permission path.

## Verification path

Run this section against a clone whose `docs/data/screening/` holds the productive agent file and a working copy of your own expert file. Use a disposable clone if you do not want the recorded events kept.

1. Open `prisma.html?verify=1`, click `Bearbeiten`, set your own reviewer key and connect the repository root. Expected result: the status names `docs/data/screening/<key>.json` as the target, and the assessment rail of a paper with an agent record is headed `Agentenkodierung` with the agent track name beside it, without selecting that track anywhere. No `Überarbeiten` action is offered.
2. Read the verification panel of that paper. Expected result: sources, derived artifacts, prompt and model appear as readable text with paths, versions and short hashes. No field shows `[object Object]`. The expert controls are headed `Fachliche Verifikation`.
3. Navigate to a paper that has no agent record. Expected result: the rail names the missing agent coding and offers no capture controls.
4. Record an outcome with your reviewer and actor identifiers, an activity identifier and a reason. Expected result: the status confirms the write and names your own file. Inspect the two files on disk: your file carries `verification_schema` and one entry in `verifications` that names the agent track, the judged annotation and the complete event, and the agent file is unchanged by byte comparison against a copy taken before the session.
5. Choose `Korrigiert und akzeptiert` on a second paper and edit the annotation JSON. Expected result: the entry in your file carries the superseding annotation with its field-level differences, and the agent file is still unchanged.
6. Reload the page and reconnect. Expected result: both papers show the achieved lifecycle state and the recorded events, and the agent file remains unchanged after the reload.
7. Resize the window to a laptop height of roughly 800 pixels. Expected result: the workspace fits the screen without the page itself scrolling, and the reading column scrolls vertically without a horizontal scrollbar.

Two simultaneously open tabs with the same reviewer key remain outside the supported workflow. Use one PRISM tab per reviewer to avoid last-write-wins conflicts between browser processes.
