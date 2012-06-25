rm -rf build
mkdir build
mkdir build/example/
mkdir build/example/KluJS
mkdir build/klujsCopy
mkdir build/klujsCopy/KluJS
cp -r src/main/javascript build/example/KluJS/
cp -r src/aux/* build/example/KluJS
cp -r src/example/* build/example
cp -r src/main/javascript build/klujsCopy/KluJS/
cp -r src/aux/* build/klujsCopy/KluJS
cp -r src build/klujsCopy
cp -r klujs-config.js build/klujsCopy
