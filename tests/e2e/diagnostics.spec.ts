import { expect, test } from '@playwright/test'

test('shows infrastructure warnings and opens a triage card', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Finance Warning')).toBeVisible()
  await expect(page.getByText('Bridge Route')).toBeVisible()
  await expect(page.getByText('Tool Locker')).toBeVisible()

  await page.getByText('!', { exact: true }).first().click()
  await expect(page.getByText('What happened')).toBeVisible()
  await expect(page.getByText('Impact')).toBeVisible()
  await expect(page.getByText('Check first')).toBeVisible()
})
