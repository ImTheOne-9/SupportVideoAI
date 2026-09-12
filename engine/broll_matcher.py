"""
Module So Khớp Thông Minh (Heuristic & Semantic B-Roll Matcher)
Tự động ghép B-roll vào A-roll dựa trên lời thoại A-roll và mô tả B-roll,
tuân thủ các ràng buộc: Giữ hình người nói đầu video, độ dài min/max, tỷ lệ phủ và tỷ lệ 16:9.
"""

from typing import List, Dict, Any, Optional
import re

class BrollMatcher:
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        default_config = {
            "min_duration": 3.0,
            "max_duration": 12.0,
            "segment_len": 16.0,
            "coverage_ratio": 0.70,
            "intro_hold_sec": 3.0,
            "only_16_9": True,
            "placement_guidance": "Ở những đoạn nói về công năng, bắt buộc cần có B-roll mô tả kỹ công năng tương ứng."
        }
        self.config = {**default_config, **(config or {})}

    def format_timecode(self, seconds: float) -> str:
        """Đổi số giây sang định dạng mm:ss"""
        m = int(seconds // 60)
        s = int(seconds % 60)
        return f"{m:02d}:{s:02d}"

    def calculate_similarity_score(self, speech_text: str, clip_metadata: Dict[str, Any]) -> float:
        """
        Tính điểm tương quan ngữ nghĩa (0.0 -> 1.0) giữa đoạn nói A-roll và B-roll
        """
        text_lower = speech_text.lower()
        
        # Tập hợp các từ khóa của clip
        clip_desc = clip_metadata.get("description", "").lower()
        tags = [t.lower() for t in clip_metadata.get("tags", [])]
        subjects = [s.lower() for s in clip_metadata.get("subjects", [])]
        tech_features = [f.lower() for f in clip_metadata.get("tech_features", [])]
        
        score = 0.30 # Điểm cơ sở
        
        # 1. Trùng khớp chủ thể chính
        for sub in subjects:
            if sub in text_lower or any(word in text_lower for word in sub.split()):
                score += 0.35
                break

        # 2. Trùng khớp tính năng kỹ thuật / con lăn / chổi / trạm sạc
        for feat in tech_features:
            if feat in text_lower or any(word in text_lower for word in feat.split()):
                score += 0.25
                break

        # 3. Trùng khớp từ khóa trong tags
        for tag in tags:
            if tag in text_lower:
                score += 0.15
                break

        # 4. Trùng khớp mô tả
        words = [w for w in re.split(r'\s+', clip_desc) if len(w) > 2]
        matched_words = sum(1 for w in words if w in text_lower)
        if words:
            score += 0.20 * (matched_words / len(words))

        # Kẹp trong khoảng [0.50, 0.99]
        return min(0.99, max(0.50, score))

    def match(self, aroll_segments: List[Dict[str, Any]], broll_library: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Thực hiện so khớp và sắp xếp B-roll lên timeline
        """
        # Lọc danh sách B-roll theo tỷ lệ khung hình nếu yêu cầu 16:9
        available_brolls = broll_library
        if self.config.get("only_16_9", True):
            available_brolls = [b for b in broll_library if b.get("aspect_ratio") == "16:9"]
        
        if not available_brolls or not aroll_segments:
            return []

        intro_hold = self.config.get("intro_hold_sec", 3.0)
        min_dur = self.config.get("min_duration", 3.0)
        max_dur = self.config.get("max_duration", 12.0)
        coverage_ratio = self.config.get("coverage_ratio", 0.70)

        total_video_duration = aroll_segments[-1]["end_sec"] if aroll_segments else 0.0
        target_broll_duration = (total_video_duration - intro_hold) * coverage_ratio
        current_broll_duration = 0.0

        placements = []
        used_clip_ids = set()
        last_placed_end = intro_hold # Không chèn trước intro_hold

        for seg in aroll_segments:
            seg_start = seg["start_sec"]
            seg_end = seg["end_sec"]
            speech_text = seg["text"]

            # Bỏ qua nếu nằm hoàn toàn trong đoạn intro giữ mặt người nói
            if seg_end <= intro_hold:
                continue

            effective_start = max(seg_start, last_placed_end)
            if effective_start >= seg_end:
                continue

            available_time = seg_end - effective_start
            if available_time < min_dur:
                continue

            # Đánh giá điểm từng B-roll đối với đoạn lời thoại này
            best_clip = None
            best_score = -1.0

            for clip in available_brolls:
                # Ưu tiên clip chưa dùng để làm phong phú hình ảnh
                penalty = 0.10 if clip["clip_id"] in used_clip_ids else 0.0
                score = self.calculate_similarity_score(speech_text, clip) - penalty
                
                if score > best_score:
                    best_score = score
                    best_clip = clip

            if best_clip and best_score >= 0.65:
                # Tính toán thời lượng chèn: kẹp giữa min_dur và max_dur
                clip_dur = min(max_dur, max(min_dur, available_time))
                # Không vượt quá độ dài tối đa của file footage gốc
                clip_dur = min(clip_dur, best_clip.get("duration_sec", max_dur))
                
                placement_end = effective_start + clip_dur
                
                # Tính tỷ lệ match % hiển thị giao diện
                match_percentage = int(round(min(0.99, best_score + 0.05) * 100))
                
                placements.append({
                    "clip_id": best_clip["clip_id"],
                    "clip_name": best_clip.get("clip_name", best_clip["clip_id"]),
                    "start_sec": round(effective_start, 2),
                    "end_sec": round(placement_end, 2),
                    "duration_sec": round(clip_dur, 2),
                    "timecode_range": f"{self.format_timecode(effective_start)} -> {self.format_timecode(placement_end)}",
                    "match_percentage": match_percentage,
                    "description": best_clip.get("description", ""),
                    "camera_angle": best_clip.get("camera_angle", "Cận cảnh"),
                    "matched_speech": speech_text
                })

                used_clip_ids.add(best_clip["clip_id"])
                last_placed_end = placement_end + 1.0 # Nghỉ 1s trước clip tiếp theo
                current_broll_duration += clip_dur

                if current_broll_duration >= target_broll_duration:
                    break

        return placements
