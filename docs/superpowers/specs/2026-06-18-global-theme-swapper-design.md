# Global Theme Swapper Design Specification

## Goal
Implement a global theme swapper that allows users to change the color palette of the entire portfolio by entering a CLI command (e.g. `theme matrix`) in the interactive terminal.

## Requirements
1. **CSS Custom Properties**: Define core cyberpunk colors as CSS variables on `:root` in `app.css`.
2. **Tailwind v4 `@theme` Mapping**: Map CSS variables to Tailwind theme colors so Tailwind classes automatically react to variable updates.
3. **CLI Command**: Add a new `theme [themeName]` command in `InteractiveCli.jsx` supporting:
   - `cyber` (default Vaporwave Cyan/Pink)
   - `matrix` (Classic Hacker Green)
   - `deus` (Deus Ex Amber/Orange)
   - `vapor` (Synthwave Pink/Cyan)
4. **Canvas Synchronization**: Update `InteractiveBackground.jsx` to dynamically fetch CSS variables from the DOM, ensuring particle and connection colors match the current active theme.
5. **Session Persistence**: Save the selected theme to `localStorage` so it persists across page reloads.

## Architecture

### Styling
- Modify: `resources/css/app.css` to add `:root` variables and link them to `@theme`.

### Components
- Modify: `resources/js/Components/InteractiveBackground.jsx` to dynamically read CSS theme variables.
- Modify: `resources/js/Components/InteractiveCli.jsx` to parse the `theme` command and update `:root` styles.
- Modify: `resources/js/Layouts/ArsipLayout.jsx` to load the persisted theme from `localStorage` on mount.
