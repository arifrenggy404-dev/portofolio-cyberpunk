# Interactive CLI Mode Design Specification

## Goal
Implement a fully interactive full-screen terminal command-line overlay triggered by a floating toggle button. The terminal will support a rich set of custom commands to let visitors explore the CV in retro-hacker style.

## Requirements
1. **Toggle Button**: Floating button at the bottom-right of the screen (`fixed bottom-6 right-6 z-[80]`).
2. **Terminal Overlay**: Full-screen modal with terminal-bg, CRT flicker, scanlines, and a scrollable log container.
3. **Responsive**: Keyboard focus is kept on the terminal input when active. Resizes gracefully on mobile.
4. **Interactive Prompt**: Cursor blinking and prompt syntax (`visitor@arif-renggy:~$`).
5. **Rich Command Set**:
   - `help`: Lists all available commands with a description.
   - `about` / `identitas`: Shows biography, name, role, location.
   - `skills` / `arsenal`: Displays skill categories and percentages in ASCII table format.
   - `projects` / `misi`: Shows a list of completed projects, descriptions, and URLs.
   - `contact` / `komunikasi`: Shows Github, Email, WhatsApp, and Portfolio URLs.
   - `clear`: Empties the console screen.
   - `exit` / `gui` / `close`: Returns to standard GUI mode.
   - `neofetch` / `sysinfo`: Displays ASCII art of the initials "AR" or a cyber skull alongside browser specs, local time, and OS version.
   - `whoami`: Displays `visitor_node_` followed by session ID.
   - `date` / `time`: Displays current date and time.
   - `weather`: Displays a cyberpunk-themed weather report (e.g., `ACID RAIN, 27°C, TOXIC AIR QUALITY`).
   - `ping`: Simulates ping latency to the server.
   - `matrix`: Runs a vertical code waterfall effect.
   - `history`: Shows the list of commands entered in the current session.
   - `sudo`: Funny permission denied warning.

## Architecture

### Component File
- Create: `resources/js/Components/InteractiveCli.jsx` (handles terminal UI, overlay, input reading, command parsing, and matrix animations).

### Layout Integration
- Modify: `resources/js/Layouts/ArsipLayout.jsx` to render the floating button and the `<InteractiveCli />` modal when toggled.
