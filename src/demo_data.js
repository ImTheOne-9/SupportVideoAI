// Demo Data chuẩn hóa mô phỏng chính xác dự án Deebot T80 Max Omni của Duy Luân

export const PROJECT_INFO = {
  name: "Deebot T80 Max Omni",
  videoCount: 2,
  totalDurationStr: "12:51",
  totalDurationSec: 771, // 12 phút 51 giây
  arollVideos: [
    {
      id: "C4095",
      name: "C4095.mov",
      durationStr: "10:10",
      resolution: "4K 3840x2160",
      thumb: "/assets/reviewer.jpg"
    },
    {
      id: "C4096",
      name: "C4096.mov",
      durationStr: "2:41",
      resolution: "4K 3840x2160",
      thumb: "/assets/reviewer.jpg",
      bitrate: "57.20 Mbps",
      size: "1.10 GB",
      codec: ".MOV",
      aspectRatio: "16:9"
    }
  ]
};

// 107 B-Roll footage items với các thể loại góc máy và hình ảnh
export const BROLL_LIBRARY = [
  {
    id: "C4139",
    name: "C4139.mov",
    thumb: "/assets/broll_dock.jpg",
    aspectRatio: "16:9",
    durationSec: 8.5,
    cameraAngle: "Góc máy lia đặc toàn cảnh",
    description: "Góc máy lia đặc toàn cảnh trạm sạc và robot Deebot T80 Max Omni",
    subjects: ["trạm sạc Omni", "robot hút bụi", "dock sạc"],
    tags: ["toàn cảnh", "trạm sạc", "omni", "tự giặt giẻ"],
    isUsed: true
  },
  {
    id: "C4102",
    name: "C4102.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "16:9",
    durationSec: 6.0,
    cameraAngle: "Góc quay tĩnh tầm thấp",
    description: "Góc quay tĩnh robot hút bụi Deebot T80 Max Omni trên nền sàn nhà",
    subjects: ["robot hút bụi", "sàn nhà"],
    tags: ["robot", "sàn nhà", "di chuyển", "vận hành"],
    isUsed: true
  },
  {
    id: "C4088",
    name: "C4088.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "16:9",
    durationSec: 10.0,
    cameraAngle: "Toàn cảnh tĩnh",
    description: "Toàn cảnh robot Deebot trong phân khúc tầm trung giá tốt",
    subjects: ["robot", "thiết kế"],
    tags: ["toàn cảnh", "phân khúc tầm trung", "giá tốt"],
    isUsed: true
  },
  {
    id: "C4184",
    name: "C4184.mov",
    thumb: "/assets/broll_roller.jpg",
    aspectRatio: "16:9",
    durationSec: 7.2,
    cameraAngle: "Cận cảnh (Macro)",
    description: "Cận cảnh con lăn lau nhà và cụm chổi quét dưới gầm máy",
    subjects: ["con lăn", "chổi quét", "gầm máy"],
    tags: ["con lăn", "chổi quét", "lau nhà", "công nghệ"],
    isUsed: true
  },
  {
    id: "C4182",
    name: "C4182.mov",
    thumb: "/assets/broll_roller.jpg",
    aspectRatio: "16:9",
    durationSec: 6.8,
    cameraAngle: "Góc nhìn từ trên xuống (Top-down)",
    description: "Góc máy từ trên xuống mặt đáy robot cho thấy công nghệ con lăn",
    subjects: ["mặt đáy robot", "cụm con lăn", "bánh xe"],
    tags: ["mặt đáy", "con lăn", "chi tiết kỹ thuật"],
    isUsed: true
  },
  {
    id: "C4106",
    name: "C4106.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "16:9",
    durationSec: 8.0,
    cameraAngle: "Góc đối diện di chuyển",
    description: "Robot hút bụi di chuyển về phía máy quay dọn dẹp nền nhà",
    subjects: ["robot", "hành lang"],
    tags: ["di chuyển", "dọn dẹp", "hút bụi", "tránh vật cản"],
    isUsed: true
  },
  {
    id: "C4090",
    name: "C4090.mov",
    thumb: "/assets/broll_dock.jpg",
    aspectRatio: "16:9",
    durationSec: 5.5,
    cameraAngle: "Cận cảnh bình nước",
    description: "Cận cảnh hai bình nước sạch và nước bẩn trên trạm sạc Omni",
    subjects: ["bình nước", "trạm sạc"],
    tags: ["bình nước", "giặt giẻ", "omni"],
    isUsed: true
  },
  {
    id: "C4091",
    name: "C4091.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "16:9",
    durationSec: 7.0,
    cameraAngle: "Góc nghiêng 45 độ",
    description: "Robot leo gờ cửa và vượt chướng ngại vật thảm lông",
    subjects: ["bánh xe", "thảm lông", "leo gờ"],
    tags: ["vượt chướng ngại", "thảm", "leo gờ"],
    isUsed: true
  },
  {
    id: "C4092",
    name: "C4092.mov",
    thumb: "/assets/broll_roller.jpg",
    aspectRatio: "16:9",
    durationSec: 6.0,
    cameraAngle: "Cận cảnh nâng giẻ",
    description: "Cơ chế tự động nâng cụm giẻ lau khi phát hiện mặt thảm",
    subjects: ["giẻ lau", "cảm biến thảm"],
    tags: ["nâng giẻ", "cảm biến", "lau thảm"],
    isUsed: true
  },
  {
    id: "C4093",
    name: "C4093.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "9:16",
    durationSec: 4.5,
    cameraAngle: "Góc dọc điện thoại",
    description: "Shorts quay đứng robot xoay 360 độ quét laser LiDAR",
    subjects: ["laser LiDAR", "cảm biến"],
    tags: ["shorts", "dọc", "lidar"],
    isUsed: false
  },
  {
    id: "C4094",
    name: "C4094.mov",
    thumb: "/assets/broll_dock.jpg",
    aspectRatio: "9:16",
    durationSec: 5.0,
    cameraAngle: "Góc dọc quay nhanh",
    description: "Shorts quay trạm sạc tự rút bụi bằng lực hút 28000Pa",
    subjects: ["rút bụi", "trạm sạc"],
    tags: ["shorts", "dọc", "hút rác"],
    isUsed: false
  },
  {
    id: "C4098",
    name: "C4098.mov",
    thumb: "/assets/broll_floor.jpg",
    aspectRatio: "16:9",
    durationSec: 9.0,
    cameraAngle: "Theo dõi chuyển động (Tracking)",
    description: "Cảnh tracking theo robot khi đi vào gầm sofa làm sạch bụi mịn",
    subjects: ["gầm sofa", "bụi mịn", "đèn led trợ sáng"],
    tags: ["gầm bàn", "sofa", "bụi mịn"],
    isUsed: true
  }
];

