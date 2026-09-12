/**
 * Thuật toán so khớp B-Roll trên Client (JavaScript)
 * Phản hồi tức thì khi người dùng thay đổi các thanh trượt Slider hoặc chỉnh sửa Prompt.
 */

export class ClientBrollMatcher {
  constructor(config = {}) {
    this.config = {
      minDuration: 3.0,
      maxDuration: 12.0,
      segmentLength: 16.0,
      coverageRatio: 0.70,
      introHoldSec: 3.0,
      only16_9: true,
      placementGuidance: "Ở những đoạn nói về công năng, bắt buộc cần có B-roll mô tả kỹ công năng tương ứng.",
      ...config
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  calculateSimilarity(text, clip) {
    const textLower = (text || "").toLowerCase();
    const descLower = (clip.description || "").toLowerCase();
    const tags = (clip.tags || []).map(t => t.toLowerCase());
    const subjects = (clip.subjects || []).map(s => s.toLowerCase());

    let score = 0.25;

    for (const sub of subjects) {
      if (textLower.includes(sub) || descLower.includes(sub)) {
        score += 0.25;
        break;
      }
    }

    for (const tag of tags) {
      if (textLower.includes(tag)) {
        score += 0.15;
        break;
      }
    }

    const words = descLower.split(/\s+/).filter(word => word.length > 2);
    const matchedWords = words.filter(word => textLower.includes(word)).length;
    if (words.length) score += 0.25 * (matchedWords / words.length);

    // Hash ổn định giúp phá hòa điểm mà không làm kết quả thay đổi ngẫu nhiên.
    const pseudoHash = (clip.id.charCodeAt(1) * 7 + clip.id.charCodeAt(clip.id.length - 1) * 3) % 15;
    score += (pseudoHash / 100);

    return Math.min(0.99, Math.max(0.35, score));
  }

  reMatch(brollLibrary, totalDurationSec = 771, transcripts = []) {
    const {
      minDuration,
      maxDuration,
      segmentLength,
      coverageRatio,
      introHoldSec,
      only16_9,
      placementGuidance
    } = this.config;

    // Lọc B-roll theo tỷ lệ khung hình
    let candidates = brollLibrary;
    if (only16_9) candidates = candidates.filter(c => c.aspectRatio === "16:9");

    if (candidates.length === 0) return [];

    const sourceSegments = transcripts.length ? transcripts : Array.from(
      { length: Math.ceil(totalDurationSec / segmentLength) },
      (_, index) => ({
        startSec: index * segmentLength,
        endSec: Math.min(totalDurationSec, (index + 1) * segmentLength),
        text: placementGuidance
      })
    );
    const placements = [];
    const usageCount = new Map();
    const targetBrollTime = Math.max(0, totalDurationSec - introHoldSec) * coverageRatio;
    let accumulatedBrollTime = 0;
    let lastEnd = introHoldSec;

    for (const segment of sourceSegments) {
      if (accumulatedBrollTime >= targetBrollTime || placements.length >= 50) break;
      const startSec = Math.max(introHoldSec, lastEnd, Number(segment.startSec) || 0);
      const segmentEnd = Math.min(totalDurationSec, Number(segment.endSec) || totalDurationSec);
      const available = segmentEnd - startSec;
      if (available < minDuration) continue;

      const context = `${segment.text || ''} ${placementGuidance || ''}`.trim();
      const ranked = candidates.map(clip => {
        const reusePenalty = (usageCount.get(clip.id) || 0) * 0.08;
        return { clip, score: this.calculateSimilarity(context, clip) - reusePenalty };
      }).sort((a, b) => b.score - a.score);
      const { clip, score } = ranked[0];
      const sourceDuration = Number(clip.durationSec) || maxDuration;
      const duration = Math.min(maxDuration, sourceDuration, available, targetBrollTime - accumulatedBrollTime);
      if (duration < minDuration) continue;
      const endSec = startSec + duration;

      placements.push({
        id: `pos-${placements.length + 1}`,
        clipId: clip.id,
        clipName: clip.name || clip.clipName || `${clip.id}.mov`,
        startTime: this.formatTime(startSec),
        endTime: this.formatTime(endSec),
        startSec,
        endSec,
        durationSec: parseFloat(duration.toFixed(2)),
        matchPercentage: Math.min(99, Math.max(35, Math.round(score * 100))),
        description: clip.description,
        matchedSpeech: segment.text || '',
        status: "accepted"
      });
      accumulatedBrollTime += duration;
      lastEnd = endSec + Math.max(0.5, duration * (1 - coverageRatio));
      usageCount.set(clip.id, (usageCount.get(clip.id) || 0) + 1);
    }

    return placements;
  }
}
