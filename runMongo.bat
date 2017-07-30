@ECHO off
SET mongoPath="C:\Program Files\MongoDB\Server\3.4\bin"
SET dataPath="D:\Documents\Workspace\ATD04\data"

CD /D %mongoPath%


mongod --dbpath %dataPath%
set /p v=Press enter to exit