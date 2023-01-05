# digitalrain

### An implementation of "Matrix Digital Rain"

There are 3 main versions so far:

---

#### Version 1

The first version just used intervals and didn't allow customization of stream properties beyond font size and theme

<a href="https://paulb-h.github.io/digitalrain/versions/version1/version1.html" target="_blank">digitalrain - version1.html</a>

---

#### Version 2

The second version was updated to use requestAnimationFrame() instead of intervals, and allowed a lot of customization of the stream properties through a UI. The interval version is actually still implemented and you can switch between versions

<a href="https://paulb-h.github.io/digitalrain/versions/version2/version2.html" target="_blank">digitalrain - version2.html</a>

---

#### Version 3

The third and current version the UI was separated from the main logic better, and is 3 main classes
I made this so it would be easier to implement by just calling the class passing in a target container element, and possible to have multiple instances of the animation, each assigned to and managing their own canvas and properties

Example 1\
Should function exactly as version 2, except implements v3 class and attaches UI differently\
<a href="https://paulb-h.github.io/digitalrain/versions/version3/version3-example/index.html" target="_blank">digitalrain - version3.html</a>

Example 2\
Multiple canvas, each with their own instance of the animation, with intervals setup to randomize each one\
<a href="https://paulb-h.github.io/digitalrain/versions/version3/version3-example2/index.html" target="_blank">digitalrain - version3 - multiple canvas</a>

---

classes for version3

class DigitalRain\
The main class that can be called passing a container element as a parameter
It will create its own canvas elements inside it, and setup a resize observer on the parent container
It contains all methods for generating streams, intervals, stream-controllers, updating the instances properties

class Stream\
Represents an individual stream, its X & Y locations, length, and first 2 characters (since they are reprinted different colors)

class StreamController\
For the requestAnimationFrame() version I needed a way to call requestAnimationFrame on a group of streams, so this class was actually created for that version

One drawback is StreamController & Stream both rely on methods from the parent DigitalRain class, so they are tightly coupled

---

\
I think there are still some opportunities to improve the performance. I read that drawing font with fillText() might not be great, and I actually created an experimental version where I print each character ONCE using fillText() on a different canvas, save each character as an image, and then print using those images with drawImage(). I _think_ this made a performance impact when I was testing on a lower end PC, but only with a very high number of streams and 5px font size, but I have to test more.
