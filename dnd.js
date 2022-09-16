// Initial pageX and pageY of movingElement, at the moment the drag begins
const initialMovingElementPageXY = {
  x: 0,
  y: 0,
  set: (movingElement) => {
    const rect = movingElement.getBoundingClientRect();
    initialMovingElementPageXY.x = rect.x + window.scrollX;
    initialMovingElementPageXY.y = rect.y + window.scrollY;
  },
};

// Shifts allowing drag for any point of movingElement.
// Stores x and y shifts from top left corner of movingElement to the point of drag
const shifts = {
  shiftX: 0,
  shiftY: 0,
  set: (clientX, clientY, movingElement) => {
    shifts.shiftX = clientX - movingElement.getBoundingClientRect().left;
    shifts.shiftY = clientY - movingElement.getBoundingClientRect().top;
  },
};

const moveAt = (element, pageX, pageY) => {
  // Moves element to pageX and pageY coordinates using fast CSS transform method
  element.style.transform = `translate(${
    pageX - initialMovingElementPageXY.x - shifts.shiftX
  }px, ${pageY - initialMovingElementPageXY.y - shifts.shiftY}px)`;
};

const getElementCoordinates = (node, searchCoordsBy) => {
  // Returns left and top coordinates of node
  const rect = node.getBoundingClientRect();
  return {
    top:
      searchCoordsBy == "by-center"
        ? rect.top + rect.height / 2
        : rect.top + 10,
    left: rect.left + rect.width / 2,
  };
};

const isAbove = (nodeA, nodeB) => {
  // Returns the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

const isRight = (nodeA, nodeB) => {
  // Get the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.left + rectA.width / 2 < rectB.left + rectB.width / 2;
};

const getElementBelow = (movingElement, searchCoordsBy) => {
  // Get element below movingElement now
  const movingElementCenter = getElementCoordinates(
    movingElement,
    searchCoordsBy
  );
  movingElement.hidden = true;
  let elementBelow = document.elementFromPoint(
    movingElementCenter.left,
    movingElementCenter.top
  );
  movingElement.hidden = false;
  return elementBelow;
};
