"use client";

import { useCallback, useEffect, useState } from "react";
import PlayButton, { PlayState } from "./components/PlayButton";
import {
  AirportContext,
  createMusicForAirports,
  play,
  stop,
} from "./web-audio/music-for-airports";

export default function Home() {
  const [playState, setPlayState] = useState(PlayState.NOT_PLAYING);
  const [ctx, setCtx] = useState<AirportContext | undefined>();

  const onBtnClick = useCallback((state: PlayState) => {
    setPlayState(state);
  }, []);

  useEffect(() => {
    if (ctx) {
      return;
    }

    console.log("creating context");
    setCtx(createMusicForAirports());
  }, [ctx]);

  useEffect(() => {
    if (!ctx) {
      return;
    }

    if (playState === PlayState.PLAYING) {
      play(ctx);
    } else {
      stop(ctx);
    }
  }, [playState, ctx]);

  return (
    <main className="h-screen w-screen">
      <div className="flex justify-center h-full">
        <div className="flex flex-col justify-center">
          <PlayButton onStateChanged={onBtnClick} />
        </div>
      </div>
    </main>
  );
}
