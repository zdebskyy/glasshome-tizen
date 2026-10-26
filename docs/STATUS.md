# Verification status

Recorded 26 October 2026.

## Current implementation

GlassHome is an offline browser prototype. It contains no TV connection code, signed package, root payload, system cleanup adapter or native Home integration. Browser preferences are stored under `tv-shell-preview.v1` for continuity with the initial prototype; they are not a TV backup.

## Browser checks completed

- Home, app grid and separate settings pages were inspected in the browser.
- Arrow/Enter/Back navigation and focus restoration were exercised.
- Default six-column and large five-column layouts were checked.
- Background full-screen preview and return navigation were exercised.
- Holding Enter started rearrangement; moving and committing survived a page reload.
- Canceling a rearrangement restored order and focus to the picked-up app.
- Hiding a shortcut survived reload and could be reversed.
- Appearance choices persisted in the browser.
- Visible image resources loaded and the browser reported no warning/error entries in the final check.
- Device-dependent buttons showed an unavailable-device message rather than a simulated successful operation.

The included images are browser screenshots of this implementation, not photographs of a running TV. Source checks cover syntax, bundled references and documentation links; they do not enforce ES5 or reproduce the TV engine.

## Control Center dismissal regression

A background click previously left Control Center open and moved focus outside the TV canvas, so Escape stopped being handled. The panel now closes on its backdrop or top toggle; Escape also works when an open overlay has lost focus. Closing restores focus to the opener and its expanded state. The underlying clock/profile capsule is hidden while the panel is open.

Browser checks covered backdrop dismissal, explicit toggle dismissal, and Escape after clicking non-focusable text inside the panel. Each returned focus to the collapsed opener; the final browser check reported no warning/error entries.

## Repository packaging checks

- The dependency-free preview server served HTML, versioned JavaScript and SVG assets successfully.
- HEAD returned headers with no body; missing files returned 404.
- An encoded path traversal attempt returned 403, and Git configuration was not served.
- The packaged repository opened in the browser under the GlassHome title.

## Intended first device

| Field                                | Evidence                                                                  |
| ------------------------------------ | ------------------------------------------------------------------------- |
| Model                                | Samsung QE55Q77AATXXH, from the owner's photo                             |
| Firmware                             | T-NKM2DEUC-2301.1, from the owner's photo; confirmed current by the owner |
| Platform                             | Tizen; exact runtime/API version not queried on the target                |
| Connection, signing and installation | Not performed                                                             |
| TV rendering and remote behavior     | Not tested                                                                |
| Backup and exact rollback            | Not established                                                           |

## Native-menu research

The owner confirmed the photographed firmware is current and requested research of this model/firmware before further UI changes. Menu and control changes are on hold.

[The research report (Ukrainian)](research/Q77A-2301-MENUS.uk.md) and [candidate inventory](research/menu-inventory.json) record 208 documented paths, page references and context restrictions. Samsung's exact model support page lists firmware 2301.1 and links a shared family manual; no complete firmware-specific menu delta was found in the reviewed public sources. All candidate availability values remain unknown, with no device read/write verification. The current prototype remains illustrative.

The manual documents Samsung Account cloud backup of TV settings. It does not establish full firmware recovery or restoration of third-party app sessions. No backup was run. Only documentation changed during this research stage.

## Next work

1. Observe the actual native menu tree, labels, disabled states and relevant source/audio contexts on this TV; reconcile them with the inventory before changing menus or controls.
2. Establish the recovery prerequisites before system modifications, including assessment of any access method that itself modifies the TV.
3. Discover the actual installed apps and validate the frontend against the target runtime and packaging/signing requirements.
4. Add a device adapter only for verified capabilities; check native app launches, settings access and return to Samsung Home.
5. Evaluate one Home mechanism and selected Vetro system operations with measured resource use and verified rollback.

Do not infer a RAM saving, smoother navigation or compatibility from this browser preview. No TV performance measurement has been made for GlassHome.
