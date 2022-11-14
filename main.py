import subprocess
import os
from time import sleep
from multiprocessing import Process
from signal import SIGKILL
from os import kill
import re
import yaml

branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName}'
subprocess.Popen( linkCommand, shell=True)
sleep(5)

currentDirectory = os.getcwd()

apps = open('president_order.txt','r')
appListOrder = apps.readlines()

vtexAppLinkOrder = []

#contain changed app list
appList =  []

def appLink(appName):
    cmd = f"echo 'yes' |vtex link > output/{appName}.txt"
    subprocess.Popen(cmd, stdout= False, stderr=subprocess.DEVNULL, shell=True)


linkAppNameDict = {}

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
                os.chdir(currentDirectory + '/' + app)
                process = Process(target= appLink, args=(app))
                linkAppNameDict[app] = process.pid
                sleep(3)
        
        print('test 22', linkAppNameDict)

        while len(linkAppNameDict) == 0:
            for x in os.listdir("output"):
                with open("output"/x,'r',encoding='utf-8') as file:
                    sleep(3)
                    contents = file.read()
                    print('xxx', x)
                    # sentence = 'App linked successfully'
                    # result = contents.find(sentence)
                    # if result != -1:

           
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
