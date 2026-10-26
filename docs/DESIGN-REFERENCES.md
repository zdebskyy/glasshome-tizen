# Design references

Reviewed 26 October 2026. Apple's current user guide was labeled tvOS 27.

| Official source                                                                                                                                                                 | Applied here                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Apple TV 4K User Guide](https://support.apple.com/guide/tv/welcome/tvos), Home illustration                                                                                    | Top Shelf background, shared first-row Dock, clock/profile capsule                                      |
| [Navigate Apple TV 4K](https://support.apple.com/en-sg/guide/tv/atvbe55a4b4e/tvos)                                                                                              | Enlarged focus, full-screen preview and holding Select to edit apps                                     |
| [Change appearance settings](https://support.apple.com/guide/tv/atvb46af4f11/tvos)                                                                                              | Light/dark/automatic appearance, six default columns and five large columns; scrolled Home illustration |
| [App icons, Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)                                                                | Landscape 800 × 480 / 5:3 proportions and focus depth                                                   |
| [Navigate Control Center](https://support.apple.com/guide/tv/navigate-control-center-atvb0a416871/tvos)                                                                         | Right-side controls and separate glass-like surfaces                                                    |
| [Monitoring your Metal app's graphics performance](https://developer.apple.com/documentation/xcode/monitoring-your-metal-apps-graphics-performance), tvOS Settings illustration | Large left-side symbol and explanation, right-side list, centered page title and highlighted row        |

The last source supplements the user guide for settings composition. It is not established to be a screenshot of Settings specifically on tvOS 27.

## Implementation choices

The scene uses a 1920 × 1080 coordinate system. Default tiles are 248 × 149, approximating 5:3; large tiles are 300 × 180. Focus scales a tile by 1.22. The first-row Dock and grid transition were measured approximately from Apple's illustrations, not copied from official layout constants.

The preview uses prepared blurred images, transforms, opacity, shadows and highlights. It does not run Apple's native Liquid Glass or parallax renderer. No Apple screenshots or proprietary fonts are bundled; macOS uses its system font, with a fallback elsewhere.

Samsung/Tizen menu labels and demonstration service shortcuts intentionally replace Apple-only functions. The background is sample artwork, not content retrieved from streaming accounts. Actual Tizen apps may not expose an equivalent of Apple Top Shelf; integration must investigate that separately.

The Control Center is an adapted preview, not a complete reproduction of all tvOS controls. Device commands remain unavailable. These differences are deliberate limits, so the project does not claim pixel-perfect fidelity across every state.
