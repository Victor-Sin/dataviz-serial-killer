function pow2(x){
    return Math.pow(2, x);
}

const bodyTypes = {
    NONE : pow2(0),
    PLAYER : pow2(1),
    BULLETS :pow2(2),
    BOMBS: pow2(3),
    OBSTACLES : pow2(4),
    OTHERS : pow2(20),
}

export default bodyTypes;