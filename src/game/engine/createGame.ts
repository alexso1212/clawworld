import Phaser from 'phaser'
import type { ClawworldRuntimeSession } from '../../adapters/openclaw/types'
import { LibraryScene } from '../../library/scene/LibraryScene'
import { LIBRARY_SCENE_HEIGHT, LIBRARY_SCENE_WIDTH } from '../../library/data/libraryShellManifest'
import type { SceneBridge } from './sceneBridge'
import { MainOfficeScene } from '../scenes/MainOfficeScene'
import { TaskWorldScene } from '../scenes/TaskWorldScene'

export function createGame(
  host: HTMLDivElement,
  bridge: SceneBridge,
  sceneView: 'library-shell' | 'main-office' | 'task-world',
  runtimeSession?: ClawworldRuntimeSession,
  selectedRoomId?: string,
) {
  const scene =
    sceneView === 'library-shell'
      ? new LibraryScene(bridge, selectedRoomId ?? 'runtime-monitor')
      : sceneView === 'task-world'
        ? new TaskWorldScene(bridge, runtimeSession!)
        : new MainOfficeScene(bridge, runtimeSession!)

  const sceneWidth = sceneView === 'library-shell' ? LIBRARY_SCENE_WIDTH : 1280
  const sceneHeight = sceneView === 'library-shell' ? LIBRARY_SCENE_HEIGHT : 720

  return new Phaser.Game({
    type: Phaser.CANVAS,
    parent: host,
    backgroundColor: '#08111f',
    width: sceneWidth,
    height: sceneHeight,
    antialias: false,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [scene],
  })
}
