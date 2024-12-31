export type AirportContext = {
  audioCtx: AudioContext;
  convolver: ConvolverNode;
  startTime: number;
  sampleCache: Record<string, AudioBuffer>;
  loopTimers: number[];
};

export type Loop = {
  instrument: string;
  note: string;
  duration: number;
  delay: number;
};

export type Sample = {
  note: string;
  octave: number;
  file: string;
};

const SAMPLE_LIBRARY: Record<string, Sample[]> = {
  "Grand Piano": [
    { note: "A", octave: 4, file: "Samples/Grand Piano/piano-f-a4.wav" },
    { note: "A", octave: 5, file: "Samples/Grand Piano/piano-f-a5.wav" },
    { note: "A", octave: 6, file: "Samples/Grand Piano/piano-f-a6.wav" },
    { note: "C", octave: 4, file: "Samples/Grand Piano/piano-f-c4.wav" },
    { note: "C", octave: 5, file: "Samples/Grand Piano/piano-f-c5.wav" },
    { note: "C", octave: 6, file: "Samples/Grand Piano/piano-f-c6.wav" },
    { note: "D#", octave: 4, file: "Samples/Grand Piano/piano-f-d#4.wav" },
    { note: "D#", octave: 5, file: "Samples/Grand Piano/piano-f-d#5.wav" },
    { note: "D#", octave: 6, file: "Samples/Grand Piano/piano-f-d#6.wav" },
    { note: "F#", octave: 4, file: "Samples/Grand Piano/piano-f-f#4.wav" },
    { note: "F#", octave: 5, file: "Samples/Grand Piano/piano-f-f#5.wav" },
    { note: "F#", octave: 6, file: "Samples/Grand Piano/piano-f-f#6.wav" },
  ],
};

const LOOPS: Loop[] = [
  { instrument: "Grand Piano", note: "F4", duration: 19.7, delay: 4 },
  { instrument: "Grand Piano", note: "G#4", duration: 17.8, delay: 8.1 },
  { instrument: "Grand Piano", note: "C5", duration: 21.3, delay: 5.6 },
  { instrument: "Grand Piano", note: "C#5", duration: 18.5, delay: 12.6 },
  { instrument: "Grand Piano", note: "D#5", duration: 20.0, delay: 9.2 },
  { instrument: "Grand Piano", note: "F5", duration: 20.0, delay: 14.1 },
  { instrument: "Grand Piano", note: "G#5", duration: 17.7, delay: 3.1 },
];

const CHROMATIC_SCALE = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const fetchSample = async (ctx: AirportContext, url: string) => {
  if (ctx.sampleCache[url]) {
    return ctx.sampleCache[url];
  }

  const res = await fetch(encodeURIComponent(url));
  const buffer = await res.arrayBuffer();
  const audio = await ctx.audioCtx.decodeAudioData(buffer);
  ctx.sampleCache[url] = audio;
  return audio;
};

export const getNoteValue = (noteAndOctave: string) => {
  const [, noteName, octaveStr] = noteAndOctave.match(/^(\w[b\#]?)(\d)$/) || [];
  const octave = (Number(octaveStr) || 0) * 12;
  const index = CHROMATIC_SCALE.indexOf(noteName);
  const noteVal = octave + index;
  return noteVal;
};

export const getNoteDistance = (note1: string, note2: string) => {
  return Math.abs(getNoteValue(note1) - getNoteValue(note2));
};

export const getNearestSample = (note: string) => {
  return SAMPLE_LIBRARY["Grand Piano"]
    .slice()
    .sort(
      ({ note: aNote, octave: aOctave }, { note: bNote, octave: bOctave }) => {
        const d1 = getNoteDistance(note, `${aNote}${aOctave}`);
        const d2 = getNoteDistance(note, `${bNote}${bOctave}`);
        return d1 - d2;
      },
    )[0];
};

export const getSample = async (ctx: AirportContext, note: string) => {
  const sampleRecord = getNearestSample(note);
  const sample = await fetchSample(ctx, sampleRecord.file);
  return {
    audioBuffer: sample,
    distance: getNoteDistance(
      note,
      `${sampleRecord.note}${sampleRecord.octave}`,
    ),
  };
};

export const playSample = async (
  ctx: AirportContext,
  note: string,
  delay: number = 0,
) => {
  const { audioBuffer, distance } = await getSample(ctx, note);
  const playbackRate = Math.pow(2, distance / 12);

  const source = ctx.audioCtx.createBufferSource();

  source.buffer = audioBuffer;
  source.playbackRate.value = playbackRate;

  const gain = ctx.audioCtx.createGain();
  gain.gain.value = 0.1;
  gain.connect(ctx.convolver);

  source.connect(gain);

  const startTime = ctx.audioCtx.currentTime + delay;

  console.log(`playing ${note} at ${startTime}`, audioBuffer);
  source.start(startTime);
};

export const playLoop = (
  ctx: AirportContext,
  { note, duration, delay }: Loop,
) => {
  playSample(ctx, note, delay);
  return window.setInterval(() => playSample(ctx, note), duration * 1000);
};

export const play = async (ctx: AirportContext) => {
  const terminal = await fetchSample(ctx, "Samples/AirportTerminal.wav");

  ctx.convolver.connect(ctx.audioCtx.destination);
  ctx.convolver.buffer = terminal;
  ctx.startTime = ctx.audioCtx.currentTime;
  ctx.audioCtx.resume();
  ctx.loopTimers = LOOPS.map((loop) => playLoop(ctx, loop));
};

export const stop = (ctx: AirportContext) => {
  ctx.audioCtx.suspend();
  ctx.convolver.disconnect();
  ctx.loopTimers.forEach((timer) => clearInterval(timer));
  ctx.loopTimers = [];
  ctx.startTime = 0;
};

export const createMusicForAirports = (): AirportContext => {
  const ctx = new AudioContext();
  ctx.suspend();

  return {
    audioCtx: ctx,
    convolver: ctx.createConvolver(),
    startTime: 0,
    sampleCache: {},
    loopTimers: [],
  };
};
