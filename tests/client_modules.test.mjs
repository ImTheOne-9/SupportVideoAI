import test from 'node:test';
import assert from 'node:assert/strict';
import { ClientBrollMatcher } from '../src/matcher_client.js';
import { ClientTimelineExporter } from '../src/exporter_client.js';
import { VideoImporter } from '../src/video_importer.js';

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
    { clipId: 'B1', clipName: 'cam & one.mp4', startSec: 3, endSec: 6, durationSec: 3 },
    { clipId: 'B1', clipName: 'cam & one.mp4', startSec: 8, endSec: 11, durationSec: 3 }
  ];
  const xml = exporter.generateFCPXML(placements, 'main & voice.mp4', 20);
  assert.match(xml, /A &amp; B/);
  assert.match(xml, /cam &amp; one\.mp4/);
  assert.equal((xml.match(/<asset id="r_broll_B1"/g) || []).length, 1);
  assert.equal((xml.match(/<asset-clip ref="r_broll_B1"/g) || []).length, 2);
});

test('phát hiện khoảng lặng từ waveform và giữ padding', () => {
  const peaks = [0.5, 0.5, 0.01, 0.01, 0.01, 0.01, 0.5, 0.5];
  const cuts = VideoImporter.detectSilenceRanges(peaks, 8, 2, 0.25);
  assert.equal(cuts.length, 1);
  assert.equal(cuts[0].startSec, 2.25);
  assert.equal(cuts[0].endSec, 5.75);
});
