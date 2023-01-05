An implementation of "Matrix Digital Rain"

There have been 3 versions so far:

The first version just used intervals and didn't allow customization of stream properties beyond font size and theme

// Link & image to first version

The second version was updated to use requestAnimationFrame() instead of intervals, and allowed customization of all properties of the streams, along with UI controls for each one. The interval version is actually still implemented and you can switch between versions

// Link & image to second version

The third and current version the UI was separated from the main logic better, and is 3 main classes
I made this so it would be easier to implement by just calling the class passing in a target container element, and possible to have multiple instances of the animation, each assigned to and managing their own canvas and properties.

// Link & image to third version

--

classes

class DigitalRain\
The main class that can be called passing a container element as a parameter
It will create its own canvas elements inside it, and setup a resize observer on the parent container
It contains all methods for generating streams, intervals, stream-controllers, updating the instances properties

class Stream\
Represents an individual stream, its X & Y locations, length, and first 2 characters (since they are reprinted different colors)

class StreamController\
For the requestAnimationFrame() version I needed a way to call requestAnimationFrame on a group of streams, so this class was actually created for that version

One drawback is StreamController & Stream both rely on methods from the parent DigitalRain class, so they are tightly coupled
