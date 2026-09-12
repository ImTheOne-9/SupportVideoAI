

export const summaryFeature = {
  invalidateSummary() {
    this.summaryResult = "", this.summaryModel = "";
    this.metadataResult = { title: "", description: "", hashtags: [] };
    this.metadataModel = "";
    this.adCheckResult = null;
    this.adCheckModel = "";
  },
  selectSummaryOption(t, e) {
    ["type", "language", "tone"].includes(t) && (this.summaryOptions[t] = e, document.querySelectorAll(`[data-summary-group="${t}"] button`).forEach((i) => {
      i.classList.toggle("active", i.dataset.value === e);
    }), this.summaryCustomToneWrap && (this.summaryCustomToneWrap.hidden = this.summaryOptions.tone !== "custom"), this.renderSummaryView());
  },
  renderSummaryView() {
    const t = { brief: "B\u1EA3n t\xF3m t\u1EAFt", "key-points": "C\xE1c \xFD ch\xEDnh", "action-items": "C\xE1c vi\u1EC7c c\u1EA7n l\xE0m" };
    Object.entries(this.summaryOptions).forEach(([i, n]) => {
      i !== "customTone" && document.querySelectorAll(`[data-summary-group="${i}"] button`).forEach((s) => {
        s.classList.toggle("active", s.dataset.value === n);
      });
    }), this.summaryCustomToneInput && this.summaryCustomToneInput.value !== this.summaryOptions.customTone && (this.summaryCustomToneInput.value = this.summaryOptions.customTone), this.summaryCustomToneWrap && (this.summaryCustomToneWrap.hidden = this.summaryOptions.tone !== "custom"), this.summaryResultTitle && (this.summaryResultTitle.textContent = t[this.summaryOptions.type] || "B\u1EA3n t\xF3m t\u1EAFt"), this.summaryResultMeta && (this.summaryResultMeta.textContent = this.summaryModel ? `Gemini \xB7 ${this.summaryModel}` : "Gemini"), this.summaryResultContent && (this.summaryResultContent.classList.remove("error"), this.summaryResultContent.textContent = this.summaryResult || "Ch\u1ECDn thi\u1EBFt l\u1EADp ph\xEDa tr\xEAn r\u1ED3i nh\u1EA5n \u201CT\u1EA1o t\xF3m t\u1EAFt\u201D.", this.summaryResultContent.classList.toggle("empty", !this.summaryResult));
    const e = document.getElementById("btn-copy-summary");
    e && (e.disabled = !this.summaryResult), this.summaryStatusIcon && (this.summaryStatusIcon.textContent = this.summaryResult ? "\u2713" : "\u2726", this.summaryStatusIcon.classList.toggle("complete", !!this.summaryResult));
  },
  async handleGenerateSummary() {
    var i;
    if (!this.transcripts.length) {
      this.switchView("transcript", { force: true });
      return;
    }
    if (this.summaryOptions.tone === "custom" && !this.summaryOptions.customTone.trim()) {
      alert("H\xE3y m\xF4 t\u1EA3 gi\u1ECDng v\u0103n t\xF9y ch\u1EC9nh tr\u01B0\u1EDBc khi t\u1EA1o t\xF3m t\u1EAFt."), (i = this.summaryCustomToneInput) == null || i.focus();
      return;
    }
    const t = document.getElementById("btn-generate-summary"), e = t == null ? void 0 : t.innerHTML;
    t && (t.disabled = true, t.innerHTML = '<span class="summary-loading-spinner"></span><span>Gemini \u0111ang t\xF3m t\u1EAFt...</span>'), this.summaryResultContent && (this.summaryResultContent.textContent = "\u0110ang \u0111\u1ECDc b\u1EA3n ghi l\u1EDDi v\xE0 t\u1EA1o n\u1ED9i dung...", this.summaryResultContent.classList.add("empty"));
    try {
      const n = await this.api.summarize(this.transcripts, this.summaryOptions);
      this.summaryResult = n.summary || "", this.summaryModel = n.model || "Gemini", this.renderSummaryView();
    } catch (n) {
      this.summaryResultContent && (this.summaryResultContent.textContent = n.message, this.summaryResultContent.classList.add("error"));
    } finally {
      t && (t.disabled = false, t.innerHTML = e);
    }
  },
  async copySummary() {
    if (this.summaryResult) try {
      await navigator.clipboard.writeText(this.summaryResult);
      const t = document.getElementById("btn-copy-summary");
      if (t) {
        const e = t.textContent;
        t.textContent = "\u0110\xE3 sao ch\xE9p", setTimeout(() => {
          t.textContent = e;
        }, 1200);
      }
    } catch {
      alert("Kh\xF4ng th\u1EC3 sao ch\xE9p t\u1EF1 \u0111\u1ED9ng. H\xE3y ch\u1ECDn n\u1ED9i dung v\xE0 sao ch\xE9p th\u1EE7 c\xF4ng.");
    }
  }
};
