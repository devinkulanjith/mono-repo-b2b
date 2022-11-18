
# print("this is testing")
import os
import git

currentDirectory = os.getcwd()
repo = git.Repo(currentDirectory) 
commits_list = list(repo.iter_commits())

# changed_files = []

# for x in commits_list[0].diff("3893845c79ab8127ec49c699f56c8b0aa1a6496a"):
#     if x.a_blob.path not in changed_files:
#         changed_files.append(x.a_blob.path)
        
#     if x.b_blob is not None and x.b_blob.path not in changed_files:
#         changed_files.append(x.b_blob.path)
        


# with open("commits.txt","w") as f:
#     f.write(str(commits_list[0]))
#     f.close()

with open('commits.txt','r') as f:
    latestLinkComment = f.readlines()
    f.close()

print (latestLinkComment)