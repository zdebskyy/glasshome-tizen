# Backup and recovery plan

No TV backup has been created. GlassHome currently runs only in a browser and contains no device integration or restore command.

The owner's requirement is to establish a backup and a viable recovery path before changes on the TV. This document records the intended sequence; it is not a claim that a complete firmware image or every application's login data can be recovered.

## Mandatory device constraints

The owner explicitly prohibits resetting or updating this TV under any circumstances. Preserve firmware **T-NKM2DEUC-2301.1** and the existing device state.

- Do not perform a factory reset, Smart Hub reset, or settings reset, including as a troubleshooting, installation or region-change step.
- Do not update, downgrade or reflash the TV firmware. Do not accept an SDK/helper prerequisite that requires a firmware change.
- Do not change the Smart Hub region through a reset or another destructive process.
- A backup does not waive these prohibitions. Recovery must restore specific preserved values/data without resetting or changing firmware; if that cannot be established, the dependent modification must not proceed.
- Ordinary rebooting is distinct from resetting settings; no reboot or device operation has been performed during this research.

These constraints take precedence over troubleshooting suggestions in linked third-party or Samsung documentation. No TV settings, including automatic-update controls, have been changed.

## Before a system change

1. Confirm the exact model, firmware, architecture and available runtime/API capabilities. Separately assess any access method that itself modifies the device, including root acquisition.
2. Establish which data can actually be copied and restored. Preserve the original Home assignment, startup settings, component enable/disable and autostart flags, relevant TV settings and network configuration. A settings snapshot is not a full system backup.
3. Preserve the original snapshot once. Keep a second copy, the helper source revision, required compiled tools and exact recovery instructions outside the working checkout. Do not overwrite the baseline with the modified state.
4. Prepare device-specific query, apply and restore operations with readback and compatibility checks. Repository source alone is not a complete recovery kit.
5. Before a reversible change is retained, exercise its restore path and verify both the stored values and the visible result on the TV. The first rollback trial itself requires an agreed reversible change after the prerequisite backup work.

Keep device records, certificates, account data and backups private. The ignored `.local/` directory is a convenient working area, but a copy inside the checkout alone does not satisfy the separate-backup requirement.

## Documented Samsung settings backup

Samsung's family e-Manual linked from the exact Q77A model page documents `Settings > General > System Manager > Samsung Account > My Account > Back up` (pages 47-48). It describes backing up TV settings to cloud storage and restoring those settings. Availability and actual recovery coverage on the target remain unverified; the function was not invoked.

This is not evidence of a full firmware image or restoration of third-party app login sessions. It supplements the recovery investigation rather than satisfying the owner's backup requirement by itself. `Reset Smart Hub` explicitly removes Samsung/linked-service account and app information (page 207), so it is excluded from a design change that preserves authorizations.

See the [native-menu research and source register](research/Q77A-2301-MENUS.uk.md). Ordinary menu observation comes before further menu/control changes; invasive access, tests, resets and writes are separate operations.

## Change policy

- Select one compatible mechanism for Home and startup. Do not enable competing Vetro and CleanFrame Home controllers.
- Keep installed streaming apps and their data. Do not clear app storage or reset Smart Hub to change the launcher's appearance.
- Hide shortcuts independently of system cleanup. Disable only reviewed components and preserve their original state.
- Do not equate Enable with recovery from Uninstall. Deleted packages may require a suitable installer, and restoration must be established separately.
- Restore the original Home/startup assignment and physically test Samsung Home before removing the launcher or changing its app identity.
- Keep the current firmware fixed. If a recovery tool rejects it, stop the dependent operation rather than changing firmware or bypassing its compatibility checks.

## Reference approaches

[CleanFrame's native Home helper](https://github.com/nthnclrk/CleanFrame/tree/main/scripts/native-home) uses a private original snapshot and typed, exact-value restoration. Its published helper is guarded for the author's different TV and firmware; it cannot be used unchanged on the Q77A. Even its query stages temporary files, so repository review and device operations are distinct.

[Vetro](https://github.com/andrearicci93/vetro) has individual reversal paths for the launcher, component states and selected settings. Its internal copies do not provide a full image restore. System-package reinstall validation remains limited in the reviewed audit.

Full firmware recovery, copying protected app data and preserving every authorization session are still unverified. If the required state cannot be backed up and restored, the dependent modification remains pending until its scope and risk are resolved with the owner.
