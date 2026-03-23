import { expect, test } from '@playwright/test'

test('shows the clawlibrary shell by default and updates asset preview', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('ClawLibrary')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Alarm Board' })).toBeVisible()
  await expect(page.getByText('Preview Shelf')).toBeVisible()
  await expect(page.getByLabel('Asset preview')).toContainText('Watch Slip')
  await expect(page.getByLabel('Library status rail')).toContainText('Mock Feed')

  await page.getByRole('button', { name: 'Code Lab' }).click()
  await page.getByRole('button', { name: 'Route Pressure Map' }).click()

  await expect(page.getByLabel('Asset preview')).toContainText('Route Pressure Map')
  await expect(page.getByLabel('Asset preview')).toContainText('queue bottlenecks')
})
