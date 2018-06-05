build_time=${1:?"requires an argument DateTime" }
platform=${2:?"requires an argument macos | linux | win" }
output_dir=bundle-$platform
#build_time=$(date +"%Y%m%d_%I%M")
file_name=$build_time'_'$platform'.zip'
npm i
npm run clear
rm -rf build
tsc
echo "=============== npm  tsc init finish============="
if [ -e "./src/api/clientDist" ]
then    
    rm -rf ./src/api/clientDist
fi

npm run clear
npm run block:build
echo "==================UI build finish==============="
pkg . --target $platform -o hycon
mkdir $output_dir
if [ -e $output_dir ]
then
    rm -rf $output_dir
fi
mkdir $output_dir
cd $output_dir
cp -rf ../data . 
if [ -e "../hycon.exe" ]
then
    cp -f ../hycon.exe .       
    cp -f ../launch.bat .
    cp -f ../node-for-windows/* .
elif [ -e "../hycon" ]
then
    cp -f ../hycon .
    cp -f ../launch.sh.command .
    cp -f ../node_modules/node-cryptonight/build/Release/cryptonight.node .
    cp -f ../node_modules/rocksdb/build/Release/leveldown.node .
    if [ $platform = "macos" ]
    then
        cp -f ../node_modules/sqlite3/lib/binding/node-v59-darwin-x64/node_sqlite3.node .
    elif [ $platform = "linux" ]
    then
        cp -f ../node_modules/sqlite3/lib/binding/node-v59-linux-x64/node_sqlite3.node .
    else
        echo "================== Error: platform not recognised ==============="
        exit 1
    fi
else
    echo "================== Error: Executable not found ==============="
    exit 1
fi
cp -f ../documents/* .
mkdir node_modules
cp -rf ../node_modules/react* ./node_modules/

rm data/config.json
if [ $platform = "macos" ]
then
   cp ../platform-config/config_mac.json data/config.json 
   cp ../xmrig-opencl-mac/* .
elif [ $platform = "linux" ]
then
   cp ../platform-config/config_linux.json data/config.json 
   cp ../xmrig-opencl-linux/* .
else
   cp ../platform-config/config-win.json data/config.json 
   cp ../xmrig-opencl-win/* .
fi

cd ..
zip -r $file_name $output_dir

