import subprocess
import os
from time import sleep
from multiprocessing import Process
from signal import SIGKILL
from os import kill
import re
import yaml
import psutil
import signal

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
processorsForLink = []
#contain changed app list
appList =  []

linkAppNameDict = {}

def appLink():
    cmd = "echo 'yes' |vtex link > output.txt"
    subprocess.Popen(cmd, stdout= True, shell=True)


def watchLinkAction(appName):
    os.chdir(currentDirectory+"/"+appName)
    print("Inside directory for read ", currentDirectory+"/"+appName)
    var = True
    sleep(3)
    while var:
        with open('output.txt', 'r', encoding='utf-8') as file:
            sleep(5)
            contents = file.read()
            sentence = 'App linked successfully'
            result = contents.find(sentence)
            print("Result for file ", currentDirectory+"/"+appName, " Result : ", result)
            print("+++ ", contents)
            if result != -1:
                var = False
                print(appName + " app link successful ... process will be killed")
                subprocess.Popen("rm output.txt", shell=True)
                try:
                    # print("pid", linkAppNameDict[appName] )
                    sleep(5)
                    print("Before killing process: ", linkAppNameDict[appName].pid)
                    # os.kill(os.getppid(pro.pid), signal.SIGTERM)
                    
                    linkAppNameDict[appName].kill()
                    print("After killing process: ", linkAppNameDict[appName].pid)
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
        for app in parentAppList:
            if app in appList:
                os.chdir(currentDirectory + '/' + app)
                print("Inside directory ", currentDirectory + '/' + app)
                pro = subprocess.Popen("echo 'yes' |vtex link > output.txt", stdout= True, shell=True)
                # process = Process(target= appLink)
                # process.start()
                print("executing...", pro.pid)
                sleep(3)
                processors.append(pro)
                linkAppNameDict[app] = pro
                sleep(2)

        print("All processes", linkAppNameDict.keys)

        for app in parentAppList:
            if app in appList:
                linkProcess = Process(target= watchLinkAction, args=(app,))
                linkProcess.start()
                sleep(3)
                processorsForLink.append(linkProcess)

        # for process in processors:
        #     process.join()
        
        for linkSubProcess in processorsForLink:
            print("Joining the process ", linkSubProcess.pid)
            linkSubProcess.join()
 
        
print("finisheddd")  
# print("ooooo", linkAppNameDict)
for x in processors:
    if psutil.pid_exists(x.pid):
        print(" process exits", x.pid)
    else:
        print("process does not exist", x.pid)

for y in processorsForLink:
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
