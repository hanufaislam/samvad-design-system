# Iconography

Use Phosphor Regular by default; Fill only for selected-state emphasis with a supporting label/state cue. Do not mix unrelated libraries. Boxes: 16, 20, 24 logical units. Preserve upstream filled-path geometry: Regular has nominal 16/256 geometry, equivalent to 1, 1.25 and 1.5 units at 16, 20 and 24 respectively. Do not impose an arbitrary 2px stroke on filled paths.
Native SVG vectors are imported as specimens, not components. Later components will wrap them with approved token-bound colour and icon slots. Icons inherit semantic foreground. Label icon-only controls accessibly and keep the hit area independent from artwork. Do not mirror non-directional icons; evaluate directional icons for future RTL support.
Source: https://github.com/phosphor-icons/core. Files and upstream MIT license are in assets/icons. Examples: chat-circle, arrow-right, microphone, check-circle, warning-circle; filled chat-circle demonstrates selected weight.
