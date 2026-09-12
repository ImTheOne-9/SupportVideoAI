import { ClientTimelineExporter } from '../../exporter_client.js';
import { VideoImporter } from '../../video_importer.js';
import { PROJECT_INFO, BROLL_LIBRARY, INITIAL_MATCHED_POSITIONS, SAMPLE_TRANSCRIPTS, SAMPLE_SILENCE_CUTS, SAMPLE_CHAPTERS } from '../../demo_data.js';

const $ = VideoImporter;

export const mediaFeature = {
  async handleLoadAroll(t) {
    try {
      this.switchView("transcript", { force: true }), this.showProcessing("\u0110ang n\u1EA1p A-Roll", `\u0110\u1ECDc th\xF4ng tin ${t.name}...`, 8), this.btnUploadAroll.innerHTML = '<span style="animation: spin 1s linear infinite;">\u23F3</span> N\u1EA1p...';
      const e = await $.loadVideoMetadata(t);
      this.showProcessing("\u0110ang n\u1EA1p A-Roll", "\u0110ang t\u1EA1o \u1EA3nh \u0111\u1EA1i di\u1EC7n video...", 30);
      const i = await $.captureFrame(t, Math.min(1.5, e.durationSec / 2));
      e.thumb = i, this.activeArollFile = e, this.savedProjectId = null, this.isDemoMode = false, this.updateModeUI(), this.currentProjectName = t.name.replace(/\.[^/.]+$/, ""), this.totalDurationSec = Math.round(e.durationSec), this.pixelsPerSec = this.calculateOptimalScale(), this.exporter = new ClientTimelineExporter(this.currentProjectName, 30), this.projNameEl.textContent = this.currentProjectName;
      const n = Math.floor(this.totalDurationSec / 60), s = Math.floor(this.totalDurationSec % 60);
      this.projSubEl.textContent = `1 video \xB7 ${n}:${s.toString().padStart(2, "0")}`, this.labelCurrentProject.textContent = this.currentProjectName, this.mainVideoPlayer.src = e.url, this.mainVideoPlayer.style.display = "block", this.emptyDropzone && (this.emptyDropzone.style.display = "none"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.src = e.url, this.transcriptVideoPlayer.style.display = "block"), this.updateSelectedFootageCard(e, "A-Roll");
      const r = document.getElementById("label-aroll-count");
      r && (r.textContent = "Video ch\xEDnh (1)"), this.showProcessing("\u0110ang n\u1EA1p A-Roll", "\u0110ang ph\xE2n t\xEDch track \xE2m thanh v\xE0 waveform...", 62), this.waveformPeaks = await $.extractAudioWaveform(t, 400), this.transcripts = [], this.invalidateSummary(), this.chapters = [], this.silenceCuts = $.detectSilenceRanges(this.waveformPeaks, this.totalDurationSec, this.silenceThreshold, this.silencePadding), this.cutReviewed = false, this.renderArollList(), this.updateTimelineWidth(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.seekTo(0), this.handleRematch(), this.switchView("transcript", { force: true }), this.showProcessing("\u0110\xE3 n\u1EA1p A-Roll", "Video s\u1EB5n s\xE0ng \u0111\u1EC3 ch\xE9p l\u1EDDi b\u1EB1ng Whisper.", 100), this.btnUploadAroll.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>N\u1EA1p A-Roll</span>';
    } catch (e) {
      alert(`L\u1ED7i khi n\u1EA1p video A-roll: ${e.message}`), this.btnUploadAroll.innerHTML = "<span>L\u1ED7i n\u1EA1p</span>";
    } finally {
      setTimeout(() => {
        var e;
        ((e = this.processingStatus) == null ? void 0 : e.textContent) === "\u0110\xE3 n\u1EA1p A-Roll" && this.hideProcessing();
      }, 700);
    }
  },
  async handleLoadBrolls(t) {
    var e;
    try {
      this.btnUploadBroll.innerHTML = `\u23F3 \u0110ang \u0111\u1ECDc ${t.length} clip...`;
      const i = [], n = await this.api.health().catch(() => null);
      for (let o = 0; o < t.length; o++) {
        const d = t[o], a = await $.loadVideoMetadata(d), c = await $.captureFrame(d, Math.min(1.5, a.durationSec / 2)), h = this.stableBrollId(d), m = { id: h, name: d.name, videoUrl: a.url, file: d, thumb: c, aspectRatio: a.aspectRatio, durationSec: parseFloat(a.durationSec.toFixed(1)), cameraAngle: a.is916 ? "Video d\u1ECDc (9:16)" : "C\u1EADn c\u1EA3nh chi ti\u1EBFt", description: `Clip B-roll th\u1EF1c t\u1EBF t\u1EEB file ${d.name}`, subjects: ["s\u1EA3n ph\u1EA9m", "footage"], tags: ["custom", a.aspectRatio], isUsed: false };
        if (n != null && n.geminiConfigured && c) {
          this.btnUploadBroll.innerHTML = `\u2726 Gemini \u0111ang ph\xE2n t\xEDch ${o + 1}/${t.length}...`;
          try {
            this.btnUploadBroll.innerHTML = `◫ Đang phát hiện cảnh ${o + 1}/${t.length}...`;
            const keyframes = await $.captureSceneKeyframes(d, a.durationSec, { threshold: 0.18, minSceneSec: 1.5, maxScenes: 10 });
            this.btnUploadBroll.innerHTML = `✦ Gemini đang index ${keyframes.length} cảnh · ${o + 1}/${t.length}...`;
            const u = await this.api.indexBrollScenes({
              clipId: h, clipName: d.name, fingerprint: `${d.name}:${d.size}:${d.lastModified}:${a.durationSec.toFixed(3)}`,
              durationSec: a.durationSec, aspectRatio: a.aspectRatio, guidance: ((e = this.txtPlacement) == null ? void 0 : e.value) || "", scenes: keyframes
            });
            m.scenes = u.scenes || [];
            const firstScene = m.scenes[0];
            m.description = firstScene?.description || m.description;
            m.cameraAngle = firstScene?.cameraAngle || m.cameraAngle;
            m.subjects = [...new Set(m.scenes.flatMap((scene) => scene.subjects || []))];
            m.tags = [...new Set(m.scenes.flatMap((scene) => scene.tags || []))];
            m.techFeatures = [...new Set(m.scenes.flatMap((scene) => scene.techFeatures || []))];
            m.indexCached = !!u.cached;
          } catch (u) {
            console.warn(`Kh\xF4ng th\u1EC3 index ${d.name} b\u1EB1ng Gemini:`, u);
          }
        }
        i.push(m);
      }
      this.isDemoMode ? this.brollLibrary = i : this.brollLibrary = [...i, ...this.brollLibrary], this.isDemoMode = false, this.updateModeUI(), this.brollCountTitleEl.textContent = `Clip B-Roll (${this.brollLibrary.length})`;
      const s = this.brollLibrary.filter((o) => o.aspectRatio !== "16:9").length;
      this.badgeDiffRatio.textContent = `${s} kh\xE1c t\u1EF7 l\u1EC7`, !this.brollLibrary.some((o) => o.aspectRatio === "16:9") && this.chkOnly169 && this.chkOnly169.checked && (this.chkOnly169.checked = false), this.renderBrollGrid(this.brollLibrary), this.handleRematch(), this.btnUploadBroll.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Th\xEAm B-Roll</span>';
    } catch (i) {
      alert(`L\u1ED7i khi n\u1EA1p danh s\xE1ch B-roll: ${i.message}`), this.btnUploadBroll.innerHTML = "<span>Th\xEAm B-Roll</span>";
    }
  },
  stableBrollId(file) {
    const value = `${file.name}:${file.size}:${file.lastModified}`;
    let hash = 2166136261;
    for (let index = 0; index < value.length; index++) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return `B${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
  },
  async switchToOnlineSampleMode() {
    var r, o, d;
    this.isDemoMode = false, (r = this.btnModeDemo) == null || r.classList.remove("active"), (o = this.btnModeOnlineSample) == null || o.classList.add("active"), (d = this.btnModeCustom) == null || d.classList.remove("active"), this.currentProjectName = "Deebot_T80_Tech_Review", this.exporter = new ClientTimelineExporter(this.currentProjectName, 30), this.totalDurationSec = 22, this.projNameEl.textContent = "Review Deebot T80 Max Omni (Video Th\u1EADt)";
    const t = Math.floor(this.totalDurationSec / 60), e = Math.floor(this.totalDurationSec % 60);
    this.projSubEl.textContent = `1 video \xB7 ${t}:${e.toString().padStart(2, "0")}`, this.labelCurrentProject.textContent = "Review Deebot T80";
    const i = "/sample_videos/aroll_product_review.mp4";
    this.mainVideoPlayer.src = i, this.mainVideoPlayer.style.display = "block", this.emptyDropzone && (this.emptyDropzone.style.display = "none"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.activeArollFile = { name: "aroll_product_review.mp4", url: i, durationSec: 22, width: 1920, height: 1080, thumb: "/assets/reviewer.jpg" };
    const n = [{ id: "C4139", name: "broll_dock_cinematic.mp4", url: "/sample_videos/broll_dock_cinematic.mp4", thumb: "/assets/broll_dock.jpg", desc: "G\xF3c m\xE1y lia \u0111\u1EB7c to\xE0n c\u1EA3nh tr\u1EA1m s\u1EA1c v\xE0 robot Deebot T80 Max Omni", tags: ["tr\u1EA1m s\u1EA1c", "omni", "t\u1EF1 gi\u1EB7t gi\u1EBB"], startSec: 4, endSec: 9, matchPercentage: 92 }, { id: "C4184", name: "broll_roller_macro.mp4", url: "/sample_videos/broll_roller_macro.mp4", thumb: "/assets/broll_roller.jpg", desc: "C\u1EADn c\u1EA3nh con l\u0103n lau nh\xE0 v\xE0 c\u1EE5m ch\u1ED5i qu\xE9t d\u01B0\u1EDBi g\u1EA7m m\xE1y", tags: ["con l\u0103n", "ch\u1ED5i qu\xE9t", "lau nh\xE0"], startSec: 10, endSec: 15, matchPercentage: 98 }, { id: "C4106", name: "broll_floor_tracking.mp4", url: "/sample_videos/broll_floor_tracking.mp4", thumb: "/assets/broll_floor.jpg", desc: "Robot h\xFAt b\u1EE5i di chuy\u1EC3n v\u1EC1 ph\xEDa m\xE1y quay d\u1ECDn d\u1EB9p n\u1EC1n nh\xE0", tags: ["di chuy\u1EC3n", "s\xE0n nh\xE0", "h\xFAt b\u1EE5i"], startSec: 16, endSec: 21, matchPercentage: 89 }], s = n.map((a) => ({ id: a.id, name: a.name, videoUrl: a.url, thumb: a.thumb, aspectRatio: "16:9", durationSec: 6, cameraAngle: "Cinematic Footage 4K", description: a.desc, subjects: ["deebot", "robot", "ph\u1EE5 ki\u1EC7n"], tags: a.tags, isUsed: true }));
    this.brollLibrary = s, this.brollCountTitleEl.textContent = `Clip B-Roll (${this.brollLibrary.length})`, this.badgeDiffRatio.textContent = "0 kh\xE1c t\u1EF7 l\u1EC7", this.transcripts = [...SAMPLE_TRANSCRIPTS], this.invalidateSummary(), this.silenceCuts = [...SAMPLE_SILENCE_CUTS], this.chapters = [...SAMPLE_CHAPTERS], this.cutReviewed = true, this.renderArollList(), this.renderBrollGrid(this.brollLibrary), this.updateSelectedFootageCard(this.activeArollFile, "A-Roll"), this.matchedPositions = n.map((a, c) => {
      const h = a.endSec - a.startSec, m = Math.floor(a.startSec / 60), u = Math.floor(a.startSec % 60), g = Math.floor(a.endSec / 60), f = Math.floor(a.endSec % 60);
      return { id: `pos-${c + 1}`, clipId: a.id, startTime: `${m.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}`, endTime: `${g.toString().padStart(2, "0")}:${f.toString().padStart(2, "0")}`, startSec: a.startSec, endSec: a.endSec, durationSec: h, matchPercentage: a.matchPercentage, description: a.desc, status: "accepted" };
    }), this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n`, this.updateTimelineWidth(), this.seekTo(0), this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.updateXmlPreview(), this.renderTranscriptView(), this.renderCutView(), this.renderSegmentView(), this.renderExportView();
  },
  switchToDemoMode() {
    this.isDemoMode = true, this.activeArollFile = null, this.brollLibrary = [...BROLL_LIBRARY], this.matchedPositions = [...INITIAL_MATCHED_POSITIONS], this.transcripts = [...SAMPLE_TRANSCRIPTS], this.invalidateSummary(), this.silenceCuts = [...SAMPLE_SILENCE_CUTS], this.chapters = [...SAMPLE_CHAPTERS], this.cutReviewed = true, this.currentProjectName = PROJECT_INFO.name, this.totalDurationSec = PROJECT_INFO.totalDurationSec, this.currentTimeSec = 236, this.waveformPeaks = null, this.mainVideoPlayer.pause(), this.mainVideoPlayer.style.display = "none", this.mainPlayerImage.style.display = "block", this.mainPlayerImage.src = "/assets/reviewer.jpg", this.updateModeUI(), this.renderAll();
  },
  resetToNewProject() {
    this.adCheckResult = null;
    this.adCheckModel = "";
    this.metadataOptions = { language: "auto", tone: "professional", customTone: "" };
    this.metadataResult = { title: "", description: "", hashtags: [] };
    this.metadataModel = "";
    this.isDemoMode = false, this.brollLibrary = [], this.matchedPositions = [], this.transcripts = [], this.silenceCuts = [], this.chapters = [], this.cutReviewed = false, this.currentProjectName = "D\u1EF1 \xE1n m\u1EDBi", this.exporter = new ClientTimelineExporter(this.currentProjectName, 30), this.totalDurationSec = 0, this.currentTimeSec = 0, this.activeArollFile = null, this.waveformPeaks = null, this.currentPlayingBrollId = null, this.savedProjectId = null, this.summaryResult = "", this.summaryModel = "", this.summaryOptions = { type: "brief", language: "auto", tone: "professional", customTone: "" }, this.mainVideoPlayer && (this.mainVideoPlayer.pause(), this.mainVideoPlayer.src = "", this.mainVideoPlayer.style.display = "none"), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.pause(), this.transcriptVideoPlayer.removeAttribute("src"), this.transcriptVideoPlayer.load(), this.transcriptVideoPlayer.style.display = "none"), this.emptyDropzone && (this.emptyDropzone.style.display = "flex"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.projNameEl.textContent = this.currentProjectName, this.projSubEl.textContent = "Ch\u01B0a c\xF3 video \xB7 00:00", this.labelCurrentProject.textContent = this.currentProjectName, this.brollCountTitleEl.textContent = "Clip B-Roll (0)", this.matchedCountTitleEl.textContent = "0 v\u1ECB tr\xED ch\xE8n", this.timecodeDisplay.textContent = "00:00";
    const t = document.getElementById("label-aroll-count");
    t && (t.textContent = "Video ch\xEDnh (0)"), this.updateSelectedFootageCard(null), this.renderAll(), this.renderTranscriptView(), this.renderCutView(), this.renderSegmentView(), this.renderExportView(), this.switchView("transcript", { force: true });
  },
  updateSelectedFootageCard(t, e = "A-Roll") {
    const i = document.getElementById("card-foot-thumb-empty"), n = document.getElementById("card-foot-thumb"), s = document.getElementById("card-foot-title"), r = document.getElementById("card-foot-dur"), o = document.getElementById("card-foot-res"), d = document.getElementById("card-foot-size");
    if (!t) {
      i && (i.style.display = "flex"), n && (n.src = "", n.style.display = "none"), s && (s.textContent = "Ch\u01B0a ch\u1ECDn clip"), r && (r.textContent = "-- \xB7 --"), o && (o.textContent = "-- x -- \xB7 --"), d && (d.textContent = "-- MB");
      return;
    }
    t.thumb ? (n && (n.src = t.thumb, n.style.display = "block"), i && (i.style.display = "none")) : (n && (n.style.display = "none"), i && (i.style.display = "flex"));
    const a = t.durationSec || 0, c = Math.floor(a / 60), h = Math.floor(a % 60), m = `${c}:${h.toString().padStart(2, "0")}`, u = e === "A-Roll" ? "Video ch\xEDnh (A-Roll)" : t.cameraAngle || "Clip B-Roll";
    s && (s.textContent = t.name || t.id || "Video clip"), r && (r.textContent = `${m} \xB7 ${u}`);
    const g = t.width && t.height ? `${t.width} x ${t.height}` : "1920 x 1080", f = t.aspectRatio || (t.is916 ? "9:16" : "16:9");
    o && (o.textContent = `${g} \xB7 ${f}`), d && (d.textContent = t.sizeMb ? `${t.sizeMb} MB` : t.file ? `${(t.file.size / (1024 * 1024)).toFixed(1)} MB` : "12.4 MB");
  },
  switchToCustomMode() {
    this.isDemoMode = false, this.updateModeUI(), this.activeArollFile || this.inputArollFile.click();
  },
  updateModeUI() {
    var t, e, i, n;
    this.isDemoMode ? ((t = this.btnModeDemo) == null || t.classList.add("active"), (e = this.btnModeCustom) == null || e.classList.remove("active"), this.projNameEl.textContent = "Deebot T80 Max Omni", this.projSubEl.textContent = "2 video \xB7 12:51", this.labelCurrentProject.textContent = "Deebot T80 Max Omni", this.brollCountTitleEl.textContent = "Clip B-Roll (107)", this.badgeDiffRatio.textContent = "34 kh\xE1c t\u1EF7 l\u1EC7") : ((i = this.btnModeDemo) == null || i.classList.remove("active"), (n = this.btnModeCustom) == null || n.classList.add("active"));
  }
};
