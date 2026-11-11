import { test, expect } from '@playwright/test';
test('real API and MySQL: admin configures sale, buyer logs in and receives tickets', async ({
  page,
  request,
}, testInfo) => {
  const external: string[] = [];
  page.on('request', (r) => {
    if (
      new URL(r.url()).hostname.endsWith('mercadopago.com') ||
      new URL(r.url()).hostname.includes('mercadopago.')
    )
      external.push(r.url());
  });
  const base = 'http://127.0.0.1:5180/api';
  const auth = await request.post(base + '/auth/login', {
    data: { email: 'admin@kicket.test', password: 'password123' },
  });
  expect(auth.ok()).toBeTruthy();
  const headers = { Authorization: 'Bearer ' + (await auth.json()).token };
  const create = async (path: string, data: unknown) => {
    const r = await request.post(base + path, { headers, data });
    expect(r.status(), await r.text()).toBe(201);
    return r.json();
  };
  const home = await create('/clubes', { nombre: 'Local E2E' }),
    away = await create('/clubes', { nombre: 'Visitante E2E' });
  const stadium = await create('/estadios', {
    nombre: 'Estadio E2E',
    ciudad: 'Rosario',
  });
  const sector = await create('/sectores', {
    fkIdEstadio: stadium.idEstadio,
    nombreSector: 'Popular E2E',
    capacidad: 2,
  });
  const event = await create('/eventos', {
    fkIdClubLocal: home.idClub,
    fkIdClubVisitante: away.idClub,
    fkIdEstadio: stadium.idEstadio,
    fechaHora: '2030-01-01T20:00:00Z',
    estado: 'Programado',
  });
  await create('/precios', {
    fkIdEvento: event.idEvento,
    fkIdSector: sector.idSector,
    precio: '10.00',
  });
  const sale = await request.put(base + '/eventos/' + event.idEvento, {
    headers,
    data: { estado: 'En Venta' },
  });
  expect(sale.ok(), await sale.text()).toBeTruthy();
  expect((await sale.json()).fechaHora).toBe('2030-01-01T20:00:00.000Z');
  const registered = await request.post(base + '/auth/register', {
    data: {
      dni: '12345678',
      nombre: 'Comprador',
      apellido: 'Prueba',
      email: 'buyer@kicket.test',
      password: 'password123',
    },
  });
  expect(registered.status()).toBe(201);
  await page.goto('/evento/' + event.idEvento);
  await page
    .getByLabel('Sector', { exact: true })
    .selectOption(String(sector.idSector));
  await page.getByLabel('Cantidad', { exact: true }).fill('2');
  await page.screenshot({
    path: testInfo.outputPath('event.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Continuar con la compra' }).click();
  await page.getByPlaceholder('Correo electrónico').fill('buyer@kicket.test');
  await page.getByPlaceholder('Ingresar contraseña').fill('password123');
  await page.locator('form button[type="submit"]').click();
  await expect(page.getByText('Popular E2E · 2 entradas')).toBeVisible();
  await page.getByRole('button', { name: 'Continuar al pago demo' }).click();
  await expect(
    page.getByRole('heading', { name: 'Simulador de pago' }),
  ).toBeVisible();
  await expect(page.getByRole('note')).toContainText(
    'Pago simulado, sin cobros reales',
  );
  await page.getByRole('button', { name: 'Dejar pendiente' }).click();
  await expect(
    page.getByRole('heading', {
      name: 'Estamos esperando la confirmación del pago',
    }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Volver al pago demo' }).click();
  await page.getByRole('button', { name: 'Rechazar pago' }).click();
  await expect(
    page.getByRole('heading', { name: 'El pago fue rechazado' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Volver al pago demo' }).click();
  await page.reload();
  await page.screenshot({
    path: testInfo.outputPath('demo.png'),
    fullPage: true,
  });
  await page.getByRole('button', { name: 'Aprobar pago' }).click();
  await expect(
    page.getByRole('heading', { name: 'Tu compra se realizó con éxito' }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.entrada-card')).toHaveCount(2);
  await expect(
    page.getByText('Entrada demo · sin validez para ingreso', { exact: true }),
  ).toHaveCount(2);
  await expect(page.locator('.entrada-card svg')).toHaveCount(2);
  await page.screenshot({
    path: testInfo.outputPath('tickets.png'),
    fullPage: true,
  });
  await page.getByRole('link', { name: 'Mis entradas', exact: true }).click();
  await expect(page.locator('.entrada-card')).toHaveCount(2);
  const occupied = await request.get(
    base + '/eventos/' + event.idEvento + '/sectores',
  );
  expect((await occupied.json()).data[0].disponibles).toBe(0);
  const restricted = await request.put(base + '/sectores/' + sector.idSector, {
    headers,
    data: { capacidad: 1 },
  });
  expect(restricted.status()).toBe(409);
  expect(external).toEqual([]);
});
