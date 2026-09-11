# CreatorUtils Architecture

## Mục tiêu

CreatorUtils là một **modular monolith chạy cục bộ**. Trình duyệt chịu trách
nhiệm trải nghiệm chỉnh sửa và preview; Python engine chịu trách nhiệm lưu trữ,
AI, speech-to-text và domain pipeline. Hai phía giao tiếp qua HTTP JSON/NDJSON.

```text
Browser UI
  -> feature/controller
  -> canonical JS client
  -> HTTP API boundary
  -> application service
  -> domain invariant
  -> Gemini / Whisper / FFmpeg / SQLite adapter
```

## Ranh giới frontend

- `src/main.js`: entry point, không chứa nghiệp vụ.
- `src/app/bootstrap.js`: composition root, tạo application controller.
- `src/app.js`: application shell; khởi tạo dependency và ghép các feature mixin.
- `src/features/*/creator_utils_feature.js`: hành vi theo từng màn hình/nghiệp vụ.
- `src/ui/partials/`: HTML của từng view, được ghép ở build/dev bởi plugin Vite.
- `src/styles/`: CSS chia theo vùng giao diện; `src/style.css` chỉ giữ thứ tự import.
- `src/api_client.js`: client duy nhất cho HTTP contract.
- `src/matcher_client.js`: fallback matcher chạy offline.
- `src/video_importer.js`: media APIs của trình duyệt.
- `src/exporter_client.js`: utility tải file; XML canonical luôn do backend sinh.
- `src/shared/`: utility không phụ thuộc feature.

Quy tắc: feature mới không gọi `fetch` trực tiếp, không tự nối XML và không truy
cập SQLite/Gemini. Feature dùng client/service tương ứng.

## Ranh giới backend

- `engine/api_server.py`: transport boundary, routing và serialize response.
- `engine/config.py`: cấu hình, model catalog và validation settings.
- `engine/services/`: lifecycle của integration nặng.
- `engine/domain/`: invariant thuần, không import HTTP/SQLite/Gemini/Whisper.
- `engine/project_store.py`: SQLite repository hiện tại.
- `engine/semantic_matcher.py`: matching application/domain service.
- `engine/xml_exporter.py`: canonical Python NLE serializer.

API handler không được giữ thuật toán scoring, quản lý cache model hoặc tự đọc
biến môi trường. Những trách nhiệm đó thuộc config/service/domain.

`engine/services/content_service.py` sở hữu prompt và chuẩn hóa kết quả cho phân
chương, tóm tắt, metadata và rà soát quảng cáo. HTTP handler chỉ đọc request,
gọi use case và serialize response.

## Desktop boundary

- `desktop/main.cjs`: Electron main process, single-instance, renderer server và
  lifecycle của Python sidecar.
- `desktop/preload.cjs`: bridge tối thiểu cho OS credential storage; renderer
  không có Node integration.
- `engine/sidecar.py`: entry point PyInstaller.
- `electron-builder.yml`: ghép renderer, sidecar và FFmpeg vào NSIS installer.
- Model Whisper không nằm trong installer; Hugging Face cache nằm trong hồ sơ
  người dùng và được quản lý từ trang Settings.

## Contract dữ liệu

JSON API dùng `camelCase`; Python domain dùng `snake_case`. Adapter/serializer
phải chấp nhận rõ convention ở boundary. Timeline có hai hệ tọa độ độc lập:

- `startSec/endSec`: thời gian placement trên A-Roll nguồn trước EDL.
- `sourceInSec/sourceOutSec`: khoảng lấy từ clip B-Roll.
- Sau khi áp dụng EDL, exporter remap placement sang timeline thành phẩm.

Mọi placement phải thỏa:

1. start không âm và end lớn hơn start;
2. không vượt duration timeline;
3. source in/out hợp lệ và không vượt source duration;
4. không chồng placement kế bên.

Các invariant nằm tại `engine/domain/timeline.py`.

## Security model

- Engine mặc định bind `127.0.0.1`.
- Gemini key chỉ nằm trong RAM, không lưu browser/SQLite.
- CORS chỉ cho phép frontend localhost ở cổng 5173/4173.
- Muốn dùng frontend từ LAN phải khai báo chính xác
  `CREATORUTILS_ALLOWED_ORIGINS`, ví dụ `http://192.168.1.20:5173`.
- Không bind engine ra mạng công cộng nếu chưa có authentication/TLS.

## Persistence

SQLite schema hiện ở version 1 (`PRAGMA user_version = 1`). Mọi connection bật
foreign keys và busy timeout. Mỗi thay đổi schema tiếp theo phải có migration
từ version N sang N+1 và test mở database cũ.

## Testing pyramid

```text
E2E/manual NLE import       ít, chi phí cao
HTTP + SQLite integration  kiểm tra boundary thật
Domain/service unit tests  nhanh, bao phủ invariant
Compile + production build bắt lỗi đóng gói/syntax
```

Lệnh gate duy nhất trước khi merge:

```powershell
npm test
```

## Trạng thái migration

Đã hoàn thành:

- cấu hình backend tập trung;
- Whisper/Hugging Face service;
- Gemini gateway;
- API server factory và HTTP integration test;
- CORS allowlist;
- SQLite schema version/foreign keys;
- domain invariant cho timeline;
- EDL Python và exporter hỗ trợ cuts/source range/fps NTSC;
- `/api/export` là nguồn sự thật cho file FCPXML/Premiere/DaVinci tải xuống;
- `src/features/export` dùng cùng backend serializer cho preview, copy và tải;
- frontend composition root và canonical JS modules;
- startup preflight cho cổng 5173/8765.

- `CreatorUtilsApp` đã chia thành 13 feature module; không còn class legacy;
- HTML/CSS đã tách theo view/khu vực mà giữ nguyên thứ tự DOM và cascade;
- Electron + PyInstaller + NSIS build hoàn chỉnh, có FFmpeg nhúng sẵn;
- Gemini key của desktop được mã hóa bằng OS credential storage.

Phần nên làm tiếp theo khi sản phẩm có thiết kế/QA chính thức là bổ sung Playwright
visual regression, ký code-signing certificate và pipeline release CI. Đây là
công việc phát hành/vận hành, không còn là nợ cấu trúc runtime.
