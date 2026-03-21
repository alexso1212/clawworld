import { expect, test } from '@playwright/test'

test('opens a task world and shows the seven core rooms', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Task Board' }).click()

  await expect(page.getByText('Reception')).toBeVisible()
  await expect(page.getByText('Amane Desk')).toBeVisible()
  await expect(page.getByText('Requirements Room')).toBeVisible()
  await expect(page.getByText('Planning Room')).toBeVisible()
  await expect(page.getByText('Execution Workshop')).toBeVisible()
  await expect(page.getByText('Review Checkpoint')).toBeVisible()
  await expect(page.getByText('Memory Archive')).toBeVisible()
  await expect(page.getByText('Amane', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Executor', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Reviewer', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()

  const snapshot = await page.evaluate(() => {
    const render = window.render_game_to_text
    return render ? JSON.parse(render()) : null
  })

  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Amane')
  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Executor')
  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Reviewer')

  await page.getByText('Return to Main Office').click()
  await page.getByText('Meeting Room Whiteboard').click()
  await expect(page.getByText('Completed Lane')).toBeVisible()
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()
})
