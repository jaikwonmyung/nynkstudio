import React, { useEffect, useRef } from 'react';

/**
 * Minimal two-part cursor: a dot that tracks exactly, and a ring that trails
 * behind it and swells over interactive elements.
 *
 * Performance contract — this runs on every frame, so it must never cost layout:
 *   - only `transform` and `opacity` are animated (compositor-only properties)
 *   - one shared rAF loop, not one per element
 *   - pointer position is written to a ref, never to state, so React does not
 *     re-render on mouse move
 *   - no getBoundingClientRect / offsetWidth reads inside the loop
 *   - the loop parks itself when the pointer has settled, and restarts on move
 *
 * It opts out entirely for coarse pointers (touch) and for users who asked for
 * reduced motion.
 */
const Cursor: React.FC = () => {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fine = window.matchMedia('(pointer: fine)').matches;
        const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!fine || calm) return;

        const dot = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        document.body.classList.add('sm-cursor-on');

        // target = where the pointer is; ring = where the ring has caught up to
        let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let rx = tx, ry = ty;
        let scale = 1, targetScale = 1;
        let visible = false;
        let frame = 0;

        // Snappy on purpose: the ring should read as attached to the pointer,
        // not dragged behind it. 0.45 catches up in ~4 frames.
        const EASE = 0.45;      // ring catch-up per frame
        const SETTLED = 0.05;   // px below which we stop drawing

        const draw = () => {
            const dx = tx - rx;
            const dy = ty - ry;
            rx += dx * EASE;
            ry += dy * EASE;
            scale += (targetScale - scale) * 0.4;

            dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;

            // park the loop once everything has settled; a move restarts it
            if (Math.abs(dx) < SETTLED && Math.abs(dy) < SETTLED && Math.abs(targetScale - scale) < 0.001) {
                frame = 0;
                return;
            }
            frame = requestAnimationFrame(draw);
        };

        const kick = () => {
            if (!frame) frame = requestAnimationFrame(draw);
        };

        const onMove = (e: PointerEvent) => {
            tx = e.clientX;
            ty = e.clientY;
            if (!visible) {
                visible = true;
                dot.style.opacity = '1';
                ring.style.opacity = '1';
            }
            kick();
        };

        // Interactive targets are resolved with `closest` on the event target —
        // a single delegated listener, no per-element bookkeeping.
        const INTERACTIVE = 'button, a, input, textarea, select, [role="button"], [data-cursor="grow"]';

        const TEXTUAL = 'input:not([type="button"]):not([type="submit"]), textarea';

        const onOver = (e: PointerEvent) => {
            const el = e.target as Element | null;
            const can = el && typeof el.closest === 'function';
            const hit = can ? el.closest(INTERACTIVE) : null;
            const text = can ? el.closest(TEXTUAL) : null;

            // Shape is handled in CSS (capsule -> rounded box -> caret); scale
            // is reserved for the press feedback, so the two never fight.
            ring.classList.toggle('is-text', !!text);
            ring.classList.toggle('is-active', !!hit && !text);
        };

        const onLeave = () => {
            visible = false;
            dot.style.opacity = '0';
            ring.style.opacity = '0';
        };

        const onDown = () => { targetScale = 0.86; kick(); };
        const onUp = () => { targetScale = 1; kick(); };

        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('pointerover', onOver, { passive: true });
        window.addEventListener('pointerdown', onDown, { passive: true });
        window.addEventListener('pointerup', onUp, { passive: true });
        document.addEventListener('pointerleave', onLeave);

        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerover', onOver);
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            document.removeEventListener('pointerleave', onLeave);
            if (frame) cancelAnimationFrame(frame);
            document.body.classList.remove('sm-cursor-on');
        };
    }, []);

    return (
        <>
            <div ref={ringRef} className="sm-cursor-ring" aria-hidden="true" />
            <div ref={dotRef} className="sm-cursor-dot" aria-hidden="true" />
        </>
    );
};

export default Cursor;
