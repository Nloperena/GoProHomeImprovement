export function bindReviewExpand(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-review-text]').forEach((text) => {
    const card = text.closest('.review');
    const button = card?.querySelector<HTMLButtonElement>('[data-review-more]');
    if (!card || !button || button.dataset.bound === 'true') return;

    const overflowing = text.scrollHeight > text.clientHeight + 2;
    if (!overflowing) {
      button.hidden = true;
      return;
    }

    button.hidden = false;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const open = card.classList.toggle('is-expanded');
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'Read less' : 'Read more';
    });
  });
}
