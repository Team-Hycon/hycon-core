time=$(date +"%Y%m%d_%H%M")
foldername="HYCON_0.0.4_"$time
#build_time=${1:?"requires an argument DateTime" }
platform=${1:?"requires an argument macos | linux | win" }

if [ $platform != "linux" ] && [ $platform != "win" ] && [ $platform != "macos" ]
then
    echo "================== Error: platform not supported  ==============="
    exit 1
fi

output_dir=bundle-$platform
#build_time=$(date +"%Y%m%d_%I%M")
file_name=$foldername'_'$platform'.zip'
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

if [ $platform = "linux" ]
then
    cp -f ../node_modules/sqlite3/lib/binding/node-v59-linux-x64/node_sqlite3.node .
    cp -f ../node_modules/node-cryptonight/build/Release/cryptonight.node .
    cp -f ../node_modules/rocksdb/build/Release/leveldown.node .
else
    cp -f ../platform/$platform/node-modules/* .
fi

if [ -e "../hycon.exe" ]
then
    cp -f ../hycon.exe .       
    cp -f ../launch.bat .
elif [ -e "../hycon" ]
then
    cp -f ../hycon .
    cp -f ../launch.sh.command .
else
    echo "================== Error: Executable not found ==============="
    exit 1
fi
cp -f ../documents/* .
mkdir node_modules
cp -rf ../node_modules/react* ./node_modules/

rm data/config.json
cp ../platform/$platform/config/* data/
cp ../platform/$platform/miner/* .

cd ..
zip -r $file_name $output_dir

