"use client";

import { useEffect } from "react";

/**
 * Global app-shell behaviors.
 *
 * Makes the site feel like a native app rather than a web page:
 *
 *   • Right-click context menu is suppressed everywhere except
 *     inside form controls where users reasonably expect paste /
 *     undo / spell-check (textarea, input, contenteditable).
 *   • Image dragging is disabled so vendor stamps don't "ghost"
 *     when a pointer brushes them.
 *
 * Selectability is handled purely in CSS (see `body` + `.select-text`
 * in globals.css) so this component stays tiny.
 */
export function AppShell() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(
          'input, textarea, select, [contenteditable="true"], [data-allow-context]',
        )
      ) {
        return;
      }
      e.preventDefault();
    };

    const onDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "IMG") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return null;
}
