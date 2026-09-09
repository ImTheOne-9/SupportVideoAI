"""
Module Phát hiện Thay đổi Lớn (Big Change / Scene Detection)
Giải pháp tối ưu chi phí: Thay vì index toàn bộ hàng ngàn frame của B-roll,
chỉ trích xuất 1-3 khung hình tiêu biểu ở các mốc chuyển cảnh lớn.
"""

from typing import List, Dict, Any, Tuple
import math

class SceneDetector:
    def __init__(self, threshold: float = 0.35, min_scene_len_sec: float = 1.5):
        """
        :param threshold: Ngưỡng chênh lệch giữa các khung hình (0.0 - 1.0)
        :param min_scene_len_sec: Khoảng thời gian tối thiểu giữa 2 cảnh (tránh bắt nhầm rung máy)
        """
        self.threshold = threshold
        self.min_scene_len_sec = min_scene_len_sec

    def detect_big_changes_from_signals(self, frame_signatures: List[Tuple[float, List[float]]]) -> List[Dict[str, Any]]:
        """
        Phát hiện chuyển cảnh dựa trên chuỗi chữ ký màu (color signature / histogram) của từng frame.
        :param frame_signatures: List of (timestamp_sec, feature_vector)
        :return: Danh sách các điểm chuyển cảnh và keyframe cần trích xuất
        """
        if not frame_signatures:
            return []

        scenes = []
        last_cut_time = 0.0
        current_scene_start = 0.0
        prev_features = frame_signatures[0][1]

        # Khung hình đầu tiên luôn là 1 keyframe
        keyframe_times = [frame_signatures[0][0]]

        for timestamp, features in frame_signatures[1:]:
            # Tính khoảng cách Euclidean hoặc Cosine distance giữa 2 frame liền kề
            diff = self._calculate_vector_diff(prev_features, features)
            
            # Nếu chênh lệch vượt ngưỡng và đã qua khoảng thời gian tối thiểu
            if diff >= self.threshold and (timestamp - last_cut_time) >= self.min_scene_len_sec:
                scenes.append({
                    "start_sec": round(current_scene_start, 2),
                    "end_sec": round(timestamp, 2),
                    "duration_sec": round(timestamp - current_scene_start, 2),
                    "keyframe_timestamp_sec": round((current_scene_start + timestamp) / 2, 2),
                    "change_score": round(diff, 3)
                })
                current_scene_start = timestamp
                last_cut_time = timestamp
                keyframe_times.append(timestamp)

            prev_features = features

        # Thêm cảnh cuối cùng
        last_timestamp = frame_signatures[-1][0]
        if last_timestamp > current_scene_start:
            scenes.append({
                "start_sec": round(current_scene_start, 2),
                "end_sec": round(last_timestamp, 2),
                "duration_sec": round(last_timestamp - current_scene_start, 2),
                "keyframe_timestamp_sec": round(current_scene_start, 2),
                "change_score": 1.0
            })

        return scenes

    def _calculate_vector_diff(self, vec_a: List[float], vec_b: List[float]) -> float:
        """Tính chênh lệch chuẩn hóa (0.0 đến 1.0) giữa 2 vector đặc trưng"""
        if len(vec_a) != len(vec_b) or not vec_a:
            return 1.0
        
        sum_sq = sum((a - b) ** 2 for a, b in zip(vec_a, vec_b))
        distance = math.sqrt(sum_sq)
        # Chuẩn hóa về [0.0, 1.0]
        return min(1.0, distance / math.sqrt(len(vec_a)))


if __name__ == "__main__":
    detector = SceneDetector(threshold=0.3)
    # Giả lập video 10 giây với 1 cú đổi cảnh lớn ở giây thứ 5.0
    mock_frames = [
        (0.0, [0.1, 0.2, 0.1]),
        (1.0, [0.1, 0.2, 0.12]),
        (2.0, [0.12, 0.21, 0.11]),
        (5.0, [0.9, 0.85, 0.88]), # Big change: chuyển sang cảnh cận cảnh trạm sạc
        (6.0, [0.91, 0.84, 0.87]),
        (10.0, [0.92, 0.86, 0.89])
    ]
    detected_scenes = detector.detect_big_changes_from_signals(mock_frames)
    print(f"Phát hiện được {len(detected_scenes)} phân cảnh tiêu biểu:")
    for s in detected_scenes:
        print(f" - {s['start_sec']}s -> {s['end_sec']}s (Keyframe at {s['keyframe_timestamp_sec']}s)")