// Sinh thêm các clip B-roll còn lại để đủ 107 clip như trong ảnh giao diện thực tế
const baseThumbnails = ["/assets/broll_dock.jpg", "/assets/broll_floor.jpg", "/assets/broll_roller.jpg"];
for (let i = 13; i <= 107; i++) {
  const clipNum = 4100 + i;
  const isDiffRatio = i % 3 === 0; // 34 clip khác tỷ lệ (9:16)
  const thumb = baseThumbnails[i % baseThumbnails.length];
  BROLL_LIBRARY.push({
    id: `C${clipNum}`,
    name: `C${clipNum}.mov`,
    thumb: thumb,
    aspectRatio: isDiffRatio ? "9:16" : "16:9",
    durationSec: 4.0 + (i % 8) * 1.2,
    cameraAngle: isDiffRatio ? "Góc dọc điện thoại" : "Cận cảnh chi tiết",
    description: `Góc quay B-roll cảnh chi tiết ${isDiffRatio ? 'Shorts' : 'ngang'} của robot Deebot T80 Max Omni phân cảnh #${i}`,
    subjects: ["robot", "phụ kiện"],
    tags: ["b-roll", isDiffRatio ? "9:16" : "16:9", `clip-${i}`],
    isUsed: i < 30
  });
}

