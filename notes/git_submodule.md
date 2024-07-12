# Git Submodule Tip

Add a submodule. 
```cmd
git submodule add <repo_url> (<submodule_path>)
```
Here we go:  
```cmd
git submodule add git@github.com:inorikiskei/prisms
```
After adding successfully, **Git** will add a 
`.gitmodules` file in your working directory, 
which in turn means adding should have failed without it
in sight. 

> **Pitfall**  
> 
> After add a submodule, you don't need to add the folder
> into `.gitignore`, Git will track it for you. 
> 
> Submodule is a relatively independent repository, 
> `cd <submodule_dir>` then work there like you are in
> a new git repository.   

If the submodule get updated in the remote repository, 
you need to run `git submodule update`.

If you clone a git repository but its submodules are not
fully cloned, you need to run`git submodule update --init --recursive`
to complete the clone.  
