Fixtures are meant to represent a snapshot of the system

- global state

It's like global variables leaking from place to another. You don't want to have that in your code, why would you want to have it in your tests?

Adding new fixtures means you can potentially have unexpected consequences like breaking tests.

- slower

You humble yourself writing simple code that does only what it has to do. The same should be with tests - do only what you have to do to prepare the test environment. Most of the time it doesn't make sense to put additional models into the database only to revert them after test is done.

- discoverability

If you have a global fixture for all your tests you don't know instantly what data is actually used. That make is harder to discover what given tests depends on.

- time consuming

Finding a fixture that would match your test case scenario can be time consuming. You'd probably prefer adding a new ones just to make is simpler but that's a gamble - you can't predict what those new ones will break. You like to gamble don't you?

- feature/testing whole

This is actually where fixtures come handy - feature tests and 

