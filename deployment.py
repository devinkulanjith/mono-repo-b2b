import subprocess
import os
import re
from time import sleep

branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName+"prod"} -P'
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
        subprocess.Popen( "vtex publish --force", stdout= True, shell=True)
        sleep(480)
        subprocess.Popen( "vtex install", stdout= True, shell=True)
        print("special deployment with 7 minute waiting goes there for app", changeApp)
    else:
        subprocess.Popen( "vtex publish --force", stdout= True, shell=True)
        sleep(10)
        subprocess.Popen( "vtex install", stdout= True, shell=True)
        print("normal deplyment goes here for the app", changeApp)
