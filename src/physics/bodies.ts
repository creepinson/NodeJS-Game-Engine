import { Vector } from "@toes/core";
import { World } from "./index";
import Graphics from "../graphics";

//Returns true if the two circles intersect.
function CvC(pos1: Vector, r1: number, pos2: Vector, r2: number): boolean {
    return (r1 + r2) ** 2 > pos1.clone().subtract(pos2).sqrMagnitude();
}

interface options {
    isStatic?: boolean;
    mass?: number;
    maxSpeed?: number;
}

export class Body {
    uid: number = -1;
    group: string = "";
    removed: boolean = false;
    pos: Vector = new Vector();
    vel: Vector = new Vector();
    acc: Vector = new Vector();
    inverseMass: number;
    isStatic: boolean;
    maxSpeed: number;

    constructor(options: options = {}) {
        this.inverseMass = 1 / (options.mass ?? 1);
        this.isStatic = options.isStatic ?? false;
        this.maxSpeed = options.maxSpeed ?? Infinity;
    }

    collide(b: Body): boolean {
        return false;
    }

    accelerate(v: Vector) {
        this.acc.add(v);
    }

    update(World: World, timeStepLength: number) {
        //Update position and velocity
        if (this.isStatic) return;
        this.vel.add(this.acc.clone().scale(timeStepLength));
        this.acc.set(0, 0, 0);
        if (this.vel.sqrMagnitude() > this.maxSpeed ** 2)
            this.vel.normalize().scale(this.maxSpeed);
        this.pos.add(this.vel.clone().scale(timeStepLength));
        //Run dev assigned timestep function
        this.timeStep(World);
    }

    kill() {
        this.removed = true;
        this.death();
    }

    timeStep(World: World): void {}
    frame(Graphics: Graphics, World: World): void {}
    collision(World: World, body: Body): boolean {
        return true;
    }
    death(): void {}
}

export class PolygonBody extends Body {
    vertices: Array<Vector>;
    r: number;
    constructor(vertices: Array<Vector>, options?: options) {
        super(options);
        this.vertices = vertices;
        let g = 0;
        for (let v of vertices) {
            let d = v.sqrMagnitude();
            if (d > g) g = d;
        }
        this.r = g ** (1 / 2);
    }

    collide(b: Body): boolean {
        if (b instanceof CircleBody) {
            return CvC(this.pos, this.r, b.pos, b.r);
        }
        return false;
    }
}

export class RectBody extends PolygonBody {
    w: number;
    h: number;

    constructor(w: number, h: number = w, options?: options) {
        super(
            [
                new Vector(-w / 2, -h / 2),
                new Vector(w / 2, -h / 2),
                new Vector(w / 2, h / 2),
                new Vector(-w / 2, h / 2),
            ],
            options
        );
        this.w = w;
        this.h = h;
    }
}

export class CircleBody extends Body {
    r: number;

    constructor(r: number, options?: options) {
        super(options);
        this.r = r;
    }

    collide(b: Body): boolean {
        if (b instanceof CircleBody) {
            if (!CvC(this.pos, this.r, b.pos, b.r)) return false;
            let n = b.pos.clone().subtract(this.pos).normalize();
            let rv = b.vel.clone().subtract(this.vel);
            let vn = rv.dot(n);
            if (vn > 0) return false;
            let e = 1;
            let j = -(1 + e) * vn;
            j /= this.inverseMass + b.inverseMass;
            let impulse = n.scale(j);
            if (!b.isStatic) b.vel.add(impulse.clone().scale(b.inverseMass));
            if (!this.isStatic)
                this.vel.subtract(impulse.scale(this.inverseMass));
            return true;
        }
        return false;
    }
}
