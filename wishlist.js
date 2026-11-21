// "Tell me when it launches": saves the email to the Supabase wishlist table (PLAN A2).
// The key below is the project's publishable key: public by design. Row-level security only lets it ADD a
// wishlist row, never read one (backend/schema.sql).
(function () {
  var URL = "https://iwrwyndbodpnswmespwb.supabase.co/rest/v1/wishlist";
  var KEY = "sb_publishable_I3Rf4MiEWajWRZcKOJlv1w_u4RpvR_U";
  var form = document.getElementById("wishlist-form");
  if (!form) return;
  var msg = document.getElementById("wishlist-msg");
  var button = form.querySelector("button");

  function say(text, ok) {
    msg.textContent = text;
    msg.className = "wl-msg " + (ok ? "ok" : "bad");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.website.value) return;           // hidden field only bots fill in
    var email = form.email.value.trim();
    if (!form.consent.checked) { say("Please tick the box so we may email you.", false); return; }
    var source = new URLSearchParams(location.search).get("utm_source") || "site";
    button.disabled = true;
    say("Saving...", true);
    fetch(URL, {
      method: "POST",
      headers: { "apikey": KEY, "Content-Type": "application/json", "Prefer": "return=minimal" },
      body: JSON.stringify({ email: email, consent: true, source: source.slice(0, 64) })
    }).then(function (r) {
      if (r.status === 201 || r.status === 409) {   // 409: already on the list, which is fine
        form.reset();
        say("You're on the list. We'll email you once, on launch day.", true);
      } else {
        say("That didn't work. Check the address and try again.", false);
      }
    }).catch(function () {
      say("No connection. Please try again in a moment.", false);
    }).then(function () { button.disabled = false; });
  });
})();
