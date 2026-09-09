(function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) i(n);
  new MutationObserver((n) => {
    for (const s of n) if (s.type === "childList") for (const r of s.addedNodes) r.tagName === "LINK" && r.rel === "modulepreload" && i(r);
  }).observe(document, { childList: true, subtree: true });
  function e(n) {
    const s = {};
    return n.integrity && (s.integrity = n.integrity), n.referrerPolicy && (s.referrerPolicy = n.referrerPolicy), n.crossOrigin === "use-credentials" ? s.credentials = "include" : n.crossOrigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin", s;
  }
  function i(n) {
    if (n.ep) return;
    n.ep = true;
    const s = e(n);
    fetch(n.href, s);
  }
})();
const Ht = { name: "Deebot T80 Max Omni", totalDurationSec: 771 }, V = [{ id: "C4139", name: "C4139.mov", thumb: "/assets/broll_dock.jpg", aspectRatio: "16:9", durationSec: 8.5, cameraAngle: "G\xF3c m\xE1y lia \u0111\u1EB7c to\xE0n c\u1EA3nh", description: "G\xF3c m\xE1y lia \u0111\u1EB7c to\xE0n c\u1EA3nh tr\u1EA1m s\u1EA1c v\xE0 robot Deebot T80 Max Omni", subjects: ["tr\u1EA1m s\u1EA1c Omni", "robot h\xFAt b\u1EE5i", "dock s\u1EA1c"], tags: ["to\xE0n c\u1EA3nh", "tr\u1EA1m s\u1EA1c", "omni", "t\u1EF1 gi\u1EB7t gi\u1EBB"], isUsed: true }, { id: "C4102", name: "C4102.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "16:9", durationSec: 6, cameraAngle: "G\xF3c quay t\u0129nh t\u1EA7m th\u1EA5p", description: "G\xF3c quay t\u0129nh robot h\xFAt b\u1EE5i Deebot T80 Max Omni tr\xEAn n\u1EC1n s\xE0n nh\xE0", subjects: ["robot h\xFAt b\u1EE5i", "s\xE0n nh\xE0"], tags: ["robot", "s\xE0n nh\xE0", "di chuy\u1EC3n", "v\u1EADn h\xE0nh"], isUsed: true }, { id: "C4088", name: "C4088.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "16:9", durationSec: 10, cameraAngle: "To\xE0n c\u1EA3nh t\u0129nh", description: "To\xE0n c\u1EA3nh robot Deebot trong ph\xE2n kh\xFAc t\u1EA7m trung gi\xE1 t\u1ED1t", subjects: ["robot", "thi\u1EBFt k\u1EBF"], tags: ["to\xE0n c\u1EA3nh", "ph\xE2n kh\xFAc t\u1EA7m trung", "gi\xE1 t\u1ED1t"], isUsed: true }, { id: "C4184", name: "C4184.mov", thumb: "/assets/broll_roller.jpg", aspectRatio: "16:9", durationSec: 7.2, cameraAngle: "C\u1EADn c\u1EA3nh (Macro)", description: "C\u1EADn c\u1EA3nh con l\u0103n lau nh\xE0 v\xE0 c\u1EE5m ch\u1ED5i qu\xE9t d\u01B0\u1EDBi g\u1EA7m m\xE1y", subjects: ["con l\u0103n", "ch\u1ED5i qu\xE9t", "g\u1EA7m m\xE1y"], tags: ["con l\u0103n", "ch\u1ED5i qu\xE9t", "lau nh\xE0", "c\xF4ng ngh\u1EC7"], isUsed: true }, { id: "C4182", name: "C4182.mov", thumb: "/assets/broll_roller.jpg", aspectRatio: "16:9", durationSec: 6.8, cameraAngle: "G\xF3c nh\xECn t\u1EEB tr\xEAn xu\u1ED1ng (Top-down)", description: "G\xF3c m\xE1y t\u1EEB tr\xEAn xu\u1ED1ng m\u1EB7t \u0111\xE1y robot cho th\u1EA5y c\xF4ng ngh\u1EC7 con l\u0103n", subjects: ["m\u1EB7t \u0111\xE1y robot", "c\u1EE5m con l\u0103n", "b\xE1nh xe"], tags: ["m\u1EB7t \u0111\xE1y", "con l\u0103n", "chi ti\u1EBFt k\u1EF9 thu\u1EADt"], isUsed: true }, { id: "C4106", name: "C4106.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "16:9", durationSec: 8, cameraAngle: "G\xF3c \u0111\u1ED1i di\u1EC7n di chuy\u1EC3n", description: "Robot h\xFAt b\u1EE5i di chuy\u1EC3n v\u1EC1 ph\xEDa m\xE1y quay d\u1ECDn d\u1EB9p n\u1EC1n nh\xE0", subjects: ["robot", "h\xE0nh lang"], tags: ["di chuy\u1EC3n", "d\u1ECDn d\u1EB9p", "h\xFAt b\u1EE5i", "tr\xE1nh v\u1EADt c\u1EA3n"], isUsed: true }, { id: "C4090", name: "C4090.mov", thumb: "/assets/broll_dock.jpg", aspectRatio: "16:9", durationSec: 5.5, cameraAngle: "C\u1EADn c\u1EA3nh b\xECnh n\u01B0\u1EDBc", description: "C\u1EADn c\u1EA3nh hai b\xECnh n\u01B0\u1EDBc s\u1EA1ch v\xE0 n\u01B0\u1EDBc b\u1EA9n tr\xEAn tr\u1EA1m s\u1EA1c Omni", subjects: ["b\xECnh n\u01B0\u1EDBc", "tr\u1EA1m s\u1EA1c"], tags: ["b\xECnh n\u01B0\u1EDBc", "gi\u1EB7t gi\u1EBB", "omni"], isUsed: true }, { id: "C4091", name: "C4091.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "16:9", durationSec: 7, cameraAngle: "G\xF3c nghi\xEAng 45 \u0111\u1ED9", description: "Robot leo g\u1EDD c\u1EEDa v\xE0 v\u01B0\u1EE3t ch\u01B0\u1EDBng ng\u1EA1i v\u1EADt th\u1EA3m l\xF4ng", subjects: ["b\xE1nh xe", "th\u1EA3m l\xF4ng", "leo g\u1EDD"], tags: ["v\u01B0\u1EE3t ch\u01B0\u1EDBng ng\u1EA1i", "th\u1EA3m", "leo g\u1EDD"], isUsed: true }, { id: "C4092", name: "C4092.mov", thumb: "/assets/broll_roller.jpg", aspectRatio: "16:9", durationSec: 6, cameraAngle: "C\u1EADn c\u1EA3nh n\xE2ng gi\u1EBB", description: "C\u01A1 ch\u1EBF t\u1EF1 \u0111\u1ED9ng n\xE2ng c\u1EE5m gi\u1EBB lau khi ph\xE1t hi\u1EC7n m\u1EB7t th\u1EA3m", subjects: ["gi\u1EBB lau", "c\u1EA3m bi\u1EBFn th\u1EA3m"], tags: ["n\xE2ng gi\u1EBB", "c\u1EA3m bi\u1EBFn", "lau th\u1EA3m"], isUsed: true }, { id: "C4093", name: "C4093.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "9:16", durationSec: 4.5, cameraAngle: "G\xF3c d\u1ECDc \u0111i\u1EC7n tho\u1EA1i", description: "Shorts quay \u0111\u1EE9ng robot xoay 360 \u0111\u1ED9 qu\xE9t laser LiDAR", subjects: ["laser LiDAR", "c\u1EA3m bi\u1EBFn"], tags: ["shorts", "d\u1ECDc", "lidar"], isUsed: false }, { id: "C4094", name: "C4094.mov", thumb: "/assets/broll_dock.jpg", aspectRatio: "9:16", durationSec: 5, cameraAngle: "G\xF3c d\u1ECDc quay nhanh", description: "Shorts quay tr\u1EA1m s\u1EA1c t\u1EF1 r\xFAt b\u1EE5i b\u1EB1ng l\u1EF1c h\xFAt 28000Pa", subjects: ["r\xFAt b\u1EE5i", "tr\u1EA1m s\u1EA1c"], tags: ["shorts", "d\u1ECDc", "h\xFAt r\xE1c"], isUsed: false }, { id: "C4098", name: "C4098.mov", thumb: "/assets/broll_floor.jpg", aspectRatio: "16:9", durationSec: 9, cameraAngle: "Theo d\xF5i chuy\u1EC3n \u0111\u1ED9ng (Tracking)", description: "C\u1EA3nh tracking theo robot khi \u0111i v\xE0o g\u1EA7m sofa l\xE0m s\u1EA1ch b\u1EE5i m\u1ECBn", subjects: ["g\u1EA7m sofa", "b\u1EE5i m\u1ECBn", "\u0111\xE8n led tr\u1EE3 s\xE1ng"], tags: ["g\u1EA7m b\xE0n", "sofa", "b\u1EE5i m\u1ECBn"], isUsed: true }], _t = ["/assets/broll_dock.jpg", "/assets/broll_floor.jpg", "/assets/broll_roller.jpg"];
for (let S = 13; S <= 107; S++) {
  const t = 4100 + S, e = S % 3 === 0, i = _t[S % _t.length];
  V.push({ id: `C${t}`, name: `C${t}.mov`, thumb: i, aspectRatio: e ? "9:16" : "16:9", durationSec: 4 + S % 8 * 1.2, cameraAngle: e ? "G\xF3c d\u1ECDc \u0111i\u1EC7n tho\u1EA1i" : "C\u1EADn c\u1EA3nh chi ti\u1EBFt", description: `G\xF3c quay B-roll c\u1EA3nh chi ti\u1EBFt ${e ? "Shorts" : "ngang"} c\u1EE7a robot Deebot T80 Max Omni ph\xE2n c\u1EA3nh #${S}`, subjects: ["robot", "ph\u1EE5 ki\u1EC7n"], tags: ["b-roll", e ? "9:16" : "16:9", `clip-${S}`], isUsed: S < 30 });
}
const Gt = [{ id: "pos-1", clipId: "C4139", startTime: "00:07", endTime: "00:10", startSec: 7, endSec: 10, durationSec: 3, matchPercentage: 85, description: "G\xF3c m\xE1y lia \u0111\u1EB7c to\xE0n c\u1EA3nh tr\u1EA1m s\u1EA1c v\xE0 robot Deebot T80 Max Omni.", status: "accepted" }, { id: "pos-2", clipId: "C4102", startTime: "00:11", endTime: "00:13", startSec: 11, endSec: 13, durationSec: 2, matchPercentage: 85, description: "G\xF3c quay t\u0129nh robot h\xFAt b\u1EE5i Deebot T80 Max Omni tr\xEAn n\u1EC1n s\xE0n nh\xE0.", status: "accepted" }, { id: "pos-3", clipId: "C4088", startTime: "00:29", endTime: "00:36", startSec: 29, endSec: 36, durationSec: 7, matchPercentage: 85, description: "To\xE0n c\u1EA3nh robot Deebot trong ph\xE2n kh\xFAc t\u1EA7m trung gi\xE1 t\u1ED1t.", status: "accepted" }, { id: "pos-4", clipId: "C4184", startTime: "00:37", endTime: "00:42", startSec: 37, endSec: 42, durationSec: 5, matchPercentage: 95, description: "C\u1EADn c\u1EA3nh con l\u0103n lau nh\xE0 v\xE0 c\u1EE5m ch\u1ED5i qu\xE9t d\u01B0\u1EDBi g\u1EA7m m\xE1y.", status: "accepted" }, { id: "pos-5", clipId: "C4182", startTime: "00:44", endTime: "00:49", startSec: 44, endSec: 49, durationSec: 5, matchPercentage: 99, description: "G\xF3c m\xE1y t\u1EEB tr\xEAn xu\u1ED1ng m\u1EB7t \u0111\xE1y robot cho th\u1EA5y c\xF4ng ngh\u1EC7 con l\u0103n.", status: "accepted" }, { id: "pos-6", clipId: "C4106", startTime: "01:00", endTime: "01:06", startSec: 60, endSec: 66, durationSec: 6, matchPercentage: 85, description: "Robot h\xFAt b\u1EE5i di chuy\u1EC3n v\u1EC1 ph\xEDa m\xE1y quay d\u1ECDn d\u1EB9p n\u1EC1n nh\xE0.", status: "accepted" }, { id: "pos-7", clipId: "C4090", startTime: "01:15", endTime: "01:21", startSec: 75, endSec: 81, durationSec: 6, matchPercentage: 92, description: "C\u1EADn c\u1EA3nh hai b\xECnh n\u01B0\u1EDBc s\u1EA1ch v\xE0 n\u01B0\u1EDBc b\u1EA9n tr\xEAn tr\u1EA1m s\u1EA1c Omni.", status: "accepted" }, { id: "pos-8", clipId: "C4091", startTime: "01:30", endTime: "01:37", startSec: 90, endSec: 97, durationSec: 7, matchPercentage: 88, description: "Robot leo g\u1EDD c\u1EEDa v\xE0 v\u01B0\u1EE3t ch\u01B0\u1EDBng ng\u1EA1i v\u1EADt th\u1EA3m l\xF4ng d\xE0y 2cm.", status: "accepted" }, { id: "pos-9", clipId: "C4092", startTime: "01:45", endTime: "01:52", startSec: 105, endSec: 112, durationSec: 7, matchPercentage: 94, description: "C\u01A1 ch\u1EBF t\u1EF1 \u0111\u1ED9ng n\xE2ng c\u1EE5m gi\u1EBB lau khi ph\xE1t hi\u1EC7n m\u1EB7t th\u1EA3m.", status: "accepted" }, { id: "pos-10", clipId: "C4098", startTime: "02:05", endTime: "02:14", startSec: 125, endSec: 134, durationSec: 9, matchPercentage: 90, description: "C\u1EA3nh tracking theo robot khi \u0111i v\xE0o g\u1EA7m sofa l\xE0m s\u1EA1ch b\u1EE5i m\u1ECBn.", status: "accepted" }];
for (let S = 11; S <= 50; S++) {
  const t = 140 + (S - 11) * 14, e = 3 + S % 6 * 1.5, i = t + e, n = V[S * 3 % V.length], s = Math.floor(t / 60), r = Math.floor(t % 60), o = Math.floor(i / 60), d = Math.floor(i % 60);
  Gt.push({ id: `pos-${S}`, clipId: n.id, startTime: `${s.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`, endTime: `${o.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}`, startSec: t, endSec: i, durationSec: e, matchPercentage: 80 + S % 19, description: n.description, status: "accepted" });
}
const Ut = [{ id: "ts-1", startSec: 0, endSec: 7, startTime: "00:00", endTime: "00:07", speaker: "Duy Lu\xE2n", text: "Xin ch\xE0o c\xE1c b\u1EA1n, h\xF4m nay m\xECnh tr\xEAn tay con robot h\xFAt b\u1EE5i Deebot T80 Max Omni m\u1EDBi nh\u1EA5t t\u1EEB Ecovacs." }, { id: "ts-2", startSec: 7, endSec: 18, startTime: "00:07", endTime: "00:18", speaker: "Duy Lu\xE2n", text: "\u0110i\u1EC3m \u0111\u1EA7u ti\xEAn m\xE0 m\xECnh c\u1EF1c k\u1EF3 \u1EA5n t\u01B0\u1EE3ng ch\xEDnh l\xE0 tr\u1EA1m s\u1EA1c Omni to\xE0n n\u0103ng \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF r\u1EA5t g\u1ECDn g\xE0ng v\xE0 tinh t\u1EBF." }, { id: "ts-3", startSec: 18, endSec: 28, startTime: "00:18", endTime: "00:28", speaker: "Duy Lu\xE2n", text: "Tr\u1EA1m s\u1EA1c n\xE0y c\xF3 kh\u1EA3 n\u0103ng t\u1EF1 \u0111\u1ED9ng gi\u1EB7t gi\u1EBB b\u1EB1ng n\u01B0\u1EDBc n\xF3ng, s\u1EA5y kh\xF4 b\u1EB1ng kh\xED n\xF3ng v\xE0 t\u1EF1 gom r\xE1c v\xE0o t\xFAi b\u1EE5i." }, { id: "ts-4", startSec: 29, endSec: 36, startTime: "00:29", endTime: "00:36", speaker: "Duy Lu\xE2n", text: "Trong ph\xE2n kh\xFAc t\u1EA7m trung gi\xE1 t\u1ED1t n\u0103m nay, \u0111\xE2y l\xE0 m\u1ED9t trong nh\u1EEFng chi\u1EBFc m\xE1y s\u1EDF h\u1EEFu nhi\u1EC1u c\xF4ng ngh\u1EC7 cao c\u1EA5p nh\u1EA5t." }, { id: "ts-5", startSec: 37, endSec: 44, startTime: "00:37", endTime: "00:42", speaker: "Duy Lu\xE2n", text: "Ph\u1EA7n \u0111\xE1y m\xE1y \u0111\u01B0\u1EE3c trang b\u1ECB c\u1EE5m con l\u0103n lau nh\xE0 c\xF4ng ngh\u1EC7 OZMO Turbo 2.0 t\u1EA1o \xE1p l\u1EF1c ch\xE0 s\xE1t c\u1EF1c m\u1EA1nh xu\u1ED1ng s\xE0n." }, { id: "ts-6", startSec: 44, endSec: 49, startTime: "00:44", endTime: "00:49", speaker: "Duy Lu\xE2n", text: "Khi nh\xECn t\u1EEB tr\xEAn xu\u1ED1ng ho\u1EB7c xem k\u1EF9 m\u1EB7t d\u01B0\u1EDBi, con l\u0103n n\xE0y xoay li\xEAn t\u1EE5c t\u1EDBi 180 v\xF2ng m\u1ED7i ph\xFAt \u0111\u1EC3 \u0111\xE1nh b\u1EADt v\u1EBFt b\u1EA9n c\u1EE9ng \u0111\u1EA7u." }, { id: "ts-7", startSec: 50, endSec: 59, startTime: "00:50", endTime: "00:59", speaker: "Duy Lu\xE2n", text: "K\u1EBFt h\u1EE3p v\u1EDBi ch\u1ED5i qu\xE9t cao su ch\u1ED1ng r\u1ED1i t\xF3c, c\xE1c b\u1EA1n n\u1EEF nu\xF4i th\xFA c\u01B0ng hay t\xF3c r\u1EE5ng nhi\u1EC1u s\u1EBD kh\xF4ng lo b\u1ECB k\u1EB9t ch\u1ED5i." }, { id: "ts-8", startSec: 60, endSec: 74, startTime: "01:00", endTime: "01:14", speaker: "Duy Lu\xE2n", text: "B\xE2y gi\u1EDD m\xECnh cho robot ch\u1EA1y th\u1EED tr\xEAn s\xE0n g\u1EA1ch v\xE0 s\xE0n g\u1ED7 th\u1EF1c t\u1EBF, l\u1EF1c h\xFAt l\xEAn t\u1EDBi 28000Pa h\xFAt s\u1EA1ch b\u1EE5i m\u1ECBn trong m\u1ED9t l\u1EA7n \u0111i qua." }, { id: "ts-9", startSec: 75, endSec: 89, startTime: "01:15", endTime: "01:29", speaker: "Duy Lu\xE2n", text: "Hai b\xECnh n\u01B0\u1EDBc tr\xEAn tr\u1EA1m s\u1EA1c c\xF3 dung t\xEDch l\u1EDBn, m\u1ED9t b\xECnh n\u01B0\u1EDBc s\u1EA1ch 4 l\xEDt v\xE0 b\xECnh n\u01B0\u1EDBc b\u1EA9n ri\xEAng bi\u1EC7t gi\xFAp m\xE1y t\u1EF1 v\u1EADn h\xE0nh c\u1EA3 th\xE1ng." }, { id: "ts-10", startSec: 90, endSec: 104, startTime: "01:30", endTime: "01:44", speaker: "Duy Lu\xE2n", text: "Kh\u1EA3 n\u0103ng v\u01B0\u1EE3t ch\u01B0\u1EDBng ng\u1EA1i v\u1EADt c\u1EE7a m\xE1y c\u0169ng r\u1EA5t \u0111\xE1ng n\u1EC3, g\u1EDD c\u1EEDa cao 20mm hay th\u1EA3m l\xF4ng d\xE0y \u0111\u1EC1u \u0111\u01B0\u1EE3c robot leo qua d\u1EC5 d\xE0ng." }, { id: "ts-11", startSec: 105, endSec: 119, startTime: "01:45", endTime: "01:59", speaker: "Duy Lu\xE2n", text: "\u0110\u1EB7c bi\u1EC7t l\xE0 khi g\u1EB7p th\u1EA3m, h\u1EC7 th\u1ED1ng c\u1EA3m bi\u1EBFn si\xEAu \xE2m l\u1EADp t\u1EE9c nh\u1EADn di\u1EC7n v\xE0 t\u1EF1 \u0111\u1ED9ng n\xE2ng c\u1EE5m gi\u1EBB l\xEAn 9mm \u0111\u1EC3 kh\xF4ng l\xE0m \u01B0\u1EDBt th\u1EA3m." }, { id: "ts-12", startSec: 120, endSec: 135, startTime: "02:00", endTime: "02:15", speaker: "Duy Lu\xE2n", text: "H\u1EC7 th\u1ED1ng LiDAR k\u1EBFt h\u1EE3p camera TrueDetect 3D gi\xFAp n\xE9 tr\xE1nh c\xE1c v\u1EADt c\u1EA3n nh\u1ECF nh\u01B0 d\xE2y s\u1EA1c hay \u0111\u1ED3 ch\u01A1i tr\u1EBB em r\u1EA5t m\u01B0\u1EE3t." }, { id: "ts-13", startSec: 136, endSec: 150, startTime: "02:16", endTime: "02:30", speaker: "Duy Lu\xE2n", text: "Khi \u0111i v\xE0o c\xE1c khu v\u1EF1c t\u1ED1i nh\u01B0 g\u1EA7m gi\u01B0\u1EDDng hay g\u1EA7m sofa, \u0111\xE8n tr\u1EE3 s\xE1ng t\u1EF1 \u0111\u1ED9ng b\u1EADt l\xEAn h\u1ED7 tr\u1EE3 nh\u1EADn di\u1EC7n b\u1EE5i b\u1EA9n." }, { id: "ts-14", startSec: 151, endSec: 161, startTime: "02:31", endTime: "02:41", speaker: "Duy Lu\xE2n", text: "T\u1ED5ng k\u1EBFt l\u1EA1i, Deebot T80 Max Omni l\xE0 s\u1EF1 l\u1EF1a ch\u1ECDn qu\xE1 h\u1EDDi trong t\u1EA7m gi\xE1 n\u1EBFu b\u1EA1n c\u1EA7n m\u1ED9t tr\u1EE3 th\u1EE7 \u0111\u1EAFc l\u1EF1c d\u1ECDn nh\xE0 th\xF4ng minh." }], Wt = [{ id: "cut-1", startSec: 7.05, endSec: 7.95, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng d\xE0i", status: "active" }, { id: "cut-2", startSec: 18.1, endSec: 19.3, durationSec: 1.2, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng d\xE0i", status: "active" }, { id: "cut-3", startSec: 28.2, endSec: 28.7, durationSec: 0.5, type: "filler", label: "T\u1EEB \u0111\u1EC7m (\xE0...)", status: "active" }, { id: "cut-4", startSec: 36.1, endSec: 37, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng chuy\u1EC3n \xFD", status: "active" }, { id: "cut-5", startSec: 49.2, endSec: 49.8, durationSec: 0.6, type: "filler", label: "T\u1EEB \u0111\u1EC7m (\u1EDD...)", status: "active" }, { id: "cut-6", startSec: 59.1, endSec: 60, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng chu\u1EA9n b\u1ECB test", status: "active" }, { id: "cut-7", startSec: 74.1, endSec: 75, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng ng\u1EAFt c\xE2u", status: "active" }, { id: "cut-8", startSec: 89.2, endSec: 90.1, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng chuy\u1EC3n g\xF3c", status: "active" }, { id: "cut-9", startSec: 104.2, endSec: 104.8, durationSec: 0.6, type: "filler", label: "T\u1EEB \u0111\u1EC7m (\u1EEBm...)", status: "active" }, { id: "cut-10", startSec: 119.1, endSec: 120, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng gi\u1EDBi thi\u1EC7u lidar", status: "active" }, { id: "cut-11", startSec: 135.1, endSec: 136, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng g\u1EA7m sofa", status: "active" }, { id: "cut-12", startSec: 150.1, endSec: 151, durationSec: 0.9, type: "silence", label: "Kho\u1EA3ng l\u1EB7ng k\u1EBFt b\xE0i", status: "active" }], qt = [{ id: "chap-1", index: 1, title: "M\u1EDF \u0111\u1EA7u & Gi\u1EDBi thi\u1EC7u t\u1ED5ng quan", startTime: "00:00", endTime: "00:07", startSec: 0, endSec: 7, durationSec: 7, tags: ["#intro", "#deebot", "#ecovacs"], summary: "Ch\xE0o kh\xE1n gi\u1EA3 v\xE0 gi\u1EDBi thi\u1EC7u phi\xEAn b\u1EA3n m\u1EDBi nh\u1EA5t Deebot T80 Max Omni.", brollMatches: 0, matchedClipIds: [] }, { id: "chap-2", index: 2, title: "Ngo\u1EA1i quan & Tr\u1EA1m s\u1EA1c Omni to\xE0n n\u0103ng", startTime: "00:07", endTime: "00:28", startSec: 7, endSec: 28, durationSec: 21, tags: ["#tram_sac", "#omni", "#giat_gie", "#nuoc_nong"], summary: "\u0110\xE1nh gi\xE1 thi\u1EBFt k\u1EBF tr\u1EA1m s\u1EA1c Omni, t\xEDnh n\u0103ng t\u1EF1 gi\u1EB7t gi\u1EBB n\u01B0\u1EDBc n\xF3ng v\xE0 s\u1EA5y kh\xF4.", brollMatches: 2, matchedClipIds: ["C4139", "C4090"] }, { id: "chap-3", index: 3, title: "Ph\xE2n kh\xFAc t\u1EA7m trung gi\xE1 t\u1ED1t", startTime: "00:29", endTime: "00:36", startSec: 29, endSec: 36, durationSec: 7, tags: ["#toan_canh", "#gia_tot", "#tam_trung"], summary: "Nh\u1EADn \u0111\u1ECBnh v\u1EC1 m\u1EE9c gi\xE1 v\xE0 gi\xE1 tr\u1ECB c\xF4ng ngh\u1EC7 mang l\u1EA1i trong ph\xE2n kh\xFAc.", brollMatches: 1, matchedClipIds: ["C4088"] }, { id: "chap-4", index: 4, title: "C\u1EE5m con l\u0103n OZMO Turbo & Ch\u1ED5i qu\xE9t \u0111\xE1y", startTime: "00:37", endTime: "00:59", startSec: 37, endSec: 59, durationSec: 22, tags: ["#con_lan", "#ozmo", "#180_vong", "#chong_roi"], summary: "Soi c\u1EADn c\u1EA3nh c\u1EE5m ch\xE0 s\xE0n 180 v\xF2ng/ph\xFAt v\xE0 c\xF4ng ngh\u1EC7 ch\u1ED5i cao su ch\u1ED1ng r\u1ED1i t\xF3c.", brollMatches: 2, matchedClipIds: ["C4184", "C4182"] }, { id: "chap-5", index: 5, title: "Tr\u1EA3i nghi\u1EC7m h\xFAt b\u1EE5i th\u1EF1c t\u1EBF & B\xECnh n\u01B0\u1EDBc", startTime: "01:00", endTime: "01:29", startSec: 60, endSec: 89, durationSec: 29, tags: ["#hut_bui", "#28000pa", "#binh_nuoc_4l"], summary: "Test l\u1EF1c h\xFAt tr\xEAn g\u1EA1ch, g\u1ED7 v\xE0 dung t\xEDch b\xECnh ch\u1EE9a n\u01B0\u1EDBc s\u1EA1ch/n\u01B0\u1EDBc b\u1EA9n.", brollMatches: 2, matchedClipIds: ["C4106", "C4090"] }, { id: "chap-6", index: 6, title: "V\u01B0\u1EE3t ch\u01B0\u1EDBng ng\u1EA1i v\u1EADt & C\u1EA3m bi\u1EBFn n\xE2ng gi\u1EBB", startTime: "01:30", endTime: "01:59", startSec: 90, endSec: 119, durationSec: 29, tags: ["#leo_tham", "#go_cua", "#nang_gie_9mm"], summary: "Th\u1EED th\xE1ch leo g\u1EDD c\u1EEDa 20mm v\xE0 c\u01A1 ch\u1EBF t\u1EF1 n\xE2ng gi\u1EBB khi ph\xE1t hi\u1EC7n m\u1EB7t th\u1EA3m.", brollMatches: 2, matchedClipIds: ["C4091", "C4092"] }, { id: "chap-7", index: 7, title: "N\xE9 tr\xE1nh v\u1EADt c\u1EA3n TrueDetect 3D & G\u1EA7m t\u1ED1i", startTime: "02:00", endTime: "02:30", startSec: 120, endSec: 150, durationSec: 30, tags: ["#truedetect_3d", "#lidar", "#gam_sofa"], summary: "Camera 3D tr\xE1nh d\xE2y \u0111i\u1EC7n v\xE0 \u0111\xE8n tr\u1EE3 s\xE1ng h\u1ED7 tr\u1EE3 d\u1ECDn d\u1EB9p trong g\u1EA7m t\u1ED1i.", brollMatches: 1, matchedClipIds: ["C4098"] }, { id: "chap-8", index: 8, title: "T\u1ED5ng k\u1EBFt & Khuy\u1EBFn ngh\u1ECB mua h\xE0ng", startTime: "02:31", endTime: "02:41", startSec: 151, endSec: 161, durationSec: 10, tags: ["#tong_ket", "#danh_gia"], summary: "L\u1EDDi khuy\xEAn ch\u1ECDn mua cho gia \u0111\xECnh v\xE0 ch\u1ED1t l\u1EA1i c\xE1c \u01B0u \u0111i\u1EC3m \u0111\xE1ng ti\u1EC1n.", brollMatches: 0, matchedClipIds: [] }];
class zt {
  constructor(t = {}) {
    this.config = { minDuration: 3, maxDuration: 12, segmentLength: 16, coverageRatio: 0.7, introHoldSec: 3, only16_9: true, placementGuidance: "\u1EDE nh\u1EEFng \u0111o\u1EA1n n\xF3i v\u1EC1 c\xF4ng n\u0103ng, b\u1EAFt bu\u1ED9c c\u1EA7n c\xF3 B-roll m\xF4 t\u1EA3 k\u1EF9 c\xF4ng n\u0103ng t\u01B0\u01A1ng \u1EE9ng.", ...t };
  }
  updateConfig(t) {
    this.config = { ...this.config, ...t };
  }
  formatTime(t) {
    const e = Math.floor(t / 60), i = Math.floor(t % 60);
    return `${e.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
  }
  calculateSimilarity(t, e) {
    const i = (t || "").toLowerCase(), n = (e.description || "").toLowerCase(), s = (e.tags || []).map((h) => h.toLowerCase()), r = (e.subjects || []).map((h) => h.toLowerCase());
    let o = 0.25;
    for (const h of r) if (i.includes(h) || n.includes(h)) {
      o += 0.25;
      break;
    }
    for (const h of s) if (i.includes(h)) {
      o += 0.15;
      break;
    }
    const d = n.split(/\s+/).filter((h) => h.length > 2), a = d.filter((h) => i.includes(h)).length;
    d.length && (o += 0.25 * (a / d.length));
    const c = (e.id.charCodeAt(1) * 7 + e.id.charCodeAt(e.id.length - 1) * 3) % 15;
    return o += c / 100, Math.min(0.99, Math.max(0.35, o));
  }
  reMatch(t, e = 771, i = []) {
    const { minDuration: n, maxDuration: s, segmentLength: r, coverageRatio: o, introHoldSec: d, only16_9: a, placementGuidance: c } = this.config;
    let h = t;
    if (a && (h = h.filter((v) => v.aspectRatio === "16:9")), h.length === 0) return [];
    const m = i.length ? i : Array.from({ length: Math.ceil(e / r) }, (v, T) => ({ startSec: T * r, endSec: Math.min(e, (T + 1) * r), text: c })), u = [], g = /* @__PURE__ */ new Map(), f = Math.max(0, e - d) * o;
    let x = 0, P = d;
    for (const v of m) {
      if (x >= f || u.length >= 50) break;
      const T = Math.max(d, P, Number(v.startSec) || 0), b = Math.min(e, Number(v.endSec) || e) - T;
      if (b < n) continue;
      const I = `${v.text || ""} ${c || ""}`.trim(), k = h.map((M) => {
        const D = (g.get(M.id) || 0) * 0.08;
        return { clip: M, score: this.calculateSimilarity(I, M) - D };
      }).sort((M, D) => D.score - M.score), { clip: w, score: R } = k[0], A = Number(w.durationSec) || s, L = Math.min(s, A, b, f - x);
      if (L < n) continue;
      const j = T + L;
      u.push({ id: `pos-${u.length + 1}`, clipId: w.id, clipName: w.name || w.clipName || `${w.id}.mov`, startTime: this.formatTime(T), endTime: this.formatTime(j), startSec: T, endSec: j, durationSec: parseFloat(L.toFixed(2)), matchPercentage: Math.min(99, Math.max(35, Math.round(R * 100))), description: w.description, matchedSpeech: v.text || "", status: "accepted" }), x += L, P = j + Math.max(0.5, L * (1 - o)), g.set(w.id, (g.get(w.id) || 0) + 1);
    }
    return u;
  }
}
class F {
  constructor(t = "CreatorUtils Project", e = 30, i = 3840, n = 2160) {
    this.projectName = t, this.fps = e, this.width = i, this.height = n;
  }
  secToFrames(t) {
    return Math.round(t * this.fps);
  }
  escapeXml(t) {
    return String(t ?? "").replace(/[&<>"']/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[e]);
  }
  fileUrl(t) {
    return `file://localhost/${String(t || "").replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`;
  }
  clipName(t) {
    return t.clipName || t.name || `${t.clipId}.mov`;
  }
  generateFCPXML(t, e = "A-Roll.mov", i = 0) {
    const n = this.secToFrames(i), s = `1/${this.fps}s`, r = /* @__PURE__ */ new Map();
    t.forEach((a) => {
      r.has(a.clipId) || r.set(a.clipId, a);
    });
    let o = `
    <format id="r1" name="FFVideoFormat${this.height}p${this.fps}" frameDuration="${s}" width="${this.width}" height="${this.height}"/>
    <asset id="r_aroll" name="${this.escapeXml(e)}" src="${this.escapeXml(this.fileUrl(e))}" duration="${n}/${this.fps}s" hasVideo="1" hasAudio="1"/>`;
    for (const [a, c] of r) {
      const h = this.clipName(c), m = c.sourceDurationSec || c.durationSec;
      o += `
    <asset id="r_broll_${this.escapeXml(a)}" name="${this.escapeXml(h)}" src="${this.escapeXml(this.fileUrl(h))}" duration="${this.secToFrames(m)}/${this.fps}s" hasVideo="1"/>`;
    }
    const d = t.map((a) => {
      const c = this.clipName(a);
      return `
            <asset-clip ref="r_broll_${this.escapeXml(a.clipId)}" lane="1" name="${this.escapeXml(c)}" offset="${this.secToFrames(a.startSec)}/${this.fps}s" duration="${this.secToFrames(a.durationSec)}/${this.fps}s"/>`;
    }).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <resources>${o}
  </resources>
  <library>
    <event name="${this.escapeXml(this.projectName)}">
      <project name="${this.escapeXml(this.projectName)}">
        <sequence format="r1" duration="${n}/${this.fps}s" tcStart="0s" tcFormat="NDF">
          <spine>
            <asset-clip ref="r_aroll" offset="0s" name="${this.escapeXml(e)}" duration="${n}/${this.fps}s" tcFormat="NDF">${d}
            </asset-clip>
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
  }
  generatePremiereXML(t, e = "A-Roll.mov", i = 0) {
    const n = this.secToFrames(i), s = t.map((r, o) => {
      const d = this.secToFrames(r.startSec), a = this.secToFrames(r.endSec), c = a - d, h = this.clipName(r);
      return `
        <clipitem id="clipitem-broll-${o + 1}">
          <name>${this.escapeXml(h)}</name><start>${d}</start><end>${a}</end><in>0</in><out>${c}</out>
          <file id="file-broll-${o + 1}"><name>${this.escapeXml(h)}</name><pathurl>${this.escapeXml(this.fileUrl(h))}</pathurl><rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate><duration>${this.secToFrames(r.sourceDurationSec || r.durationSec)}</duration></file>
        </clipitem>`;
    }).join("");
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><project><name>${this.escapeXml(this.projectName)}</name><children><sequence>
  <name>${this.escapeXml(this.projectName)}</name><duration>${n}</duration>
  <rate><timebase>${this.fps}</timebase><ntsc>FALSE</ntsc></rate>
  <media><video><format><samplecharacteristics><width>${this.width}</width><height>${this.height}</height><pixelaspectratio>square</pixelaspectratio><rate><timebase>${this.fps}</timebase></rate></samplecharacteristics></format>
    <track><clipitem id="clipitem-aroll-1"><name>${this.escapeXml(e)}</name><start>0</start><end>${n}</end><in>0</in><out>${n}</out><file id="file-aroll"><name>${this.escapeXml(e)}</name><pathurl>${this.escapeXml(this.fileUrl(e))}</pathurl></file></clipitem></track>
    <track>${s}
    </track>
  </video></media>
</sequence></children></project></xmeml>`;
  }
  downloadFile(t, e, i = "application/xml") {
    const n = new Blob([e], { type: i }), s = URL.createObjectURL(n), r = document.createElement("a");
    r.href = s, r.download = t, document.body.appendChild(r), r.click(), r.remove(), URL.revokeObjectURL(s);
  }
}
class $ {
  static async loadVideoMetadata(t) {
    return new Promise((e, i) => {
      const n = document.createElement("video");
      n.preload = "metadata", n.muted = true, n.playsInline = true;
      const s = URL.createObjectURL(t);
      n.onloadedmetadata = () => {
        const r = n.videoWidth, o = n.videoHeight, d = r / (o || 1), a = Math.abs(d - 16 / 9) < 0.25, c = Math.abs(d - 9 / 16) < 0.25, h = a ? "16:9" : c ? "9:16" : `${r}:${o}`;
        e({ file: t, url: s, name: t.name, sizeMb: (t.size / (1024 * 1024)).toFixed(2), durationSec: n.duration, width: r, height: o, aspectRatio: h, is169: a, is916: c });
      }, n.onerror = () => {
        URL.revokeObjectURL(s), i(new Error(`Kh\xF4ng th\u1EC3 n\u1EA1p file video: ${t.name}`));
      }, n.src = s;
    });
  }
  static async captureFrame(t, e = 1) {
    return new Promise((i) => {
      const n = document.createElement("video");
      n.preload = "auto", n.muted = true, n.playsInline = true;
      const s = typeof t == "string" ? t : URL.createObjectURL(t);
      let r = false;
      const o = (a) => {
        r || (r = true, clearTimeout(d), typeof t != "string" && URL.revokeObjectURL(s), i(a));
      }, d = setTimeout(() => {
        try {
          if (n.videoWidth > 0) {
            const a = document.createElement("canvas");
            a.width = 160, a.height = 90, a.getContext("2d").drawImage(n, 0, 0, 160, 90), o(a.toDataURL("image/jpeg", 0.8));
          } else o(null);
        } catch {
          o(null);
        }
      }, 4e3);
      n.onloadeddata = () => {
        const a = n.duration || 5, c = Math.min(Math.max(0.3, e), a > 1 ? a - 0.5 : 0.1);
        n.currentTime = c;
      }, n.onseeked = () => {
        try {
          const a = n.videoWidth || 320, c = n.videoHeight || 180, h = 320;
          let m, u;
          a >= c ? (m = h, u = Math.round(c / a * h)) : (u = h, m = Math.round(a / c * h));
          const g = document.createElement("canvas");
          g.width = Math.max(64, m), g.height = Math.max(64, u), g.getContext("2d").drawImage(n, 0, 0, g.width, g.height), o(g.toDataURL("image/jpeg", 0.85));
        } catch {
          o(null);
        }
      }, n.onerror = () => o(null), n.src = s;
    });
  }
  static async extractAudioWaveform(t, e = 400) {
    try {
      const i = window.AudioContext || window.webkitAudioContext;
      if (!i) return this.generateSimulatedWaveform(e);
      const n = new i(), s = await t.arrayBuffer(), o = (await n.decodeAudioData(s)).getChannelData(0), d = Math.floor(o.length / e), a = [];
      for (let c = 0; c < e; c++) {
        const h = c * d;
        let m = 0;
        for (let g = 0; g < d; g++) m += Math.abs(o[h + g]);
        const u = m / d;
        a.push(Math.min(1, u * 3.5));
      }
      return await n.close(), a;
    } catch (i) {
      return console.warn("Kh\xF4ng th\u1EC3 gi\u1EA3i m\xE3 tr\u1EF1c ti\u1EBFp track audio, s\u1EED d\u1EE5ng m\xF4 ph\u1ECFng nh\u1ECBp gi\u1ECDng n\xF3i:", i), this.generateSimulatedWaveform(e);
    }
  }
  static generateSimulatedWaveform(t = 400) {
    const e = [];
    for (let i = 0; i < t; i++) {
      const n = Math.sin(i * 0.08) > 0.65 ? 0.12 : 1, s = (Math.sin(i * 0.35) * Math.cos(i * 0.12) + 1.2) * 0.45, r = Math.random() * 0.4 + s;
      e.push(Math.max(0.08, Math.min(1, r * n)));
    }
    return e;
  }
  static detectSilenceRanges(t, e, i = 0.6, n = 0.15) {
    if (!Array.isArray(t) || t.length === 0 || e <= 0) return [];
    const s = [...t].filter(Number.isFinite).sort((m, u) => m - u);
    if (!s.length) return [];
    const r = s[Math.floor(s.length * 0.25)] || 0, o = Math.max(0.025, Math.min(0.16, r * 1.25)), d = e / t.length, a = [];
    let c = null;
    const h = (m) => {
      if (c === null) return;
      const u = c * d, g = m * d;
      if (g - u >= i) {
        const f = u + n, x = g - n;
        x > f && a.push({ startSec: f, endSec: x });
      }
      c = null;
    };
    return t.forEach((m, u) => {
      m <= o ? c === null && (c = u) : h(u);
    }), h(t.length), a.map((m, u) => ({ id: `cut-${u + 1}`, startSec: Number(m.startSec.toFixed(2)), endSec: Number(m.endSec.toFixed(2)), durationSec: Number((m.endSec - m.startSec).toFixed(2)), type: "silence", label: "Kho\u1EA3ng l\u1EB7ng", status: "active" }));
  }
}
class Kt {
  constructor(t = window.CREATORUTILS_API_URL || "http://127.0.0.1:8765") {
    this.baseUrl = t.replace(/\/$/, "");
  }
  async request(t, e = {}, i = 12e4) {
    if (this.timeoutMs && i === 12e4) i = this.timeoutMs;
    const n = new AbortController(), s = setTimeout(() => n.abort(), i);
    try {
      const r = await fetch(`${this.baseUrl}${t}`, { ...e, signal: n.signal }), o = await r.json().catch(() => ({}));
      if (!r.ok) throw r.status === 404 && t.startsWith("/api/projects") ? new Error("AI engine \u0111ang ch\u1EA1y phi\xEAn b\u1EA3n c\u0169. H\xE3y d\u1EEBng terminal API v\xE0 ch\u1EA1y l\u1EA1i: npm run api") : r.status === 404 && t === "/api/summarize" ? new Error("AI engine \u0111ang ch\u1EA1y phi\xEAn b\u1EA3n c\u0169. H\xE3y d\u1EEBng terminal API v\xE0 ch\u1EA1y l\u1EA1i: npm run api") : new Error(o.error || `AI engine tr\u1EA3 v\u1EC1 HTTP ${r.status}`);
      return o;
    } catch (r) {
      throw r.name === "AbortError" ? new Error("AI engine ph\u1EA3n h\u1ED3i qu\xE1 th\u1EDDi gian ch\u1EDD.") : r instanceof TypeError ? new Error("Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c AI engine qua frontend. H\xE3y ki\u1EC3m tra c\u1EA3 hai terminal v\xE0 t\u1EA3i l\u1EA1i trang.") : r;
    } finally {
      clearTimeout(s);
    }
  }
  health() {
    return this.request("/api/health", {}, 5e3);
  }
  setGeminiKey(t) {
    return this.request("/api/config/gemini", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ apiKey: t }) });
  }
  getSettings() {
    return this.request("/api/settings", {}, 1e4);
  }
  saveSettings(t) {
    return this.request("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) }, 1e4);
  }
  listWhisperModels() {
    return this.request("/api/models/whisper", {}, 15e3);
  }
  downloadWhisperModel(t) {
    return this.request("/api/models/whisper/download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ modelId: t }) }, 36e5);
  }
  deleteWhisperModel(t) {
    return this.request(`/api/models/whisper/${encodeURIComponent(t)}`, { method: "DELETE" }, 6e4);
  }
  transcribe(t, e = "vi") {
    const i = new FormData();
    return i.append("file", t, t.name), i.append("language", e), this.request("/api/transcribe", { method: "POST", body: i }, 1800 * 1e3);
  }
  async *transcribeStream(t, e = "vi") {
    const i = new FormData();
    i.append("file", t, t.name), i.append("language", e);
    let n;
    try {
      n = await fetch(`${this.baseUrl}/api/transcribe-stream`, { method: "POST", body: i });
    } catch {
      throw new Error("Kh\xF4ng k\u1EBFt n\u1ED1i \u0111\u01B0\u1EE3c AI engine \u0111\u1EC3 ch\xE9p l\u1EDDi.");
    }
    if (!n.ok) {
      const d = await n.json().catch(() => ({}));
      throw new Error(d.error || `Whisper tr\u1EA3 v\u1EC1 HTTP ${n.status}`);
    }
    if (!n.body) throw new Error("Tr\xECnh duy\u1EC7t kh\xF4ng h\u1ED7 tr\u1EE3 \u0111\u1ECDc k\u1EBFt qu\u1EA3 streaming.");
    const s = n.body.getReader(), r = new TextDecoder();
    let o = "";
    for (; ; ) {
      const { value: d, done: a } = await s.read();
      o += r.decode(d || new Uint8Array(), { stream: !a });
      const c = o.split(`
`);
      o = c.pop() || "";
      for (const h of c) {
        if (!h.trim()) continue;
        const m = JSON.parse(h);
        if (m.type === "error") throw new Error(m.error);
        yield m;
      }
      if (a) break;
    }
    if (o.trim()) {
      const d = JSON.parse(o);
      if (d.type === "error") throw new Error(d.error);
      yield d;
    }
  }
  indexBroll({ imageDataUrl: t, clipId: e, filename: i, durationSec: n, guidance: s }) {
    return this.request("/api/index-broll", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageDataUrl: t, clipId: e, filename: i, durationSec: n, guidance: s }) });
  }
  segment(t, e = "") {
    return this.request("/api/segment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcripts: t, guidance: e }) });
  }
  summarize(t, e = {}) {
    return this.request("/api/summarize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcripts: t, ...e }) });
  }
  generateMetadata(t, e = {}) {
    return this.request("/api/metadata", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcripts: t, ...e }) });
  }
  checkAdCompliance(t, e = {}) {
    return this.request("/api/ad-compliance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transcripts: t, ...e }) });
  }
  saveProject(t) {
    return this.request("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) });
  }
  listProjects() {
    return this.request("/api/projects");
  }
  getProject(t) {
    return this.request(`/api/projects/${encodeURIComponent(t)}`);
  }
  deleteProject(t) {
    return this.request(`/api/projects/${encodeURIComponent(t)}`, { method: "DELETE" });
  }
}
const E = (S) => String(S ?? "").replace(/[&<>"']/g, (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[t]);
class Jt {
  metadataOptions = { language: "auto", tone: "professional", customTone: "" };
  metadataResult = { title: "", description: "", hashtags: [] };
  metadataModel = "";
  adCheckResult = null;
  adCheckModel = "";
  settingsData = { language: "vi", normalizeAudio: true, manualGainDb: 0, requestTimeoutSec: 300, whisperModel: "small", geminiModel: "gemini-3.6-flash", maxOutputTokens: 8192, batchDurationSec: 600 };
  whisperModels = [];
  constructor() {
    var t;
    this.isDemoMode = false, this.brollLibrary = [], this.matchedPositions = [], this.currentProjectName = "D\u1EF1 \xE1n m\u1EDBi", this.totalDurationSec = 0, this.currentTimeSec = 0, this.isPlaying = false, this.playbackInterval = null, this.pixelsPerSec = 2.4, this.waveformPeaks = null, this.activeArollFile = null, this.currentPlayingBrollId = null, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.savedProjectId = null, this.summaryOptions = { type: "brief", language: "auto", tone: "professional", customTone: "" }, this.summaryResult = "", this.summaryModel = "", this.api = new Kt(), this.currentView = "transcript", this.cutReviewed = false, this.transcripts = [], this.silenceCuts = [], this.chapters = [], this.silenceThreshold = 0.6, this.silencePadding = 0.15, this.detectFillers = true, this.matcher = new zt({ minDuration: 3, maxDuration: 12, segmentLength: 16, coverageRatio: 0.7, introHoldSec: 3, only16_9: true, placementGuidance: ((t = document.getElementById("txt-placement-guidance")) == null ? void 0 : t.value) || "" }), this.exporter = new F(this.currentProjectName, 30), this.initElements(), this.bindEvents(), this.renderAll(), this.switchView("transcript", { force: true }), this.loadSettingsPage();
  }
  initElements() {
    this.btnProjectSelector = document.getElementById("btn-project-selector"), this.projectDropdownMenu = document.getElementById("project-dropdown-menu"), this.itemNewProject = document.getElementById("item-new-project"), this.itemLoadSampleReview = document.getElementById("item-load-sample-review"), this.projNameEl = document.getElementById("proj-name"), this.projSubEl = document.getElementById("proj-sub"), this.labelCurrentProject = document.getElementById("label-current-project"), this.mainVideoPlayer = document.getElementById("main-video-player"), this.transcriptVideoPlayer = document.getElementById("transcript-video-player"), this.mainPlayerImage = document.getElementById("main-player-image"), this.emptyDropzone = document.getElementById("empty-dropzone"), this.btnDropzoneUpload = document.getElementById("btn-dropzone-upload"), this.brollOverlayVideo = document.getElementById("broll-overlay-video"), this.brollOverlayImg = document.getElementById("broll-overlay-img"), this.activeBrollOverlay = document.getElementById("active-broll-overlay"), this.brollOverlayLabel = document.getElementById("broll-overlay-label"), this.cardFootThumbEmpty = document.getElementById("card-foot-thumb-empty"), this.cardFootThumb = document.getElementById("card-foot-thumb"), this.inputArollFile = document.getElementById("input-aroll-file"), this.inputBrollFiles = document.getElementById("input-broll-files"), this.btnUploadAroll = document.getElementById("btn-upload-aroll"), this.btnUploadBroll = document.getElementById("btn-upload-broll"), this.dragDropOverlay = document.getElementById("drag-drop-overlay"), this.arollListContainer = document.getElementById("aroll-list-container"), this.arollSummaryText = document.getElementById("aroll-summary-text"), this.brollGridEl = document.getElementById("broll-grid"), this.matchedListEl = document.getElementById("matched-cards-container"), this.brollCountTitleEl = document.getElementById("broll-count-title"), this.matchedCountTitleEl = document.getElementById("matched-count-title"), this.badgeDiffRatio = document.getElementById("badge-diff-ratio"), this.trackBrollRowEl = document.getElementById("track-broll-row"), this.trackArollFilmstripEl = document.getElementById("track-aroll-filmstrip"), this.trackAudioWaveformEl = document.getElementById("track-audio-waveform"), this.waveformCanvas = document.getElementById("waveform-canvas"), this.rulerCanvas = document.getElementById("ruler-canvas"), this.playheadLine = document.getElementById("playhead-line"), this.playheadHandle = document.getElementById("playhead-handle"), this.playheadTooltip = document.getElementById("playhead-tooltip"), this.tooltipPreviewImg = document.getElementById("tooltip-preview-img"), this.timecodeDisplay = document.getElementById("player-timecode"), this.btnPlayPause = document.getElementById("btn-play-pause"), this.btnFitFrame = document.getElementById("btn-fit-frame"), this.playerSpeedSelect = document.getElementById("player-speed-select"), this.timelineTracksScroll = document.getElementById("timeline-tracks-scroll"), this.timelineWrapper = document.getElementById("timeline-canvas-wrapper"), this.sliderMinDuration = document.getElementById("slider-min-duration"), this.sliderMaxDuration = document.getElementById("slider-max-duration"), this.sliderSegmentLen = document.getElementById("slider-segment-len"), this.sliderCoverage = document.getElementById("slider-coverage"), this.sliderIntroHold = document.getElementById("slider-intro-hold"), this.chkOnly169 = document.getElementById("chk-only-16-9"), this.txtPlacement = document.getElementById("txt-placement-guidance"), this.btnRematch = document.getElementById("btn-rematch"), this.btnRematchText = document.getElementById("btn-rematch-text"), this.brollSearchInput = document.getElementById("broll-search-input"), this.zoomSlider = document.getElementById("timeline-zoom-slider"), this.exportModal = document.getElementById("export-modal"), this.stepExport = document.getElementById("step-export"), this.btnHeaderExport = document.getElementById("btn-header-export"), this.btnCloseModal = document.getElementById("btn-close-modal"), this.btnModalCancel = document.getElementById("btn-modal-cancel"), this.xmlPreviewCode = document.getElementById("xml-preview-code"), this.apiKeyModal = document.getElementById("api-key-modal"), this.btnApiKey = document.getElementById("btn-api-key"), this.btnCloseApiModal = document.getElementById("btn-close-api-modal"), this.btnCancelApiKey = document.getElementById("btn-cancel-api-key"), this.btnSaveApiKey = document.getElementById("btn-save-api-key"), this.inputGeminiKey = document.getElementById("input-gemini-key"), this.processingBanner = document.getElementById("transcript-processing-banner"), this.processingStatus = document.getElementById("transcript-processing-status"), this.processingDetail = document.getElementById("transcript-processing-detail"), this.processingProgress = document.getElementById("transcript-processing-progress"), this.savedTranscriptsView = document.getElementById("view-saved-transcripts"), this.savedProjectsList = document.getElementById("saved-projects-list"), this.summaryResultContent = document.getElementById("summary-result-content"), this.summaryResultTitle = document.getElementById("summary-result-title"), this.summaryResultMeta = document.getElementById("summary-result-meta"), this.summaryStatusIcon = document.getElementById("summary-status-icon"), this.summaryCustomToneWrap = document.getElementById("summary-custom-tone-wrap"), this.summaryCustomToneInput = document.getElementById("summary-custom-tone"), this.views = { transcript: document.getElementById("view-transcript"), cut: document.getElementById("view-cut"), segment: document.getElementById("view-segment"), broll: document.getElementById("view-broll"), summary: document.getElementById("view-summary"), export: document.getElementById("view-export") }, this.pills = { transcript: document.getElementById("step-transcript"), cut: document.getElementById("step-cut"), segment: document.getElementById("step-segment"), broll: document.getElementById("step-broll"), export: document.getElementById("step-export") }, this.sidebarNav = { smartEdit: document.getElementById("nav-smart-edit"), transcript: document.getElementById("nav-transcript"), transcriptView: document.getElementById("nav-transcript-view"), chapters: document.getElementById("nav-chapters"), summary: document.getElementById("nav-summary"), autoCut: document.getElementById("nav-auto-cut"), exportMenu: document.getElementById("nav-export-menu") }, this.api.health().then((t) => {
      this.btnApiKey && (this.btnApiKey.title = t.geminiConfigured ? "Gemini \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5u h\xECnh trong AI engine" : "C\u1EA5u h\xECnh Gemini API Key");
    }).catch(() => {
    });
    this.metadataCustomToneWrap = document.getElementById("metadata-custom-tone-wrap");
    this.metadataCustomToneInput = document.getElementById("metadata-custom-tone");
    this.metadataTitleOutput = document.getElementById("metadata-title-output");
    this.metadataDescriptionOutput = document.getElementById("metadata-description-output");
    this.metadataHashtagsOutput = document.getElementById("metadata-hashtags-output");
    this.metadataStatusIcon = document.getElementById("metadata-status-icon");
    this.metadataResultMeta = document.getElementById("metadata-result-meta");
    this.views.metadata = document.getElementById("view-metadata");
    this.sidebarNav.metadata = document.getElementById("nav-metadata");
    this.adReportStatusIcon = document.getElementById("ad-report-status-icon");
    this.adReportTitle = document.getElementById("ad-report-title");
    this.adReportMeta = document.getElementById("ad-report-meta");
    this.adReportSummary = document.getElementById("ad-report-summary");
    this.adFindingsList = document.getElementById("ad-findings-list");
    this.adRecommendations = document.getElementById("ad-recommendations");
    this.adRecommendationsList = document.getElementById("ad-recommendations-list");
    this.views.adCheck = document.getElementById("view-ad-check");
    this.sidebarNav.adCheck = document.getElementById("nav-ad-check");
    this.views.settings = document.getElementById("view-settings");
    this.sidebarNav.settings = document.getElementById("nav-settings");
    this.settingsSaveState = document.getElementById("settings-save-state");
    this.whisperModelList = document.getElementById("whisper-model-list");
    this.geminiServiceStatus = document.getElementById("gemini-service-status");
    this.geminiStatusDot = document.getElementById("gemini-status-dot");
  }
  bindEvents() {
    this.sidebarNav.adCheck?.addEventListener("click", () => this.switchView("adCheck"));
    document.getElementById("btn-run-ad-check")?.addEventListener("click", () => this.handleRunAdCheck());
    document.getElementById("btn-rerun-ad-check")?.addEventListener("click", () => this.handleRunAdCheck());
    document.getElementById("btn-copy-ad-report")?.addEventListener("click", () => this.copyAdReport());
    this.sidebarNav.settings?.addEventListener("click", () => this.switchView("settings"));
    document.querySelectorAll("[data-settings-tab]").forEach((button) => button.addEventListener("click", () => this.selectSettingsTab(button.dataset.settingsTab)));
    ["setting-language", "setting-normalize-audio", "setting-timeout", "setting-gemini-model", "setting-max-tokens", "setting-batch-duration"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", () => this.saveSettingsFromForm());
    });
    document.getElementById("setting-gain-minus")?.addEventListener("click", () => this.changeManualGain(-1));
    document.getElementById("setting-gain-plus")?.addEventListener("click", () => this.changeManualGain(1));
    document.getElementById("model-search")?.addEventListener("input", () => this.renderWhisperModels());
    document.getElementById("toggle-settings-key")?.addEventListener("click", () => this.toggleSettingsKey());
    document.getElementById("save-settings-key")?.addEventListener("click", () => this.saveSettingsGeminiKey());
    this.sidebarNav.metadata?.addEventListener("click", () => this.switchView("metadata"));
    document.querySelectorAll("[data-metadata-group] button").forEach((button) => {
      button.addEventListener("click", () => {
        const group = button.closest("[data-metadata-group]")?.dataset.metadataGroup;
        if (group) this.selectMetadataOption(group, button.dataset.value);
      });
    });
    this.metadataCustomToneInput?.addEventListener("input", (event) => {
      this.metadataOptions.customTone = event.target.value;
    });
    document.getElementById("btn-generate-metadata")?.addEventListener("click", () => this.handleGenerateMetadata());
    document.getElementById("btn-regenerate-metadata")?.addEventListener("click", () => this.handleGenerateMetadata());
    document.getElementById("btn-copy-all-metadata")?.addEventListener("click", () => this.copyAllMetadata());
    document.querySelectorAll("[data-copy-metadata]").forEach((button) => {
      button.addEventListener("click", () => this.copyMetadataField(button.dataset.copyMetadata, button));
    });
    var r, o, d, a, c, h, m, u, g, f, x, P, v, T, p, b, I, k, w, R, A, L, j, M, D, O, N, H, _, U, W, q, G, X, z, K, J, Y, Z, Q, tt, et, it, nt, st, rt, at, ot, ct, lt, dt, ht, mt, ut, pt, gt, yt, vt, ft, bt, St, xt, wt, Et, Ct, Tt, Pt, Lt, It, kt, Bt, Mt, $t, Rt, At, jt, Dt, Ft, Vt, Ot;
    (r = this.btnPlayPause) == null || r.addEventListener("click", () => this.togglePlay()), window.addEventListener("keydown", (l) => {
      l.code === "Space" && l.target.tagName !== "TEXTAREA" && l.target.tagName !== "INPUT" && (l.preventDefault(), this.togglePlay());
    }), (o = this.playerSpeedSelect) == null || o.addEventListener("change", (l) => {
      const y = parseFloat(l.target.value);
      this.mainVideoPlayer.playbackRate = y, this.brollOverlayVideo.playbackRate = y;
    }), (d = this.mainVideoPlayer) == null || d.addEventListener("timeupdate", () => {
      this.mainVideoPlayer.paused || (this.syncTime(this.mainVideoPlayer.currentTime), this.activeTranscriptEndSec !== null && this.mainVideoPlayer.currentTime >= this.activeTranscriptEndSec && (this.mainVideoPlayer.pause(), this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon(), this.currentView === "transcript" && this.renderTranscriptView()));
    }), (a = this.transcriptVideoPlayer) == null || a.addEventListener("timeupdate", () => {
      this.transcriptVideoPlayer.paused || (this.syncTime(this.transcriptVideoPlayer.currentTime), this.activeTranscriptEndSec !== null && this.transcriptVideoPlayer.currentTime >= this.activeTranscriptEndSec && (this.transcriptVideoPlayer.pause(), this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon(), this.renderTranscriptView()));
    }), (c = this.mainVideoPlayer) == null || c.addEventListener("ended", () => {
      this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon();
    }), (h = this.transcriptVideoPlayer) == null || h.addEventListener("ended", () => {
      this.isPlaying = false, this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.updatePlayPauseIcon();
    }), (m = this.transcriptVideoPlayer) == null || m.addEventListener("play", () => {
      this.isPlaying = true, this.updatePlayPauseIcon();
    }), (u = this.transcriptVideoPlayer) == null || u.addEventListener("pause", () => {
      this.isPlaying = false, this.updatePlayPauseIcon();
    });
    let t = false;
    const e = (l) => {
      if (!this.timelineWrapper) return;
      const y = this.timelineWrapper.getBoundingClientRect(), C = Math.max(0, l.clientX - y.left), B = Math.min(this.totalDurationSec, Math.max(0, C / this.pixelsPerSec));
      this.seekTo(B);
    };
    (g = this.playheadHandle) == null || g.addEventListener("mousedown", (l) => {
      t = true, l.stopPropagation();
    }), (f = this.timelineWrapper) == null || f.addEventListener("click", (l) => {
      t || e(l);
    }), window.addEventListener("mousemove", (l) => {
      t && e(l);
    }), window.addEventListener("mouseup", () => {
      t = false;
    }), (x = this.sliderMinDuration) == null || x.addEventListener("input", (l) => {
      document.getElementById("val-min-duration").textContent = `${parseFloat(l.target.value).toFixed(1)}s`;
    }), (P = this.sliderMaxDuration) == null || P.addEventListener("input", (l) => {
      document.getElementById("val-max-duration").textContent = `${parseFloat(l.target.value).toFixed(1)}s`;
    }), (v = this.sliderSegmentLen) == null || v.addEventListener("input", (l) => {
      document.getElementById("val-segment-len").textContent = `${l.target.value}s`;
    }), (T = this.sliderCoverage) == null || T.addEventListener("input", (l) => {
      document.getElementById("val-coverage").textContent = `${l.target.value}%`;
    }), (p = this.sliderIntroHold) == null || p.addEventListener("input", (l) => {
      document.getElementById("val-intro-hold").textContent = `${l.target.value}s`;
    }), (b = this.chkOnly169) == null || b.addEventListener("change", () => this.handleRematch()), (I = this.btnRematch) == null || I.addEventListener("click", () => this.handleRematch()), (k = this.brollSearchInput) == null || k.addEventListener("input", (l) => {
      const y = l.target.value.toLowerCase().trim(), C = this.brollLibrary.filter((B) => {
        var Nt;
        return B.id.toLowerCase().includes(y) || ((Nt = B.name) == null ? void 0 : Nt.toLowerCase().includes(y)) || B.description.toLowerCase().includes(y) || B.tags && B.tags.some((Xt) => Xt.toLowerCase().includes(y));
      });
      this.renderBrollGrid(C);
    }), (w = this.zoomSlider) == null || w.addEventListener("input", (l) => {
      const y = parseInt(l.target.value);
      this.pixelsPerSec = y / 100 * 4, this.updateTimelineWidth(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler();
    }), (R = this.btnFitFrame) == null || R.addEventListener("click", () => this.fitTimelineToFrame()), (A = this.btnProjectSelector) == null || A.addEventListener("click", (l) => {
      if (l.stopPropagation(), !this.projectDropdownMenu) return;
      const y = this.projectDropdownMenu.style.display === "flex";
      this.projectDropdownMenu.style.display = y ? "none" : "flex";
    }), document.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none");
    }), (L = this.itemNewProject) == null || L.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none"), this.resetToNewProject();
    }), (j = this.itemLoadSampleReview) == null || j.addEventListener("click", () => {
      this.projectDropdownMenu && (this.projectDropdownMenu.style.display = "none"), this.switchToOnlineSampleMode();
    }), (M = this.btnUploadAroll) == null || M.addEventListener("click", () => this.inputArollFile.click()), (D = this.btnUploadBroll) == null || D.addEventListener("click", () => this.inputBrollFiles.click()), (O = this.btnDropzoneUpload) == null || O.addEventListener("click", (l) => {
      l.stopPropagation(), this.inputArollFile.click();
    }), (N = this.emptyDropzone) == null || N.addEventListener("click", () => this.inputArollFile.click()), (H = this.inputArollFile) == null || H.addEventListener("change", async (l) => {
      const y = l.target.files[0];
      y && await this.handleLoadAroll(y);
    }), (_ = this.inputBrollFiles) == null || _.addEventListener("change", async (l) => {
      const y = Array.from(l.target.files);
      y.length > 0 && await this.handleLoadBrolls(y);
    });
    let i = 0;
    window.addEventListener("dragenter", (l) => {
      var y;
      l.preventDefault(), i++, (y = this.dragDropOverlay) == null || y.classList.add("active");
    }), window.addEventListener("dragleave", (l) => {
      var y;
      l.preventDefault(), i--, i <= 0 && (i = 0, (y = this.dragDropOverlay) == null || y.classList.remove("active"));
    }), window.addEventListener("dragover", (l) => l.preventDefault()), window.addEventListener("drop", async (l) => {
      var C;
      l.preventDefault(), i = 0, (C = this.dragDropOverlay) == null || C.classList.remove("active");
      const y = Array.from(l.dataTransfer.files).filter((B) => B.type.startsWith("video/"));
      y.length !== 0 && (y.length === 1 && !this.activeArollFile ? await this.handleLoadAroll(y[0]) : await this.handleLoadBrolls(y));
    });
    const n = () => {
      var l;
      this.updateXmlPreview(), (l = this.exportModal) == null || l.classList.add("active");
    }, s = () => {
      var l;
      return (l = this.exportModal) == null ? void 0 : l.classList.remove("active");
    };
    (U = this.btnHeaderExport) == null || U.addEventListener("click", n), (W = this.btnCloseModal) == null || W.addEventListener("click", s), (q = this.btnModalCancel) == null || q.addEventListener("click", s), (G = document.getElementById("btn-export-fcpxml")) == null || G.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generateFCPXML(this.matchedPositions, l, this.totalDurationSec);
      this.exporter.downloadFile(`${this.currentProjectName}_Broll.fcpxml`, y, "application/xml");
    }), (X = document.getElementById("btn-export-premiere")) == null || X.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generatePremiereXML(this.matchedPositions, l, this.totalDurationSec);
      this.exporter.downloadFile(`${this.currentProjectName}_Premiere.xml`, y, "application/xml");
    }), (z = document.getElementById("btn-export-davinci")) == null || z.addEventListener("click", () => {
      var C;
      const l = ((C = this.activeArollFile) == null ? void 0 : C.name) || "C4095.mov", y = this.exporter.generateFCPXML(this.matchedPositions, l, this.totalDurationSec);
      this.exporter.downloadFile(`${this.currentProjectName}_DaVinci.fcpxml`, y, "application/xml");
    }), (K = document.getElementById("btn-export-json")) == null || K.addEventListener("click", () => {
      const l = JSON.stringify({ project: this.currentProjectName, totalDurationSec: this.totalDurationSec, matchedCount: this.matchedPositions.length, placements: this.matchedPositions }, null, 2);
      this.exporter.downloadFile("broll_metadata.json", l, "application/json");
    }), (J = this.btnApiKey) == null || J.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.add("active");
    }), (Y = this.btnCloseApiModal) == null || Y.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.remove("active");
    }), (Z = this.btnCancelApiKey) == null || Z.addEventListener("click", () => {
      var l;
      return (l = this.apiKeyModal) == null ? void 0 : l.classList.remove("active");
    }), (Q = this.btnSaveApiKey) == null || Q.addEventListener("click", async () => {
      var y, C;
      const l = (y = this.inputGeminiKey) == null ? void 0 : y.value.trim();
      try {
        await this.api.setGeminiKey(l || ""), this.inputGeminiKey && (this.inputGeminiKey.value = ""), alert(l ? "Gemini API Key \u0111\xE3 \u0111\u01B0\u1EE3c n\u1EA1p v\xE0o AI engine c\u1EE5c b\u1ED9." : "\u0110\xE3 x\xF3a Gemini API Key kh\u1ECFi AI engine."), (C = this.apiKeyModal) == null || C.classList.remove("active");
      } catch (B) {
        alert(B.message);
      }
    }), (tt = document.getElementById("btn-accept-all")) == null || tt.addEventListener("click", () => {
      alert(`\u0110\xE3 ch\u1EA5p nh\u1EADn to\xE0n b\u1ED9 ${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n B-roll s\u1EB5n s\xE0ng xu\u1EA5t timeline!`), this.matchedPositions.length && this.switchView("export");
    }), (et = this.pills.transcript) == null || et.addEventListener("click", () => this.switchView("transcript")), (it = this.pills.cut) == null || it.addEventListener("click", () => this.switchView("cut")), (nt = this.pills.segment) == null || nt.addEventListener("click", () => this.switchView("segment")), (st = this.pills.broll) == null || st.addEventListener("click", () => this.switchView("broll")), (rt = this.pills.export) == null || rt.addEventListener("click", () => this.switchView("export")), (at = this.sidebarNav.smartEdit) == null || at.addEventListener("click", () => this.switchView("broll")), (ot = this.sidebarNav.transcript) == null || ot.addEventListener("click", () => this.switchView("transcript")), (ct = this.sidebarNav.transcriptView) == null || ct.addEventListener("click", () => this.openSavedProjects()), (lt = this.sidebarNav.chapters) == null || lt.addEventListener("click", () => this.switchView("segment")), (dt = this.sidebarNav.summary) == null || dt.addEventListener("click", () => this.switchView("summary")), (ht = this.sidebarNav.autoCut) == null || ht.addEventListener("click", () => this.switchView("cut")), (mt = this.sidebarNav.exportMenu) == null || mt.addEventListener("click", () => this.switchView("export")), (ut = document.getElementById("btn-back-to-broll")) == null || ut.addEventListener("click", () => this.switchView("broll")), (pt = document.getElementById("input-transcript-search")) == null || pt.addEventListener("input", (l) => {
      this.renderTranscriptView(l.target.value.toLowerCase().trim());
    }), (gt = document.getElementById("btn-run-asr-ai")) == null || gt.addEventListener("click", () => this.handleRunAsrAi()), (yt = document.getElementById("btn-transcript-upload-aroll")) == null || yt.addEventListener("click", () => {
      var l;
      return (l = this.inputArollFile) == null ? void 0 : l.click();
    }), (vt = document.getElementById("btn-import-srt")) == null || vt.addEventListener("click", () => {
      var l;
      (l = document.getElementById("file-srt-input")) == null || l.click();
    }), (ft = document.getElementById("file-srt-input")) == null || ft.addEventListener("change", (l) => this.handleImportSrt(l)), (bt = document.getElementById("btn-export-srt-file")) == null || bt.addEventListener("click", () => this.handleExportSrt()), (St = document.getElementById("btn-save-transcript")) == null || St.addEventListener("click", () => this.handleSaveProject()), (xt = document.getElementById("btn-back-from-saved-transcripts")) == null || xt.addEventListener("click", () => this.closeSavedProjects()), (wt = document.getElementById("btn-refresh-saved-transcripts")) == null || wt.addEventListener("click", () => this.openSavedProjects()), document.querySelectorAll(".btn-go-transcript-empty").forEach((l) => {
      l.addEventListener("click", () => this.switchView("transcript", { force: true }));
    }), document.querySelectorAll("[data-summary-group] button").forEach((l) => {
      l.addEventListener("click", () => {
        var C;
        const y = (C = l.closest("[data-summary-group]")) == null ? void 0 : C.dataset.summaryGroup;
        y && this.selectSummaryOption(y, l.dataset.value);
      });
    }), (Et = this.summaryCustomToneInput) == null || Et.addEventListener("input", (l) => {
      this.summaryOptions.customTone = l.target.value;
    }), (Ct = document.getElementById("btn-generate-summary")) == null || Ct.addEventListener("click", () => this.handleGenerateSummary()), (Tt = document.getElementById("btn-copy-summary")) == null || Tt.addEventListener("click", () => this.copySummary()), (Pt = document.getElementById("btn-transcript-play")) == null || Pt.addEventListener("click", () => this.togglePlay()), (Lt = document.getElementById("slider-silence-thresh")) == null || Lt.addEventListener("input", (l) => {
      this.silenceThreshold = parseFloat(l.target.value);
      const y = document.getElementById("label-silence-thresh");
      y && (y.textContent = `${this.silenceThreshold.toFixed(1)}s`), this.refreshSilenceCuts();
    }), (It = document.getElementById("slider-padding-thresh")) == null || It.addEventListener("input", (l) => {
      this.silencePadding = parseFloat(l.target.value);
      const y = document.getElementById("label-padding-thresh");
      y && (y.textContent = `${this.silencePadding.toFixed(2)}s`), this.refreshSilenceCuts();
    }), (kt = document.getElementById("chk-detect-fillers")) == null || kt.addEventListener("change", (l) => {
      this.detectFillers = l.target.checked, this.renderCutView();
    }), (Bt = document.getElementById("btn-execute-auto-cut")) == null || Bt.addEventListener("click", () => this.handleExecuteAutoCut()), (Mt = document.getElementById("btn-reset-all-cuts")) == null || Mt.addEventListener("click", () => this.handleResetAllCuts()), ($t = document.getElementById("chk-toggle-all-cuts")) == null || $t.addEventListener("change", (l) => this.handleToggleAllCuts(l.target.checked)), (Rt = document.getElementById("btn-ai-auto-segment")) == null || Rt.addEventListener("click", () => this.handleAiAutoSegment()), (At = document.getElementById("btn-add-custom-chapter")) == null || At.addEventListener("click", () => this.handleAddCustomChapter()), (jt = document.getElementById("btn-export-fcpxml-dash")) == null || jt.addEventListener("click", () => this.exportFCPXML()), (Dt = document.getElementById("btn-export-premiere-dash")) == null || Dt.addEventListener("click", () => this.exportPremiereXML()), (Ft = document.getElementById("btn-export-davinci-dash")) == null || Ft.addEventListener("click", () => this.exportDaVinciXML()), (Vt = document.getElementById("btn-export-srt-dash")) == null || Vt.addEventListener("click", () => this.handleExportSrt()), (Ot = document.getElementById("btn-copy-xml-code")) == null || Ot.addEventListener("click", () => this.handleCopyXml()), window.addEventListener("resize", () => {
      this.drawWaveform(), this.drawRuler();
    });
  }
  getWorkflowState() {
    return { transcript: this.transcripts.length > 0, cut: this.cutReviewed, segment: this.chapters.length > 0, broll: this.matchedPositions.length > 0, export: false };
  }
  canOpenWorkflowStep(t) {
    return { transcript: true, cut: true, segment: true, broll: true, summary: true, metadata: true, adCheck: true, settings: true, export: this.getWorkflowState().broll }[t] ?? false;
  }
  workflowBlockMessage(t) {
    return { cut: "H\xE3y n\u1EA1p A-Roll v\xE0 ho\xE0n th\xE0nh B\u1EA3n ghi l\u1EDDi tr\u01B0\u1EDBc.", segment: "H\xE3y ho\xE0n th\xE0nh b\u01B0\u1EDBc C\u1EAFt tr\u01B0\u1EDBc khi ph\xE2n \u0111o\u1EA1n.", broll: "H\xE3y t\u1EA1o \xEDt nh\u1EA5t m\u1ED9t ph\xE2n \u0111o\u1EA1n n\u1ED9i dung tr\u01B0\u1EDBc khi gh\xE9p B-Roll.", export: "Ch\u01B0a c\xF3 v\u1ECB tr\xED B-Roll n\xE0o \u0111\u1EC3 xu\u1EA5t." }[t] || "";
  }
  updateWorkflowUI() {
    Object.entries(this.pills).forEach(([t, e]) => {
      if (!e) return;
      const i = this.canOpenWorkflowStep(t);
      e.classList.toggle("locked", !i), e.setAttribute("aria-disabled", String(!i)), i || (e.title = this.workflowBlockMessage(t));
    });
  }
  hasLoadedAroll() {
    var t, e;
    return !!(this.isDemoMode || (t = this.activeArollFile) != null && t.file || (e = this.activeArollFile) != null && e.url);
  }
  updatePrerequisiteEmptyStates() {
    const t = this.hasLoadedAroll();
    document.querySelectorAll("[data-requires-aroll]").forEach((i) => {
      var n;
      i.hidden = t, (n = i.closest(".workspace-view")) == null || n.classList.toggle("missing-aroll", !t);
    });
    const e = this.transcripts.length > 0;
    document.querySelectorAll("[data-requires-transcript]").forEach((i) => {
      var n;
      i.hidden = e, (n = i.closest(".workspace-view")) == null || n.classList.toggle("missing-transcript", !e);
    });
  }
  switchView(t, { force: e = false } = {}) {
    var r, o, d, a, c, h;
    if (!this.views[t]) return;
    const i = this.canOpenWorkflowStep(t);
    if (!e && !i) {
      alert(this.workflowBlockMessage(t)), this.updateWorkflowUI();
      return;
    }
    this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "none", this.savedTranscriptsView.classList.remove("active")), this.currentView = t, this.updatePrerequisiteEmptyStates();
    const n = ["transcript", "cut", "segment", "broll", "export"], s = ["summary", "metadata", "adCheck", "settings"].includes(t) ? "transcript" : t;
    n.forEach((m, u) => {
      const g = this.pills[m];
      g && (g.classList.remove("active"), g.classList.remove("completed"), m === s ? g.classList.add("active") : this.getWorkflowState()[m] && g.classList.add("completed"));
    }), Object.keys(this.views).forEach((m) => {
      const u = this.views[m];
      u && (m === t ? (u.style.display = "flex", u.classList.add("active")) : (u.style.display = "none", u.classList.remove("active")));
    }), document.querySelectorAll(".sidebar-nav .nav-item").forEach((m) => m.classList.remove("active")), t === "broll" ? (r = this.sidebarNav.smartEdit) == null || r.classList.add("active") : t === "transcript" ? (o = this.sidebarNav.transcript) == null || o.classList.add("active") : t === "segment" ? (d = this.sidebarNav.chapters) == null || d.classList.add("active") : t === "summary" ? (a = this.sidebarNav.summary) == null || a.classList.add("active") : t === "cut" ? (c = this.sidebarNav.autoCut) == null || c.classList.add("active") : t === "export" && ((h = this.sidebarNav.exportMenu) == null || h.classList.add("active")), t === "transcript" ? this.renderTranscriptView() : t === "cut" ? this.renderCutView() : t === "segment" ? this.renderSegmentView() : t === "summary" ? this.renderSummaryView() : t === "broll" ? (this.updateTimelineWidth(), this.drawWaveform(), this.drawRuler(), this.renderTimelineBrollBlocks()) : t === "export" && this.renderExportView(), this.updateWorkflowUI();
    if (t === "metadata") {
      this.sidebarNav.metadata?.classList.add("active");
      this.renderMetadataView();
    }
    if (t === "adCheck") {
      this.sidebarNav.adCheck?.classList.add("active");
      this.renderAdCheckView();
    }
    if (t === "settings") {
      this.sidebarNav.settings?.classList.add("active");
      this.loadSettingsPage();
    }
  }
  showProcessing(t, e = "", i = null) {
    if (this.processingBanner && (this.processingBanner.hidden = false, this.processingStatus && (this.processingStatus.textContent = t), this.processingDetail && (this.processingDetail.textContent = e), this.processingProgress)) {
      const n = Number.isFinite(i);
      this.processingProgress.classList.toggle("indeterminate", !n), n && (this.processingProgress.style.width = `${Math.max(2, Math.min(100, i))}%`);
    }
  }
  hideProcessing() {
    this.processingBanner && (this.processingBanner.hidden = true);
  }
  projectSnapshot() {
    const t = this.activeArollFile;
    return { id: this.savedProjectId, name: this.currentProjectName, mediaName: (t == null ? void 0 : t.name) || "", durationSec: this.totalDurationSec, media: t ? { name: t.name, durationSec: t.durationSec, width: t.width, height: t.height, aspectRatio: t.aspectRatio, sizeMb: t.sizeMb, thumb: typeof t.thumb == "string" && t.thumb.startsWith("data:") ? t.thumb : null } : null, transcripts: this.transcripts, silenceCuts: this.silenceCuts, chapters: this.chapters, matchedPositions: this.matchedPositions, summary: this.summaryResult ? { content: this.summaryResult, model: this.summaryModel, options: this.summaryOptions } : null, brollLibrary: this.brollLibrary.map(({ file: e, videoUrl: i, ...n }) => n), cutReviewed: this.cutReviewed, settings: { silenceThreshold: this.silenceThreshold, silencePadding: this.silencePadding, detectFillers: this.detectFillers } };
  }
  async handleSaveProject() {
    if (!this.transcripts.length) {
      alert("Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi \u0111\u1EC3 l\u01B0u. H\xE3y ch\u1EA1y Whisper ho\u1EB7c nh\u1EADp SRT tr\u01B0\u1EDBc.");
      return;
    }
    const t = document.getElementById("btn-save-transcript"), e = t == null ? void 0 : t.innerHTML;
    t && (t.disabled = true, t.textContent = "\u0110ang l\u01B0u...");
    try {
      const i = await this.api.saveProject(this.projectSnapshot());
      this.savedProjectId = i.id, alert("\u0110\xE3 l\u01B0u b\u1EA3n ghi l\u1EDDi v\xE0o SQLite tr\xEAn m\xE1y.");
    } catch (i) {
      alert(i.message);
    } finally {
      t && (t.disabled = false, t.innerHTML = e);
    }
  }
  async openSavedProjects() {
    var t, e, i;
    Object.values(this.views).forEach((n) => {
      n && (n.style.display = "none", n.classList.remove("active"));
    }), this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "flex", this.savedTranscriptsView.classList.add("active")), this.currentView = "saved-transcripts", Object.values(this.pills).forEach((n) => n == null ? void 0 : n.classList.remove("active")), (t = this.pills.transcript) == null || t.classList.remove("completed"), (e = this.pills.transcript) == null || e.classList.add("active"), document.querySelectorAll(".sidebar-nav .nav-item").forEach((n) => n.classList.remove("active")), (i = this.sidebarNav.transcriptView) == null || i.classList.add("active"), this.savedProjectsList && (this.savedProjectsList.innerHTML = '<div class="saved-projects-empty">\u0110ang \u0111\u1ECDc d\u1EEF li\u1EC7u SQLite...</div>');
    try {
      const n = await this.api.listProjects();
      this.renderSavedProjects(n.projects || []);
    } catch (n) {
      this.savedProjectsList && (this.savedProjectsList.innerHTML = `<div class="saved-projects-empty">${E(n.message)}</div>`);
    }
  }
  closeSavedProjects({ restore: t = true } = {}) {
    var e;
    this.savedTranscriptsView && (this.savedTranscriptsView.style.display = "none", this.savedTranscriptsView.classList.remove("active")), (e = this.sidebarNav.transcriptView) == null || e.classList.remove("active"), t && this.switchView("transcript", { force: true });
  }
  renderSavedProjects(t) {
    if (this.savedProjectsList) {
      if (!t.length) {
        this.savedProjectsList.innerHTML = '<div class="saved-projects-empty">Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi n\xE0o \u0111\u01B0\u1EE3c l\u01B0u.</div>';
        return;
      }
      this.savedProjectsList.innerHTML = "", t.forEach((e) => {
        var o, d;
        const i = document.createElement("div");
        i.className = "saved-project-card";
        const n = new Date(e.updatedAt).toLocaleString("vi-VN"), s = Math.floor((e.durationSec || 0) / 60), r = Math.floor((e.durationSec || 0) % 60).toString().padStart(2, "0");
        i.innerHTML = `
        <div class="saved-project-main">
          <div class="saved-project-name">${E(e.name)}</div>
          <div class="saved-project-meta">${E(e.mediaName || "Kh\xF4ng c\xF3 media")} \xB7 ${s}:${r} \xB7 ${e.transcriptCount} c\xE2u \xB7 ${E(n)}</div>
        </div>
        <div class="saved-project-actions">
          <button class="btn-secondary-action btn-open-saved">M\u1EDF</button>
          <button class="btn-action-ghost btn-delete-saved">X\xF3a</button>
        </div>`, (o = i.querySelector(".btn-open-saved")) == null || o.addEventListener("click", () => this.loadSavedProject(e.id)), (d = i.querySelector(".btn-delete-saved")) == null || d.addEventListener("click", async () => {
          if (confirm(`X\xF3a b\u1EA3n ghi "${e.name}" kh\u1ECFi m\xE1y?`)) try {
            await this.api.deleteProject(e.id), this.savedProjectId === e.id && (this.savedProjectId = null), await this.openSavedProjects();
          } catch (a) {
            alert(a.message);
          }
        }), this.savedProjectsList.appendChild(i);
      });
    }
  }
  async loadSavedProject(t) {
    var e, i, n, s, r, o, d;
    try {
      const c = (await this.api.getProject(t)).project, h = (e = this.activeArollFile) != null && e.file && this.activeArollFile.name === c.mediaName ? this.activeArollFile : null;
      this.savedProjectId = c.id, this.currentProjectName = c.name || "D\u1EF1 \xE1n \u0111\xE3 l\u01B0u", this.totalDurationSec = Number(c.durationSec) || 0, this.transcripts = c.transcripts || [], this.silenceCuts = c.silenceCuts || [], this.chapters = c.chapters || [], this.matchedPositions = c.matchedPositions || [], this.summaryResult = ((i = c.summary) == null ? void 0 : i.content) || "", this.summaryModel = ((n = c.summary) == null ? void 0 : n.model) || "", this.summaryOptions = { ...this.summaryOptions, ...((s = c.summary) == null ? void 0 : s.options) || {} }, this.brollLibrary = c.brollLibrary || [], this.cutReviewed = !!c.cutReviewed, this.silenceThreshold = ((r = c.settings) == null ? void 0 : r.silenceThreshold) ?? this.silenceThreshold, this.silencePadding = ((o = c.settings) == null ? void 0 : o.silencePadding) ?? this.silencePadding, this.detectFillers = ((d = c.settings) == null ? void 0 : d.detectFillers) ?? this.detectFillers, this.activeArollFile = h || c.media || (c.mediaName ? { name: c.mediaName, durationSec: this.totalDurationSec } : null), this.exporter = new F(this.currentProjectName, 30), this.projNameEl.textContent = this.currentProjectName, this.projSubEl.textContent = `B\u1EA3n ghi \u0111\xE3 l\u01B0u \xB7 ${this.transcripts.length} c\xE2u`, this.labelCurrentProject.textContent = this.currentProjectName, !h && this.mainVideoPlayer && (this.mainVideoPlayer.pause(), this.mainVideoPlayer.removeAttribute("src"), this.mainVideoPlayer.load(), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.pause(), this.transcriptVideoPlayer.removeAttribute("src"), this.transcriptVideoPlayer.load(), this.transcriptVideoPlayer.style.display = "none")), this.closeSavedProjects({ restore: false }), this.renderAll(), this.switchView("transcript", { force: true }), !h && c.mediaName && alert("\u0110\xE3 m\u1EDF b\u1EA3n ghi l\u1EDDi. H\xE3y ch\u1ECDn l\u1EA1i file video n\u1EBFu mu\u1ED1n ph\xE1t \xE2m thanh ho\u1EB7c ti\u1EBFp t\u1EE5c x\u1EED l\xFD media.");
    } catch (a) {
      alert(a.message);
    }
  }
  renderTranscriptView(t = "") {
    var P;
    const e = document.getElementById("transcript-items-container");
    if (!e) return;
    e.innerHTML = "";
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60), s = `${i}:${n.toString().padStart(2, "0")}`, r = document.getElementById("transcript-total-time");
    r && (r.textContent = s);
    const o = document.getElementById("transcript-current-time");
    if (o) {
      const v = Math.floor(this.currentTimeSec / 60), T = Math.floor(this.currentTimeSec % 60);
      o.textContent = `${v}:${T.toString().padStart(2, "0")}`;
    }
    const d = document.getElementById("transcript-progress-fill");
    d && (d.style.width = this.totalDurationSec > 0 ? `${this.currentTimeSec / this.totalDurationSec * 100}%` : "0%");
    const a = this.transcriptVideoPlayer, c = document.getElementById("transcript-poster-empty"), h = document.getElementById("transcript-play-overlay");
    (P = this.activeArollFile) != null && P.url ? (a && (a.src !== this.activeArollFile.url && (a.src = this.activeArollFile.url), a.style.display = "block"), c && (c.style.display = "none"), h && (h.style.display = "none")) : (a && (a.src = "", a.style.display = "none"), c && (c.style.display = "flex"), h && (h.style.display = "none"));
    const m = this.transcripts.reduce((v, T) => v + (T.text ? T.text.trim().split(/\s+/).length : 0), 0), u = document.getElementById("metric-sentence-count"), g = document.getElementById("metric-word-count"), f = document.getElementById("metric-speech-speed");
    if (u && (u.textContent = `${this.transcripts.length} c\xE2u`), g && (g.textContent = `${m} t\u1EEB`), f) if (this.totalDurationSec > 0 && m > 0) {
      const v = Math.round(m / (this.totalDurationSec / 60));
      f.textContent = `${v} t\u1EEB / ph\xFAt (T\u1ED1i \u01B0u)`;
    } else f.textContent = "-- t\u1EEB / ph\xFAt";
    const x = this.transcripts.filter((v) => !t || v.text.toLowerCase().includes(t) || v.speaker.toLowerCase().includes(t));
    if (x.length === 0) {
      t ? e.innerHTML = `
          <div style="padding: 30px; text-align: center; color: var(--text-muted); font-size: 13px;">
            Kh\xF4ng t\xECm th\u1EA5y c\xE2u tho\u1EA1i n\xE0o kh\u1EDBp v\u1EDBi "${t}".
          </div>
        ` : e.innerHTML = `
          <div style="padding: 50px 20px; text-align: center; color: var(--text-muted); font-size: 13px; line-height: 1.8;">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><br>
            <strong style="color: var(--text-main); font-size: 14px;">Ch\u01B0a c\xF3 b\u1EA3n ghi l\u1EDDi n\xF3i cho d\u1EF1 \xE1n n\xE0y</strong><br>
            B\u1EA5m <strong>"Ch\xE9p l\u1EDDi AI (Whisper)"</strong> \u0111\u1EC3 t\u1EF1 \u0111\u1ED9ng b\xF3c b\u0103ng t\u1EEB \xE2m thanh video ho\u1EB7c b\u1EA5m <strong>"Nh\u1EADp .SRT"</strong> \u0111\u1EC3 n\u1EA1p file ph\u1EE5 \u0111\u1EC1 c\xF3 s\u1EB5n.
          </div>
        `;
      return;
    }
    x.forEach((v) => {
      var R, A;
      const T = this.currentTimeSec >= v.startSec && this.currentTimeSec <= v.endSec, p = document.createElement("div");
      p.className = `transcript-row-card ${T ? "highlighted" : ""}`, p.id = `ts-row-${v.id}`, p.innerHTML = `
        <span class="transcript-time-badge" title="B\u1EA5m \u0111\u1EC3 ph\xE1t t\u1EEB m\u1ED1c n\xE0y">[${E(v.startTime)} - ${E(v.endTime)}]</span>
        <span class="transcript-speaker-badge">${E(v.speaker)}</span>
        <div class="transcript-content-col">
          <input type="text" class="transcript-text-input" value="${E(v.text)}" data-id="${E(v.id)}" title="Nh\u1EA5p \u0111\u1EC3 s\u1EEDa tr\u1EF1c ti\u1EBFp c\xE2u tho\u1EA1i">
        </div>
        <div class="transcript-actions-col">
          <button class="btn-icon-tiny btn-ts-play" title="${this.activeTranscriptId === v.id && this.isPlaying ? "D\u1EEBng c\xE2u n\xE0y" : "Nghe c\xE2u n\xE0y"}">
            ${this.activeTranscriptId === v.id && this.isPlaying ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="1"/></svg>' : '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'}
          </button>
          <button class="btn-icon-tiny btn-ts-copy" title="Sao ch\xE9p c\xE2u">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2z"/></svg>
          </button>
          <button class="btn-icon-tiny btn-ts-del" title="X\xF3a c\xE2u">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      `;
      const b = p.querySelector(".transcript-time-badge"), I = p.querySelector(".btn-ts-play"), k = () => {
        var L;
        if (this.activeTranscriptId === v.id && this.isPlaying) {
          this.togglePlay();
          return;
        }
        this.activeTranscriptId = v.id, this.activeTranscriptEndSec = v.endSec, this.seekTo(v.startSec), this.isPlaying ? (L = this.getPlaybackPlayer()) == null || L.play().catch(() => {
        }) : this.togglePlay(), this.renderTranscriptView(t);
      };
      b == null || b.addEventListener("click", k), I == null || I.addEventListener("click", k);
      const w = p.querySelector(".transcript-text-input");
      w == null || w.addEventListener("input", (L) => {
        v.text = L.target.value;
      }), w == null || w.addEventListener("change", () => {
        this.invalidateSummary(), this.handleRematch();
      }), (R = p.querySelector(".btn-ts-copy")) == null || R.addEventListener("click", () => {
        navigator.clipboard.writeText(v.text).then(() => {
          w.style.borderColor = "var(--color-green)", setTimeout(() => w.style.borderColor = "", 800);
        });
      }), (A = p.querySelector(".btn-ts-del")) == null || A.addEventListener("click", () => {
        this.transcripts = this.transcripts.filter((L) => L.id !== v.id), this.invalidateSummary(), this.renderTranscriptView(t), this.handleRematch();
      }), e.appendChild(p);
    });
  }
  async handleRunAsrAi() {
    var n;
    const t = document.getElementById("btn-run-asr-ai");
    if (!t) return;
    const e = (n = this.activeArollFile) == null ? void 0 : n.file;
    if (!e) {
      alert("H\xE3y n\u1EA1p m\u1ED9t file A-Roll t\u1EEB m\xE1y tr\u01B0\u1EDBc khi ch\u1EA1y Whisper. Video m\u1EABu kh\xF4ng ch\u1EE9a file ngu\u1ED3n \u0111\u1EC3 upload.");
      return;
    }
    const i = t.innerHTML;
    t.innerHTML = '<span style="animation: spin 1s linear infinite;">\u26A1</span> \u0110ang ch\u1EA1y Whisper...', t.disabled = true;
    try {
      this.transcripts = [], this.invalidateSummary(), this.cutReviewed = false, this.renderTranscriptView(), this.showProcessing("Whisper \u0111ang ch\xE9p l\u1EDDi", "\u0110ang n\u1EA1p model v\xE0 ph\xE2n t\xEDch \xE2m thanh...", null);
      let s = 0;
      for await (const r of this.api.transcribeStream(e, this.settingsData.language || "vi")) if (r.type === "segment" && r.segment) {
        this.transcripts.push(r.segment), s = r.count || this.transcripts.length;
        const o = this.totalDurationSec > 0 ? r.segment.endSec / this.totalDurationSec * 100 : null;
        this.showProcessing("Whisper \u0111ang ch\xE9p l\u1EDDi", `\u0110\xE3 nh\u1EADn ${s} c\xE2u \xB7 ${r.segment.endTime}`, o), this.renderTranscriptView();
      }
      this.handleRematch(), alert(`Ho\xE0n th\xE0nh b\xF3c b\u0103ng b\u1EB1ng Whisper: ${this.transcripts.length} c\xE2u tho\u1EA1i.`);
    } catch (s) {
      alert(s.message);
    } finally {
      t.innerHTML = i, t.disabled = false, this.hideProcessing();
    }
  }
  handleImportSrt(t) {
    const e = t.target.files[0];
    if (!e) return;
    const i = new FileReader();
    i.onload = (n) => {
      const s = n.target.result, r = this.parseSrtContent(s);
      r.length > 0 ? (this.transcripts = r, this.invalidateSummary(), this.cutReviewed = false, this.renderTranscriptView(), this.handleRematch(), alert(`\u0110\xE3 n\u1EA1p th\xE0nh c\xF4ng ${r.length} c\xE2u t\u1EEB file ph\u1EE5 \u0111\u1EC1 ${e.name}!`)) : alert("Kh\xF4ng th\u1EC3 \u0111\u1ECDc \u0111\u1ECBnh d\u1EA1ng ph\u1EE5 \u0111\u1EC1. H\xE3y d\xF9ng file .srt chu\u1EA9n.");
    }, i.readAsText(e);
  }
  parseSrtContent(t) {
    const e = t.trim().split(/\n\s*\n/), i = [];
    return e.forEach((n, s) => {
      const r = n.trim().split(`
`);
      if (r.length >= 2) {
        const o = r[1].includes("-->") ? r[1] : r[0], d = r.slice(r[1].includes("-->") ? 2 : 1).join(" "), a = o.split("-->").map((c) => c.trim());
        if (a.length === 2) {
          const c = (P) => {
            const v = P.replace(",", ".").split(":");
            return v.length === 3 ? parseFloat(v[0]) * 3600 + parseFloat(v[1]) * 60 + parseFloat(v[2]) : 0;
          }, h = c(a[0]), m = c(a[1]), u = Math.floor(h / 60), g = Math.floor(h % 60), f = Math.floor(m / 60), x = Math.floor(m % 60);
          i.push({ id: `ts-${s + 1}`, startSec: h, endSec: m, startTime: `${u.toString().padStart(2, "0")}:${g.toString().padStart(2, "0")}`, endTime: `${f.toString().padStart(2, "0")}:${x.toString().padStart(2, "0")}`, speaker: "Ng\u01B0\u1EDDi n\xF3i 1", text: d.trim() });
        }
      }
    }), i;
  }
  handleExportSrt() {
    let t = "";
    this.transcripts.forEach((e, i) => {
      const n = (s) => {
        const r = Math.floor(s / 3600), o = Math.floor(s % 3600 / 60), d = Math.floor(s % 60), a = Math.floor(s % 1 * 1e3);
        return `${r.toString().padStart(2, "0")}:${o.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")},${a.toString().padStart(3, "0")}`;
      };
      t += `${i + 1}
`, t += `${n(e.startSec)} --> ${n(e.endSec)}
`, t += `${e.text}

`;
    }), this.exporter.downloadFile(`${this.currentProjectName}_Subtitles.srt`, t, "text/plain");
  }
  invalidateSummary() {
    this.summaryResult = "", this.summaryModel = "";
    this.metadataResult = { title: "", description: "", hashtags: [] };
    this.metadataModel = "";
    this.adCheckResult = null;
    this.adCheckModel = "";
  }
  selectSummaryOption(t, e) {
    ["type", "language", "tone"].includes(t) && (this.summaryOptions[t] = e, document.querySelectorAll(`[data-summary-group="${t}"] button`).forEach((i) => {
      i.classList.toggle("active", i.dataset.value === e);
    }), this.summaryCustomToneWrap && (this.summaryCustomToneWrap.hidden = this.summaryOptions.tone !== "custom"), this.renderSummaryView());
  }
  renderSummaryView() {
    const t = { brief: "B\u1EA3n t\xF3m t\u1EAFt", "key-points": "C\xE1c \xFD ch\xEDnh", "action-items": "C\xE1c vi\u1EC7c c\u1EA7n l\xE0m" };
    Object.entries(this.summaryOptions).forEach(([i, n]) => {
      i !== "customTone" && document.querySelectorAll(`[data-summary-group="${i}"] button`).forEach((s) => {
        s.classList.toggle("active", s.dataset.value === n);
      });
    }), this.summaryCustomToneInput && this.summaryCustomToneInput.value !== this.summaryOptions.customTone && (this.summaryCustomToneInput.value = this.summaryOptions.customTone), this.summaryCustomToneWrap && (this.summaryCustomToneWrap.hidden = this.summaryOptions.tone !== "custom"), this.summaryResultTitle && (this.summaryResultTitle.textContent = t[this.summaryOptions.type] || "B\u1EA3n t\xF3m t\u1EAFt"), this.summaryResultMeta && (this.summaryResultMeta.textContent = this.summaryModel ? `Gemini \xB7 ${this.summaryModel}` : "Gemini"), this.summaryResultContent && (this.summaryResultContent.classList.remove("error"), this.summaryResultContent.textContent = this.summaryResult || "Ch\u1ECDn thi\u1EBFt l\u1EADp ph\xEDa tr\xEAn r\u1ED3i nh\u1EA5n \u201CT\u1EA1o t\xF3m t\u1EAFt\u201D.", this.summaryResultContent.classList.toggle("empty", !this.summaryResult));
    const e = document.getElementById("btn-copy-summary");
    e && (e.disabled = !this.summaryResult), this.summaryStatusIcon && (this.summaryStatusIcon.textContent = this.summaryResult ? "\u2713" : "\u2726", this.summaryStatusIcon.classList.toggle("complete", !!this.summaryResult));
  }
  async handleGenerateSummary() {
    var i;
    if (!this.transcripts.length) {
      this.switchView("transcript", { force: true });
      return;
    }
    if (this.summaryOptions.tone === "custom" && !this.summaryOptions.customTone.trim()) {
      alert("H\xE3y m\xF4 t\u1EA3 gi\u1ECDng v\u0103n t\xF9y ch\u1EC9nh tr\u01B0\u1EDBc khi t\u1EA1o t\xF3m t\u1EAFt."), (i = this.summaryCustomToneInput) == null || i.focus();
      return;
    }
    const t = document.getElementById("btn-generate-summary"), e = t == null ? void 0 : t.innerHTML;
    t && (t.disabled = true, t.innerHTML = '<span class="summary-loading-spinner"></span><span>Gemini \u0111ang t\xF3m t\u1EAFt...</span>'), this.summaryResultContent && (this.summaryResultContent.textContent = "\u0110ang \u0111\u1ECDc b\u1EA3n ghi l\u1EDDi v\xE0 t\u1EA1o n\u1ED9i dung...", this.summaryResultContent.classList.add("empty"));
    try {
      const n = await this.api.summarize(this.transcripts, this.summaryOptions);
      this.summaryResult = n.summary || "", this.summaryModel = n.model || "Gemini", this.renderSummaryView();
    } catch (n) {
      this.summaryResultContent && (this.summaryResultContent.textContent = n.message, this.summaryResultContent.classList.add("error"));
    } finally {
      t && (t.disabled = false, t.innerHTML = e);
    }
  }
  async copySummary() {
    if (this.summaryResult) try {
      await navigator.clipboard.writeText(this.summaryResult);
      const t = document.getElementById("btn-copy-summary");
      if (t) {
        const e = t.textContent;
        t.textContent = "\u0110\xE3 sao ch\xE9p", setTimeout(() => {
          t.textContent = e;
        }, 1200);
      }
    } catch {
      alert("Kh\xF4ng th\u1EC3 sao ch\xE9p t\u1EF1 \u0111\u1ED9ng. H\xE3y ch\u1ECDn n\u1ED9i dung v\xE0 sao ch\xE9p th\u1EE7 c\xF4ng.");
    }
  }
  hasMetadataResult() {
    return Boolean(this.metadataResult.title || this.metadataResult.description || this.metadataResult.hashtags?.length);
  }
  selectMetadataOption(group, value) {
    if (!["language", "tone"].includes(group)) return;
    this.metadataOptions[group] = value;
    document.querySelectorAll(`[data-metadata-group="${group}"] button`).forEach((button) => {
      button.classList.toggle("active", button.dataset.value === value);
    });
    if (this.metadataCustomToneWrap) this.metadataCustomToneWrap.hidden = this.metadataOptions.tone !== "custom";
    this.renderMetadataView();
  }
  renderMetadataView() {
    Object.entries(this.metadataOptions).forEach(([group, value]) => {
      if (group === "customTone") return;
      document.querySelectorAll(`[data-metadata-group="${group}"] button`).forEach((button) => {
        button.classList.toggle("active", button.dataset.value === value);
      });
    });
    if (this.metadataCustomToneInput && this.metadataCustomToneInput.value !== this.metadataOptions.customTone) {
      this.metadataCustomToneInput.value = this.metadataOptions.customTone;
    }
    if (this.metadataCustomToneWrap) this.metadataCustomToneWrap.hidden = this.metadataOptions.tone !== "custom";
    const hasResult = this.hasMetadataResult();
    const hashtags = Array.isArray(this.metadataResult.hashtags) ? this.metadataResult.hashtags.join(" ") : String(this.metadataResult.hashtags || "");
    [
      [this.metadataTitleOutput, this.metadataResult.title, "Chưa có tiêu đề."],
      [this.metadataDescriptionOutput, this.metadataResult.description, "Chưa có mô tả."],
      [this.metadataHashtagsOutput, hashtags, "Chưa có hashtag."]
    ].forEach(([element, value, placeholder]) => {
      if (!element) return;
      element.classList.remove("error");
      element.textContent = value || placeholder;
      element.classList.toggle("empty", !value);
    });
    if (this.metadataStatusIcon) {
      this.metadataStatusIcon.textContent = hasResult ? "✓" : "✦";
      this.metadataStatusIcon.classList.toggle("complete", hasResult);
    }
    if (this.metadataResultMeta) this.metadataResultMeta.textContent = this.metadataModel ? `Gemini · ${this.metadataModel}` : "Gemini";
    document.querySelectorAll("[data-copy-metadata]").forEach((button) => button.disabled = !hasResult);
    const copyAll = document.getElementById("btn-copy-all-metadata");
    const regenerate = document.getElementById("btn-regenerate-metadata");
    if (copyAll) copyAll.disabled = !hasResult;
    if (regenerate) regenerate.disabled = !hasResult;
  }
  async handleGenerateMetadata() {
    if (!this.transcripts.length) {
      this.switchView("transcript", { force: true });
      return;
    }
    if (this.metadataOptions.tone === "custom" && !this.metadataOptions.customTone.trim()) {
      alert("Hãy mô tả giọng văn tùy chỉnh trước khi tạo metadata.");
      this.metadataCustomToneInput?.focus();
      return;
    }
    const button = document.getElementById("btn-generate-metadata");
    const regenerate = document.getElementById("btn-regenerate-metadata");
    const original = button?.innerHTML;
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span class="summary-loading-spinner"></span><span>Gemini đang tạo...</span>';
    }
    if (regenerate) regenerate.disabled = true;
    [this.metadataTitleOutput, this.metadataDescriptionOutput, this.metadataHashtagsOutput].forEach((element) => {
      if (!element) return;
      element.textContent = "Đang tạo nội dung...";
      element.classList.add("empty");
    });
    try {
      const result = await this.api.generateMetadata(this.transcripts, this.metadataOptions);
      this.metadataResult = {
        title: result.title || "",
        description: result.description || "",
        hashtags: Array.isArray(result.hashtags) ? result.hashtags : []
      };
      this.metadataModel = result.model || "Gemini";
      this.renderMetadataView();
    } catch (error) {
      [this.metadataTitleOutput, this.metadataDescriptionOutput, this.metadataHashtagsOutput].forEach((element) => {
        if (!element) return;
        element.textContent = error.message;
        element.classList.add("error");
      });
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = original;
      }
      if (regenerate) regenerate.disabled = !this.hasMetadataResult();
    }
  }
  metadataFieldText(field) {
    if (field === "hashtags") return Array.isArray(this.metadataResult.hashtags) ? this.metadataResult.hashtags.join(" ") : "";
    return String(this.metadataResult[field] || "");
  }
  async copyMetadataField(field, button) {
    const text = this.metadataFieldText(field);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Đã sao chép";
      setTimeout(() => button.textContent = original, 1200);
    } catch {
      alert("Không thể sao chép tự động. Hãy chọn nội dung và sao chép thủ công.");
    }
  }
  async copyAllMetadata() {
    if (!this.hasMetadataResult()) return;
    const text = `TIÊU ĐỀ\n${this.metadataFieldText("title")}\n\nMÔ TẢ\n${this.metadataFieldText("description")}\n\nHASHTAG\n${this.metadataFieldText("hashtags")}`;
    try {
      await navigator.clipboard.writeText(text);
      const button = document.getElementById("btn-copy-all-metadata");
      if (button) {
        const original = button.textContent;
        button.textContent = "Đã sao chép tất cả";
        setTimeout(() => button.textContent = original, 1200);
      }
    } catch {
      alert("Không thể sao chép tự động. Hãy sao chép từng phần.");
    }
  }
  setAdCheckProgress(stage = "") {
    const order = ["scan", "aggregate", "report"];
    const activeIndex = order.indexOf(stage);
    document.querySelectorAll("#ad-check-progress [data-stage]").forEach((element, index) => {
      element.classList.toggle("active", index === activeIndex);
      element.classList.toggle("complete", stage === "complete" || index < activeIndex);
    });
    document.querySelectorAll("#ad-check-progress i").forEach((line, index) => {
      line.classList.toggle("complete", stage === "complete" || index < activeIndex);
    });
  }
  selectSettingsTab(tab) {
    document.querySelectorAll("[data-settings-tab]").forEach((button) => button.classList.toggle("active", button.dataset.settingsTab === tab));
    document.querySelectorAll("[data-settings-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.settingsPanel === tab));
    if (tab === "models") this.loadWhisperModels();
  }
  async loadSettingsPage() {
    if (this.settingsSaveState) this.settingsSaveState.textContent = "Đang đồng bộ…";
    try {
      const payload = await this.api.getSettings();
      this.settingsData = { ...this.settingsData, ...(payload.settings || {}) };
      this.api.timeoutMs = Number(this.settingsData.requestTimeoutSec || 300) * 1000;
      this.renderSettingsForm();
      if (this.geminiServiceStatus) this.geminiServiceStatus.textContent = payload.geminiConfigured ? "Đang hoạt động" : "Chưa cấu hình";
      this.geminiStatusDot?.classList.toggle("active", !!payload.geminiConfigured);
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Đã đồng bộ";
    } catch (error) {
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Không kết nối được engine";
    }
  }
  renderSettingsForm() {
    const values = {
      "setting-language": this.settingsData.language,
      "setting-timeout": this.settingsData.requestTimeoutSec,
      "setting-gemini-model": this.settingsData.geminiModel,
      "setting-max-tokens": this.settingsData.maxOutputTokens,
      "setting-batch-duration": this.settingsData.batchDurationSec
    };
    Object.entries(values).forEach(([id, value]) => { const element = document.getElementById(id); if (element) element.value = value; });
    const normalize = document.getElementById("setting-normalize-audio");
    if (normalize) normalize.checked = !!this.settingsData.normalizeAudio;
    const gain = document.getElementById("setting-gain-value");
    if (gain) gain.textContent = `${Number(this.settingsData.manualGainDb) >= 0 ? "+" : ""}${this.settingsData.manualGainDb} dB`;
  }
  async saveSettingsFromForm() {
    const pick = (id) => document.getElementById(id);
    const next = {
      language: pick("setting-language")?.value || "vi",
      normalizeAudio: !!pick("setting-normalize-audio")?.checked,
      manualGainDb: Number(this.settingsData.manualGainDb) || 0,
      requestTimeoutSec: Number(pick("setting-timeout")?.value) || 300,
      whisperModel: this.settingsData.whisperModel || "small",
      geminiModel: pick("setting-gemini-model")?.value || "gemini-3.6-flash",
      maxOutputTokens: Number(pick("setting-max-tokens")?.value) || 8192,
      batchDurationSec: Number(pick("setting-batch-duration")?.value) || 600
    };
    if (this.settingsSaveState) this.settingsSaveState.textContent = "Đang lưu…";
    try {
      const payload = await this.api.saveSettings(next);
      this.settingsData = { ...this.settingsData, ...(payload.settings || next) };
      this.api.timeoutMs = Number(this.settingsData.requestTimeoutSec || 300) * 1000;
      this.renderSettingsForm();
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Đã lưu";
    } catch (error) {
      if (this.settingsSaveState) this.settingsSaveState.textContent = "Lưu thất bại";
      alert(error.message);
    }
  }
  changeManualGain(delta) {
    this.settingsData.manualGainDb = Math.max(-12, Math.min(24, (Number(this.settingsData.manualGainDb) || 0) + delta));
    this.renderSettingsForm();
    this.saveSettingsFromForm();
  }
  toggleSettingsKey() {
    const input = document.getElementById("settings-gemini-key");
    const button = document.getElementById("toggle-settings-key");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
    if (button) button.textContent = input.type === "password" ? "Hiện" : "Ẩn";
  }
  async saveSettingsGeminiKey() {
    const input = document.getElementById("settings-gemini-key");
    const button = document.getElementById("save-settings-key");
    const key = input?.value.trim() || "";
    if (button) { button.disabled = true; button.textContent = "Đang kết nối…"; }
    try {
      const result = await this.api.setGeminiKey(key);
      if (input) input.value = "";
      if (this.geminiServiceStatus) this.geminiServiceStatus.textContent = result.geminiConfigured ? "Đang hoạt động" : "Chưa kết nối";
      this.geminiStatusDot?.classList.toggle("active", !!result.geminiConfigured);
      alert(result.geminiConfigured ? "Đã kết nối Gemini với AI engine." : "Đã xóa API key khỏi phiên chạy.");
    } catch (error) { alert(error.message); }
    finally { if (button) { button.disabled = false; button.textContent = "Kết nối"; } }
  }
  async loadWhisperModels() {
    if (this.whisperModelList) this.whisperModelList.innerHTML = '<div class="settings-loading">Đang đọc danh sách mô hình…</div>';
    try {
      const payload = await this.api.listWhisperModels();
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) {
      if (this.whisperModelList) this.whisperModelList.innerHTML = `<div class="settings-loading error">${E(error.message)}</div>`;
    }
  }
  renderWhisperModels() {
    if (!this.whisperModelList) return;
    const query = (document.getElementById("model-search")?.value || "").toLowerCase().trim();
    const models = this.whisperModels.filter((model) => model.name.toLowerCase().includes(query) || model.id.includes(query));
    this.whisperModelList.innerHTML = models.map((model) => `<div class="model-row">
      <div class="model-info"><strong>${E(model.name)}</strong><small>${E(model.size)}${model.active ? " · Đang sử dụng" : ""}</small></div>
      <div class="model-actions">${model.installed ? `<button class="model-status ${model.active ? "active" : ""}" data-model-select="${E(model.id)}">${model.active ? "✓ Đang dùng" : "Chọn model"}</button>${model.active ? "" : `<button class="model-delete" data-model-delete="${E(model.id)}" title="Xóa model">Xóa</button>`}` : `<button class="model-download" data-model-download="${E(model.id)}">↓ Tải xuống</button>`}</div>
    </div>`).join("") || '<div class="settings-loading">Không tìm thấy mô hình.</div>';
    this.whisperModelList.querySelectorAll("[data-model-select]").forEach((button) => button.addEventListener("click", () => this.selectWhisperModel(button.dataset.modelSelect)));
    this.whisperModelList.querySelectorAll("[data-model-download]").forEach((button) => button.addEventListener("click", () => this.downloadWhisperModel(button.dataset.modelDownload, button)));
    this.whisperModelList.querySelectorAll("[data-model-delete]").forEach((button) => button.addEventListener("click", () => this.deleteWhisperModel(button.dataset.modelDelete)));
  }
  async selectWhisperModel(modelId) {
    this.settingsData.whisperModel = modelId;
    await this.saveSettingsFromForm();
    await this.loadWhisperModels();
  }
  async downloadWhisperModel(modelId, button) {
    if (button) { button.disabled = true; button.textContent = "Đang tải…"; }
    try {
      const payload = await this.api.downloadWhisperModel(modelId);
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) { alert(error.message); this.renderWhisperModels(); }
  }
  async deleteWhisperModel(modelId) {
    if (!confirm("Xóa model này khỏi bộ nhớ máy? Bạn có thể tải lại sau.")) return;
    try {
      const payload = await this.api.deleteWhisperModel(modelId);
      this.whisperModels = payload.models || [];
      this.renderWhisperModels();
    } catch (error) { alert(error.message); }
  }
  renderAdCheckView() {
    const result = this.adCheckResult;
    const hasResult = Boolean(result);
    const overallLabels = {
      compliant: "Không phát hiện rủi ro rõ ràng",
      review: "Cần xem xét",
      "non-compliant": "Phát hiện rủi ro cao"
    };
    if (this.adReportTitle) this.adReportTitle.textContent = hasResult ? overallLabels[result.overallStatus] || "Báo cáo kiểm tra" : "Báo cáo kiểm tra";
    if (this.adReportMeta) this.adReportMeta.textContent = this.adCheckModel ? `Gemini · ${this.adCheckModel}` : "Gemini";
    if (this.adReportStatusIcon) {
      this.adReportStatusIcon.textContent = hasResult ? (result.overallStatus === "compliant" ? "✓" : result.overallStatus === "review" ? "!" : "×") : "✦";
      this.adReportStatusIcon.className = `summary-status-icon ${hasResult ? `ad-${result.overallStatus}` : ""}`;
    }
    if (this.adReportSummary) {
      this.adReportSummary.textContent = hasResult ? result.summary || "Đã hoàn tất rà soát." : "Nhấn “Rà soát nội dung” để bắt đầu.";
      this.adReportSummary.classList.toggle("empty", !hasResult);
    }
    if (this.adFindingsList) {
      this.adFindingsList.innerHTML = "";
      (result?.checks || []).forEach((check, index) => {
        const statusLabels = { pass: "Không thấy rủi ro", warning: "Cần xem xét", fail: "Rủi ro cao", na: "Không áp dụng" };
        const card = document.createElement("article");
        card.className = `ad-finding-card status-${check.status || "na"}`;
        const evidence = (check.evidence || []).map((item) => `<li><span>${E(item.time || "")}</span>${E(item.quote || "")}</li>`).join("");
        card.innerHTML = `
          <div class="ad-finding-header">
            <strong>${index + 1}. ${E(check.title || "Hạng mục kiểm tra")}</strong>
            <span class="ad-finding-status">${E(statusLabels[check.status] || "Cần xem xét")}</span>
          </div>
          <p>${E(check.explanation || "Không có nhận xét.")}</p>
          ${evidence ? `<ul class="ad-evidence-list">${evidence}</ul>` : ""}
        `;
        this.adFindingsList.appendChild(card);
      });
    }
    if (this.adRecommendations && this.adRecommendationsList) {
      const recommendations = result?.recommendations || [];
      this.adRecommendations.hidden = !recommendations.length;
      this.adRecommendationsList.innerHTML = recommendations.map((item) => `<li>${E(item)}</li>`).join("");
    }
    const copyButton = document.getElementById("btn-copy-ad-report");
    const rerunButton = document.getElementById("btn-rerun-ad-check");
    if (copyButton) copyButton.disabled = !hasResult;
    if (rerunButton) rerunButton.disabled = !hasResult;
    this.setAdCheckProgress(hasResult ? "complete" : "");
  }
  async handleRunAdCheck() {
    if (!this.transcripts.length) {
      this.switchView("transcript", { force: true });
      return;
    }
    const button = document.getElementById("btn-run-ad-check");
    const rerunButton = document.getElementById("btn-rerun-ad-check");
    const original = button?.innerHTML;
    if (button) {
      button.disabled = true;
      button.innerHTML = '<span class="summary-loading-spinner"></span><span>Đang rà soát...</span>';
    }
    if (rerunButton) rerunButton.disabled = true;
    this.setAdCheckProgress("scan");
    if (this.adReportSummary) {
      this.adReportSummary.textContent = "Gemini đang quét các câu thoại...";
      this.adReportSummary.classList.add("empty");
    }
    try {
      const options = {
        jurisdiction: document.getElementById("ad-check-jurisdiction")?.value || "vietnam",
        strictness: document.getElementById("ad-check-strictness")?.value || "balanced"
      };
      this.setAdCheckProgress("aggregate");
      const result = await this.api.checkAdCompliance(this.transcripts, options);
      this.setAdCheckProgress("report");
      this.adCheckResult = result.report || null;
      this.adCheckModel = result.model || "Gemini";
      this.renderAdCheckView();
    } catch (error) {
      this.setAdCheckProgress("");
      if (this.adReportSummary) {
        this.adReportSummary.textContent = error.message;
        this.adReportSummary.classList.add("error");
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.innerHTML = original;
      }
      if (rerunButton) rerunButton.disabled = !this.adCheckResult;
    }
  }
  async copyAdReport() {
    if (!this.adCheckResult) return;
    const lines = [
      `KẾT QUẢ: ${this.adReportTitle?.textContent || "Báo cáo kiểm tra"}`,
      this.adCheckResult.summary || ""
    ];
    (this.adCheckResult.checks || []).forEach((check, index) => {
      lines.push("", `${index + 1}. ${check.title} — ${check.status}`, check.explanation || "");
      (check.evidence || []).forEach((item) => lines.push(`• ${item.time || ""} ${item.quote || ""}`));
    });
    if (this.adCheckResult.recommendations?.length) {
      lines.push("", "KHUYẾN NGHỊ", ...this.adCheckResult.recommendations.map((item, index) => `${index + 1}. ${item}`));
    }
    lines.push("", "Lưu ý: Báo cáo do AI hỗ trợ, không thay thế tư vấn pháp lý.");
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      const button = document.getElementById("btn-copy-ad-report");
      if (button) {
        const original = button.textContent;
        button.textContent = "Đã sao chép";
        setTimeout(() => button.textContent = original, 1200);
      }
    } catch {
      alert("Không thể sao chép tự động.");
    }
  }
  refreshSilenceCuts() {
    this.silenceCuts = $.detectSilenceRanges(this.waveformPeaks, this.totalDurationSec, this.silenceThreshold, this.silencePadding), this.cutReviewed = false, this.renderCutView(), this.updateWorkflowUI();
  }
  renderCutView() {
    const t = document.getElementById("cutter-table-body"), e = document.getElementById("cut-timeline-strip");
    if (!t || !e) return;
    t.innerHTML = "", e.innerHTML = "";
    const i = this.totalDurationSec || 161, n = this.silenceCuts.filter((p) => !this.detectFillers && p.type === "filler" ? false : p.durationSec >= this.silenceThreshold || p.type === "filler"), s = n.filter((p) => p.status !== "disabled"), r = s.reduce((p, b) => p + b.durationSec, 0), o = document.getElementById("badge-cut-savings");
    if (o) {
      const p = i > 0 ? Math.round(r / i * 100) : 0;
      o.textContent = `Ti\u1EBFt ki\u1EC7m: ~${r.toFixed(1)} gi\xE2y (${p}% th\u1EDDi l\u01B0\u1EE3ng)`;
    }
    const d = document.getElementById("metric-silence-count"), a = document.getElementById("metric-filler-count"), c = document.getElementById("metric-dur-before"), h = document.getElementById("metric-dur-after"), m = document.getElementById("cut-status-summary"), u = s.filter((p) => p.type === "silence").length, g = s.filter((p) => p.type === "filler").length;
    d && (d.textContent = `${u} \u0111o\u1EA1n (${s.filter((p) => p.type === "silence").reduce((p, b) => p + b.durationSec, 0).toFixed(1)}s)`), a && (a.textContent = `${g} t\u1EEB (${s.filter((p) => p.type === "filler").reduce((p, b) => p + b.durationSec, 0).toFixed(1)}s)`);
    const f = Math.floor(i / 60), x = Math.floor(i % 60);
    c && (c.textContent = `${f}:${x.toString().padStart(2, "0")}`);
    const P = Math.max(0, i - r), v = Math.floor(P / 60), T = Math.floor(P % 60);
    h && (h.textContent = `${v}:${T.toString().padStart(2, "0")}`), m && (m.textContent = `${s.length} \u0111o\u1EA1n \u0111\u01B0\u1EE3c ch\u1ECDn \u0111\u1EC3 c\u1EAFt`), n.forEach((p) => {
      const b = document.createElement("div");
      b.className = `cut-marker-red ${p.status === "disabled" ? "disabled" : ""}`;
      const I = p.startSec / i * 100, k = Math.max(0.8, p.durationSec / i * 100);
      b.style.left = `${I}%`, b.style.width = `${k}%`, b.title = `${p.label} (${p.durationSec}s) t\u1EA1i ${p.startSec.toFixed(1)}s`, e.appendChild(b);
    }), n.length === 0 && (t.innerHTML = `
        <tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: var(--text-muted); font-size: 13px;">
          Ch\u01B0a ph\xE1t hi\u1EC7n kho\u1EA3ng l\u1EB7ng n\xE0o c\u1EA7n c\u1EAFt b\u1ECF.<br>
          <span style="font-size: 11.5px; opacity: 0.7;">K\xE9o th\u1EA3 video A-Roll ho\u1EB7c \u0111i\u1EC1u ch\u1EC9nh thanh tr\u01B0\u1EE3t ng\u01B0\u1EE1ng gi\xE2y b\xEAn tr\xE1i.</span>
        </td></tr>
      `), n.forEach((p) => {
      var I, k;
      const b = document.createElement("tr");
      b.className = p.status === "disabled" ? "disabled-cut" : "", b.innerHTML = `
        <td><input type="checkbox" class="chk-cut-row" data-id="${p.id}" ${p.status !== "disabled" ? "checked" : ""}></td>
        <td><span class="${p.type === "silence" ? "cut-tag-red" : "cut-tag-amber"}">${p.label}</span></td>
        <td><code style="font-size:11px; color:var(--text-muted);">[${p.startSec.toFixed(2)}s - ${p.endSec.toFixed(2)}s]</code></td>
        <td><strong>${p.durationSec.toFixed(1)}s</strong></td>
        <td><span style="color: var(--text-muted); font-size: 11.5px;">Ph\xE1t hi\u1EC7n t\u1EF1 \u0111\u1ED9ng b\u1EDFi b\u1ED9 l\u1ECDc t\u1EA7n s\u1ED1</span></td>
        <td style="text-align: right;">
          <button class="btn-action-ghost btn-toggle-cut" data-id="${p.id}" style="font-size: 11px;">
            ${p.status === "disabled" ? "Kh\xF4i ph\u1EE5c" : "B\u1ECF qua"}
          </button>
        </td>
      `, (I = b.querySelector(".chk-cut-row")) == null || I.addEventListener("change", (w) => {
        p.status = w.target.checked ? "active" : "disabled", this.renderCutView();
      }), (k = b.querySelector(".btn-toggle-cut")) == null || k.addEventListener("click", () => {
        p.status = p.status === "disabled" ? "active" : "disabled", this.renderCutView();
      }), t.appendChild(b);
    });
  }
  handleExecuteAutoCut() {
    const t = document.getElementById("btn-execute-auto-cut");
    if (!t) return;
    const e = this.silenceCuts.filter((n) => n.status !== "disabled"), i = e.reduce((n, s) => n + s.durationSec, 0);
    t.innerHTML = `<span>\u23F3 \u0110ang c\u1EAFt ${e.length} ph\xE2n \u0111o\u1EA1n...</span>`, setTimeout(() => {
      t.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span>X\xE1c nh\u1EADn danh s\xE1ch c\u1EAFt</span>', this.cutReviewed = true, this.updateWorkflowUI(), alert(`\u0110\xE3 x\xE1c nh\u1EADn ${e.length} kho\u1EA3ng l\u1EB7ng (${i.toFixed(1)} gi\xE2y). File ngu\u1ED3n kh\xF4ng b\u1ECB thay \u0111\u1ED5i; \u0111\xE2y l\xE0 danh s\xE1ch c\u1EAFt cho timeline.`);
    }, 450);
  }
  handleResetAllCuts() {
    this.silenceCuts.forEach((t) => t.status = "active"), this.renderCutView();
  }
  handleToggleAllCuts(t) {
    this.silenceCuts.forEach((e) => e.status = t ? "active" : "disabled"), this.renderCutView();
  }
  renderSegmentView() {
    const t = document.getElementById("segment-chapters-grid");
    if (t) {
      if (t.innerHTML = "", this.chapters.length === 0) {
        t.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--text-muted); font-size: 13px; line-height: 1.8; grid-column: 1 / -1; border: 1px dashed var(--border-color); border-radius: 8px;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 10px; opacity: 0.5;"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg><br>
          <strong style="color: var(--text-main); font-size: 14px;">Ch\u01B0a c\xF3 ph\xE2n \u0111o\u1EA1n ch\u1EE7 \u0111\u1EC1 n\xE0o</strong><br>
          B\u1EA5m <strong>"T\u1EF1 \u0111\u1ED9ng ph\xE2n \u0111o\u1EA1n b\u1EB1ng Gemini"</strong> \u0111\u1EC3 AI ph\xE2n chia ch\u01B0\u01A1ng h\u1ED3i ho\u1EB7c b\u1EA5m <strong>"+ Th\xEAm ch\u01B0\u01A1ng m\u1EDBi"</strong> \u0111\u1EC3 t\u1EF1 t\u1EA1o.
        </div>
      `;
        return;
      }
      this.chapters.forEach((e) => {
        var n;
        const i = document.createElement("div");
        i.className = "chapter-card", i.id = `card-${e.id}`, i.innerHTML = `
        <div class="chapter-header">
          <span class="chapter-index-badge">Ch\u01B0\u01A1ng #${e.index}</span>
          <span class="chapter-time-badge">[${e.startTime} - ${e.endTime}] (${e.durationSec}s)</span>
        </div>
        <div class="chapter-title">${E(e.title)}</div>
        <div class="chapter-summary">${E(e.summary)}</div>
        <div class="chapter-tags-row">
          ${(e.tags || []).map((s) => `<span class="chapter-tag">${E(s)}</span>`).join("")}
        </div>
        <div class="chapter-footer">
          <div class="chapter-broll-info">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/></svg>
            <span>${e.brollMatches > 0 ? `\u0110\xE3 g\xE1n ${e.brollMatches} B-Roll (${e.matchedClipIds.join(", ")})` : "Ch\u01B0a c\xF3 B-Roll (Gi\u1EEF ng\u01B0\u1EDDi n\xF3i)"}</span>
          </div>
          <button class="btn-goto-broll" data-start="${e.startSec}" title="Chuy\u1EC3n sang timeline B-Roll">
            \u{1F3AC} \u0110i t\u1EDBi B-Roll
          </button>
        </div>
      `, (n = i.querySelector(".btn-goto-broll")) == null || n.addEventListener("click", () => {
          this.switchView("broll"), this.seekTo(e.startSec);
        }), t.appendChild(i);
      });
    }
  }
  async handleAiAutoSegment() {
    var i;
    const t = document.getElementById("btn-ai-auto-segment");
    if (!t) return;
    if (!this.transcripts.length) {
      alert("Ch\u01B0a c\xF3 transcript \u0111\u1EC3 ph\xE2n \u0111o\u1EA1n. H\xE3y ch\u1EA1y Whisper ho\u1EB7c nh\u1EADp file SRT tr\u01B0\u1EDBc.");
      return;
    }
    const e = t.innerHTML;
    t.innerHTML = '<span style="animation: spin 1s linear infinite;">\u2726</span> \u0110ang ph\xE2n \u0111o\u1EA1n Gemini...', t.disabled = true;
    try {
      const n = await this.api.segment(this.transcripts, ((i = this.txtPlacement) == null ? void 0 : i.value) || "");
      this.chapters = n.chapters || [], this.renderSegmentView(), this.updateWorkflowUI(), alert(`\u0110\xE3 ph\xE2n \u0111o\u1EA1n video th\xE0nh ${this.chapters.length} ch\u01B0\u01A1ng b\u1EB1ng Gemini.`);
    } catch (n) {
      alert(n.message);
    } finally {
      t.innerHTML = e, t.disabled = false;
    }
  }
  handleAddCustomChapter() {
    const t = prompt("Nh\u1EADp ti\xEAu \u0111\u1EC1 ch\u01B0\u01A1ng m\u1EDBi:", "\u0110\xE1nh gi\xE1 hi\u1EC7u n\u0103ng th\u1EF1c t\u1EBF");
    if (!t) return;
    const e = this.chapters.length + 1, i = this.chapters.length > 0 ? this.chapters[this.chapters.length - 1].endSec : 0, n = i + 20, s = Math.floor(i / 60), r = Math.floor(i % 60), o = Math.floor(n / 60), d = Math.floor(n % 60);
    this.chapters.push({ id: `chap-${e}`, index: e, title: t.trim(), startTime: `${s.toString().padStart(2, "0")}:${r.toString().padStart(2, "0")}`, endTime: `${o.toString().padStart(2, "0")}:${d.toString().padStart(2, "0")}`, startSec: i, endSec: n, durationSec: 20, tags: ["#custom_chapter"], summary: "Ph\xE2n \u0111o\u1EA1n \u0111\u01B0\u1EE3c t\u1EA1o th\u1EE7 c\xF4ng b\u1EDFi ng\u01B0\u1EDDi d\xF9ng.", brollMatches: 0, matchedClipIds: [] }), this.renderSegmentView(), this.updateWorkflowUI();
  }
  renderExportView() {
    var h, m;
    const t = document.getElementById("export-proj-title");
    t && (t.textContent = this.currentProjectName);
    const e = document.getElementById("export-stat-broll-count");
    e && (e.textContent = `${this.matchedPositions.length} Clip B-Roll \u0111\xE3 gh\xE9p`);
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60), s = document.getElementById("export-stat-duration");
    s && (s.textContent = `Th\u1EDDi l\u01B0\u1EE3ng: ${i}:${n.toString().padStart(2, "0")}`);
    const r = document.getElementById("export-stat-coverage");
    if (r) if (this.matchedPositions.length > 0 && this.totalDurationSec > 0) {
      const u = this.matchedPositions.reduce((f, x) => f + (x.durationSec || 0), 0), g = Math.min(100, Math.round(u / this.totalDurationSec * 100));
      r.textContent = `${g}% T\u1EF7 l\u1EC7 ph\u1EE7`, r.style.display = "inline-block";
    } else r.style.display = "none";
    const o = document.getElementById("export-stat-resolution");
    o && (o.textContent = ((h = this.activeArollFile) == null ? void 0 : h.resolution) || (this.activeArollFile ? "1080p FHD (16:9)" : "-- x --"));
    const d = document.getElementById("export-banner-thumb"), a = document.getElementById("export-banner-thumb-empty");
    this.activeArollFile && this.activeArollFile.thumb ? (d && (d.src = this.activeArollFile.thumb, d.style.display = "block"), a && (a.style.display = "none")) : (d && (d.src = "", d.style.display = "none"), a && (a.style.display = "flex"));
    const c = document.getElementById("dash-xml-preview-code");
    if (c) if (this.matchedPositions.length === 0 && !this.activeArollFile) c.textContent = `<?xml version="1.0" encoding="UTF-8"?>
<!-- D\u1EF1 \xE1n m\u1EDBi ch\u01B0a n\u1EA1p video. H\xE3y n\u1EA1p video A-Roll v\xE0 B-Roll \u0111\u1EC3 xem tr\u01B0\u1EDBc m\xE3 XML xu\u1EA5t timeline -->
<fcpxml version="1.9">
  <resources/>
  <library>
    <event name="${this.currentProjectName}">
      <project name="${this.currentProjectName}"/>
    </event>
  </library>
</fcpxml>`;
    else {
      const u = ((m = this.activeArollFile) == null ? void 0 : m.name) || "C4095.mov", g = this.exporter.generateFCPXML(this.matchedPositions.slice(0, 4), u, this.totalDurationSec);
      c.textContent = g.split(`
`).slice(0, 16).join(`
`) + `
    <!-- ... to\xE0n b\u1ED9 c\xE1c clip B-roll c\xF2n l\u1EA1i ... -->
  </library>
</fcpxml>`;
    }
  }
  exportFCPXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov", e = this.exporter.generateFCPXML(this.matchedPositions, t, this.totalDurationSec);
    this.exporter.downloadFile(`${this.currentProjectName}_Broll.fcpxml`, e, "application/xml");
  }
  exportPremiereXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov", e = this.exporter.generatePremiereXML(this.matchedPositions, t, this.totalDurationSec);
    this.exporter.downloadFile(`${this.currentProjectName}_Premiere.xml`, e, "application/xml");
  }
  exportDaVinciXML() {
    var i;
    const t = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov", e = this.exporter.generateFCPXML(this.matchedPositions, t, this.totalDurationSec);
    this.exporter.downloadFile(`${this.currentProjectName}_DaVinci.fcpxml`, e, "application/xml");
  }
  handleCopyXml() {
    var i;
    const t = document.getElementById("dash-xml-preview-code"), e = document.getElementById("btn-copy-xml-code");
    if (t && e) {
      const n = ((i = this.activeArollFile) == null ? void 0 : i.name) || "C4095.mov", s = this.exporter.generateFCPXML(this.matchedPositions, n, this.totalDurationSec);
      navigator.clipboard.writeText(s).then(() => {
        e.textContent = "\u2713 \u0110\xE3 sao ch\xE9p!", setTimeout(() => e.textContent = "Sao ch\xE9p m\xE3 XML", 1500);
      });
    }
  }
  async handleLoadAroll(t) {
    try {
      this.switchView("transcript", { force: true }), this.showProcessing("\u0110ang n\u1EA1p A-Roll", `\u0110\u1ECDc th\xF4ng tin ${t.name}...`, 8), this.btnUploadAroll.innerHTML = '<span style="animation: spin 1s linear infinite;">\u23F3</span> N\u1EA1p...';
      const e = await $.loadVideoMetadata(t);
      this.showProcessing("\u0110ang n\u1EA1p A-Roll", "\u0110ang t\u1EA1o \u1EA3nh \u0111\u1EA1i di\u1EC7n video...", 30);
      const i = await $.captureFrame(t, Math.min(1.5, e.durationSec / 2));
      e.thumb = i, this.activeArollFile = e, this.savedProjectId = null, this.isDemoMode = false, this.updateModeUI(), this.currentProjectName = t.name.replace(/\.[^/.]+$/, ""), this.totalDurationSec = Math.round(e.durationSec), this.pixelsPerSec = this.calculateOptimalScale(), this.exporter = new F(this.currentProjectName, 30), this.projNameEl.textContent = this.currentProjectName;
      const n = Math.floor(this.totalDurationSec / 60), s = Math.floor(this.totalDurationSec % 60);
      this.projSubEl.textContent = `1 video \xB7 ${n}:${s.toString().padStart(2, "0")}`, this.labelCurrentProject.textContent = this.currentProjectName, this.mainVideoPlayer.src = e.url, this.mainVideoPlayer.style.display = "block", this.emptyDropzone && (this.emptyDropzone.style.display = "none"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.src = e.url, this.transcriptVideoPlayer.style.display = "block"), this.updateSelectedFootageCard(e, "A-Roll");
      const r = document.getElementById("label-aroll-count");
      r && (r.textContent = "Video ch\xEDnh (1)"), this.showProcessing("\u0110ang n\u1EA1p A-Roll", "\u0110ang ph\xE2n t\xEDch track \xE2m thanh v\xE0 waveform...", 62), this.waveformPeaks = await $.extractAudioWaveform(t, 400), this.transcripts = [], this.invalidateSummary(), this.chapters = [], this.silenceCuts = $.detectSilenceRanges(this.waveformPeaks, this.totalDurationSec, this.silenceThreshold, this.silencePadding), this.cutReviewed = false, this.renderArollList(), this.updateTimelineWidth(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.seekTo(0), this.handleRematch(), this.switchView("transcript", { force: true }), this.showProcessing("\u0110\xE3 n\u1EA1p A-Roll", "Video s\u1EB5n s\xE0ng \u0111\u1EC3 ch\xE9p l\u1EDDi b\u1EB1ng Whisper.", 100), this.btnUploadAroll.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>N\u1EA1p A-Roll</span>';
    } catch (e) {
      alert(`L\u1ED7i khi n\u1EA1p video A-roll: ${e.message}`), this.btnUploadAroll.innerHTML = "<span>L\u1ED7i n\u1EA1p</span>";
    } finally {
      setTimeout(() => {
        var e;
        ((e = this.processingStatus) == null ? void 0 : e.textContent) === "\u0110\xE3 n\u1EA1p A-Roll" && this.hideProcessing();
      }, 700);
    }
  }
  async handleLoadBrolls(t) {
    var e;
    try {
      this.btnUploadBroll.innerHTML = `\u23F3 \u0110ang \u0111\u1ECDc ${t.length} clip...`;
      const i = [], n = await this.api.health().catch(() => null);
      for (let o = 0; o < t.length; o++) {
        const d = t[o], a = await $.loadVideoMetadata(d), c = await $.captureFrame(d, Math.min(1.5, a.durationSec / 2)), h = `B${(this.brollLibrary.length + o + 1).toString().padStart(3, "0")}`, m = { id: h, name: d.name, videoUrl: a.url, file: d, thumb: c, aspectRatio: a.aspectRatio, durationSec: parseFloat(a.durationSec.toFixed(1)), cameraAngle: a.is916 ? "Video d\u1ECDc (9:16)" : "C\u1EADn c\u1EA3nh chi ti\u1EBFt", description: `Clip B-roll th\u1EF1c t\u1EBF t\u1EEB file ${d.name}`, subjects: ["s\u1EA3n ph\u1EA9m", "footage"], tags: ["custom", a.aspectRatio], isUsed: false };
        if (n != null && n.geminiConfigured && c) {
          this.btnUploadBroll.innerHTML = `\u2726 Gemini \u0111ang ph\xE2n t\xEDch ${o + 1}/${t.length}...`;
          try {
            const u = await this.api.indexBroll({ imageDataUrl: c, clipId: h, filename: d.name, durationSec: a.durationSec, guidance: ((e = this.txtPlacement) == null ? void 0 : e.value) || "" });
            m.description = u.description || m.description, m.cameraAngle = u.camera_angle || m.cameraAngle, m.subjects = u.subjects || m.subjects, m.tags = u.tags || m.tags, m.techFeatures = u.tech_features || [];
          } catch (u) {
            console.warn(`Kh\xF4ng th\u1EC3 index ${d.name} b\u1EB1ng Gemini:`, u);
          }
        }
        i.push(m);
      }
      this.isDemoMode ? this.brollLibrary = i : this.brollLibrary = [...i, ...this.brollLibrary], this.isDemoMode = false, this.updateModeUI(), this.brollCountTitleEl.textContent = `Clip B-Roll (${this.brollLibrary.length})`;
      const s = this.brollLibrary.filter((o) => o.aspectRatio !== "16:9").length;
      this.badgeDiffRatio.textContent = `${s} kh\xE1c t\u1EF7 l\u1EC7`, !this.brollLibrary.some((o) => o.aspectRatio === "16:9") && this.chkOnly169 && this.chkOnly169.checked && (this.chkOnly169.checked = false), this.renderBrollGrid(this.brollLibrary), this.handleRematch(), this.btnUploadBroll.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg><span>Th\xEAm B-Roll</span>';
    } catch (i) {
      alert(`L\u1ED7i khi n\u1EA1p danh s\xE1ch B-roll: ${i.message}`), this.btnUploadBroll.innerHTML = "<span>Th\xEAm B-Roll</span>";
    }
  }
  async switchToOnlineSampleMode() {
    var r, o, d;
    this.isDemoMode = false, (r = this.btnModeDemo) == null || r.classList.remove("active"), (o = this.btnModeOnlineSample) == null || o.classList.add("active"), (d = this.btnModeCustom) == null || d.classList.remove("active"), this.currentProjectName = "Deebot_T80_Tech_Review", this.exporter = new F(this.currentProjectName, 30), this.totalDurationSec = 22, this.projNameEl.textContent = "Review Deebot T80 Max Omni (Video Th\u1EADt)";
    const t = Math.floor(this.totalDurationSec / 60), e = Math.floor(this.totalDurationSec % 60);
    this.projSubEl.textContent = `1 video \xB7 ${t}:${e.toString().padStart(2, "0")}`, this.labelCurrentProject.textContent = "Review Deebot T80";
    const i = "/sample_videos/aroll_product_review.mp4";
    this.mainVideoPlayer.src = i, this.mainVideoPlayer.style.display = "block", this.emptyDropzone && (this.emptyDropzone.style.display = "none"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.activeArollFile = { name: "aroll_product_review.mp4", url: i, durationSec: 22, width: 1920, height: 1080, thumb: "/assets/reviewer.jpg" };
    const n = [{ id: "C4139", name: "broll_dock_cinematic.mp4", url: "/sample_videos/broll_dock_cinematic.mp4", thumb: "/assets/broll_dock.jpg", desc: "G\xF3c m\xE1y lia \u0111\u1EB7c to\xE0n c\u1EA3nh tr\u1EA1m s\u1EA1c v\xE0 robot Deebot T80 Max Omni", tags: ["tr\u1EA1m s\u1EA1c", "omni", "t\u1EF1 gi\u1EB7t gi\u1EBB"], startSec: 4, endSec: 9, matchPercentage: 92 }, { id: "C4184", name: "broll_roller_macro.mp4", url: "/sample_videos/broll_roller_macro.mp4", thumb: "/assets/broll_roller.jpg", desc: "C\u1EADn c\u1EA3nh con l\u0103n lau nh\xE0 v\xE0 c\u1EE5m ch\u1ED5i qu\xE9t d\u01B0\u1EDBi g\u1EA7m m\xE1y", tags: ["con l\u0103n", "ch\u1ED5i qu\xE9t", "lau nh\xE0"], startSec: 10, endSec: 15, matchPercentage: 98 }, { id: "C4106", name: "broll_floor_tracking.mp4", url: "/sample_videos/broll_floor_tracking.mp4", thumb: "/assets/broll_floor.jpg", desc: "Robot h\xFAt b\u1EE5i di chuy\u1EC3n v\u1EC1 ph\xEDa m\xE1y quay d\u1ECDn d\u1EB9p n\u1EC1n nh\xE0", tags: ["di chuy\u1EC3n", "s\xE0n nh\xE0", "h\xFAt b\u1EE5i"], startSec: 16, endSec: 21, matchPercentage: 89 }], s = n.map((a) => ({ id: a.id, name: a.name, videoUrl: a.url, thumb: a.thumb, aspectRatio: "16:9", durationSec: 6, cameraAngle: "Cinematic Footage 4K", description: a.desc, subjects: ["deebot", "robot", "ph\u1EE5 ki\u1EC7n"], tags: a.tags, isUsed: true }));
    this.brollLibrary = s, this.brollCountTitleEl.textContent = `Clip B-Roll (${this.brollLibrary.length})`, this.badgeDiffRatio.textContent = "0 kh\xE1c t\u1EF7 l\u1EC7", this.transcripts = [...Ut], this.invalidateSummary(), this.silenceCuts = [...Wt], this.chapters = [...qt], this.cutReviewed = true, this.renderArollList(), this.renderBrollGrid(this.brollLibrary), this.updateSelectedFootageCard(this.activeArollFile, "A-Roll"), this.matchedPositions = n.map((a, c) => {
      const h = a.endSec - a.startSec, m = Math.floor(a.startSec / 60), u = Math.floor(a.startSec % 60), g = Math.floor(a.endSec / 60), f = Math.floor(a.endSec % 60);
      return { id: `pos-${c + 1}`, clipId: a.id, startTime: `${m.toString().padStart(2, "0")}:${u.toString().padStart(2, "0")}`, endTime: `${g.toString().padStart(2, "0")}:${f.toString().padStart(2, "0")}`, startSec: a.startSec, endSec: a.endSec, durationSec: h, matchPercentage: a.matchPercentage, description: a.desc, status: "accepted" };
    }), this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n`, this.updateTimelineWidth(), this.seekTo(0), this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.updateXmlPreview(), this.renderTranscriptView(), this.renderCutView(), this.renderSegmentView(), this.renderExportView();
  }
  switchToDemoMode() {
    this.isDemoMode = true, this.activeArollFile = null, this.brollLibrary = [...V], this.matchedPositions = [...Gt], this.transcripts = [...Ut], this.invalidateSummary(), this.silenceCuts = [...Wt], this.chapters = [...qt], this.cutReviewed = true, this.currentProjectName = Ht.name, this.totalDurationSec = Ht.totalDurationSec, this.currentTimeSec = 236, this.waveformPeaks = null, this.mainVideoPlayer.pause(), this.mainVideoPlayer.style.display = "none", this.mainPlayerImage.style.display = "block", this.mainPlayerImage.src = "/assets/reviewer.jpg", this.updateModeUI(), this.renderAll();
  }
  resetToNewProject() {
    this.adCheckResult = null;
    this.adCheckModel = "";
    this.metadataOptions = { language: "auto", tone: "professional", customTone: "" };
    this.metadataResult = { title: "", description: "", hashtags: [] };
    this.metadataModel = "";
    this.isDemoMode = false, this.brollLibrary = [], this.matchedPositions = [], this.transcripts = [], this.silenceCuts = [], this.chapters = [], this.cutReviewed = false, this.currentProjectName = "D\u1EF1 \xE1n m\u1EDBi", this.exporter = new F(this.currentProjectName, 30), this.totalDurationSec = 0, this.currentTimeSec = 0, this.activeArollFile = null, this.waveformPeaks = null, this.currentPlayingBrollId = null, this.savedProjectId = null, this.summaryResult = "", this.summaryModel = "", this.summaryOptions = { type: "brief", language: "auto", tone: "professional", customTone: "" }, this.mainVideoPlayer && (this.mainVideoPlayer.pause(), this.mainVideoPlayer.src = "", this.mainVideoPlayer.style.display = "none"), this.transcriptVideoPlayer && (this.transcriptVideoPlayer.pause(), this.transcriptVideoPlayer.removeAttribute("src"), this.transcriptVideoPlayer.load(), this.transcriptVideoPlayer.style.display = "none"), this.emptyDropzone && (this.emptyDropzone.style.display = "flex"), this.mainPlayerImage && (this.mainPlayerImage.style.display = "none"), this.projNameEl.textContent = this.currentProjectName, this.projSubEl.textContent = "Ch\u01B0a c\xF3 video \xB7 00:00", this.labelCurrentProject.textContent = this.currentProjectName, this.brollCountTitleEl.textContent = "Clip B-Roll (0)", this.matchedCountTitleEl.textContent = "0 v\u1ECB tr\xED ch\xE8n", this.timecodeDisplay.textContent = "00:00";
    const t = document.getElementById("label-aroll-count");
    t && (t.textContent = "Video ch\xEDnh (0)"), this.updateSelectedFootageCard(null), this.renderAll(), this.renderTranscriptView(), this.renderCutView(), this.renderSegmentView(), this.renderExportView(), this.switchView("transcript", { force: true });
  }
  updateSelectedFootageCard(t, e = "A-Roll") {
    const i = document.getElementById("card-foot-thumb-empty"), n = document.getElementById("card-foot-thumb"), s = document.getElementById("card-foot-title"), r = document.getElementById("card-foot-dur"), o = document.getElementById("card-foot-res"), d = document.getElementById("card-foot-size");
    if (!t) {
      i && (i.style.display = "flex"), n && (n.src = "", n.style.display = "none"), s && (s.textContent = "Ch\u01B0a ch\u1ECDn clip"), r && (r.textContent = "-- \xB7 --"), o && (o.textContent = "-- x -- \xB7 --"), d && (d.textContent = "-- MB");
      return;
    }
    t.thumb ? (n && (n.src = t.thumb, n.style.display = "block"), i && (i.style.display = "none")) : (n && (n.style.display = "none"), i && (i.style.display = "flex"));
    const a = t.durationSec || 0, c = Math.floor(a / 60), h = Math.floor(a % 60), m = `${c}:${h.toString().padStart(2, "0")}`, u = e === "A-Roll" ? "Video ch\xEDnh (A-Roll)" : t.cameraAngle || "Clip B-Roll";
    s && (s.textContent = t.name || t.id || "Video clip"), r && (r.textContent = `${m} \xB7 ${u}`);
    const g = t.width && t.height ? `${t.width} x ${t.height}` : "1920 x 1080", f = t.aspectRatio || (t.is916 ? "9:16" : "16:9");
    o && (o.textContent = `${g} \xB7 ${f}`), d && (d.textContent = t.sizeMb ? `${t.sizeMb} MB` : t.file ? `${(t.file.size / (1024 * 1024)).toFixed(1)} MB` : "12.4 MB");
  }
  switchToCustomMode() {
    this.isDemoMode = false, this.updateModeUI(), this.activeArollFile || this.inputArollFile.click();
  }
  updateModeUI() {
    var t, e, i, n;
    this.isDemoMode ? ((t = this.btnModeDemo) == null || t.classList.add("active"), (e = this.btnModeCustom) == null || e.classList.remove("active"), this.projNameEl.textContent = "Deebot T80 Max Omni", this.projSubEl.textContent = "2 video \xB7 12:51", this.labelCurrentProject.textContent = "Deebot T80 Max Omni", this.brollCountTitleEl.textContent = "Clip B-Roll (107)", this.badgeDiffRatio.textContent = "34 kh\xE1c t\u1EF7 l\u1EC7") : ((i = this.btnModeDemo) == null || i.classList.remove("active"), (n = this.btnModeCustom) == null || n.classList.add("active"));
  }
  getPlaybackPlayer() {
    var t;
    return this.currentView === "transcript" && ((t = this.transcriptVideoPlayer) != null && t.src) ? this.transcriptVideoPlayer : this.mainVideoPlayer;
  }
  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const t = this.getPlaybackPlayer();
    this.isPlaying ? this.activeArollFile && (t != null && t.src) ? t.play().catch((e) => console.warn(e)) : this.playbackInterval = setInterval(() => {
      this.currentTimeSec >= this.totalDurationSec ? this.seekTo(0) : this.seekTo(this.currentTimeSec + 0.5);
    }, 500) : (this.activeArollFile && (t != null && t.src) ? t.pause() : clearInterval(this.playbackInterval), this.activeTranscriptId = null, this.activeTranscriptEndSec = null, this.currentView === "transcript" && this.renderTranscriptView()), this.updatePlayPauseIcon();
  }
  updatePlayPauseIcon() {
    this.isPlaying ? this.btnPlayPause.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>' : this.btnPlayPause.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
  }
  seekTo(t) {
    this.currentTimeSec = Math.max(0, Math.min(this.totalDurationSec, t));
    const e = this.getPlaybackPlayer();
    this.activeArollFile && (e != null && e.src) && (e.currentTime = this.currentTimeSec), this.syncTime(this.currentTimeSec);
  }
  syncTime(t) {
    this.currentTimeSec = t;
    const e = Math.floor(t / 60), i = Math.floor(t % 60);
    this.timecodeDisplay.textContent = `${e.toString().padStart(2, "0")}:${i.toString().padStart(2, "0")}`;
    const n = t * this.pixelsPerSec;
    this.playheadLine.style.left = `${n}px`;
    const s = this.matchedPositions.find((r) => t >= r.startSec && t <= r.endSec);
    if (s) {
      const r = this.brollLibrary.find((o) => o.id === s.clipId);
      r && (r.videoUrl ? (this.currentPlayingBrollId !== r.id && (this.currentPlayingBrollId = r.id, this.brollOverlayVideo.src = r.videoUrl, this.brollOverlayVideo.currentTime = Math.max(0, t - s.startSec), this.brollOverlayVideo.style.display = "block", this.brollOverlayImg.style.display = "none"), this.isPlaying && this.brollOverlayVideo.paused && this.brollOverlayVideo.play().catch(() => {
      })) : (this.currentPlayingBrollId = null, this.brollOverlayImg.src = r.thumb, this.brollOverlayImg.style.display = "block", this.brollOverlayVideo.style.display = "none"), this.brollOverlayLabel.textContent = `B-ROLL: ${r.id} (${s.matchPercentage}%)`, this.activeBrollOverlay.classList.add("visible"));
    } else this.currentPlayingBrollId = null, this.activeBrollOverlay.classList.remove("visible"), this.brollOverlayVideo.paused || this.brollOverlayVideo.pause();
    if (document.querySelectorAll(".matched-card-item").forEach((r) => r.classList.remove("active-playing")), s) {
      const r = document.getElementById(`card-${s.id}`);
      r && r.classList.add("active-playing");
    }
  }
  handleRematch() {
    this.btnRematch.classList.add("loading"), this.btnRematchText.textContent = "\u0110ang ph\xE2n t\xEDch Gemini...", this.matcher.updateConfig({ minDuration: parseFloat(this.sliderMinDuration.value), maxDuration: parseFloat(this.sliderMaxDuration.value), segmentLength: parseFloat(this.sliderSegmentLen.value), coverageRatio: parseInt(this.sliderCoverage.value) / 100, introHoldSec: parseFloat(this.sliderIntroHold.value), only16_9: this.chkOnly169.checked, placementGuidance: this.txtPlacement.value }), setTimeout(() => {
      this.matchedPositions = this.matcher.reMatch(this.brollLibrary, this.totalDurationSec, this.transcripts), this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n`, this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview(), this.updateWorkflowUI(), this.btnRematch.classList.remove("loading"), this.btnRematchText.textContent = "Gh\xE9p l\u1EA1i";
    }, 350);
  }
  calculateOptimalScale() {
    var i;
    if (this.totalDurationSec <= 0) return 4;
    const e = Math.max(800, (((i = this.timelineTracksScroll) == null ? void 0 : i.clientWidth) || 1100) - 80) / this.totalDurationSec;
    return Math.max(1.5, Math.min(20, parseFloat(e.toFixed(2))));
  }
  fitTimelineToFrame() {
    this.pixelsPerSec = this.calculateOptimalScale(), this.zoomSlider && (this.zoomSlider.value = Math.min(250, Math.max(50, Math.round(this.pixelsPerSec / 4 * 100)))), this.updateTimelineWidth(), this.renderTimelineBrollBlocks(), this.renderFilmstrip(), this.drawWaveform(), this.drawRuler(), this.seekTo(this.currentTimeSec);
  }
  updateTimelineWidth() {
    var n;
    const t = Math.max(1200, ((n = this.timelineTracksScroll) == null ? void 0 : n.clientWidth) || 1200), e = Math.round(this.totalDurationSec * this.pixelsPerSec) + 120, i = Math.max(t, e);
    this.timelineWrapper.style.minWidth = `${i}px`;
  }
  renderAll() {
    this.updateTimelineWidth(), this.renderArollList(), this.renderBrollGrid(this.brollLibrary), this.renderMatchedList(), this.renderFilmstrip(), this.renderTimelineBrollBlocks(), this.drawWaveform(), this.drawRuler(), this.seekTo(this.currentTimeSec), this.updatePrerequisiteEmptyStates(), this.updateWorkflowUI();
  }
  renderArollList() {
    this.arollListContainer.innerHTML = "";
    const t = document.getElementById("label-aroll-count");
    if (!this.activeArollFile) {
      t && (t.textContent = "Video ch\xEDnh (0)"), this.arollListContainer.innerHTML = `
        <div style="padding: 14px 10px; text-align: center; font-size: 11px; color: var(--text-sub); border: 1px dashed var(--border-color); border-radius: 6px; line-height: 1.5;">
          Ch\u01B0a c\xF3 video ch\xEDnh.<br>B\u1EA5m <strong>"N\u1EA1p A-Roll"</strong> ho\u1EB7c k\xE9o th\u1EA3 video v\xE0o \u0111\xE2y.
        </div>
      `, this.arollSummaryText.textContent = "Ch\u01B0a c\xF3 video \xB7 00:00";
      return;
    }
    t && (t.textContent = "Video ch\xEDnh (1)"), [this.activeArollFile].forEach((s, r) => {
      const o = document.createElement("div");
      o.className = "aroll-item active";
      const d = s.durationStr || `${Math.floor(s.durationSec / 60)}:${Math.floor(s.durationSec % 60).toString().padStart(2, "0")}`, a = s.resolution || `${s.width}x${s.height}`, c = s.thumb ? `<img src="${E(s.thumb)}" alt="${E(s.name)}" class="aroll-thumb">` : '<div class="aroll-thumb aroll-thumb-fallback"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg></div>';
      o.innerHTML = `
        ${c}
        <div class="aroll-info">
          <span class="aroll-name">${r + 1}. ${E(s.name)}</span>
          <span class="aroll-duration">${d} \xB7 ${a}</span>
        </div>
      `, o.addEventListener("click", () => {
        this.updateSelectedFootageCard(s, "A-Roll");
      }), this.arollListContainer.appendChild(o);
    });
    const i = Math.floor(this.totalDurationSec / 60), n = Math.floor(this.totalDurationSec % 60);
    this.arollSummaryText.textContent = `${i}:${n.toString().padStart(2, "0")} t\u1ED5ng c\u1ED9ng \xB7 K\xE9o \u0111\u1EC3 s\u1EAFp x\u1EBFp`;
  }
  renderBrollGrid(t) {
    if (this.brollGridEl.innerHTML = "", t.length === 0) {
      this.brollGridEl.innerHTML = `
        <div class="broll-empty-state">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 6px; opacity: 0.6;"><rect width="18" height="18" x="3" y="3" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          <br>Ch\u01B0a c\xF3 clip B-Roll.<br>B\u1EA5m <strong>"+ Th\xEAm B-Roll"</strong> ho\u1EB7c k\xE9o th\u1EA3 clip ph\u1EE5 v\xE0o \u0111\xE2y.
        </div>
      `;
      return;
    }
    t.forEach((e) => {
      const i = document.createElement("div");
      i.className = "broll-card", i.title = `${e.id}: ${e.description}`;
      const n = e.aspectRatio !== "16:9";
      i.innerHTML = `
        <div class="broll-thumb-wrap">
          <img src="${E(e.thumb)}" alt="${E(e.id)}">
          ${e.isUsed ? `
            <div class="broll-used-badge" title="\u0110\xE3 gh\xE9p v\xE0o timeline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          ` : ""}
          ${n ? `<span class="broll-ratio-badge">${E(e.aspectRatio)}</span>` : ""}
        </div>
        <div class="broll-card-footer">
          <span style="font-weight: 600; color: #fff;">${E(e.id)}</span>
          <span>${e.durationSec}s</span>
        </div>
      `, i.addEventListener("click", () => {
        this.updateSelectedFootageCard(e, "B-Roll");
        const s = this.matchedPositions.find((r) => r.clipId === e.id);
        s && this.seekTo(s.startSec);
      }), this.brollGridEl.appendChild(i);
    });
  }
  renderMatchedList() {
    if (this.matchedListEl.innerHTML = "", this.matchedPositions.length === 0) {
      this.matchedListEl.innerHTML = `
        <div style="padding: 36px 16px; text-align: center; font-size: 11.5px; color: var(--text-sub); line-height: 1.6; border: 1px dashed var(--border-color); border-radius: 6px;">
          N\u1EA1p video A-Roll v\xE0 B-Roll \u0111\u1EC3 AI t\u1EF1 \u0111\u1ED9ng so kh\u1EDBp v\xE0 hi\u1EC3n th\u1ECB c\xE1c v\u1ECB tr\xED ch\xE8n t\u1EA1i \u0111\xE2y.
        </div>
      `;
      return;
    }
    this.matchedPositions.forEach((t) => {
      const e = document.createElement("div");
      e.className = "matched-card-item", e.id = `card-${t.id}`, e.innerHTML = `
        <div class="matched-card-top">
          <div class="matched-clip-time">
            <span class="badge-clip-id">${E(t.clipId)}</span>
            <span class="time-range-text">${t.startTime} -> ${t.endTime}</span>
          </div>
          <span class="match-percentage-badge">${t.matchPercentage}%</span>
        </div>
        <div class="matched-description-text">${E(t.description)}</div>
        <div class="matched-card-actions">
          <div style="font-size: 10px; color: var(--text-sub);">${t.durationSec} gi\xE2y</div>
          <div class="card-action-icons">
            <button class="icon-tool-mini" title="Ch\u1EA5p nh\u1EADn"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--color-green)"><polyline points="20 6 9 17 4 12"/></svg></button>
            <button class="icon-tool-mini" title="\u0110\u1ED5i B-roll kh\xE1c"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg></button>
            <button class="icon-tool-mini delete" title="X\xF3a ph\xE2n \u0111o\u1EA1n"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </div>
        </div>
      `, e.addEventListener("click", () => this.seekTo(t.startSec)), e.querySelector(".icon-tool-mini.delete").addEventListener("click", (i) => {
        i.stopPropagation(), this.matchedPositions = this.matchedPositions.filter((n) => n.id !== t.id), this.matchedCountTitleEl.textContent = `${this.matchedPositions.length} v\u1ECB tr\xED ch\xE8n`, this.renderMatchedList(), this.renderTimelineBrollBlocks(), this.updateXmlPreview(), this.updateWorkflowUI();
      }), this.matchedListEl.appendChild(e);
    });
  }
  renderFilmstrip() {
    if (this.trackArollFilmstripEl.innerHTML = "", !this.activeArollFile || this.totalDurationSec <= 0) return;
    const t = Math.round(this.totalDurationSec * this.pixelsPerSec), e = document.createElement("div");
    e.className = "aroll-video-clip", e.style.width = `${t}px`, e.title = `A-Roll Video: ${this.activeArollFile.name}`;
    const i = document.createElement("div");
    i.className = "aroll-clip-tag", i.textContent = `V1 \xB7 ${this.activeArollFile.name}`, e.appendChild(i);
    const s = Math.round(44 * (16 / 9)), r = Math.max(1, Math.ceil(t / s)), o = this.activeArollFile.thumb;
    for (let d = 0; d < r; d++) if (o) {
      const a = document.createElement("img");
      a.src = o, a.className = "filmstrip-frame", a.alt = `Frame ${d}`, e.appendChild(a);
    } else {
      const a = document.createElement("div");
      a.className = "filmstrip-frame", a.style.background = "#222", e.appendChild(a);
    }
    this.trackArollFilmstripEl.appendChild(e);
  }
  renderTimelineBrollBlocks() {
    this.trackBrollRowEl.innerHTML = "", this.matchedPositions.forEach((t) => {
      const e = document.createElement("div");
      e.className = "broll-timeline-block";
      const i = t.startSec * this.pixelsPerSec, n = Math.max(20, (t.endSec - t.startSec) * this.pixelsPerSec);
      e.style.left = `${i}px`, e.style.width = `${n}px`, e.title = `${t.clipId} (${t.startTime} -> ${t.endTime}) \xB7 ${t.matchPercentage}% match`, e.innerHTML = `
        <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${E(t.clipId)}</span>
        <span style="font-size: 8.5px; opacity: 0.85;">${t.durationSec}s</span>
      `, e.addEventListener("click", (s) => {
        s.stopPropagation(), this.seekTo(t.startSec);
      }), this.trackBrollRowEl.appendChild(e);
    });
  }
  drawWaveform() {
    if (!this.trackAudioWaveformEl || (this.trackAudioWaveformEl.innerHTML = "", !this.activeArollFile || this.totalDurationSec <= 0)) return;
    const t = Math.round(this.totalDurationSec * this.pixelsPerSec), e = document.createElement("div");
    e.className = "aroll-audio-clip", e.style.width = `${t}px`, e.title = `A-Roll Audio: ${this.activeArollFile.name}`;
    const i = document.createElement("div");
    i.className = "aroll-clip-tag", i.style.background = "rgba(20, 90, 160, 0.75)", i.textContent = "A1 \xB7 \xC2m thanh g\u1ED1c", e.appendChild(i);
    const n = document.createElement("canvas");
    n.className = "waveform-canvas", n.style.width = `${t}px`, n.style.height = "100%", e.appendChild(n), this.trackAudioWaveformEl.appendChild(e);
    const s = window.devicePixelRatio || 1;
    n.width = t * s, n.height = 48 * s;
    const r = n.getContext("2d"), o = n.width, d = n.height;
    r.clearRect(0, 0, o, d);
    const a = d / 2;
    r.fillStyle = "#3898ec";
    const c = 2.5 * s, h = 1.5 * s, m = Math.max(10, Math.floor(o / (c + h))), u = this.waveformPeaks || $.generateSimulatedWaveform(m);
    for (let g = 0; g < m; g++) {
      const f = g * (c + h), x = u[g % u.length] || 0.3, P = Math.max(2 * s, x * (d * 0.75));
      r.fillRect(f, a - P / 2, c, P);
    }
  }
  drawRuler() {
    const t = this.rulerCanvas;
    if (!t) return;
    const e = parseInt(this.timelineWrapper.style.minWidth) || 1800, i = window.devicePixelRatio || 1;
    t.width = e * i, t.height = 22 * i;
    const n = t.getContext("2d"), s = t.width, r = t.height;
    n.clearRect(0, 0, s, r), n.fillStyle = "#8e8e93", n.font = `${9 * i}px -apple-system, sans-serif`;
    let o = 10;
    this.pixelsPerSec > 10 ? o = 2 : this.pixelsPerSec > 5 ? o = 5 : this.pixelsPerSec > 2 ? o = 10 : o = 30;
    const d = Math.ceil(e / (this.pixelsPerSec || 2.4));
    for (let a = 0; a <= d; a += o) {
      const c = a * this.pixelsPerSec * i;
      if (c > s) break;
      const h = Math.floor(a / 60), m = Math.floor(a % 60), u = `${h}:${m.toString().padStart(2, "0")}`;
      n.fillStyle = "#8e8e93", n.fillRect(c, r - 8 * i, 1 * i, 8 * i), n.fillText(u, c + 3 * i, 11 * i);
      const g = o / 5;
      for (let f = g; f < o; f += g) {
        const x = (a + f) * this.pixelsPerSec * i;
        x < s && n.fillRect(x, r - 4 * window.devicePixelRatio, 1 * window.devicePixelRatio, 4 * window.devicePixelRatio);
      }
    }
  }
  updateXmlPreview() {
    var t;
    if (this.xmlPreviewCode) {
      if (this.matchedPositions.length === 0) {
        this.xmlPreviewCode.textContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.9">
  <!-- Ch\u01B0a c\xF3 clip B-roll n\xE0o \u0111\u01B0\u1EE3c gh\xE9p. H\xE3y n\u1EA1p video v\xE0 b\u1EA5m "Gh\xE9p l\u1EA1i" -->
</fcpxml>`;
        return;
      }
      const e = ((t = this.activeArollFile) == null ? void 0 : t.name) || "C4095.mov", i = this.exporter.generateFCPXML(this.matchedPositions.slice(0, 3), e, this.totalDurationSec);
      this.xmlPreviewCode.textContent = i.split(`
`).slice(0, 14).join(`
`) + `
    <!-- ... v\xE0 c\xE1c clip B-roll c\xF2n l\u1EA1i ... -->
  </library>
</fcpxml>`;
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  window.app = new Jt();
});
