import subprocess
import os
import re
from time import sleep
from multiprocessing import Process
from os import kill
from signal import SIGKILL

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

mainLoop = True
numberOfRetry = 0
PUBLISH_SUCCESSFUL_SENTENCE = 'was published successfully!'
PUBLISH_UNSUCCESSFUL_SENTENCE = 'Failed to publish'
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
        while mainLoop:
            numberOfRetry = numberOfRetry + 1
            proc = subprocess.Popen(f"echo +++special deployment with 7 minute waiting goes there for app {changeApp} with Attempt {numberOfRetry} +++", stdout= True, shell=True)
            proc.wait()
            p5 = subprocess.Popen( "yes $'yes\nno'| vtex publish --force > error.txt", stdout= True, shell=True)
            
            sleep(3)
            var = True
            while var:
                with open('error.txt','r',encoding='utf-8') as file:
                    sleep(5)
                    content = file.read()
                    successResult = content.find(PUBLISH_SUCCESSFUL_SENTENCE)
                    failResult = content.find(PUBLISH_UNSUCCESSFUL_SENTENCE)
                    if successResult != -1: 
                        var = False
                        mainLoop = False
                        proc = subprocess.Popen("echo +++ App published successfully +++", stdout= True, shell=True)
                        proc.wait()
                        process = subprocess.Popen("rm error.txt", stdout=True, shell=True)
                        process.wait()
                        sleep(480)
                        p0 = subprocess.Popen( "echo 'yes' | vtex deploy", stdout= True, shell=True)
                        p0.wait()
                        p6= subprocess.Popen("echo 'yes' | vtex install", stdout= True, shell=True)
                        p6.wait()
                    elif failResult != -1:
                        kill(p5.pid, SIGKILL)
                        var = False
                        process = subprocess.Popen("rm error.txt", stdout=True, shell=True)
                        process.wait()
                        if numberOfRetry > 3:
                            mainLoop = False
                            proc = subprocess.Popen("echo --- App is not published successfully ---", stdout= True, shell=True)
            
        mainLoop = True
        numberOfRetry = 0
    else:
        os.chdir(currentDirectory + '/' + changeApp)
        sleep(5)
        while mainLoop:
            numberOfRetry = numberOfRetry + 1
            proc = subprocess.Popen(f"echo +++ Normal Deployment goes with {changeApp} with Attempt {numberOfRetry} +++", stdout= True, shell=True)
            proc.wait()
            p5 = subprocess.Popen( "yes $'yes\nno'| vtex publish --force > error.txt", stdout= True, shell=True)
            
            sleep(3)
            var = True
            while var:
                with open('error.txt','r',encoding='utf-8') as file:
                    sleep(5)
                    content = file.read()
                    successResult = content.find(PUBLISH_SUCCESSFUL_SENTENCE)
                    failResult = content.find(PUBLISH_UNSUCCESSFUL_SENTENCE)
                    if successResult != -1: 
                        var = False
                        mainLoop = False
                        proc = subprocess.Popen("echo +++ App published successfully +++", stdout= True, shell=True)
                        proc.wait()
                        process = subprocess.Popen("rm error.txt", stdout=True, shell=True)
                        process.wait()
                        p6= subprocess.Popen("echo 'yes' | vtex install", stdout= True, shell=True)
                        p6.wait()
                    elif failResult != -1:
                        kill(p5.pid, SIGKILL)
                        var = False
                        process = subprocess.Popen("rm error.txt", stdout=True, shell=True)
                        process.wait()
                        if numberOfRetry > 3:
                            mainLoop = False
                            proc = subprocess.Popen("echo --- App is not published successfully ---", stdout= True, shell=True)
            
        mainLoop = True
        numberOfRetry = 0

