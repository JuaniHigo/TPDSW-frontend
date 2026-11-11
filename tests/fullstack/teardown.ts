import { request } from '@playwright/test';
export default async function teardown() {
  const api = await request.newContext();
  try {
    const response = await api.post('http://127.0.0.1:5180/test-cleanup', {
      timeout: 10000,
    });
    if (!response.ok())
      throw new Error('No se pudo limpiar la base temporal de Playwright');
  } finally {
    await api.dispose();
  }
}
