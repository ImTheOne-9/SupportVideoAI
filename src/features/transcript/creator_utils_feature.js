import { escapeHtml } from '../../shared/html.js';

const E = escapeHtml;

export const transcriptFeature = {
  renderTranscriptView(t = "") {
    var P;
    const e = document.getElementById("transcript-items-container");
    if (!e) return;
    e.innerHTML = "";
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60), s = `${i}:${n.toString().padStart(2, "0")}`, r = document.getElementById("transcript-total-time");
    r && (r.textContent = s);
    const o = document.getElementById("transcript-current-time");
    if (o) {
      const v = Math.floor(this.currentTimeSec / 60), T = Math.floor(this.currentTimeSec % 60);
      o.textContent = `${v}:${T.toString().padStart(2, "0")}`;
    }
    const d = document.getElementById("transcript-progress-fill");
    d && (d.style.width = this.totalDurationSec > 0 ? `${this.currentTimeSec / this.totalDurationSec * 100}%` : "0%");
    const a = this.transcriptVideoPlayer, c = document.getElementById("transcript-poster-empty"), h = document.getElementById("transcript-play-overlay");
    (P = this.activeArollFile) != null && P.url ? (a && (a.src !== this.activeArollFile.url && (a.src = this.activeArollFile.url), a.style.display = "block"), c && (c.style.display = "none"), h && (h.style.display = "none")) : (a && (a.src = "", a.style.display = "none"), c && (c.style.display = "flex"), h && (h.style.display = "none"));
    const m = this.transcripts.reduce((v, T) => v + (T.text ? T.text.trim().split(/\s+/).length : 0), 0), u = document.getElementById("metric-sentence-count"), g = document.getElementById("metric-word-count"), f = document.getElementById("metric-speech-speed");
    if (u && (u.textContent = `${this.transcripts.length} c\xE2u`), g && (g.textContent = `${m} t\u1EEB`), f) if (this.totalDurationSec > 0 && m > 0) {
      const v = Math.round(m / (this.totalDurationSec / 60));
      f.textContent = `${v} t\u1EEB / ph\xFAt (T\u1ED1i \u01B0u)`;
    } else f.textContent = "-- t\u1EEB / ph\xFAt";
    const x = this.transcripts.filter((v) => !t || v.text.toLowerCase().includes(t) || v.speaker.toLowerCase().includes(t));
    if (x.length === 0) {
      t ? e.innerHTML = `
          <div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 13px;">
            Kh\xF4ng t\xECm th\u1EA5y c\xE2u tho\u1EA1i n\xE0o kh\u1EDBp v\u1EDBi "${t}".
          </div>
        ` : e.innerHTML = `
          <div style="padding: 50px 20px; text-align: center; color: var(--text-muted); font-size: 13px; line-height: 1.8;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><br>
            <strong style="color: var(--text-main); font-size: 14px;">Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi n\xF3i cho d\u1EF1 \xE1n n\xE0y</strong><br>
            B\u1EA5m <strong>"Ch\xE9p l\u1EDDi AI (Whisper)"</strong> \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng b\xF3c b\u0103ng t\u1EEB \xE2m thanh video ho\u1EB7c b\u1EA5m <strong>"Nh\u1EADp .SRT"</strong> \u0111\u1EC3 n\u1EA1p file ph\u1EE5 \u0111\u1EC1 c\xF3 s\u1EB5n.
          </div>
        `;
      return;
    }
    x.forEach((v) => {
      var R, A;
      const T = this.currentTimeSec >= v.startSec && this.currentTimeSec <= v.endSec, p = document.createElement("div");
      p.className = `transcript-row-card ${T ? "highlighted" : ""}`, p.id = `ts-row-${v.id}`, p.innerHTML = `
        <span class="transcript-time-badge" title="B\u1EA5m \u0111\u1EC3 ph\xE1t t\u1EEB m\u1ED1c n\xE0y">[${E(v.startTime)} - ${E(v.endTime)}]</span>
        <span class="transcript-speaker-badge">${E(v.speaker)}</span>
        <div class="transcript-content-col">
          <input type="text" class="transcript-text-input" value="${E(v.text)}" data-id="${E(v.id)}" title="Nh\u1EA5p \u0111\u1EC3 s\u1EEDa tr\u1EF1c ti\u1EBFp c\xE2u tho\u1EA1i">
        </div>
        <div class="transcript-actions-col">
          <button class="btn-icon-tiny btn-ts-play" title="${this.activeTranscriptId === v.id && this.isPlaying ? "D\u1EEBng c\xE2u n\xE0y" : "Nghe c\xE2u n\xE0y"}">
            ${this.activeTranscriptId === v.id && this.isPlaying ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'}
          </button>
          <button class="btn-icon-tiny btn-ts-copy" title="Sao ch\xE9p c\xE2u">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="btn-icon-tiny btn-ts-del" title="X\xF3a c\xE2u">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
      const b = p.querySelector(".transcript-time-badge"), I = p.querySelector(".btn-ts-play"), k = () => {
        var L;
        if (this.activeTranscriptId === v.id && this.isPlaying) {
          this.togglePlay();
          return;
        }
        this.activeTranscriptId = v.id, this.activeTranscriptEndSec = v.endSec, this.seekTo(v.startSec), this.isPlaying ? (L = this.getPlaybackPlayer()) == null || L.play().catch(() => {
        }) : this.togglePlay(), this.renderTranscriptView(t);
      };
      b == null || b.addEventListener("click", k), I == null || I.addEventListener("click", k);
      const w = p.querySelector(".transcript-text-input");
      w == null || w.addEventListener("input", (L) => {
        v.text = L.target.value;
      }), w == null || w.addEventListener("change", () => {
        this.invalidateSummary(), this.handleRematch();
      }), (R = p.querySelector(".btn-ts-copy")) == null || R.addEventListener("click", () => {
        navigator.clipboard.writeText(v.text).then(() => {
          w.style.borderColor = "var(--color-green)", setTimeout(() => w.style.borderColor = "", 800);
        });
      }), (A = p.querySelector(".btn-ts-del")) == null || A.addEventListener("click", () => {
        this.transcripts = this.transcripts.filter((L) => L.id !== v.id), this.invalidateSummary(), this.renderTranscriptView(t), this.handleRematch();
      }), e.appendChild(p);
    });
  },
  async handleRunAsrAi() {
    var n;
    const t = document.getElementById("btn-run-asr-ai");
    if (!t) return;
    const e = (n = this.activeArollFile) == null ? void 0 : n.file;
    if (!e) {
      alert("H\xE3y n\u1EA1p m\u1ED9t file A-Roll t\u1EEB m\xE1y tr\u01B0\u1EDBc khi ch\u1EA1y Whisper. Video m\u1EABu kh\xF4ng ch\u1EE9a file ngu\u1ED3n \u0111\u1EC3 upload.");
      return;
    }
    const i = t.innerHTML;
    t.innerHTML = '<span style="animation: spin 1s linear infinite;">\u26A1</span> \u0110ang ch\u1EA1y Whisper...', t.disabled = true;
    try {
      this.transcripts = [], this.invalidateSummary(), this.cutReviewed = false, this.renderTranscriptView(), this.showProcessing("Whisper \u0111ang ch\xE9p l\u1EDDi", "\u0110ang n\u1EA1p model v\xE0 ph\xE2n t\xEDch \xE2m thanh...", null);
      let s = 0;
      for await (const r of this.api.transcribeStream(e, this.settingsData.language || "vi")) if (r.type === "segment" && r.segment) {
        this.transcripts.push(r.segment), s = r.count || this.transcripts.length;
        const o = this.totalDurationSec > 0 ? r.segment.endSec / this.totalDurationSec * 100 : null;
        this.showProcessing("Whisper \u0111ang ch\xE9p l\u1EDDi", `\u0110\xE3 nh\u1EADn ${s} c\xE2u \xB7 ${r.segment.endTime}`, o), this.renderTranscriptView();
      }
      this.handleRematch(), alert(`Ho\xE0n th\xE0nh b\xF3c b\u0103ng b\u1EB1ng Whisper: ${this.transcripts.length} c\xE2u tho\u1EA1i.`);
    } catch (s) {
      alert(s.message);
    } finally {
      t.innerHTML = i, t.disabled = false, this.hideProcessing();
    }
  },
  handleImportSrt(t) {
    const e = t.target.files[0];
    if (!e) return;
    const i = new FileReader();
    i.onload = (n) => {
      const s = n.target.result, r = this.parseSrtContent(s);
      r.length > 0 ? (this.transcripts = r, this.invalidateSummary(), this.cutReviewed = false, this.renderTranscriptView(), this.handleRematch(), alert(`\u0110\xE3 n\u1EA1p th\xE0nh c\xF4ng ${r.length} c\xE2u t\u1EEB file ph\u1EE5 \u0111\u1EC1 ${e.name}!`)) : alert("Kh\xF4ng th\u1EC3 \u0111\u1ECDc \u0111\u1ECBnh d\u1EA1ng ph\u1EE5 \u0111\u1EC1. H\xE3y d\xF9ng file .srt chu\u1EA9n.");
    }, i.readAsText(e);
  },
  parseSrtContent(t) {
    const e = t.trim().split(/\n\s*\n/), i = [];
    return e.forEach((n, s) => {
      const r = n.trim().split(`
`);
      if (r.length >= 2) {
        const o = r[1].includes("-->") ? r[1] : r[0], d = r.slice(r[1].includes("-->") ? 2 : 1).join(" "), a = o.split("-->").map((c) => c.trim());
        if (a.length === 2) {
          const c = (P) => {
            const v = P.replace(",", ".").split(":");
            return v.length === 3 ? parseFloat(v[0]) * 3600 + parseFloat(v[1]) * 60 + parseFloat(v[2]) : 0;
          }, h = c(a[0]), m = c(a[1]), u = Math.floor(h / 60), g = Math.floor(h % 60), f = Math.floor(m / 60), x = Math.floor(m % 60);
          i.push({ id: `ts-${s + 1}`, startSec: h, endSec: m, startTime: `${u.toString().padStart(2, "0")}:${g.toString().padStart(2, "0")}`, endTime: `${f.toString().padStart(2, "0")}:${x.toString().padStart(2, "0")}`, speaker: "Ng\u01B0\u1EDDi n\xF3i 1", text: d.trim() });
        }
      }
    }), i;
  },
  handleExportSrt() {
    let t = "";
    this.transcripts.forEach((e, i) => {
      const n = (s) => {
        const r = Math.floor(s / 3600), o = Math.floor(s % 3600 / 60), d = Math.floor(s % 60), a = Math.floor(s % 1 * 1e3);
        return `${r.toString().padStart(2, "0")}:${o.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")},${a.toString().padStart(3, "0")}`;
      };
      t += `${i + 1}
`, t += `${n(e.startSec)} --> ${n(e.endSec)}
`, t += `${e.text}

`;
    }), this.exporter.downloadFile(`${this.currentProjectName}_Subtitles.srt`, t, "text/plain");
  }
};
