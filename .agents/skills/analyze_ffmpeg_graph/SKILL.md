---
name: Analyze FFmpeg Graph
description: Parse and simulate complex Rust FFmpeg Command builds to identify missing streams or filter errors.
---
# Analyze FFmpeg Graph Skill

## Instructions
1. Find the failing Rust code block where the `Command::new("ffmpeg")` arguments are built.
2. Extract the exact array of string arguments being passed to FFmpeg, paying special attention to `-filter_complex`.
3. Analyze the `-i` inputs to determine the number of video (`v`) and audio (`a`) streams available from the source files.
4. Trace the `-filter_complex` graph node by node.
   - Example check: If the filter requires `[0:v]` but the 0th input is an audio-only file, flag this mapping error.
   - Example check: If using `-c:v h264_nvenc`, verify there is a fallback to `-c:v libx264` if the hardware encoder fails to initialize.
5. Report the explicit missing stream or invalid filter node, rather than repeating the generic `ffmpeg exited with code 1` console output. Provide the corrected Rust snippet for pushing the right arguments.
