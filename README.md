# DxThemer
## _DevExtreme custom theme management_
Not affiliated with DevExpress in any way

## Features

- Manage one or many custom DevExtreme themes
- Reuse scss variables from the theme in your own app
- Easily update the theme file with new/changed variables

## Installation

```sh
npm i -g dx-themer
```

## Usage

### Setup
Generate a theme scheme by either running the command manually
```sh
dx-themer generate-scheme --name <your-theme-name>
```
and then getting the list of DevExtreme variables to modify by running
```sh
dx-themer list-vars
```
or by going to https://devexpress.github.io/ThemeBuilder/ and generating a theme with your modified variables using the UI.

Afterwards, if you don't like kebab-case naming or would like to modify the names of your variables to reuse inside your app's css, create a naming file with the list of variables that you would like to rename and run
```sh
dx-themer generate-scss
```
This will generate a scss file with your properly named variables along with the rest of the variables you've modified when generating the schema.

### Theme management
When you want to make any updates to the theme you can add new variables to the variables file as well as new name mapping to the naming file. Once you are done if any changes and would like to generate the theme, run
```sh
dx-themer update-theme
```
This will update your scheme with new variables as well as generate the css file for your DevExtreme theme, which you can now import into your project.

For ease of use the update command can be added to your project's package.json's scripts with all of the arguments with the input and output paths pre-populated.

For an example of use please reference the example directory of the repo.