import { applyLanguage } from '../../i18n.js';
import { escapeHtml } from '../../shared/html.js';

const E = escapeHtml;

export const settingsFeature = {
  setAdCheckProgress(stage = "") {
    const order = ["scan", "aggregate", "report"];
    const activeIndex = order.indexOf(stage);
    document.querySelectorAll("#ad-check-progress [data-stage]").forEach((element, index) => {
      element.classList.toggle("active", index === activeIndex);
      element.classList.toggle("complete", stage === "complete" || index < activeIndex);
    });
    document.querySelectorAll("#ad-check-progress i").forEach((line, index) => {
      line.classList.toggle("complete", stage === "complete" || index < activeIndex);
    });
  },
  selectSettingsTab(tab) {
    document.querySelectorAll("[data-settings-tab]").forEach((button) => button.classList.toggle("active", button.dataset.settingsTab === tab));
    document.querySelectorAll("[data-settings-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.settingsPanel === tab));
    if (tab === "models") this.loadWhisperModels();
  },
  async loadSettingsPage() {
    if (this.settingsSaveState) this.settingsSaveState.textContent = "Đang đồng bộ…";
    try {
      const storedKey = await window.creatorUtilsDesktop?.getGeminiKey?.();
      if (storedKey) await this.api.setGeminiKey(storedKey);
      const payload = await this.api.getSettings();
      this.settingsData = { ...this.settingsData, ...(payload.settings || {}) };
      applyLanguage(this.settingsData.language);
      this.api.timeoutMs = Number(this.settingsData.requestTimeoutSec || 300) * 1000;
      this.renderSettingsForm();
      if (this.geminiServiceStatus) this.geminiServiceStatus.textContent = payload.geminiConfigured ? "Đang hoạt động" : "Chưa cấu hình";
      this.geminiStatusDot?.classList.toggle("active", !!payload.geminiConfigured);
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Đã đồng bộ";
    } catch (error) {
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Không kết nối được engine";
    }
  },
  renderSettingsForm() {
    const values = {
      "setting-language": this.settingsData.language,
      "setting-timeout": this.settingsData.requestTimeoutSec,
      "setting-gemini-model": this.settingsData.geminiModel,
      "setting-max-tokens": this.settingsData.maxOutputTokens,
      "setting-batch-duration": this.settingsData.batchDurationSec
    };
    Object.entries(values).forEach(([id, value]) => { const element = document.getElementById(id); if (element) element.value = value; });
    const normalize = document.getElementById("setting-normalize-audio");
    if (normalize) normalize.checked = !!this.settingsData.normalizeAudio;
    const gain = document.getElementById("setting-gain-value");
    if (gain) gain.textContent = `${Number(this.settingsData.manualGainDb) >= 0 ? "+" : ""}${this.settingsData.manualGainDb} dB`;
  },
  async saveSettingsFromForm() {
    const pick = (id) => document.getElementById(id);
    const next = {
      language: pick("setting-language")?.value || "vi",
      normalizeAudio: !!pick("setting-normalize-audio")?.checked,
      manualGainDb: Number(this.settingsData.manualGainDb) || 0,
      requestTimeoutSec: Number(pick("setting-timeout")?.value) || 300,
      whisperModel: this.settingsData.whisperModel || "small",
      geminiModel: pick("setting-gemini-model")?.value || "gemini-3.6-flash",
      maxOutputTokens: Number(pick("setting-max-tokens")?.value) || 8192,
      batchDurationSec: Number(pick("setting-batch-duration")?.value) || 600
    };
    if (this.settingsSaveState) this.settingsSaveState.textContent = "Đang lưu…";
    try {
      const payload = await this.api.saveSettings(next);
      this.settingsData = { ...this.settingsData, ...(payload.settings || next) };
      applyLanguage(this.settingsData.language);
      this.api.timeoutMs = Number(this.settingsData.requestTimeoutSec || 300) * 1000;
      this.renderSettingsForm();
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Đã lưu";
    } catch (error) {
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Lưu thất bại";
      alert(error.message);
    }
  },
  changeManualGain(delta) {
    this.settingsData.manualGainDb = Math.max(-12, Math.min(24, (Number(this.settingsData.manualGainDb) || 0) + delta));
    this.renderSettingsForm();
    this.saveSettingsFromForm();
  },
  toggleSettingsKey() {
    const input = document.getElementById("settings-gemini-key");
    const button = document.getElementById("toggle-settings-key");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    if (button) button.textContent = input.type === "password" ? "Hiện" : "Ẩn";
  },
  async saveSettingsGeminiKey() {
    const input = document.getElementById("settings-gemini-key");
    const button = document.getElementById("save-settings-key");
    const key = input?.value.trim() || "";
    if (button) { button.disabled = true; button.textContent = "Đang kết nối…"; }
    try {
      const result = await this.api.setGeminiKey(key);
      await window.creatorUtilsDesktop?.setGeminiKey?.(key);
      if (input) input.value = "";
      if (this.geminiServiceStatus) this.geminiServiceStatus.textContent = result.geminiConfigured ? "Đang hoạt động" : "Chưa kết nối";
      this.geminiStatusDot?.classList.toggle("active", !!result.geminiConfigured);
      alert(result.geminiConfigured ? "Đã kết nối Gemini với AI engine." : "Đã xóa API key khỏi phiên chạy.");
    } catch (error) { alert(error.message); }
    finally { if (button) { button.disabled = false; button.textContent = "Kết nối"; } }
  },
  async loadWhisperModels() {
    if (this.whisperModelList) this.whisperModelList.innerHTML = '<div class="settings-loading">Đang đọc danh sách mô hình…</div>';
    try {
      const payload = await this.api.listWhisperModels();
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) {
      if (this.whisperModelList) this.whisperModelList.innerHTML = `<div class="settings-loading error">${E(error.message)}</div>`;
    }
  },
  renderWhisperModels() {
    if (!this.whisperModelList) return;
    const query = (document.getElementById("model-search")?.value || "").toLowerCase().trim();
    const models = this.whisperModels.filter((model) => model.name.toLowerCase().includes(query) || model.id.includes(query));
    this.whisperModelList.innerHTML = models.map((model) => `<div class="model-row">
      <div class="model-info"><strong>${E(model.name)}</strong><small>${E(model.size)}${model.active ? " · Đang sử dụng" : ""}</small></div>
      <div class="model-actions">${model.installed ? `<button class="model-status ${model.active ? "active" : ""}" data-model-select="${E(model.id)}">${model.active ? "✓ Đang dùng" : "Chọn model"}</button>${model.active ? "" : `<button class="model-delete" data-model-delete="${E(model.id)}" title="Xóa model">Xóa</button>`}` : `<button class="model-download" data-model-download="${E(model.id)}">↓ Tải xuống</button>`}</div>
    </div>`).join("") || '<div class="settings-loading">Không tìm thấy mô hình.</div>';
    this.whisperModelList.querySelectorAll("[data-model-select]").forEach((button) => button.addEventListener("click", () => this.selectWhisperModel(button.dataset.modelSelect)));
    this.whisperModelList.querySelectorAll("[data-model-download]").forEach((button) => button.addEventListener("click", () => this.downloadWhisperModel(button.dataset.modelDownload, button)));
    this.whisperModelList.querySelectorAll("[data-model-delete]").forEach((button) => button.addEventListener("click", () => this.deleteWhisperModel(button.dataset.modelDelete)));
  },
  async selectWhisperModel(modelId) {
    this.settingsData.whisperModel = modelId;
    await this.saveSettingsFromForm();
    await this.loadWhisperModels();
  },
  async downloadWhisperModel(modelId, button) {
    if (button) { button.disabled = true; button.textContent = "Đang tải…"; }
    try {
      const payload = await this.api.downloadWhisperModel(modelId);
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) { alert(error.message); this.renderWhisperModels(); }
  },
  async deleteWhisperModel(modelId) {
    if (!confirm("Xóa model này khỏi bộ nhớ máy? Bạn có thể tải lại sau.")) return;
    try {
      const payload = await this.api.deleteWhisperModel(modelId);
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) { alert(error.message); }
  }
};
