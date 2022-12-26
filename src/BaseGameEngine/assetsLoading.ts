// LATER possibly use some rate limiter such as batch-promise

function loadSingleSprite(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = path;
  });
}

function loadSingleAudio(path: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onload = () => resolve(audio);
    // TODO check if we can use oncanplay / onloadeddata
    // see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio#events
    audio.onerror = (error) => reject(error);
    audio.src = path;
  });
}

// Loads game images from given URLs.
// Argument format {"id1": "/path/to/img_id1.png", ...}
export async function loadSprites(
  paths: Record<string, string>
): Promise<Record<string, HTMLImageElement>> {
  const result: Record<string, HTMLImageElement> = {};

  await Promise.all(
    Object.keys(paths).map(async (id) => {
      const img = await loadSingleSprite(paths[id]);
      result[id] = img;
    })
  );

  return result;
}

// Loads game sounds from given URLs.
// For best compatibility, MP3 format is recommended
// https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs
export async function loadSounds(
  paths: Record<string, string>
): Promise<Record<string, HTMLAudioElement>> {
  const result: Record<string, HTMLAudioElement> = {};

  await Promise.all(
    Object.keys(paths).map(async (id) => {
      const audio = await loadSingleAudio(paths[id]);
      result[id] = audio;
    })
  );

  return result;
}

// Loads game data (e.g. maps) from JSON files at given URLs.
export async function loadGameData(
  paths: Record<string, string>
): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};

  await Promise.all(
    Object.keys(paths).map(async (id) => {
      const url = paths[id];
      const response = await fetch(url);
      const jsonData = await response.json();
      result[id] = jsonData;
    })
  );

  return result;
}
