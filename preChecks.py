import json
import subprocess
import time

async def checkVersions(commands):
    file = open('manifest.json')
    data = json.load(file)
    version = data['version']
    manifestMajor = int(version.split()[0].split('.')[0])
    name = data['name']
    vtexLs()
    time.sleep(3)
    with open('ls.txt', 'r') as f:
        ret_value = True
        lsFile = f.readlines()
        for line in lsFile:
            if name in line:
                majorls = int(line.split()[1].split('.')[0])
                if majorls > manifestMajor:
                    ret_value = False
                    return

        file.close()
        f.close()
        subprocess.Popen(commands["removeLs"],stdout=True, shell=True)
        time.sleep(2)
        return ret_value




def vtexLs():
    pro = subprocess.Popen('vtex ls> ls.txt',stdout=True, shell=True)
    pro.wait()



       
