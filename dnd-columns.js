(() => {
  let currentDroppable = null;
  let placeholder;
  let isDraggingStarted = false;
  let movingElement;
  let initialHeight;

  const createPlaceholder = () => {
    const movingElementHeight = movingElement.getBoundingClientRect().height;
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholder-column");
    placeholder.style.height = movingElementHeight;
    movingElement.parentNode.insertBefore(placeholder, movingElement);
  };

  const onMouseMove = (event) => {
    if (!isDraggingStarted) {
      isDraggingStarted = true;
      createPlaceholder();
      Object.assign(movingElement.style, {
        position: "absolute",
        zIndex: 1000,
        left: `${initialMovingElementPageXY.x}px`,
        top: `${initialMovingElementPageXY.y}px`,
      });
    }
    movingElement.style.height = initialHeight;
    moveAt(movingElement, event.pageX, event.pageY);

    elementBelow = getElementBelow(movingElement, "by-top");
    if (!elementBelow) return;
    let droppableBelow = elementBelow.closest(".column");
    if (currentDroppable != droppableBelow) {
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        if (!isRight(movingElement, currentDroppable)) {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable
          );
        } else {
          currentDroppable.parentNode.insertBefore(
            placeholder,
            currentDroppable.nextElementSibling
          );
        }
      }
    }
  };

  const setMovingElement = (event) => {
    movingElement = event.target.closest(".column");
  };

  const onMouseUp = () => {
    if (!isDraggingStarted) {
      document.removeEventListener("mousemove", onMouseMove);
      movingElement.onmouseup = null;
      return;
    }
    console.log(
      "We move section",
      movingElement,
      "before section",
      placeholder.nextElementSibling,
      "after section",
      placeholder.previousElementSibling
    );

    placeholder.parentNode.insertBefore(movingElement, placeholder);
    Object.assign(movingElement.style, {
      position: "static",
      left: "auto",
      top: "auto",
      zIndex: "auto",
      transform: "none",
    });
    document.removeEventListener("mousemove", onMouseMove);
    isDraggingStarted = false;
    placeholder && placeholder.parentNode.removeChild(placeholder);
    movingElement.onmouseup = null;
    movingElement = null;
  };

  const onMouseDown = (event) => {
    setMovingElement(event);
    initialHeight = movingElement.getBoundingClientRect().height;
    shifts.set(event.clientX, event.clientY, movingElement);
    initialMovingElementPageXY.set(movingElement);
    document.addEventListener("mousemove", onMouseMove);
    movingElement.onmouseup = onMouseUp;
  };

  window.addEventListener("load", () => {
    for (const draggableElement of document.querySelectorAll(
      ".board-column-header"
    )) {
      draggableElement.onmousedown = onMouseDown;
      draggableElement.ondragstart = () => {
        return false;
      };
    }
  });
})();
