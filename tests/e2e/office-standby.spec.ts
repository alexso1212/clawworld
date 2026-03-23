import { expect, test } from '@playwright/test'

test('shows the office standby scene with desks, finance room, and wall display', async ({
  page,
}) => {
  await page.goto('/?mode=office')

  await expect(page.getByText('CLAWWORLD')).toBeVisible()
  await expect(page.getByText('Task Board')).toBeHidden()
  await expect(page.getByText('Meeting Room Whiteboard')).toBeHidden()
  await expect(page.getByText('Office Feed')).toHaveCount(0)
  await expect(page.getByText('Tea Bar')).toHaveCount(0)
  await expect(page.getByText('Support Hall')).toHaveCount(0)
  await expect(page.getByText('Wall Screen')).toHaveCount(0)
  await expect(page.getByText('Amane')).toHaveCount(0)
  await expect(page.getByText('Walk to a board to open the queue.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Task Board' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Meeting Room Whiteboard' })).toBeVisible()

  const taskBoardHitArea = await page.getByRole('button', { name: 'Task Board' }).boundingBox()
  expect(taskBoardHitArea?.width ?? 0).toBeGreaterThan(90)
  expect(taskBoardHitArea?.height ?? 0).toBeGreaterThan(50)

  const meetingBoardHitArea = await page
    .getByRole('button', { name: 'Meeting Room Whiteboard' })
    .boundingBox()
  expect(meetingBoardHitArea?.width ?? 0).toBeGreaterThan(60)
  expect(meetingBoardHitArea?.height ?? 0).toBeGreaterThan(40)

  await page.getByRole('button', { name: 'Task Board' }).hover()
  await expect(page.getByText('Task Board')).toBeVisible()

  const snapshot = await page.evaluate(() => {
    const render = window.render_game_to_text
    return render ? JSON.parse(render()) : null
  })

  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Main Office')

  await page.getByRole('button', { name: 'Meeting Room Whiteboard' }).click()
  await expect(page.getByText('Team Task Board')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Boss Office Whiteboard' })).toBeVisible()
})
