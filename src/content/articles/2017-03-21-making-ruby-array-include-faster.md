---
title: "Making Ruby's Array.include? faster for symbols"
date: "2017-03-21"
description: "It's all started doing some refactoring - I was playing with Array and Set and something tempted me do to a simple benchmark that revealed strange results...."
tags:
  - ruby
  - performance
  - benchmark
thumbnail: "/images/2017/turbo.jpg"
series: "ruby-array-include-performance"
---
It's all started doing some refactoring - I was playing with `Array` and `Set` and something tempted me do to a simple benchmark that revealed strange results. That's a second part in which I describe how I fixed it. It's about building Ruby's code, debugging it with `lldb` and making it faster!


It all started with [benchmarking `Array.include?()`](https://github.com/pawelniewie/benchmark-set-array-contains/blob/master/ruby/array_include.rb)

```
Comparison:
               array:  1332567.6 i/s
       array symbols:  1154135.9 i/s - 1.15x  slower
```

Isn't that strange that array of symbols is slower than one with strings? Symbols are supposed to be fast!

I downloaded [Ruby's source code](https://github.com/ruby/ruby) and started looking at it.

I initially though the problem was with Symbol's `==` so I went looking for it. I found one for String easily in `string.c`

```c
rb_define_method(rb_cString, "==", rb_str_equal, 1);
```

But `symbol.c` didn't follow the pattern, because it's also in `string.c` :-)

```c
rb_define_method(rb_cSymbol, "==", sym_equal, 1);
```

It was also simple to figure out where array is, that's a no brainer:

```c
rb_define_method(rb_cArray, "include?", rb_ary_includes, 1);
```

```c
VALUE
rb_ary_includes(VALUE ary, VALUE item)
{
    long i;
    VALUE e;

    for (i=0; i<RARRAY_LEN(ary); i++) {
	e = RARRAY_AREF(ary, i);
	switch (rb_equal_opt(e, item)) {
	  case Qundef:
	    if (rb_equal(e, item)) return Qtrue;
	    break;
	  case Qtrue:
	    return Qtrue;
	}
    }
    return Qfalse;
}
```

That lead me to `vm_insnhelper.c` `rb_equal_opt` then to `opt_eq_func` and something didn't feel right:

```c
static
#ifndef NO_BIG_INLINE
inline
#endif
VALUE
opt_eq_func(VALUE recv, VALUE obj, CALL_INFO ci, CALL_CACHE cc)
{
#define BUILTIN_CLASS_P(x, k) (!SPECIAL_CONST_P(x) && RBASIC_CLASS(x) == k)
#define EQ_UNREDEFINED_P(t) BASIC_OP_UNREDEFINED_P(BOP_EQ, t##_REDEFINED_OP_FLAG)
    if (FIXNUM_2_P(recv, obj)) {
	if (EQ_UNREDEFINED_P(INTEGER)) {
	    return (recv == obj) ? Qtrue : Qfalse;
	}
    }
    else if (FLONUM_2_P(recv, obj)) {
	if (EQ_UNREDEFINED_P(FLOAT)) {
	    return (recv == obj) ? Qtrue : Qfalse;
	}
    }
    else if (BUILTIN_CLASS_P(recv, rb_cFloat)) {
	if (EQ_UNREDEFINED_P(FLOAT)) {
	    return rb_float_equal(recv, obj);
	}
    }
    else if (BUILTIN_CLASS_P(recv, rb_cString)) {
	if (EQ_UNREDEFINED_P(STRING)) {
	    return rb_str_equal(recv, obj);
	}
    }
#undef EQ_UNREDEFINED_P
#undef BUILTIN_CLASS_P

    {
	vm_search_method(ci, cc, recv);

	if (check_cfunc(cc->me, rb_obj_equal)) {
	    return recv == obj ? Qtrue : Qfalse;
	}
    }

    return Qundef;
}
```

*I was going to say I hate formatting like that but turned out it's because they mix spaces and tabs in the file. Duh!*

Looking at the code it's pretty obvious - there's no special case for symbols. I guess I kinda expected that Ruby has optimized methods written in C. Now it was time to figure out how to write the missing one.

First, some set up. Run once to prepare make files (Mac OS X):

```
autoconf
CFLAGS="-O0 -ggdb" ./configure --prefix=/usr/local/opt/rbenv/versions/2.5.0 --with-openssl-dir="$(brew --prefix openssl)"  --disable-install-doc
```

Then to compile:

```
make && make check && make install
```

[The Ruby C API guide](https://silverhammermba.github.io/emberb/c/) is a good starting point to understand what's going on in the code. The most important lesson - you cannot `printf` a `VALUE`, there's `rb_p` for that.

Also you can debug stuff with `lldb` and it's pretty simple (it's not `gdb` though so [commands are different](https://lldb.llvm.org/tutorial.html)):

`lldb /usr/local/opt/rbenv/versions/2.5.0/bin/ruby -- -e "if [:test, :another].include?(:test); puts 'A'; end"`

```
breakpoint set --file vm_insnhelper.c --line 1279
process launch
process continue
```

Of course I was so eager that I tried many things before I finally searched for The Ruby C API guide :-D I thought it's easy to understand and I could deal with C code as it was back in the days.

When I read the guide it was obvious that I had to use `SYMBOL_P`:

```diff
diff --git a/vm_insnhelper.c b/vm_insnhelper.c
index a991e59..476b5e2 100644
--- a/vm_insnhelper.c
+++ b/vm_insnhelper.c
@@ -1296,6 +1296,11 @@ opt_eq_func(VALUE recv, VALUE obj, CALL_INFO ci, CALL_CACHE cc)
 	    return rb_str_equal(recv, obj);
 	}
     }
+    else if (SYMBOL_P(recv) && SYMBOL_P(obj)) {
+        if (EQ_UNREDEFINED_P(SYMBOL)) {
+	    return rb_obj_equal(recv, obj);
+	}
+    }
 #undef EQ_UNREDEFINED_P
 #undef BUILTIN_CLASS_P
```

Now running the benchmark again:

```
Comparison:
       array symbols:  1630417.3 i/s
               array:  1372269.7 i/s - 1.19x  slower
```

Symbols are now faster! That's how it should work from the beginning.

As you can see it's easy to browse C code. Also if you see something sticking out in your benchmarks it could be just a simple bug in the code. You need to remember there are two layers in Ruby - Ruby code and C code. If your Ruby code looks good could be C code that's faulty.

Created [PR with a fix](https://github.com/ruby/ruby/pull/1540).

If you have any comments share them with [me](https://twitter.com/devonsteroids).

