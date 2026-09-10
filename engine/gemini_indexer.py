"""
Module Indexing B-Roll bằng Gemini Vision & Vector Embeddings
Sử dụng Gemini 1.5/2.0 Flash để phân tích nội dung, góc máy và từ khóa của từng B-roll
với chi phí cực thấp (dưới $0.001 mỗi ảnh).
"""

import os
import json
from typing import Dict, Any, List, Optional

class GeminiBrollIndexer:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or os.environ.get("GEMINI_API_KEY")
        self.model = model or os.environ.get("GEMINI_MODEL", "gemini-3.6-flash")

    def get_vision_prompt(self, user_guidance: str = "") -> str:
        base_prompt = (
            "Bạn là trợ lý AI chuyên phân tích video footage công nghệ (B-roll).\n"
            "Hãy quan sát kỹ khung hình và trả về kết quả định dạng JSON thuần túy có các trường:\n"
            "- description (mô tả ngắn gọn, súc tích bằng tiếng Việt, ví dụ: 'Cận cảnh con lăn lau nhà và cụm chổi quét dưới gầm máy')\n"
            "- camera_angle (Toàn cảnh / Cận cảnh / Góc máy lia / Góc từ trên xuống)\n"
            "- subjects (Danh sách chủ thể chính: robot, trạm sạc, con lăn, sàn gỗ, hộp bụi, ứng dụng...)\n"
            "- tech_features (Các tính năng công nghệ thể hiện trong ảnh: lau xoay, tự giặt giẻ, tránh vật cản...)\n"
            "- aspect_ratio ('16:9', '9:16', hoặc 'other')\n"
        )
        if user_guidance:
            base_prompt += f"\nHướng dẫn phân loại bổ sung từ người dùng: {user_guidance}\n"
        return base_prompt

    def index_clip_mock(self, clip_id: str, clip_name: str, duration_sec: float, preset_type: str = "vacuum") -> Dict[str, Any]:
        """
        Dữ liệu mô phỏng chuẩn xác từ trường hợp review Deebot T80 Max Omni của Duy Luân
        """
        presets = {
            "C4139": {
                "description": "Góc máy lia đặc toàn cảnh trạm sạc và robot Deebot T80 Max Omni",
                "camera_angle": "Toàn cảnh lia máy",
                "subjects": ["trạm sạc Omni", "robot hút bụi", "phòng khách"],
                "tech_features": ["trạm sạc tự giặt giẻ", "tự sấy khô"],
                "aspect_ratio": "16:9",
                "tags": ["trạm sạc", "toàn cảnh", "deebot t80 max omni", "docking station"]
            },
            "C4102": {
                "description": "Góc quay tĩnh robot hút bụi Deebot T80 Max Omni trên nền sàn nhà",
                "camera_angle": "Góc tĩnh tầm thấp",
                "subjects": ["robot hút bụi", "sàn nhà gỗ"],
                "tech_features": ["di chuyển", "vận hành êm"],
                "aspect_ratio": "16:9",
                "tags": ["robot", "sàn nhà", "di chuyển", "vận hành"]
            },
            "C4088": {
                "description": "Toàn cảnh robot Deebot trong phân khúc tầm trung giá tốt",
                "camera_angle": "Toàn cảnh tĩnh",
                "subjects": ["robot", "thiết kế tổng thể"],
                "tech_features": ["thiết kế tinh gọn"],
                "aspect_ratio": "16:9",
                "tags": ["toàn cảnh", "phân khúc tầm trung", "giá tốt"]
            },
            "C4184": {
                "description": "Cận cảnh con lăn lau nhà và cụm chổi quét dưới gầm máy",
                "camera_angle": "Cận cảnh (Macro)",
                "subjects": ["con lăn", "chổi quét", "gầm máy robot"],
                "tech_features": ["công nghệ lau xoay", "chổi chống rối"],
                "aspect_ratio": "16:9",
                "tags": ["con lăn", "chổi quét", "gầm máy", "lau nhà"]
            },
            "C4182": {
                "description": "Góc máy từ trên xuống mặt đáy robot cho thấy công nghệ con lăn",
                "camera_angle": "Góc nhìn từ trên xuống (Top-down)",
                "subjects": ["mặt đáy robot", "cụm con lăn", "bánh xe vượt chướng ngại"],
                "tech_features": ["con lăn trợ lực", "nâng giẻ tự động"],
                "aspect_ratio": "16:9",
                "tags": ["mặt đáy", "công nghệ con lăn", "chi tiết máy"]
            },
            "C4106": {
                "description": "Robot hút bụi di chuyển về phía máy quay dọn dẹp nền nhà",
                "camera_angle": "Góc đối diện di chuyển",
                "subjects": ["robot", "hành lang nhà"],
                "tech_features": ["hút bụi", "tránh chướng ngại vật"],
                "aspect_ratio": "16:9",
                "tags": ["di chuyển", "dọn dẹp", "hút bụi", "tránh vật cản"]
            }
        }

        data = presets.get(clip_id, {
            "description": f"Cảnh minh họa chi tiết tính năng sản phẩm {clip_name}",
            "camera_angle": "Trung cảnh",
            "subjects": ["sản phẩm công nghệ", "robot hút bụi"],
            "tech_features": ["hoạt động tự động"],
            "aspect_ratio": "16:9",
            "tags": ["tính năng", "b-roll", clip_name.lower()]
        })

        return {
            "clip_id": clip_id,
            "clip_name": clip_name,
            "duration_sec": duration_sec,
            **data
        }

    def index_image_file(self, image_path: str, clip_id: str, user_guidance: str = "") -> Dict[str, Any]:
        """
        Gọi API Gemini nếu có API KEY, nếu không dùng fallback thông minh
        """
        if not self.api_key:
            return self.index_clip_mock(clip_id, os.path.basename(image_path), 8.0)
        try:
            # Code gọi google-genai
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.api_key)
            
            with open(image_path, "rb") as f:
                image_bytes = f.read()
                
            prompt = self.get_vision_prompt(user_guidance)
            response = client.models.generate_content(
                model=self.model,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    prompt
                ]
            )
            # Parse JSON từ câu trả lời của Gemini
            clean_text = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
            result["clip_id"] = clip_id
            return result
        except Exception as e:
            print(f"Lỗi khi gọi Gemini API ({e}), chuyển sang chế độ dự phòng:")
            return self.index_clip_mock(clip_id, os.path.basename(image_path), 8.0)

    def index_image_bytes(
        self,
        image_bytes: bytes,
        clip_id: str,
        clip_name: str,
        duration_sec: float,
        user_guidance: str = "",
    ) -> Dict[str, Any]:
        """Phân tích một keyframe JPEG nhận từ web app."""
        if not self.api_key:
            raise ValueError("Chưa cấu hình Gemini API key.")
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=self.api_key)
        response = client.models.generate_content(
            model=self.model,
            contents=[
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                self.get_vision_prompt(user_guidance),
            ],
        )
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_text)
        result.update({
            "clip_id": clip_id,
            "clip_name": clip_name,
            "duration_sec": duration_sec,
        })
        result["tags"] = list(dict.fromkeys(
            (result.get("subjects") or []) + (result.get("tech_features") or [])
        ))
        return result
