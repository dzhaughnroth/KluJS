Functional tests

Have phantomjs (1.6.0, say) on your path, and run 
node runExamples.js

It make a copy of base, and runs klujs-server --phantom on the result, checks the outcome, 
tweaks the directory, and does it again.

It goes like this:

Run base; lint fails.
Remove test/js/lint directory; all passes
Move UncovereredTwoSpec to a new direcotyr; cov fail
Use line instead of element coverage: pass.
Add element exception in cov; pass
Replace UncoveredTwoSpec; Move UncoveredSpec to a new diectory; deadcode
Add deadcode exception for Uncovered; pass
Replace FineSpec with one that does the same and fails. fail spec
