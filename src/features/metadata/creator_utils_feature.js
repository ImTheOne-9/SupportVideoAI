

export const metadataFeature = {
  hasMetadataResult() {
    return Boolean(this.metadataResult.title || this.metadataResult.description || this.metadataResult.hashtags?.length);
  },
  selectMetadataOption(group, value) {
    if (!["language", "tone"].includes(group)) return;
    this.metadataOptions[group] = value;
    document.querySelectorAll(`[data-metadata-group="${group}"] button`).forEach((button) => {
      button.classList.toggle("active", button.dataset.value === value);
    });
    if (this.metadataCustomToneWrap) this.metadataCustomToneWrap.hidden = this.metadataOptions.tone !== "custom";
    this.renderMetadataView();
  },
  renderMetadataView() {
    Object.entries(this.metadataOptions).forEach(([group, value]) => {
      if (group === "customTone") return;
      document.querySelectorAll(`[data-metadata-group="${group}"] button`).forEach((button) => {
        button.classList.toggle("active", button.dataset.value === value);
      });
    });
    if (this.metadataCustomToneInput && this.metadataCustomToneInput.value !== this.metadataOptions.customTone) {
      this.metadataCustomToneInput.value = this.metadataOptions.customTone;
    }
    if (this.metadataCustomToneWrap) this.metadataCustomToneWrap.hidden = this.metadataOptions.tone !== "custom";
    const hasResult = this.hasMetadataResult();
    const hashtags = Array.isArray(this.metadataResult.hashtags) ? this.metadataResult.hashtags.join(" ") : String(this.metadataResult.hashtags || "");
    [
      [this.metadataTitleOutput, this.metadataResult.title, "Chưa có tiêu đề."],
      [this.metadataDescriptionOutput, this.metadataResult.description, "Chưa có mô tả."],
      [this.metadataHashtagsOutput, hashtags, "Chưa có hashtag."]
    ].forEach(([element, value, placeholder]) => {
      if (!element) return;
      element.classList.remove("error");
      element.textContent = value || placeholder;
      element.classList.toggle("empty", !value);
    });
    if (this.metadataStatusIcon) {
      this.metadataStatusIcon.textContent = hasResult ? "✓" : "✦";
      this.metadataStatusIcon.classList.toggle("complete", hasResult);
    }
    if (this.metadataResultMeta) this.metadataResultMeta.textContent = this.metadataModel ? `Gemini · ${this.metadataModel}` : "Gemini";
    document.querySelectorAll("[data-copy-metadata]").forEach((button) => button.disabled = !hasResult);
    const copyAll = document.getElementById("btn-copy-all-metadata");
    const regenerate = document.getElementById("btn-regenerate-metadata");
    if (copyAll) copyAll.disabled = !hasResult;
    if (regenerate) regenerate.disabled = !hasResult;
  },
  async handleGenerateMetadata() {
    if (!this.transcripts.length) {
      this.switchView("transcript", { force: true });
      return;
    }
    if (this.metadataOptions.tone === "custom" && !this.metadataOptions.customTone.trim()) {
      alert("Hãy mô tả giọng văn tùy chỉnh trước khi tạo metadata.");
      this.metadataCustomToneInput?.focus();
      return;
    }
    const button = document.getElementById("btn-generate-metadata");
    const regenerate = document.getElementById("btn-regenerate-metadata");
    const original = button?.innerHTML;
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span class="summary-loading-spinner"></span><span>Gemini đang tạo...</span>';
    }
    if (regenerate) regenerate.disabled = true;
    [this.metadataTitleOutput, this.metadataDescriptionOutput, this.metadataHashtagsOutput].forEach((element) => {
      if (!element) return;
      element.textContent = "Đang tạo nội dung...";
      element.classList.add("empty");
    });
    try {
      const result = await this.api.generateMetadata(this.transcripts, this.metadataOptions);
      this.metadataResult = {
        title: result.title || "",
        description: result.description || "",
        hashtags: Array.isArray(result.hashtags) ? result.hashtags : []
      };
      this.metadataModel = result.model || "Gemini";
      this.renderMetadataView();
    } catch (error) {
      [this.metadataTitleOutput, this.metadataDescriptionOutput, this.metadataHashtagsOutput].forEach((element) => {
        if (!element) return;
        element.textContent = error.message;
        element.classList.add("error");
      });
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = original;
      }
      if (regenerate) regenerate.disabled = !this.hasMetadataResult();
    }
  },
  metadataFieldText(field) {
    if (field === "hashtags") return Array.isArray(this.metadataResult.hashtags) ? this.metadataResult.hashtags.join(" ") : "";
    return String(this.metadataResult[field] || "");
  },
  async copyMetadataField(field, button) {
    const text = this.metadataFieldText(field);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Đã sao chép";
      setTimeout(() => button.textContent = original, 1200);
    } catch {
      alert("Không thể sao chép tự động. Hãy chọn nội dung và sao chép thủ công.");
    }
  },
  async copyAllMetadata() {
    if (!this.hasMetadataResult()) return;
    const text = `TIÊU ĐỀ\n${this.metadataFieldText("title")}\n\nMÔ TẢ\n${this.metadataFieldText("description")}\n\nHASHTAG\n${this.metadataFieldText("hashtags")}`;
    try {
      await navigator.clipboard.writeText(text);
      const button = document.getElementById("btn-copy-all-metadata");
      if (button) {
        const original = button.textContent;
        button.textContent = "Đã sao chép tất cả";
        setTimeout(() => button.textContent = original, 1200);
      }
    } catch {
      alert("Không thể sao chép tự động. Hãy sao chép từng phần.");
    }
  }
};
