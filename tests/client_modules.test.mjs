import test from 'node:test';
import assert from 'node:assert/strict';
import { ClientBrollMatcher } from '../src/matcher_client.js';
import { ClientTimelineExporter } from '../src/exporter_client.js';
import { VideoImporter } from '../src/video_importer.js';
import { EditDecisionList } from '../src/edit_decision.js';
import { translations } from '../src/i18n.js';
import { ApiClient } from '../src/api_client.js';
import { TimelineExportService } from '../src/features/export/timeline_export_service.js';

test('matcher dùng transcript để chọn clip liên quan', () => {
  const matcher = new ClientBrollMatcher({
    minDuration: 3, maxDuration: 8, coverageRatio: 0.7, introHoldSec: 3, only16_9: true
  });
  const clips = [
    { id: 'B001', name: 'dock.mp4', durationSec: 8, aspectRatio: '16:9', description: 'Trạm sạc tự giặt', subjects: ['trạm sạc'], tags: ['sạc'] },
    { id: 'B002', name: 'brush.mp4', durationSec: 8, aspectRatio: '16:9', description: 'Con lăn và chổi quét', subjects: ['con lăn'], tags: ['chổi'] }
  ];
  const transcript = [{ startSec: 3, endSec: 12, text: 'Đây là trạm sạc tự giặt của robot' }];
  const placements = matcher.reMatch(clips, 12, transcript);
  assert.equal(placements[0].clipId, 'B001');
  assert.equal(placements[0].clipName, 'dock.mp4');
});

test('matcher lọc nghiêm ngặt video 16:9', () => {
  const matcher = new ClientBrollMatcher({ only16_9: true });
  const placements = matcher.reMatch([
    { id: 'V1', durationSec: 8, aspectRatio: '9:16', description: 'dọc' }
  ], 20, [{ startSec: 3, endSec: 15, text: 'video' }]);
  assert.deepEqual(placements, []);
});

test('FCPXML escape tên file và không lặp resource', () => {
  const exporter = new ClientTimelineExporter('A & B', 30);
  const placements = [
    { clipId: 'B1', clipName: 'cam & one.mp4', startSec: 3, endSec: 6, durationSec: 3, sourceInSec: 4, sourceOutSec: 7, sourceDurationSec: 20 },
    { clipId: 'B1', clipName: 'cam & one.mp4', startSec: 8, endSec: 11, durationSec: 3 }
  ];
  const xml = exporter.generateFCPXML(placements, 'main & voice.mp4', 20);
  assert.match(xml, /A &amp; B/);
  assert.match(xml, /cam &amp; one\.mp4/);
  assert.equal((xml.match(/<asset id="r_broll_B1"/g) || []).length, 1);
  assert.equal((xml.match(/<asset-clip ref="r_broll_B1"/g) || []).length, 2);
  assert.match(xml, /start="120\/30s"/);
  const premiere = exporter.generatePremiereXML(placements, 'main & voice.mp4', 20);
  assert.match(premiere, /<in>120<\/in><out>210<\/out>/);
  const cutXml = exporter.generateFCPXML(placements, 'main.mp4', 20, [{ startSec: 5, endSec: 9, status: 'active' }]);
  assert.match(cutXml, /<asset id="r_aroll"[^>]+duration="600\/30s"/);
  assert.match(cutXml, /<sequence[^>]+duration="480\/30s"/);
});

test('phát hiện khoảng lặng từ waveform và giữ padding', () => {
  const peaks = [0.5, 0.5, 0.01, 0.01, 0.01, 0.01, 0.5, 0.5];
  const cuts = VideoImporter.detectSilenceRanges(peaks, 8, 2, 0.25);
  assert.equal(cuts.length, 1);
  assert.equal(cuts[0].startSec, 2.25);
  assert.equal(cuts[0].endSec, 5.75);
});

test('scene detection tạo các cảnh tại thay đổi lớn và giữ đúng biên', () => {
  const scenes = VideoImporter.detectScenesFromSignatures([
    { timeSec: 0, signature: [0.1, 0.1, 0.1] },
    { timeSec: 2, signature: [0.11, 0.1, 0.1] },
    { timeSec: 4, signature: [0.8, 0.8, 0.8] },
    { timeSec: 6, signature: [0.81, 0.8, 0.8] },
    { timeSec: 8, signature: [0.2, 0.2, 0.2] }
  ], 10, { threshold: 0.18, minSceneSec: 1.5 });
  assert.equal(scenes.length, 3);
  assert.deepEqual(scenes.map(scene => [scene.startSec, scene.endSec]), [[0, 4], [4, 8], [8, 10]]);
  assert.equal(scenes[1].keyframeSec, 6);
});

