# Matching Game

**Game:**

 https://jabbacalvin.github.io/matching_game/

---

**Concept:**

![Concept](assets/images/readme/concept.png)

---

***Game Demo***

Starting Page:

![Starting Page](assets/images/readme/01.png)

After Category Selection:

![After Category Selection](assets/images/readme/02.png)

After Category Selection - On Screen Instruction:

![After Category Selection - On Screen Instruction:](assets/images/readme/03.png)

Drag & Drop:

![Drag & Drop](assets/images/readme/04.png)

Drag & Drop (Incorrect):

![Drag & Drop (Incorrect)](assets/images/readme/05.png)

Drag & Drop (Correct):

![Drag & Drop (Correct)](assets/images/readme/06.png)

Winning Message:

![Winning Message:](assets/images/readme/07.png)

---

**Wireframe:** 

https://excalidraw.com/#json=_bSDFRq0PhNl0HT-HdtJr,FNNAyeblu0ElXVMUpX1NDw

---

**Pseudocode:**
- Have arrays of categories
    - each category consists of an object of the name and the image
        - ```e.g.
            shapes = [
                {name: 'square', image: 'square.png'}
                {name: 'circle', image: 'circle.png'}
                               .
                               .
                               .   
            ];
            animals = [
                {name: 'dog', image: 'dog.png'}
                {name: 'cat', image: 'cat.png'}
                               .
                               .
                               .   
            ];
- Create a function that handles the categories
- Create a function that places the category items into the tiles
- Create a function that randomize the tiles for both the left and right side
- Create a function that handles the checks of the tiles being matched correctly or not
    - if yes, show green
    - if no, show red for a few seconds and bounce tile back to original position on the left
- Create a function that handles the drag and drop action
- Create a function that handles completion
- Create a function to handle reset

---

**Minimum Viable Product:**
- 2 categories working
- reset working
- start with click left side, click right side to match

---

**First Iteration:**

Turns out the logic for the click matching was harder than the drag and drop matching

**Second Iteration:**

Implemented drag and drop, the logic for showing the match is simpler

**Third Iteration:**

Added sounds and hidden categories

---

**Future Implementations:**
- Mobile friendly
- Clean up code
