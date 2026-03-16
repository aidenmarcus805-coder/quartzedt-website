---
name: Verify IPC Types
description: Catch Rust-to-TypeScript serialization bugs by comparing Tauri backend structs to Next.js frontend interfaces.
---
# Verify IPC Types Skill

## Instructions
1. IMMEDIATELY stop guessing the type error.
2. Locate the Rust `struct` definition in the backend (`c:\Users\aiden_eh9lsbw\Documents\vellum-ai\src-tauri\src\`) that is being sent or received by the `#[tauri::command]`.
3. Locate the corresponding TypeScript `interface` or `type` in the frontend (`c:\Users\aiden_eh9lsbw\Documents\autocut\app\`).
4. Compare them field-by-field.
5. **Validation Rules:**
   - Rust `Option<T>` must map to `T | null | undefined` or an optional field `?: T` in TypeScript.
   - If the Rust struct uses `#[serde(rename_all = "camelCase")]`, verify that the TypeScript interface uses `camelCase` and NOT `snake_case`.
   - Numeric types (`i32`, `f64`, etc.) must map to `number`.
   - Rust `Vec<T>` must map to `T[]` or `Array<T>`.
6. Report the specific mismatched fields and provide the exact code block to fix the TypeScript interface to match the Rust source of truth.
