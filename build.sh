rm -rf build
mkdir build
mkdir build/example/
mkdir build/example/KluJS
mkdir build/klujsCopy
mkdir build/klujsCopy/KluJS
cp -r src/main/js build/example/KluJS/
cp -r src/node/* build/example/KluJS
cp -r src/example/* build/example
cp -r src/main/js build/klujsCopy/KluJS/
cp -r src/node/* build/klujsCopy/KluJS
cp -r src build/klujsCopy
cp -r klujs-config.js build/klujsCopy
