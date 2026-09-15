import { VideoImporter } from '../../video_importer.js';
import { escapeHtml } from '../../shared/html.js';

const $ = VideoImporter;

const E = escapeHtml;

export const timelineFeature = {
  handleBrollSearch(value) {
    clearTimeout(this.brollSearchTimer);
    const query = String(value || "").trim();
    if (!query) { this.renderBrollGrid(this.brollLibrary); return; }
    this.brollSearchTimer = setTimeout(async () => {
      try {
        if (this.brollLibrary.some((clip) => clip.scenes?.length)) {
          const response = await this.api.searchBroll(query, this.brollLibrary.map((clip) => clip.id));
          const scores = new Map();
          (response.results || []).forEach((scene) => scores.set(scene.clipId, Math.max(scores.get(scene.clipId) || 0, scene.searchScore || 0)));
          const ranked = this.brollLibrary.filter((clip) => scores.has(clip.id)).sort((left, right) => scores.get(right.id) - scores.get(left.id));
          this.renderBrollGrid(ranked);
          return;
        }
      } catch (error) { console.warn("Semantic search fallback:", error); }
      const lowered = query.toLowerCase();
      this.renderBrollGrid(this.brollLibrary.filter((clip) => clip.id.toLowerCase().includes(lowered) || clip.name?.toLowerCase().includes(lowered) || clip.description?.toLowerCase().includes(lowered) || clip.tags?.some((tag) => tag.toLowerCase().includes(lowered))));
    }, 300);
  },
  async handleRematch() {
    if (!this.btnRematch) return;
    this.btnRematch.classList.add("loading"), this.btnRematchText.textContent = "Đang semantic matching...";
    const config = { minDuration: parseFloat(this.sliderMinDuration.value), maxDuration: parseFloat(this.sliderMaxDuration.value), segmentLength: parseFloat(this.sliderSegmentLen.value), coverageRatio: parseInt(this.sliderCoverage.value) / 100, introHoldSec: parseFloat(this.sliderIntroHold.value), only16_9: this.chkOnly169.checked, placementGuidance: this.txtPlacement.value };
    this.matcher.updateConfig(config);
    try {
      if (this.transcripts.length && this.brollLibrary.some((clip) => clip.scenes?.length)) {
        const result = await this.api.matchBroll({ transcripts: this.transcripts, clipIds: this.brollLibrary.map((clip) => clip.id), totalDurationSec: this.totalDurationSec, minDuration: config.minDuration, maxDuration: config.maxDuration, coverageRatio: config.coverageRatio, introHoldSec: config.introHoldSec, only16_9: config.only16_9, guidance: config.placementGuidance });
        this.matchedPositions = (result.placements || []).map((placement) => ({ ...placement, startTime: this.matcher.formatTime(placement.startSec), endTime: this.matcher.formatTime(placement.endSec), status: "accepted" }));
      } else {
        this.matchedPositions = this.matcher.reMatch(this.brollLibrary, this.totalDurationSec, this.transcripts);
      }
      this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} vị trí chèn`;
      this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview(), this.updateWorkflowUI();
    } catch (error) {
      console.warn("Semantic matching lỗi, dùng matcher cục bộ:", error);
      this.matchedPositions = this.matcher.reMatch(this.brollLibrary, this.totalDurationSec, this.transcripts);
      this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} vị trí chèn`;
      this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview(), this.updateWorkflowUI();
    } finally {
      this.btnRematch.classList.remove("loading"), this.btnRematchText.textContent = "Ghép lại";
    }
  },
  calculateOptimalScale() {
    var i;
    const dur = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    if (dur <= 0) return 4;
    const e = Math.max(800, (((i = this.timelineTracksScroll) == null ? void 0 : i.clientWidth) || 1100) - 80) / dur;
    return Math.max(1.5, Math.min(20, parseFloat(e.toFixed(2))));
  },
  fitTimelineToFrame() {
    this.pixelsPerSec = this.calculateOptimalScale(), this.zoomSlider && (this.zoomSlider.value = Math.min(250, Math.max(50, Math.round(this.pixelsPerSec / 4 * 100)))), this.updateTimelineWidth(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.seekTo(this.currentTimeSec);
  },
  updateTimelineWidth() {
    var n;
    const dur = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    const t = Math.max(1200, ((n = this.timelineTracksScroll) == null ? void 0 : n.clientWidth) || 1200), e = Math.round(dur * this.pixelsPerSec) + 120, i = Math.max(t, e);
    this.timelineWrapper.style.minWidth = `${i}px`;
  },
  renderAll() {
    this.updateTimelineWidth(), this.renderArollList(), this.renderBrollGrid(this.brollLibrary), this.renderMatchedList(), this.renderFilmstrip(), this.renderTimelineBrollBlocks(), this.drawWaveform(), this.drawRuler(), this.seekTo(this.currentTimeSec), this.updatePrerequisiteEmptyStates(), this.updateWorkflowUI();
  },
  renderArollList() {
    this.arollListContainer.innerHTML = "";
    const t = document.getElementById("label-aroll-count");
    if (!this.activeArollFile) {
      t && (t.textContent = "Video ch\xEDnh (0)"), this.arollListContainer.innerHTML = `
        <div style="padding: 14px 10px; text-align: center; font-size: 11px; color: var(--text-sub); border: 1px dashed var(--border-color); border-radius: 6px; line-height: 1.5;">
          Ch\u01B0a c\xF3 video ch\xEDnh.<br>B\u1EA5m <strong>"N\u1EA1p A-Roll"</strong> ho\u1EB7c k\xE9o th\u1EA3 video v\xE0o \u0111\xE2y.
        </div>
      `, this.arollSummaryText.textContent = "Ch\u01B0a c\xF3 video \xB7 00:00";
      return;
    }
    t && (t.textContent = "Video ch\xEDnh (1)"), [this.activeArollFile].forEach((s, r) => {
      const o = document.createElement("div");
      o.className = "aroll-item active";
      const d = s.durationStr || `${Math.floor(s.durationSec / 60)}:${Math.floor(s.durationSec % 60).toString().padStart(2, "0")}`, a = s.resolution || `${s.width}x${s.height}`, c = s.thumb ? `<img src="${E(s.thumb)}" alt="${E(s.name)}" class="aroll-thumb">` : '<div class="aroll-thumb aroll-thumb-fallback"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';
      o.innerHTML = `
        ${c}
        <div class="aroll-info">
          <span class="aroll-name">${r + 1}. ${E(s.name)}</span>
          <span class="aroll-duration">${d} \xB7 ${a}</span>
        </div>
      `, o.addEventListener("click", () => {
        this.updateSelectedFootageCard(s, "A-Roll");
      }), this.arollListContainer.appendChild(o);
    });
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60);
    this.arollSummaryText.textContent = `${i}:${n.toString().padStart(2, "0")} t\u1ED5ng c\u1ED9ng \xB7 K\xE9o \u0111\u1EC3 s\u1EAFp x\u1EBFp`;
  },
  renderBrollGrid(t) {
    if (this.brollGridEl.innerHTML = "", t.length === 0) {
      this.brollGridEl.innerHTML = `
        <div class="broll-empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 6px; opacity: 0.6;"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <br>Ch\u01B0a c\xF3 clip B-Roll.<br>B\u1EA5m <strong>"+ Th\xEAm B-Roll"</strong> ho\u1EB7c k\xE9o th\u1EA3 clip ph\u1EE5 v\xE0o \u0111\xE2y.
        </div>
      `;
      return;
    }
    t.forEach((e) => {
      const i = document.createElement("div");
      i.className = "broll-card", i.title = `${e.id}: ${e.description}`;
      const n = e.aspectRatio !== "16:9";
      i.innerHTML = `
        <div class="broll-thumb-wrap">
          <img src="${E(e.thumb)}" alt="${E(e.id)}">
          ${e.isUsed ? `
            <div class="broll-used-badge" title="\u0110\xE3 gh\xE9p v\xE0o timeline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          ` : ""}
          ${n ? `<span class="broll-ratio-badge">${E(e.aspectRatio)}</span>` : ""}
          ${e.scenes?.length ? `<span class="broll-scene-badge">${e.scenes.length} cảnh${e.indexCached ? " · cache" : ""}</span>` : ""}
        </div>
        <div class="broll-card-footer">
          <span style="font-weight: 600; color: #fff;">${E(e.id)}</span>
          <span>${e.durationSec}s</span>
        </div>
      `, i.addEventListener("click", () => {
        this.updateSelectedFootageCard(e, "B-Roll");
        const s = this.matchedPositions.find((r) => r.clipId === e.id);
        s && this.seekTo(s.startSec);
      }), this.brollGridEl.appendChild(i);
    });
  },
  renderMatchedList() {
    if (this.matchedListEl.innerHTML = "", this.matchedPositions.length === 0) {
      this.matchedListEl.innerHTML = `
        <div style="padding: 36px 16px; text-align: center; font-size: 11.5px; color: var(--text-sub); line-height: 1.6; border: 1px dashed var(--border-color); border-radius: 6px;">
          N\u1EA1p video A-Roll v\xE0 B-Roll \u0111\u1EC3 AI t\u1EF1 \u0111\u1ED9ng so kh\u1EDBp v\xE0 hi\u1EC3n th\u1ECB c\xE1c v\u1ECB tr\xED ch\xE8n t\u1EA1i \u0111\xE2y.
        </div>
      `;
      return;
    }
    this.matchedPositions.forEach((t) => {
      const e = document.createElement("div");
      e.className = "matched-card-item", e.id = `card-${t.id}`, e.innerHTML = `
        <div class="matched-card-top">
          <div class="matched-clip-time">
            <span class="badge-clip-id">${E(t.clipId)}</span>
            <span class="time-range-text">${t.startTime} -> ${t.endTime}</span>
          </div>
          <span class="match-percentage-badge">${t.matchPercentage}%</span>
        </div>
        <div class="matched-description-text">${E(t.description)}</div>
        ${t.sceneId ? `<div class="matched-source-info">Nguồn ${this.matcher.formatTime(t.sourceInSec || 0)} → ${this.matcher.formatTime(t.sourceOutSec || 0)} · ${E(t.reason || "Semantic match")}</div>` : ""}
        <div class="matched-card-actions">
          <div style="font-size: 10px; color: var(--text-sub);">${t.durationSec} gi\xE2y</div>
          <div class="card-action-icons">
            <button class="icon-tool-mini action-accept" title="Ch\u1EA5p nh\u1EADn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-green)"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button class="icon-tool-mini action-replace" title="\u0110\u1ED5i B-roll kh\xE1c"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg></button>
            <button class="icon-tool-mini delete" title="X\xF3a ph\xE2n \u0111o\u1EA1n"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
        </div>
      `, e.addEventListener("click", () => this.seekTo(t.startSec)), e.querySelector(".action-accept").addEventListener("click", (i) => {
        i.stopPropagation(), t.status = "accepted", e.classList.add("accepted");
      }), e.querySelector(".action-replace").addEventListener("click", (i) => {
        i.stopPropagation(), this.replaceBrollPlacement(t);
      }), e.querySelector(".icon-tool-mini.delete").addEventListener("click", (i) => {
        i.stopPropagation(), this.matchedPositions = this.matchedPositions.filter((n) => n.id !== t.id), this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n`, this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview(), this.updateWorkflowUI();
      }), this.matchedListEl.appendChild(e);
    });
  },
  async replaceBrollPlacement(placement) {
    const alternatives = this.brollLibrary.filter((clip) => clip.id !== placement.clipId);
    if (!alternatives.length) return alert("Chưa có B-roll khác để thay thế.");
    try {
      let selected = alternatives[0], scene = null;
      if (placement.matchedSpeech && alternatives.some((clip) => clip.scenes?.length)) {
        const result = await this.api.searchBroll(placement.matchedSpeech, alternatives.map((clip) => clip.id));
        scene = result.results?.[0] || null;
        selected = alternatives.find((clip) => clip.id === scene?.clipId) || selected;
      }
      const sourceIn = scene ? Number(scene.startSec || 0) : 0;
      const available = scene ? Math.max(0, Number(scene.endSec || 0) - sourceIn) : selected.durationSec;
      const duration = Math.min(placement.durationSec, available || placement.durationSec);
      Object.assign(placement, {
        clipId: selected.id, clipName: selected.name, sceneId: scene?.sceneId || null,
        sourceInSec: sourceIn, sourceOutSec: sourceIn + duration, sourceDurationSec: selected.durationSec,
        durationSec: duration, endSec: placement.startSec + duration,
        description: scene?.description || selected.description, status: "suggested",
        matchPercentage: scene ? Math.max(1, Math.round((scene.searchScore || 0) * 100)) : placement.matchPercentage,
        reason: scene ? `Phương án thay thế · semantic ${Math.round((scene.semanticScore || 0) * 100)}%` : "Phương án thay thế cục bộ",
      });
      this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview();
    } catch (error) {
      alert(`Không thể tìm B-roll thay thế: ${error.message}`);
    }
  },
  renderFilmstrip() {
    const dur = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    if (this.trackArollFilmstripEl.innerHTML = "", !this.activeArollFile || dur <= 0) return;
    const t = Math.round(dur * this.pixelsPerSec), e = document.createElement("div");
    e.className = "aroll-video-clip", e.style.width = `${t}px`, e.title = `A-Roll Video: ${this.activeArollFile.name}`;
    const i = document.createElement("div");
    i.className = "aroll-clip-tag", i.textContent = `V1 \xB7 ${this.activeArollFile.name}`, e.appendChild(i);
    const s = Math.round(44 * (16 / 9)), r = Math.max(1, Math.ceil(t / s)), o = this.activeArollFile.thumb;
    for (let d = 0; d < r; d++) if (o) {
      const a = document.createElement("img");
      a.src = o, a.className = "filmstrip-frame", a.alt = `Frame ${d}`, e.appendChild(a);
    } else {
      const a = document.createElement("div");
      a.className = "filmstrip-frame", a.style.background = "#222", e.appendChild(a);
    }
    this.trackArollFilmstripEl.appendChild(e);
  },
  renderTimelineBrollBlocks() {
    this.trackBrollRowEl.innerHTML = "", this.matchedPositions.forEach((t) => {
      const e = document.createElement("div");
      e.className = "broll-timeline-block";
      const tlStart = this.mediaToTimeline ? this.mediaToTimeline(t.startSec) : t.startSec;
      const tlEnd = this.mediaToTimeline ? this.mediaToTimeline(t.endSec) : t.endSec;
      const i = tlStart * this.pixelsPerSec, n = Math.max(20, (tlEnd - tlStart) * this.pixelsPerSec);
      e.style.left = `${i}px`, e.style.width = `${n}px`, e.title = `${t.clipId} (${t.startTime} -> ${t.endTime}) \xB7 ${t.matchPercentage}% match`, e.innerHTML = `
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${E(t.clipId)}</span>
        <span style="font-size: 8.5px; opacity: 0.85;">${t.durationSec}s</span>
      `, e.addEventListener("click", (s) => {
        s.stopPropagation(), this.seekTo(tlStart);
      }), e.addEventListener("pointerdown", (event) => this.beginTimelineDrag(event, t, e)), this.trackBrollRowEl.appendChild(e);
    });
  },
  beginTimelineDrag(event, placement, element) {
    if (event.button !== 0) return;
    event.preventDefault();
    const mapToTL = (t) => this.mediaToTimeline ? this.mediaToTimeline(t) : t;
    const mapToMedia = (t) => this.timelineToMedia ? this.timelineToMedia(t) : t;
    const tlStart = mapToTL(placement.startSec);
    const tlDuration = mapToTL(placement.endSec) - tlStart;
    const pointerStart = event.clientX;
    element.setPointerCapture(event.pointerId), element.classList.add("dragging");
    const move = (current) => {
      const maxTL = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
      const requestedTL = tlStart + (current.clientX - pointerStart) / this.pixelsPerSec;
      const maxStartTL = Math.max(0, maxTL - tlDuration);
      let nextStartTL = Math.round(Math.max(0, Math.min(maxStartTL, requestedTL)) * 10) / 10;
      const conflict = this.matchedPositions.filter((item) => item !== placement).find((item) => nextStartTL < mapToTL(item.endSec) && nextStartTL + tlDuration > mapToTL(item.startSec));
      if (conflict) nextStartTL = requestedTL >= tlStart ? mapToTL(conflict.endSec) : mapToTL(conflict.startSec) - tlDuration;
      nextStartTL = Math.round(Math.max(0, Math.min(maxStartTL, nextStartTL)) * 10) / 10;
      
      const nextStartMedia = mapToMedia(nextStartTL);
      placement.startSec = nextStartMedia, placement.endSec = nextStartMedia + placement.durationSec;
      placement.startTime = this.matcher.formatTime(placement.startSec), placement.endTime = this.matcher.formatTime(placement.endSec);
      element.style.left = `${nextStartTL * this.pixelsPerSec}px`;
    };
    const finish = () => {
      element.classList.remove("dragging"), element.removeEventListener("pointermove", move), element.removeEventListener("pointerup", finish), element.removeEventListener("pointercancel", finish);
      this.matchedPositions.sort((left, right) => left.startSec - right.startSec), this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview();
    };
    element.addEventListener("pointermove", move), element.addEventListener("pointerup", finish), element.addEventListener("pointercancel", finish);
  },
  drawWaveform() {
    const dur = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    if (!this.trackAudioWaveformEl || (this.trackAudioWaveformEl.innerHTML = "", !this.activeArollFile || dur <= 0)) return;
    const t = Math.round(dur * this.pixelsPerSec), e = document.createElement("div");
    e.className = "aroll-audio-clip", e.style.width = `${t}px`, e.title = `A-Roll Audio: ${this.activeArollFile.name}`;
    const i = document.createElement("div");
    i.className = "aroll-clip-tag", i.style.background = "rgba(20, 90, 160, 0.75)", i.textContent = "A1 \xB7 \xC2m thanh g\u1ED1c", e.appendChild(i);
    const n = document.createElement("canvas");
    n.className = "waveform-canvas", n.style.width = `${t}px`, n.style.height = "100%", e.appendChild(n), this.trackAudioWaveformEl.appendChild(e);
    const s = window.devicePixelRatio || 1;
    n.width = t * s, n.height = 48 * s;
    const r = n.getContext("2d"), o = n.width, d = n.height;
    r.clearRect(0, 0, o, d);
    const a = d / 2;
    r.fillStyle = "#3898ec";
    const c = 2.5 * s, h = 1.5 * s, m = Math.max(10, Math.floor(o / (c + h))), u = this.waveformPeaks || $.generateSimulatedWaveform(m);
    for (let g = 0; g < m; g++) {
      const f = g * (c + h), x = u[g % u.length] || 0.3, P = Math.max(2 * s, x * (d * 0.75));
      r.fillRect(f, a - P / 2, c, P);
    }
  },
  drawRuler() {
    const t = this.rulerCanvas;
    if (!t) return;
    const e = parseInt(this.timelineWrapper.style.minWidth) || 1800, i = window.devicePixelRatio || 1;
    t.width = e * i, t.height = 22 * i;
    const n = t.getContext("2d"), s = t.width, r = t.height;
    n.clearRect(0, 0, s, r), n.fillStyle = "#8e8e93", n.font = `${9 * i}px -apple-system, sans-serif`;
    let o = 10;
    this.pixelsPerSec > 10 ? o = 2 : this.pixelsPerSec > 5 ? o = 5 : this.pixelsPerSec > 2 ? o = 10 : o = 30;
    const d = Math.ceil(e / (this.pixelsPerSec || 2.4));
    for (let a = 0; a <= d; a += o) {
      const c = a * this.pixelsPerSec * i;
      if (c > s) break;
      const h = Math.floor(a / 60), m = Math.floor(a % 60), u = `${h}:${m.toString().padStart(2, "0")}`;
      n.fillStyle = "#8e8e93", n.fillRect(c, r - 8 * i, 1 * i, 8 * i), n.fillText(u, c + 3 * i, 11 * i);
      const g = o / 5;
      for (let f = g; f < o; f += g) {
        const x = (a + f) * this.pixelsPerSec * i;
        x < s && n.fillRect(x, r - 4 * window.devicePixelRatio, 1 * window.devicePixelRatio, 4 * window.devicePixelRatio);
      }
    }
  },
  updateXmlPreview() {
    if (this.xmlPreviewCode) {
      if (this.matchedPositions.length === 0) {
        this.xmlPreviewCode.textContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <!-- Ch\u01B0a c\xF3 clip B-roll n\xE0o \u0111\u01B0\u1EE3c gh\xE9p. H\xE3y n\u1EA1p video v\xE0 b\u1EA5m "Gh\xE9p l\u1EA1i" -->
</fcpxml>`;
        return;
      }
      this.updateCanonicalXmlPreview(this.xmlPreviewCode, 14);
    }
  }
};
