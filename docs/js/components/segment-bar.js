/**
 * segment-bar.js — Segmented rating bar (replaces star rating)
 * A horizontal bar with 5 tappable segments for 1-5 rating.
 *
 * Usage:
 *   createSegmentBar(name, currentValue, onChange)
 *   Returns an HTMLElement.
 */

export function createSegmentBar(name, currentValue = 0, onChange = null) {
  const container = document.createElement('div');
  container.className = 'segment-bar';
  container.setAttribute('role', 'radiogroup');
  container.setAttribute('aria-label', name);

  for (let i = 1; i <= 5; i++) {
    const seg = document.createElement('button');
    seg.type = 'button';
    seg.className = 'segment-bar__seg';
    if (i <= currentValue) seg.classList.add('segment-bar__seg--active');
    seg.setAttribute('role', 'radio');
    seg.setAttribute('aria-checked', i <= currentValue ? 'true' : 'false');
    seg.setAttribute('aria-label', `${name}: ${i}`);
    seg.dataset.value = i;
    seg.textContent = i;

    seg.addEventListener('click', () => {
      const newVal = parseInt(seg.dataset.value);
      // Update visual state
      container.querySelectorAll('.segment-bar__seg').forEach((s, idx) => {
        const active = idx < newVal;
        s.classList.toggle('segment-bar__seg--active', active);
        s.setAttribute('aria-checked', active ? 'true' : 'false');
      });
      if (onChange) onChange(newVal);
    });

    container.appendChild(seg);
  }

  return container;
}

/**
 * Update a segment bar's value without triggering onChange.
 */
export function updateSegmentBar(container, value) {
  container.querySelectorAll('.segment-bar__seg').forEach((s, idx) => {
    const active = idx < value;
    s.classList.toggle('segment-bar__seg--active', active);
    s.setAttribute('aria-checked', active ? 'true' : 'false');
  });
}
