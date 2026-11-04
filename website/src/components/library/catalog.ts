import {layoutCatalog} from '../layout/catalog.ts';
export const libraryCatalog = [
  {
    "group": "data-display",
    "slug": "badge",
    "title": "Badge",
    "component": "Badge",
    "description": "A short, passive label with a clear purpose.",
    "props": {
      "label": "Preview",
      "tone": "info",
      "size": "medium"
    },
    "variants": "Tones: neutral, info, success, warning and error. Sizes: small and medium.",
    "states": "Static label; no hover, pressed, disabled or loading state.",
    "use": "Use for a compact category or status label.",
    "avoid": "Do not use as a clickable chip or the sole indication of a critical error.",
    "a11y": "Text conveys meaning without relying on colour; passive badges are not focus stops.",
    "notes": "Plain inline text. No automatic live announcement; choose a status region only when the surrounding update requires it.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "status-indicator",
    "title": "Status indicator",
    "component": "StatusIndicator",
    "description": "Pair a small status marker with a readable label.",
    "props": {
      "label": "Available",
      "tone": "success"
    },
    "variants": "Tones: neutral, info, success, warning and error. One content-sized treatment.",
    "states": "Static status; no interactive states.",
    "use": "Use beside an item whose state needs a short explanation.",
    "avoid": "Do not rely on the dot alone or announce every passive row status.",
    "a11y": "The dot is decorative; the label carries the complete meaning.",
    "notes": "Render a new label/tone when state changes; announce important changes in the consuming region.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "avatar",
    "title": "Avatar",
    "component": "Avatar",
    "description": "Identify a person with an image or resilient initials.",
    "props": {
      "name": "Samvad Contributor",
      "size": "medium"
    },
    "variants": "Small 32px, medium 40px, large 64px; image or initials; optional decorative mode.",
    "states": "Image loaded or initials fallback. Not an interactive control.",
    "use": "Use to identify a person or contributor alongside context.",
    "avoid": "Do not make the avatar itself an unnamed menu trigger.",
    "a11y": "A non-decorative avatar has an image role and accessible name; use decorative=true when adjacent text duplicates that name.",
    "notes": "Initials remain underneath the image. Broken images are hidden by the shared runtime; loading is lazy.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "card",
    "title": "Card",
    "component": "Card",
    "description": "Group a small amount of related content.",
    "props": {
      "title": "A useful starting point",
      "description": "Keep one idea and its supporting detail together.",
      "variant": "outlined"
    },
    "variants": "Outlined or subtle surface. Content-driven dimensions.",
    "states": "Static container; nested actions provide their own states.",
    "use": "Use to group a self-contained topic.",
    "avoid": "Do not make the entire card a button or nest unrelated card grids.",
    "a11y": "Semantic article and heading; put meaningful actions in the slot.",
    "notes": "The default title is h3. Place it under an appropriate heading hierarchy or adapt the component for the consumer\u2019s outline.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "list",
    "title": "List",
    "component": "List",
    "description": "Present related items with clear reading order.",
    "props": {
      "label": "Foundation references",
      "items": [
        {
          "title": "Colour",
          "description": "Purposeful colour roles.",
          "href": "/foundations/colour/"
        },
        {
          "title": "Typography",
          "description": "A readable scale.",
          "href": "/foundations/typography/"
        }
      ]
    },
    "variants": "Unordered by default; ordered=true for meaningful sequence. Content-driven.",
    "states": "Static rows; optional native links have hover, focus and activation.",
    "use": "Use for related items that do not need column comparison.",
    "avoid": "Use Table when each row shares several comparable attributes.",
    "a11y": "Native ul/ol and li structure; optional links use descriptive text.",
    "notes": "Items accept title, description and optional href. No virtualisation or selection model is implied.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "table",
    "title": "Table",
    "component": "Table",
    "description": "Compare structured records with optional column sorting.",
    "props": {
      "caption": "Component reference",
      "columns": [
        {
          "key": "name",
          "label": "Name",
          "sortable": true
        },
        {
          "key": "count",
          "label": "Variants",
          "sortable": true
        }
      ],
      "rows": [
        {
          "name": "Button",
          "count": 4
        },
        {
          "name": "Badge",
          "count": 5
        },
        {
          "name": "Card",
          "count": 2
        }
      ],
      "density": "comfortable"
    },
    "variants": "Comfortable or compact cell density. Sortable columns are opt-in.",
    "states": "Unsorted, ascending and descending. Header buttons support focus/hover/pressed.",
    "use": "Use for row-and-column comparison.",
    "avoid": "Do not use tables for page layout or imply server sorting/pagination.",
    "a11y": "Caption, column headers and aria-sort are provided. The labelled scroll region is keyboard reachable on small screens.",
    "notes": "Sorting is local and stable using text comparison with numeric ordering. It does not fetch, filter or mutate source records.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "tooltip",
    "title": "Tooltip",
    "component": "Tooltip",
    "description": "Offer a short optional explanation on hover or focus.",
    "props": {
      "id": "example-tooltip",
      "label": "About this preview",
      "text": "Examples use reusable local components."
    },
    "variants": "One concise text treatment; no rich content.",
    "states": "Hidden, hover/focus-visible, Escape dismissed.",
    "use": "Use for supplementary context that is not essential to completing a task.",
    "avoid": "Do not hide instructions, errors or interactive content inside a tooltip.",
    "a11y": "Trigger is a real button with aria-describedby. The bubble stays visible while hovered; Escape dismisses it.",
    "notes": "No click action is implied. Touch users still have the visible trigger label; essential text must remain in the page.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "progress-indicator",
    "title": "Progress indicator",
    "component": "ProgressIndicator",
    "description": "Show measurable completion or indeterminate activity.",
    "props": {
      "id": "example-progress",
      "label": "Example progress",
      "value": 40,
      "max": 100
    },
    "variants": "Determinate or indeterminate (omit value). One bar height.",
    "states": "0\u2013100% or indeterminate. Not an interactive control.",
    "use": "Use when a task has meaningful measurable progress.",
    "avoid": "Use Loading state when only a short busy message is known.",
    "a11y": "Native labelled progress element exposes value/max; visible text explains the value.",
    "notes": "Consumers update value from real progress. The slider in this documentation is explicitly a local demonstration.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "data-display",
    "slug": "skeleton-loader",
    "title": "Skeleton loader",
    "component": "SkeletonLoader",
    "description": "Reserve a quiet visual placeholder while content loads.",
    "props": {
      "label": "Loading reference content",
      "lines": 3,
      "variant": "text"
    },
    "variants": "Text lines or avatar shape. Lines clamp to 1\u201310.",
    "states": "Loading placeholder only; replace with real content after loading.",
    "use": "Use for predictable content structure.",
    "avoid": "Do not show fake loaded content or use indefinite placeholders without status.",
    "a11y": "Decorative shapes are hidden from assistive technology; one status names the loading region. Reduced motion removes pulsing.",
    "notes": "The preview pulse is 960ms (three existing slow durations); this is a provisional presentation mapping.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "feedback",
    "slug": "alert",
    "title": "Alert",
    "component": "Alert",
    "description": "Keep contextual feedback near the content it affects.",
    "props": {
      "title": "A helpful note",
      "message": "This example is local and does not change any saved data.",
      "tone": "info",
      "dismissible": true
    },
    "variants": "Info, success, warning and error; dismissible or persistent.",
    "states": "Visible or dismissed; optional live announcement.",
    "use": "Use for contextual information or a condition requiring attention.",
    "avoid": "Do not use for every ordinary status update or hide blocking errors prematurely.",
    "a11y": "announce=true uses status, or alert for error; default is static to avoid unsolicited announcements. Dismiss has an explicit name.",
    "notes": "Dismiss emits samvad:dismiss. Consumers must move focus to a useful nearby control when a focused dismissal removes the notice.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "feedback",
    "slug": "toast-notification",
    "title": "Toast notification",
    "component": "ToastNotification",
    "description": "Announce a non-blocking result without moving focus.",
    "props": {
      "id": "example-toast",
      "message": "Local demonstration complete. Nothing was saved.",
      "triggerLabel": "Show notification"
    },
    "variants": "One persistent, dismissible status treatment. No auto-dismiss timer.",
    "states": "Hidden, shown, dismissed; repeated triggers update the live region.",
    "use": "Use for a short non-critical result after an action.",
    "avoid": "Use inline errors or Alert for blocking issues; do not rely on a toast as the only record of an important outcome.",
    "a11y": "Polite atomic status announcement, no focus theft on opening; dismissal returns focus to its trigger.",
    "notes": "showToast(element) opens the reusable toast. The trigger is included for simple integration. Timing, queues and action variants are pending.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "feedback",
    "slug": "feedback-states",
    "title": "Feedback states",
    "component": "FeedbackStates",
    "description": "Explain success, error or warning with words and restrained colour.",
    "props": {
      "title": "Check complete",
      "message": "This local example passed its checks.",
      "tone": "success"
    },
    "variants": "Success, error and warning using the shared Notice structure.",
    "states": "Static result; announce=true opts into live semantics.",
    "use": "Use to explain an operation result in context.",
    "avoid": "Do not use colour or a symbol alone, or claim success before an operation finishes.",
    "a11y": "Visible title and message carry meaning; marker is decorative. Live errors are assertive only when explicitly opted in.",
    "notes": "Shares Notice with Alert; no duplicate status styling or fake backend result is introduced.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "feedback",
    "slug": "empty-state",
    "title": "Empty state",
    "component": "EmptyState",
    "description": "Explain an absence and offer a useful next step.",
    "props": {
      "title": "Nothing here yet",
      "description": "This preview has no items. Explore the foundations to get started."
    },
    "variants": "Content-driven container with optional action slot.",
    "states": "Empty only; optional nested action has its own states.",
    "use": "Use when a collection is genuinely empty.",
    "avoid": "Do not disguise an error, loading state or inaccessible content as empty.",
    "a11y": "Semantic section and heading; explain the reason with text and use a descriptive action label.",
    "notes": "No product workflow is implemented. Slots accept actual links/buttons; this example links to documentation.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "feedback",
    "slug": "loading-state",
    "title": "Loading state",
    "component": "LoadingState",
    "description": "Pair a quiet activity indicator with a clear message.",
    "props": {
      "label": "Preparing example content"
    },
    "variants": "One inline spinner + label treatment.",
    "states": "Busy status; no success/error implication.",
    "use": "Use for short indeterminate work.",
    "avoid": "Use Progress indicator when measurable completion is available; explain prolonged delays.",
    "a11y": "One status announcement; spinner is decorative. Reduced motion stops rotation.",
    "notes": "The 960ms preview loop derives from three slow durations. Consumer removes the state when real work finishes.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "tabs",
    "title": "Tabs",
    "component": "Tabs",
    "description": "Switch between related panels in the same view.",
    "props": {
      "id": "example-tabs",
      "label": "Reference sections",
      "items": [
        {
          "label": "Overview",
          "content": "A concise introduction to this reference."
        },
        {
          "label": "Guidance",
          "content": "Use shared foundations consistently."
        },
        {
          "label": "Upcoming",
          "content": "Not available yet.",
          "disabled": true
        }
      ]
    },
    "variants": "Horizontal, wrapping tab list. Manual keyboard activation.",
    "states": "Selected/unselected, focus, hover, pressed; optional disabled tabs.",
    "use": "Use to switch related panels without changing routes.",
    "avoid": "Use real navigation links for destinations or Segmented control for a setting.",
    "a11y": "Roving Tab entry; Left/Right/Home/End move focus; Enter/Space selects. Panels are named and keyboard reachable.",
    "notes": "All panels render from items. selected defaults to index 0; provide an enabled initial item. No route or lazy-fetch behaviour is implied.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "breadcrumbs",
    "title": "Breadcrumbs",
    "component": "Breadcrumbs",
    "description": "Show location within a document hierarchy.",
    "props": {
      "label": "Example breadcrumb",
      "items": [
        {
          "label": "Docs",
          "href": "/"
        },
        {
          "label": "Colour",
          "href": "/foundations/colour/"
        },
        {
          "label": "Current reference"
        }
      ]
    },
    "variants": "Native links plus a non-link current item. Wrapping layout.",
    "states": "Links support default, hover, focus and activation; current item is static.",
    "use": "Use for a stable hierarchy with meaningful ancestor destinations.",
    "avoid": "Do not use for a linear task sequence or replace the browser Back action.",
    "a11y": "Labelled nav, ordered list and aria-current=page; separators are decorative.",
    "notes": "Last item is rendered as current text even if a URL is supplied.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "pagination",
    "title": "Pagination",
    "component": "Pagination",
    "description": "Move between numbered result pages with clear boundaries.",
    "props": {
      "label": "Example result pages",
      "page": 1,
      "total": 5
    },
    "variants": "Compact previous / page status / next. One 44px control size.",
    "states": "First, middle and last page; boundary buttons are disabled.",
    "use": "Use for a finite set of result pages.",
    "avoid": "Do not imply a dataset changes unless the consuming view responds to page events.",
    "a11y": "Real buttons have keyboard focus; a polite status announces the new page. Disabled boundaries cannot activate.",
    "notes": "Emits samvad:pagechange with detail.page. This preview changes the page counter only; no data request is claimed. URL navigation and page-number windows are pending.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "stepper",
    "title": "Stepper",
    "component": "Stepper",
    "description": "Describe progress through a short ordered sequence.",
    "props": {
      "label": "Example sequence",
      "steps": [
        "Start",
        "Review",
        "Complete"
      ],
      "current": 1
    },
    "variants": "Informational horizontal sequence that wraps. Zero-based current index.",
    "states": "Complete, current and upcoming. No interactive step links.",
    "use": "Use for a known sequence whose current position matters.",
    "avoid": "Use Breadcrumbs for hierarchy or Progress indicator for quantitative work.",
    "a11y": "Ordered list, aria-current=step and textual state labels supplement numbers and colour.",
    "notes": "setStep(element,index) updates the real component. The preview slider changes an example sequence only; no product workflow is built.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "sidebar-navigation",
    "title": "Sidebar navigation",
    "component": "SidebarNavigation",
    "description": "Provide clear links to related documentation destinations.",
    "props": {
      "label": "Example documentation navigation",
      "items": [
        {
          "label": "Overview",
          "href": "/"
        },
        {
          "label": "Colour",
          "href": "/foundations/colour/"
        },
        {
          "label": "Typography",
          "href": "/foundations/typography/"
        }
      ]
    },
    "variants": "Vertical native link list; current flag is opt-in. Links wrap.",
    "states": "Default, hover, focus and aria-current page when supplied.",
    "use": "Use for a small set of actual destinations.",
    "avoid": "Do not use menu roles for ordinary navigation or add links to unavailable routes.",
    "a11y": "Named nav landmark, list structure and descriptive native links. Browser open-in-new-tab behaviour is preserved.",
    "notes": "This reusable example is separate from the website shell. No shell redesign or product navigation is introduced.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "navigation",
    "slug": "top-navigation",
    "title": "Top navigation",
    "component": "TopNavigation",
    "description": "Provide clear links to related documentation destinations.",
    "props": {
      "label": "Example documentation navigation",
      "items": [
        {
          "label": "Overview",
          "href": "/"
        },
        {
          "label": "Colour",
          "href": "/foundations/colour/"
        },
        {
          "label": "Typography",
          "href": "/foundations/typography/"
        }
      ]
    },
    "variants": "Horizontal native link list; current flag is opt-in. Links wrap.",
    "states": "Default, hover, focus and aria-current page when supplied.",
    "use": "Use for a small set of actual destinations.",
    "avoid": "Do not use menu roles for ordinary navigation or add links to unavailable routes.",
    "a11y": "Named nav landmark, list structure and descriptive native links. Browser open-in-new-tab behaviour is preserved.",
    "notes": "This reusable example is separate from the website shell. No shell redesign or product navigation is introduced.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "overlays",
    "slug": "dialog",
    "title": "Dialog",
    "component": "Dialog",
    "description": "Focus on a short, blocking decision or task.",
    "props": {
      "id": "example-dialog",
      "title": "A focused moment",
      "description": "This local dialog demonstrates focus containment and dismissal.",
      "triggerLabel": "Open dialog"
    },
    "variants": "Native modal dialog with heading, description, content slot and close action.",
    "states": "Closed/open; initial focus on Close; Escape or Close dismisses.",
    "use": "Use when interaction must pause until a short task is addressed.",
    "avoid": "Use Popover for optional non-blocking context; avoid nested modal stacks.",
    "a11y": "showModal supplies inert background and focus containment. Title/description are associated. Closing restores trigger focus.",
    "notes": "No outside-click dismissal. Use explicit Close or Escape. Keep long content scrollable and place form fields in the slot when needed.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "overlays",
    "slug": "drawer",
    "title": "Drawer",
    "component": "Drawer",
    "description": "Open a focused side panel without losing context.",
    "props": {
      "id": "example-drawer",
      "title": "Reference details",
      "description": "A modal side panel for a focused set of details.",
      "triggerLabel": "Open drawer"
    },
    "variants": "Modal right-edge panel, max 480px, full available width on narrow screens.",
    "states": "Closed/open; same modal focus and dismissal behaviour as Dialog.",
    "use": "Use for a bounded supporting task that needs vertical room.",
    "avoid": "Do not use as permanent desktop navigation or a stack of nested panels.",
    "a11y": "Native dialog focus containment, Escape, labelled heading and focus restoration. Content can scroll independently.",
    "notes": "Shares ModalPanel with Dialog. No swipe gesture, nested drawer management or non-modal variant is claimed.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "overlays",
    "slug": "popover",
    "title": "Popover",
    "component": "Popover",
    "description": "Reveal optional non-modal context beside a trigger.",
    "props": {
      "id": "example-popover",
      "title": "A little context",
      "description": "This non-modal panel closes with Escape, outside click or its Close button.",
      "triggerLabel": "Open popover"
    },
    "variants": "Native auto popover with viewport-clamped placement. Content slot supports controls.",
    "states": "Closed/open; light-dismiss and explicit close.",
    "use": "Use for optional, short contextual information.",
    "avoid": "Use Dialog for a blocking task or Tooltip for brief non-interactive text.",
    "a11y": "Trigger exposes expanded state and controls relationship. No focus trap; Tab follows normal order. Escape uses native dismissal.",
    "notes": "Uses the HTML Popover API; top-layer placement is repositioned on scroll/resize. Unsupported browsers require a consumer fallback policy.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "overlays",
    "slug": "dropdown-menu",
    "title": "Dropdown menu",
    "component": "DropdownMenu",
    "description": "Offer a small set of related commands.",
    "props": {
      "id": "example-menu",
      "label": "Reference actions",
      "items": [
        {
          "label": "Copy reference",
          "value": "copy"
        },
        {
          "label": "Pin reference",
          "value": "pin"
        },
        {
          "label": "Unavailable action",
          "value": "unavailable",
          "disabled": true
        }
      ]
    },
    "variants": "Action menu with optional disabled items. Native popover top layer.",
    "states": "Closed/open, focused item, disabled item and selected command event.",
    "use": "Use for commands related to the trigger context.",
    "avoid": "Use Select for form values or ordinary navigation links for destinations.",
    "a11y": "Enter/Space opens; Up/Down/Home/End navigate enabled items. Single-character search, Escape and Tab dismissal are supported.",
    "notes": "Emits samvad:select with value/label and restores trigger focus after activation. The preview reports the selected command; it does not claim to copy or pin anything.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  },
  {
    "group": "overlays",
    "slug": "confirmation-dialog",
    "title": "Confirmation dialog",
    "component": "ConfirmationDialog",
    "description": "Ask for an explicit decision before a consequential action.",
    "props": {
      "id": "example-confirmation",
      "title": "Remove this example?",
      "description": "This is a local demonstration. No saved data will be removed.",
      "triggerLabel": "Open confirmation",
      "confirmLabel": "Confirm removal"
    },
    "variants": "Native modal with a safe Cancel initial focus and a destructive confirmation action.",
    "states": "Closed/open, cancelled or confirmed. No asynchronous loading is implied.",
    "use": "Use before a consequential action that needs deliberate confirmation.",
    "avoid": "Do not interrupt routine reversible actions or claim the operation has happened from confirmation alone.",
    "a11y": "Cancel receives initial focus. Modal containment, Escape and return focus match Dialog. Labels state the action.",
    "notes": "Emits samvad:confirm; consuming code performs and reports the actual operation. Native close.returnValue distinguishes confirm from cancel.",
    "pending": "Public package/API ratification and unrelated candidate role assignments remain pending."
  }
,...layoutCatalog
] as const;
export type LibraryEntry = typeof libraryCatalog[number];
export const libraryGroups = {"data-display":"Data display",feedback:"Feedback",navigation:"Navigation",overlays:"Overlays",layout:"Layout"} as const;
