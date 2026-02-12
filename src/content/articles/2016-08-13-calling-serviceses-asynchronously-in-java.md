---
title: "How to call services asynchronously in Java?"
date: "2016-08-13"
description: "Imagine you are building some aggregation service of some sort. It could be a stock exchange monitor, or a news website that needs to read data from..."
tags:
  - java
  - threads
  - concurrency
series: "calling-services-asynchronously"
---
Imagine you are building some aggregation service of some sort. It could be a stock exchange monitor, or a news website that needs to read data from different sources.

I guess there are couple of things you would want it to do. First you want it to deliver results as soon as possible. You also don't want it to get blocked when one of the sources is unusually slow.

I think this is a good example to show how you can write code that executing in parallel. So let's write it!

Let me start with Java first as I have a working code already. In next posts I'm going to follow up and show similar solutions in different languages.

Of course our application needs to be a REST service. For the sake of presentation services that are being called will be mocked.

You can [jump right to the code](https://github.com/pawelniewie/calling-services-asynchronously/tree/master/java) or read about the most interesting part (executing and monitoring tasks):

```java
package async.aggregate;

// imports ommitted

@Slf4j
@Service
public class AggregationService implements DisposableBean, InitializingBean {
    private static final int MAX_WAIT_TIME = 5;

    @Autowired
    private List<ServiceClient> serviceClients;

    private ThreadPoolExecutor executor;

    public ResultsDto getResults() throws InterruptedException {
        List<Future<Either<Exception, String>>> results = executor.invokeAll(serviceClients
                .stream()
                .map(serviceClient -> {
                            Callable<Either<Exception, String>> callable = () ->
                                    serviceClient.getData();
                            return callable;
                        }
                ).collect(toList()), MAX_WAIT_TIME, TimeUnit.SECONDS);

        // get only all the successful results
        Iterable<String> connectionsForEachProvider = Eithers.filterRight(results
                .stream()
                .filter(Future::isDone)
                .map(future -> {
                    try {
                        return future.get();
                    } catch (Exception e) {
                        return Either.<Exception, String>left(e);
                    }
                })
                .collect(toList()));

        return ResultsDto.builder()
                .results(copyOf(concat(connectionsForEachProvider)))
                .build();
    }

    @Override
    public void destroy() throws Exception {
        executor.shutdownNow();
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        executor = new ThreadPoolExecutor(serviceClients.size(), Integer.MAX_VALUE,
                60L, TimeUnit.SECONDS,
                new SynchronousQueue<>());
        // it will immediately create threads
        executor.prestartAllCoreThreads();
    }
}
```

It may look unfamiliar at first but when you look closely I bet you can undestand it.

`serviceClients` is a list of clients we are going to use to retrieve data from remote services.

`ThreadPoolExecutor` is a great class that allows to spin up and manage pool of threads that can do work for us.

`afterPropertiesSet` is a method called when the bean gets created in Spring. So we can spin up our `ThreadPoolExecutor`. It will create n threads based on size of `serviceClients`. It will keep them running even if there's no job for them.

`destroy` will be called when the bean gets removed from Spring.

`executor.invokeAll` executes all requests and waits for results up to `MAX_TIME` seconds. So if the service is slow we will skip it.

`List<Future<Either<Exception, String>>>` is a list of future results that will be either Exception (in case the call fails) or String (the real result).

Now lets test it with:

`time http http://localhost:8080`

```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Date: Thu, 11 Aug 2016 18:27:26 GMT
Server: Apache-Coyote/1.1
Transfer-Encoding: chunked

{
    "results": [
        "4000", 
        "1000"
    ]
}

http http://localhost:8080  0.20s user 0.05s system 4% cpu 5.281 total
```


```
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Date: Thu, 11 Aug 2016 19:05:24 GMT
Server: Apache-Coyote/1.1
Transfer-Encoding: chunked

{
    "results": []
}

http http://localhost:8080  0.20s user 0.05s system 4% cpu 5.269 total
```


PS
[Grab http if you already don't have it](http://httpie.org)
