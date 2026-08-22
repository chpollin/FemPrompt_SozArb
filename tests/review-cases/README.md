# Real-paper operator review cases

These fixtures contain proposed judgements for papers from the real corpus. They are test material and never become canonical research decisions without explicit human acceptance.

The original pair covers Yu and Rose as an Include and Singer et al. as a publication-type override to Exclude. `reviewer1.json` stores the proposed schema-0.3 records. `manifest.json` pins the source hashes and the exact whitespace-normalised passages that support every proposed value.

The current browser workflow has no import control. Review fixtures are inspected through a dedicated read-only acceptance view when a browser-facing copy exists, or by comparing the JSON and manifest with the directly linked paper. This separation prevents test judgements from entering `docs/data/screening/` through an ordinary editor action.

The second pair under `acceptance-2/` has direct local PRISM links and is the active operator review set.
