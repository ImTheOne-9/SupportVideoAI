# Testing Guide

## Gate đầy đủ

```powershell
npm test
```

Gate chạy lần lượt:

1. compile toàn bộ Python;
2. JavaScript unit tests;
3. Python unit và HTTP integration tests;
4. Vite production build.

## Test không cần API key hoặc model

Unit/integration test không tải model Whisper và không gọi Gemini. Gateway được
kiểm tra bằng offline fallback hoặc input validation. Vì vậy test phải chạy được
trên CI sạch sau khi cài dependency.

## Nghiệm thu thủ công trước bản phát hành

1. `npm start`, xác nhận `/api/health` và trang 5173 hoạt động.
2. Tải Whisper Tiny, restart và xác nhận model vẫn được nhận diện.
3. Chép lời một sample MP4 có audio và một sample không có audio.
4. Cấu hình Gemini, index lại cùng B-Roll hai lần và xác nhận lần hai cache hit.
5. Match với 16:9 bật/tắt; kiểm tra intro hold, source bounds và overlap.
6. Áp dụng cuts, xuất FCPXML/Premiere XML và xác nhận duration đã rút ngắn.
7. Import XML vào Premiere và Resolve trên Windows, relink media và kiểm tra
   source in/out. Final Cut Pro cần nghiệm thu riêng trên macOS.
8. Chạy lại khi cổng 5173 đang bận; startup phải báo lỗi rõ và không để API mồ côi.

## Desktop packaging

```powershell
npm run desktop:dist
```

Sau khi build, kiểm tra tối thiểu:

1. `release/win-unpacked/resources/engine/creatorutils-engine.exe` tồn tại.
2. `release/win-unpacked/resources/ffmpeg/ffmpeg.exe` tồn tại.
3. Mở `release/win-unpacked/CreatorUtils.exe`, xác nhận chỉ có một cửa sổ và
   đóng cửa sổ không để lại `creatorutils-engine.exe`.
4. Health endpoint phải báo `apiVersion >= 7`, `whisperReady=true`,
   `huggingFaceReady=true`, `ffmpegReady=true`.
5. Cài bằng NSIS, tải model Tiny, chép lời một video ngắn rồi gỡ cài đặt.
