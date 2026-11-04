# Batch 1: Inputs and forms + Selection

Status: implemented locally for combined review. Actions is reviewed and ready.
No Figma changes, official token release, product screens or publication.

## Reusable sources

`website/src/components/forms/Field.astro` handles label, helper, control, error,
sizing and described-by relationships. TextInput, Textarea, SearchInput,
PasswordInput, NumberInput, OTPInput, Select, DatePicker and FileUpload delegate
it. FormField exposes the wrapper as a slot: consumers must wire the control ID,
required/disabled attributes, aria-describedby and any initial aria-invalid.
ChoiceGroup underlies Checkbox, RadioGroup, MultiSelect and SegmentedControl.
Switch uses a native checkbox with switch semantics. Chips supports selectable
checkboxes or removable buttons with focus recovery. Reset restores removed chips
in the documentation preview.

Native HTML behaviour is intentional: date locale and calendar UI follow the
platform; multi-select is a visible checkbox set, not a custom combobox; OTP is
one numeric-text field preserving zeros, paste and autofill. FileUpload only
selects files. No upload, verification, authentication or search service is claimed.

## Validation and interaction

`runtime.ts` exports validateField, validateGroup and validateForm. Native validity
supplies text/range/pattern/email/file-required checks. At-least-one checkbox
validation is explicit. Show errors on submission; revalidate erroneous values
after input. This avoids blur-time layout changes swallowing a pointer click.
The preview prevents submission, announces outcomes, supports disabled/read-only
where relevant and resets state. Password reveal preserves value and focus.
Native radio arrows, checkbox/switch Space, and standard editing remain intact.

## Private styling and pending decisions

Reuse approved neutral, mulberry and error ramps, Geist, the spacing grid,
44/48/56px minimum field treatments, radius 8/full and 120ms switch motion.
The reviewed field shadow and inset caret are reused. These role assignments are
preview specifications; final semantic/component token aliases and production
package API remain pending. No official tokens were invented. forms.css relies
on the existing documentation foundation adapters (`--docs-*`); a standalone
package must replace these with the future approved token contract.

## Review evidence

16 searchable, linked documentation routes; 25 total website routes. Each has a
real component preview, relevant states, property table, usage/accessibility
notes, implementation examples and pending foundation mappings. Compiler checks
cover all 32 copyable snippets. Native platform variants and actual assistive
technology still require platform testing. Responsive and interaction results
are recorded in website/review/batch-*-qa.json (local review artifacts).