// 50 Vị trí chèn ban đầu chính xác theo giao diện mẫu
export const INITIAL_MATCHED_POSITIONS = [
  {
    id: "pos-1",
    clipId: "C4139",
    startTime: "00:07",
    endTime: "00:10",
    startSec: 7.0,
    endSec: 10.0,
    durationSec: 3.0,
    matchPercentage: 85,
    description: "Góc máy lia đặc toàn cảnh trạm sạc và robot Deebot T80 Max Omni.",
    status: "accepted"
  },
  {
    id: "pos-2",
    clipId: "C4102",
    startTime: "00:11",
    endTime: "00:13",
    startSec: 11.0,
    endSec: 13.0,
    durationSec: 2.0,
    matchPercentage: 85,
    description: "Góc quay tĩnh robot hút bụi Deebot T80 Max Omni trên nền sàn nhà.",
    status: "accepted"
  },
  {
    id: "pos-3",
    clipId: "C4088",
    startTime: "00:29",
    endTime: "00:36",
    startSec: 29.0,
    endSec: 36.0,
    durationSec: 7.0,
    matchPercentage: 85,
    description: "Toàn cảnh robot Deebot trong phân khúc tầm trung giá tốt.",
    status: "accepted"
  },
  {
    id: "pos-4",
    clipId: "C4184",
    startTime: "00:37",
    endTime: "00:42",
    startSec: 37.0,
    endSec: 42.0,
    durationSec: 5.0,
    matchPercentage: 95,
    description: "Cận cảnh con lăn lau nhà và cụm chổi quét dưới gầm máy.",
    status: "accepted"
  },
  {
    id: "pos-5",
    clipId: "C4182",
    startTime: "00:44",
    endTime: "00:49",
    startSec: 44.0,
    endSec: 49.0,
    durationSec: 5.0,
    matchPercentage: 99,
    description: "Góc máy từ trên xuống mặt đáy robot cho thấy công nghệ con lăn.",
    status: "accepted"
  },
  {
    id: "pos-6",
    clipId: "C4106",
    startTime: "01:00",
    endTime: "01:06",
    startSec: 60.0,
    endSec: 66.0,
    durationSec: 6.0,
    matchPercentage: 85,
    description: "Robot hút bụi di chuyển về phía máy quay dọn dẹp nền nhà.",
    status: "accepted"
  },
  {
    id: "pos-7",
    clipId: "C4090",
    startTime: "01:15",
    endTime: "01:21",
    startSec: 75.0,
    endSec: 81.0,
    durationSec: 6.0,
    matchPercentage: 92,
    description: "Cận cảnh hai bình nước sạch và nước bẩn trên trạm sạc Omni.",
    status: "accepted"
  },
  {
    id: "pos-8",
    clipId: "C4091",
    startTime: "01:30",
    endTime: "01:37",
    startSec: 90.0,
    endSec: 97.0,
    durationSec: 7.0,
    matchPercentage: 88,
    description: "Robot leo gờ cửa và vượt chướng ngại vật thảm lông dày 2cm.",
    status: "accepted"
  },
  {
    id: "pos-9",
    clipId: "C4092",
    startTime: "01:45",
    endTime: "01:52",
    startSec: 105.0,
    endSec: 112.0,
    durationSec: 7.0,
    matchPercentage: 94,
    description: "Cơ chế tự động nâng cụm giẻ lau khi phát hiện mặt thảm.",
    status: "accepted"
  },
  {
    id: "pos-10",
    clipId: "C4098",
    startTime: "02:05",
    endTime: "02:14",
    startSec: 125.0,
    endSec: 134.0,
    durationSec: 9.0,
    matchPercentage: 90,
    description: "Cảnh tracking theo robot khi đi vào gầm sofa làm sạch bụi mịn.",
    status: "accepted"
  }
];

