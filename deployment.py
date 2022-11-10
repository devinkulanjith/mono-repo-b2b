import subprocess
import os
import re
from time import sleep

currentDirectory = os.getcwd()
branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName+"prod"} --production'
subprocess.Popen( linkCommand, stdout= True, shell=True)

sleep(5)

cmd = "git diff --name-only HEAD^ HEAD > temp.txt"
changedAppList = []
blockLevelChangedAppList = []

apps = open('president_order.txt','r')
appListOrder = apps.readlines()


p1 = subprocess.Popen(cmd, stdout=True, shell=True)
p1.wait()

with open('temp.txt', 'r', encoding='utf-8') as file:
    contents = file.read()
    for app in appListOrder:
        appName = app.replace('\n','')
        result = contents.find(appName)
        if result != -1:
            changedAppList.append(appName)

    for changedApp in changedAppList:
        blockLevelChangeResult = contents.find(changedApp+"/store/interfaces.json")
        if blockLevelChangeResult != -1:
            blockLevelChangedAppList.append(changedApp)


p2 = subprocess.Popen("rm temp.txt", stdout=True, shell=True)
p2.wait()


for changeApp in changedAppList:
    if changeApp in blockLevelChangedAppList:
        os.chdir(currentDirectory + '/' + changeApp)
        sleep(5)
        print("special deployment with 7 minute waiting goes there for app", changeApp)
        p3 = subprocess.Popen( "{echo 'yes'; echo 'yes' }| vtex publish --force", stdout= True, shell=True)
        p3.wait()
        sleep(480)
        p4=subprocess.Popen( "echo 'yes' | vtex install", stdout= True, shell=True)
        p4.wait()
    else:
        os.chdir(currentDirectory + '/' + changeApp)
        sleep(5)
        print("normal deplyment goes here for the app", changeApp)
        p5 = subprocess.Popen( "yes $'yes\nno'| vtex publish --force", stdout= True, shell=True)
        p5.wait()
        sleep(10)
        p6= subprocess.Popen( "echo 'yes' | vtex install", stdout= True, shell=True)
        p6.wait()
