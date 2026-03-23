import mapLogicJson from '../../data/map.logic.json';
import assetManifestJson from '../../data/asset.manifest.json';
import sceneArtJson from '../../data/scene-art.manifest.json';
import themePackJson from '../../data/themes/default/theme-pack.json';
import workOutputJson from '../../data/work-output.protocol.json';
import type { AssetManifest, MapLogic, SceneArtManifest, ThemePack, WorkOutputProtocol } from '../../core/types';
import { ensureLobsterActorVariant } from './actorVariantChrome';
import { resolveAppAssetPath } from './appRuntime';

function remapProtocolPaths<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((entry) => remapProtocolPaths(entry)) as T;
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const remappedEntries = Object.entries(value).map(([key, entryValue]) => {
    if (key === 'path' && typeof entryValue === 'string' && entryValue.startsWith('/assets/')) {
      return [key, resolveAppAssetPath(entryValue)];
    }
    return [key, remapProtocolPaths(entryValue)];
  });

  return Object.fromEntries(remappedEntries) as T;
}

export function loadProtocols(): {
  mapLogic: MapLogic;
  assetManifest: AssetManifest;
  sceneArt: SceneArtManifest;
  themePack: ThemePack;
  workOutput: WorkOutputProtocol;
} {
  const sceneArt = sceneArtJson as unknown as SceneArtManifest

  return {
    mapLogic: mapLogicJson as unknown as MapLogic,
    assetManifest: assetManifestJson as unknown as AssetManifest,
    sceneArt: remapProtocolPaths({
      ...sceneArt,
      actor: ensureLobsterActorVariant(sceneArt.actor),
    }) as unknown as SceneArtManifest,
    themePack: remapProtocolPaths(themePackJson) as unknown as ThemePack,
    workOutput: workOutputJson as unknown as WorkOutputProtocol
  };
}