// Điền tiếp các vị trí chèn để đủ đúng 50 vị trí chèn như trên giao diện
for (let p = 11; p <= 50; p++) {
  const startSec = 140 + (p - 11) * 14;
  const durSec = 3.0 + (p % 6) * 1.5;
  const endSec = startSec + durSec;
  const clip = BROLL_LIBRARY[(p * 3) % BROLL_LIBRARY.length];
  
  const m1 = Math.floor(startSec / 60);
  const s1 = Math.floor(startSec % 60);
  const m2 = Math.floor(endSec / 60);
  const s2 = Math.floor(endSec % 60);

  INITIAL_MATCHED_POSITIONS.push({
    id: `pos-${p}`,
    clipId: clip.id,
    startTime: `${m1.toString().padStart(2, '0')}:${s1.toString().padStart(2, '0')}`,
    endTime: `${m2.toString().padStart(2, '0')}:${s2.toString().padStart(2, '0')}`,
    startSec: startSec,
    endSec: endSec,
    durationSec: durSec,
    matchPercentage: 80 + (p % 19),
    description: clip.description,
    status: "accepted"
  });
}

// Dữ liệu bóc băng lời thoại (Bản ghi lời / Transcript)
export const SAMPLE_TRANSCRIPTS = [
  {
    id: "ts-1",
    startSec: 0.0,
    endSec: 7.0,
    startTime: "00:00",
    endTime: "00:07",
    speaker: "Duy Luân",
    text: "Xin chào các bạn, hôm nay mình trên tay con robot hút bụi Deebot T80 Max Omni mới nhất từ Ecovacs."
  },
  {
    id: "ts-2",
    startSec: 7.0,
    endSec: 18.0,
    startTime: "00:07",
    endTime: "00:18",
    speaker: "Duy Luân",
    text: "Điểm đầu tiên mà mình cực kỳ ấn tượng chính là trạm sạc Omni toàn năng được thiết kế rất gọn gàng và tinh tế."
  },
  {
    id: "ts-3",
    startSec: 18.0,
    endSec: 28.0,
    startTime: "00:18",
    endTime: "00:28",
    speaker: "Duy Luân",
    text: "Trạm sạc này có khả năng tự động giặt giẻ bằng nước nóng, sấy khô bằng khí nóng và tự gom rác vào túi bụi."
  },
  {
    id: "ts-4",
    startSec: 29.0,
    endSec: 36.0,
    startTime: "00:29",
    endTime: "00:36",
    speaker: "Duy Luân",
    text: "Trong phân khúc tầm trung giá tốt năm nay, đây là một trong những chiếc máy sở hữu nhiều công nghệ cao cấp nhất."
  },
  {
    id: "ts-5",
    startSec: 37.0,
    endSec: 44.0,
    startTime: "00:37",
    endTime: "00:42",
    speaker: "Duy Luân",
    text: "Phần đáy máy được trang bị cụm con lăn lau nhà công nghệ OZMO Turbo 2.0 tạo áp lực chà sát cực mạnh xuống sàn."
  },
  {
    id: "ts-6",
    startSec: 44.0,
    endSec: 49.0,
    startTime: "00:44",
    endTime: "00:49",
    speaker: "Duy Luân",
    text: "Khi nhìn từ trên xuống hoặc xem kỹ mặt dưới, con lăn này xoay liên tục tới 180 vòng mỗi phút để đánh bật vết bẩn cứng đầu."
  },
  {
    id: "ts-7",
    startSec: 50.0,
    endSec: 59.0,
    startTime: "00:50",
    endTime: "00:59",
    speaker: "Duy Luân",
    text: "Kết hợp với chổi quét cao su chống rối tóc, các bạn nữ nuôi thú cưng hay tóc rụng nhiều sẽ không lo bị kẹt chổi."
  },
  {
    id: "ts-8",
    startSec: 60.0,
    endSec: 74.0,
    startTime: "01:00",
    endTime: "01:14",
    speaker: "Duy Luân",
    text: "Bây giờ mình cho robot chạy thử trên sàn gạch và sàn gỗ thực tế, lực hút lên tới 28000Pa hút sạch bụi mịn trong một lần đi qua."
  },
  {
    id: "ts-9",
    startSec: 75.0,
    endSec: 89.0,
    startTime: "01:15",
    endTime: "01:29",
    speaker: "Duy Luân",
    text: "Hai bình nước trên trạm sạc có dung tích lớn, một bình nước sạch 4 lít và bình nước bẩn riêng biệt giúp máy tự vận hành cả tháng."
  },
  {
    id: "ts-10",
    startSec: 90.0,
    endSec: 104.0,
    startTime: "01:30",
    endTime: "01:44",
    speaker: "Duy Luân",
    text: "Khả năng vượt chướng ngại vật của máy cũng rất đáng nể, gờ cửa cao 20mm hay thảm lông dày đều được robot leo qua dễ dàng."
  },
  {
    id: "ts-11",
    startSec: 105.0,
    endSec: 119.0,
    startTime: "01:45",
    endTime: "01:59",
    speaker: "Duy Luân",
    text: "Đặc biệt là khi gặp thảm, hệ thống cảm biến siêu âm lập tức nhận diện và tự động nâng cụm giẻ lên 9mm để không làm ướt thảm."
  },
  {
    id: "ts-12",
    startSec: 120.0,
    endSec: 135.0,
    startTime: "02:00",
    endTime: "02:15",
    speaker: "Duy Luân",
    text: "Hệ thống LiDAR kết hợp camera TrueDetect 3D giúp né tránh các vật cản nhỏ như dây sạc hay đồ chơi trẻ em rất mượt."
  },
  {
    id: "ts-13",
    startSec: 136.0,
    endSec: 150.0,
    startTime: "02:16",
    endTime: "02:30",
    speaker: "Duy Luân",
    text: "Khi đi vào các khu vực tối như gầm giường hay gầm sofa, đèn trợ sáng tự động bật lên hỗ trợ nhận diện bụi bẩn."
  },
  {
    id: "ts-14",
    startSec: 151.0,
    endSec: 161.0,
    startTime: "02:31",
    endTime: "02:41",
    speaker: "Duy Luân",
    text: "Tổng kết lại, Deebot T80 Max Omni là sự lựa chọn quá hời trong tầm giá nếu bạn cần một trợ thủ đắc lực dọn nhà thông minh."
  }
];

