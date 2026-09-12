import { EditDecisionList } from './edit_decision.js';

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

  generateFCPXML(placements, arollName = 'A-Roll.mov', totalDurationSec = 0, cuts = []) {
    const keptSegments = EditDecisionList.keptSegments(cuts, totalDurationSec);
    const timelineDurationSec = keptSegments.at(-1)?.timelineEndSec || 0;
    const remappedPlacements = EditDecisionList.remapPlacements(placements, keptSegments);
    const totalFrames = this.secToFrames(timelineDurationSec);
    const frameDur = `1/${this.fps}s`;
    const uniqueAssets = new Map();
    remappedPlacements.forEach(p => {
      if (!uniqueAssets.has(p.clipId)) uniqueAssets.set(p.clipId, p);
    });

    let assetTags = `
    <format id="r1" name="FFVideoFormat${this.height}p${this.fps}" frameDuration="${frameDur}" width="${this.width}" height="${this.height}"/>
    <asset id="r_aroll" name="${this.escapeXml(arollName)}" src="${this.escapeXml(this.fileUrl(arollName))}" duration="${this.secToFrames(totalDurationSec)}/${this.fps}s" hasVideo="1" hasAudio="1"/>`;
    for (const [clipId, placement] of uniqueAssets) {
      const name = this.clipName(placement);
      const sourceDuration = placement.sourceDurationSec || placement.durationSec;
      assetTags += `
    <asset id="r_broll_${this.escapeXml(clipId)}" name="${this.escapeXml(name)}" src="${this.escapeXml(this.fileUrl(name))}" duration="${this.secToFrames(sourceDuration)}/${this.fps}s" hasVideo="1"/>`;
    }

    const arollClips = keptSegments.map((segment, segmentIndex) => {
      const connected = remappedPlacements.filter(p => p.startSec >= segment.timelineStartSec && p.startSec < segment.timelineEndSec).map(p => {
        const name = this.clipName(p);
        return `<asset-clip ref="r_broll_${this.escapeXml(p.clipId)}" lane="1" name="${this.escapeXml(name)}" offset="${this.secToFrames(p.startSec)}/${this.fps}s" start="${this.secToFrames(p.sourceInSec || 0)}/${this.fps}s" duration="${this.secToFrames(p.durationSec)}/${this.fps}s"/>`;
      }).join('');
      return `<asset-clip ref="r_aroll" offset="${this.secToFrames(segment.timelineStartSec)}/${this.fps}s" start="${this.secToFrames(segment.sourceStartSec)}/${this.fps}s" name="${this.escapeXml(arollName)} ${segmentIndex + 1}" duration="${this.secToFrames(segment.durationSec)}/${this.fps}s" tcFormat="NDF">${connected}</asset-clip>`;
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
            ${arollClips}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
  }

  generatePremiereXML(placements, arollName = 'A-Roll.mov', totalDurationSec = 0, cuts = []) {
    const keptSegments = EditDecisionList.keptSegments(cuts, totalDurationSec);
    const remappedPlacements = EditDecisionList.remapPlacements(placements, keptSegments);
    const totalFrames = this.secToFrames(keptSegments.at(-1)?.timelineEndSec || 0);
    const brollTrack = remappedPlacements.map((p, index) => {
      const start = this.secToFrames(p.startSec);
      const end = this.secToFrames(p.endSec);
      const duration = end - start;
      const name = this.clipName(p);
      return `
        <clipitem id="clipitem-broll-${index + 1}">
          <name>${this.escapeXml(name)}</name><start>${start}</start><end>${end}</end><in>${this.secToFrames(p.sourceInSec || 0)}</in><out>${this.secToFrames(p.sourceOutSec ?? ((p.sourceInSec || 0) + p.durationSec))}</out>
          <file id="file-broll-${index + 1}"><name>${this.escapeXml(name)}</name><pathurl>${this.escapeXml(this.fileUrl(name))}</pathurl><rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate><duration>${this.secToFrames(p.sourceDurationSec || p.durationSec)}</duration></file>
        </clipitem>`;
    }).join('');
    const arollTrack = keptSegments.map((segment, index) => `<clipitem id="clipitem-aroll-${index + 1}"><name>${this.escapeXml(arollName)}</name><start>${this.secToFrames(segment.timelineStartSec)}</start><end>${this.secToFrames(segment.timelineEndSec)}</end><in>${this.secToFrames(segment.sourceStartSec)}</in><out>${this.secToFrames(segment.sourceEndSec)}</out><file id="file-aroll"><name>${this.escapeXml(arollName)}</name><pathurl>${this.escapeXml(this.fileUrl(arollName))}</pathurl></file></clipitem>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><project><name>${this.escapeXml(this.projectName)}</name><children><sequence>
  <name>${this.escapeXml(this.projectName)}</name><duration>${totalFrames}</duration>
  <rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate>
  <media><video><format><samplecharacteristics><width>${this.width}</width><height>${this.height}</height><pixelaspectratio>square</pixelaspectratio><rate><timebase>${this.fps}</timebase></rate></samplecharacteristics></format>
    <track>${arollTrack}</track>
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
