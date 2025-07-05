# Components
- [x] Button 1 (Main)
- [x] Button 2 (Secondary)
- [x] Dialog
- [x] ...
- [x] Confirmations
    - [x] Saved successfully
    - [x] Deleted successfully
    - [x] Feature unavailable
- [x] Avatar
- [x] Dropdown menu
## Icons
- [x] Back Arrow
- [x] Delete
- [x] Edit
- [x] History

# Video Editor Tool
* Video screen
* Load audio
    * Windows File picker (list)
        * File 1 takes you somewhere
        * File 2 takes you somewhere else
    * Windows File picker (select file) (this may be but a component state)
    * Button to confirm / change screen
        * Changes the video effect 
* 

# Design Tool
* Design screen
* Load background image
    * Windows File picker (list)
        * File 1 takes you somewhere
        * File 2 takes you somewhere else
    * Windows File picker (select file) (this may be but a component state)
    * Button to confirm / change screen
        * Changes background-fill of a component of a design

# Welcome Screen

> This should explain the overall idea.

* Name, Icon and description
* Repository CRUD
    * Open Project
        * Context message: Select a folder to manager versions and collaboration
        * Checks if existing, creates it on the folder otherwise
    * Create New Project
        * Creates new repository
    * Recent Projects
        * Shows recent repositories

# Repository

> Commit and Branches should have other names on interface - and tips for the users, on giving them descriptive names.

- Project Screen (Breadcrumb from start to project)
	- File-tree
	    - Read files on directory (which git itself manages, events such as updates)
	    - ~~Select them for commit~~ Paced for now, but the files should still be listed
	- Commit-tree (Saves / Checkpoints)
		- Tip: This are like checkpoints to your work, backups to states you can go back to.
	    - Create Commit
	    - Read existing commits
	    - Update UI (no UI for this feature)
	    - Delete Commit
	- Versions (Branches rename)
	    - Create Branch
	    - Read/list existing Branches
	    - Update UI (no UI for this feature)
	    - Delete Branch
	- Members (Just branches, rebranded simpler)
		- _Description of how members work_
		- Add new member (Creates Branch)
			- Warn their version will spring from current
		- Read/List existing Users
		- Update UI (no UI for this feature)
		- Delete Members