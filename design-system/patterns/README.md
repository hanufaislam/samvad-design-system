# Samvad patterns — approved documentation

Six routes: /patterns/, /patterns/forms/, /patterns/navigation/, /patterns/loading/,
/patterns/empty-states/ and /patterns/error-and-success-states/.

These are small reference compositions, not product screens. Preview sources and
shared runtime live in website/src/components/patterns/. Every composed specimen
uses existing components; visible source is imported directly from its Astro file.
The forms example reuses validateForm; loading reuses setButtonLoading; navigation
listens to the existing samvad:pagechange event. Examples use local state only.

The 629-token sources, exports and completed component implementations are
unchanged. This batch is approved. See ../../QA_REPORT.md for evidence.
