import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://dev.marathon.rplearn.net/renta_ueno/customer/add.html');
  await page.getByRole('textbox', { name: '会社名:' }).click();
  await page.getByRole('textbox', { name: '会社名:' }).fill('株式会社');
  await page.getByRole('textbox', { name: '会社名:' }).press('Enter');
  await page.getByRole('textbox', { name: '業種:' }).click();
  await page.getByRole('textbox', { name: '業種:' }).fill('エンジニア');
  await page.getByRole('textbox', { name: '業種:' }).press('Enter');
  await page.getByRole('textbox', { name: '連絡先:' }).click();
  await page.getByRole('textbox', { name: '連絡先:' }).fill('000-0000-0100');
  await page.getByRole('textbox', { name: '連絡先:' }).press('Enter');
  await page.getByRole('textbox', { name: '所在地:' }).click();
  await page.getByRole('textbox', { name: '所在地:' }).fill('東京');
  await page.getByRole('textbox', { name: '所在地:' }).press('Enter');
  await page.getByRole('button', { name: '確認' }).click();
  await page.getByRole('button', { name: '保存' }).click();
  // page.once('dialog', dialog => {
  //   console.log(`Dialog message: ${dialog.message()}`);
  //   dialog.dismiss().catch(() => {});
  // });
  // await page.getByRole('button', { name: '保存' }).click();
});
