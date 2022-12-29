import subprocess
import os
from time import sleep
from multiprocess import Process
from os import kill
import re
import yaml
from preChecks import *
import asyncio
import platform

def systemSelector():
    system = platform.uname().system
    nonWindowsCommands = {
        "removeOutput": "rm output.txt" ,
        "removeChangeList": "rm changeList.txt",
        "removeLs": "rm ls.txt",
        "slash": "/",
    }
    windowsCommands = {
        "removeOutput": "del /f output.txt" ,
        "removeChangeList": "del /f changeList.txt",
        "removeLs": "del /f ls.txt",
        "slash": "\\"
    }

    if system == 'Windows':
        return windowsCommands
    else:
        return nonWindowsCommands


### Read vtex link output and terminate sub-processes
def watchLinkAction(appName, currentDirectory, linkAppNameDict, commands):
    # Go to working directory
    os.chdir(currentDirectory + commands["slash"] + appName)

    print("+++ Ready to read log file in ", currentDirectory + commands["slash"] + appName)
    
    var = True
    sleep(3)
    # while condition met
    while var:
        try:
            with open('output.txt', 'r', encoding='utf-8') as file:

                # Read every 30 seconds
                sleep(30)

                contents = file.read()

                # Sentence to match inside the content
                LINK_SUCCESSFUL_SENTENCE = 'App linked successfully'
                
                result = contents.find(LINK_SUCCESSFUL_SENTENCE)
            
            
                # If log file contains link success message
                if result != -1:
                    file.close()
                    sleep(2)
                    print (f"\u001b[33;1m +++ Matched result for:  {appName} result: {result}\u001b[0m")
                    var = False
                    
                    print (f"\u001b[33;1m +++ App link successful {appName} \u001b[0m")
                    
                    try:
                        print (f"\u001b[33;1m +++ App will be killed {appName} \u001b[0m")
                        processPid = linkAppNameDict[appName]
                        if platform.uname().system == 'Windows':
                            killPro = subprocess.Popen(f"taskkill /PID {processPid.pid} /F")
                            killPro.wait()

                        else :
                            linkAppNameDict[appName].kill()
                        
                        removeProcess= subprocess.Popen(commands["removeOutput"], stdout=True, shell=True)
                        removeProcess.wait()
                        print ("\u001b[33;1m +++ output file removed \u001b[0m")
                    except Exception as e:
                        print ("\u001b[33;1m --- something went wrong \u001b[32m", e)
        except Exception as e:
            print('exception has been occured', e)
            linkAppNameDict[appName].kill()


#function for chunk the links app array

def chunker(seq, size):
    return (seq[pos:pos + size] for pos in range(0, len(seq), size))


async def main():
    branchName = os.getenv('BRANCH_NAME')

    if branchName:
        modifiedBranchName = re.sub('[^a-zA-Z \n\.]', '', branchName)
    else:
        branchNameProcess = subprocess.Popen('git branch --show-current',stdout=subprocess.PIPE, shell=True)
        branchNameProcess.wait()
        branch = re.sub('[^a-zA-Z \n\.]', '', str(branchNameProcess.communicate()[0]).split("'")[1])
        modifiedBranchName = branch[:-1]


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
    pro = subprocess.Popen("git diff --name-only master > changeList.txt", stdout= True, shell=True)
    pro.wait()

    commands = systemSelector()
    ###  Get all changed apps and order them
    with open('changeList.txt', 'r', encoding='utf-8') as file:
        contents = file.read()
        for app in appListOrder:
            appName = app.replace('\n','')
            result = contents.find(appName)
            if result != -1:
                appList.append(appName)

    # Remove changed files list
    p2 = subprocess.Popen(commands["removeChangeList"], stdout=False, shell=True)
    p2.wait()

    print('+++ Apps with changes: ',appList)

    # Get apps linking order
    with open('order.yml', 'r') as file:
        valuesYaml = yaml.load(file, Loader=yaml.FullLoader)
        
        for key in valuesYaml:
            sleep(3)
            print (f"\u001b[33;1m +++ Starinting App link in {key} level \u001b[0m") 
            sleep(5)
            # If changed apps count > 0
            if len(appList) != 0:
                for group in chunker(valuesYaml[key], 2):
                    linkAppNameDict.clear()
                    for app in group:
                        if app in appList:

                            # go to current directory
                            os.chdir(currentDirectory + commands["slash"] + app)
                            
                            print("+++ Working directory ", currentDirectory + commands["slash"] + app)
                            preCheck = await checkVersions(commands)
                            outputFilePath = currentDirectory + commands["slash"] + app + commands["slash"] + "output.txt"

                            if os.path.exists(outputFilePath):
                                os.remove("output.txt")
                                sleep(2)

                            if preCheck:
                    
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
                            linkProcess = Process(target= watchLinkAction, args=(app, currentDirectory, linkAppNameDict, commands,))
                            linkProcess.start()
                            
                            sleep(3)
                            
                            # Keep opened processes for future use
                            processorsForLink.append(linkProcess)

                    # Join previously opened processes
                    for linkSubProcess in processorsForLink:
                        print("+++ Joining the process ", linkSubProcess.pid)
                        linkSubProcess.join()

    print (u"\u001b[33;1m +++ Done linking \u001b[0m")      


if __name__ == '__main__':
    asyncio.run(main())

