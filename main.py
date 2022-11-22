import subprocess
import os
from time import sleep
from multiprocessing import Process
from signal import SIGKILL
from os import kill
import re
import yaml
from termcolor import colored

branchName = os.getenv('BRANCH_NAME')
modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)

linkCommand = f'echo "yes" | vtex use {modifiedBranchName}'
subprocess.Popen( linkCommand, shell=True)

# Wait 5s after creating the workspace
sleep(5)

currentDirectory = os.getcwd()

# get the order of linking apps
apps = open('president_order.txt','r')
appListOrder = apps.readlines()

# opened sub processes for linking apps
linkAppNameDict = {}

# processes list to read vtex link output
processorsForLink = []

# Changed apps
appList =  []


### Read vtex link output and terminate sub-processes
def watchLinkAction(appName):
            
    # Go to working directory
    os.chdir(currentDirectory + "/" + appName)

    # print("+++ Ready to read log file in ", currentDirectory + "/" + appName)
    
    var = True
    sleep(3)
    # while condition met
    while var:
        with open('output.txt', 'r', encoding='utf-8') as file:

            # Read every 30 seconds
            sleep(30)

            contents = file.read()

            # Sentence to match inside the content
            LINK_SUCCESSFUL_SENTENCE = 'App linked successfully'
            
            result = contents.find(LINK_SUCCESSFUL_SENTENCE)
        
        
            # If log file contains link success message
            if result != -1:
                
                print("+++ Matched result for: ", appName, " result: ", result)
                print("+++ Content or app: ", appName, " ===> ", contents)
                var = False
                
                print("+++ App link successful", appName)
                
                try:
                    print("+++ Before killing process: ", linkAppNameDict[appName].pid)
                    # Kill file linking subprocess
                    linkAppNameDict[appName].kill()

                    print("+++ After killing process: ", linkAppNameDict[appName].pid)

                    # Remove output.txt file
                    subprocess.Popen("rm output.txt", shell=True)
                    print("+++ Output file removed ")
                except Exception as e:
                    print("--- something went wrong", e)



#function for chunk the links app array

def chunker(seq, size):
    return (seq[pos:pos + size] for pos in range(0, len(seq), size))

###  Get all changed apps and order them
with open('changeList.txt', 'r', encoding='utf-8') as file:
    contents = file.read()
    for app in appListOrder:
        appName = app.replace('\n','')
        result = contents.find(appName)
        if result != -1:
            appList.append(appName)

# Remove changed files list
p2 = subprocess.Popen("rm changeList.txt", stdout=False, shell=True)
p2.wait()

print('+++ Apps with changes: ',appList)

# Get apps linking order
with open('order.yml', 'r') as file:
    valuesYaml = yaml.load(file, Loader=yaml.FullLoader)
    
    for key in valuesYaml:
        sleep(3)
        print(f"+++ Starinting App link in {key} level")
        sleep(5)
        # If changed apps count > 0
        if len(appList) != 0:
            for group in chunker(valuesYaml[key], 2):
                linkAppNameDict.clear()
                for app in group:
                    if app in appList:

                        # go to current directory
                        os.chdir(currentDirectory + '/' + app)
                        
                        print("+++ Working directory ", currentDirectory + '/' + app)
                        
                        # Open sub process to link an app and write output into a log file
                        pro = subprocess.Popen("echo 'yes' |vtex link > output.txt",stdout=True, shell=True)

                        sleep(3)
                        print("+++ Process started: ", pro.pid)

                        # Keep subprocess for future use
                        linkAppNameDict[app] = pro

                        sleep(3)

                print("+++ All sub processes: ", linkAppNameDict.keys())

                # Create new processes to listen vtex link output logs
                for app in group:
                    if app in appList:

                        # create a new process
                        linkProcess = Process(target= watchLinkAction, args=(app,))
                        linkProcess.start()
                        
                        sleep(3)
                        
                        # Keep opened processes for future use
                        processorsForLink.append(linkProcess)

                # Join previously opened processes
                for linkSubProcess in processorsForLink:
                    print("+++ Joining the process ", linkSubProcess.pid)
                    linkSubProcess.join()

print (u"\u001b[33;1m +++ Done linking \u001b[0m")         


