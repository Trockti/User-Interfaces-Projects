Name: Javier Madrid (jmadridh)
UID: 21111639

I believe that for the undo part, the state restoration is the appropiate one, as all the actions are reversible, without changing anything, and for delete, if you ahd a shape/s selected, if you undo and redo, those shapes will be selected, because if you have one shape selected, if you undo a delete, you expect the shape to appear in the display editor on the right again.

For the granularity,I what I implemented is basically: if the user wants to undo the change of a property, it will change back to the property the shape had before the textfield received the focus. This way, for example, if the user decides to change the hue one by one 5 times, from 5 to 6, to 7, to ... 10, if he undo that change, the hue will go back to 5 not 10, this way making the changes easier, in case the user is indecesive, or doesn't does a lot of small changes.