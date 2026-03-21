import { expect, test } from '@playwright/test'

test('shows the office standby scene with desks, finance room, and wall display', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByText('CLAWWORLD')).toBeVisible()
  await expect(page.getByText('Task Board')).toBeVisible()
  await expect(page.getByText('Meeting Room Whiteboard')).toBeVisible()
  await expect(page.getByText('Office Feed')).toHaveCount(0)
  await expect(page.getByText('Tea Bar')).toHaveCount(0)
  await expect(page.getByText('Support Hall')).toHaveCount(0)
  await expect(page.getByText('Wall Screen')).toHaveCount(0)
  await expect(page.getByText('Amane')).toHaveCount(0)
  await expect(page.getByText('Walk to a board to open the queue.')).toBeVisible()

  const snapshot = await page.evaluate(() => {
    const render = window.render_game_to_text
    return render ? JSON.parse(render()) : null
  })

  expect(snapshot?.markers.map((marker: { label: string }) => marker.label)).not.toContain('Main Office')

  await page.getByText('Meeting Room Whiteboard').click()
  await expect(page.getByText('Team Task Board')).toBeVisible()
  await expect(page.getByText('Boss Office Whiteboard')).toBeVisible()
})
