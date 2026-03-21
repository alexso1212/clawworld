import { expect, test } from '@playwright/test'

test('shows the office standby scene with desks, finance room, and wall display', async ({
  page,
}) => {
  await page.goto('/')

  await expect(page.getByText('Main Office')).toBeVisible()
  await expect(page.getByText('Task Board')).toBeVisible()
  await expect(page.getByText('Meeting Room Whiteboard')).toBeVisible()
  await expect(page.getByText('Office Feed')).toHaveCount(0)
  await expect(page.getByText('Tea Bar')).toHaveCount(0)
  await expect(page.getByText('Support Hall')).toHaveCount(0)
  await expect(page.getByText('Wall Screen')).toHaveCount(0)
  await expect(page.getByText('Amane')).toHaveCount(0)

  await page.getByText('Meeting Room Whiteboard').click()
  await expect(page.getByText('Team Task Board')).toBeVisible()
  await expect(page.getByText('Boss Office Whiteboard')).toBeVisible()
})