test('scene detection bỏ qua rung nhẹ và giới hạn số cảnh', () => {
  const quiet = VideoImporter.detectScenesFromSignatures([
    { timeSec: 0, signature: [0.1, 0.1] },
    { timeSec: 2, signature: [0.12, 0.11] },
    { timeSec: 4, signature: [0.13, 0.1] }
  ], 6, { threshold: 0.18 });
  assert.equal(quiet.length, 1);

  const noisy = Array.from({ length: 8 }, (_, index) => ({ timeSec: index, signature: [index % 2, index % 2] }));
  const limited = VideoImporter.detectScenesFromSignatures(noisy, 8, { threshold: 0.2, minSceneSec: 0.5, maxScenes: 3 });
  assert.equal(limited.length, 3);
  assert.equal(limited.at(-1).endSec, 8);
});

test('EDL hợp nhất cut overlap và tính đúng timeline A-Roll mới', () => {
  const kept = EditDecisionList.keptSegments([
    { startSec: 2, endSec: 4, status: 'active' },
    { startSec: 3.5, endSec: 5, status: 'active' },
    { startSec: 8, endSec: 9, status: 'active' }
  ], 12);
  assert.deepEqual(kept, [
    { sourceStartSec: 0, sourceEndSec: 2, timelineStartSec: 0, timelineEndSec: 2, durationSec: 2 },
    { sourceStartSec: 5, sourceEndSec: 8, timelineStartSec: 2, timelineEndSec: 5, durationSec: 3 },
    { sourceStartSec: 9, sourceEndSec: 12, timelineStartSec: 5, timelineEndSec: 8, durationSec: 3 }
  ]);
});

test('EDL remap placement và loại placement bắt đầu trong vùng bị cắt', () => {
  const kept = EditDecisionList.keptSegments([{ startSec: 5, endSec: 8, status: 'active' }], 15);
  const remapped = EditDecisionList.remapPlacements([
    { id: 'keep', startSec: 9, endSec: 13, durationSec: 4 },
    { id: 'drop', startSec: 6, endSec: 9, durationSec: 3 }
  ], kept);
  assert.equal(remapped.length, 1);
  assert.equal(remapped[0].startSec, 6);
  assert.equal(remapped[0].endSec, 10);
});

test('i18n Việt và Anh có cùng tập khóa', () => {
  assert.deepEqual(Object.keys(translations.vi).sort(), Object.keys(translations.en).sort());
  assert.equal(translations.en.settings, 'Settings');
  assert.equal(translations.vi.transcript, 'Bản ghi lời');
});

test('API client gửi export contract tới canonical backend exporter', async () => {
  const client = new ApiClient('http://127.0.0.1:8765');
  let captured;
  client.request = async (path, options) => {
    captured = { path, options };
    return { content: '<fcpxml/>', filename: 'test.fcpxml' };
  };
  const result = await client.exportTimeline({ format: 'fcpxml', totalDurationSec: 10 });
  assert.equal(captured.path, '/api/export');
  assert.equal(captured.options.method, 'POST');
  assert.deepEqual(JSON.parse(captured.options.body), { format: 'fcpxml', totalDurationSec: 10 });
  assert.equal(result.filename, 'test.fcpxml');
});

test('TimelineExportService validate response và tải file XML', async () => {
  const downloads = [];
  const service = new TimelineExportService({
    exportTimeline: async payload => ({ filename: `${payload.format}.xml`, content: '<xml/>' })
  }, (...args) => downloads.push(args));
  const result = await service.export('premiere', {
    name: 'Demo', arollName: 'main.mp4', totalDurationSec: 10, placements: [], cuts: []
  });
  assert.equal(result.filename, 'premiere.xml');
  assert.deepEqual(downloads, [['premiere.xml', '<xml/>', 'application/xml']]);
});

test('TimelineExportService dùng cùng backend serializer cho preview mà không tải file', async () => {
  const downloads = [];
  const service = new TimelineExportService({
    exportTimeline: async payload => ({ filename: `${payload.format}.fcpxml`, content: '<fcpxml/>' })
  }, (...args) => downloads.push(args));
  const result = await service.serialize('fcpxml', {
    name: 'Preview', arollName: 'main.mp4', totalDurationSec: 12, placements: [], cuts: []
  });
  assert.equal(result.content, '<fcpxml/>');
  assert.deepEqual(downloads, []);
});
