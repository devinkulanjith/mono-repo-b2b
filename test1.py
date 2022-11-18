
# print("this is testing")
import os
import subprocess
import git

currentDirectory = os.getcwd()
repo = git.Repo(currentDirectory) 
commits_list = list(repo.iter_commits())

changed_files = []


with open('commits.txt','r') as f:
    latestLinkComment = f.readline()
    f.close()

if not latestLinkComment:
    latestLinkComment = commits_list[1]


for x in commits_list[0].diff("d72fe09c2a9223ecb2fdcaa41f9b95460dd61190"):
    if x.a_blob:
        if x.a_blob.path not in changed_files:
            changed_files.append(x.a_blob.path)

    if x.b_blob:
        if x.b_blob is not None and x.b_blob.path not in changed_files:
            changed_files.append(x.b_blob.path)
        

print("chnaged files", changed_files)

# with open("commits.txt","w") as f:
#     f.write(str(commits_list[0]))
#     f.close()

# with open('commits.txt','r') as f:
#     latestLinkComment = f.readlines()
#     f.close())

# with open('commits.txt','w') as f:
#     f.seek(0)
#     f.write(str(commits_list[0]))
#     f.close()
   