// Danh sách các khoảng lặng và từ đệm cần cắt bỏ (Cắt / Silence Cutter)
export const SAMPLE_SILENCE_CUTS = [
  { id: "cut-1", startSec: 7.05, endSec: 7.95, durationSec: 0.9, type: "silence", label: "Khoảng lặng dài", status: "active" },
  { id: "cut-2", startSec: 18.1, endSec: 19.3, durationSec: 1.2, type: "silence", label: "Khoảng lặng dài", status: "active" },
  { id: "cut-3", startSec: 28.2, endSec: 28.7, durationSec: 0.5, type: "filler", label: "Từ đệm (à...)", status: "active" },
  { id: "cut-4", startSec: 36.1, endSec: 37.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng chuyển ý", status: "active" },
  { id: "cut-5", startSec: 49.2, endSec: 49.8, durationSec: 0.6, type: "filler", label: "Từ đệm (ờ...)", status: "active" },
  { id: "cut-6", startSec: 59.1, endSec: 60.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng chuẩn bị test", status: "active" },
  { id: "cut-7", startSec: 74.1, endSec: 75.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng ngắt câu", status: "active" },
  { id: "cut-8", startSec: 89.2, endSec: 90.1, durationSec: 0.9, type: "silence", label: "Khoảng lặng chuyển góc", status: "active" },
  { id: "cut-9", startSec: 104.2, endSec: 104.8, durationSec: 0.6, type: "filler", label: "Từ đệm (ừm...)", status: "active" },
  { id: "cut-10", startSec: 119.1, endSec: 120.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng giới thiệu lidar", status: "active" },
  { id: "cut-11", startSec: 135.1, endSec: 136.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng gầm sofa", status: "active" },
  { id: "cut-12", startSec: 150.1, endSec: 151.0, durationSec: 0.9, type: "silence", label: "Khoảng lặng kết bài", status: "active" }
];

// Danh sách các chương / phân đoạn chủ đề (Phân đoạn / Topic Segmentation)
export const SAMPLE_CHAPTERS = [
  {
    id: "chap-1",
    index: 1,
    title: "Mở đầu & Giới thiệu tổng quan",
    startTime: "00:00",
    endTime: "00:07",
    startSec: 0,
    endSec: 7,
    durationSec: 7,
    tags: ["#intro", "#deebot", "#ecovacs"],
    summary: "Chào khán giả và giới thiệu phiên bản mới nhất Deebot T80 Max Omni.",
    brollMatches: 0,
    matchedClipIds: []
  },
  {
    id: "chap-2",
    index: 2,
    title: "Ngoại quan & Trạm sạc Omni toàn năng",
    startTime: "00:07",
    endTime: "00:28",
    startSec: 7,
    endSec: 28,
    durationSec: 21,
    tags: ["#tram_sac", "#omni", "#giat_gie", "#nuoc_nong"],
    summary: "Đánh giá thiết kế trạm sạc Omni, tính năng tự giặt giẻ nước nóng và sấy khô.",
    brollMatches: 2,
    matchedClipIds: ["C4139", "C4090"]
  },
  {
    id: "chap-3",
    index: 3,
    title: "Phân khúc tầm trung giá tốt",
    startTime: "00:29",
    endTime: "00:36",
    startSec: 29,
    endSec: 36,
    durationSec: 7,
    tags: ["#toan_canh", "#gia_tot", "#tam_trung"],
    summary: "Nhận định về mức giá và giá trị công nghệ mang lại trong phân khúc.",
    brollMatches: 1,
    matchedClipIds: ["C4088"]
  },
  {
    id: "chap-4",
    index: 4,
    title: "Cụm con lăn OZMO Turbo & Chổi quét đáy",
    startTime: "00:37",
    endTime: "00:59",
    startSec: 37,
    endSec: 59,
    durationSec: 22,
    tags: ["#con_lan", "#ozmo", "#180_vong", "#chong_roi"],
    summary: "Soi cận cảnh cụm chà sàn 180 vòng/phút và công nghệ chổi cao su chống rối tóc.",
    brollMatches: 2,
    matchedClipIds: ["C4184", "C4182"]
  },
  {
    id: "chap-5",
    index: 5,
    title: "Trải nghiệm hút bụi thực tế & Bình nước",
    startTime: "01:00",
    endTime: "01:29",
    startSec: 60,
    endSec: 89,
    durationSec: 29,
    tags: ["#hut_bui", "#28000pa", "#binh_nuoc_4l"],
    summary: "Test lực hút trên gạch, gỗ và dung tích bình chứa nước sạch/nước bẩn.",
    brollMatches: 2,
    matchedClipIds: ["C4106", "C4090"]
  },
  {
    id: "chap-6",
    index: 6,
    title: "Vượt chướng ngại vật & Cảm biến nâng giẻ",
    startTime: "01:30",
    endTime: "01:59",
    startSec: 90,
    endSec: 119,
    durationSec: 29,
    tags: ["#leo_tham", "#go_cua", "#nang_gie_9mm"],
    summary: "Thử thách leo gờ cửa 20mm và cơ chế tự nâng giẻ khi phát hiện mặt thảm.",
    brollMatches: 2,
    matchedClipIds: ["C4091", "C4092"]
  },
  {
    id: "chap-7",
    index: 7,
    title: "Né tránh vật cản TrueDetect 3D & Gầm tối",
    startTime: "02:00",
    endTime: "02:30",
    startSec: 120,
    endSec: 150,
    durationSec: 30,
    tags: ["#truedetect_3d", "#lidar", "#gam_sofa"],
    summary: "Camera 3D tránh dây điện và đèn trợ sáng hỗ trợ dọn dẹp trong gầm tối.",
    brollMatches: 1,
    matchedClipIds: ["C4098"]
  },
  {
    id: "chap-8",
    index: 8,
    title: "Tổng kết & Khuyến nghị mua hàng",
    startTime: "02:31",
    endTime: "02:41",
    startSec: 151,
    endSec: 161,
    durationSec: 10,
    tags: ["#tong_ket", "#danh_gia"],
    summary: "Lời khuyên chọn mua cho gia đình và chốt lại các ưu điểm đáng tiền.",
    brollMatches: 0,
    matchedClipIds: []
  }
];
