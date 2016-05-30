---
layout: post
title: How to use Stream.reduce to create Map or Multimap?
tags:
- java
- functional
- steams
---
Java Streams are great. But one thing that took me a while was figuring out how to do advanced reduce operations that result in a `Map`

The simple reduce case is obvious:

```java
Integer sum = integers.reduce(0, Integer::sum);
```

First argument is the accumulator (you can pass any initial state). The second is the operation that will add to the state. The second is a `BinaryOperator` taking two same type arguments and running an operation on them. 

Now in case of a map you want to have the map as the first argument and the current element as the second. So you cannot use the simple reduce. There's another method which you can use though:

```java
<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);
```

So how to use it?

Lets imagine I want to show all the applications grouped by name. I want to sort the entries as well. So my end result should be a `SortedSetMultimap<String, Application>`

Here's how I can do it with Java Streams:

```java
final TreeMultimap<String, Application> results = applications
  .stream()
  .reduce(TreeMultimap.create(String.CASE_INSENSITIVE_ORDER,
          (o1, o2) -> o1.getIssue().getKey().compareTo(o2.getIssue().getKey())), (map, application) -> {
      map.put(application.getIssue().getProjectObject().getName(), application);
      return map;
  }, (map, map2) -> map);
```

This is a case of `TreeMultimap.<String, Application>create()` taking two `Comparators` so you can be explicit about the ordering. You don't need to use it if both classes implement `Comparable` and you want to use a default ordering.

Hope that will help use `reduce` in your code.
