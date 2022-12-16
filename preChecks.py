import json
import subprocess

def checkVersions():
    file = open('manifest.json')
    data = json.load(file)
    version = data['version']
    print('versions', version)


def vtexLs():
    subprocess.Popen('vtex ls> ls.json',stdout=True, shell=True)



with open('ls.txt', 'r') as file:
    tt = file.readlines()
    for x in tt:
        if 'cloudab2b.dealer-map' in x:
            print('yes i do found')
            print('major',x.split()[1].split('.')[0])
       
