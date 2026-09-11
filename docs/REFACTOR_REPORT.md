# Báo cáo refactor CreatorUtils

## Kết quả

Dự án đã chuyển từ frontend controller lớn ghép với Python HTTP script sang
modular monolith có ranh giới rõ ràng, test tự động và bộ cài Windows độc lập.
Luồng chức năng hiện tại vẫn giữ nguyên nhưng trách nhiệm đã được chia theo lớp.

## Các bước đã thực hiện

1. Chuẩn hóa cấu hình và dependency Python, gồm Python 3.13, `legacy-cgi`,
   `huggingface_hub` và requirements không gây lỗi encoding với pip Windows.
2. Tách lifecycle Whisper/Hugging Face, Gemini và content generation vào
   `engine/services`.
3. Đặt invariant timeline và edit decision trong `engine/domain`; exporter xử lý
   cuts, source in/out và frame rate NTSC.
4. Version hóa SQLite, bật foreign keys/busy timeout và từ chối schema tương lai.
5. Siết CORS về localhost mặc định và giữ Gemini key ngoài browser/SQLite.
6. Thêm `/api/export` làm serializer XML duy nhất cho preview, clipboard và file.
7. Xóa bốn implementation JavaScript legacy bị trùng khỏi runtime bundle.
8. Chia 91 method UI vào 13 feature module; `src/app.js` chỉ còn composition.
9. Chia 3.099 dòng CSS thành 9 module và 1.237 dòng HTML thành 12 partial.
10. Thêm preflight kiểm tra port, environment doctor, installer script và gate
    test chung.
11. Đóng gói Electron + Python one-file sidecar + FFmpeg thành NSIS installer.
12. Thêm cleanup process tree, single-instance, context isolation và Windows
    encrypted storage cho Gemini key.

## Kiểm thử đã chạy

- 47 Python unit/integration tests: domain, config, store, services, HTTP và XML.
- 14 Node tests: matcher, video pipeline, API client, export service, i18n và
  startup preflight.
- Python compile gate cho toàn bộ `engine` và `tests`.
- Vite production build: 28 module, build thành công.
- PyInstaller build: sidecar one-file khoảng 103 MB.
- Packaged desktop smoke test: exit code 0, API version 7, renderer hợp lệ,
  `ffmpegReady=true`, không để lại process con.
- `git diff --check`: không có whitespace error.

## Artifact

- Windows installer: `release/CreatorUtils-1.0.0-Setup.exe`.
- Portable unpacked app: `release/win-unpacked/CreatorUtils.exe`.
- Python sidecar: `desktop/engine-dist/creatorutils-engine.exe`.

Các artifact build được `.gitignore`; source, scripts và cấu hình để tái tạo đều
nằm trong repository.

## Giới hạn có chủ đích

- Model Whisper không nhúng trong installer. Lần đầu bấm tải model sẽ tải từ
  Hugging Face (khoảng 75 MB đến 3,1 GB tùy model) và lưu trong cache người dùng.
- Gemini cần API key và kết nối mạng.
- Installer hiện chưa có icon thương hiệu và chưa ký bằng certificate của nhà
  phát hành. Windows có thể hiển thị SmartScreen cho bản phân phối công khai.
- Chưa có bộ video QA sở hữu hợp pháp cho visual regression/NLE round-trip tự
  động; checklist thủ công nằm trong `docs/TESTING.md`.
