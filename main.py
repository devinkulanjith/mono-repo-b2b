import subprocess
import os
from time import sleep
from multiprocessing import Process
from signal import SIGKILL
from os import kill
import re

branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName}'
subprocess.Popen( linkCommand, shell=True)
sleep(5)

currentDirectory = os.getcwd()

apps = open('president_order.txt','r')
appListOrder = apps.readlines()

vtexAppLinkOrder = []

appList =  []

with open('changeList.txt', 'r', encoding='utf-8') as file:
    contents = file.read()
    for app in appListOrder:
        appName = app.replace('\n','')
        result = contents.find(appName)
        if result != -1:
            appList.append(appName)

p2 = subprocess.Popen("rm changeList.txt", stdout=True, shell=True)
p2.wait()

def appLink():
    cmd = "echo 'yes' |vtex link > output.txt"
    subprocess.Popen(cmd, stdout= True, shell=True)

if len(appList) != 0:
    for app in appListOrder:
       appName = app.replace('\n','')
       if appName in appList:
           vtexAppLinkOrder.append(appName)

    for app in vtexAppLinkOrder:
        os.chdir(currentDirectory + '/' + app)
        process = Process(target= appLink)
        process.start()
        var = True
        sleep(3)
        while var:
            with open('output.txt', 'r', encoding='utf-8') as file:
                sleep(5)
                contents = file.read()
                sentence = 'App linked successfully'
                result = contents.find(sentence)
                if result != -1:
                    var = False
                    print(app + " app link successful ... process will be killed")
                    subprocess.Popen("rm output.txt", shell=True)
                    try:
                        kill(process.pid, SIGKILL)
                    except:
                        print("something went wrong")
