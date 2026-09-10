# CreatorUtils B-Roll Pipeline — kế hoạch triển khai và test

## Trạng thái triển khai (09/09/2026)

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Scene detection nhiều keyframe | Hoàn thành MVP | Adaptive sampling, threshold, min scene, giới hạn 10 scene/clip |
| Gemini Vision index theo scene | Hoàn thành MVP | Không gửi mọi frame; có progress theo clip/scene |
| SQLite cache | Hoàn thành | ID/fingerprint ổn định, replace transaction, delete cascade |
| Embedding + semantic search | Hoàn thành MVP | Gemini embedding khi khả dụng, local hash fallback |
| Transcript ↔ scene matching | Hoàn thành MVP | Intro hold, coverage, duration, aspect ratio, reuse penalty |
| Duyệt timeline | Hoàn thành MVP | Chấp nhận, xóa, semantic replace, kéo vị trí và chặn overlap |
| A-Roll EDL | Hoàn thành | Hợp nhất cut, tạo kept segments, remap B-roll |
| FCPXML/Premiere/Resolve XML | Hoàn thành MVP | Source in/out và A-Roll cuts; cần import QA bằng NLE thật |
| Tìm kiếm nội dung B-roll | Hoàn thành MVP | Semantic ranking theo scene, fallback keyword |
| i18n Việt/Anh | Một phần | Navigation/settings đã đổi; nội dung động cần dịch tiếp |
| Desktop installer | Chưa đóng gói | Hiện chạy một lệnh `npm start`; Tauri/Electron là phase kế tiếp |

## Các bước chạy và nghiệm thu trên máy

1. Mở PowerShell tại thư mục dự án và chạy `npm start`. Lệnh này khởi động cả frontend lẫn Python AI engine.
2. Mở `http://localhost:5173`, vào Cài đặt → Dịch vụ AI, nhập Gemini API key và chọn model.
3. Nạp A-Roll. Xác nhận video phát được, waveform và loading hiển thị; sau đó bấm Chép lời AI.
4. Vào Cắt, xem và xác nhận danh sách khoảng lặng/câu thừa. File video gốc không bị thay đổi.
5. Nạp 5–10 B-Roll. Mỗi card phải hiện số cảnh; nạp lại file không đổi phải hiện `cache`.
6. Sau khi có transcript, bấm Ghép lại. Kiểm tra mỗi gợi ý có timeline in/out, source in/out, điểm và lý do.
7. Thử tìm `rửa con lăn` hoặc một vật thể có thật trong footage; clip liên quan phải lên đầu.
8. Thử Chấp nhận, Đổi, Xóa và kéo một B-roll trên timeline. Các block không được chồng nhau hoặc ra ngoài video.
9. Xuất FCPXML và Premiere/Resolve XML. Import vào NLE, relink media khi được hỏi và kiểm tra A-Roll cuts/B-Roll source range.
10. Chạy bộ test tự động bằng `npm run test:js`, `npm run test:py` và `npm run build`.

## Test case nghiệm thu thủ công

| ID | Thao tác | Kết quả mong đợi |
|---|---|---|
| BR-01 | Nạp clip có hard cut rõ ở 4s/8s | Tạo 3 scene, biên đầu 0s và biên cuối đúng duration |
| BR-02 | Nạp lại cùng file | Dùng cache; không gọi Vision lại |
| BR-03 | Đổi nội dung/file timestamp rồi nạp lại | Fingerprint đổi và scene cũ được thay thế |
| BR-04 | Ghép câu “rửa con lăn” | Cảnh con lăn xếp trên cảnh không liên quan |
| BR-05 | Bật chỉ dùng 16:9 | Không có placement dùng clip 9:16 |
| BR-06 | Đặt intro hold 3s | Không có B-roll bắt đầu trước 3s |
| BR-07 | Kéo block qua block kế bên | Block được chặn tại biên, không overlap |
| BR-08 | Đổi một placement | Chọn scene khác, giữ timeline position và source range hợp lệ |
| BR-09 | Cut A-Roll 5–9s rồi xuất XML | Sequence ngắn đi 4s, source A-Roll vẫn giữ duration gốc |
| BR-10 | Tên file có `&`, dấu Việt, khoảng trắng | XML escape đúng và parser đọc được |
| BR-11 | Tắt mạng/Gemini lỗi khi matching | Matcher local fallback, app không mất project |
| BR-12 | 100 clip, một clip lỗi | Clip lỗi được bỏ qua/cảnh báo; index đã lưu không mất |

## Mục tiêu nghiệm thu

Luồng chuẩn: nạp A-Roll + B-Roll → chép lời → xác nhận nhát cắt → phân tích nhiều cảnh B-Roll → semantic matching → duyệt timeline → xuất FCPXML/Premiere XML/Resolve XML. File nguồn không bị thay đổi.

## Giai đoạn 1 — Scene detection và keyframe

- Lấy mẫu frame theo thời lượng video, không gửi mọi frame lên AI.
- Tạo chữ ký ảnh nhỏ và phát hiện thay đổi lớn.
- Chia clip thành scene có `startSec`, `endSec`, `keyframeSec`.
- Giới hạn số scene/keyframe để kiểm soát chi phí.
- Mỗi scene gửi một keyframe tiêu biểu cho Gemini Vision.

