
print("this is testing")
import os
import git

currentDirectory = os.getcwd()
repo = git.Repo(currentDirectory) 
commits_list = list(repo.iter_commits())
print ("First commit: ", commits_list[0])

changed_files = []

for x in commits_list[0].diff(commits_list[1]):
    if x.a_blob.path not in changed_files:
        changed_files.append(x.a_blob.path)
        
    if x.b_blob is not None and x.b_blob.path not in changed_files:
        changed_files.append(x.b_blob.path)
        
print (changed_files)