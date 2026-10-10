# Royal Wedding Invitation — Sanjana & Vidyasagar

A free, mobile-first static wedding invitation with an animated royal-door reveal, three-tap knocking, countdown, event cards, photo gallery, local editor, JSON import/export, calendar files, Google Maps links, and a WhatsApp RSVP message composer.

## Included

- `index.html` — invitation and editor
- `styles.css` — responsive design and animations
- `script.js` — interaction, countdown, event cards, editor, gallery and RSVP
- `config.js` — original editable wedding details
- `assets/` — original SVG placeholder artwork and generated knock/chime sound effects

## Quick start

1. Unzip the project folder.
2. Open `index.html` in a modern browser. Most features work directly from disk. If your browser blocks a feature, use a local static server:
   - Python: `python -m http.server 8000`
   - Then visit `http://localhost:8000`
3. Click **Open Invitation**, or tap the door screen three times.
4. Select **Edit Invitation** to change content.
5. Press **Save changes** to save configuration in this browser.

No paid service, API key, database, or backend is required. Google Fonts are loaded online; system fallback fonts are used if the network is unavailable.

## Editing details

- The first editable values are in `config.js`.
- The on-page editor changes the live preview.
- **Save changes** uses local browser storage. It is local to the current browser profile and does not synchronise across devices or publish changes to your hosted website.
- Use **Export configuration JSON** to make a backup. **Import configuration JSON** restores a previously exported configuration.
- To publish content edits, update `config.js` or the relevant files, then redeploy the folder. The local editor's browser-storage changes do not automatically modify files on disk.
- Wedding date is prefilled as **12 December 2026**. Haldi, Mehndi, and Sangeet dates and times are deliberately marked as unannounced.
- Venue is initially Lucknow, Uttar Pradesh, India. No specific venue or address is invented.
- Replace the placeholder gallery images with photographs you have permission to publish.

## Photos and audio

The editor accepts JPG, PNG, and WebP images up to 8 MB each. For editor-saved background audio, use an MP3/OGG/WAV/M4A file up to 2 MB; it is stored as a data URL in this browser's configuration. Browser storage quotas can still be reached if you also save many large photos. For a reliable published website or a larger music track, copy the audio file into `assets/` (for example `assets/wedding-music.mp3`) and set `musicUrl:"assets/wedding-music.mp3"` in `config.js`. Relative audio paths work when the project is deployed with the same folder structure. Uploaded previews are represented in the editor's local configuration; large data URLs may exceed browser storage quotas or make JSON exports large. Keep originals separately. For a public site, put optimised image/audio files in `assets/` and reference them with relative paths such as `assets/couple-1.webp`. Use only music and photos you are authorised to publish. The supplied sound effects are simple generated tones.

## RSVP privacy and limitations

The RSVP form prepares a WhatsApp message using the configured country-code number (digits only). The visitor must review and send it. Responses are **not automatically collected** by this static website. Without a backend or third-party form provider, the RSVP form cannot collect responses centrally.

## Free static publishing

### GitHub Pages
1. Create a GitHub repository and upload the contents of this folder (not the ZIP itself).
2. In repository **Settings → Pages**, select deployment from the main branch and root folder (or follow GitHub's current Pages workflow).
3. Wait for the deployment URL shown by GitHub Pages.
4. Open the URL on a phone and test the door animation, links, images and RSVP.
5. Share the URL via WhatsApp or Instagram.

### Cloudflare Pages
1. Create a Pages project and connect a repository containing these files, or upload the static project using a currently supported direct-upload workflow.
2. No build command is needed for this plain HTML/CSS/JS project; set the output directory to the project root.
3. Use the URL shown in the Pages dashboard.

Free-tier features and limits can change. Neither service guarantees a free custom domain, unlimited bandwidth, or unlimited storage. Compress images before publishing and avoid large audio files to keep mobile loading fast.

## Quality checks

- First load shows closed doors.
- Tapping the screen three times or choosing **Open Invitation** opens the doors.
- Invitation reveals after the opening animation.
- Four event cards render from config.
- Countdown updates each second using the selected date with India Standard Time offset.
- Music does not autoplay before interaction; the visitor can decline music.
- Photo upload previews are available in the editor; gallery photos open in a lightbox.
- Editing fields update the current preview; Save stores a browser-local config.
- JSON export/import are implemented.
- Event map links, `.ics` calendar downloads and WhatsApp message composition use configured data.
- The site works without backend services or API keys.

## Notes

This is an original design inspired by the general concept of a ceremonial door reveal, not a reproduction of proprietary Dastak artwork or code. Browser storage is not a substitute for a real backup. Test your published URL on both Android and iPhone-sized viewports before sharing.


## Background music fix (updated)

The editor now restores an uploaded audio data URL from the saved configuration when the page reloads. In Music:
1. Upload a small MP3 (up to 2 MB in this editor version).
2. Set Background music to On after interaction.
3. Click Save changes.
4. Open the invitation; if Chrome blocks playback, press Play on the audio player once.

For reliable publishing and larger tracks, place the licensed audio file inside `assets/` and set `musicUrl` in `config.js` to a relative path such as `assets/wedding-music.mp3`. Upload that file alongside the website. Browser autoplay rules can still require a visitor gesture.


## Featured song
The **Our Song** section and its YouTube embed have been removed from this version of the invitation.


## Cute couple Q&A — collect every guest's answers

The invitation now includes a five-question multiple-choice quiz with a guest name and an optional message. To see **each person's answers centrally**, connect it to a Google Sheet (free). Static website hosting alone cannot store shared responses; this small Apps Script endpoint provides the connection.

1. Create a new Google Sheet in the Google account where you want to receive the responses.
2. In that Sheet, choose **Extensions → Apps Script**.
3. Open the included `google-apps-script.gs` file, copy all of its code into the Apps Script editor (replace the starter code), and save.
4. Click **Deploy → New deployment → Select type: Web app**. Set **Execute as: Me** and **Who has access: Anyone**, then deploy and authorise it. This public endpoint accepts guest quiz answers; do not use it for sensitive information.
5. Copy the deployed web-app URL. It should begin `https://script.google.com/macros/s/`.
6. Open `config.js` and paste that URL between the quotes for `responseEndpoint`, for example: `responseEndpoint:"PASTE_YOUR_WEB_APP_URL_HERE"`.
7. Upload/redeploy the updated website files to your host. (Changing `config.js` in your local folder does not change an already-published site until you upload the updated file.)
8. Submit a test answer on the live website. Open your Google Sheet's **Guest Answers** tab to see a row for each submission, with timestamp, guest name, every answer, and their note. Keep the Sheet private and share it only with people who should see guest responses.

If you edit the Apps Script after deployment, use **Deploy → Manage deployments → Edit** and deploy a new version. The website's success message is best-effort because browsers do not expose a cross-origin Apps Script response to the page; verify the first test row appears in the Sheet before sharing the invitation widely.

The existing RSVP section still opens a WhatsApp message for the guest to send. The new Q&A is separate and uses the Google Sheet collector.


### Flower-petal gallery reveal
The gallery photos are initially covered by a soft pink flower-petal layer. On a phone, swipe the petals to the right; on a computer, click and drag the petals to the right. Once revealed, click a photo to open it larger. Keyboard users can focus the petal layer and press Enter or Space to reveal the photo.
