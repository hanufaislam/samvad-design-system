export const batchCatalog = [
  {
    "group": "inputs",
    "slug": "text-input",
    "title": "Text input",
    "component": "TextInput",
    "description": "Collect a short, single-line response.",
    "props": {
      "id": "example",
      "label": "Display name",
      "helper": "Use a name people will recognise.",
      "autocomplete": "nickname",
      "required": true
    },
    "use": "Use for short free-form text.",
    "avoid": "Use Textarea for paragraphs or Select for a short fixed list.",
    "a11y": "Use a persistent label; placeholder text is not a label. Set autocomplete for recognised personal information.",
    "notes": "Native text editing and IME composition remain intact; validate on blur or submission, not every keystroke."
  },
  {
    "group": "inputs",
    "slug": "textarea",
    "title": "Textarea",
    "component": "Textarea",
    "description": "Give longer answers room to breathe.",
    "props": {
      "id": "example",
      "label": "Note",
      "helper": "Add a short note, up to 500 characters.",
      "maxlength": 500,
      "required": true
    },
    "use": "Use for multi-line, unstructured text.",
    "avoid": "Avoid for formatted documents or one-line values.",
    "a11y": "Keep vertical resizing enabled and explain length limits in helper text.",
    "notes": "The rows property controls the initial height; text remains editable and selectable."
  },
  {
    "group": "inputs",
    "slug": "search-input",
    "title": "Search input",
    "component": "SearchInput",
    "description": "Enter a query with familiar native search behaviour.",
    "props": {
      "id": "example",
      "label": "Search terms",
      "helper": "This preview accepts a query; it does not search a dataset.",
      "required": true
    },
    "use": "Use to enter a search query.",
    "avoid": "Do not imply results exist without connecting a real search operation.",
    "a11y": "Label the search purpose and announce results separately when integrated.",
    "notes": "Uses type=search; browser clear affordances vary. The preview validates locally only."
  },
  {
    "group": "inputs",
    "slug": "password-input",
    "title": "Password input",
    "component": "PasswordInput",
    "description": "Enter a secret with an explicit visibility control.",
    "props": {
      "id": "example",
      "label": "Password",
      "helper": "Preview only. Do not enter a real password.",
      "autocomplete": "new-password",
      "minlength": 8,
      "required": true
    },
    "use": "Use for a password or secret value.",
    "avoid": "Do not block paste or attach authentication claims to this local example.",
    "a11y": "Show/Hide is a keyboard-operable toggle with aria-pressed; it preserves the value.",
    "notes": "No password is logged, transmitted or persisted. Choose current-password or new-password for the actual context."
  },
  {
    "group": "inputs",
    "slug": "number-input",
    "title": "Number input",
    "component": "NumberInput",
    "description": "Enter a bounded numeric quantity.",
    "props": {
      "id": "example",
      "label": "Quantity",
      "helper": "Enter a whole number from 1 to 10.",
      "min": 1,
      "max": 10,
      "step": 1,
      "required": true
    },
    "use": "Use for quantities with meaningful increments.",
    "avoid": "Use text input with inputmode for identifiers, phone numbers or leading zeros.",
    "a11y": "Native spinbutton supports arrow keys; expose bounds in helper text.",
    "notes": "Uses native min/max/step constraints. Decimal and locale behaviour follows the browser."
  },
  {
    "group": "inputs",
    "slug": "otp-input",
    "title": "OTP input",
    "component": "OTPInput",
    "description": "One paste-friendly field for a one-time code.",
    "props": {
      "id": "example",
      "label": "Verification code",
      "helper": "Enter six digits. Local format check only.",
      "required": true,
      "length": 6
    },
    "use": "Use for a short numeric verification code.",
    "avoid": "Do not imply the code is verified by this local format preview.",
    "a11y": "One focus stop supports paste, numeric keyboard and one-time-code autofill.",
    "notes": "A text input preserves leading zeros. Pattern validates ASCII digits; server verification and expiration belong to the consuming application."
  },
  {
    "group": "inputs",
    "slug": "select",
    "title": "Select / dropdown",
    "component": "Select",
    "description": "Choose one item from a concise list.",
    "props": {
      "id": "example",
      "label": "Format",
      "helper": "Choose one format.",
      "required": true,
      "options": [
        {
          "value": "",
          "label": "Choose a format"
        },
        {
          "value": "text",
          "label": "Text"
        },
        {
          "value": "audio",
          "label": "Audio"
        },
        {
          "value": "video",
          "label": "Video"
        }
      ]
    },
    "use": "Use when one choice from a known list is needed.",
    "avoid": "Use radio buttons for a few options that should be visible together; do not use for searchable large datasets.",
    "a11y": "Native select retains browser keyboard navigation and platform picker behaviour.",
    "notes": "Options use stable values and visible labels. A blank option supports native required validation."
  },
  {
    "group": "inputs",
    "slug": "multi-select",
    "title": "Multi-select",
    "component": "MultiSelect",
    "description": "Select several choices from a visible checkbox list.",
    "props": {
      "id": "example",
      "label": "Formats",
      "helper": "Choose one or more.",
      "required": true,
      "options": [
        {
          "value": "text",
          "label": "Text"
        },
        {
          "value": "audio",
          "label": "Audio"
        },
        {
          "value": "video",
          "label": "Video"
        }
      ]
    },
    "use": "Use for a small set of independent multiple choices.",
    "avoid": "Use a separately specified searchable picker for large datasets; this is not a combobox.",
    "a11y": "Fieldset and legend name the set. Tab reaches each checkbox; Space toggles it.",
    "notes": "Shares ChoiceGroup. Repeated name values use FormData.getAll; at-least-one validation is supplied by validateForm."
  },
  {
    "group": "inputs",
    "slug": "date-picker",
    "title": "Date picker",
    "component": "DatePicker",
    "description": "Choose a single calendar date with the native picker.",
    "props": {
      "id": "example",
      "label": "Date",
      "helper": "Choose a date. Display format follows your browser locale.",
      "required": true
    },
    "use": "Use for one calendar date.",
    "avoid": "Do not use for time, date ranges or ambiguous timezone-dependent instants.",
    "a11y": "Keyboard entry and calendar interaction follow the native platform control.",
    "notes": "type=date submits YYYY-MM-DD. Optional min and max are ISO dates. No custom calendar or timezone conversion is claimed."
  },
  {
    "group": "inputs",
    "slug": "file-upload",
    "title": "File upload",
    "component": "FileUpload",
    "description": "Select local files with a native file chooser.",
    "props": {
      "id": "example",
      "label": "Attachments",
      "helper": "Choose text files. Files stay on your device in this preview.",
      "accept": ".txt,text/plain",
      "multiple": true,
      "required": true
    },
    "use": "Use to choose files before an explicit upload operation.",
    "avoid": "Do not claim a completed upload from file selection alone.",
    "a11y": "Native chooser supports keyboard access. Explain file constraints outside the chooser.",
    "notes": "accept is a chooser hint, not security validation. Implement size/type checks and upload handling in the consumer; this component performs no upload."
  },
  {
    "group": "inputs",
    "slug": "form-field",
    "title": "Form field",
    "component": "FormField",
    "description": "Compose a label, control, helper and validation message.",
    "props": {
      "id": "example",
      "label": "Contact email",
      "helper": "Use an address in the format name@example.com.",
      "required": true
    },
    "use": "Use as the accessible wrapper around a custom native control.",
    "avoid": "Do not add a second label or wrapper around Field, which already provides these parts.",
    "a11y": "Match label for to control id; connect helper and error IDs using aria-describedby.",
    "notes": "The slot must supply the input id, required attribute and describedby references. validateForm updates its error region."
  },
  {
    "group": "selection",
    "slug": "checkbox",
    "title": "Checkbox",
    "component": "Checkbox",
    "description": "Toggle one or more independent choices.",
    "props": {
      "id": "example",
      "label": "Options",
      "options": [
        {
          "value": "updates",
          "label": "Receive updates"
        },
        {
          "value": "summary",
          "label": "Include summary"
        }
      ]
    },
    "use": "Use for independent yes/no choices or multi-selection.",
    "avoid": "Use Radio group for mutually exclusive choices and Switch for an immediate setting.",
    "a11y": "Native checked state is announced. Each label has a 44px target.",
    "notes": "Uses named checkbox values and native form submission. Mixed/indeterminate state is not implemented or claimed."
  },
  {
    "group": "selection",
    "slug": "radio-group",
    "title": "Radio group",
    "component": "RadioGroup",
    "description": "Choose one mutually exclusive option.",
    "props": {
      "id": "example",
      "label": "Format",
      "required": true,
      "options": [
        {
          "value": "text",
          "label": "Text"
        },
        {
          "value": "audio",
          "label": "Audio"
        },
        {
          "value": "video",
          "label": "Video"
        }
      ]
    },
    "use": "Use for a small set of mutually exclusive choices.",
    "avoid": "Use Checkbox for independent choices or Select for longer lists.",
    "a11y": "Same-name native radios support arrow navigation and one Tab entry point; legend names the group.",
    "notes": "Required selection uses native validity plus shared validation. Values are stable identifiers, not display labels."
  },
  {
    "group": "selection",
    "slug": "switch",
    "title": "Switch / toggle",
    "component": "Switch",
    "description": "Change a binary setting with an immediate effect.",
    "props": {
      "id": "example",
      "label": "Enable preview option",
      "helper": "Changes only this local switch."
    },
    "use": "Use for an immediate on/off setting.",
    "avoid": "Use Checkbox for consent or a choice applied on form submission.",
    "a11y": "Native checkbox with role=switch announces checked state; Space toggles it.",
    "notes": "Consumes checked and disabled props. Native change events let the consumer apply the setting; the preview has no remote effect."
  },
  {
    "group": "selection",
    "slug": "chips",
    "title": "Chips",
    "component": "Chips",
    "description": "Show selectable options or removable selections.",
    "props": {
      "id": "example",
      "label": "Topics",
      "options": [
        {
          "value": "writing",
          "label": "Writing"
        },
        {
          "value": "speaking",
          "label": "Speaking"
        },
        {
          "value": "listening",
          "label": "Listening"
        }
      ],
      "selected": [
        "writing"
      ]
    },
    "use": "Use for small sets of concise selectable or removable items.",
    "avoid": "Use Badge for a passive status and ordinary buttons for commands.",
    "a11y": "Selectable chips are real checkboxes. Removable chips have named buttons and move focus to a neighbour.",
    "notes": "Use removable=true for removal. The default is multi-selection; removing does not submit or delete server data."
  },
  {
    "group": "selection",
    "slug": "segmented-control",
    "title": "Segmented control",
    "component": "SegmentedControl",
    "description": "Pick one view preference from a compact group.",
    "props": {
      "id": "example",
      "label": "Preview density",
      "options": [
        {
          "value": "comfortable",
          "label": "Comfortable"
        },
        {
          "value": "compact",
          "label": "Compact"
        }
      ],
      "selected": [
        "comfortable"
      ],
      "required": true
    },
    "use": "Use for a short, mutually exclusive setting.",
    "avoid": "Use Tabs when switching associated content panels; this is a radio group, not tabs.",
    "a11y": "Native radios retain arrow navigation, checked semantics and a labelled fieldset.",
    "notes": "Wraps ChoiceGroup with segmented styling. Read the selected radio value or listen to change; no product view is attached."
  }
] as const;
export type BatchEntry = typeof batchCatalog[number];
