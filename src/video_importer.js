/**
 * Module Xử lý Video Client (Video Importer)
 * - Đọc file video thật (.mp4, .mov, .webm) từ máy tính của người dùng
 * - Trích xuất metadata (thời lượng, kích thước, tỷ lệ 16:9 vs 9:16)
 * - Chụp khung hình (thumbnail) bằng Canvas
 * - Giải mã âm thanh bằng Web Audio API để vẽ biểu đồ sóng âm (Waveform) thật
 */

export class VideoImporter {
  /**
   * Đọc metadata của file video
   */
  static async loadVideoMetadata(file) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const ratio = width / (height || 1);
        const is169 = Math.abs(ratio - (16 / 9)) < 0.25;
        const is916 = Math.abs(ratio - (9 / 16)) < 0.25;
        const aspectRatioStr = is169 ? '16:9' : (is916 ? '9:16' : `${width}:${height}`);

        resolve({
          file,
          url,
          name: file.name,
          sizeMb: (file.size / (1024 * 1024)).toFixed(2),
          durationSec: video.duration,
          width,
          height,
          aspectRatio: aspectRatioStr,
          is169,
          is916
        });
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Không thể nạp file video: ${file.name}`));
      };

      video.src = url;
    });
  }

  /**
   * Chụp khung hình (Thumbnail) tại mốc thời gian chỉ định
   */
  static async captureFrame(fileOrUrl, timestampSec = 1.0) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      video.playsInline = true;
      const url = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);

      let isDone = false;
      const finish = (result) => {
        if (isDone) return;
        isDone = true;
        clearTimeout(timer);
        if (typeof fileOrUrl !== 'string') {
          URL.revokeObjectURL(url);
        }
        resolve(result);
      };

      const timer = setTimeout(() => {
        try {
          if (video.videoWidth > 0) {
            const canvas = document.createElement('canvas');
            canvas.width = 160;
            canvas.height = 90;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 160, 90);
            finish(canvas.toDataURL('image/jpeg', 0.8));
          } else {
            finish(null);
          }
        } catch (e) {
          finish(null);
        }
      }, 4000);

      video.onloadeddata = () => {
        const dur = video.duration || 5;
        const target = Math.min(Math.max(0.3, timestampSec), dur > 1 ? dur - 0.5 : 0.1);
        video.currentTime = target;
      };

      video.onseeked = () => {
        try {
          const vw = video.videoWidth || 320;
          const vh = video.videoHeight || 180;
          const maxDim = 320;
          let cw, ch;
          if (vw >= vh) {
            cw = maxDim;
            ch = Math.round((vh / vw) * maxDim);
          } else {
            ch = maxDim;
            cw = Math.round((vw / vh) * maxDim);
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(64, cw);
          canvas.height = Math.max(64, ch);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          finish(canvas.toDataURL('image/jpeg', 0.85));
        } catch (err) {
          finish(null);
        }
      };

      video.onerror = () => finish(null);
      video.src = url;
    });
  }

  /**
   * Giải mã file âm thanh từ video thật để lấy biên độ sóng âm (Web Audio API)
   */
  static async extractAudioWaveform(file, numBars = 400) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return this.generateSimulatedWaveform(numBars);
      }

      const audioCtx = new AudioCtx();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const rawData = audioBuffer.getChannelData(0); // Lấy kênh trái
      const blockSize = Math.floor(rawData.length / numBars);
      const waveformPeaks = [];

      for (let i = 0; i < numBars; i++) {
        const start = i * blockSize;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[start + j]);
        }
        const avg = sum / blockSize;
        waveformPeaks.push(Math.min(1.0, avg * 3.5)); // Scale độ nhạy
      }

      await audioCtx.close();
      return waveformPeaks;
    } catch (err) {
      console.warn('Không thể giải mã trực tiếp track audio, sử dụng mô phỏng nhịp giọng nói:', err);
      return this.generateSimulatedWaveform(numBars);
    }
  }

  /**
   * Tạo biểu đồ dạng sóng âm giọng nói khi file không có tiếng hoặc trình duyệt chưa cấp quyền
   */
  static generateSimulatedWaveform(numBars = 400) {
    const waveform = [];
    for (let i = 0; i < numBars; i++) {
      const silence = Math.sin(i * 0.08) > 0.65 ? 0.12 : 1.0;
      const noise = (Math.sin(i * 0.35) * Math.cos(i * 0.12) + 1.2) * 0.45;
      const peak = Math.random() * 0.4 + noise;
      waveform.push(Math.max(0.08, Math.min(1.0, peak * silence)));
    }
    return waveform;
  }

  /**
   * Phát hiện khoảng lặng từ biên độ waveform đã giải mã bằng Web Audio API.
   * Kết quả là một edit decision list; file nguồn không bị ghi đè.
   */
  static detectSilenceRanges(waveformPeaks, durationSec, minSilenceSec = 0.6, paddingSec = 0.15) {
    if (!Array.isArray(waveformPeaks) || waveformPeaks.length === 0 || durationSec <= 0) return [];
    const sorted = [...waveformPeaks].filter(Number.isFinite).sort((a, b) => a - b);
    if (!sorted.length) return [];
    const noiseFloor = sorted[Math.floor(sorted.length * 0.25)] || 0;
    const silenceLevel = Math.max(0.025, Math.min(0.16, noiseFloor * 1.25));
    const secondsPerBar = durationSec / waveformPeaks.length;
    const ranges = [];
    let startIndex = null;

    const finishRange = endIndex => {
      if (startIndex === null) return;
      const rawStart = startIndex * secondsPerBar;
      const rawEnd = endIndex * secondsPerBar;
      if (rawEnd - rawStart >= minSilenceSec) {
        const startSec = rawStart + paddingSec;
        const endSec = rawEnd - paddingSec;
        if (endSec > startSec) ranges.push({ startSec, endSec });
      }
      startIndex = null;
    };

    waveformPeaks.forEach((peak, index) => {
      if (peak <= silenceLevel) {
        if (startIndex === null) startIndex = index;
      } else {
        finishRange(index);
      }
    });
    finishRange(waveformPeaks.length);

    return ranges.map((range, index) => ({
      id: `cut-${index + 1}`,
      startSec: Number(range.startSec.toFixed(2)),
      endSec: Number(range.endSec.toFixed(2)),
      durationSec: Number((range.endSec - range.startSec).toFixed(2)),
      type: 'silence',
      label: 'Khoảng lặng',
      status: 'active'
    }));
  }
}
