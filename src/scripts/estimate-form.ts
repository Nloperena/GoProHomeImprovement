import {
  validateCity,
  validateEmail,
  validateMessage,
  validateName,
  validatePhone,
  validateService,
} from '../lib/spam-protection';

const VALID_SERVICES = [
  'power-washing',
  'interior-exterior-painting',
  'demolition',
  'trim-crown-molding',
  'wallpaper',
  'murals',
  'tv-mounting',
  'movie-rooms',
  'drywall',
  'other',
];

const FIELD_CHECKS: Array<[string, (value: string) => string | null]> = [
  ['name', validateName],
  ['phone', validatePhone],
  ['email', validateEmail],
  ['service', (value) => validateService(value, VALID_SERVICES)],
  ['city', validateCity],
  ['message', validateMessage],
];

function setFieldError(id: string, message: string | null) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  if (!input || !error) return;
  if (message) {
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.classList.remove('hidden');
  } else {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
    error.classList.add('hidden');
  }
}

function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const service = params.get('service');
  const city = params.get('city');
  const serviceInput = document.getElementById('service') as HTMLSelectElement | null;
  const cityInput = document.getElementById('city') as HTMLInputElement | null;

  if (service && serviceInput && VALID_SERVICES.includes(service)) {
    serviceInput.value = service;
  }

  if (city && cityInput && validateCity(city) === null) {
    cityInput.value = city;
  }
}

export function initEstimateForm() {
  const form = document.getElementById('estimate-form') as HTMLFormElement | null;
  const formSuccess = document.getElementById('form-success');
  const formError = document.getElementById('form-error');
  const formErrorMessage = document.getElementById('form-error-message');
  const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  const formStartedAt = Date.now();

  prefillFromQuery();
  if (!form || !submitButton) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let firstInvalid: HTMLElement | null = null;

    for (const [field, validate] of FIELD_CHECKS) {
      const message = validate(String(data[field] ?? ''));
      setFieldError(field, message);
      if (message && !firstInvalid) {
        firstInvalid = document.getElementById(field);
      }
    }

    if (firstInvalid) {
      firstInvalid.focus();
      formError?.classList.add('hidden');
      return;
    }

    data.formStartedAt = String(formStartedAt);
    data.website = String(data.website ?? '');

    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.textContent = 'Sending...';

    try {
      const response = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formStartedAt,
        }),
      });

      if (response.ok) {
        form.classList.add('hidden');
        formSuccess?.classList.remove('hidden');
        formError?.classList.add('hidden');
        const heading = formSuccess?.querySelector('h2') as HTMLElement | null;
        if (heading) {
          heading.tabIndex = -1;
          heading.focus();
        }
        return;
      }

      let errorMessage = 'There was a problem submitting your request. Please try again.';
      try {
        const errorData = await response.json();
        if (typeof errorData.error === 'string' && errorData.error.trim()) {
          errorMessage = errorData.error;
        }
      } catch {
        // Keep the fallback message when the response is not JSON.
      }

      if (formErrorMessage) formErrorMessage.textContent = errorMessage;
      formError?.classList.remove('hidden');
      formError?.focus();
    } catch (error) {
      console.error('Form submission error:', error);
      if (formErrorMessage) {
        formErrorMessage.textContent = 'There was a problem submitting your request. Please try again.';
      }
      formError?.classList.remove('hidden');
    } finally {
      if (!form.classList.contains('hidden')) {
        submitButton.disabled = false;
        submitButton.removeAttribute('aria-busy');
        submitButton.textContent = originalLabel;
      }
    }
  });
}
