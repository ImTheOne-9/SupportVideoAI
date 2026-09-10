export class EditDecisionList {
  static normalizeCuts(cuts = [], durationSec = 0) {
    const active = cuts.filter(cut => cut.status !== 'ignored' && cut.status !== 'disabled')
      .map(cut => ({ startSec: Math.max(0, Number(cut.startSec) || 0), endSec: Math.min(durationSec, Number(cut.endSec) || 0) }))
      .filter(cut => cut.endSec > cut.startSec)
      .sort((a, b) => a.startSec - b.startSec);
    const merged = [];
    for (const cut of active) {
      const last = merged.at(-1);
      if (last && cut.startSec <= last.endSec) last.endSec = Math.max(last.endSec, cut.endSec);
      else merged.push({ ...cut });
    }
    return merged;
  }

  static keptSegments(cuts = [], durationSec = 0) {
    const merged = this.normalizeCuts(cuts, durationSec);
    const kept = [];
    let sourceCursor = 0;
    let timelineCursor = 0;
    for (const cut of merged) {
      if (cut.startSec > sourceCursor) {
        const duration = cut.startSec - sourceCursor;
        kept.push({ sourceStartSec: sourceCursor, sourceEndSec: cut.startSec, timelineStartSec: timelineCursor, timelineEndSec: timelineCursor + duration, durationSec: duration });
        timelineCursor += duration;
      }
      sourceCursor = Math.max(sourceCursor, cut.endSec);
    }
    if (sourceCursor < durationSec) {
      const duration = durationSec - sourceCursor;
      kept.push({ sourceStartSec: sourceCursor, sourceEndSec: durationSec, timelineStartSec: timelineCursor, timelineEndSec: timelineCursor + duration, durationSec: duration });
    }
    return kept;
  }

  static sourceToTimeline(sourceSec, keptSegments) {
    const segment = keptSegments.find(item => sourceSec >= item.sourceStartSec && sourceSec < item.sourceEndSec);
    return segment ? segment.timelineStartSec + (sourceSec - segment.sourceStartSec) : null;
  }

  static remapPlacements(placements = [], keptSegments = []) {
    return placements.flatMap(placement => {
      const timelineStart = this.sourceToTimeline(Number(placement.startSec), keptSegments);
      if (timelineStart === null) return [];
      const sourceSegment = keptSegments.find(item => Number(placement.startSec) >= item.sourceStartSec && Number(placement.startSec) < item.sourceEndSec);
      const duration = Math.min(Number(placement.durationSec) || 0, sourceSegment.sourceEndSec - Number(placement.startSec));
      if (duration <= 0) return [];
      return [{ ...placement, originalStartSec: placement.startSec, originalEndSec: placement.endSec, startSec: timelineStart, endSec: timelineStart + duration, durationSec: duration }];
    });
  }
}

