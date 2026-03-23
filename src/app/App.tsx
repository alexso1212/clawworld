import { LibraryShellApp } from '../library/LibraryShellApp'
import { OfficeWorldApp } from './OfficeWorldApp'

function resolveExperienceMode(locationLike = window.location) {
  const params = new URLSearchParams(locationLike.search)
  return params.get('mode') === 'office' ? 'office' : 'library'
}

export default function App() {
  return resolveExperienceMode() === 'office' ? <OfficeWorldApp /> : <LibraryShellApp />
}
