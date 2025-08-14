import { useStore } from '../State/store';

const CHANCE_TO_CHANGE_WEATHER = 0.001; // Small chance each frame to change weather
const MIN_WEATHER_DURATION = 20; // seconds
const MAX_WEATHER_DURATION = 60; // seconds

class WeatherSystem {
    private timer = 0;
    private duration = 0;

    public update(dt: number) {
        this.timer += dt;

        if (this.timer > this.duration) {
            this.timer = 0;
            this.duration = MIN_WEATHER_DURATION + Math.random() * (MAX_WEATHER_DURATION - MIN_WEATHER_DURATION);

            const { isRaining, actions } = useStore.getState();
            // Simple toggle for now
            console.log(`Weather changing. It is now ${!isRaining ? 'raining' : 'clear'}.`);
            actions.setWeather(!isRaining);
        }
    }
}

export const weatherSystem = new WeatherSystem();
