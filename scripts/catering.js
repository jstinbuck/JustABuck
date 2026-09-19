// Progressive enhancement: the form and its email alternatives also work without JS.
(() => {
  const form = document.getElementById('cateringForm');
  if (!form || !window.fetch || !window.FormData || !window.AbortController) return;

  const byId = id => document.getElementById(id);
  const date = byId('cateringDate');
  const dateUnknown = byId('cateringDateUnknown');
  const dateUnknownWrap = byId('cateringDateUnknownWrap');
  const location = byId('cateringLocation');
  const guests = byId('cateringGuests');
  const packageSelect = byId('cateringPackage');
  const name = byId('cateringName');
  const email = byId('cateringEmail');
  const submit = byId('cateringSubmit');
  const status = byId('cateringStatus');
  const success = byId('cateringSuccess');
  const successEmail = byId('cateringSuccessEmail');
  const newInquiry = byId('cateringNewInquiry');
  const fallback = byId('cateringEmailFallback');
  const notice = byId('cateringPackageNotice');
  const optional = byId('cateringOptional');
  const guestsLabel = byId('cateringGuestsLabel');
  const guestsHint = byId('cateringGuestsHint');
  if (![date, dateUnknown, dateUnknownWrap, location, guests, packageSelect,
    name, email, submit, status, success, successEmail, newInquiry].every(Boolean)) return;

  const packages = Object.freeze({
    'burger-bar': 'Burger-Bar',
    'streetfood-buffet': 'Streetfood-Buffet',
    'event-stand': 'Event-Stand',
    wunschmenue: 'Wunschmenü'
  });
  const isKnownPackage = value => Object.prototype.hasOwnProperty.call(packages, value);
  const packageName = () => isKnownPackage(packageSelect.value)
    ? packages[packageSelect.value] : 'Noch offen';
  const subject = () => `Unverbindliche Catering-Anfrage – ${packageName()}`;
  const fields = Array.from(form.querySelectorAll('input, select, textarea'))
    .filter(field => field.type !== 'hidden' && field.name !== 'botcheck');
  const originalSubmitText = submit.textContent;
  const fallbackAddress = fallback?.getAttribute('href')?.split('?')[0];
  let pending = false;
  let completed = false;
  let attempted = false;

  const updateDate = () => {
    const today = new Date();
    date.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    date.disabled = dateUnknown.checked;
    date.required = !dateUnknown.checked;
  };

  const setStatus = (message, state = '') => {
    status.textContent = message;
    status.classList.toggle('is-error', state === 'error');
    status.dataset.state = state;
  };

  const setError = (field, message) => {
    let error = byId(`${field.id}Error`);
    if (message && !error && field.id) {
      error = document.createElement('span');
      error.id = `${field.id}Error`;
      error.className = 'catering-field-error';
      field.insertAdjacentElement('afterend', error);
      const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
      describedBy.add(error.id);
      field.setAttribute('aria-describedby', Array.from(describedBy).join(' '));
    }
    if (error) {
      error.textContent = message;
      error.hidden = !message;
    }
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const validationMessage = field => {
    if (field.disabled || !field.willValidate) return '';
    const value = field.value.trim();
    if (field === guests && (field.validity.badInput || (value &&
      (!Number.isSafeInteger(Number(value)) || Number(value) < 1)))) {
      return 'Bitte gib eine ganze Zahl ab 1 an. Eine Schätzung genügt.';
    }
    if (field.required && !value) {
      if (field === date) return 'Bitte wähle ein Datum oder „Termin noch offen“.';
      if (field === location) return 'Bitte gib den Veranstaltungsort an. Ort oder Postleitzahl genügen.';
      if (field === guests) return 'Bitte gib die ungefähre Gäste- oder Besucherzahl an.';
      if (field === name) return 'Bitte gib deinen Namen an.';
      if (field === email) return 'Bitte gib deine E-Mail-Adresse an.';
      return 'Bitte ergänze diese Angabe.';
    }
    if (field === date && value && value < date.min) {
      return 'Bitte wähle heute oder ein Datum in der Zukunft.';
    }
    if (field === email && field.validity.typeMismatch) {
      return 'Bitte gib eine gültige E-Mail-Adresse an, zum Beispiel name@beispiel.de.';
    }
    if (field.maxLength >= 0 && value.length > field.maxLength) {
      return `Bitte verwende höchstens ${field.maxLength} Zeichen.`;
    }
    if (!field.validity.valid) return 'Bitte prüfe diese Angabe.';
    return '';
  };

  const updateFallback = () => {
    if (!fallback || !fallbackAddress?.startsWith('mailto:')) return;
    const selectedOccasion = byId('cateringOccasion');
    const occasion = selectedOccasion?.selectedOptions[0]?.textContent.trim() || '';
    const body = [
      'Hallo Justin,',
      '',
      'ich möchte unverbindlich ein Catering anfragen.',
      '',
      `Format: ${packageName()}`,
      `Datum: ${dateUnknown.checked ? 'Termin noch offen' : date.value}`,
      `Veranstaltungsort: ${location.value.trim()}`,
      `${packageSelect.value === 'event-stand' ? 'Erwartete Besucher' : 'Ungefähre Gästezahl'}: ${guests.value}`,
      `Anlass: ${selectedOccasion?.value ? occasion : ''}`,
      `Name: ${name.value.trim()}`,
      `E-Mail: ${email.value.trim()}`,
      `Telefon: ${byId('cateringPhone')?.value.trim() || ''}`,
      '',
      `Wünsche / Nachricht:\n${byId('cateringMessage')?.value.trim() || ''}`
    ].join('\r\n');
    fallback.href = `${fallbackAddress}?subject=${encodeURIComponent(subject())}&body=${encodeURIComponent(body)}`;
  };

  const updatePackage = (announce = false) => {
    const eventStand = packageSelect.value === 'event-stand';
    if (guestsLabel) {
      guestsLabel.textContent = eventStand ? 'Erwartete Besucher ' : 'Ungefähre Gästezahl ';
      const marker = document.createElement('span');
      marker.setAttribute('aria-hidden', 'true');
      marker.textContent = '*';
      guestsLabel.append(marker);
    }
    if (guestsHint) {
      guestsHint.textContent = eventStand
        ? 'Wie viele Besucher erwartet ihr bei eurem Fest? Eine erste Schätzung genügt.'
        : 'Eine erste Schätzung genügt. Die genaue Zahl stimmen wir später ab.';
    }
    if (notice) notice.textContent = announce && isKnownPackage(packageSelect.value)
      ? `${packageName()} ist vorausgewählt. Du kannst das Format jederzeit ändern.` : '';
    updateFallback();
  };

  const focusField = field => {
    if (optional?.contains(field)) optional.open = true;
    field.focus();
  };

  const resetInquiry = (focus = true) => {
    if (pending) return;
    form.reset();
    packageSelect.value = '';
    dateUnknown.checked = false;
    updateDate();
    fields.forEach(field => setError(field, ''));
    if (optional) optional.open = false;
    attempted = false;
    completed = false;
    setStatus('');
    successEmail.textContent = '';
    success.hidden = true;
    form.hidden = false;
    updatePackage();
    if (focus) focusField(date);
  };

  fields.forEach(field => {
    field.addEventListener('input', () => {
      if (pending) return;
      if (attempted || field.hasAttribute('aria-invalid')) {
        setError(field, validationMessage(field));
      }
      updateFallback();
    });
  });

  dateUnknown.addEventListener('change', () => {
    if (pending) return;
    updateDate();
    setError(date, attempted ? validationMessage(date) : '');
    updateFallback();
  });
  packageSelect.addEventListener('change', () => updatePackage());
  form.addEventListener('change', updateFallback);
  newInquiry.addEventListener('click', () => resetInquiry());

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || completed) return;
    attempted = true;
    updateDate();
    fields.forEach(field => {
      if (['text', 'email', 'tel', 'textarea'].includes(field.type)) {
        field.value = field.value.trim();
      }
    });
    updateFallback();

    const invalidFields = fields.filter(field => {
      const message = validationMessage(field);
      setError(field, message);
      return Boolean(message);
    });
    if (invalidFields.length) {
      setStatus('Bitte prüfe die markierten Angaben.', 'error');
      focusField(invalidFields[0]);
      return;
    }

    const honeypot = form.querySelector('[name="botcheck"]');
    if (honeypot && (honeypot.type === 'checkbox' ? honeypot.checked : honeypot.value.trim())) {
      setStatus('Deine Anfrage konnte nicht gesendet werden. Bitte nutze die E-Mail-Alternative.', 'error');
      status.focus();
      return;
    }

    const data = new FormData(form);
    data.set('Format', packageName());
    data.set('subject', subject());
    data.set('replyto', email.value);
    if (dateUnknown.checked) data.set('Datum', 'Termin noch offen');
    const submittedEmail = email.value;
    const disabledState = Array.from(form.querySelectorAll('fieldset, input, select, textarea, button'))
      .map(control => ({ control, disabled: control.disabled }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    pending = true;
    form.setAttribute('aria-busy', 'true');
    disabledState.forEach(({ control }) => { control.disabled = true; });
    submit.textContent = 'Anfrage wird gesendet …';
    setStatus('Deine Anfrage wird gesendet …', 'sending');
    let responseTarget = status;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        signal: controller.signal,
        headers: { Accept: 'application/json' }
      });
      const result = await response.json();
      if (response.ok && result.success === true) {
        completed = true;
        successEmail.textContent = submittedEmail;
        form.hidden = true;
        success.hidden = false;
        setStatus('');
        responseTarget = success;
      } else {
        setStatus('Deine Anfrage konnte nicht gesendet werden. Deine Angaben bleiben erhalten. Bitte versuche es erneut oder nutze die E-Mail-Alternative.', 'error');
      }
    } catch (_error) {
      // A timeout or lost response cannot tell us whether the service received the request.
      setStatus('Der Versand konnte nicht bestätigt werden. Deine Angaben bleiben erhalten. Bitte nutze die E-Mail-Alternative oder versuche es später erneut.', 'error');
    } finally {
      window.clearTimeout(timeout);
      disabledState.forEach(({ control, disabled }) => { control.disabled = disabled; });
      submit.textContent = originalSubmitText;
      form.removeAttribute('aria-busy');
      pending = false;
      updateFallback();
      responseTarget.focus();
    }
  });

  document.querySelectorAll('a[data-catering-package]').forEach(link => {
    const value = link.dataset.cateringPackage;
    if (!isKnownPackage(value)) return;
    link.href = `?format=${encodeURIComponent(value)}#event-anfragen`;
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (pending) return;
      if (completed) resetInquiry(false);
      packageSelect.value = value;
      updatePackage(true);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      byId('event-anfragen')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      packageSelect.focus({ preventScroll: true });
    });
  });

  const initialPackage = new URLSearchParams(window.location.search).get('format');
  if (isKnownPackage(initialPackage)) packageSelect.value = initialPackage;
  updateDate();
  updatePackage(isKnownPackage(initialPackage));
  dateUnknownWrap.hidden = false;
  form.noValidate = true;
})();
