# Odin Recipes

This is just a basic project to practice basic html but this project is a little more complicated than that. What's more complicated isn't how the website is presented but how it was built. Since I had never used HTML web components I decided this would be a good opportunity to learn. The component is called recipe viewer and its just one page that can be dynamically filled with information about certain recipes. Whats also different about this app is that it uses an external
API to query the info on the recipes. I initially was going to setup a simple backend for the sole purpose of being able to call this API because storing secret keys on the client is a massive security issue. To my surprise the API does not require authentication to query their database so I skipped the backend altogether. If you see this before the website is styled its because the styling aspect comes later in the course. I will be back to make it pretty.

## How it works

First I have a script that querys the API and stores the response in localStorage since I don't have a database to work with and store it in a cache for a certain amount of time. On the home page I read the recipes out of localStorage and generate links with a URL parameter that corresponds to the index of the recipe in the localStorage array. When its clicked on it renders the recipe-viewer component and from there the web component creates all the necessary elements for the page to exist. I am pretty sure 1 web components for an entire page is not necessarily the optimal use case but I wanted to establish some form of familiarity with them.

## Other Features

The recipes automatically refresh after 10 minutes and both the recipe quantity and the refresh interval can be changed in the config.js file. I am working on being able to change these directly from the website.

## How to use

Download the project using git clone

`git clone https://github.com/dylancam90/00-odin-recipes`

You can open the index.html file direcly in the browser.

This is a static site and there is nothing to build (for now). I plan to host this at some point on Github pages
