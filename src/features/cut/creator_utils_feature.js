import { VideoImporter } from '../../video_importer.js';

const $ = VideoImporter;

export const cutFeature = {
  refreshSilenceCuts() {
    this.silenceCuts = $.detectSilenceRanges(this.waveformPeaks, this.totalDurationSec, this.silenceThreshold, this.silencePadding), this.cutReviewed = false, this.renderCutView(), this.updateWorkflowUI();
  },
  renderCutView() {
    const t = document.getElementById("cutter-table-body"), e = document.getElementById("cut-timeline-strip");
    if (!t || !e) return;
    t.innerHTML = "", e.innerHTML = "";
    const i = this.totalDurationSec || 161, n = this.silenceCuts.filter((p) => !this.detectFillers && p.type === "filler" ? false : p.durationSec >= this.silenceThreshold || p.type === "filler"), s = n.filter((p) => p.status !== "disabled"), r = s.reduce((p, b) => p + b.durationSec, 0), o = document.getElementById("badge-cut-savings");
    if (o) {
      const p = i > 0 ? Math.round(r / i * 100) : 0;
      o.textContent = `Ti\u1EBFt ki\u1EC7m: ~${r.toFixed(1)} gi\xE2y (${p}% th\u1EDDi l\u01B0\u1EE3ng)`;
    }
    const d = document.getElementById("metric-silence-count"), a = document.getElementById("metric-filler-count"), c = document.getElementById("metric-dur-before"), h = document.getElementById("metric-dur-after"), m = document.getElementById("cut-status-summary"), u = s.filter((p) => p.type === "silence").length, g = s.filter((p) => p.type === "filler").length;
    d && (d.textContent = `${u} \u0111o\u1EA1n (${s.filter((p) => p.type === "silence").reduce((p, b) => p + b.durationSec, 0).toFixed(1)}s)`), a && (a.textContent = `${g} t\u1EEB (${s.filter((p) => p.type === "filler").reduce((p, b) => p + b.durationSec, 0).toFixed(1)}s)`);
    const f = Math.floor(i / 60), x = Math.floor(i % 60);
    c && (c.textContent = `${f}:${x.toString().padStart(2, "0")}`);
    const P = Math.max(0, i - r), v = Math.floor(P / 60), T = Math.floor(P % 60);
    h && (h.textContent = `${v}:${T.toString().padStart(2, "0")}`), m && (m.textContent = `${s.length} \u0111o\u1EA1n \u0111\u01B0\u1EE3c ch\u1ECDn \u0111\u1EC3 c\u1EAFt`), n.forEach((p) => {
      const b = document.createElement("div");
      b.className = `cut-marker-red ${p.status === "disabled" ? "disabled" : ""}`;
      const I = p.startSec / i * 100, k = Math.max(0.8, p.durationSec / i * 100);
      b.style.left = `${I}%`, b.style.width = `${k}%`, b.title = `${p.label} (${p.durationSec}s) t\u1EA1i ${p.startSec.toFixed(1)}s`, e.appendChild(b);
    }), n.length === 0 && (t.innerHTML = `
        <tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px;">
          Ch\u01B0a ph\xE1t hi\u1EC7n kho\u1EA3ng l\u1EB7ng n\xE0o c\u1EA7n c\u1EAFt b\u1ECF.<br>
          <span style="font-size: 11.5px; opacity: 0.7;">K\xE9o th\u1EA3 video A-Roll ho\u1EB7c \u0111i\u1EC1u ch\u1EC9nh thanh tr\u01B0\u1EE3t ng\u01B0\u1EE1ng gi\xE2y b\xEAn tr\xE1i.</span>
        </td></tr>
      `), n.forEach((p) => {
      var I, k;
      const b = document.createElement("tr");
      b.className = p.status === "disabled" ? "disabled-cut" : "", b.innerHTML = `
        <td><input type="checkbox" class="chk-cut-row" data-id="${p.id}" ${p.status !== "disabled" ? "checked" : ""}></td>
        <td><span class="${p.type === "silence" ? "cut-tag-red" : "cut-tag-amber"}">${p.label}</span></td>
        <td><code style="font-size:11px; color:var(--text-muted);">[${p.startSec.toFixed(2)}s - ${p.endSec.toFixed(2)}s]</code></td>
        <td><strong>${p.durationSec.toFixed(1)}s</strong></td>
        <td><span style="color: var(--text-muted); font-size: 11.5px;">Ph\xE1t hi\u1EC7n t\u1EF1 \u0111\u1ED9ng b\u1EDFi b\u1ED9 l\u1ECDc t\u1EA7n s\u1ED1</span></td>
        <td style="text-align: right;">
          <button class="btn-action-ghost btn-toggle-cut" data-id="${p.id}" style="font-size: 11px;">
            ${p.status === "disabled" ? "Kh\xF4i ph\u1EE5c" : "B\u1ECF qua"}
          </button>
        </td>
      `, (I = b.querySelector(".chk-cut-row")) == null || I.addEventListener("change", (w) => {
        p.status = w.target.checked ? "active" : "disabled", this.renderCutView();
      }), (k = b.querySelector(".btn-toggle-cut")) == null || k.addEventListener("click", () => {
        p.status = p.status === "disabled" ? "active" : "disabled", this.renderCutView();
      }), t.appendChild(b);
    });
  },
  handleExecuteAutoCut() {
    const t = document.getElementById("btn-execute-auto-cut");
    if (!t) return;
    const e = this.silenceCuts.filter((n) => n.status !== "disabled"), i = e.reduce((n, s) => n + s.durationSec, 0);
    t.innerHTML = `<span>\u23F3 \u0110ang c\u1EAFt ${e.length} ph\xE2n \u0111o\u1EA1n...</span>`, setTimeout(() => {
      t.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>X\xE1c nh\u1EADn danh s\xE1ch c\u1EAFt</span>', this.cutReviewed = true, this.updateWorkflowUI(), alert(`\u0110\xE3 x\xE1c nh\u1EADn ${e.length} kho\u1EA3ng l\u1EB7ng (${i.toFixed(1)} gi\xE2y). File ngu\u1ED3n kh\xF4ng b\u1ECB thay \u0111\u1ED5i; \u0111\xE2y l\xE0 danh s\xE1ch c\u1EAFt cho timeline.`);
    }, 450);
  },
  handleResetAllCuts() {
    this.silenceCuts.forEach((t) => t.status = "active"), this.renderCutView();
  },
  handleToggleAllCuts(t) {
    this.silenceCuts.forEach((e) => e.status = t ? "active" : "disabled"), this.renderCutView();
  }
};
