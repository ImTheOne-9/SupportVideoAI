import { escapeHtml } from '../../shared/html.js';

const E = escapeHtml;

export const segmentFeature = {
  renderSegmentView() {
    const t = document.getElementById("segment-chapters-grid");
    if (t) {
      if (t.innerHTML = "", this.chapters.length === 0) {
        t.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--text-muted); font-size: 13px; line-height: 1.8; grid-column: 1 / -1; border: 1px dashed var(--border-color); border-radius: 8px;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg><br>
          <strong style="color: var(--text-main); font-size: 14px;">Ch\u01B0a c\xF3 ph\xE2n \u0111o\u1EA1n ch\u1EE7 \u0111\u1EC1 n\xE0o</strong><br>
          B\u1EA5m <strong>"T\u1EF1 \u0111\u1ED9ng ph\xE2n \u0111o\u1EA1n b\u1EB1ng Gemini"</strong> \u0111\u1EC3 AI ph\xE2n chia ch\u01B0\u01A1ng h\u1ED3i ho\u1EB7c b\u1EA5m <strong>"+ Th\xEAm ch\u01B0\u01A1ng m\u1EDBi"</strong> \u0111\u1EC3 t\u1EF1 t\u1EA1o.
        </div>
      `;
        return;
      }
      this.chapters.forEach((e) => {
        var n;
        const i = document.createElement("div");
        i.className = "chapter-card", i.id = `card-${e.id}`, i.innerHTML = `
        <div class="chapter-header">
          <span class="chapter-index-badge">Ch\u01B0\u01A1ng #${e.index}</span>
          <span class="chapter-time-badge">[${e.startTime} - ${e.endTime}] (${e.durationSec}s)</span>
        </div>
        <div class="chapter-title">${E(e.title)}</div>
        <div class="chapter-summary">${E(e.summary)}</div>
        <div class="chapter-tags-row">
          ${(e.tags || []).map((s) => `<span class="chapter-tag">${E(s)}</span>`).join("")}
        </div>
        <div class="chapter-footer">
          <div class="chapter-broll-info">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/></svg>
            <span>${e.brollMatches > 0 ? `\u0110\xE3 g\xE1n ${e.brollMatches} B-Roll (${e.matchedClipIds.join(", ")})` : "Ch\u01B0a c\xF3 B-Roll (Gi\u1EEF ng\u01B0\u1EDDi n\xF3i)"}</span>
          </div>
          <button class="btn-goto-broll" data-start="${e.startSec}" title="Chuy\u1EC3n sang timeline B-Roll">
            \u{1F3AC} \u0110i t\u1EDBi B-Roll
          </button>
        </div>
      `, (n = i.querySelector(".btn-goto-broll")) == null || n.addEventListener("click", () => {
          this.switchView("broll"), this.seekTo(e.startSec);
        }), t.appendChild(i);
      });
    }
  },
  async handleAiAutoSegment() {
    var i;
    const t = document.getElementById("btn-ai-auto-segment");
    if (!t) return;
    if (!this.transcripts.length) {
      alert("Ch\u01B0a c\xF3 transcript \u0111\u1EC3 ph\xE2n \u0111o\u1EA1n. H\xE3y ch\u1EA1y Whisper ho\u1EB7c nh\u1EADp file SRT tr\u01B0\u1EDBc.");
      return;
    }
    const e = t.innerHTML;
    t.innerHTML = '<span style="animation: spin 1s linear infinite;">\u2726</span> \u0110ang ph\xE2n \u0111o\u1EA1n Gemini...', t.disabled = true;
    try {
      const n = await this.api.segment(this.transcripts, ((i = this.txtPlacement) == null ? void 0 : i.value) || "");
      this.chapters = n.chapters || [], this.renderSegmentView(), this.updateWorkflowUI(), alert(`\u0110\xE3 ph\xE2n \u0111o\u1EA1n video th\xE0nh ${this.chapters.length} ch\u01B0\u01A1ng b\u1EB1ng Gemini.`);
    } catch (n) {
      alert(n.message);
    } finally {
      t.innerHTML = e, t.disabled = false;
    }
  },
  handleAddCustomChapter() {
    const t = prompt("Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\u01B0\u01A1ng m\u1EDBi:", "\u0110\xE1nh gi\xE1 hi\u1EC7u n\u0103ng th\u1EF1c t\u1EBF");
    if (!t) return;
    const e = this.chapters.length + 1, i = this.chapters.length > 0 ? this.chapters[this.chapters.length - 1].endSec : 0, n = i + 20, s = Math.floor(i / 60), r = Math.floor(i % 60), o = Math.floor(n / 60), d = Math.floor(n % 60);
    this.chapters.push({ id: `chap-${e}`, index: e, title: t.trim(), startTime: `${s.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`, endTime: `${o.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}`, startSec: i, endSec: n, durationSec: 20, tags: ["#custom_chapter"], summary: "Ph\xE2n \u0111o\u1EA1n \u0111\u01B0\u1EE3c t\u1EA1o th\u1EE7 c\xF4ng b\u1EDFi ng\u01B0\u1EDDi d\xF9ng.", brollMatches: 0, matchedClipIds: [] }), this.renderSegmentView(), this.updateWorkflowUI();
  }
};
