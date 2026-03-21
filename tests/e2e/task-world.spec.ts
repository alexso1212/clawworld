import { expect, test } from '@playwright/test'

test('opens a task world and shows the seven core rooms', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Portal: Website Refresh').click()

  await expect(page.getByText('Reception')).toBeVisible()
  await expect(page.getByText('Amane Desk')).toBeVisible()
  await expect(page.getByText('Requirements Room')).toBeVisible()
  await expect(page.getByText('Planning Room')).toBeVisible()
  await expect(page.getByText('Execution Workshop')).toBeVisible()
  await expect(page.getByText('Review Checkpoint')).toBeVisible()
  await expect(page.getByText('Memory Archive')).toBeVisible()
  await expect(page.getByText('Amane', { exact: true })).toBeVisible()
  await expect(page.getByText('Executor', { exact: true })).toBeVisible()
  await expect(page.getByText('Reviewer', { exact: true })).toBeVisible()
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()

  await page.getByText('Return to Main Office').click()
  await page.getByText('Meeting Room Whiteboard').click()
  await expect(page.getByText('Completed Lane')).toBeVisible()
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()
})
