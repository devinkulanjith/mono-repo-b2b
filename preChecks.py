import json
import subprocess
import time

async def checkVersions():
    file = open('manifest.json')
    data = json.load(file)
    version = data['version']
    manifestMajor = int(version.split()[0].split('.')[0])
    name = data['name']
    vtexLs()
    time.sleep(3)
    with open('ls.txt', 'r') as file:
        lsFile = file.readlines()
        for line in lsFile:
            if name in line:
                majorls = int(line.split()[1].split('.')[0])
                if majorls > manifestMajor:
                    ret_value = False
                else:
                    ret_value = True

                return ret_value


def vtexLs():
    subprocess.Popen('vtex ls> ls.txt',stdout=True, shell=True)




       
