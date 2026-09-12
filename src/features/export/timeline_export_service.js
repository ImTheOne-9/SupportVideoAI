/** Application service cho file timeline tải xuống từ canonical backend exporter. */
export class TimelineExportService {
  constructor(apiClient, downloadFile) {
    this.api = apiClient;
    this.downloadFile = downloadFile;
  }

  async serialize(format, project) {
    const result = await this.api.exportTimeline({
      format,
      projectName: project.name,
      arollName: project.arollName,
      totalDurationSec: project.totalDurationSec,
      placements: project.placements,
      cuts: project.cuts,
      fps: project.fps ?? 30,
      width: project.width ?? 3840,
      height: project.height ?? 2160,
    });
    if (!result?.content || !result?.filename) {
      throw new Error('AI engine không trả về file timeline hợp lệ.');
    }
    return result;
  }

  async export(format, project) {
    const result = await this.serialize(format, project);
    this.downloadFile(result.filename, result.content, 'application/xml');
    return result;
  }
}
