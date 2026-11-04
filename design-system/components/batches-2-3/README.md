# Batches 2 + 3 implementation

Status: all 25 requested families implemented locally; combined review pending.
Layout is not authorized. No Figma changes, publication or product screens.

## Architecture

Reusable Astro components live in website/src/components/library. Each family
has its own import and documentation route. Notice underpins Alert and Feedback
states. NavLinks underpins sidebar/top navigation. ModalPanel underpins Dialog,
Drawer and ConfirmationDialog. Shared runtime supplies tab activation, local table
sorting, focus handling, toast, menu navigation, pagination and step updates.
Documentation imports these exact components; there is no parallel mockup layer.

## Implemented behaviour

- Badge and labelled status tones; avatar initials/image fallback; semantic cards
  and lists; sortable local table with caption and scroll region.
- Tooltip on hover/focus with Escape dismissal; native progress; reduced-motion
  aware skeleton and loading status.
- Dismissible inline alert, success/error/warning feedback, persistent polite
  toast with explicit dismissal, empty state with action slot.
- Manual-activation tabs, native breadcrumb links, compact previous/next
  pagination, informational stepper, native sidebar/top link navigation.
- Native showModal dialogs/drawers with safe initial focus, inert background,
  Escape and return focus. Confirmation emits an event, not a destructive action.
- Native auto popovers with viewport positioning and light dismissal. Action menu
  supports enabled-item arrows, Home/End, typeahead, Tab and Escape dismissal.

## Integration contract

These are local sources, not a published package. Components use the existing
--docs-* foundation adapters; final semantic/component production aliases remain
pending. Consumers supply unique IDs, meaningful labels, valid initial indexes
and bounded values. Consumers listen for samvad:pagechange, samvad:stepchange,
samvad:select, samvad:confirm or samvad:dismiss and connect real operations.
Dialogs intentionally do not close on backdrop click. Toasts have no auto timeout.

## Pending variants and platform work

No production decisions are silently filled in. Toast queues/timing/action slots,
server table sorting/filtering/virtualisation, URL pagination, interactive step
navigation, nested overlays, legacy Popover API fallback policy and production
package distribution are outside these implemented variants. They are clearly
labelled on pages, not presented as finished capabilities. Full screen reader,
physical device and cross-browser coverage remains outstanding.

## Verification

50 total site routes, 25 new documentation routes, 28 copyable example fragments,
unique IDs and valid ARIA/control references. Ten status-tone foreground/background
pairs pass 4.5:1 in Light/Dark. Browser interaction and responsive/open-overlay
geometry evidence is stored under website/review/library-*-qa.json. Existing
Actions and Batch 1 checks remain part of regression verification.
