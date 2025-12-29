# To-Do List

### Music
- Make Music app compatible with Terminal via. "Music ~/Music/file.mp3"

### General APPs
- Make all apps compatible with running as another user (without leaving Desktop session). For example, if I'm logged in in the Terminal as User1, I should be able to run "Music ~/Music/file.mp3" and it should open the Music app as User1, not as Root. If I am logged in as Root, I should be able to run "Music ~/Music/file.mp3" and it should open the Music app as Root, not as User1. The same should apply to other apps, like Music, Photos, etc. In this way we can open and edit files as another user, without leaving the Desktop session, and respect the permissions of the user we are logged in as.

### Terminal
- sudo command should work properly, asking for a password for the first time and then not asking for a password until the Terminal window is closed.
- sudo -s should work properly, asking for a password for the first time and then not asking for a password until the Terminal window is closed, loging the Terminal session as root and run all commands as root.