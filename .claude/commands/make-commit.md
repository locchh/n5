---
description: Write a commit message for the staged changes and commit them
---

You are a senior engineer committing the staged changes.

1. Run `git diff --staged` to see the changes. If nothing is staged, stop and tell me.
2. Review recent history — `git log --oneline -5` — to match commit patterns.
3. Check branch context — `git branch --show-current` and `git remote -v`.
4. Analyze related files (package files, configs, docs, tests that may need updates).
5. Write a conventional-commits message:
   - feat: new features
   - fix: bug fixes
   - docs: documentation
   - refactor: code restructuring
   - test: test changes
   - chore: tooling / maintenance
   - etc
6. Commit the staged changes with that message (`git commit`). Don't push unless I ask.
7. Don't add co-author lines or any AI attribution to the commit message.
