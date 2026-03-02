import * as PIXI from "pixi.js";
import { Textures } from "./textures";
import { Team } from "dogfight-types/Team";
import { Radar } from "./radar";
import { TimerColor } from "./constants";

export type Stats = {
    health?: number;
    fuel?: number;
    ammo?: number;
    bombs?: number;
};

export class GameHUD {
    public container: PIXI.Container;

    private panel: PIXI.Sprite;
    private stats: PIXI.Graphics;
    private bombs: PIXI.Container;
    public radar: Radar;
    private previousStats: Stats;
    private clock: PIXI.Text;

    constructor() {
        this.container = new PIXI.Container();

        this.panel = new PIXI.Sprite();
        this.stats = new PIXI.Graphics();
        this.bombs = new PIXI.Container();
        this.radar = new Radar();
        this.clock = new PIXI.Text("", {
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: 17,
            fill: TimerColor.Normal,
        });
        this.clock.position.set(350, 100);

        this.bombs.position.set(296, 108);

        this.previousStats = {};

        this.container.addChild(this.panel);
        this.container.addChild(this.stats);
        this.container.addChild(this.bombs);
        this.container.addChild(this.radar.container);
        this.container.addChild(this.clock);
    }

    public init() {
        this.panel.texture = Textures["metalpanel.jpg"];

        for (let i = 0; i < 5; i++) {
            const sprite = new PIXI.Sprite(Textures["droppedbomb.gif"]);
            sprite.position.set(i * 14, 0);
            this.bombs.addChild(sprite);
        }
    }

    public updateStats(stats: Stats) {
        if (JSON.stringify(stats) == JSON.stringify(this.previousStats)) return;
        this.previousStats = stats;

        // update bomb count
        const bombCount = stats.bombs ?? 0;
        for (let i = 0; i < 5; i++) {
            const bomb = this.bombs.children[i] as PIXI.Sprite;
            const tex = i < bombCount ? Textures["carrybomb.gif"] : Textures["droppedbomb.gif"];
            bomb.texture = tex;
        }

        this.stats.clear();
        this.stats.beginFill("white");

        // draw health bar
        const health = (stats.health ?? 0) / 255;
        this.stats.drawRect(290, 44, 74 * health, 12);

        // draw fuel
        const fuel = (stats.fuel ?? 0) / 255;
        //console.log(stats.fuel, fuel)
        this.stats.drawRect(290, 65, 74 * fuel, 12);

        // draw ammo
        const ammo = (stats.ammo ?? 0) / 255;
        this.stats.drawRect(290, 86, 74 * ammo, 12);

        //this.stats.beginFill("yellow")
        //this.stats.drawRect(0, 0, 50, 100)

        this.stats.endFill();
    }

    public updateClock(secondsRemaining: number) {
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = secondsRemaining % 60;
        const mm = minutes < 10 ? ` ${minutes}` : `${minutes}`;
        const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;
        this.clock.text = `${mm}:${ss}`;

        if (minutes === 0 && seconds < 5) {
            this.clock.style.fill = TimerColor.Urgent; // orange urgency
        } else {
            this.clock.style.fill = TimerColor.Normal; // muted yellow
        }
    }

    public setTeam(team?: Team) {
        if (team === undefined || team === "Centrals") {
            this.panel.texture = Textures["metalpanel.jpg"];
        }
        if (team === "Allies") {
            this.panel.texture = Textures["woodpanel.jpg"];
        }
        this.radar.setTeam(team);
    }
}
