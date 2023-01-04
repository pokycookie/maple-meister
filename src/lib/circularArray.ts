class Node<T> {
  private VALUE: T;
  private LINK: Node<T> | null;

  constructor(value: T) {
    this.VALUE = value;
    this.LINK = null;
  }

  setValue(value: T) {
    this.VALUE = value;
  }
  setLink(link: Node<T> | null) {
    this.LINK = link;
  }
  getValue() {
    return this.VALUE;
  }
  getLink() {
    return this.LINK;
  }
}

class CircularArray<T> {
  private HEAD: Node<T> | null = null;
  private TAIL: Node<T> | null = null;
  private SIZE: number = 0;

  constructor(arr: T[] = []) {
    let prevNode: Node<T>;
    arr.forEach((e, i) => {
      const tmpNode = new Node(e);
      prevNode.setLink(tmpNode);
      if (i === 0) this.HEAD = tmpNode;
      else if (i === arr.length - 1) this.TAIL = tmpNode;
      prevNode = tmpNode;
    });
  }

  moveLeft() {
    const prevHEAD = this.HEAD;
    const prevTAIL = this.TAIL;
    if (!prevHEAD || !prevTAIL) return;
    this.HEAD = prevHEAD.getLink();
    this.TAIL = prevHEAD;
    prevHEAD.setLink(null);
    prevTAIL.setLink(prevHEAD);
  }
  moveRight() {}
}

export default CircularArray;
