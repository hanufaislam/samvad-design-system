export const layoutCatalog = [
  {
    "group": "layout",
    "slug": "container",
    "title": "Container",
    "component": "Container",
    "description": "Constrain content width while keeping comfortable inline gutters.",
    "props": {
      "max": 960,
      "padding": "responsive"
    },
    "variants": "max: 640, 960, 1200, reading (65ch), or full. Padding: responsive, or any approved spacing value.",
    "states": "Layout primitives are passive. Configuration changes geometry; there are no hover, focus, pressed, disabled or loading states on the layout itself.",
    "use": "Use to centre a content region and limit line length.",
    "avoid": "Do not add a second main landmark or fixed-height content viewport.",
    "a11y": "Neutral div preserves child semantics and DOM order. Use meaningful landmarks outside it. Text can grow without a fixed height.",
    "notes": "Content maxima exclude padding. Responsive gutters are 16px below 600, 24px at 600\u20131023, and 32px from 1024. Border-box maximum includes both gutters; full removes the maximum. reading uses the approved 65ch starting point. At narrow widths it shrinks to available space. Native div attributes (including id and class) are forwarded; inline style is reserved.",
    "pending": "Official semantic/component token aliases remain pending. Layout prop names are local component APIs, not production token names."
  },
  {
    "group": "layout",
    "slug": "divider",
    "title": "Divider",
    "component": "Divider",
    "description": "Separate adjacent content with a quiet visual boundary.",
    "props": {
      "orientation": "horizontal",
      "decorative": false,
      "inset": 0
    },
    "variants": "Horizontal or vertical; semantic separator or decorative rule. One 1px border; inset uses approved spacing.",
    "states": "Layout primitives are passive. Configuration changes geometry; there are no hover, focus, pressed, disabled or loading states on the layout itself.",
    "use": "Use between adjacent sections or groups when spacing alone is insufficient.",
    "avoid": "Do not use a rule as a replacement for a heading, label or missing structure.",
    "a11y": "Horizontal uses hr; vertical uses role=separator and aria-orientation=vertical. decorative=true removes separator semantics. Neither is focusable.",
    "notes": "Inset applies at both ends of the rule\u2019s own axis. A vertical divider stretches inside a row flex/grid parent and has a 24px minimum height. It does not create a drag handle. Use a parent with enough available size for the requested inset.",
    "pending": "Official semantic/component token aliases remain pending. Layout prop names are local component APIs, not production token names."
  },
  {
    "group": "layout",
    "slug": "stack",
    "title": "Stack",
    "component": "Stack",
    "description": "Arrange related content in one dimension with shared spacing.",
    "props": {
      "direction": "horizontal",
      "gap": 16,
      "align": "center",
      "justify": "start",
      "wrap": true,
      "collapse": false
    },
    "variants": "Horizontal or vertical. Gap uses the complete approved scale. Alignment: start, center, end, stretch. Justify: start, center, end, between.",
    "states": "Layout primitives are passive. Configuration changes geometry; there are no hover, focus, pressed, disabled or loading states on the layout itself.",
    "use": "Use for one-dimensional relationships such as a group of related actions or text blocks.",
    "avoid": "Use Grid for two-dimensional alignment. Avoid disabling wrapping for content that cannot shrink.",
    "a11y": "DOM reading and focus order remain unchanged. No order/reverse property or unnecessary ARIA role is introduced.",
    "notes": "Defaults: vertical, gap 16, stretch, start, wrap=true, collapse=false. collapse=true switches a horizontal stack to vertical below 600px. Justify acts on the main axis; align acts on the cross axis. With wrap=false, consumers must ensure children fit. Native div attributes are forwarded; inline style is reserved.",
    "pending": "Official semantic/component token aliases remain pending. Layout prop names are local component APIs, not production token names."
  },
  {
    "group": "layout",
    "slug": "grid",
    "title": "Grid",
    "component": "Grid",
    "description": "Align repeated content in responsive columns.",
    "props": {
      "columns": 1,
      "medium": 2,
      "wide": 3,
      "gap": 16,
      "align": "stretch",
      "responsive": true
    },
    "variants": "1\u201312 equal columns; responsive base/medium/wide counts. Gap uses approved spacing; cross-axis align supports start, center, end, stretch.",
    "states": "Layout primitives are passive. Configuration changes geometry; there are no hover, focus, pressed, disabled or loading states on the layout itself.",
    "use": "Use for repeated items that need consistent column alignment.",
    "avoid": "Do not use role=grid for visual layout or simulate tables with divs.",
    "a11y": "Ordinary CSS grid, without ARIA grid semantics. Source and keyboard order stay the same; children retain their own semantics.",
    "notes": "Defaults: 1 column below 600, 2 at 600\u20131023, 3 from 1024; gap 16. These are configurable preview assignments, not a new global foundation grid. responsive=false uses columns at all widths. The approved foundation page grid remains 4/8/12. minmax(0,1fr) and wrapping prevent intrinsic text from forcing overflow; use sensible counts for actual content. Extreme column/gap combinations can exceed the available width; the documentation canvas scrolls rather than changing the requested geometry. Native div attributes are forwarded; inline style is reserved.",
    "pending": "Official semantic/component token aliases remain pending. Layout prop names are local component APIs, not production token names."
  }
] as const;
