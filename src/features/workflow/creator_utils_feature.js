

export const workflowFeature = {
  getWorkflowState() {
    return { transcript: this.transcripts.length > 0, cut: this.cutReviewed, segment: this.chapters.length > 0, broll: this.matchedPositions.length > 0, export: false };
  },
  canOpenWorkflowStep(t) {
    return { transcript: true, cut: true, segment: true, broll: true, summary: true, metadata: true, adCheck: true, settings: true, export: this.getWorkflowState().broll }[t] ?? false;
  },
  workflowBlockMessage(t) {
    return { cut: "H\xE3y n\u1EA1p A-Roll v\xE0 ho\xE0n th\xE0nh B\u1EA3n ghi l\u1EDDi tr\u01B0\u1EDBc.", segment: "H\xE3y ho\xE0n th\xE0nh b\u01B0\u1EDBc C\u1EAFt tr\u01B0\u1EDBc khi ph\xE2n \u0111o\u1EA1n.", broll: "H\xE3y t\u1EA1o \xEDt nh\u1EA5t m\u1ED9t ph\xE2n \u0111o\u1EA1n n\u1ED9i dung tr\u01B0\u1EDBc khi gh\xE9p B-Roll.", export: "Ch\u01B0a c\xF3 v\u1ECB tr\xED B-Roll n\xE0o \u0111\u1EC3 xu\u1EA5t." }[t] || "";
  },
  updateWorkflowUI() {
    Object.entries(this.pills).forEach(([t, e]) => {
      if (!e) return;
      const i = this.canOpenWorkflowStep(t);
      e.classList.toggle("locked", !i), e.setAttribute("aria-disabled", String(!i)), i || (e.title = this.workflowBlockMessage(t));
    });
  },
  hasLoadedAroll() {
    var t, e;
    return !!(this.isDemoMode || (t = this.activeArollFile) != null && t.file || (e = this.activeArollFile) != null && e.url);
  },
  updatePrerequisiteEmptyStates() {
    const t = this.hasLoadedAroll();
    document.querySelectorAll("[data-requires-aroll]").forEach((i) => {
      var n;
      i.hidden = t, (n = i.closest(".workspace-view")) == null || n.classList.toggle("missing-aroll", !t);
    });
    const e = this.transcripts.length > 0;
    document.querySelectorAll("[data-requires-transcript]").forEach((i) => {
      var n;
      i.hidden = e, (n = i.closest(".workspace-view")) == null || n.classList.toggle("missing-transcript", !e);
    });
  },
  switchView(t, { force: e = false } = {}) {
    var r, o, d, a, c, h;
    if (!this.views[t]) return;
    const i = this.canOpenWorkflowStep(t);
    if (!e && !i) {
      alert(this.workflowBlockMessage(t)), this.updateWorkflowUI();
      return;
    }
    this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "none", this.savedTranscriptsView.classList.remove("active")), this.currentView = t, this.updatePrerequisiteEmptyStates();
    const n = ["transcript", "cut", "segment", "broll", "export"], s = ["summary", "metadata", "adCheck", "settings"].includes(t) ? "transcript" : t;
    n.forEach((m, u) => {
      const g = this.pills[m];
      g && (g.classList.remove("active"), g.classList.remove("completed"), m === s ? g.classList.add("active") : this.getWorkflowState()[m] && g.classList.add("completed"));
    }), Object.keys(this.views).forEach((m) => {
      const u = this.views[m];
      u && (m === t ? (u.style.display = "flex", u.classList.add("active")) : (u.style.display = "none", u.classList.remove("active")));
    }), document.querySelectorAll(".sidebar-nav .nav-item").forEach((m) => m.classList.remove("active")), t === "broll" ? (r = this.sidebarNav.smartEdit) == null || r.classList.add("active") : t === "transcript" ? (o = this.sidebarNav.transcript) == null || o.classList.add("active") : t === "segment" ? (d = this.sidebarNav.chapters) == null || d.classList.add("active") : t === "summary" ? (a = this.sidebarNav.summary) == null || a.classList.add("active") : t === "cut" ? (c = this.sidebarNav.autoCut) == null || c.classList.add("active") : t === "export" && ((h = this.sidebarNav.exportMenu) == null || h.classList.add("active")), t === "transcript" ? this.renderTranscriptView() : t === "cut" ? this.renderCutView() : t === "segment" ? this.renderSegmentView() : t === "summary" ? this.renderSummaryView() : t === "broll" ? (this.updateTimelineWidth(), this.drawWaveform(), this.drawRuler(), this.renderTimelineBrollBlocks()) : t === "export" && this.renderExportView(), this.updateWorkflowUI();
    if (t === "metadata") {
      this.sidebarNav.metadata?.classList.add("active");
      this.renderMetadataView();
    }
    if (t === "adCheck") {
      this.sidebarNav.adCheck?.classList.add("active");
      this.renderAdCheckView();
    }
    if (t === "settings") {
      this.sidebarNav.settings?.classList.add("active");
      this.loadSettingsPage();
    }
  },
  showProcessing(t, e = "", i = null) {
    if (this.processingBanner && (this.processingBanner.hidden = false, this.processingStatus && (this.processingStatus.textContent = t), this.processingDetail && (this.processingDetail.textContent = e), this.processingProgress)) {
      const n = Number.isFinite(i);
      this.processingProgress.classList.toggle("indeterminate", !n), n && (this.processingProgress.style.width = `${Math.max(2, Math.min(100, i))}%`);
    }
  },
  hideProcessing() {
    this.processingBanner && (this.processingBanner.hidden = true);
  }
};
