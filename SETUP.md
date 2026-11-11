# Connecting the form to your private Google Sheet

About five minutes. The Sheet stays private to you — the script writes to it on your behalf, so
nobody submitting the form ever gets access to it.

1. **Make the Sheet.** Create a new Google Sheet (sheets.new). Leave it unshared.
2. **Add the script.** In the Sheet: *Extensions → Apps Script*. Delete the starter code, paste in
   everything from `apps-script.gs`, and save.
3. **Deploy it.** *Deploy → New deployment →* gear icon *→ Web app.*
   - Execute as: **Me**
   - Who has access: **Anyone** (this lets the form post to it; it does *not* share the Sheet)
   - Click **Deploy**, approve the permissions prompt (Google will warn it's an unverified app —
     it's your own script; choose *Advanced → Go to project*).
4. **Copy the Web app URL** (ends in `/exec`).
5. **Paste it into the form.** In `index.html`, near the bottom:
   `const ENDPOINT = "https://script.google.com/macros/s/…/exec";`
6. **Test it.** Submit once. A `Submissions` tab appears in the Sheet with headers and your row.

**If you edit the script later**, use *Deploy → Manage deployments → Edit → Version: New version*
so the URL stays the same.

## Hosting the form
`index.html` is a single self-contained file. Drop it on any static host (Netlify, GitHub Pages,
your own site) or embed it. No server needed.

## Notes
- The form can't read Google's reply (a browser restriction on cross-site posts), so it shows
  "Thank you" once the request has gone out. Check the Sheet after your first test.
- A hidden spam-trap field quietly drops most bot submissions. If spam becomes a problem, add a
  CAPTCHA or move to Google Forms.
- Values starting with `=`, `+`, `-` or `@` are prefixed with `'` so nothing submitted runs as a
  spreadsheet formula.
- The checkboxes are self-declarations. They don't verify anything — you'll still want to check
  the Canada Business Registry yourself before using a name.
