import json
import subprocess
import time

async def checkVersions():
    file = open('manifest.json')
    data = json.load(file)
    version = data['version']
    manifestMajor = int(version.split()[1].split('.')[0])
    name = data['name']
    print('versions', version)
    vtexLs()
    time.sleep(3)
    with open('ls.txt', 'r') as file:
        lsFile = file.readlines()
        for line in lsFile:
            if name in line:
                majorls = int(line.split()[1].split('.')[0])
                if majorls > manifestMajor:
                    return False
                else:
                    return True

def vtexLs():
    subprocess.Popen('vtex ls> ls.txt',stdout=True, shell=True)




       
