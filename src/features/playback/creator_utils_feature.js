

export const playbackFeature = {
  getPlaybackPlayer() {
    var t;
    return this.currentView === "transcript" && ((t = this.transcriptVideoPlayer) != null && t.src) ? this.transcriptVideoPlayer : this.mainVideoPlayer;
  },
  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const t = this.getPlaybackPlayer();
    const maxT = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    this.isPlaying ? this.activeArollFile && (t != null && t.src) ? t.play().catch((e) => console.warn(e)) : this.playbackInterval = setInterval(() => {
      this.currentTimeSec >= maxT ? this.seekTo(0) : this.seekTo(this.currentTimeSec + 0.5);
    }, 500) : (this.activeArollFile && (t != null && t.src) ? t.pause() : clearInterval(this.playbackInterval), this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.currentView === "transcript" && this.renderTranscriptView()), this.updatePlayPauseIcon();
  },
  updatePlayPauseIcon() {
    this.isPlaying ? this.btnPlayPause.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>' : this.btnPlayPause.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  },
  seekTo(t) {
    const maxT = this.getTimelineDuration ? this.getTimelineDuration() : this.totalDurationSec;
    this.currentTimeSec = Math.max(0, Math.min(maxT, t));
    const e = this.getPlaybackPlayer();
    this.activeArollFile && (e != null && e.src) && (e.currentTime = this.timelineToMedia ? this.timelineToMedia(this.currentTimeSec) : this.currentTimeSec), this.syncTime(this.currentTimeSec);
  },
  syncTime(t) {
    this.currentTimeSec = t;
    const e = Math.floor(t / 60), i = Math.floor(t % 60);
    this.timecodeDisplay.textContent = `${e.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
    const n = t * this.pixelsPerSec;
    this.playheadLine.style.left = `${n}px`;
    const mediaTime = this.timelineToMedia ? this.timelineToMedia(t) : t;
    const s = this.matchedPositions.find((r) => mediaTime >= r.startSec && mediaTime <= r.endSec);
    if (s) {
      const r = this.brollLibrary.find((o) => o.id === s.clipId);
      r && (r.videoUrl ? (this.currentPlayingBrollId !== r.id && (this.currentPlayingBrollId = r.id, this.brollOverlayVideo.src = r.videoUrl, this.brollOverlayVideo.currentTime = Math.max(0, mediaTime - s.startSec), this.brollOverlayVideo.style.display = "block", this.brollOverlayImg.style.display = "none",
        (() => {
          const ratio = (r.width && r.height) ? `${r.width}/${r.height}` : "16/9";
          this.activeBrollOverlay.style.aspectRatio = ratio;
          const parent = this.activeBrollOverlay.parentElement;
          if (parent) {
             const overlayRatio = (r.height && r.width) ? (r.height / r.width) : (9 / 16);
             const currentWidth = this.activeBrollOverlay.offsetWidth;
             const maxW = parent.offsetHeight / overlayRatio;
             if (currentWidth > maxW) {
                 this.activeBrollOverlay.style.width = `${(maxW / parent.offsetWidth) * 100}%`;
             }
          }
        })()
      ), this.isPlaying && this.brollOverlayVideo.paused && this.brollOverlayVideo.play().catch(() => {
      })) : (this.currentPlayingBrollId = null, this.brollOverlayImg.src = r.thumb, this.brollOverlayImg.style.display = "block", this.brollOverlayVideo.style.display = "none", (() => {
          const ratio = (r.width && r.height) ? `${r.width}/${r.height}` : "16/9";
          this.activeBrollOverlay.style.aspectRatio = ratio;
      })()), this.brollOverlayLabel.textContent = `B-ROLL: ${r.id} (${s.matchPercentage}%)`, this.activeBrollOverlay.classList.add("visible"));
    } else this.currentPlayingBrollId = null, this.activeBrollOverlay.classList.remove("visible"), this.brollOverlayVideo.paused || this.brollOverlayVideo.pause();
    if (document.querySelectorAll(".matched-card-item").forEach((r) => r.classList.remove("active-playing")), s) {
      const r = document.getElementById(`card-${s.id}`);
      r && r.classList.add("active-playing");
    }
  }
};
