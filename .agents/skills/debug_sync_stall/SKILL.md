---
name: Debug Sync Stall
description: Debug deadlocks and dropped futures in the Vellum-AI sync_solver and cache pipelines.
---
# Debug Sync Stall Skill

## Instructions
1. IMMEDIATELY stop generic debugging of the UI state.
2. Navigate to `c:\Users\aiden_eh9lsbw\Documents\vellum-ai\src-tauri\src\ai\sync\sync_solver.rs` or `c:\Users\aiden_eh9lsbw\Documents\vellum-ai\src-tauri\src\ai\cache.rs`.
3. Search for spawned `tokio::process::Command` calls (specifically `ffmpeg` and Python algorithms).
4. Verify whether the `Child` process is wrapped in an `FfmpegChildGuard` or explicitly handles `child.start_kill()` in a `Drop` implementation or `tokio::select!` cancellation branch.
5. Check `mpsc::Sender` usage. Are any channels dropping before they can send a completion or error signal? If so, the `Receiver` is deadheading and the progress bar will stall.
6. Check for blocking I/O (like `std::fs::read` or `std::process::Command::output`) accidentally running inside a `tokio::spawn` without `spawn_blocking`, which starves the async reactor.
7. Report the exact line of code causing the deadlock and provide the fix.
