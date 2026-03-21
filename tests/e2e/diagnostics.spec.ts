import { expect, test } from '@playwright/test'

test('shows infrastructure warnings and opens a triage card', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Finance Warning')).toHaveCount(0)
  await expect(page.getByText('Bridge Route')).toHaveCount(0)
  await expect(page.getByText('Tool Locker')).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Finance Warning' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Bridge Route' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Tool Locker' })).toBeVisible()

  await page.getByText('!', { exact: true }).first().click()
  await expect(page.getByText('What happened')).toBeVisible()
  await expect(page.getByText('Impact')).toBeVisible()
  await expect(page.getByText('Check first')).toBeVisible()
})
