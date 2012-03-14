This example shows what you need to do to put KluJS under the test directory
instead of the main directory, like you should.

(1) Run

sh build-example-directory.sh to copy the current KluJS library from
src/main/javascript to example/test/lib/KluJS

(2) Start the proxy here with

node example/test/lib/KluJS/klujs-proxy.js 

(3) Browse to

http://localhost:7000/test/gloof/klujs.html

to see it run.

(4) Inspect klujs, particularly the "paths" setting for KluJS.

