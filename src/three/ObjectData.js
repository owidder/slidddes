export class ObjectData {

    constructor(index, type, totalNum, positionFunction) {
        this.index = index;
        this.type = type;
        this.totalNum = totalNum;
        this.positionFunction = positionFunction;
        this.offset = 0;
    }

    getType() {
        return this.type;
    }

    getTotalNum() {
        return this.totalNum;
    }

    getIndex() {
        return this.index;
    }

    getNextIndex() {
        return this.index < (this.totalNum - 1) ? this.index + 1 : 0;
    }

    getPrevIndex() {
        return this.index > 0 ? this.index - 1 : (this.totalNum - 1);
    }

    setIndex(index) {
        this.index = index;
    }

    incIndex() {
        this.index = this.getNextIndex();
        return this.index;
    }

    getPositionFunction() {
        return this.positionFunction;
    }

    getOffset() {
        return this.offset;
    }

    setOffset(offset) {
        this.offset = offset;
    }

    addToOffset(offset) {
        this.offset += offset;
    }
}
