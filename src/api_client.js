/** Client cho AI engine chạy cục bộ. API key chỉ được gửi tới localhost và không lưu trong browser. */
export class ApiClient {
  constructor(baseUrl = window.CREATORUTILS_API_URL || 'http://127.0.0.1:8765') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request(path, options = {}, timeoutMs = 120000) {
    if (this.timeoutMs && timeoutMs === 120000) timeoutMs = this.timeoutMs;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        ...options,
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404 && path.startsWith('/api/projects')) {
          throw new Error('AI engine đang chạy phiên bản cũ. Hãy dừng terminal API và chạy lại: npm run api');
        }
        if (response.status === 404 && path === '/api/summarize') {
          throw new Error('AI engine đang chạy phiên bản cũ. Hãy dừng terminal API và chạy lại: npm run api');
        }
        if (response.status === 404 && path === '/api/metadata') {
          throw new Error('AI engine đang chạy phiên bản cũ. Hãy dừng terminal API và chạy lại: npm run api');
        }
        if (response.status === 404 && path === '/api/ad-compliance') {
          throw new Error('AI engine đang chạy phiên bản cũ. Hãy dừng terminal API và chạy lại: npm run api');
        }
        throw new Error(payload.error || `AI engine trả về HTTP ${response.status}`);
      }
      return payload;
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('AI engine phản hồi quá thời gian chờ.');
      if (error instanceof TypeError) {
        throw new Error('Không kết nối được AI engine qua frontend. Hãy kiểm tra cả hai terminal và tải lại trang.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  health() {
    return this.request('/api/health', {}, 5000);
  }

  setGeminiKey(apiKey) {
    return this.request('/api/config/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey })
    });
  }

  getSettings() { return this.request('/api/settings', {}, 10000); }

  saveSettings(settings) {
    return this.request('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    }, 10000);
  }

  listWhisperModels() { return this.request('/api/models/whisper', {}, 15000); }

  downloadWhisperModel(modelId) {
    return this.request('/api/models/whisper/download', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId })
    }, 60 * 60 * 1000);
  }

  deleteWhisperModel(modelId) {
    return this.request(`/api/models/whisper/${encodeURIComponent(modelId)}`, { method: 'DELETE' }, 60000);
  }

  transcribe(file, language = 'vi') {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('language', language);
    return this.request('/api/transcribe', { method: 'POST', body }, 30 * 60 * 1000);
  }

  async *transcribeStream(file, language = 'vi') {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('language', language);
    let response;
    try {
      response = await fetch(`${this.baseUrl}/api/transcribe-stream`, { method: 'POST', body });
    } catch (error) {
      throw new Error('Không kết nối được AI engine để chép lời.');
    }
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `Whisper trả về HTTP ${response.status}`);
    }
    if (!response.body) throw new Error('Trình duyệt không hỗ trợ đọc kết quả streaming.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        const event = JSON.parse(line);
        if (event.type === 'error') throw new Error(event.error);
        yield event;
      }
      if (done) break;
    }
    if (buffer.trim()) {
      const event = JSON.parse(buffer);
      if (event.type === 'error') throw new Error(event.error);
      yield event;
    }
  }

  indexBroll({ imageDataUrl, clipId, filename, durationSec, guidance }) {
    return this.request('/api/index-broll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageDataUrl, clipId, filename, durationSec, guidance })
    });
  }

  segment(transcripts, guidance = '') {
    return this.request('/api/segment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcripts, guidance })
    });
  }

  summarize(transcripts, options = {}) {
    return this.request('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcripts, ...options })
    });
  }

  generateMetadata(transcripts, options = {}) {
    return this.request('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcripts, ...options })
    });
  }

  checkAdCompliance(transcripts, options = {}) {
    return this.request('/api/ad-compliance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcripts, ...options })
    });
  }

  saveProject(project) {
    return this.request('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project)
    });
  }

  listProjects() {
    return this.request('/api/projects');
  }

  getProject(projectId) {
    return this.request(`/api/projects/${encodeURIComponent(projectId)}`);
  }

  deleteProject(projectId) {
    return this.request(`/api/projects/${encodeURIComponent(projectId)}`, { method: 'DELETE' });
  }
}
