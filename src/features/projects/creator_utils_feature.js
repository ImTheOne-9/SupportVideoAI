import { escapeHtml } from '../../shared/html.js';

const E = escapeHtml;

export const projectsFeature = {
  projectSnapshot() {
    const t = this.activeArollFile;
    return { id: this.savedProjectId, name: this.currentProjectName, mediaName: (t == null ? void 0 : t.name) || "", durationSec: this.totalDurationSec, media: t ? { name: t.name, durationSec: t.durationSec, width: t.width, height: t.height, aspectRatio: t.aspectRatio, sizeMb: t.sizeMb, thumb: typeof t.thumb == "string" && t.thumb.startsWith("data:") ? t.thumb : null } : null, transcripts: this.transcripts, silenceCuts: this.silenceCuts, chapters: this.chapters, matchedPositions: this.matchedPositions, summary: this.summaryResult ? { content: this.summaryResult, model: this.summaryModel, options: this.summaryOptions } : null, brollLibrary: this.brollLibrary.map(({ file: e, videoUrl: i, ...n }) => n), cutReviewed: this.cutReviewed, settings: { silenceThreshold: this.silenceThreshold, silencePadding: this.silencePadding, detectFillers: this.detectFillers } };
  },
  async handleSaveProject() {
    if (!this.transcripts.length) {
      alert("Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi \u0111\u1EC3 l\u01B0u. H\xE3y ch\u1EA1y Whisper ho\u1EB7c nh\u1EADp SRT tr\u01B0\u1EDBc.");
      return;
    }
    const t = document.getElementById("btn-save-transcript"), e = t == null ? void 0 : t.innerHTML;
    t && (t.disabled = true, t.textContent = "\u0110ang l\u01B0u...");
    try {
      const i = await this.api.saveProject(this.projectSnapshot());
      this.savedProjectId = i.id, alert("\u0110\xE3 l\u01B0u b\u1EA3n ghi l\u1EDDi v\xE0o SQLite tr\xEAn m\xE1y.");
    } catch (i) {
      alert(i.message);
    } finally {
      t && (t.disabled = false, t.innerHTML = e);
    }
  },
  async openSavedProjects() {
    var t, e, i;
    Object.values(this.views).forEach((n) => {
      n && (n.style.display = "none", n.classList.remove("active"));
    }), this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "flex", this.savedTranscriptsView.classList.add("active")), this.currentView = "saved-transcripts", Object.values(this.pills).forEach((n) => n == null ? void 0 : n.classList.remove("active")), (t = this.pills.transcript) == null || t.classList.remove("completed"), (e = this.pills.transcript) == null || e.classList.add("active"), document.querySelectorAll(".sidebar-nav .nav-item").forEach((n) => n.classList.remove("active")), (i = this.sidebarNav.transcriptView) == null || i.classList.add("active"), this.savedProjectsList && (this.savedProjectsList.innerHTML = '<div class="saved-projects-empty">\u0110ang \u0111\u1ECDc d\u1EEF li\u1EC7u SQLite...</div>');
    try {
      const n = await this.api.listProjects();
      this.renderSavedProjects(n.projects || []);
    } catch (n) {
      this.savedProjectsList && (this.savedProjectsList.innerHTML = `<div class="saved-projects-empty">${E(n.message)}</div>`);
    }
  },
  closeSavedProjects({ restore: t = true } = {}) {
    var e;
    this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "none", this.savedTranscriptsView.classList.remove("active")), (e = this.sidebarNav.transcriptView) == null || e.classList.remove("active"), t && this.switchView("transcript", { force: true });
  },
  renderSavedProjects(t) {
    if (this.savedProjectsList) {
      if (!t.length) {
        this.savedProjectsList.innerHTML = '<div class="saved-projects-empty">Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi n\xE0o \u0111\u01B0\u1EE3c l\u01B0u.</div>';
        return;
      }
      this.savedProjectsList.innerHTML = "", t.forEach((e) => {
        var o, d;
        const i = document.createElement("div");
        i.className = "saved-project-card";
        const n = new Date(e.updatedAt).toLocaleString("vi-VN"), s = Math.floor((e.durationSec || 0) / 60), r = Math.floor((e.durationSec || 0) % 60).toString().padStart(2, "0");
        i.innerHTML = `
        <div class="saved-project-main">
          <div class="saved-project-name">${E(e.name)}</div>
          <div class="saved-project-meta">${E(e.mediaName || "Kh\xF4ng c\xF3 media")} \xB7 ${s}:${r} \xB7 ${e.transcriptCount} c\xE2u \xB7 ${E(n)}</div>
        </div>
        <div class="saved-project-actions">
          <button class="btn-secondary-action btn-open-saved">M\u1EDF</button>
          <button class="btn-action-ghost btn-delete-saved">X\xF3a</button>
        </div>`, (o = i.querySelector(".btn-open-saved")) == null || o.addEventListener("click", () => this.loadSavedProject(e.id)), (d = i.querySelector(".btn-delete-saved")) == null || d.addEventListener("click", async () => {
          if (confirm(`X\xF3a b\u1EA3n ghi "${e.name}" kh\u1ECFi m\xE1y?`)) try {
            await this.api.deleteProject(e.id), this.savedProjectId === e.id && (this.savedProjectId = null), await this.openSavedProjects();
          } catch (a) {
            alert(a.message);
          }
        }), this.savedProjectsList.appendChild(i);
      });
    }
  },
  async loadSavedProject(t) {
    var e, i, n, s, r, o, d;
    try {
      const c = (await this.api.getProject(t)).project, h = (e = this.activeArollFile) != null && e.file && this.activeArollFile.name === c.mediaName ? this.activeArollFile : null;
      this.savedProjectId = c.id, this.currentProjectName = c.name || "D\u1EF1 \xE1n \u0111\xE3 l\u01B0u", this.totalDurationSec = Number(c.durationSec) || 0, this.transcripts = c.transcripts || [], this.silenceCuts = c.silenceCuts || [], this.chapters = c.chapters || [], this.matchedPositions = c.matchedPositions || [], this.summaryResult = ((i = c.summary) == null ? void 0 : i.content) || "", this.summaryModel = ((n = c.summary) == null ? void 0 : n.model) || "", this.summaryOptions = { ...this.summaryOptions, ...((s = c.summary) == null ? void 0 : s.options) || {} }, this.brollLibrary = c.brollLibrary || [], this.cutReviewed = !!c.cutReviewed, this.silenceThreshold = ((r = c.settings) == null ? void 0 : r.silenceThreshold) ?? this.silenceThreshold, this.silencePadding = ((o = c.settings) == null ? void 0 : o.silencePadding) ?? this.silencePadding, this.detectFillers = ((d = c.settings) == null ? void 0 : d.detectFillers) ?? this.detectFillers, this.activeArollFile = h || c.media || (c.mediaName ? { name: c.mediaName, durationSec: this.totalDurationSec } : null), this.exporter = new F(this.currentProjectName, 30), this.projNameEl.textContent = this.currentProjectName, this.projSubEl.textContent = `B\u1EA3n ghi \u0111\xE3 l\u01B0u \xB7 ${this.transcripts.length} c\xE2u`, this.labelCurrentProject.textContent = this.currentProjectName, !h && this.mainVideoPlayer && (this.mainVideoPlayer.pause(), this.mainVideoPlayer.removeAttribute("src"), this.mainVideoPlayer.load(), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.pause(), this.transcriptVideoPlayer.removeAttribute("src"), this.transcriptVideoPlayer.load(), this.transcriptVideoPlayer.style.display = "none")), this.closeSavedProjects({ restore: false }), this.renderAll(), this.switchView("transcript", { force: true }), !h && c.mediaName && alert("\u0110\xE3 m\u1EDF b\u1EA3n ghi l\u1EDDi. H\xE3y ch\u1ECDn l\u1EA1i file video n\u1EBFu mu\u1ED1n ph\xE1t \xE2m thanh ho\u1EB7c ti\u1EBFp t\u1EE5c x\u1EED l\xFD media.");
    } catch (a) {
      alert(a.message);
    }
  }
};
