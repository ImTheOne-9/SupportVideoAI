/** Xuất timeline sang FCPXML và Premiere/Resolve XML. */
export class ClientTimelineExporter {
  constructor(projectName = 'CreatorUtils Project', fps = 30, width = 3840, height = 2160) {
    this.projectName = projectName;
    this.fps = fps;
    this.width = width;
    this.height = height;
  }

  secToFrames(sec) {
    return Math.round(sec * this.fps);
  }

  escapeXml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[char]);
  }

  fileUrl(filename) {
    const normalized = String(filename || '').replace(/\\/g, '/');
    return `file://localhost/${normalized.split('/').map(encodeURIComponent).join('/')}`;
  }

  clipName(placement) {
    return placement.clipName || placement.name || `${placement.clipId}.mov`;
  }

  generateFCPXML(placements, arollName = 'A-Roll.mov', totalDurationSec = 0) {
    const totalFrames = this.secToFrames(totalDurationSec);
    const frameDur = `1/${this.fps}s`;
    const uniqueAssets = new Map();
    placements.forEach(p => {
      if (!uniqueAssets.has(p.clipId)) uniqueAssets.set(p.clipId, p);
    });

    let assetTags = `
    <format id="r1" name="FFVideoFormat${this.height}p${this.fps}" frameDuration="${frameDur}" width="${this.width}" height="${this.height}"/>
    <asset id="r_aroll" name="${this.escapeXml(arollName)}" src="${this.escapeXml(this.fileUrl(arollName))}" duration="${totalFrames}/${this.fps}s" hasVideo="1" hasAudio="1"/>`;
    for (const [clipId, placement] of uniqueAssets) {
      const name = this.clipName(placement);
      const sourceDuration = placement.sourceDurationSec || placement.durationSec;
      assetTags += `
    <asset id="r_broll_${this.escapeXml(clipId)}" name="${this.escapeXml(name)}" src="${this.escapeXml(this.fileUrl(name))}" duration="${this.secToFrames(sourceDuration)}/${this.fps}s" hasVideo="1"/>`;
    }

    const clips = placements.map(p => {
      const name = this.clipName(p);
      return `
            <asset-clip ref="r_broll_${this.escapeXml(p.clipId)}" lane="1" name="${this.escapeXml(name)}" offset="${this.secToFrames(p.startSec)}/${this.fps}s" duration="${this.secToFrames(p.durationSec)}/${this.fps}s"/>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>${assetTags}
  </resources>
  <library>
    <event name="${this.escapeXml(this.projectName)}">
      <project name="${this.escapeXml(this.projectName)}">
        <sequence format="r1" duration="${totalFrames}/${this.fps}s" tcStart="0s" tcFormat="NDF">
          <spine>
            <asset-clip ref="r_aroll" offset="0s" name="${this.escapeXml(arollName)}" duration="${totalFrames}/${this.fps}s" tcFormat="NDF">${clips}
            </asset-clip>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
  }

  generatePremiereXML(placements, arollName = 'A-Roll.mov', totalDurationSec = 0) {
    const totalFrames = this.secToFrames(totalDurationSec);
    const brollTrack = placements.map((p, index) => {
      const start = this.secToFrames(p.startSec);
      const end = this.secToFrames(p.endSec);
      const duration = end - start;
      const name = this.clipName(p);
      return `
        <clipitem id="clipitem-broll-${index + 1}">
          <name>${this.escapeXml(name)}</name><start>${start}</start><end>${end}</end><in>0</in><out>${duration}</out>
          <file id="file-broll-${index + 1}"><name>${this.escapeXml(name)}</name><pathurl>${this.escapeXml(this.fileUrl(name))}</pathurl><rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate><duration>${this.secToFrames(p.sourceDurationSec || p.durationSec)}</duration></file>
        </clipitem>`;
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><project><name>${this.escapeXml(this.projectName)}</name><children><sequence>
  <name>${this.escapeXml(this.projectName)}</name><duration>${totalFrames}</duration>
  <rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate>
  <media><video><format><samplecharacteristics><width>${this.width}</width><height>${this.height}</height><pixelaspectratio>square</pixelaspectratio><rate><timebase>${this.fps}</timebase></rate></samplecharacteristics></format>
    <track><clipitem id="clipitem-aroll-1"><name>${this.escapeXml(arollName)}</name><start>0</start><end>${totalFrames}</end><in>0</in><out>${totalFrames}</out><file id="file-aroll"><name>${this.escapeXml(arollName)}</name><pathurl>${this.escapeXml(this.fileUrl(arollName))}</pathurl></file></clipitem></track>
    <track>${brollTrack}
    </track>
  </video></media>
</sequence></children></project></xmeml>`;
  }

  downloadFile(filename, content, mimeType = 'application/xml') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}
