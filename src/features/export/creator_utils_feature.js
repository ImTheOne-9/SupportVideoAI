

export const exportFeature = {
  timelineExportProject() {
    return {
      name: this.currentProjectName,
      arollName: this.activeArollFile?.name || "C4095.mov",
      totalDurationSec: this.totalDurationSec,
      placements: this.matchedPositions,
      cuts: this.silenceCuts,
      fps: 30,
      width: this.activeArollFile?.width,
      height: this.activeArollFile?.height,
      pipXPercent: this.brollPipXPercent || 0.56,
      pipYPercent: this.brollPipYPercent || 0.03,
      pipScalePercent: this.brollPipScalePercent || 0.40,
      baseFolder: document.getElementById("export-base-folder")?.value || ""
    };
  },
  async canonicalXml() {
    return this.timelineExportService.serialize("fcpxml", this.timelineExportProject());
  },
  renderExportView() {
    var h, m;
    const t = document.getElementById("export-proj-title");
    t && (t.textContent = this.currentProjectName);
    const e = document.getElementById("export-stat-broll-count");
    e && (e.textContent = `${this.matchedPositions.length} Clip B-Roll \u0111\xE3 gh\xE9p`);
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60), s = document.getElementById("export-stat-duration");
    s && (s.textContent = `Th\u1EDDi l\u01B0\u1EE3ng: ${i}:${n.toString().padStart(2, "0")}`);
    const r = document.getElementById("export-stat-coverage");
    if (r) if (this.matchedPositions.length > 0 && this.totalDurationSec > 0) {
      const u = this.matchedPositions.reduce((f, x) => f + (x.durationSec || 0), 0), g = Math.min(100, Math.round(u / this.totalDurationSec * 100));
      r.textContent = `${g}% T\u1EF7 l\u1EC7 ph\u1EE7`, r.style.display = "inline-block";
    } else r.style.display = "none";
    const o = document.getElementById("export-stat-resolution");
    o && (o.textContent = ((h = this.activeArollFile) == null ? void 0 : h.resolution) || (this.activeArollFile ? "1080p FHD (16:9)" : "-- x --"));
    const d = document.getElementById("export-banner-thumb"), a = document.getElementById("export-banner-thumb-empty");
    this.activeArollFile && this.activeArollFile.thumb ? (d && (d.src = this.activeArollFile.thumb, d.style.display = "block"), a && (a.style.display = "none")) : (d && (d.src = "", d.style.display = "none"), a && (a.style.display = "flex"));
    const c = document.getElementById("dash-xml-preview-code");
    if (c) if (this.matchedPositions.length === 0 && !this.activeArollFile) c.textContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- D\u1EF1 \xE1n m\u1EDBi ch\u01B0a n\u1EA1p video. H\xE3y n\u1EA1p video A-Roll v\xE0 B-Roll \u0111\u1EC3 xem tr\u01B0\u1EDBc m\xE3 XML xu\u1EA5t timeline -->
<fcpxml version="1.9">
  <resources/>
  <library>
    <event name="${this.currentProjectName}">
      <project name="${this.currentProjectName}"/>
    </event>
  </library>
</fcpxml>`;
    else this.updateCanonicalXmlPreview(c, 16);
  },
  async updateCanonicalXmlPreview(target, maxLines = 16) {
    if (!target || this.totalDurationSec <= 0) return;
    const requestId = (this.xmlPreviewRequestId || 0) + 1;
    this.xmlPreviewRequestId = requestId;
    target.textContent = "Đang tạo XML từ AI engine...";
    try {
      const result = await this.canonicalXml();
      if (this.xmlPreviewRequestId !== requestId) return;
      const lines = result.content.split("\n");
      target.textContent = lines.length > maxLines
        ? `${lines.slice(0, maxLines).join("\n")}\n<!-- ... xem toàn bộ bằng nút Sao chép hoặc Xuất ... -->`
        : result.content;
    } catch (error) {
      if (this.xmlPreviewRequestId === requestId) {
        target.textContent = `Không thể tạo bản xem trước: ${error.message}`;
      }
    }
  },
  async exportFCPXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov";
    try {
      await this.timelineExportService.export("fcpxml", { name: this.currentProjectName, arollName: t, totalDurationSec: this.totalDurationSec, placements: this.matchedPositions, cuts: this.silenceCuts, fps: 30 });
    } catch (e) {
      alert(`Không thể xuất FCPXML: ${e.message}`);
    }
  },
  async exportMP4() {
    const btn = document.getElementById("btn-export-mp4-dash");
    if (btn) {
      btn.disabled = true;
      btn.dataset.originalText = btn.textContent;
      btn.textContent = "Đang render... 0%";
    }
    
    try {
      const payload = this.timelineExportProject();
      payload.format = "ffmpeg"; // Keep legacy format identifier just in case

      let finalFile = null;
      for await (const event of this.api.exportDirectStream(payload)) {
        if (event.type === 'progress' && btn) {
          btn.textContent = `Đang render... ${event.percent}%`;
        } else if (event.type === 'done') {
          finalFile = event.file;
        }
      }
      
      alert(`Render thành công!\nFile đã được lưu tại thư mục dự án với tên: ${finalFile}`);
    } catch (e) {
      alert(`Không thể xuất MP4 trực tiếp: ${e.message}`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = btn.dataset.originalText || "Xuất MP4 (Trực tiếp)";
      }
    }
  },
  async exportPremiereXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov";
    try {
      await this.timelineExportService.export("premiere", { name: this.currentProjectName, arollName: t, totalDurationSec: this.totalDurationSec, placements: this.matchedPositions, cuts: this.silenceCuts, fps: 30 });
    } catch (e) {
      alert(`Không thể xuất Premiere XML: ${e.message}`);
    }
  },
  async exportDaVinciXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov";
    try {
      await this.timelineExportService.export("davinci", { name: this.currentProjectName, arollName: t, totalDurationSec: this.totalDurationSec, placements: this.matchedPositions, cuts: this.silenceCuts, fps: 30 });
    } catch (e) {
      alert(`Không thể xuất DaVinci XML: ${e.message}`);
    }
  },
  async handleCopyXml() {
    const t = document.getElementById("dash-xml-preview-code"), e = document.getElementById("btn-copy-xml-code");
    if (t && e && this.totalDurationSec > 0) {
      try {
        const result = await this.canonicalXml();
        await navigator.clipboard.writeText(result.content);
        e.textContent = "\u2713 \u0110\xE3 sao ch\xE9p!", setTimeout(() => e.textContent = "Sao ch\xE9p m\xE3 XML", 1500);
      } catch (error) {
        alert(`Không thể sao chép XML: ${error.message}`);
      }
    }
  }
};
