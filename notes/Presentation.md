New
---

# Forewords
> Meister allowed this. You asked on a friday, 13/06, when he was giving a test for people who cheated on it.
- Document the process of development.

# Items
- [ ] Read about Scrum, which Sprints are part of.
- [ ] Reference "Don't make me think", "Lean startup", e "Sprint: Method used on Google, by Jake Knapp, John Zeratsky, Braden Kowitz" and possible other books, as sources.
    - [ ] Contextualize os autores dos livros, para validar o metódo de desenvolvimento usado por vocês.
- [ ] Document the type of the development process - name, like Scrum.
- [ ] Interview three people.
    - [ ] Document the stages of the interview - and how they relate to the book.
- [ ] Choose three features from feedback to implement.
- [ ] Document the experience developing it - with people dedicated to design (E.g., Victoria), user experience/writing (E.g., Tamires, Bianca), and coding (E.g., César and Herbert).

# Document
- [ ] Clickable photos for links with video - with "Interview with (designer/video-editor...)".
- [ ] Link for GitHub project - as mentioned on roots it's to be open-source.

# Roots
- We create a new open-source project.
- We validate it with people, providing them with value, for free.
- We make easier, for both programmers and specially non-programmers, to use version control - without git's learning curve.
- We learn more about subjects like Web development, Software Engineering, and Human-computer Interfaces - all are future college subjects, put to practise now.

Old
---

# Introduction/Problem
* Sometimes it's necessary to edit different designs and keep them editable—to export in different formats, for example.
* Git offers fine-grained control, ideal for programming, especially in corporate environments.
* However, for individuals and creative work, the additional complexity, lack of abstraction, and a good graphical interface do not compensate, even though these users could greatly benefit from its features.
* Since the ideal is to make version control more abstract—as it could be useful for more people besides programmers—it was important to use a cultural concept for the name, instead of something scientifically descriptive. Thus "Multiverse" emerged, as it conveys this general idea well.

# Scenario 1: Designer Working on a Logo
* Step 1 – Version 1: Black and white
    * Creation of a simple black and white version
    * Save as: logo-v1-blackandwhite.psd
* Step 2 – Version 2: Color
    * Creation of a color version
    * Keep the B&W version for comparison
    * Save as: logo-v2-color.psd
* Step 3 – Version 3: With Slogan
    * Client requests the addition of a slogan
    * Add the slogan to the color version
    * Save as: logo-v3-color-with-slogan.psd

---

* Step 1 – Version 1: Black and white
    * Creation of a simple black and white version
    * Save as: logo-v1-blackandwhite.psd
* Step 2 – Version 2: Color
    * Creation of a color version
    * Keep the B&W version for comparison
    * Save as: logo-v2-color.psd
* Step 3 – Version 3: With Slogan
    * Client requests the addition of a slogan
    * Add the slogan to the color version
    * Save as: logo-v3-color-with-slogan.psd

# Common Problem (without version control)
* Client says: “I liked the black and white version more, but with the slogan.”
* Necessary steps:
    * Open logo-v1-blackandwhite.psd
    * Copy the slogan from logo-v3-color-with-slogan.psd
    * Apply it to the B&W version
    * Save as:
    * logo-v4-blackandwhite-with-slogan.psd
* Problems:
    * Manual and time-consuming process
    * Many files and confusing names
    * Project folders become heavy

# How "Multiverse" Helps
* It works like a visual map of versions: Logo
    * ├── Version 1: B&W
    * ├── Version 2: Color
    * ├── Version 3: Color + Slogan
    * └── New Version: B&W + Slogan (created from V1 + Slogan from V3)

# Benefits

* Lighter files - faster to open, easier to edit on less powerful computers, and also easier to sync on cloud services - a problem reported by a real designer we spoke with.
* Visualize each version
* See differences between versions
* Combine elements from different versions
* Go back in time with one click
* Add notes (e.g., “Version sent to client X”)
* You can export the versions the client needs, and switch between them to make changes, without having to redo old steps, or maintain multiple files that quickly become messy, or slow and heavy if you keep all the copies in the same file.

# Future
* Coding / Refactoring
* It could also be used as an introduction to Git, to teach it—but that would be a fork or an alternative interface option, which diverges from the goal of abstracting and simplifying.
* Collaboration (via Cloud/Dropbox/Google Drive)
* We can also implement functions for collaboration on work from various fields, integrating with cloud services, or even GitHub - while keeping the interface simplified.
* * Research
* After development, we can put the product into use with real people, document the feedback, and make changes—as is common in the industry.
* This can both improve the product, fix flaws, and modify it in ways that make it more useful.