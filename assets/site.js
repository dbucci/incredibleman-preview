(function () {
  // Next Saturday in Central time (today if it is Saturday). Format: SAT NOV 7
  function nextSaturday() {
    try {
      var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).formatToParts(new Date());
      var get = function (t) { var p = parts.find(function (x) { return x.type === t; }); return p ? p.value : ''; };
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var add = (6 - days[get('weekday')] + 7) % 7;
      var sat = new Date(Date.UTC(Number(get('year')), Number(get('month')) - 1, Number(get('day')) + add));
      var label = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' }).format(sat);
      return 'SAT ' + label.toUpperCase();
    } catch (e) {
      return 'SATURDAY';
    }
  }
  document.querySelectorAll('[data-next-saturday]').forEach(function (el) { el.textContent = nextSaturday(); });

  // Close the phone menu after a tap
  document.querySelectorAll('.menu-panel a').forEach(function (a) {
    a.addEventListener('click', function () { var d = a.closest('details'); if (d) d.removeAttribute('open'); });
  });

  // Reduced motion: stop looping background video
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) document.querySelectorAll('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });

  // Story video: swap the poster for the YouTube player on tap
  document.querySelectorAll('[data-youtube]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + btn.getAttribute('data-youtube') + '?autoplay=1&rel=0&playsinline=1';
      frame.title = "Dustin's story";
      frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      btn.parentNode.replaceChild(frame, btn);
    });
  });
  document.querySelectorAll('a[href="#story"]').forEach(function (a) {
    a.addEventListener('click', function () { setTimeout(function () { var b = document.querySelector('[data-youtube]'); if (b) b.focus({ preventScroll: true }); }, 600); });
  });

  // Raise-your-hand forms (preview): remember the first name on this device only, then show the confirmation page
  document.querySelectorAll('form[data-join]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name=first_name]') || {}).value || '';
      try { sessionStorage.setItem('im_first_name', name.trim().slice(0, 40)); } catch (err) {}
      window.location.href = form.getAttribute('data-join');
    });
  });
  document.querySelectorAll('[data-first-name]').forEach(function (el) {
    var name = '';
    try { name = sessionStorage.getItem('im_first_name') || ''; } catch (err) {}
    el.textContent = name || 'brother';
  });

  // Email signup forms (preview): open the real signup page
  document.querySelectorAll('form[data-open]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.open(form.getAttribute('data-open'), '_blank', 'noopener');
    });
  });

  // Prayer request: compose an email to Pastor D
  document.querySelectorAll('form[data-prayer]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name=first_name]').value.trim();
      var req = form.querySelector('[name=request]').value.trim();
      var body = (req || '') + (name ? '\n\n- ' + name : '');
      window.location.href = 'mailto:dustin@incredibleman.org?subject=' + encodeURIComponent('Prayer request' + (name ? ' from ' + name : '')) + '&body=' + encodeURIComponent(body);
    });
  });
})();
