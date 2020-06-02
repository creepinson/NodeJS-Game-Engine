import { Tensor } from "@throw-out-error/throw-out-utils";
import Window from "../window";
export default class Mouse extends Tensor {
    constructor(window: Window) {
        super([0, 0], [2]);
    }
}
