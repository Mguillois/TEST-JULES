type SoundEvent = 'gunshot_rifle' | 'impact_dirt' | 'impact_flesh' | 'ui_click' | 'build_place';

class SoundSystem {
    /**
     * Plays a sound effect.
     * In the future, this will interact with an audio library like Howler.js or Web Audio API.
     * For now, it just logs the event to the console.
     * @param event The sound event to play.
     */
    public playSound(event: SoundEvent) {
        console.log(`[SoundSystem] Playing sound: ${event}`);
    }
}

export const soundSystem = new SoundSystem();
