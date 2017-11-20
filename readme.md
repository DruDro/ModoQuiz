# Gulp CHM builder
## Install HTML Help Workshop
[Download HTML Help Workshop](https://www.microsoft.com/en-us/download/details.aspx?id=21138) and install it.
## Install NodeJS
[Download the latest NodeJS version](https://nodejs.org/uk/download/) and install it. 
## Install Dependencies
Launch a **command line** tool inside the help project folder. Run:
```
npm i
```
## Start Building
```
npm start
```
or just
```
gulp
```
## File structure
### Articles
Articles are located in the *./src/articles* folder
### Assets
Assets, such as images, styles, javascript, etc. are located in the *./src/assets* folder
#### Sass
Styles are compiled from *.scss* files. Source scss files are located in the *./src/assets/sass* folder.
The main scss file, that imports component styles, vendor styles, etc. is *style.scss*. It is compiled with gulp-sass to **style.css**, which is linked to in every HTML article.
#### JavaScript
JS files **are not concatenated** to a single file. All JS files you want to include to HTML articles must be manually added to the *./src/assets/partials/[header\footer].html* - for the CHM format, or to the *./src/assets/partials/web[Header\Footer].html* - for the Web help format.
## Output
The **gulp** (gulp default) task runs **build** and **watch** tasks. Each time you save an article HTML file or an asset file, gulp compiles HTML, SASS, JS, images, as well as runs the HTML Help Workshop compiler to compile the %projectName%.chm file. 
The **dist** folder contains *Web* and *CHM* help formats. 
## File Naming
It is highly recommended to give the chm, hhc, hhk, hhp files the same name as the folder containing the whole project. Since some functionality in the gulpfile.js uses the project root directory name to call such files. 