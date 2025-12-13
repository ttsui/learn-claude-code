# Coding Agent: Small, Logically-Scoped Commits

## Core Philosophy

Every commit should be a **checkpoint**—a snapshot of the project at a specific moment where the code compiles, tests pass, and the change represents one logical unit of work. Think of commits as chapters in a story: each should make sense on its own and contribute to a narrative that others can follow.

**The golden rule**: Do one thing per commit. If you find yourself using "and" in a commit message, you're probably bundling unrelated changes.

---

## Commit Sizing Guidelines

### What Makes a "Small" Commit

A small commit is one with **minimal scope**—it does one "thing." This often correlates to minimizing modified lines, but size isn't the only factor. The key characteristics:

- The project **still builds** after the commit
- All tests **still pass**
- The commit has a **single, clear purpose**
- The change can be **cleanly reverted** or **cherry-picked** without entangling unrelated code

### What Makes a "Meaningful" Commit

A meaningful commit represents a **logical step forward**, even if the feature isn't complete:

- Adding a new function (even without its callers)
- Renaming a variable or method
- Extracting a method during refactoring
- Adding a test (with or without the implementation)
- Reformatting code
- Fixing a single bug

### Examples of Good Commit Scope

```
✓ "Add user authentication endpoint"
✓ "Rename getUserData to fetchUserProfile"
✓ "Extract validation logic into separate module"
✓ "Fix null pointer exception in login flow"
✓ "Add unit test for network error handling"
✓ "Update dependencies to latest versions"
```

### Examples of Poor Commit Scope

```
✗ "Various updates"
✗ "Fix bugs and add feature"
✗ "WIP"
✗ "More changes"
✗ "Implement user auth and update UI styles and fix typos"
```

---

## Separation of Concerns

### Never Mix These in One Commit

1. **Reformatting** and **functional changes**
   - If you re-indent code while fixing a bug, commit the reformatting first, then the bug fix

2. **Refactoring** and **new features**
   - Refactor existing code in one commit, add new functionality in another

3. **Code moves** and **code modifications**
   - When moving code between files, do a pure move first, then modify in a subsequent commit

4. **Multiple unrelated bug fixes**
   - Each bug fix should be its own commit

### Why Separation Matters

- **Code reviews become faster**: Reviewers can understand one intention at a time
- **Debugging becomes easier**: `git bisect` can pinpoint exactly when something broke
- **Reverting is safer**: You can undo one change without losing unrelated work
- **History tells a story**: Future developers can follow your thought process

---

## Test-Driven Development (TDD) Workflow

This agent follows TDD principles: **write the test first, then implement the feature**. Each step is a separate commit.

### The TDD Commit Loop

1. **Write a pending test** that defines the expected behavior (marked as skipped/pending)
2. **Commit the pending test**
3. **Implement** the minimum code to make the test pass
4. **Enable the test** and verify it passes
5. **Commit the implementation** (with the test now enabled)
6. **Refactor** the code while keeping tests green
7. **Commit the refactoring** (if any changes were made)
8. Repeat

### Why Separate Commits for Test and Implementation?

- **Tests document intent**: A commit with just the test shows _what_ behavior is expected, separate from _how_ it's achieved
- **Reviewable in isolation**: Reviewers can evaluate whether the test correctly captures requirements before seeing the implementation
- **Revertable independently**: If an implementation approach is wrong, you can revert it while keeping the test that defines correct behavior
- **Demonstrates TDD discipline**: The commit history proves tests were written first, not backfilled

### Pending Tests

Tests should be committed in a **pending/skipped state** rather than failing. This ensures:

- The test suite always passes (no broken builds)
- The intent is clear: this is a planned test awaiting implementation
- CI pipelines remain green

Most test frameworks support pending tests:

```javascript
// Jest
it.todo("should calculate discount for bulk orders");

// or skip
it.skip("should calculate discount for bulk orders", () => {
  // test implementation ready, awaiting feature code
});
```

```python
# pytest
@pytest.mark.skip(reason="awaiting implementation")
def test_calculate_bulk_discount():
    ...
```

```ruby
# RSpec
it 'calculates discount for bulk orders' do
  pending 'awaiting implementation'
  # test code here
end
```

### Example TDD Sequence

```
1. test(cart): add pending test for calculating item subtotal
2. feat(cart): implement item subtotal calculation
3. test(cart): add pending test for applying quantity discounts
4. feat(cart): implement quantity discount logic
5. refactor(cart): extract discount rules to separate module
6. test(cart): add pending test for cart total with multiple items
7. feat(cart): implement cart total calculation
```

---

## General Commit Workflow

### The Basic Loop

1. Get current code and ensure tests pass
2. Make **one small change**
3. Verify tests still pass (and code compiles)
4. Commit with a clear message
5. Repeat

