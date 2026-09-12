import net from 'node:net';

export async function isPortAvailable(port, host = '127.0.0.1') {
  return new Promise(resolve => {
    const server = net.createServer();
    server.unref();
    server.once('error', () => resolve(false));
    server.listen({ port, host }, () => server.close(() => resolve(true)));
  });
}

export async function isCreatorUtilsApiRunning(url = 'http://127.0.0.1:8765/api/health') {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    const payload = await response.json();
    return response.ok
      && payload?.ok === true
      && Number(payload?.apiVersion) >= 7
      && Array.isArray(payload?.features)
      && payload.features.includes('semantic-broll');
  } catch {
    return false;
  }
}

export function formatPortError(port) {
  return `Cổng ${port} đang được sử dụng. Hãy đóng phiên CreatorUtils/Vite cũ hoặc đổi cổng trước khi chạy lại.`;
}
