export const translations = {
  vi: {
    transcript: 'Bản ghi lời', cut: 'Cắt', segment: 'Phân đoạn', broll: 'B‑Roll', export: 'Xuất',
    smartEdit: 'Dựng thông minh', transcription: 'Chép lời', transcribe: 'Chép lời', reviewTranscript: 'Xem lại bản ghi lời',
    aiTools: 'Công cụ AI', chapters: 'Tự động tạo chương', summary: 'Tự động tóm tắt', adCheck: 'Kiểm tra quảng cáo',
    metadata: 'Tự động tạo metadata', translate: 'Dịch', mediaTools: 'Công cụ media', thumbnails: 'Trích xuất ảnh thu nhỏ',
    audio: 'Trích xuất âm thanh', autoCut: 'Tự động cắt', finishedExport: 'Xuất thành phẩm', settings: 'Cài đặt',
    settingsSubtitle: 'Quản lý chép lời, mô hình cục bộ và dịch vụ AI.', general: 'Chung', models: 'Mô hình chép lời', services: 'Dịch vụ AI'
  },
  en: {
    transcript: 'Transcript', cut: 'Cut', segment: 'Chapters', broll: 'B‑Roll', export: 'Export',
    smartEdit: 'Smart Edit', transcription: 'Transcription', transcribe: 'Transcribe', reviewTranscript: 'Review Transcript',
    aiTools: 'AI Tools', chapters: 'Generate Chapters', summary: 'Automatic Summary', adCheck: 'Ad Compliance Check',
    metadata: 'Generate Metadata', translate: 'Translate', mediaTools: 'Media Tools', thumbnails: 'Extract Thumbnails',
    audio: 'Extract Audio', autoCut: 'Automatic Cut', finishedExport: 'Export Project', settings: 'Settings',
    settingsSubtitle: 'Manage transcription, local models, and AI services.', general: 'General', models: 'Speech Models', services: 'AI Services'
  }
};

export function applyLanguage(language = 'vi', root = document) {
  const selected = translations[language] ? language : 'vi';
  document.documentElement.lang = selected;
  root.querySelectorAll('[data-i18n]').forEach(element => {
    const value = translations[selected][element.dataset.i18n];
    if (value) element.textContent = value;
  });
  return selected;
}