Test case:

- Clip một cảnh 10 giây tạo đúng một scene.
- Tín hiệu thay đổi lớn tại giây 4 và 8 tạo ba scene.
- Rung nhẹ dưới threshold không tạo scene mới.
- Hai thay đổi quá gần nhau được gộp theo `minSceneSec`.
- Scene đầu bắt đầu tại 0 và scene cuối kết thúc đúng duration.
- Số keyframe không vượt giới hạn cấu hình.

## Giai đoạn 2 — Chỉ mục và cache SQLite

- Lưu clip, fingerprint, metadata và danh sách scene.
- Lưu mô tả, tag, subjects, góc máy và embedding từng scene.
- Nếu fingerprint không đổi, dùng cache và không gọi Gemini lại.
- Khi file đổi, thay thế chỉ mục cũ trong một transaction.
- Có API liệt kê, tìm kiếm và xóa chỉ mục.

Test case:

- Lưu rồi mở lại DB vẫn đọc đủ scene/embedding.
- Index lại cùng fingerprint không tạo bản ghi trùng.
- Fingerprint mới thay thế scene cũ.
- Xóa clip xóa cascade toàn bộ scene.
- JSON/Unicode tiếng Việt được bảo toàn.

## Giai đoạn 3 — Semantic matching

- Tạo embedding cho đoạn transcript.
- Tính cosine similarity với scene B-Roll.
- Trộn semantic score, keyword score, aspect ratio, reuse penalty và user guidance.
- Kết quả chứa `clipId`, `sourceInSec`, `sourceOutSec`, `timelineStartSec`, `timelineEndSec`, score và lý do.
- Không xếp chồng timeline; không vượt thời lượng scene hoặc A-Roll.

Test case:

- “rửa con lăn” xếp cảnh con lăn trên cảnh chung chung.
- Không chèn trước intro hold.
- Không vượt coverage target.
- Không dùng source out vượt scene end.
- Reuse penalty ưu tiên clip khác khi điểm gần nhau.
- Chế độ 16:9 loại clip dọc.
- Không có embedding vẫn matching bằng keyword fallback.

## Giai đoạn 4 — A-Roll edit decision list

- Chuẩn hóa các khoảng cắt, loại overlap và khoảng quá ngắn.
- Sinh các đoạn A-Roll được giữ lại từ EDL.
- Ánh xạ thời gian nguồn sang thời gian timeline sau cắt.
- Remap B-Roll placement theo timeline mới.

Test case:

- Không có cut trả lại một đoạn nguyên vẹn.
- Cut đầu/giữa/cuối tạo đúng các đoạn giữ lại.
- Cut overlap được hợp nhất.
- Tổng duration mới bằng duration gốc trừ tổng phần cắt.
- Placement nằm trong phần bị cắt được loại hoặc dời hợp lệ.

## Giai đoạn 5 — Timeline và xuất NLE

- Timeline hiển thị A-Roll đã cắt và B-Roll có source in/out.
- Cho phép accept/reject/replace, kéo vị trí và chỉnh độ dài.
- FCPXML tạo nhiều A-Roll asset-clip theo EDL.
- Premiere XML tạo đúng track A-Roll/B-Roll và in/out.
- Resolve dùng XML tương thích và giữ đường dẫn nguồn.
- Cảnh báo relink khi trình duyệt không cung cấp absolute path.

Test case:

- XML parse được bằng XML parser.
- Tên file có `&`, dấu tiếng Việt và khoảng trắng được escape đúng.
- Asset không bị khai báo trùng.
- Source in/out của B-Roll được xuất chính xác theo frame.
- A-Roll cuts không tạo khoảng trống ngoài ý muốn.
- Test import thủ công trên FCP, Premiere và Resolve với 24/25/30/60 fps.

## Giai đoạn 6 — UX, i18n và đóng gói

- Tiến trình index theo clip/scene; hủy tác vụ; retry clip lỗi.
- Trang quản lý chỉ mục B-Roll, tìm kiếm semantic và chi phí ước tính.
- i18n Việt/Anh cho nội dung tĩnh và động.
- Tauri/Electron khởi động frontend + Python engine bằng một lần bấm.
- Windows Credential Manager cho API key.
- Bộ cài kiểm tra FFmpeg, model Whisper và thư mục dữ liệu.

## Bộ dữ liệu QA tối thiểu

- 1 A-Roll 3–5 phút, tiếng Việt, có khoảng lặng và câu lặp.
- 10 B-Roll để test nhanh; 100 B-Roll để test hiệu năng.
- Có clip một cảnh, nhiều cảnh, ngang, dọc, MOV, MP4 và WebM.
- Ground truth thủ công tối thiểu 20 cặp transcript ↔ scene để đo Precision@1/3.

## Chỉ số đạt

- Scene detection không bỏ qua hard cut rõ ràng trong bộ QA.
- Cache hit 100% khi index lại file không đổi.
- Precision@3 semantic matching tối thiểu 80% trên ground truth nội bộ.
- Không placement nào overlap hoặc vượt source/timeline bounds.
- XML pass parser và import được trong ít nhất Premiere + Resolve trên Windows.
- 100 B-Roll index ổn định, có retry và không mất dữ liệu khi một clip lỗi.
