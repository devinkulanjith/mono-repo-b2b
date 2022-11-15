import subprocess
import os
from time import sleep
from multiprocessing import Process
from signal import SIGKILL
from os import kill
import re
import yaml
import psutil

branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName}'
subprocess.Popen( linkCommand, shell=True)
sleep(5)

currentDirectory = os.getcwd()

apps = open('president_order.txt','r')
appListOrder = apps.readlines()

vtexAppLinkOrder = []
processors = []
processors2 = []
#contain changed app list
appList =  []

linkAppNameDict = {}

def appLink():
    cmd = "echo 'yes' |vtex link > output.txt"
    subprocess.Popen(cmd, stdout= True, shell=True)


def watchLinkAction(appName):
    os.chdir(currentDirectory+"/"+appName)
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
                print(appName + " app link successful ... process will be killed")
                subprocess.Popen("rm output.txt", shell=True)
                
                try:
                    print("pid",linkAppNameDict[appName] )
                    sleep(5)
                    # kill(linkAppNameDict[appName], 0)
                except Exception as e:
                    print("something went wrong", e)



with open('changeList.txt', 'r', encoding='utf-8') as file:
    contents = file.read()
    for app in appListOrder:
        appName = app.replace('\n','')
        result = contents.find(appName)
        if result != -1:
            appList.append(appName)

p2 = subprocess.Popen("rm changeList.txt", stdout=True, shell=True)
p2.wait()

print('test',appList)

with open('order.yml', 'r') as file:
    prime_service = yaml.safe_load(file)
    parentAppList = prime_service["parent_level"]["app_list"]
    if len(appList) != 0:
        print("parent app list", parentAppList)
        for app in parentAppList:
            if app in appList:
                print('apppppp', app)
                os.chdir(currentDirectory + '/' + app)
                process = Process(target= appLink)
                process.start()
                sleep(3)
                processors.append(process)
                print("pid checking", process.pid)
                linkAppNameDict[app] = process.pid
                sleep(2)

        for app in parentAppList:
            if app in appList:
                linkProcess = Process(target= watchLinkAction, args=(app,))
                linkProcess.start()
                sleep(3)
                processors2.append(linkProcess)

        for p in processors:
            p.join()
        
        for pp in processors2:
            pp.join()
 
        

print("finisheddd")  
print("ooooo", linkAppNameDict)
for x in processors:
    if psutil.pid_exists(x.pid):
        print(" process exits", x.pid)
    else:
        print("process does not exist", x.pid)


for y in processors2:
    if psutil.pid_exists(y.pid):
        print(" process exits", y.pid)
    else:
        print("process does not exist", y.pid)
# if len(appList) != 0:
#     for app in appListOrder:
#        appName = app.replace('\n','')
#        if appName in appList:
#            vtexAppLinkOrder.append(appName)

#     for app in vtexAppLinkOrder:
#         os.chdir(currentDirectory + '/' + app)
#         process = Process(target= appLink)
#         process.start()
#         var = True
#         sleep(3)
#         while var:
#             with open('output.txt', 'r', encoding='utf-8') as file:
#                 sleep(5)
#                 contents = file.read()
#                 sentence = 'App linked successfully'
#                 result = contents.find(sentence)
#                 if result != -1:
#                     var = False
#                     print(app + " app link successful ... process will be killed")
#                     subprocess.Popen("rm output.txt", shell=True)
#                     try:
#                         kill(process.pid, SIGKILL)
#                     except:
#                         print("something went wrong")
