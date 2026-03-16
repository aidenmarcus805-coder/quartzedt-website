---
description: Add a new backend Rust logic feature and expose it as a Tauri command to the Next.js frontend.
---
# Scaffold Tauri Command

When asked to scaffold or create a new Tauri command, follow these strict execution steps to ensure the Rust backend perfectly connects to the TypeScript frontend without silent payload failures.

## 1. Rust Backend Implementation (`src-tauri/src/`)
1. Determine the appropriate module in `src-tauri/src/` (e.g., `ai/`, `project_store.rs`, etc.) for the new logic.
2. Write the core Rust function.
3. Write the Tauri command wrapper function annotated with `#[tauri::command]`.
    - Arguments must implement `serde::Deserialize`.
    - Return types must be `Result<T, String>` (or your custom `AppError` type), where `T` implements `serde::Serialize`.
    - For structs, ensure `#[derive(serde::Serialize, serde::Deserialize)]` and `#[serde(rename_all = "camelCase")]` are applied to match standard JS conventions.

## 2. Command Registration (`src-tauri/src/main.rs`)
1. Open `src-tauri/src/main.rs`.
2. Locate the `.invoke_handler(tauri::generate_handler![...])` block.
3. Add the newly created Tauri command to the `generate_handler!` array. **Failure to do this will result in immediate frontend crashes when calling the command.**

## 3. TypeScript Frontend Integration (`app/`)
1. Navigate to the appropriate API or utility file in the React frontend (e.g., `app/lib/api.ts` or a specific component).
2. Create standard exported TypeScript `interface`s that exactly mirror the Rust structs.
    - Check that Rust `Option<T>` maps to Optional fields (`?: type`) or `type | null`.
    - Check that `i32`/`u32`/`f32`/`f64` maps to `number`.
3. Create an async wrapper function that calls `invoke('command_name', { args })` from `@tauri-apps/api/core`.
    - Handle the Promise resolution and standard error catching.

## 4. Verification
1. Review the Rust struct signature and the TypeScript interface side-by-side to verify exact property name and type matching.
