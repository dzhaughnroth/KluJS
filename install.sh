rm -rf module.bak
cp -r module module.bak
rm -rf module
mkdir module
mkdir module/KluJS
cp -r src/node/* module
cp -r src/main/js module/KluJS/js
cp package.json module
cp klujs-server module
echo "To install locally: cd module; sudo npm link"
