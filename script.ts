/*
PSEUDO-CODE

CLICKABLES
    I want to make all buttons clickable, but have them be accessed by the container evt.target.
    I have to disable the dot button once it's been clicked once.
    All numbers plus "." are processed into the inputDisplay
    If they press "C", I'm only clearing what's on the inputDisplay.
    If they press "AC", then I have to clear the inputDisplay and pastResultsDisplay, essentially treating it like a
    reset button
    If they press "<-", i have to pop the last element from the inputDisplay;

    If they click the division, multiply, subtract, plus, or equals symbol, i have to place the following in the pastResultsDisplay:
            `${inputDisplayArray} ${binarySymbol}`

    Similarly, if i press the same symbol (have to keep track of what was pressed last) twice in a row, i have to redo the function again
            i.e.
                   6 + 10 (= 16)
                   I have to store (+ 10)
                   so If I press + again, i should get 26 (16 + 10) (or 10 + 16, whatever is easier to implement)

    We're treating all operations as binary operations, so 12 + 7 - 5 * 3 = 42, not 4!
            explanation:
                   ((12 + 7) - 5) * 3 = 42, not
                   (12 + 7) - (5 * 3) = 4

EXTRAs
    Add keyboard support
        remember that i have to event.preventDefault on a bunch of things, since certain symbols mean different things depending on the browsers
            i.e. "/" is like the equivalent of ctrl+f
 */
