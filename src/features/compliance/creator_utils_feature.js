import { escapeHtml } from '../../shared/html.js';

const E = escapeHtml;

export const complianceFeature = {
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
  },
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
  },
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
};
