import { test, expect, type Page } from '@playwright/test';
const user = {
  idUsuario: 1,
  dni: '12345678',
  nombre: 'Persona',
  apellido: 'Prueba',
  email: 'person@example.test',
  fechaNacimiento: null,
  rol: 'user',
};
const event = {
  idEvento: 1,
  fkIdClubLocal: 1,
  fkIdClubVisitante: 2,
  fkIdEstadio: 1,
  nombreLocal: 'Local',
  nombreVisitante: 'Visitante',
  fechaHora: '2030-01-01T20:00:00.000Z',
  estado: 'En Venta',
  nombreEstadio: 'Estadio',
  torneo: 'Liga',
  soloPublicoLocal: false,
  logoLocal: null,
  logoVisitante: null,
};
const offer = {
  idSector: 1,
  nombreSector: 'Popular',
  capacidad: 10,
  precio: '10.00',
  disponibles: 10,
};
const paged = (data: unknown[]) => ({
  data,
  pagination: { page: 1, limit: 100, total: data.length, totalPages: 1 },
});
async function mock(page: Page, admin = false) {
  await page.route('http://localhost:3000/api/**', async (route) => {
    const url = new URL(route.request().url()),
      path = url.pathname,
      method = route.request().method();
    if (method === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': '*',
        },
      });
      return;
    }
    let data: unknown;
    if (path === '/api/pagos/configuracion')
      data = { mode: 'mercadopago', purchasesEnabled: true };
    else if (path === '/api/auth/login')
      data = {
        token: 'test-token',
        user: { ...user, rol: admin ? 'admin' : 'user' },
      };
    else if (path === '/api/users/me')
      data = { ...user, rol: admin ? 'admin' : 'user' };
    else if (path === '/api/eventos/1/sectores') data = paged([offer]);
    else if (path === '/api/eventos/1') data = event;
    else if (path === '/api/eventos') data = paged([event]);
    else if (path === '/api/clubes')
      data = paged([
        { idClub: 1, nombre: 'Local', logoUrl: null },
        { idClub: 2, nombre: 'Visitante', logoUrl: null },
      ]);
    else if (path === '/api/estadios')
      data = paged([{ idEstadio: 1, nombre: 'Estadio' }]);
    else if (path === '/api/sectores')
      data = paged([
        { idSector: 1, nombreSector: 'Popular', fkIdEstadio: 1, capacidad: 10 },
      ]);
    else if (path === '/api/users/me/entradas') data = [];
    else data = { code: 'NOT_FOUND', message: 'No encontrado' };
    await route.fulfill({
      status: 200,
      json: data,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  });
}
test('anonymous selection survives login and reload, and checkout uses numeric IDs and idempotency', async ({
  page,
}) => {
  await mock(page);
  await page.goto('/evento/1');
  await page.getByLabel('Sector', { exact: true }).selectOption('1');
  await page.getByLabel('Cantidad', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Continuar con la compra' }).click();
  await expect(page).toHaveURL(/login/);
  await page.getByPlaceholder('Correo electrónico').fill(user.email);
  await page.getByPlaceholder('Ingresar contraseña').fill('password123');
  await page.locator('form button[type="submit"]').click();
  await expect(page).toHaveURL(/evento\/1\/comprar/);
  await page.reload();
  await expect(page.getByText('Popular · 2 entradas')).toBeVisible();
  let body: unknown, key: string | undefined;
  await page.route(
    'http://localhost:3000/api/pagos/crear-preferencia',
    async (route) => {
      if (route.request().method() === 'OPTIONS') {
        await route.fallback();
        return;
      }
      body = route.request().postDataJSON();
      key = route.request().headers()['idempotency-key'];
      await route.fulfill({
        json: {
          idCompra: 5,
          preferenceId: 'pref',
          checkoutUrl:
            'http://127.0.0.1:5174/compra-exitosa?external_reference=5',
          expiresAt: '2030-01-01',
        },
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    },
  );
  await page.getByRole('button', { name: 'Pagar con Mercado Pago' }).click();
  await expect(page).toHaveURL(/compra-exitosa/);
  expect(body).toEqual({ eventoId: 1, sectorId: 1, quantity: 2 });
  expect(key).toMatch(/^[a-f0-9-]{36}$/);
});
test('return page waits for server confirmation before showing tickets', async ({
  page,
}) => {
  await mock(page);
  await page.addInitScript(() => localStorage.setItem('token', 'test-token'));
  let completed = false;
  await page.route('http://localhost:3000/api/pagos/compras/5', (route) =>
    route.fulfill({
      json: {
        idCompra: 5,
        estado: completed ? 'completada' : 'pendiente',
        montoTotal: '10.00',
        moneda: 'ARS',
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
  );
  await page.route('http://localhost:3000/api/pagos/entradas/5', (route) =>
    route.fulfill({
      json: [
        {
          idEntrada: 1,
          codigoQr: 'f640c60f-bc1c-4f38-9b96-c9f685c670fd',
          fechaHora: event.fechaHora,
          idEvento: 1,
          nombreLocal: 'Local',
          nombreVisitante: 'Visitante',
          nombreSector: 'Popular',
        },
      ],
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
  );
  await page.goto('/compra-exitosa?external_reference=5');
  await expect(
    page.getByRole('heading', {
      name: 'Estamos esperando la confirmación del pago',
    }),
  ).toBeVisible();
  await expect(page.locator('.entrada-card')).toHaveCount(0);
  completed = true;
  await expect(
    page.getByRole('heading', { name: 'Tu compra se realizó con éxito' }),
  ).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.entrada-card svg')).toHaveCount(1);
});
test('ordinary users cannot open admin routes', async ({ page }) => {
  await mock(page);
  await page.addInitScript(() => localStorage.setItem('token', 'test-token'));
  await page.goto('/admin');
  await expect(page.getByRole('alert')).toContainText('No tenés permisos');
});
test('admin events page loads real fields and price configuration', async ({
  page,
}) => {
  await mock(page, true);
  await page.addInitScript(() => localStorage.setItem('token', 'test-token'));
  await page.goto('/admin/EditarEvento');
  await expect(
    page.getByRole('heading', { name: 'Eventos y precios' }),
  ).toBeVisible();
  await expect(
    page.getByRole('cell', { name: 'Local vs Visitante' }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Editar', exact: true })
    .first()
    .click();
  await expect(page.getByLabel('Club local', { exact: true })).toHaveValue('1');
});
