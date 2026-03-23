import { expect, test } from '@playwright/test'

test('opens a task world and shows the seven core rooms', async ({ page }) => {
  await page.goto('/?mode=office')
  await page.getByRole('button', { name: 'Task Board' }).click()
  await page.mouse.move(8, 8)

  await expect(page.getByText('Reception')).toBeHidden()
  await expect(page.getByText('Amane Desk')).toBeHidden()
  await expect(page.getByText('Requirements Room')).toBeHidden()
  await expect(page.getByText('Planning Room')).toBeHidden()
  await expect(page.getByText('Execution Workshop')).toBeHidden()
  await expect(page.getByText('Review Checkpoint')).toBeHidden()
  await expect(page.getByText('Memory Archive')).toBeHidden()
  await expect(page.getByText('Amane', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Executor', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Reviewer', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reception' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Amane Desk' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Requirements Room' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Planning Room' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Execution Workshop' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Review Checkpoint' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Memory Archive' })).toBeVisible()

  const receptionHitArea = await page.getByRole('button', { name: 'Reception' }).boundingBox()
  expect(receptionHitArea?.width ?? 0).toBeGreaterThan(100)
  expect(receptionHitArea?.height ?? 0).toBeGreaterThan(55)

  await page.getByRole('button', { name: 'Reception' }).hover()
  await expect(page.getByText('Reception')).toBeVisible()

  const snapshot = await page.evaluate(() => {
    const render = window.render_game_to_text
    return render ? JSON.parse(render()) : null
  })

  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Amane')
  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Executor')
  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Reviewer')

  await page.getByRole('button', { name: 'Return to Main Office' }).click()
  await page.getByRole('button', { name: 'Meeting Room Whiteboard' }).click()
  await expect(page.getByText('Completed Lane')).toBeVisible()
  await expect(page.getByText('Delivered: Website Refresh', { exact: true })).toBeVisible()
})