### Handling Unrelated Changes

When you realize you've started work on something unrelated to your current task:

```bash
# Stash unrelated changes to handle later
git stash push -m "unrelated: fix typo in readme"

# Continue with your current focused work
# ... make changes, commit ...

# Later, retrieve the stashed changes
git stash pop
```

This keeps your commits focused on one logical change without losing other work you've noticed along the way.

---

## Commit Messages

### Structure

```
<type>(<scope>): <short summary>

<optional body explaining what and why>
```

### Guidelines

- **Subject line**: 50 characters or less, imperative mood ("Add feature" not "Added feature")
- **Body**: Explain the **what** and **why**, not the how (the code shows the how)
- **No trailing punctuation** on subject line
- **Blank line** between subject and body

### Type Prefixes (Optional but Recommended)

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring without behavior change
- `docs:` — Documentation only
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks (dependencies, configs)
- `style:` — Formatting, whitespace (no code change)

### Examples

```
feat(auth): add JWT-based authentication

Implements token generation and validation using the jose library.
Tokens expire after 24 hours and include user role claims.

Closes #123
```

```
fix(login): resolve race condition in session handling

The previous implementation could create duplicate sessions when
multiple login requests arrived simultaneously. Added mutex lock
around session creation.
```

```
refactor: extract database queries into repository layer

No functional changes. Moves SQL queries from controllers to
dedicated repository classes for better separation of concerns.
```

---

## Working with Feature Branches

### Recommended Commit Sequence for a Feature (TDD Approach)

1. **Test first**: Write a pending test that defines the expected behavior
2. **Implementation**: Write minimum code to make the test pass, enable the test
3. **Refactor**: Clean up while keeping tests green
4. **Repeat**: Next pending test, next implementation, next refactor
5. **Documentation**: Update comments, README, etc.

### Example: Adding JSON Parsing

```
1. test(networking): add pending test for parsing valid JSON
2. feat(networking): implement basic JSON parsing
3. test(networking): add pending test for malformed JSON error
4. feat(networking): add error handling for invalid JSON
5. refactor(networking): extract error messages to constants
6. test(networking): add pending test for empty input handling
7. feat(networking): handle empty input case
```

### Example: Adding GitHub Actions CI Workflow

Even when changes seem related, break them into distinct logical units:

```
1. ci: add GitHub Actions workflow for building application
2. ci: add test execution step to workflow
3. ci: add dependency caching to workflow
4. ci: add matrix testing for multiple Node versions
```

The build step and test step are **separate concerns**—building verifies compilation succeeds, while testing verifies behavior. Each can be understood, reviewed, and potentially reverted independently. If tests start failing due to a workflow configuration issue, you can isolate whether it's a build problem or a test execution problem by examining separate commits.

This also allows for incremental progress: a working build workflow is valuable on its own, even before test execution is added.

---

## Before Pushing

### Final Checklist

Before each push, verify:

- [ ] Each commit builds independently
- [ ] Each commit passes all tests
- [ ] No commit mixes unrelated changes
- [ ] Commit messages are clear and descriptive
- [ ] Tests are committed as pending before their implementations (TDD)

---

## Benefits of This Approach

### For You

- **Safe experimentation**: Always have a working version to return to
- **Easier debugging**: Narrow down issues to specific, small changes
- **Better focus**: Completing one thing at a time reduces mental overhead
- **Graceful retreat**: Can `git reset --hard` to safety at any moment

### For Your Team

- **Faster code reviews**: Small commits are quick to understand
- **Easier merges**: Frequent small commits mean fewer conflicts
- **Better collaboration**: Changes integrate smoothly
- **Readable history**: New team members can learn from commit progression

### For the Project

- **Reliable bisecting**: Find exactly when bugs were introduced
- **Clean cherry-picking**: Extract specific changes for hotfixes
- **Meaningful changelogs**: Auto-generate release notes from commit history
- **Maintainable codebase**: History becomes documentation

---

## Quick Reference

| Do                             | Don't                         |
| ------------------------------ | ----------------------------- |
| One logical change per commit  | Bundle unrelated changes      |
| Commit when tests pass         | Commit broken code            |
| Write descriptive messages     | Use "WIP" or "misc"           |
| Separate formatting from logic | Mix refactoring with features |
| Commit every few minutes       | Wait hours between commits    |
| Stage specific files/hunks     | Always use `git add .`        |

---

## Remember

> "Commit early and often to move forward quickly and safely."

The smaller your steps, the faster your progress. What seems counterintuitive becomes powerful: small commits mean easy merges, quick reviews, safe experimentation, and code that always works.

When in doubt: **make the commit smaller**.
