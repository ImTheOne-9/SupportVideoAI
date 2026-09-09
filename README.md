# CreatorUtils AI B-Roll Matcher (Auto Alignment Engine)

> Dự án tái tạo hoàn chỉnh hệ thống **Tự động ghép B-roll vào A-roll bằng AI** theo ý tưởng và giao diện của ứng dụng **CreatorUtils** (phiên bản macOS của Duy Luân).

---

## 📸 Giao diện ứng dụng thực tế

Ứng dụng sở hữu giao diện chuẩn phong cách macOS Dark Mode, tái hiện chi tiết từng pixel so với bản thiết kế gốc:

- **Top Bar**: Cụm 3 nút đỏ/vàng/xanh, thanh điều hướng quy trình 5 bước (`Bản ghi lời` → `Cắt` → `Phân đoạn` → `B-Roll` → `Xuất`).
- **Media Pool (Bên trái)**: Quản lý A-roll (`C4095.mov`, `C4096.mov`) và lưới 107 clip B-roll với huy hiệu tích xanh (đã dùng) và cảnh báo tỷ lệ khung hình (`34 khác tỷ lệ`).
- **Timeline Đa Tầng (Trung tâm)**: 
  - **Track 2 (Màu tím)**: Các khối B-roll (`C4139`, `C4184`, `C4182`,...) tự động chèn đúng mốc thời gian.
  - **Track 1**: Chuỗi khung hình A-roll filmstrip.
  - **Track 0**: Sóng âm thanh giọng nói (audio waveform) chi tiết và playhead đỏ kéo thả mượt mà.
- **Bảng Cấu Hình Matching (Bên phải)**: Hướng dẫn prompt, bộ 5 thanh trượt kiểm soát (`Ngắn nhất`, `Dài nhất`, `Độ dài phân đoạn`, `Tỷ lệ phủ`, `Giữ hình người nói`), và danh sách 50 vị trí chèn kèm điểm tin cậy AI (85% – 99%).
- **Bộ Xuất Timeline (Export)**: Xuất file chuẩn để mở ngay trong **Apple Final Cut Pro (.fcpxml)**, **Adobe Premiere Pro (.xml)** và **DaVinci Resolve**.

---

## 🏗️ Kiến Trúc Hệ Thống (System Architecture)

```
[Video A-roll]                     [Thư mục video B-roll]
      │                                      │
(1) Whisper Speech-to-Text           (2) Scene Change Detection (Big Change)
      │                                      │
Text + Timestamps                     Trích xuất 1-3 Keyframe tiêu biểu
      │                                      │
      │                              (3) Gemini Vision API (Multimodal VLM)
      │                                      │
      │                               Vector Embeddings & Tags
      └──────────────────┬───────────────────┘
                         │
           (4) Heuristic Matching Engine
                - Giữ hình người nói đầu video
                - Giới hạn min/max duration
                - Đảm bảo tỷ lệ phủ (coverage)
                - Lọc tỷ lệ khung hình (16:9)
                         │
                 Timeline Sequence JSON
                         │
           (5) Timeline XML Serializer
           ┌─────────────┴─────────────┐
           ▼                           ▼
Final Cut Pro (.fcpxml)     Adobe Premiere Pro (.xml)
DaVinci Resolve             DaVinci Resolve
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### 1. Yêu cầu môi trường
* **Node.js**: Phiên bản 18+ trở lên.
* **Python**: Phiên bản 3.10+ trở lên.

### 2. Khởi chạy AI engine cục bộ
```bash
pip install -r requirements.txt
python -m engine.api_server
```

Engine chạy tại `http://127.0.0.1:8765`. Có thể đặt `GEMINI_API_KEY` trong môi trường hoặc nhập key từ giao diện; key nhập từ giao diện chỉ được giữ trong RAM của engine, không lưu trong trình duyệt.

### 3. Khởi chạy Giao diện Web (Vite)
```bash
# 1. Cài đặt dependencies Node.js
npm install

# 2. Khởi chạy server giao diện
npm run dev
```
Truy cập trình duyệt tại: `http://localhost:5173/`

### 4. Chạy thử các module Python độc lập
```bash
# Chạy thử nghiệm bộ so khớp Python CLI
python -m engine.broll_matcher

# Chạy thử nghiệm phát hiện chuyển cảnh lớn
python -m engine.scene_detector
```

---

## 🧪 Bộ Test Case (Automated Tests)

Hệ thống đi kèm bộ unit test toàn diện kiểm tra tính đúng đắn của thuật toán:

```bash
python -m unittest discover -s tests
npm run test:js
```

### Các test case bao gồm:
1. **`test_intro_hold_preservation`**: Kiểm tra đảm bảo không có clip B-roll nào bị chèn vào khoảng thời gian giữ mặt người nói ở đầu video (0s -> 3s).
2. **`test_filter_aspect_ratio`**: Kiểm tra bộ lọc tự động loại bỏ các video dọc 9:16 (Shorts/Reels) khi kích hoạt tùy chọn "Chỉ dùng B-roll 16:9".
3. **`test_clip_duration_bounds`**: Đảm bảo toàn bộ các đoạn B-roll chèn vào timeline đều tuân thủ độ dài tối thiểu (`min_duration`) và tối đa (`max_duration`).
4. **`test_semantic_relevance`**: Kiểm tra tính chính xác của AI matching (đoạn nói về trạm sạc khớp với `C4139`, đoạn nói về con lăn khớp với `C4184`).
5. **`test_fcpxml_validity`**: Kiểm tra tính hợp lệ về mặt cú pháp và schema của file XML xuất cho Apple Final Cut Pro 1.9.
6. **`test_premiere_xml_validity`**: Kiểm tra tính tương thích của file Premiere Pro XML (chuẩn FCP7 xmeml version 4).

---

## 📁 Cấu Trúc Thư Mục

```
.
├── engine/                   # Lõi thuật toán và AI xử lý
│   ├── broll_matcher.py      # Thuật toán so khớp heuristic & semantic vector
│   ├── gemini_indexer.py     # Module gọi Gemini Vision API phân tích footage
│   ├── scene_detector.py     # Phát hiện Big-change để lấy mẫu keyframe
│   └── xml_exporter.py       # Bộ sinh file FCPXML và Premiere XML
├── tests/                    # Bộ unit test tự động
│   ├── test_broll_matcher.py # Test case thuật toán matching
│   └── test_xml_export.py    # Test case sinh file XML NLE
├── public/assets/            # Hình ảnh mockup review 4K & thumbnail B-roll
├── src/                      # Mã nguồn giao diện Web Frontend
│   ├── app.js                # Controller điều phối UI, video player & timeline
│   ├── demo_data.js          # Dữ liệu mẫu 107 B-roll & A-roll Deebot
│   ├── exporter_client.js    # Tải file XML/FCPXML trực tiếp trên trình duyệt
│   ├── matcher_client.js     # Thuật toán matching thời gian thực trên browser
│   └── style.css             # Thiết kế macOS Dark Mode cao cấp
├── index.html                # Cấu trúc giao diện ứng dụng chính
├── package.json              # Cấu hình Vite & Scripts
├── requirements.txt          # Thư viện Python
└── README.md                 # Tài liệu hướng dẫn dự án
```
