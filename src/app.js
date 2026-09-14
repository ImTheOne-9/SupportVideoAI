import { ClientTimelineExporter } from './exporter_client.js';
import { ApiClient } from './api_client.js';
import { ClientBrollMatcher } from './matcher_client.js';
import { TimelineExportService } from './features/export/timeline_export_service.js';
import { workflowFeature } from './features/workflow/creator_utils_feature.js';
import { projectsFeature } from './features/projects/creator_utils_feature.js';
import { transcriptFeature } from './features/transcript/creator_utils_feature.js';
import { summaryFeature } from './features/summary/creator_utils_feature.js';
import { metadataFeature } from './features/metadata/creator_utils_feature.js';
import { settingsFeature } from './features/settings/creator_utils_feature.js';
import { complianceFeature } from './features/compliance/creator_utils_feature.js';
import { cutFeature } from './features/cut/creator_utils_feature.js';
import { segmentFeature } from './features/segment/creator_utils_feature.js';
import { exportFeature } from './features/export/creator_utils_feature.js';
import { mediaFeature } from './features/media/creator_utils_feature.js';
import { playbackFeature } from './features/playback/creator_utils_feature.js';
import { timelineFeature } from './features/timeline/creator_utils_feature.js';

export class CreatorUtilsApp {
  metadataOptions = { language: "auto", tone: "professional", customTone: "" };
  metadataResult = { title: "", description: "", hashtags: [] };
  metadataModel = "";
  adCheckResult = null;
  adCheckModel = "";
  settingsData = { language: "vi", normalizeAudio: true, manualGainDb: 0, requestTimeoutSec: 300, whisperModel: "small", geminiModel: "gemini-3.6-flash", maxOutputTokens: 8192, batchDurationSec: 600 };
  whisperModels = [];
  constructor() {
    var t;
    this.brollPipXPercent = 0.56;
    this.brollPipYPercent = 0.03;
    this.isDemoMode = false, this.brollLibrary = [], this.matchedPositions = [], this.currentProjectName = "D\u1EF1 \xE1n m\u1EDBi", this.totalDurationSec = 0, this.currentTimeSec = 0, this.isPlaying = false, this.playbackInterval = null, this.pixelsPerSec = 2.4, this.waveformPeaks = null, this.activeArollFile = null, this.currentPlayingBrollId = null, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.savedProjectId = null, this.summaryOptions = { type: "brief", language: "auto", tone: "professional", customTone: "" }, this.summaryResult = "", this.summaryModel = "", this.api = new ApiClient(), this.currentView = "transcript", this.cutReviewed = false, this.transcripts = [], this.silenceCuts = [], this.chapters = [], this.silenceThreshold = 0.6, this.silencePadding = 0.15, this.detectFillers = true, this.matcher = new ClientBrollMatcher({ minDuration: 3, maxDuration: 12, segmentLength: 16, coverageRatio: 0.7, introHoldSec: 3, only16_9: true, placementGuidance: ((t = document.getElementById("txt-placement-guidance")) == null ? void 0 : t.value) || "" }), this.exporter = new ClientTimelineExporter(this.currentProjectName, 30), this.timelineExportService = new TimelineExportService(this.api, (...args) => this.exporter.downloadFile(...args)), this.initElements(), this.bindEvents(), this.renderAll(), this.switchView("transcript", { force: true }), this.loadSettingsPage();
  }
  initElements() {
    this.btnProjectSelector = document.getElementById("btn-project-selector"), this.projectDropdownMenu = document.getElementById("project-dropdown-menu"), this.itemNewProject = document.getElementById("item-new-project"), this.itemLoadSampleReview = document.getElementById("item-load-sample-review"), this.projNameEl = document.getElementById("proj-name"), this.projSubEl = document.getElementById("proj-sub"), this.labelCurrentProject = document.getElementById("label-current-project"), this.mainVideoPlayer = document.getElementById("main-video-player"), this.transcriptVideoPlayer = document.getElementById("transcript-video-player"), this.mainPlayerImage = document.getElementById("main-player-image"), this.emptyDropzone = document.getElementById("empty-dropzone"), this.btnDropzoneUpload = document.getElementById("btn-dropzone-upload"), this.brollOverlayVideo = document.getElementById("broll-overlay-video"), this.brollOverlayImg = document.getElementById("broll-overlay-img"), this.activeBrollOverlay = document.getElementById("active-broll-overlay"), this.brollOverlayLabel = document.getElementById("broll-overlay-label"), this.cardFootThumbEmpty = document.getElementById("card-foot-thumb-empty"), this.cardFootThumb = document.getElementById("card-foot-thumb"), this.inputArollFile = document.getElementById("input-aroll-file"), this.inputBrollFiles = document.getElementById("input-broll-files"), this.btnUploadAroll = document.getElementById("btn-upload-aroll"), this.btnUploadBroll = document.getElementById("btn-upload-broll"), this.dragDropOverlay = document.getElementById("drag-drop-overlay"), this.arollListContainer = document.getElementById("aroll-list-container"), this.arollSummaryText = document.getElementById("aroll-summary-text"), this.brollGridEl = document.getElementById("broll-grid"), this.matchedListEl = document.getElementById("matched-cards-container"), this.brollCountTitleEl = document.getElementById("broll-count-title"), this.matchedCountTitleEl = document.getElementById("matched-count-title"), this.badgeDiffRatio = document.getElementById("badge-diff-ratio"), this.trackBrollRowEl = document.getElementById("track-broll-row"), this.trackArollFilmstripEl = document.getElementById("track-aroll-filmstrip"), this.trackAudioWaveformEl = document.getElementById("track-audio-waveform"), this.waveformCanvas = document.getElementById("waveform-canvas"), this.rulerCanvas = document.getElementById("ruler-canvas"), this.playheadLine = document.getElementById("playhead-line"), this.playheadHandle = document.getElementById("playhead-handle"), this.playheadTooltip = document.getElementById("playhead-tooltip"), this.tooltipPreviewImg = document.getElementById("tooltip-preview-img"), this.timecodeDisplay = document.getElementById("player-timecode"), this.btnPlayPause = document.getElementById("btn-play-pause"), this.btnFitFrame = document.getElementById("btn-fit-frame"), this.playerSpeedSelect = document.getElementById("player-speed-select"), this.timelineTracksScroll = document.getElementById("timeline-tracks-scroll"), this.timelineWrapper = document.getElementById("timeline-canvas-wrapper"), this.sliderMinDuration = document.getElementById("slider-min-duration"), this.sliderMaxDuration = document.getElementById("slider-max-duration"), this.sliderSegmentLen = document.getElementById("slider-segment-len"), this.sliderCoverage = document.getElementById("slider-coverage"), this.sliderIntroHold = document.getElementById("slider-intro-hold"), this.chkOnly169 = document.getElementById("chk-only-16-9"), this.txtPlacement = document.getElementById("txt-placement-guidance"), this.btnRematch = document.getElementById("btn-rematch"), this.btnRematchText = document.getElementById("btn-rematch-text"), this.brollSearchInput = document.getElementById("broll-search-input"), this.zoomSlider = document.getElementById("timeline-zoom-slider"), this.exportModal = document.getElementById("export-modal"), this.stepExport = document.getElementById("step-export"), this.btnHeaderExport = document.getElementById("btn-header-export"), this.btnCloseModal = document.getElementById("btn-close-modal"), this.btnModalCancel = document.getElementById("btn-modal-cancel"), this.xmlPreviewCode = document.getElementById("xml-preview-code"), this.apiKeyModal = document.getElementById("api-key-modal"), this.btnApiKey = document.getElementById("btn-api-key"), this.btnCloseApiModal = document.getElementById("btn-close-api-modal"), this.btnCancelApiKey = document.getElementById("btn-cancel-api-key"), this.btnSaveApiKey = document.getElementById("btn-save-api-key"), this.inputGeminiKey = document.getElementById("input-gemini-key"), this.processingBanner = document.getElementById("transcript-processing-banner"), this.processingStatus = document.getElementById("transcript-processing-status"), this.processingDetail = document.getElementById("transcript-processing-detail"), this.processingProgress = document.getElementById("transcript-processing-progress"), this.savedTranscriptsView = document.getElementById("view-saved-transcripts"), this.savedProjectsList = document.getElementById("saved-projects-list"), this.summaryResultContent = document.getElementById("summary-result-content"), this.summaryResultTitle = document.getElementById("summary-result-title"), this.summaryResultMeta = document.getElementById("summary-result-meta"), this.summaryStatusIcon = document.getElementById("summary-status-icon"), this.summaryCustomToneWrap = document.getElementById("summary-custom-tone-wrap"), this.summaryCustomToneInput = document.getElementById("summary-custom-tone"), this.views = { transcript: document.getElementById("view-transcript"), cut: document.getElementById("view-cut"), segment: document.getElementById("view-segment"), broll: document.getElementById("view-broll"), summary: document.getElementById("view-summary"), export: document.getElementById("view-export") }, this.pills = { transcript: document.getElementById("step-transcript"), cut: document.getElementById("step-cut"), segment: document.getElementById("step-segment"), broll: document.getElementById("step-broll"), export: document.getElementById("step-export") }, this.sidebarNav = { smartEdit: document.getElementById("nav-smart-edit"), transcript: document.getElementById("nav-transcript"), transcriptView: document.getElementById("nav-transcript-view"), chapters: document.getElementById("nav-chapters"), summary: document.getElementById("nav-summary"), autoCut: document.getElementById("nav-auto-cut"), exportMenu: document.getElementById("nav-export-menu") }, this.api.health().then((t) => {
      this.btnApiKey && (this.btnApiKey.title = t.geminiConfigured ? "Gemini \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong AI engine" : "C\u1EA5u h\xECnh Gemini API Key");
    }).catch(() => {
    });
    this.metadataCustomToneWrap = document.getElementById("metadata-custom-tone-wrap");
    this.metadataCustomToneInput = document.getElementById("metadata-custom-tone");
    this.metadataTitleOutput = document.getElementById("metadata-title-output");
    this.metadataDescriptionOutput = document.getElementById("metadata-description-output");
    this.metadataHashtagsOutput = document.getElementById("metadata-hashtags-output");
    this.metadataStatusIcon = document.getElementById("metadata-status-icon");
    this.metadataResultMeta = document.getElementById("metadata-result-meta");
    this.views.metadata = document.getElementById("view-metadata");
    this.sidebarNav.metadata = document.getElementById("nav-metadata");
    this.adReportStatusIcon = document.getElementById("ad-report-status-icon");
    this.adReportTitle = document.getElementById("ad-report-title");
    this.adReportMeta = document.getElementById("ad-report-meta");
    this.adReportSummary = document.getElementById("ad-report-summary");
    this.adFindingsList = document.getElementById("ad-findings-list");
    this.adRecommendations = document.getElementById("ad-recommendations");
    this.adRecommendationsList = document.getElementById("ad-recommendations-list");
    this.views.adCheck = document.getElementById("view-ad-check");
    this.sidebarNav.adCheck = document.getElementById("nav-ad-check");
    this.views.settings = document.getElementById("view-settings");
    this.sidebarNav.settings = document.getElementById("nav-settings");
    this.settingsSaveState = document.getElementById("settings-save-state");
    this.whisperModelList = document.getElementById("whisper-model-list");
    this.geminiServiceStatus = document.getElementById("gemini-service-status");
    this.geminiStatusDot = document.getElementById("gemini-status-dot");
  }
  bindEvents() {
    this.bindOverlayDragEvents();
    this.sidebarNav.adCheck?.addEventListener("click", () => this.switchView("adCheck"));
    document.getElementById("btn-run-ad-check")?.addEventListener("click", () => this.handleRunAdCheck());
    document.getElementById("btn-rerun-ad-check")?.addEventListener("click", () => this.handleRunAdCheck());
    document.getElementById("btn-copy-ad-report")?.addEventListener("click", () => this.copyAdReport());
    this.sidebarNav.settings?.addEventListener("click", () => this.switchView("settings"));
    document.querySelectorAll("[data-settings-tab]").forEach((button) => button.addEventListener("click", () => this.selectSettingsTab(button.dataset.settingsTab)));
    ["setting-language", "setting-normalize-audio", "setting-timeout", "setting-gemini-model", "setting-max-tokens", "setting-batch-duration"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", () => this.saveSettingsFromForm());
    });
    document.getElementById("setting-gain-minus")?.addEventListener("click", () => this.changeManualGain(-1));
    document.getElementById("setting-gain-plus")?.addEventListener("click", () => this.changeManualGain(1));
    document.getElementById("model-search")?.addEventListener("input", () => this.renderWhisperModels());
    document.getElementById("toggle-settings-key")?.addEventListener("click", () => this.toggleSettingsKey());
    document.getElementById("save-settings-key")?.addEventListener("click", () => this.saveSettingsGeminiKey());
    this.sidebarNav.metadata?.addEventListener("click", () => this.switchView("metadata"));
    document.querySelectorAll("[data-metadata-group] button").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.closest("[data-metadata-group]")?.dataset.metadataGroup;
        if (group) this.selectMetadataOption(group, button.dataset.value);
      });
    });
    this.metadataCustomToneInput?.addEventListener("input", (event) => {
      this.metadataOptions.customTone = event.target.value;
    });
    document.getElementById("btn-generate-metadata")?.addEventListener("click", () => this.handleGenerateMetadata());
    document.getElementById("btn-regenerate-metadata")?.addEventListener("click", () => this.handleGenerateMetadata());
    document.getElementById("btn-copy-all-metadata")?.addEventListener("click", () => this.copyAllMetadata());
    document.querySelectorAll("[data-copy-metadata]").forEach((button) => {
      button.addEventListener("click", () => this.copyMetadataField(button.dataset.copyMetadata, button));
    });
    var r, o, d, a, c, h, m, u, g, f, x, P, v, T, p, b, I, k, w, R, A, L, j, M, D, O, N, H, _, U, W, q, G, X, z, K, J, Y, Z, Q, tt, et, it, nt, st, rt, at, ot, ct, lt, dt, ht, mt, ut, pt, gt, yt, vt, ft, bt, St, xt, wt, Et, Ct, Tt, Pt, Lt, It, kt, Bt, Mt, $t, Rt, At, jt, Dt, Ft, Vt, Ot;
    (r = this.btnPlayPause) == null || r.addEventListener("click", () => this.togglePlay()), window.addEventListener("keydown", (l) => {
      l.code === "Space" && l.target.tagName !== "TEXTAREA" && l.target.tagName !== "INPUT" && (l.preventDefault(), this.togglePlay());
    }), (o = this.playerSpeedSelect) == null || o.addEventListener("change", (l) => {
      const y = parseFloat(l.target.value);
      this.mainVideoPlayer.playbackRate = y, this.brollOverlayVideo.playbackRate = y;
    }), (d = this.mainVideoPlayer) == null || d.addEventListener("timeupdate", () => {
      this.mainVideoPlayer.paused || (this.syncTime(this.mainVideoPlayer.currentTime), this.activeTranscriptEndSec !== null && this.mainVideoPlayer.currentTime >= this.activeTranscriptEndSec && (this.mainVideoPlayer.pause(), this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon(), this.currentView === "transcript" && this.renderTranscriptView()));
    }), (a = this.transcriptVideoPlayer) == null || a.addEventListener("timeupdate", () => {
      this.transcriptVideoPlayer.paused || (this.syncTime(this.transcriptVideoPlayer.currentTime), this.activeTranscriptEndSec !== null && this.transcriptVideoPlayer.currentTime >= this.activeTranscriptEndSec && (this.transcriptVideoPlayer.pause(), this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon(), this.renderTranscriptView()));
    }), (c = this.mainVideoPlayer) == null || c.addEventListener("ended", () => {
      this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon();
    }), (h = this.transcriptVideoPlayer) == null || h.addEventListener("ended", () => {
      this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon();
    }), (m = this.transcriptVideoPlayer) == null || m.addEventListener("play", () => {
      this.isPlaying = true, this.updatePlayPauseIcon();
    }), (u = this.transcriptVideoPlayer) == null || u.addEventListener("pause", () => {
      this.isPlaying = false, this.updatePlayPauseIcon();
    });
    let t = false;
    const e = (l) => {
      if (!this.timelineWrapper) return;
      const y = this.timelineWrapper.getBoundingClientRect(), C = Math.max(0, l.clientX - y.left), B = Math.min(this.totalDurationSec, Math.max(0, C / this.pixelsPerSec));
      this.seekTo(B);
    };
    (g = this.playheadHandle) == null || g.addEventListener("mousedown", (l) => {
      t = true, l.stopPropagation();
    }), (f = this.timelineWrapper) == null || f.addEventListener("click", (l) => {
      t || e(l);
    }), window.addEventListener("mousemove", (l) => {
      t && e(l);
    }), window.addEventListener("mouseup", () => {
      t = false;
    }), (x = this.sliderMinDuration) == null || x.addEventListener("input", (l) => {
      document.getElementById("val-min-duration").textContent = `${parseFloat(l.target.value).toFixed(1)}s`;
    }), (P = this.sliderMaxDuration) == null || P.addEventListener("input", (l) => {
      document.getElementById("val-max-duration").textContent = `${parseFloat(l.target.value).toFixed(1)}s`;
    }), (v = this.sliderSegmentLen) == null || v.addEventListener("input", (l) => {
      document.getElementById("val-segment-len").textContent = `${l.target.value}s`;
    }), (T = this.sliderCoverage) == null || T.addEventListener("input", (l) => {
      document.getElementById("val-coverage").textContent = `${l.target.value}%`;
    }), (p = this.sliderIntroHold) == null || p.addEventListener("input", (l) => {
      document.getElementById("val-intro-hold").textContent = `${l.target.value}s`;
    }), (b = this.chkOnly169) == null || b.addEventListener("change", () => this.handleRematch()), (I = this.btnRematch) == null || I.addEventListener("click", () => this.handleRematch()), (k = this.brollSearchInput) == null || k.addEventListener("input", (l) => this.handleBrollSearch(l.target.value)), (w = this.zoomSlider) == null || w.addEventListener("input", (l) => {
      const y = parseInt(l.target.value);
      this.pixelsPerSec = y / 100 * 4, this.updateTimelineWidth(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler();
    }), (R = this.btnFitFrame) == null || R.addEventListener("click", () => this.fitTimelineToFrame()), (A = this.btnProjectSelector) == null || A.addEventListener("click", (l) => {
      if (l.stopPropagation(), !this.projectDropdownMenu) return;
      const y = this.projectDropdownMenu.style.display === "flex";
      this.projectDropdownMenu.style.display = y ? "none" : "flex";
    }), document.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none");
    }), (L = this.itemNewProject) == null || L.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none"), this.resetToNewProject();
    }), (j = this.itemLoadSampleReview) == null || j.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none"), this.switchToOnlineSampleMode();
    }), (M = this.btnUploadAroll) == null || M.addEventListener("click", () => this.inputArollFile.click()), (D = this.btnUploadBroll) == null || D.addEventListener("click", () => this.inputBrollFiles.click()), (O = this.btnDropzoneUpload) == null || O.addEventListener("click", (l) => {
      l.stopPropagation(), this.inputArollFile.click();
    }), (N = this.emptyDropzone) == null || N.addEventListener("click", () => this.inputArollFile.click()), (H = this.inputArollFile) == null || H.addEventListener("change", async (l) => {
      const y = l.target.files[0];
      y && await this.handleLoadAroll(y);
    }), (_ = this.inputBrollFiles) == null || _.addEventListener("change", async (l) => {
      const y = Array.from(l.target.files);
      y.length > 0 && await this.handleLoadBrolls(y);
    });
    let i = 0;
    window.addEventListener("dragenter", (l) => {
      var y;
      l.preventDefault(), i++, (y = this.dragDropOverlay) == null || y.classList.add("active");
    }), window.addEventListener("dragleave", (l) => {
      var y;
      l.preventDefault(), i--, i <= 0 && (i = 0, (y = this.dragDropOverlay) == null || y.classList.remove("active"));
    }), window.addEventListener("dragover", (l) => l.preventDefault()), window.addEventListener("drop", async (l) => {
      var C;
      l.preventDefault(), i = 0, (C = this.dragDropOverlay) == null || C.classList.remove("active");
      const y = Array.from(l.dataTransfer.files).filter((B) => B.type.startsWith("video/"));
      y.length !== 0 && (y.length === 1 && !this.activeArollFile ? await this.handleLoadAroll(y[0]) : await this.handleLoadBrolls(y));
    });
    const n = () => {
      var l;
      this.updateXmlPreview(), (l = this.exportModal) == null || l.classList.add("active");
    }, s = () => {
      var l;
      return (l = this.exportModal) == null ? void 0 : l.classList.remove("active");
    };
    (U = this.btnHeaderExport) == null || U.addEventListener("click", n), (W = this.btnCloseModal) == null || W.addEventListener("click", s), (q = this.btnModalCancel) == null || q.addEventListener("click", s), (G = document.getElementById("btn-export-fcpxml")) == null || G.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generateFCPXML(this.matchedPositions, l, this.totalDurationSec, this.silenceCuts);
      this.exporter.downloadFile(`${this.currentProjectName}_Broll.fcpxml`, y, "application/xml");
    }), (X = document.getElementById("btn-export-premiere")) == null || X.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generatePremiereXML(this.matchedPositions, l, this.totalDurationSec, this.silenceCuts);
      this.exporter.downloadFile(`${this.currentProjectName}_Premiere.xml`, y, "application/xml");
    }), (z = document.getElementById("btn-export-davinci")) == null || z.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generateFCPXML(this.matchedPositions, l, this.totalDurationSec, this.silenceCuts);
      this.exporter.downloadFile(`${this.currentProjectName}_DaVinci.fcpxml`, y, "application/xml");
    }), (K = document.getElementById("btn-export-json")) == null || K.addEventListener("click", () => {
      const l = JSON.stringify({ project: this.currentProjectName, totalDurationSec: this.totalDurationSec, matchedCount: this.matchedPositions.length, placements: this.matchedPositions }, null, 2);
      this.exporter.downloadFile("broll_metadata.json", l, "application/json");
    }), (J = this.btnApiKey) == null || J.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.add("active");
    }), (Y = this.btnCloseApiModal) == null || Y.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.remove("active");
    }), (Z = this.btnCancelApiKey) == null || Z.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.remove("active");
    }), (Q = this.btnSaveApiKey) == null || Q.addEventListener("click", async () => {
      var y, C;
      const l = (y = this.inputGeminiKey) == null ? void 0 : y.value.trim();
      try {
        await this.api.setGeminiKey(l || ""), await window.creatorUtilsDesktop?.setGeminiKey?.(l || ""), this.inputGeminiKey && (this.inputGeminiKey.value = ""), alert(l ? "Gemini API Key \u0111\xE3 \u0111\u01B0\u1EE3c n\u1EA1p v\xE0o AI engine c\u1EE5c b\u1ED9." : "\u0110\xE3 x\xF3a Gemini API Key kh\u1ECFi AI engine."), (C = this.apiKeyModal) == null || C.classList.remove("active");
      } catch (B) {
        alert(B.message);
      }
    }), (tt = document.getElementById("btn-accept-all")) == null || tt.addEventListener("click", () => {
      alert(`\u0110\xE3 ch\u1EA5p nh\u1EADn to\xE0n b\u1ED9 ${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n B-roll s\u1EB5n s\xE0ng xu\u1EA5t timeline!`), this.matchedPositions.length && this.switchView("export");
    }), (et = this.pills.transcript) == null || et.addEventListener("click", () => this.switchView("transcript")), (it = this.pills.cut) == null || it.addEventListener("click", () => this.switchView("cut")), (nt = this.pills.segment) == null || nt.addEventListener("click", () => this.switchView("segment")), (st = this.pills.broll) == null || st.addEventListener("click", () => this.switchView("broll")), (rt = this.pills.export) == null || rt.addEventListener("click", () => this.switchView("export")), (at = this.sidebarNav.smartEdit) == null || at.addEventListener("click", () => this.switchView("broll")), (ot = this.sidebarNav.transcript) == null || ot.addEventListener("click", () => this.switchView("transcript")), (ct = this.sidebarNav.transcriptView) == null || ct.addEventListener("click", () => this.openSavedProjects()), (lt = this.sidebarNav.chapters) == null || lt.addEventListener("click", () => this.switchView("segment")), (dt = this.sidebarNav.summary) == null || dt.addEventListener("click", () => this.switchView("summary")), (ht = this.sidebarNav.autoCut) == null || ht.addEventListener("click", () => this.switchView("cut")), (mt = this.sidebarNav.exportMenu) == null || mt.addEventListener("click", () => this.switchView("export")), (ut = document.getElementById("btn-back-to-broll")) == null || ut.addEventListener("click", () => this.switchView("broll")), (pt = document.getElementById("input-transcript-search")) == null || pt.addEventListener("input", (l) => {
      this.renderTranscriptView(l.target.value.toLowerCase().trim());
    }), (gt = document.getElementById("btn-run-asr-ai")) == null || gt.addEventListener("click", () => this.handleRunAsrAi()), (yt = document.getElementById("btn-transcript-upload-aroll")) == null || yt.addEventListener("click", () => {
      var l;
      return (l = this.inputArollFile) == null ? void 0 : l.click();
    }), (vt = document.getElementById("btn-import-srt")) == null || vt.addEventListener("click", () => {
      var l;
      (l = document.getElementById("file-srt-input")) == null || l.click();
    }), (ft = document.getElementById("file-srt-input")) == null || ft.addEventListener("change", (l) => this.handleImportSrt(l)), (bt = document.getElementById("btn-export-srt-file")) == null || bt.addEventListener("click", () => this.handleExportSrt()), (St = document.getElementById("btn-save-transcript")) == null || St.addEventListener("click", () => this.handleSaveProject()), (xt = document.getElementById("btn-back-from-saved-transcripts")) == null || xt.addEventListener("click", () => this.closeSavedProjects()), (wt = document.getElementById("btn-refresh-saved-transcripts")) == null || wt.addEventListener("click", () => this.openSavedProjects()), document.querySelectorAll(".btn-go-transcript-empty").forEach((l) => {
      l.addEventListener("click", () => this.switchView("transcript", { force: true }));
    }), document.querySelectorAll("[data-summary-group] button").forEach((l) => {
      l.addEventListener("click", () => {
        var C;
        const y = (C = l.closest("[data-summary-group]")) == null ? void 0 : C.dataset.summaryGroup;
        y && this.selectSummaryOption(y, l.dataset.value);
      });
    }), (Et = this.summaryCustomToneInput) == null || Et.addEventListener("input", (l) => {
      this.summaryOptions.customTone = l.target.value;
    }), (Ct = document.getElementById("btn-generate-summary")) == null || Ct.addEventListener("click", () => this.handleGenerateSummary()), (Tt = document.getElementById("btn-copy-summary")) == null || Tt.addEventListener("click", () => this.copySummary()), (Pt = document.getElementById("btn-transcript-play")) == null || Pt.addEventListener("click", () => this.togglePlay()), (Lt = document.getElementById("slider-silence-thresh")) == null || Lt.addEventListener("input", (l) => {
      this.silenceThreshold = parseFloat(l.target.value);
      const y = document.getElementById("label-silence-thresh");
      y && (y.textContent = `${this.silenceThreshold.toFixed(1)}s`), this.refreshSilenceCuts();
    }), (It = document.getElementById("slider-padding-thresh")) == null || It.addEventListener("input", (l) => {
      this.silencePadding = parseFloat(l.target.value);
      const y = document.getElementById("label-padding-thresh");
      y && (y.textContent = `${this.silencePadding.toFixed(2)}s`), this.refreshSilenceCuts();
    }), (kt = document.getElementById("chk-detect-fillers")) == null || kt.addEventListener("change", (l) => {
      this.detectFillers = l.target.checked, this.renderCutView();
    }), (Bt = document.getElementById("btn-execute-auto-cut")) == null || Bt.addEventListener("click", () => this.handleExecuteAutoCut()), (Mt = document.getElementById("btn-reset-all-cuts")) == null || Mt.addEventListener("click", () => this.handleResetAllCuts()), ($t = document.getElementById("chk-toggle-all-cuts")) == null || $t.addEventListener("change", (l) => this.handleToggleAllCuts(l.target.checked)), (Rt = document.getElementById("btn-ai-auto-segment")) == null || Rt.addEventListener("click", () => this.handleAiAutoSegment()), (At = document.getElementById("btn-add-custom-chapter")) == null || At.addEventListener("click", () => this.handleAddCustomChapter()), (jt = document.getElementById("btn-export-fcpxml-dash")) == null || jt.addEventListener("click", () => this.exportFCPXML()), document.getElementById("btn-export-mp4-dash")?.addEventListener("click", () => this.exportMP4()), (Dt = document.getElementById("btn-export-premiere-dash")) == null || Dt.addEventListener("click", () => this.exportPremiereXML()), (Ft = document.getElementById("btn-export-davinci-dash")) == null || Ft.addEventListener("click", () => this.exportDaVinciXML()), (Vt = document.getElementById("btn-export-srt-dash")) == null || Vt.addEventListener("click", () => this.handleExportSrt()), (Ot = document.getElementById("btn-copy-xml-code")) == null || Ot.addEventListener("click", () => this.handleCopyXml()), window.addEventListener("resize", () => {
      this.drawWaveform(), this.drawRuler();
    });
  }

  bindOverlayDragEvents() {
    if (!this.activeBrollOverlay) return;
    const resizeHandle = document.getElementById("broll-resize-handle");

    const getVideoRenderRect = () => {
      const video = this.mainVideoPlayer;
      const container = this.activeBrollOverlay.parentElement;
      if (!video || !container || video.videoWidth === 0) {
        return { width: container.clientWidth, height: container.clientHeight, left: 0, top: 0 };
      }
      const videoRatio = video.videoWidth / video.videoHeight;
      const containerRatio = container.clientWidth / container.clientHeight;
      let w = container.clientWidth, h = container.clientHeight, x = 0, y = 0;
      if (videoRatio > containerRatio) {
        h = w / videoRatio;
        y = (container.clientHeight - h) / 2;
      } else {
        w = h * videoRatio;
        x = (container.clientWidth - w) / 2;
      }
      return { width: w, height: h, left: x, top: y };
    };

    this.activeBrollOverlay.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      if (e.target === resizeHandle) return; // handled separately
      
      e.preventDefault();
      const el = this.activeBrollOverlay;
      const parent = el.parentElement;
      if (!parent) return;
      const startX = e.clientX;
      const startY = e.clientY;
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const startLeft = rect.left - parentRect.left;
      const startTop = rect.top - parentRect.top;
      
      el.setPointerCapture(e.pointerId);
      
      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let newLeft = startLeft + dx;
        let newTop = startTop + dy;
        
        newLeft = Math.max(0, Math.min(newLeft, parentRect.width - rect.width));
        newTop = Math.max(0, Math.min(newTop, parentRect.height - rect.height));
        
        el.style.left = `${(newLeft / parentRect.width) * 100}%`;
        el.style.top = `${(newTop / parentRect.height) * 100}%`;
      };
      
      const onUp = (ev) => {
        el.releasePointerCapture(ev.pointerId);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
        const finalRect = el.getBoundingClientRect();
        const renderRect = getVideoRenderRect();
        const relativeX = (finalRect.left - parentRect.left) - renderRect.left;
        const relativeY = (finalRect.top - parentRect.top) - renderRect.top;
        this.brollPipXPercent = relativeX / renderRect.width;
        this.brollPipYPercent = relativeY / renderRect.height;
      };
      
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });

    if (resizeHandle) {
      resizeHandle.addEventListener('pointerdown', (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        
        const el = this.activeBrollOverlay;
        const parent = el.parentElement;
        if (!parent) return;
        
        const startX = e.clientX;
        const startWidth = el.offsetWidth;
        const renderRect = getVideoRenderRect();
        
        resizeHandle.setPointerCapture(e.pointerId);
        
        const onMove = (ev) => {
          const dx = ev.clientX - startX;
          let newWidth = startWidth + dx;
          newWidth = Math.max(renderRect.width * 0.1, Math.min(newWidth, parent.offsetWidth - el.offsetLeft));
          el.style.width = `${(newWidth / parent.offsetWidth) * 100}%`;
        };
        
        const onUp = (ev) => {
          resizeHandle.releasePointerCapture(ev.pointerId);
          resizeHandle.removeEventListener('pointermove', onMove);
          resizeHandle.removeEventListener('pointerup', onUp);
          resizeHandle.removeEventListener('pointercancel', onUp);
          this.brollPipScalePercent = el.offsetWidth / renderRect.width;
        };
        
        resizeHandle.addEventListener('pointermove', onMove);
        resizeHandle.addEventListener('pointerup', onUp);
        resizeHandle.addEventListener('pointercancel', onUp);
      });
    }

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const el = entry.target;
        const renderRect = getVideoRenderRect();
        if (renderRect.width > 0) {
           this.brollPipScalePercent = el.offsetWidth / renderRect.width;
        }
      }
    });
    resizeObserver.observe(this.activeBrollOverlay);
  }
}

Object.assign(
  CreatorUtilsApp.prototype,
  workflowFeature,
  projectsFeature,
  transcriptFeature,
  summaryFeature,
  metadataFeature,
  settingsFeature,
  complianceFeature,
  cutFeature,
  segmentFeature,
  exportFeature,
  mediaFeature,
  playbackFeature,
  timelineFeature,
);
