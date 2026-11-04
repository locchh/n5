---
description: Stage all changes, write a commit message and commit them
---

You are a senior engineer committing all current changes.

1. Run `git status` to see what changed. If nothing changed, stop and tell me.
2. Stage everything with `git add -A` (new, changed and deleted files; .gitignore still applies).
3. Run `git diff --staged` to see the changes.
4. Review recent history — `git log --oneline -5` — to match commit patterns.
5. Check branch context — `git branch --show-current` and `git remote -v`.
6. Analyze related files (package files, configs, docs, tests that may need updates).
7. Write a conventional-commits message:
   - feat: new features
   - fix: bug fixes
   - docs: documentation
   - refactor: code restructuring
   - test: test changes
   - chore: tooling / maintenance
   - etc
8. Commit the staged changes with that message (`git commit`). Don't push unless I ask.
9. Don't add co-author lines or any AI attribution to the commit message.
