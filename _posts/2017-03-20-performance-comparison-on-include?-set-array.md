---
layout: post
title: Performance comparison of Ruby's Array and Set with strings and symbols
tags:
- java
- ruby
- performance
- benchmark
thumbnail: /media/2017/turbo.jpg
---
{% image_tag src="/media/2017/turbo.jpg" width="572" %}

Yesterday I was refactoring a piece of code checking if we can handle an uploaded document. Users can upload different documents which sometimes aren't well described - some miss an extension, some have an extension that doesn't match the content (pdf files which are not pdfs, etc.). For some documents we want to generate previews so it's really important to run this job on files that we know we can handle. So instead of relaying on the extension I added a simple content check using [mimemagic](https://github.com/minad/mimemagic).

So later I was extending a function that decides can we generate a preview for a file, that's a first version:

```ruby
def needs_preview?
    return true if %w{
      application/vnd.ms-excel
      application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      application/vnd.ms-powerpoint
      application/vnd.openxmlformats-officedocument.presentationml.presentation
      application/pdf
      application/msword
      application/vnd.openxmlformats-officedocument.wordprocessingml.document
      text/plain
      application/rtf
      image/jpeg
    }.include? document_content_type

    %w{.xls .xlsx .ppt .pptx .pdf .doc .docx .txt .rtf .jpg .jpeg}.include? extension
  end
```

But as I was writing this I thought - hmm, why don't I be a good programmer and use a better structure for this - `Set`. An array has this problem that you need to compare every element to check if it's in the array, it's `O(n)`. Set is based on hashes so in theory can find an element in `O(1)` (constant time).

So I rewrote the code and was happy about it. But later got really curious and decided to actually [benchmark it](https://github.com/pawelniewie/benchmark-set-array-contains/tree/master/ruby). 

```
creating a new

Warming up --------------------------------------
               array   189.396k i/100ms
                 set    16.874k i/100ms
Calculating -------------------------------------
               array      4.090M (± 7.2%) i/s -     20.455M in   5.027083s
                 set    172.724k (± 5.3%) i/s -    877.448k in   5.094293s

Comparison:
               array:  4090134.6 i/s
                 set:   172724.4 i/s - 23.68x  slower

include?

miss

Warming up --------------------------------------
               array   173.707k i/100ms
       array symbols   158.803k i/100ms
array symbols + to_sym
                       131.336k i/100ms
                 set   182.543k i/100ms
         set symbols   199.911k i/100ms
set symbols + to_sym   170.006k i/100ms
Calculating -------------------------------------
               array      3.818M (± 6.6%) i/s -     19.108M in   5.026220s
       array symbols      2.891M (± 6.0%) i/s -     14.451M in   5.015273s
array symbols + to_sym
                          2.312M (± 6.0%) i/s -     11.558M in   5.016827s
                 set      4.726M (± 6.0%) i/s -     23.731M in   5.039017s
         set symbols      5.874M (± 6.8%) i/s -     29.387M in   5.025485s
set symbols + to_sym      3.677M (± 7.1%) i/s -     18.361M in   5.018556s

Comparison:
         set symbols:  5873938.4 i/s
                 set:  4726223.9 i/s - 1.24x  slower
               array:  3818309.1 i/s - 1.54x  slower
set symbols + to_sym:  3676572.9 i/s - 1.60x  slower
       array symbols:  2891349.9 i/s - 2.03x  slower
array symbols + to_sym:  2312024.8 i/s - 2.54x  slower


hit

Warming up --------------------------------------
               array   198.282k i/100ms
       array symbols   188.585k i/100ms
array symbols + to_sym
                       155.503k i/100ms
                 set   187.467k i/100ms
         set symbols   216.999k i/100ms
set symbols + to_sym   216.249k i/100ms
Calculating -------------------------------------
               array      4.777M (± 6.2%) i/s -     23.794M in   4.999723s
       array symbols      4.271M (± 6.3%) i/s -     21.310M in   5.008877s
array symbols + to_sym
                          3.043M (± 6.2%) i/s -     15.239M in   5.026281s
                 set      4.611M (± 6.6%) i/s -     23.058M in   5.022503s
         set symbols      6.434M (± 8.2%) i/s -     32.116M in   5.024084s
set symbols + to_sym      6.318M (± 7.2%) i/s -     31.572M in   5.022345s

Comparison:
         set symbols:  6434032.0 i/s
set symbols + to_sym:  6317710.7 i/s - same-ish: difference falls within error
               array:  4776713.5 i/s - 1.35x  slower
                 set:  4610506.9 i/s - 1.40x  slower
       array symbols:  4270964.5 i/s - 1.51x  slower
array symbols + to_sym:  3043429.0 i/s - 2.11x  slower
```

So that was interesting. First of all these are not *scientific* results, ran them on my MacBook Pro doing a lot of other things in the background but I repeated the benchmark and got similar results, that's from one of the runs (not a median of the runs, not going to bother with it).

What surpised me is the time I takes to create the set.

As expected `set symbols` for *miss* scenario is the fastest, what's interesting that creating a symbol from string takes a lot of time and makes it even slower than browsing the array. This all depends on the size of the array of course. I ran this benchmark with a smaller array first and then the browsing through the array was faster than computing the hash.

What I don't understand is why there's such a difference between `array` and `array symbols`? Or why is `set` that slower than `set symbols`. I compared `hash` cost and there is some difference that could influence the set:

```
hash

Warming up --------------------------------------
                hash   227.244k i/100ms
         hash symbol   238.749k i/100ms
Calculating -------------------------------------
                hash      7.063M (± 4.7%) i/s -     35.450M in   5.030842s
         hash symbol      8.551M (± 4.5%) i/s -     42.736M in   5.008114s

Comparison:
         hash symbol:  8550770.0 i/s
                hash:  7062788.4 i/s - 1.21x  slower
```

For *hit* scenario the story is similar - not sure why it looks like it looks. So I learned that I don't understand how Ruby works :-)

But I know how it compares to [Java](https://github.com/pawelniewie/benchmark-set-array-contains/tree/master/java)

```
Benchmark                    Mode  Cnt          Score         Error  Units
ContainsHit.arrayContains   thrpt   15  104613718,801 ± 1303381,183  ops/s
ContainsHit.setContains     thrpt   15  192043168,043 ± 1822039,485  ops/s
ContainsMiss.arrayContains  thrpt   15   47823394,222 ±  516549,078  ops/s
ContainsMiss.setContains    thrpt   15  341901148,094 ± 3934969,687  ops/s
Create.createArray          thrpt   15   51892174,423 ±  593297,573  ops/s
Create.createSet            thrpt   15    4830737,889 ±   83773,408  ops/s
```

Now, creating a set is ~10 times slower. 

Comparing to Ruby going through the whole array is ~12 times faster in Java (*miss* scenario). Now comparing sets: *miss* scenario is ~58 times faster in Java, and *hit* scenario is ~29 times faster in Java.

Does it matter to me? Not at all :-)

Was it fun? Yeah!

You want to try it out? There's [the code available](https://github.com/pawelniewie/benchmark-set-array-contains/) which you can run on your machine. You can also easily use it to compare other things.

Have comments? Share them with me [@devonsteroids](https://twitter.com/devonsteroids)

