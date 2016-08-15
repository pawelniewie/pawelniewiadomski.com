One thing to note is that Ruby comes with `timeout` which was intented on solving this problem. Unfortunately they way it is implemented [makes it useless](http://jvns.ca/blog/2015/11/27/why-rubys-timeout-is-dangerous-and-thread-dot-raise-is-terrifying/). Please do not use it in your code!

