---
description: Add a new Python AI worker to the Vellum-AI Rust backend.
---
# Add AI Worker Workflow

When asked to add a new Python AI model or worker to the system, follow these steps to ensure safe process management and IPC.

## 1. Python Implementation
1. Create a standalone Python script in `src-tauri/src/ai/`.
2. The script must accept configuration via standard arguments (e.g., `argparse`).
3. The script MUST output data EXCLUSIVELY via JSON to standard output (`stdout`). **Do not use `print()` for debugging** as it will corrupt the JSON stream read by Rust. Use standard logging to `stderr`.

## 2. Rust Worker Wrapper
1. Create a new Rust module in `src-tauri/src/ai/` (or extend an existing one).
2. Write a function that spawns the Python process using `crate::ai::create_tokio_python_command()` (or `create_python_command()` for synchronous tasks).
3. **CRITICAL:** You must wrap the spawned process (`child`) in a RAII Drop guard (like `FfmpegChildGuard` from `cache.rs`, or create a similar `PythonChildGuard`) that calls `start_kill()` on drop. This guarantees zombie Python processes are killed if the user cancels the task or if the parent Tokio future is dropped due to a timeout.
4. Set up standard error (`stderr`) pipes to surface Python exceptions back to the Tauri application logs without crashing the JSON parser.

## 3. Tauri Integration
1. Follow the `scaffold_tauri_command` workflow to expose this new Rust worker to the frontend via IPC.
2. Provide a mechanism for the frontend to pass configuration arguments down to the Python script.
3. If the worker is long-running, implement a Tauri Event payload to emit progress percentages back to the UI.
